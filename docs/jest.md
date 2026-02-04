# Jest 配置手册

> **文档定位**：本手册记录 Jest 测试框架的配置方法、相关工具链知识。
>
> **适用场景**：TypeScript + Jest + ESM 项目的测试配置参考。
>
> **内容规划**：
>
> - 路径映射配置（package.json / tsconfig.json / jest.config.js）
> - 类型声明文件（.d.ts）
> - 测试环境设置
> - 覆盖率配置
> - Mock 技巧

---

## 路径映射(Path Mapping)

### 路径映射的概念

路径映射是一种将模块标识符映射到实际文件路径的技术，可以简化模块导入路径，提高代码可读性。
例如，使用 `#/utils/helper` 代替相对路径 `../../utils/helper`：

### 三种路径映射配置对比

在TypeScript、Jest、Node.js三者中，分别有三种路径映射配置。
其作用时机、用途不同，需要根据实际需求进行选择。

| 配置 | 工具 | 作用时机 | 用途 |
| :--- | :--- | :--- | :--- |
| `package.json` - `imports` | Node.js | 运行时 | 为 ESM 模块提供路径别名支持，影响实际代码运行 |
| `tsconfig.json` - `paths` | TypeScript | 编译时 | 为 TypeScript 提供路径别名支持，影响类型检查和 IDE 自动补全 |
| `jest.config.js` - `moduleNameMapper` | Jest | 测试运行时 | 为 Jest 测试提供路径别名支持，影响测试模块解析 |

#### 1. package.json - imports

- **作用时机**：Node.js 运行时
- **用途**：为 ESM 模块提供路径别名支持，影响实际代码运行
- **示例**：`"#/utils/helper": "./skills/utils/helper"`

#### 2. tsconfig.json - paths

- **作用时机**：TypeScript 编译时
- **用途**：为 TypeScript 提供路径别名支持，影响类型检查和 IDE 自动补全
- **示例**：`"#/*": ["./skills/*"]`
- **注意**：可以配合 `baseUrl` 使用，`baseUrl` 指定路径解析的基准目录。但 `baseUrl` 将在 TypeScript 7.0 中被弃用，建议直接使用相对路径。

#### 3. jest.config.js - moduleNameMapper

- **作用时机**：Jest 测试运行时
- **用途**：为 Jest 测试提供路径别名支持，影响测试模块解析
- **规则**：`^` 表示正则表达式，`$` 表示字符串结尾，`<rootDir>` 表示项目根目录, `$1` 表示第一个捕获组, 即 `#/` 后面的部分。
- **示例**：`"^#/(.*)$": "<rootDir>/skills/$1"`
- **注意**：Jest在运行时只依赖`jest.config.js`的`moduleNameMapper`配置，不依赖`package.json`和`tsconfig.json`的路径映射配置。

**关键点**：三者相互独立，必须同时配置。

---

## 配置示例

### 1. package.json

```json
{
    "type": "module",
    "imports": {
        "#*": "./skills/scripts/*"
    }
}
```

### 2. tsconfig.json

```json
{
    "compilerOptions": {
        "baseUrl": "./",
        "paths": {
            "#/*": ["./skills/*"]
        }
    }
}
```

### 3. jest.config.js

```javascript
module.exports = {
    moduleNameMapper: {
        '^#/(.*)$': '<rootDir>/skills/$1'
    }
};
```

---

## 工作流程

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1.编写代码  │ --> │ 2.TypeScript │ --> │  3.Jest测试  │ --> │ 4.Node.js   │
│             │     │    编译      │     │   运行       │     │   运行      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       ↓                   ↓                   ↓                   ↓
  使用 #/别名        tsconfig.json       jest.config.js      package.json
  导入模块            paths 配置         moduleNameMapper     imports 配置
       │                   │                   │                   │
       ↓                   ↓                   ↓                   ↓
  示例：              解析为：             解析为：              解析为：
  #/utils/helper  ./skills/utils/helper  <rootDir>/skills/...  ./skills/...
```

### 各阶段说明

| 阶段 | 工具 | 配置 | 输出 |
|------|------|------|------|
| 编译时 | TypeScript | `tsconfig.json` - `paths` | 类型检查通过 ✅ |
| 测试时 | Jest | `jest.config.js` - `moduleNameMapper` | 测试执行通过 ✅ |
| 运行时 | Node.js | `package.json` - `imports` | 程序正常运行 ✅ |

---

## 最佳实践

1. **统一前缀**：`#/` 项目内部，`@/` 源代码
2. **保持同步**：修改时同时更新三个配置
3. **使用相对路径**：避免硬编码绝对路径
4. **类型配置**：优先使用 `tsconfig.json` 的 `types` 配置

