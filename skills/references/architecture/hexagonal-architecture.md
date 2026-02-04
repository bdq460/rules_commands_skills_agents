# 六边形架构 (Hexagonal Architecture)

六边形架构，也称为端口和适配器架构，是一种由Alistair Cockburn提出的应用架构模式。它将应用分为内部（核心）和外部（基础设施、适配器）两部分，通过定义良好的端口进行通信。

## 架构概述

```text
           ┌─────────────────────────────┐
           │      Primary Actor        │
           └──────────┬──────────────┘
                       │
                       ▼
              ┌─────────────────────┐
              │   Driving Adapter   │
              └──────────┬──────────┘
                           │
              ┌────────▼────────┐
              │   Port (Interface) │
              └────────┬────────┘
                           │
              ┌────────▼────────┐
              │     Application    │
              │      (Domain)     │
              └────────┬────────┘
                           │
              ┌────────▼────────┐
              │   Port (Interface) │
              └────────┬────────┘
                           │
              ┌────────▼────────┐
              │  Driven Adapter   │
              └──────────┬──────────┘
                          │
           ┌────────────▼──────────┐
           │  Secondary Actor       │
           └───────────────────────┘
```

---

## 核心概念

### 1. 应用程序核心 (Application Core/Domain)

- 包含业务逻辑和领域模型
- 不依赖于外部技术细节
- 通过端口接口定义可用的功能

### 2. 端口 (Ports)

- 定义核心与外部交互的接口
- 分为驱动端口（Driving Ports）和被驱动端口（Driven Ports）
- 端口是纯接口，不包含实现细节

### 3. 适配器 (Adapters)

- 实现端口接口
- 处理与外部系统的技术细节
- 负责转换数据格式和协议

### 4. 外部世界

- 数据库
- Web服务
- 消息队列
- 文件系统
- 用户界面

---

## 端口类型

### 驱动端口 (Primary/Driving Ports)

被外部世界调用的接口：

```typescript
// 示例：用户注册端口
interface UserRegistrationPort {
  register(user: UserData): Promise<User>;
  getUser(id: string): Promise<User>;
  updateUser(user: UserData): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
```

### 被驱动端口 (Secondary/Driven Ports)

应用调用的接口：

```typescript
// 示例：数据库端口
interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<void>;
}

// 示例：邮件服务端口
interface EmailServicePort {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

// 示例：日志端口
interface LoggingPort {
  log(level: LogLevel, message: string): void;
}
```

---

## 适配器类型

### 主适配器 (Primary Adapters)

处理外部世界对核心的调用：

```typescript
// HTTP REST API 适配器
class UserRegistrationHttpAdapter implements UserRegistrationPort {
  constructor(private userRegistration: UserRegistrationPort) {}

  async registerUser(request: HttpRequest): Promise<HttpResponse> {
    try {
      // 从 HTTP 请求提取数据
      const userData = this.extractUserData(request);

      // 调用核心业务逻辑
      const user = await this.userRegistration.register(userData);

      // 转换为 HTTP 响应
      return this.toHttpResponse(user);
    } catch (error) {
      return this.toErrorResponse(error);
    }
  }
}

// 使用示例
const core = new ApplicationCore();
const httpAdapter = new UserRegistrationHttpAdapter(core);

const server = new HttpServer();
server.post("/users", httpAdapter.registerUser.bind(httpAdapter));
```

### 次适配器 (Secondary Adapters)

核心对外部世界的调用：

```typescript
// PostgreSQL 数据库适配器
class PostgresUserRepositoryAdapter implements UserRepositoryPort {
  private pool: any;

  constructor(pool: any) {
    this.pool = pool;
  }

  async save(user: User): Promise<User> {
    const query = `
      INSERT INTO users (id, name, email)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      user.id,
      user.name,
      user.email,
    ]);
    return result.rows[0];
  }

  async findById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findAll(): Promise<User[]> {
    const query = "SELECT * FROM users";
    const result = await this.pool.query(query);
    return result.rows;
  }

  async delete(id: string): Promise<void> {
    const query = "DELETE FROM users WHERE id = $1";
    await this.pool.query(query, [id]);
  }
}

