# 身份认证与授权

本文档说明在 Web 应用中实现安全的身份认证和授权的最佳实践。

## 核心概念

### 1. 认证 (Authentication)

**认证**是验证用户身份的过程。

**认证方式**：

- 用户名/密码
- JWT (JSON Web Token)
- OAuth 2.0 / OpenID Connect
- SAML (Security Assertion Markup Language)
- API Key
- 多因素认证 (MFA)

### 2. 授权 (Authorization)

**授权**是确定已认证用户是否有权限执行某个操作的过程。

**授权模型**：

- RBAC (Role-Based Access Control) - 基于角色的访问控制
- ABAC (Attribute-Based Access Control) - 基于属性的访问控制
- ACL (Access Control List) - 访问控制列表

---

## JWT (JSON Web Token) 认证

### JWT 结构

```typescript
// JWT Token 结构
interface JWTPayload {
  iss: string;     // Issuer (签发者)
  sub: string;     // Subject (主题/用户ID)
  aud: string;     // Audience (接收者)
  exp: number;      // Expiration (过期时间)
  iat: number;      // Issued At (签发时间)
  jti?: string;     // JWT ID (唯一标识)
  // 自定义声明
  userId: string;
  email: string;
  roles: string[];
}

// 示例 Token
{
  "iss": "https://example.com",
  "sub": "user-123",
  "aud": "https://api.example.com",
  "exp": 1703976400,
  "iat": 1703960000,
  "jti": "token-unique-id-123",
  "userId": "user-123",
  "email": "user@example.com",
  "roles": ["user", "admin"]
}
```

### JWT 签发服务

```typescript
import * as jwt from 'jsonwebtoken';

class AuthService {
  private readonly secretKey = process.env.JWT_SECRET || 'your-secret-key';
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '7d';

  // 生成访问 Token（短期）
  generateAccessToken(userId: string, email: string, roles: string[]): string {
    const payload: JWTPayload = {
      iss: 'https://example.com',
      sub: userId,
      aud: 'https://api.example.com',
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 分钟
      iat: Math.floor(Date.now() / 1000),
      jti: this.generateJTI(),
      userId,
      email,
      roles,
    };

    return jwt.sign(payload, this.secretKey, { algorithm: 'HS256' });
  }

  // 生成刷新 Token（长期）
  generateRefreshToken(userId: string): string {
    const payload: JWTPayload = {
      iss: 'https://example.com',
      sub: userId,
      aud: 'https://api.example.com',
      exp: Math.floor(Date.now() / 1000) + (7 *24*60* 60), // 7 天
      iat: Math.floor(Date.now() / 1000),
      jti: this.generateJTI(),
      userId,
      tokenType: 'refresh',
    };

    return jwt.sign(payload, this.secretKey, { algorithm: 'HS256' });
  }

  // 验证 Token
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.secretKey, { algorithms: ['HS256'] }) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // 生成唯一 JTI
  private generateJTI(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### JWT 中间件

```typescript
import { Request, Response, NextFunction } from 'express';

// JWT 认证中间件
function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // 1. 从请求头获取 Token
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // 2. 提取 Token（格式：Bearer <token>）
  const token = authHeader.split(' ')[1];

  // 3. 验证 Token
  const authService = new AuthService();
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // 4. 将用户信息附加到请求对象
  req.user = {
    id: decoded.userId,
    email: decoded.email,
    roles: decoded.roles,
  };

  // 5. 继续处理请求
  next();
}

// 使用示例
app.get('/api/profile', jwtAuthMiddleware, (req, res) => {
  // 此时 req.user 包含用户信息
  res.json({
    userId: req.user.id,
    email: req.user.email,
    roles: req.user.roles,
  });
});
```

---

## OAuth 2.0 认证

### OAuth 2.0 流程

```text

