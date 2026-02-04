# OWASP Top 10 安全漏洞

OWASP (Open Web Application Security Project) Top 10 是对 Web 应用程序最关键的安全风险清单。本文档提供每个漏洞的说明、示例和防护措施。

## 漏洞概述

```text
排名    风险级别    漏洞名称
─────────────────────────────────────────────
 1        🔴 Critical  已知漏洞利用
 2        🔴 Critical  加密失败
 3        🔴 Critical  注入
 4        🔴 Critical  不安全设计
 5        🔴 Critical  安全配置错误
 6        🟠 High      易受攻击和陈旧组件
 7        🟠 High      身份识别和认证失败
 8        🟠 High      软件和数据完整性失败
 9        🟠 High      安全日志和监控失败
10        🟠 High      服务端请求伪造 (SSRF)
```

---

## 1. 已知漏洞利用 (Broken Access Control)

### 1.1 漏洞详细说明

应用程序在实施访问控制时未能正确限制用户对未经授权资源或功能的访问。

### 1.2 漏洞攻击示例

```typescript
// ❌ 错误示例：用户可以访问其他用户的数据
class UserController {
  async getUserProfile(userId: string): Promise<User> {
    // 直接根据 ID 查询用户，没有验证权限
    const user = await database.query(`SELECT * FROM users WHERE id = ${userId}`);
    return user;
  }
}

// 攻击场景
// 用户 A 请求: GET /api/users/user-b-id
// 用户 A 成功获取用户 B 的数据
```

### 1.3 防护措施

```typescript
// ✅ 正确示例：验证用户权限
class UserController {
  async getUserProfile(userId: string, currentUser: AuthenticatedUser): Promise<User> {
    // 验证当前用户是否有权访问该用户资料
    if (currentUser.id !== userId && !currentUser.isAdmin) {
      throw new ForbiddenError('Access denied');
    }

    const user = await database.query(`SELECT * FROM users WHERE id = ${userId}`);
    return user;
  }
}

// 使用 RBAC (Role-Based Access Control)
interface UserPermissions {
  canAccessResource(resource: string, action: string): boolean;
}

class PermissionChecker implements UserPermissions {
  canAccessResource(resource: string, action: string): boolean {
    const userRoles = this.getCurrentUserRoles();

    for (const role of userRoles) {
      if (role.permissions[resource]?.includes(action)) {
        return true;
      }
    }

    return false;
  }
}
```

---

## 2. 加密失败 (Cryptographic Failures)

### 2.1 漏洞详细说明

应用程序未能正确保护敏感数据，可能被攻击者读取或篡改。

### 2.2 漏洞攻击示例

```typescript
// ❌ 错误示例：使用弱加密算法
class CryptoService {
  encryptPassword(password: string): string {
    // 使用 MD5（已被破解）
    return crypto.createHash('md5').update(password).digest('hex');
  }

  encryptData(data: string): string {
    // 使用不安全的 ECB 模式
    const cipher = crypto.createCipheriv('aes-128-ecb', 'secret-key');
    return cipher.update(data).final('hex');
  }
}
```

### 2.3 防护措施

```typescript
// ✅ 正确示例：使用强加密算法
import * as crypto from 'crypto';

class SecureCryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly saltLength = 16;

  encryptData(data: string, encryptionKey: string): string {
    // 生成随机 IV 和 Salt
    const iv = crypto.randomBytes(this.ivLength);
    const salt = crypto.randomBytes(this.saltLength);

    // 使用 PBKDF2 派生密钥
    const key = crypto.pbkdf2Sync(
      encryptionKey,
      salt,
      100000,
      this.keyLength,
      'sha256'
    );

    // 使用 GCM 模式（认证加密）
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // 返回 IV、Salt 和加密数据
    return `${iv.toString('hex')}:${salt.toString('hex')}:${encrypted}`;
  }

  decryptData(encryptedData: string, encryptionKey: string): string {
    const [ivHex, saltHex, encrypted] = encryptedData.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const salt = Buffer.from(saltHex, 'hex');

    // 使用相同的 Salt 派生密钥
    const key = crypto.pbkdf2Sync(
      encryptionKey,
      salt,
      100000,
      this.keyLength,
      'sha256'
    );

    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  hashPassword(password: string): string {
    // 使用 bcrypt（加盐哈希）
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
```

---

