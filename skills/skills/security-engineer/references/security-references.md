# Security Engineer References

本文档提供安全审查的最佳实践、检查清单和参考资料。

## 📋 安全审查检查清单

### 1. 认证和授权

#### 密码安全

**检查项**：

- [ ] 密码最小长度（至少8个字符）
- [ ] 密码复杂度要求（大小写、数字、特殊字符）
- [ ] 密码哈希算法（bcrypt、Argon2等）
- [ ] 密码重置流程安全
- [ ] 防止常见密码（密码字典检查）

**示例密码策略**：

```text
最小长度：8个字符
复杂度要求：
  - 至少1个大写字母
  - 至少1个小写字母
  - 至少1个数字
  - 至少1个特殊字符
哈希算法：bcrypt (cost factor >= 10)

```

#### 会话管理

**检查项**：

- [ ] JWT/Session令牌过期时间（推荐15-30分钟）
- [ ] 刷新令牌机制
- [ ] 令牌存储安全（HttpOnly、Secure、SameSite）
- [ ] 多设备登录管理
- [ ] 登出时清除所有会话

**JWT配置示例**：

```typescript
const jwtConfig = {
  accessTokenExpire: "15m",
  refreshTokenExpire: "7d",
  algorithm: "RS256",
  issuer: "your-app",
  audience: "your-app-users",
};

// Cookie设置
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 900000, // 15 minutes
};
```

#### 多因素认证（MFA）

**检查项**：

- [ ] 支持TOTP（基于时间）
- [ ] 支持SMS验证
- [ ] 支持邮箱验证
- [ ] 备用恢复码
- [ ] MFA注册和禁用流程

### 2. 输入验证

#### 通用验证规则

**检查项**：

- [ ] 所有用户输入都经过验证
- [ ] 白名单验证（而非黑名单）
- [ ] 长度和格式限制
- [ ] 特殊字符过滤
- [ ] SQL注入防护
- [ ] XSS防护

**验证示例**：

```typescript
import { z } from "zod";

const userSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符")
    .max(20, "用户名最多20个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "只能包含字母、数字和下划线"),

  email: z.string().email("邮箱格式不正确").max(255, "邮箱最多255个字符"),

  password: z
    .string()
    .min(8, "密码至少8个字符")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "密码必须包含大小写字母、数字和特殊字符",
    ),

  age: z.number().min(0, "年龄不能为负数").max(120, "年龄不能超过120"),
});

// 验证函数
function validateUserInput(data: any) {
  try {
    return userSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error.errors);
  }
}

```

#### 文件上传验证

**检查项**：

- [ ] 文件类型白名单
- [ ] 文件大小限制
- [ ] 文件名消毒
- [ ] 病毒扫描
- [ ] 内容验证（MIME type）

**文件上传配置示例**：

```typescript
const uploadConfig = {
  allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFileSize: 5 * 1024 * 1024, // 5MB per file
  maxFiles: 5,

  filename: {
    maxLength: 255,
    allowedChars: "a-zA-Z0-9-_.",
    disallowed: ["con", "prn", "aux", "nul"],
  },

  scanForVirus: process.env.NODE_ENV === "production",
};

```

### 3. 数据安全

#### 数据加密

**检查项**：

- [ ] 传输层加密（HTTPS/TLS 1.3+）
- [ ] 静态数据加密（AES-256）
- [ ] 密钥管理（KMS、环境变量）
- [ ] 加密密钥轮换
- [ ] 加密算法符合FIPS 140-2

**加密配置示例**：

```typescript
import crypto from "crypto";

// AES-256加密
function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

// AES-256解密
function decryptData(encrypted: string, key: string): string {
  const [iv, encryptedData] = encrypted.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex"),
  );

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

```

#### 敏感数据处理

**检查项**：

- [ ] PII数据识别和标记
- [ ] 数据脱敏（日志、报告）
- [ ] 数据保留期限
- [ ] 数据访问审计
- [ ] 数据删除和擦除

**PII数据类型**：

```typescript
const PII_TYPES = {
  email: "email",
  phone: "phone",
  ssn: "social_security_number",
  address: "address",
  credit_card: "credit_card",
  health_info: "health_information",
};

function maskPII(data: string, type: string): string {
  switch (type) {
    case "email":
      return data.replace(/(.{2})(.*)(@.*)/, "$1***$3");
    case "phone":
      return data.replace(/(\d{3})\d{4}(\d{4})/, "$1****$3");
    case "credit_card":
      return data.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 **** **** $4");
    default:
      return data.substring(0, 2) + "***";
  }
}
```