用户              第三方服务              应用
  │                   │                 │
  ├─ 1. 点击授权 ─►│                 │
  │                   │                 │
  │                   ├─ 2. 授权页面 ◄─┐
  │                   │                 │
  │                   ├─ 3. 用户同意 ◄───┼── 4. 授权码
  │                   │                 │        │
  │                   └─────────────────┘        │
  │                                               │
  │                     ┌─────────────────────┐     │
  │                     │ 5. 应用接收授权码 │     │
  │                     │                 │     │
  │                     │ 6. 交换 Access Token │◄───┼── 7. 返回 Access Token
  │                     │                 │     │
  │                     │                 │     │
  │                     └─────────────────────┘     │
  │                                               │
  │                    ┌─────────────────────┐     │
  │                    │ 8. 应用使用 Access Token │◄───┐
  │                    │                 │        │
  │                    └─────────────────────┘        │
  │                                               │
  ▼                                               ▼
  用户可以访问受保护的资源

```

### OAuth 2.0 实现

```typescript
// OAuth 配置
interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
  authUri: string;
  tokenUri: string;
}

class OAuthService {
  constructor(private config: OAuthConfig) {}

  // 步骤1：生成授权 URL
  getAuthorizationURL(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      response_type: 'code',
      state: state,
    });

    return `${this.config.authUri}?${params.toString()}`;
  }

  // 步骤2：用授权码交换 Access Token
  async exchangeCodeForToken(authorizationCode: string): Promise<TokenResponse> {
    const response = await fetch(this.config.tokenUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code: authorizationCode,
        redirect_uri: this.config.redirectUri,
        grant`type: 'authorization`code',
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code');
    }

    return await response.json();
  }

  // 步骤3：使用 Refresh Token 获取新的 Access Token
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await fetch(this.config.tokenUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: refreshToken,
        grant`type: 'refresh`token',
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    return await response.json();
  }
}

// 使用示例
const oauthService = new OAuthService({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: 'https://example.com/auth/github/callback',
  scope: 'user:email',
  authUri: 'https://github.com/login/oauth/authorize',
  tokenUri: 'https://github.com/login/oauth/access_token',
});

// 路由1：重定向到 OAuth 提供商
app.get('/auth/github', (req, res) => {
  const state = Math.random().toString(36).substr(2, 9);
  const authUrl = oauthService.getAuthorizationURL(state);
  res.redirect(authUrl);
});

// 路由2：OAuth 回调处理
app.get('/auth/github/callback', async (req, res) => {
  const { code, state } = req.query;

  // 验证 state（防止 CSRF）
  const savedState = req.session.oauthState;
  if (state !== savedState) {
    return res.status(400).json({ error: 'Invalid state' });
  }

  try {
    // 交换授权码
    const tokenResponse = await oauthService.exchangeCodeForToken(code);

    // 获取用户信息
    const userInfo = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`,
      },
    });

    const user = await userInfo.json();

    // 创建或更新本地用户
    const localUser = await upsertUser({
      provider: 'github',
      providerId: user.id.toString(),
      email: user.email,
      name: user.name,
    });

    // 生成 JWT
    const authService = new AuthService();
    const accessToken = authService.generateAccessToken(
      localUser.id,
      localUser.email,
      ['user']
    );
    const refreshToken = authService.generateRefreshToken(localUser.id);

    // 返回 Token
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: localUser.id,
        email: localUser.email,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});
```

---

## 基于角色的访问控制 (RBAC)

### RBAC 模型

```typescript
// 角色定义
enum Role {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest',
}

// 权限定义
enum Permission {
  // 用户管理
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // 订单管理
  ORDER_CREATE = 'order:create',
  ORDER_READ = 'order:read',
  ORDER_UPDATE = 'order:update',
  ORDER_DELETE = 'order:delete',

  // 产品管理
  PRODUCT_CREATE = 'product:create',
  PRODUCT_READ = 'product:read',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
}

// 角色到权限的映射
const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.ORDER_CREATE,
    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
    Permission.ORDER_DELETE,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_READ,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_DELETE,
  ],
  [Role.MODERATOR]: [
    Permission.ORDER_CREATE,
    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_READ,
    Permission.PRODUCT_UPDATE,
  ],
  [Role.USER]: [
    Permission.ORDER_CREATE,
    Permission.ORDER_READ,
    Permission.PRODUCT_READ,
  ],
  [Role.GUEST]: [
    Permission.PRODUCT_READ,
  ],
};
```

### RBAC 实现

```typescript
class RBACService {
  // 获取角色的所有权限
  getPermissionsByRole(role: Role): Permission[] {
    return rolePermissions[role] || [];
  }

  // 检查用户是否拥有某个权限
  hasPermission(userRoles: Role[], permission: Permission): boolean {
    for (const role of userRoles) {
      const permissions = this.getPermissionsByRole(role);
      if (permissions.includes(permission)) {
        return true;
      }
    }
    return false;
  }

  // 检查用户是否拥有所有指定权限
  hasAllPermissions(userRoles: Role[], permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRoles, permission));
  }

  // 检查用户是否拥有任意一个权限
  hasAnyPermission(userRoles: Role[], permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRoles, permission));
  }
}
```

### RBAC 中间件

```typescript
// 检查单个权限的中间件
function requirePermission(permission: Permission) {
  return (req: any, res: any, next: any) => {
    const userRoles = req.user?.roles || [];

    const rbacService = new RBACService();
    if (!rbacService.hasPermission(userRoles, permission)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Permission ${permission} required`,
      });
    }

    next();
  };
}

