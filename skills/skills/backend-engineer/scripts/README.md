# API Generator

API代码生成器根据数据模型生成RESTful API代码。

## 功能

1. **控制器生成**：根据数据模型生成REST控制器代码
2. **服务层生成**：生成业务逻辑服务层
3. **路由生成**：自动生成API路由配置
4. **数据验证**：生成请求体验证逻辑
5. **错误处理**：生成标准化的错误处理中间件

## 使用方法

```typescript
import { ApiGenerator } from "./api-generator";

// 创建API生成器实例
const generator = new ApiGenerator({
  language: 'typescript',
  framework: 'express',
  outputDir: './src/api',
  generateTests: true,
});

// 定义数据模型
const userModel = {
  name: 'User',
  tableName: 'users',
  fields: [
    { name: 'id', type: 'number', required: true, unique: true },
    { name: 'name', type: 'string', required: true },
    { name: 'email', type: 'string', required: true, unique: true },
  ],
  timestamps: true,
};

// 生成控制器代码
const controller = generator.generateController(userModel);

// 生成服务层代码
const service = generator.generateService(userModel);

// 生成路由代码
const routes = generator.generateRoutes(userModel);
```

## API

### generateController(model: Model)

生成控制器代码。

```typescript
const controller = generator.generateController(userModel);
```

### generateService(model: Model)

生成服务层代码。

```typescript
const service = generator.generateService(userModel);
```

### generateRoutes(model: Model)

生成路由代码。

```typescript
const routes = generator.generateRoutes(userModel);
```

### generateAll(model: Model)

生成完整的API代码（控制器、服务、路由）。

```typescript
const apiCode = generator.generateAll(userModel);
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| language | string | 'typescript' | 编程语言：typescript/javascript |
| framework | string | 'express' | Web框架：express/fastify/nest |
| outputDir | string | - | 输出目录 |
| generateTests | boolean | false | 是否生成测试代码 |