--

### 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| TS能找到，Jest报错 | moduleNameMapper未配置 | 配置jest.config.js |
| Jest能找到，TS报错 | paths未配置 | 配置tsconfig.json |
| Node运行报错 | imports未配置 | 配置package.json |

---

## .d.ts 声明文件

### 作用描述

TypeScript 声明文件（`.d.ts`）**只包含类型信息，不包含实际代码实现**。用于：

- 为 JavaScript 库提供 TypeScript 类型支持
- 声明全局变量和函数
- 扩展已有模块的类型定义

### 主要用途

#### 1. 类型声明

为 JS 库提供 TS 类型：

```typescript
// lodash.d.ts
declare function debounce(fn: Function, wait: number): Function;
declare function throttle(fn: Function, limit: number): Function;
```

#### 2. 全局变量声明

```typescript
// global.d.ts
declare const __VERSION__: string;
declare const __DEV__: boolean;

// 可在任何文件直接使用
console.log(__VERSION__);
```

#### 3. 模块扩展

```typescript
// vue.d.ts
declare module 'vue' {
    interface ComponentCustomProperties {
        $myMethod(): void;
    }
}
```

### 如何使用

在 TypeScript 项目中，`.d.ts` 文件会自动被识别：

- 放在项目根目录或 `src/` 目录下
- 在 `tsconfig.json` 的 `include` 中指定
- 通过 `/// <reference path="./types.d.ts" />` 显式引用

### 与 tsconfig.json types 的关系

**方式1：tsconfig.json 配置（推荐）**

```json
{
    "compilerOptions": {
        "types": ["jest", "node"]
    }
}
```

- 自动加载 `node_modules/@types/jest/index.d.ts`
- 整个项目生效

**方式2：创建 jest.d.ts 文件**

```typescript
/// <reference types="jest" />
```

- 显式声明需要 Jest 类型
- 仅影响所在目录及子目录

**注意**：两种方式功能重复，配置 `"types": ["jest"]` 已足够，无需额外创建 `.d.ts` 文件。

---

## 测试环境设置 (setupFilesAfterEnv)

### 什么是 setupFilesAfterEnv

`setupFilesAfterEnv` 是 Jest 配置中的一个选项，用于指定**在每个测试文件执行之前**需要加载的设置文件。这些文件会在 Jest 测试框架初始化之后、测试代码执行之前运行。

**典型用途**：

- 初始化全局测试工具
- 配置测试环境变量
- 注册生命周期钩子（beforeAll, beforeEach, afterEach, afterAll）
- 设置全局 mock 或 polyfill
- 初始化测试数据库连接

### 为什么使用 .ts 文件而不是 .js 文件

在 ESM + TypeScript 项目中，`setupFilesAfterEnv` 指定的文件**必须**使用 `.ts` 扩展名，原因如下：

#### 1. Jest 的加载时机问题

```text
Jest 执行流程：
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  1. 加载配置     │ -> │ 2. 执行 setup   │ -> │ 3. 运行测试     │
│  jest.config.js │    │  jest.setup.ts  │    │  *.test.ts      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                      │
         ↓                      ↓                      ↓
   使用 ts-jest 转换      如果是 .js 文件：        使用 ts-jest 转换
                         - 不经过转换器
                         - 直接执行原始代码
                         - ESM 语法报错 ❌
```

#### 2. 具体错误示例

如果使用 `jest.setup.js` 并包含 ES Module 语法：

```javascript
// jest.setup.js
import { join } from 'path';  // ❌ SyntaxError: Cannot use import statement
import { existsSync } from 'fs';
```

错误信息：

```text
SyntaxError: Cannot use import statement outside a module
    at Runtime.createScriptFromCode (...)
```

#### 3. 解决方案对比

| 方案 | 文件扩展名 | 转换器 | 结果 |
|------|-----------|--------|------|
| 使用 `.js` 文件 | `.js` | 不经过 ts-jest | ❌ ESM 语法报错 |
| 使用 `.ts` 文件 | `.ts` | 经过 ts-jest | ✅ 正常执行 |
| 使用 CommonJS | `.js` | 不经过 ts-jest | ✅ 但不符合项目规范 |

**结论**：在 `"type": "module"` 的 TypeScript 项目中，必须使用 `.ts` 扩展名让 ts-jest 正确转换 ES Module 语法。

### jest.setup.ts 详解

`jest.setup.ts` 是 Jest 的测试环境设置文件，用于配置测试全局环境和生命周期钩子。

#### 文件结构