// 检查所有权限的中间件
function requireAllPermissions(permissions: Permission[]) {
  return (req: any, res: any, next: any) => {
    const userRoles = req.user?.roles || [];

    const rbacService = new RBACService();
    if (!rbacService.hasAllPermissions(userRoles, permissions)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `All permissions required: ${permissions.join(', ')}`,
      });
    }

    next();
  };
}

// 使用示例
app.post('/api/products',
  jwtAuthMiddleware,
  requirePermission(Permission.PRODUCT_CREATE),
  async (req, res) => {
    // 只有拥有 product:create 权限的用户才能创建产品
    const product = await productService.create(req.body);
    res.status(201).json(product);
  }
);

app.delete('/api/users/:userId',
  jwtAuthMiddleware,
  requirePermission(Permission.USER_DELETE),
  async (req, res) => {
    // 只有拥有 user:delete 权限的用户才能删除用户
    await userService.delete(req.params.userId);
    res.status(204).send();
  }
);
```

---

## 多因素认证 (MFA)

### MFA 实现

```typescript
// TOTP (Time-based One-Time Password) 服务
import * as speakeasy from 'speakeasy';

class MFAService {
  private readonly secretLength = 32;
  private readonly digits = 6;

  // 为用户生成 MFA Secret
  generateMFASecret(userId: string): MFASecret {
    const secret = speakeasy.generateSecret({ length: this.secretLength });

    // 存储到数据库
    await this.database.upsert({
      userId,
      secret: secret.base32,
    });

    return {
      secret: secret.base32,
      qrCode: this.generateQRCode(secret.otpauth_url),
    };
  }

  // 验证 TOTP 代码
  verifyTOTP(userId: string, token: string): boolean {
    const record = await this.database.findOne({ userId });

    if (!record) {
      return false;
    }

    const secret = speakeasy.fromBase32(record.secret);

    // 验证 token（容差为 1 个时间窗口）
    return secret.verify({
      token,
      encoding: 'base32',
      window: 1,
    });
  }

  // 验证备份代码（用于恢复）
  verifyBackupCode(userId: string, code: string): boolean {
    const record = await this.database.findOne({ userId });

    if (!record) {
      return false;
    }

    return record.backupCode === code;
  }

  private generateQRCode(otpauthUrl: string): string {
    // 使用 qrcode 库生成 QR 码
    return 'data:image/png;base64,...';
  }
}

// MFA 中间件
function requireMFA(req: any, res: any, next: any) {
  const user = req.user;

  // 检查用户是否已启用 MFA
  if (!user.mfaEnabled) {
    return next(); // 未启用 MFA，跳过
  }

  // 检查请求中是否包含 TOTP 代码
  const totpCode = req.headers['x-mfa-token'] || req.body.mfaToken;

  if (!totpCode) {
    return res.status(403).json({
      error: 'MFA token required',
      message: 'Please provide your 2FA code',
    });
  }

  const mfaService = new MFAService();
  if (!mfaService.verifyTOTP(user.id, totpCode)) {
    return res.status(401).json({
      error: 'Invalid MFA token',
      message: 'The 2FA code is incorrect',
    });
  }

  next();
}