// SMTP 邮件服务适配器
class SMTPEmailServiceAdapter implements EmailServicePort {
  private smtpConfig: any;

  constructor(smtpConfig: any) {
    this.smtpConfig = smtpConfig;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.smtpConfig.sendMail({
      from: "noreply@example.com",
      to: to,
      subject: subject,
      text: body,
    });
  }
}
```

---

## 完整示例：用户注册系统

### 步骤1：定义端口

```typescript
// 主端口 - 用户注册
interface UserRegistrationPort {
  register(user: UserData): Promise<User>;
}

// 次端口 - 用户存储
interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

// 次端口 - 邮件通知
interface NotificationServicePort {
  sendWelcomeEmail(user: User): Promise<void>;
}
```

### 步骤2：实现核心业务逻辑

```typescript
// 核心应用 - 不依赖外部技术
class UserRegistrationService {
  constructor(
    private userRepo: UserRepositoryPort,
    private notificationService: NotificationServicePort,
  ) {}

  async register(userData: UserData): Promise<User> {
    // 业务逻辑：检查是否已存在
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // 业务逻辑：创建用户
    const user = {
      id: this.generateId(),
      name: userData.name,
      email: userData.email,
      createdAt: new Date(),
    };

    // 持久化用户
    await this.userRepo.save(user);

    // 业务逻辑：发送欢迎邮件
    await this.notificationService.sendWelcomeEmail(user);

    return user;
  }

  private generateId(): string {
    return `user`${Date.now()}`${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 步骤3：实现适配器

```typescript
// HTTP 适配器
class UserRegistrationHttpAdapter implements UserRegistrationPort {
  constructor(private service: UserRegistrationService) {}

  async register(userData: UserData): Promise<User> {
    // 调用核心服务
    return await this.service.register(userData);
  }
}

// PostgreSQL 适配器
class PostgresUserRepository implements UserRepositoryPort {
  constructor(private pool: any) {}

  async save(user: User): Promise<User> {
    const query =
      "INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *";
    const result = await this.pool.query(query, [
      user.id,
      user.name,
      user.email,
    ]);
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }
}

// SendGrid 适配器
class SendGridNotificationService implements NotificationServicePort {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: user.email,
            subject: "Welcome to our service!",
            content: [
              {
                type: "text/plain",
                value: `Welcome ${user.name}!`,
              },
            ],
          },
        ],
      }),
    });
  }
}
```

### 步骤4：组装应用

```typescript
// 依赖注入
const postgresPool = createPostgresPool();
const sendGridApiKey = process.env.SENDGRID_API_KEY;

// 创建适配器
const userRepo = new PostgresUserRepository(postgresPool);
const notificationService = new SendGridNotificationService(sendGridApiKey);

// 创建核心服务
const userService = new UserRegistrationService(userRepo, notificationService);

// 创建主适配器
const httpAdapter = new UserRegistrationHttpAdapter(userService);

