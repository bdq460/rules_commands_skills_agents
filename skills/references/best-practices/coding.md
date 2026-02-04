# 编码最佳实践

## 概述

本文档提供通用的编码最佳实践，适用于大多数编程语言和项目类型。这些实践旨在提高代码质量、可维护性和可读性。

## 核心原则

### 1. SOLID原则

- **单一职责原则（SRP）**：每个类或函数只负责一件事
- **开闭原则（OCP）**：对扩展开放，对修改关闭
- **里氏替换原则（LSP）**：子类可以替换父类而不影响程序正确性
- **接口隔离原则（ISP）**：客户端不应该依赖它不需要的接口
- **依赖倒置原则（DIP）**：高层模块不应该依赖低层模块，两者都应该依赖抽象

### 2. DRY原则（Don't Repeat Yourself）

```typescript
// ❌ 重复代码
function calculateCircleArea(radius: number) {
  return Math.PI *radius* radius;
}

function calculateCylinderVolume(radius: number, height: number) {
  return Math.PI *radius*radius* height;
}

// ✅ 提取公共逻辑
function calculateCircleArea(radius: number) {
  return Math.PI *radius* radius;
}

function calculateCylinderVolume(radius: number, height: number) {
  return calculateCircleArea(radius) * height;
}
```

### 3. KISS原则（Keep It Simple, Stupid）

保持代码简单明了，避免过度设计。

```typescript
// ❌ 过度复杂
function isValidEmail(email: string): boolean {
  const regex =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)`|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])`")@(?:(?:[a-z0-9](?:[a-z0-9-]`[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]`[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  return regex.test(email);
}

// ✅ 简单清晰
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### 4. YAGNI原则（You Aren't Gonna Need It）

只实现当前需要的功能，不要过度设计。

```typescript
// ❌ 过度设计
class User {
  private email: string;
  private phone: string;
  private address: string;
  private fax: string; // 不需要
  private pager: string; // 不需要
  // ...
}

// ✅ 只实现需要的
class User {
  private email: string;
  private phone: string;
  // 根据需要添加
}
```

## 命名规范

### 1. 变量和函数命名

```typescript
// ✅ 清晰的命名
const userName = 'John';
const getUserById = (id: number) => { ... };

// ❌ 不清晰的命名
const n = 'John';
const get = (i: number) => { ... };
```

### 2. 类命名

```typescript
// ✅ 使用名词，首字母大写
class UserService { ... }
class OrderManager { ... }

// ❌ 使用动词或小写
class userServices { ... }
class ManageOrder { ... }
```

### 3. 布尔值命名

```typescript
// ✅ 使用is/has/should等前缀
const isValid = true;
const hasPermission = true;
const shouldUpdate = true;

// ❌ 不使用前缀
const valid = true;
const permission = true;
const update = true;
```

### 4. 常量命名

```typescript
// ✅ 使用大写和下划线
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";

// ❌ 使用小写或驼峰
const maxRetryCount = 3;
const apiBaseUrl = "https://api.example.com";
```

## 函数设计

### 1. 单一职责

```typescript
// ❌ 一个函数做太多事
function processUser(user: any) {
  // 验证用户
  if (!user.email || !user.name) {
    throw new Error("Invalid user");
  }
  // 保存到数据库
  db.save(user);
  // 发送欢迎邮件
  email.send(user.email, "Welcome!");
  // 更新缓存
  cache.set(user.id, user);
}

// ✅ 每个函数只做一件事
function validateUser(user: any) {
  if (!user.email || !user.name) {
    throw new Error("Invalid user");
  }
}

function saveUserToDatabase(user: any) {
  db.save(user);
}

function sendWelcomeEmail(email: string) {
  email.send(email, "Welcome!");
}

function updateUserCache(user: any) {
  cache.set(user.id, user);
}

function processUser(user: any) {
  validateUser(user);
  saveUserToDatabase(user);
  sendWelcomeEmail(user.email);
  updateUserCache(user);
}
```

### 2. 函数参数

```typescript
// ❌ 参数过多
function createUser(name: string, email: string, phone: string, address: string, age: number) { ... }

// ✅ 使用对象参数
interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  age: number;
}

function createUser(user: User) { ... }
```

### 3. 早期返回

```typescript
// ❌ 嵌套过深
function processUser(user: User) {
  if (user) {
    if (user.email) {
      if (user.isValid) {
        // 处理逻辑
      }
    }
  }
}

// ✅ 早期返回
function processUser(user: User) {
  if (!user) return;
  if (!user.email) return;
  if (!user.isValid) return;

  // 处理逻辑
}
```

## 错误处理

### 1. 明确的错误类型

```typescript
// ✅ 定义明确的错误类型
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

// 使用
if (!user.email) {
  throw new ValidationError("Email is required");
}
```

### 2. 不要吞掉错误

```typescript
// ❌ 吞掉错误
try {
  await db.save(user);
} catch (error) {
  // 什么都不做
}