```typescript
// 1. 生命周期钩子
beforeAll(async () => { ... });   // 所有测试前执行一次
beforeEach(() => { ... });        // 每个测试前执行
afterEach(async () => { ... });   // 每个测试后执行
afterAll(async () => { ... });    // 所有测试后执行一次
```

#### 核心功能

**1. 生命周期钩子**

```typescript
// beforeAll: 所有测试开始前执行一次
beforeAll(async () => {
    // - 设置测试超时时间 (30秒)
    // - 设置 NODE_ENV = 'test'
});

// beforeEach: 每个测试开始前执行
beforeEach(() => {
    // - 清除所有 mock
});

// afterEach: 每个测试结束后执行
afterEach(async () => {
    // - 清理临时资源
});

// afterAll: 所有测试结束后执行一次
afterAll(async () => {
    // - 清理全局资源
});
```

**2. 测试超时设置 (jest.setTimeout)**

`jest.setTimeout(ms)` 用于设置**单个测试函数**的最大运行时长，超过该时间测试将自动失败。

```typescript
beforeAll(() => {
    jest.setTimeout(30000);  // 30 秒超时
});
```

**作用范围**：

| 设置位置 | 影响范围 | 示例 |
|----------|----------|------|
| `jest.setup.ts` 的 `beforeAll` | 所有测试文件的所有测试函数 | 全局默认 30 秒 |
| `describe` 块内 | 该块内的所有测试函数 | API 测试 60 秒 |
| 单个 `it/test` 内 | 仅该测试函数 | 大文件处理 120 秒 |

**示例**：

```typescript
describe('API Tests', () => {
    jest.setTimeout(60000);  // API 测试需要更长时间

    it('should fetch large data', async () => {
        // 60 秒超时
    });
});

describe('Unit Tests', () => {
    it('should process large file', async () => {
        jest.setTimeout(120000);  // 仅这个测试：120 秒
        // ...
    });
});
```

**5. 环境变量 NODE_ENV**

`process.env.NODE_ENV` 是 Node.js 生态的**约定俗成的标准环境变量**，用于标识当前运行环境。

**标准取值**：

| 值 | 含义 | 典型行为 |
|----|------|---------|
| `development` | 开发环境 | 启用热更新、详细错误信息、调试工具 |
| `production` | 生产环境 | 启用优化、禁用调试、最小化输出 |
| `test` | 测试环境 | 使用测试数据库、禁用外部服务调用 |

**在测试环境中的用途**：

```typescript
beforeAll(() => {
    process.env.NODE_ENV = 'test';
});
```

1. **环境识别**：让代码知道当前是测试环境
2. **避免副作用**：防止测试时调用生产服务（如发送真实邮件、支付接口）
3. **配置切换**：加载测试专用配置（数据库、API 地址等）
4. **库行为调整**：第三方库根据 NODE_ENV 改变行为

**代码中使用示例**：

```typescript
// 只在非测试环境发送真实邮件
if (process.env.NODE_ENV !== 'test') {
    await sendRealEmail(userEmail);
}

// 测试环境使用内存数据库
const db = process.env.NODE_ENV === 'test'
    ? new MemoryDB()
    : new RealDB();

// 调试日志
if (process.env.NODE_ENV === 'test' && process.env.DEBUG) {
    console.debug('详细调试信息');
}
```

**6. 环境变量 DEBUG**

设置 `DEBUG=true` 可启用详细日志输出：

```bash
DEBUG=true npm test
```

输出示例：

```text
[ jest.setup ] 测试环境初始化完成
  时间: 2024-01-15T10:30:00.000Z

[ RUN ] should calculate correctly
[ DONE ] should calculate correctly (5ms)

==================================================
[ jest.setup ] 测试套件执行完成
==================================================
  总测试数: 10
  通过: 10
  失败: 0
  跳过: 0
  套件执行时间: 150ms
  总耗时: 150ms
==================================================
```

#### 配置方式

在 `jest.config.js` 中配置：

```javascript
export default {
    // 使用 .ts 扩展名！
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // 确保 ts-jest 转换 TypeScript 文件
    preset: 'ts-jest/presets/default-esm',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            useESM: true,
            tsconfig: '<rootDir>/test/tsconfig.json'
        }]
    },
};
```

### 测试环境设置最佳实践

1. **始终使用 `.ts` 扩展名**：确保 ts-jest 正确转换 ES Module 语法
2. **在 `beforeAll` 中初始化**：避免在模块级别执行副作用操作
3. **使用 `afterAll` 清理资源**：确保测试结束后清理临时文件和目录
4. **避免在 setup 中导入被测代码**：防止循环依赖问题