## 3. 注入 (Injection)

### 3.1 漏洞详细说明

应用程序未正确验证、净化或编码用户输入，导致攻击者可以注入恶意代码。

### 3.2 SQL 注入示例

```typescript
// ❌ 错误示例：直接拼接 SQL
class UserController {
  async getUserById(userId: string): Promise<User> {
    // SQL 注入漏洞
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return await database.query(query);
  }
}

// 攻击请求
// GET /api/users/1 OR 1=1
// 执行的 SQL: SELECT * FROM users WHERE id = 1 OR 1=1
// 结果：返回所有用户数据
```

### 3.3 防护措施

```typescript
// ✅ 正确示例：使用参数化查询
import { Pool } from 'pg';

class SecureUserController {
  private pool: Pool;

  async getUserById(userId: string): Promise<User> {
    // 使用参数化查询，防止 SQL 注入
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows[0];
  }
}
```

### 3.4 XSS (Cross-Site Scripting) 防护

```typescript
// ❌ 错误示例：直接输出用户输入
class CommentController {
  async postComment(req: HttpRequest, res: HttpResponse): Promise<void> {
    const comment = req.body.comment;
    // XSS 漏洞：恶意脚本会被执行
    res.send(`<div>${comment}</div>`);
  }
}

// ✅ 正确示例：转义和验证输入
import * as xss from 'xss';

class SecureCommentController {
  async postComment(req: HttpRequest, res: HttpResponse): Promise<void> {
    const comment = req.body.comment;

    // 1. 输入验证
    if (comment.length > 500) {
      return res.status(400).json({ error: 'Comment too long' });
    }

    // 2. 输出前转义
    const sanitizedComment = xss(comment);

    // 3. 使用 CSP (Content Security Policy)
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.send(`<div>${sanitizedComment}</div>`);
  }
}
```

---

## 4. 不安全设计 (Insecure Design)

### 4.1 漏洞详细说明

应用程序设计存在安全缺陷，可能导致安全漏洞或数据泄露。

### 4.2 漏洞攻击示例

```typescript
// ❌ 错误示例：在 URL 中暴露敏感信息
class PasswordResetController {
  async sendResetEmail(email: string): Promise<void> {
    // 在 URL 中包含敏感的 token
    const resetToken = this.generateToken();
    const resetUrl = `https://example.com/reset?token=${resetToken}`;

    await this.emailService.send(email, 'Reset your password', resetUrl);
  }
}

// 攻击场景：如果用户转发了重置邮件，攻击者可以劫持 token
```

### 4.3 防护措施

```typescript
// ✅ 正确示例：使用短期有效的 token
class SecurePasswordResetController {
  async sendResetEmail(email: string): Promise<void> {
    // 1. 生成短期 token（15分钟有效）
    const resetToken = this.generateToken({ expiresIn: '15m' });

    // 2. 存储到数据库，而不是在 URL 中
    await this.database.insert('password_resets', {
      email,
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 *60* 1000),
    });

    // 3. 发送包含 token ID 的链接（不包含 token 本身）
    const resetUrl = `https://example.com/reset?id=${resetToken.id}`;
    await this.emailService.send(email, 'Reset your password', resetUrl);
  }

  async resetPassword(tokenId: string, newPassword: string): Promise<void> {
    // 4. 验证 token 是否有效且未过期
    const reset = await this.database.query(
      'SELECT * FROM password`resets WHERE id = $1 AND expires`at > NOW()',
      [tokenId]
    );

    if (!reset.rows[0]) {
      throw new Error('Invalid or expired token');
    }

    // 5. 更新密码
    const hashedPassword = await this.hashPassword(newPassword);
    await this.database.update('users', { password: hashedPassword }, { email: reset.email });

    // 6. 删除已使用的 token
    await this.database.delete('password_resets', { id: tokenId });
  }
}
```

---

## 5. 安全配置错误 (Security Misconfiguration)

### 5.1 漏洞详细说明

应用程序的安全配置不完善或不当配置。

### 5.2 漏洞攻击示例

```typescript
// ❌ 错误示例：生产环境显示详细错误
class ErrorHandler {
  handleError(error: Error): void {
    // 暴露敏感信息
    console.error(error);
    return {
      message: error.message,
      stack: error.stack,  // 生产环境不应该返回堆栈
      database: error.databaseUrl,  // 不应该暴露数据库连接
    };
  }
}
```

### 5.3 防护措施

```typescript
// ✅ 正确示例：根据环境区分错误处理
class SecureErrorHandler {
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  handleError(error: Error): void {
    // 开发环境：显示详细信息
    if (this.isDevelopment) {
      console.error(error);
      return {
        message: error.message,
        stack: error.stack,
        details: error.details,
      };
    }

    // 生产环境：只返回通用错误信息
    console.error(`Error: ${error.message}`, error); // 记录详细日志到服务器

    return {
      message: this.getSafeMessage(error),
      errorId: this.logError(error),
    };
  }