// ✅ 正确处理错误
try {
  await db.save(user);
} catch (error) {
  logger.error("Failed to save user", error);
  throw new DatabaseError("Failed to save user");
}
```

### 3. 提供有用的错误信息

```typescript
// ❌ 错误信息不明确
throw new Error("Error");

// ✅ 提供详细的错误信息
throw new Error(`Failed to save user with ID ${user.id}: ${error.message}`);
```

## 代码组织

### 1. 文件组织

```text
src/
├── components/        # 组件
├── services/          # 服务
├── models/            # 模型
├── utils/             # 工具函数
├── constants/         # 常量
└── types/             # 类型定义
```

### 2. 导入顺序

```typescript
// 1. Node.js内置模块
import fs from "fs";
import path from "path";

// 2. 第三方库
import express from "express";
import axios from "axios";

// 3. 内部模块
import { User } from "./models/User";
import { database } from "./config/database";

// 4. 类型导入
import type { Request, Response } from "express";
```

### 3. 导出规范

```typescript
// ✅ 使用命名导出
export const createUser = (user: User) => { ... };
export const updateUser = (id: number, user: User) => { ... };
export const deleteUser = (id: number) => { ... };

// ✅ 默认导出（仅用于模块的main功能）
export default class UserService {
  // ...
}
```

## 注释规范

### 1. 注释什么

```typescript
// ✅ 注释"为什么"而不是"是什么"
// 使用缓存避免频繁查询数据库
const cachedUsers = cache.get("users");

// ❌ 注释"是什么"（代码已经很清楚了）
// 获取用户
const user = getUserById(id);
```

### 2. JSDoc注释

```typescript
/**
 *根据用户ID获取用户信息* @param {number} id - 用户ID
 `@returns {Promise<User>} 用户信息` @throws {Error} 如果用户不存在
 */
async function getUserById(id: number): Promise<User> {
  const user = await database.query("SELECT * FROM users WHERE id = $1", [id]);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
```

### 3. TODO注释

```typescript
// TODO: 实现分页功能
// FIXME: 性能优化，使用索引
// HACK: 临时解决方案，需要重构
```

## 性能优化

### 1. 避免不必要的计算

```typescript
// ❌ 重复计算
for (let i = 0; i < 1000; i++) {
  const result = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  // 使用result
}

// ✅ 缓存计算结果
const result = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
for (let i = 0; i < 1000; i++) {
  // 使用result
}
```

### 2. 使用缓存

```typescript
// ✅ 使用缓存
async function getUserById(id: number): Promise<User> {
  // 先从缓存获取
  const cached = cache.get(`user:${id}`);
  if (cached) {
    return cached;
  }

  // 缓存未命中，从数据库获取
  const user = await database.query("SELECT * FROM users WHERE id = $1", [id]);

  // 存入缓存
  cache.set(`user:${id}`, user, 3600); // 1小时过期

  return user;
}
```

### 3. 批量操作

```typescript
// ❌ 循环中执行操作
for (const user of users) {
  await database.save(user);
}

// ✅ 批量操作
await database.saveBatch(users);
```

## 安全性

### 1. 输入验证

```typescript
// ✅ 验证用户输入
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // 防止XSS
    .substring(0, 100); // 限制长度
}
```

### 2. 避免硬编码敏感信息

```typescript
// ❌ 硬编码密码
const password = "password123";

// ✅ 使用环境变量
const password = process.env.DATABASE_PASSWORD;
```

### 3. 使用HTTPS

```typescript
// ✅ 强制使用HTTPS
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

## 测试友好

### 1. 依赖注入

```typescript
// ✅ 依赖注入，便于测试
class UserService {
  constructor(private database: Database) {}

  async getUser(id: number) {
    return await this.database.query("SELECT * FROM users WHERE id = $1", [id]);
  }
}

// 测试时可以mock database
const mockDatabase = new MockDatabase();
const userService = new UserService(mockDatabase);
```

### 2. 避免副作用

```typescript
// ✅ 纯函数，易于测试
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 测试
expect(calculateTotal([{ price: 10 }, { price: 20 }])).toBe(30);
```

## 版本控制

### 1. 提交信息规范

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**：

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例**：

```text
feat(user): add user authentication

Implement JWT-based authentication for user login
and registration.

Closes #123
```

### 2. .gitignore

```gitignore
# Dependencies
node_modules/

# Build
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*
```

## 参考资源

- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring by Martin Fowler](https://refactoring.com/)
- [The Pragmatic Programmer](https://pragprog.com/titles/tpp20/)
- [Google Style Guides](https://google.github.io/styleguide/)

---

**相关Reference**：

- [Testing Best Practices](./testing.md)
- [Security Best Practices](../security/owasp-top10.md)
- [Architecture Patterns](../architecture/hexagonal-architecture.md)