### 4. API安全

#### 认证和授权

**检查项**：

- [ ] API认证机制（JWT、OAuth 2.0、API Key）
- [ ] 速率限制（Rate Limiting）
- [ ] 请求签名
- [ ] 权限验证（RBAC、ABAC）
- [ ] CORS配置

**API认证示例**：

```typescript
// JWT认证中间件
async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// 速率限制
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later.",
});

// CORS配置
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(","),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

```

#### 输入验证

**检查项**：

- [ ] 请求体大小限制
- [ ] 参数类型验证
- [ ] 枚举值验证
- [ ] 范围验证
- [ ] 递归深度限制

**API验证示例**：

```typescript
import { body, param, query } from "express-validator";

// API端点验证
export const validateCreateUser = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/),

  body("email").trim().isEmail().normalizeEmail(),

  body("password").isLength({ min: 8, max: 100 }),

  body("age").optional().isInt({ min: 0, max: 120 }),
];

```

### 5. Web安全

#### OWASP Top 10 防护

**检查项**：

- [ ] A01:2021 - 访问控制失效
- [ ] A02:2021 - 加密失效
- [ ] A03:2021 - 注入（SQL、NoSQL、OS命令）
- [ ] A04:2021 - 不安全设计
- [ ] A05:2021 - 安全配置错误
- [ ] A06:2021 - 易受攻击的组件
- [ ] A07:2021 - 身份识别和验证失败
- [ ] A08:2021 - 软件和数据完整性失效
- [ ] A09:2021 - 安全日志和监控失效
- [ ] A10:2021 - 服务端请求伪造

#### XSS防护

**检查项**：

- [ ] 输出编码（HTML、JavaScript、URL、CSS）
- [ ] CSP（内容安全策略）
- [ ] XSS过滤器
- [ ] DOM操作安全
- [ ] JSON序列化安全

**XSS防护示例**：

```typescript
import * as xss from "xss";

function sanitizeHTML(input: string): string {
  // 使用DOMPurify或xss库
  return xss(input, {
    whiteList: {
      a: ["href", "title", "target"],
      b: [],
      br: [],
      div: ["class"],
      em: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      hr: [],
      i: [],
      img: ["src", "alt", "title", "width", "height"],
      p: [],
      span: [],
    },
  });
}

// CSP头设置
const cspHeader =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';";

```

#### CSRF防护

**检查项**：

- [ ] CSRF令牌
- [ ] SameSite Cookie属性
- [ ] 自定义头验证
- [ ] 双提交Cookie模式

**CSRF防护示例**：

```typescript
import csrf from "csurf";

// CSRF中间件
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

app.use(csrfProtection);

// 在响应中设置CSRF令牌
app.get("/form", (req, res) => {
  res.render("form", {
    csrfToken: req.csrfToken(),
  });
});

// 在表单中包含CSRF令牌
// <input type="hidden" name="_csrf" value="<%= csrfToken %>">

```

### 6. 日志和监控

#### 安全日志

**检查项**：

- [ ] 认证事件（登录、登出、MFA）
- [ ] 授权事件（权限拒绝、权限提升）
- [ ] 数据访问事件
- [ ] 配置变更事件
- [ ] 安全事件（攻击检测、异常行为）

**安全日志格式示例**：

```typescript
interface SecurityEvent {
  timestamp: Date;
  eventType: "auth_success" | "auth_failure" | "access_denied" | "data_access";
  userId?: string;
  ip: string;
  userAgent?: string;
  details: any;
  severity: "low" | "medium" | "high" | "critical";
}

function logSecurityEvent(event: SecurityEvent) {
  console.log(
    JSON.stringify({
      ...event,
      timestamp: new Date().toISOString(),
    }),
  );
}

```

#### 安全监控

**检查项**：

- [ ] 实时安全事件监控
- [ ] 异常行为检测
- [ ] 安全指标仪表板
- [ ] 告警通知（邮件、Slack、PagerDuty）
- [ ] 安全事件响应流程

### 7. 开发安全

#### 安全开发生命周期

**检查项**：