  private getSafeMessage(error: Error): string {
    // 不要暴露内部实现细节
    const safeMessages = {
      'ValidationError': 'Invalid input data',
      'AuthenticationError': 'Authentication failed',
      'DatabaseError': 'An error occurred',
    };
    return safeMessages[error.constructor.name] || 'An error occurred';
  }
}
```

---

## 6. 易受攻击和陈旧组件 (Vulnerable and Outdated Components)

### 6.1 漏洞详细说明

应用程序使用了已知漏洞的第三方库或组件。

### 6.2 漏洞攻击示例

```json
// ❌ 错误示例：使用过时的依赖
{
  "dependencies": {
    "express": "^4.16.0",  // 过时版本，存在已知漏洞
    "lodash": "^4.0.0",    // 存在原型污染漏洞
    "mongoose": "^5.0.0"    // 可能存在已知漏洞
  }
}
```

### 6.3 防护措施

```typescript
// ✅ 正确示例：定期更新依赖
package.json
{
  "dependencies": {
    "express": "^4.19.0",      // 使用最新稳定版本
    "lodash": "^4.17.21",     // 修复了原型污染漏洞
    "helmet": "^7.0.0"        // 添加安全中间件
  },
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "check-updates": "npm outdated",
    "update-deps": "npm update"
  }
}

// 使用安全工具
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

class SecureApp {
  constructor() {
    // 1. 使用 Helmet 设置安全 HTTP 头
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "https://trusted.cdn.com"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "https:", "data:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }));

    // 2. 使用限流防止暴力攻击
    this.app.use(rateLimit({
      windowMs: 15 *60* 1000, // 15 分钟
      max: 100,
      message: 'Too many requests, please try again later',
    }));
  }
}
```

---

## 安全最佳实践总结

### ✅ 通用防护措施

1. **输入验证和净化**
   - 始终验证和净化用户输入
   - 使用参数化查询（防止 SQL 注入）
   - 输出前转义（防止 XSS）
   - 限制输入长度

2. **身份认证和授权**
   - 实现强认证机制（JWT、OAuth2）
   - 使用 RBAC 控制访问
   - 实现多因素认证（MFA）
   - 定期更新会话 token

3. **加密和数据保护**
   - 使用强加密算法（AES-256-GCM）
   - 哈希密码（bcrypt、Argon2）
   - 加密敏感数据（密码、信用卡）
   - 使用 HTTPS 保护传输

4. **错误处理**
   - 生产环境不暴露详细错误信息
   - 使用通用错误消息
   - 记录详细错误到安全日志
   - 实现错误追踪

5. **依赖管理**
   - 定期更新依赖
   - 使用 `npm audit` 检查漏洞
   - 使用安全中间件（Helmet）
   - 移除不使用的依赖

### 🔒 安全检查清单

在部署应用前检查：

- [ ] 所有用户输入都已验证和净化
- [ ] 使用参数化查询防止 SQL 注入
- [ ] 输出前转义用户输入防止 XSS
- [ ] 实现强密码策略（bcrypt 哈希）
- [ ] 使用 HTTPS 保护所有端点
- [ ] 实现基于角色的访问控制（RBAC）
- [ ] 配置适当的 CORS 策略
- [ ] 设置安全的 HTTP 头（CSP、HSTS）
- [ ] 实现速率限制
- [ ] 运行 `npm audit` 检查依赖漏洞
- [ ] 生产环境不暴露错误堆栈
- [ ] 实现安全日志记录
- [ ] 定期更新依赖到最新安全版本

---

## 相关资源

- [OWASP Top 10 官方文档](https://owasp.org/www-project-top-ten)
- [安全最佳实践](./authentication.md)
- [编码最佳实践](../best-practices/coding.md)
