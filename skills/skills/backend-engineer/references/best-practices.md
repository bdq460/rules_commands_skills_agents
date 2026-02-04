# 后端工程最佳实践

本文档提供后端开发的最佳实践指南，涵盖架构设计、编码规范、性能优化、安全等方面。

## 目录

1. [架构设计](#架构设计)
2. [编码规范](#编码规范)
3. [API设计](#api设计)
4. [数据库设计](#数据库设计)
5. [性能优化](#性能优化)
6. [安全实践](#安全实践)
7. [测试策略](#测试策略)
8. [错误处理](#错误处理)

---

## 架构设计

### 1. 分层架构

**推荐**: 采用经典的三层架构或六边形架构

```typescript
// 控制器层 (Controller Layer)
// 路由：src/controllers/
class UserController {
  async getUsers(req: Request, res: Response) {
    // 仅处理HTTP相关逻辑
    const result = await this.userService.getUsers(req.query);
    res.json(result);
  }
}

// 服务层 (Service Layer)
// 路由：src/services/
class UserService {
  async getUsers(query: GetUsersQuery) {
    // 业务逻辑
    const users = await this.userRepository.find(query);
    return this.formatUsers(users);
  }
}

// 数据访问层 (Repository Layer)
// 路由：src/repositories/
class UserRepository {
  async find(query: GetUsersQuery) {
    // 仅数据库操作
    return await this.db.user.findMany(query);
  }
}
```

### 2. 依赖注入

**推荐**: 使用依赖注入容器管理依赖关系

```typescript
// 使用inversify
import { Container, injectable, inject } from 'inversify';

@injectable()
class UserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('ILogger') private logger: ILogger
  ) {}
}

@injectable()
class UserController {
  constructor(
    @inject('IUserService') private userService: IUserService
  ) {}
}
```

### 3. 模块化设计

**推荐**: 按功能域划分模块

```text
src/
├── modules/
│   ├── user/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── validators/
│   ├── order/
│   └── product/
├── core/
│   ├── database/
│   ├── config/
│   └── utils/
└── app.ts
```

---

## 编码规范

### 1. TypeScript规范

**使用严格模式**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**使用类型而非any**

```typescript
// ❌ 避免
function getUser(id: any): any {
  return db.users.find(id);
}

// ✅ 推荐
function getUser(id: string): Promise<User> {
  return db.users.find(id);
}
```

### 2. 命名规范

```typescript
// 类名：PascalCase
class UserService {}

// 接口：PascalCase，I前缀可选
interface IUserRepository {}
interface UserRepository {}

// 方法/函数：camelCase
function getUserById() {}
async createUser() {}

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 10;

// 私有成员：下划线前缀
class UserService {
  private _cache: Map<string, User>;
  private _logger: Logger;
}
```

### 3. 注释规范

```typescript
/**
 * 用户服务类
 *
 * @description 负责用户相关的业务逻辑
 */
export class UserService {
  /**
   * 获取用户列表
   *
   * @param query - 查询参数
   * @param query.page - 页码，从1开始
   * @param query.pageSize - 每页数量
   * @returns Promise<UserListResult> 用户列表结果
   *
   * @example
   * const result = await userService.getUsers({ page: 1, pageSize: 10 });
   */
  async getUsers(query: {
    page: number;
    pageSize: number;
  }): Promise<UserListResult> {
    // 实现
  }
}
```

---

## API设计

### 1. RESTful API规范

**资源命名**

```typescript
// ✅ 推荐：使用复数名词
GET    /api/users         // 获取用户列表
POST   /api/users         // 创建用户
GET    /api/users/:id     // 获取单个用户
PUT    /api/users/:id     // 更新用户
DELETE /api/users/:id     // 删除用户

// ❌ 避免
GET    /api/getUsers
POST   /api/createUser
GET    /api/user/:id
```

**版本控制**

```typescript
// 推荐使用URL版本控制
GET /api/v1/users
GET /api/v2/users

// 或者使用Header
GET /api/users
Accept: application/vnd.api.v1+json
```

### 2. 统一响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

// 成功响应
{
  "success": true,
  "data": { "id": 1, "name": "John" },
  "meta": {
    "timestamp": "2026-01-27T10:00:00Z",
    "requestId": "abc123"
  }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在",
    "details": { "userId": 1 }
  },
  "meta": {
    "timestamp": "2026-01-27T10:00:00Z",
    "requestId": "abc123"
  }
}
```

### 3. HTTP状态码使用

```typescript
// 2xx 成功
200 OK - 请求成功
201 Created - 资源创建成功
202 Accepted - 请求已接受，异步处理中
204 No Content - 删除成功，无返回内容

// 3xx 重定向
304 Not Modified - 资源未修改

// 4xx 客户端错误
400 Bad Request - 请求参数错误
401 Unauthorized - 未认证
403 Forbidden - 无权限
404 Not Found - 资源不存在
409 Conflict - 资源冲突
422 Unprocessable Entity - 业务验证失败
429 Too Many Requests - 请求过多

// 5xx 服务器错误
500 Internal Server Error - 服务器错误
503 Service Unavailable - 服务不可用
```

---

## 数据库设计

### 1. 模式设计原则

```sql
-- 使用统一的命名规范
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 使用索引优化查询
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2. 事务管理

```typescript
// ✅ 推荐：使用事务
async function transferMoney(
  fromUserId: number,
  toUserId: number,
  amount: number
): Promise<void> {
  await db.transaction(async (trx) => {
    // 扣除发送方金额
    await trx('users')
      .where({ id: fromUserId })
      .decrement('balance', amount);

    // 增加接收方金额
    await trx('users')
      .where({ id: toUserId })
      .increment('balance', amount);

    // 记录交易
    await trx('transactions').insert({
      fromUserId,
      toUserId,
      amount,
      createdAt: new Date()
    });
  });
}
```

### 3. 查询优化

```typescript
// ✅ 推荐：使用索引、限制字段、分页
async function getUsers(query: GetUsersQuery) {
  return await db('users')
    .select('id', 'email', 'name') // 只选择需要的字段
    .where('status', 'active')
    .orderBy('created_at', 'desc')
    .limit(query.pageSize)
    .offset((query.page - 1) * query.pageSize);
}

// ❌ 避免
async function getUsers(query: GetUsersQuery) {
  return await db('users')
    .select('*') // 不要使用 SELECT *
    .orderBy('created_at', 'desc')
    .offset((query.page - 1) * query.pageSize); // 缺少LIMIT
}
```

---

## 性能优化

### 1. 缓存策略

```typescript
// 使用Redis缓存
class UserService {
  private cache: Cache;

  async getUserById(id: string): Promise<User> {
    // 1. 先查缓存
    const cached = await this.cache.get(`user:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. 查数据库
    const user = await this.userRepository.findById(id);

    // 3. 写入缓存（5分钟过期）
    await this.cache.set(
      `user:${id}`,
      JSON.stringify(user),
      { ttl: 300 }
    );

    return user;
  }

  async updateUser(user: User): Promise<User> {
    const updated = await this.userRepository.update(user);

    // 更新后删除缓存
    await this.cache.del(`user:${user.id}`);

    return updated;
  }
}
```

### 2. 批量操作

```typescript
// ✅ 推荐：批量插入
async function createUsers(users: User[]): Promise<void> {
  await db('users').insert(users);
}

// ❌ 避免：循环插入
async function createUsers(users: User[]): Promise<void> {
  for (const user of users) {
    await db('users').insert(user); // 性能差
  }
}
```

### 3. 连接池配置

```typescript
// 数据库连接池配置
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,              // 最大连接数
  min: 5,               // 最小连接数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

---

## 安全实践

### 1. 认证与授权

```typescript
// 使用JWT进行认证
class AuthService {
  async login(email: string, password: string): Promise<{ token: string }> {
    // 验证用户
    const user = await this.userService.findByEmail(email);
    if (!user || !await this.verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedError('邮箱或密码错误');
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token };
  }

  // 授权中间件
  requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new UnauthorizedError('未认证');
      }

      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError('无权限');
      }

      next();
    };
  }
}

// 使用
router.get('/admin/users', auth, requireRole('admin'), adminController.getUsers);
```

### 2. 输入验证

```typescript
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}

async function createUser(req: Request) {
  // 验证输入
  const dto = plainToClass(CreateUserDTO, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    throw new ValidationError('输入验证失败', errors);
  }

  // 处理逻辑...
}
```

### 3. 防止SQL注入

```typescript
// ✅ 推荐：使用参数化查询
async function getUserById(id: string): Promise<User> {
  return await db('users')
    .where({ id }) // 自动参数化
    .first();
}

// ❌ 避免：字符串拼接
async function getUserById(id: string): Promise<User> {
  return await db.raw(`SELECT * FROM users WHERE id = '${id}'`); // SQL注入风险
}
```

### 4. 敏感数据保护

```typescript
// 使用bcrypt加密密码
import * as bcrypt from 'bcrypt';

class UserService {
  async createUser(email: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return await this.userRepository.create({
      email,
      passwordHash // 存储哈希，不要明文密码
    });
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
```

---

## 测试策略

### 1. 单元测试

```typescript
describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    } as any;
    service = new UserService(mockRepository);
  });

  describe('getUserById', () => {
    it('应该返回用户', async () => {
      const user = { id: '1', name: 'John' };
      mockRepository.findById.mockResolvedValue(user);

      const result = await service.getUserById('1');

      expect(result).toEqual(user);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('当用户不存在时应该抛出错误', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getUserById('1')).rejects.toThrow('用户不存在');
    });
  });
});
```

### 2. 集成测试

```typescript
describe('User API Integration', () => {
  let app: Express;
  let db: Knex;

  beforeAll(async () => {
    // 设置测试数据库
    db = await createTestDatabase();
    app = createApp(db);
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    // 清空测试数据
    await db('users').truncate();
  });

  describe('POST /api/users', () => {
    it('应该创建用户', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          email: 'test@example.com',
          name: 'Test User'
        }
      });

      expect(response.body.data.password).toBeUndefined(); // 不返回密码
    });
  });
});
```

---

## 错误处理

### 1. 错误分类

```typescript
export enum ErrorCode {
  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // 认证授权错误
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // 资源错误
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // 业务错误
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_STATUS = 'INVALID_STATUS'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(
      ErrorCode.NOT_FOUND,
      `${resource}不存在`,
      404,
      { resource, id }
    );
    this.name = 'NotFoundError';
  }
}
```

### 2. 全局错误处理

```typescript
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.headers['x-request-id'] as string;

  // 记录错误
  logger.error({
    requestId,
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // 判断错误类型
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    });
    return;
  }

  // 未知错误
  res.status(500).json({
    success: false,
    error: {
      code: ErrorCode.UNKNOWN_ERROR,
      message: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId
    }
  });
}
```

---

## 总结

遵循这些最佳实践，可以构建：

- ✅ **可维护的代码**: 清晰的架构和编码规范
- ✅ **高性能的系统**: 缓存、批量操作、连接池优化
- ✅ **安全的应用**: 认证授权、输入验证、防注入
- ✅ **高质量的代码**: 完善的测试和错误处理

持续学习和改进这些实践，可以不断提升代码质量和开发效率。