- [ ] 安全需求收集
- [ ] 威胁建模
- [ ] 安全设计
- [ ] 安全编码
- [ ] 安全测试
- [ ] 安全审查
- [ ] 漏洞管理
- [ ] 补丁管理

#### 安全编码实践

**检查项**：

- [ ] 输入验证和输出编码
- [ ] 参数化查询（防SQL注入）
- [ ] 最小权限原则
- [ ] 防御式编程
- [ ] 不使用不安全函数
- [ ] 错误处理不泄露敏感信息

**安全编码示例**：

```typescript
// ❌ 不安全：SQL注入风险
async function getUserUnsafe(username: string) {
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  return db.query(query);
}

// ✅ 安全：参数化查询
async function getUserSafe(username: string) {
  const query = "SELECT * FROM users WHERE username = $1";
  return db.query(query, [username]);
}

// ❌ 不安全：错误泄露敏感信息
try {
  const user = await db.query(sql, params);
} catch (error) {
  res.status(500).json({
    error: error.message,
    query: sql, // 泄露了SQL查询
    stack: error.stack, // 泄露了堆栈跟踪
  });
}

// ✅ 安全：不泄露敏感信息
try {
  const user = await db.query(sql, params);
} catch (error) {
  logger.error("Database error", { userId, username });
  res.status(500).json({
    error: "An error occurred",
  });
}

```

### 8. DevSecOps

#### 容器安全

**检查项**：

- [ ] 基础镜像安全（官方镜像、定期更新）
- [ ] 容器运行在非root用户
- [ ] 资源限制（CPU、内存）
- [ ] 网络隔离
- [ ] 容器扫描

**Docker安全配置示例**：

```dockerfile
# 使用最小化基础镜像
FROM node:18-alpine

# 使用非root用户
RUN addgroup -g nodegroup -S nodegroup && \
    adduser -G nodegroup -u nodegroup -S nodeuser
USER nodeuser

# 只安装必要的依赖
RUN npm ci --only=production

# 设置只读文件系统
RUN chmod -R 444 /app
USER nodeuser

```

#### CI/CD安全

**检查项**：

- [ ] Secrets管理（不硬编码、使用环境变量、Vault）
- [ ] 依赖扫描（npm audit、Snyk、Dependabot）
- [ ] 代码扫描（SonarQube、ESLint安全插件）
- [ ] 容器镜像扫描（Trivy、Clair）
- [ ] 基础设施安全扫描

**GitHub Actions安全配置示例**：

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # 依赖漏洞扫描
      - name: Run npm audit
        run: npm audit --audit-level=moderate --json > audit.json
        continue-on-error: true

      # 容器镜像扫描
      - name: Run Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: "fs"
          scan-ref: "Dockerfile"
          format: "sarif"

      # 代码质量检查
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

```

## 📚 参考资料

### 安全标准

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [ISO 27001](https://www.iso.org/standard/27001)
- [PCI DSS](https://www.pcisecuritystandards.org/)

### 安全工具

- [OWASP ZAP](https://www.zaproxy.org/) - Web应用安全扫描
- [Burp Suite](https://portswigger.net/burp) - Web应用安全测试
- [Nessus](https://www.tenable.com/products/nessus) - 漏洞扫描
- [Snyk](https://snyk.io/) - 依赖安全扫描
- [Dependabot](https://dependabot.com/) - 自动依赖更新
- [SonarQube](https://www.sonarqube.org/) - 代码质量分析

### 安全最佳实践

- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Google Security Best Practices](https://security.googleblog.com/)
- [Microsoft Security Development Lifecycle](https://www.microsoft.com/en-us/sdl/)

## 🔍 安全审查流程

### 1. 准备阶段

- [ ] 定义安全需求
- [ ] 识别资产和威胁
- [ ] 建立安全检查清单
- [ ] 准备测试环境

### 2. 执行阶段

- [ ] 执行静态代码分析
- [ ] 执行依赖扫描
- [ ] 执行动态应用安全测试
- [ ] 执行渗透测试
- [ ] 执行配置审查

### 3. 报告阶段

- [ ] 记录发现的问题
- [ ] 按严重级别分类
- [ ] 提供修复建议
- [ ] 制定修复计划
- [ ] 跟踪修复进度

### 4. 验证阶段

- [ ] 验证问题已修复
- [ ] 重新测试
- [ ] 回归测试
- [ ] 更新安全文档