// 启动 HTTP 服务器
const server = new HttpServer();
server.post("/api/users/register", httpAdapter.register);
```

---

## 六边形架构的优势

### ✅ 优点

1. **可测试性强**
   - 核心业务逻辑可以独立测试
   - 使用端口接口的 Mock 实现
   - 不依赖数据库、外部服务

2. **可维护性好**
   - 核心不包含技术细节
   - 更换技术栈只需替换适配器
   - 业务逻辑保持不变

3. **灵活性和可扩展性**
   - 可以轻松添加新的适配器
   - 支持多种外部技术
   - 不会影响核心逻辑

4. **关注点分离**
   - 核心关注业务规则
   - 适配器关注技术实现
   - 职责清晰

### ❌ 缺点

1. **复杂性增加**
   - 需要定义更多接口
   - 适配器数量可能很多
   - 初期学习曲线

2. **间接层**
   - 增加了一层抽象
   - 调试时需要跟踪多层

3. **过度设计风险**
   - 简单应用可能过于复杂
   - 需要权衡收益和成本

---

## 最佳实践

### ✅ 何时使用六边形架构

- 应用需要长期维护
- 需要支持多种技术栈
- 需要高可测试性
- 需要清晰的关注点分离

### ❌ 何时不用六边形架构

- 简单的 CRUD 应用
- 快速原型/概念验证
- 只有一个外部依赖
- 团队不熟悉这种架构

### 💡 实施建议

1. **从核心开始**
   - 先定义领域模型和业务逻辑
   - 然后定义端口接口

2. **接口优先**
   - 端口接口定义要清晰
   - 使用 TypeScript 强类型
   - 编写接口文档

3. **适配器独立**
   - 每个适配器可以独立开发和测试
   - 不应该依赖其他适配器

4. **依赖注入**
   - 使用依赖注入组装应用
   - 避免硬编码依赖
   - 便于测试和替换

5. **渐进式实施**
   - 不必一开始就完全采用
   - 可以逐步从现有架构迁移
   - 识别关键边界开始重构

---

## 示例：完整应用结构

```text
src/
├── application/                    # 核心应用
│   ├── domain/                    # 领域模型
│   │   ├── User.ts
│   │   ├── Order.ts
│   │   └── Product.ts
│   ├── ports/                     # 端口接口
│   │   ├── primary/
│   │   │   ├── UserRegistrationPort.ts
│   │   │   └── OrderProcessingPort.ts
│   │   └── secondary/
│   │       ├── UserRepositoryPort.ts
│   │       ├── OrderRepositoryPort.ts
│   │       └── NotificationServicePort.ts
│   └── services/                  # 业务服务
│       ├── UserRegistrationService.ts
│       └── OrderProcessingService.ts
│
├── adapters/                      # 适配器
│   ├── primary/                   # 主适配器
│   │   ├── http/
│   │   │   ├── UserRegistrationHttpAdapter.ts
│   │   │   └── OrderProcessingHttpAdapter.ts
│   │   └── cli/
│   │       └── UserRegistrationCLIAdapter.ts
│   └── secondary/                 # 次适配器
│       ├── database/
│       │   ├── PostgresUserRepository.ts
│       │   └── MongoUserRepository.ts
│       ├── notification/
│       │   ├── SendGridNotificationAdapter.ts
│       │   └── SNSNotificationAdapter.ts
│       └── logging/
│           ├── WinstonLoggingAdapter.ts
│           └── PinoLoggingAdapter.ts
│
└── infrastructure/                # 基础设施
    ├── database/
    │   ├── postgres-pool.ts
    │   └── mongo-client.ts
    ├── api/
    │   ├── sendgrid-client.ts
    │   └── sns-client.ts
    └── logger/
        ├── winston.ts
        └── pino.ts
```

---

## 与其他架构的对比

| 特性           | 六边形架构  | 分层架构    | 微服务架构  |
| -------------- | ----------- | ----------- | ----------- |
| **关注点分离** | ✅ 强制分离 | ⚠️ 需要自律 | ✅ 天然分离 |
| **可测试性**   | ✅ 极佳     | ⚠️ 中等     | ✅ 极佳     |
| **技术独立性** | ✅ 高       | ❌ 低       | ✅ 极高     |
| **实现复杂度** | ⚠️ 中高     | ✅ 低       | ❌ 高       |
| **学习曲线**   | ⚠️ 中       | ✅ 低       | ⚠️ 高       |
| **适合规模**   | 中大型应用  | 任何规模    | 大型应用    |

---

## 相关资源

- [微服务架构](./microservices.md)
- [事件驱动架构](./event-driven.md)
- [编码最佳实践](../best-practices/coding.md)
- [设计模式-结构型](../design-patterns/structural.md)