// 使用示例
app.post('/api/login',
  jwtAuthMiddleware,
  async (req, res) => {
    // 用户已通过密码认证
    // 现在检查是否启用了 MFA
    const user = await userService.findById(req.user.id);

    if (user.mfaEnabled) {
      // 返回提示用户需要提供 MFA 代码
      return res.status(200).json({
        message: 'MFA required',
        mfaEnabled: true,
      });
    }

    // 未启用 MFA，直接返回 Token
    const authService = new AuthService();
    const token = authService.generateAccessToken(user.id, user.email, user.roles);

    res.json({ token });
  }
);

app.post('/api/verify-mfa',
  jwtAuthMiddleware,
  requireMFA,
  async (req, res) => {
    const user = req.user;
    const mfaToken = req.body.mfaToken;

    // 已经由中间件验证过
    const authService = new AuthService();
    const token = authService.generateAccessToken(user.id, user.email, user.roles);

    res.json({ token });
  }
});
```

---

## 会话管理

### 会话配置

```typescript
interface SessionConfig {
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
  };
}

const sessionConfig: SessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,  // 防止 XSS
    secure: process.env.NODE_ENV === 'production',  // HTTPS 时启用
    sameSite: 'strict',  // CSRF 防护
    maxAge: 24 *60*60* 1000, // 24 小时
  },
};

// 使用 Express Session
import session from 'express-session';

app.use(session(sessionConfig));

app.get('/api/profile', (req, res) => {
  // 如果用户已登录，返回用户资料
  if (req.session.userId) {
    const user = await userService.findById(req.session.userId);
    res.json(user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.post('/api/logout', (req, res) => {
  // 销毁会话
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.json({ message: 'Logged out successfully' });
  });
});
```

---

## 最佳实践总结

### ✅ 通用安全措施

1. **永远不在客户端存储敏感信息**
   - 不要在 localStorage 存储密码
   - 不要在 URL 中暴露 token
   - 使用 HttpOnly Cookie

2. **使用 HTTPS 保护所有端点**
   - 生产环境必须使用 HTTPS
   - 配置 HSTS (HTTP Strict Transport Security)
   - 重定向 HTTP 到 HTTPS

3. **定期轮换密钥和证书**
   - JWT 密钥应该定期更新
   - 使用短期 Access Token 和长期 Refresh Token
   - 实施密钥轮换策略

4. **实施速率限制**
   - 防止暴力破解
   - 限制 API 请求频率
   - 使用 Redis 或内存存储计数器

5. **日志和监控**
   - 记录所有认证和授权事件
   - 监控异常的认证尝试
   - 设置告警机制

6. **安全错误处理**
   - 不要在错误消息中暴露敏感信息
   - 使用通用的错误消息
   - 记录详细错误到服务器日志

### 🔒 密码安全

1. **使用强哈希算法**
   - bcrypt (推荐)
   - Argon2
   - PBKDF2
   - 迭代次数至少 10 次

2. **强制密码策略**
   - 最小长度：8-12 字符
   - 包含大小写字母、数字、特殊字符
   - 定期更新密码（90-180 天）

3. **实施密码重置流程**
   - 生成临时 token
   - token 过期时间：15-30 分钟
   - 发送确认邮件

### 🔒 JWT 安全

1. **使用强密钥**
   - 至少 256 位随机密钥
   - 不要硬编码在代码中
   - 使用环境变量或密钥管理服务

2. **设置合理的过期时间**
   - Access Token：15-30 分钟
   - Refresh Token：7-30 天
   - 在用户操作时刷新 Token

3. **验证 Token 签发者**
   - 检查 `iss` 声明
   - 检查 `aud` 声明
   - 拒绝来自未授权签发者的 Token

---

## 相关资源

- [OWASP Top 10](./owasp-top10.md)
- [设计模式](../design-patterns/)
- [编码最佳实践](../best-practices/coding.md)
