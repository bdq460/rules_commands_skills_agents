# Documentation Generator

文档生成器用于生成产品文档、API文档和用户手册。

## 功能

1. **产品文档**：生成产品介绍、功能说明
2. **API文档**：生成API接口文档
3. **用户手册**：生成用户操作手册
4. **开发文档**：生成开发指南和架构文档
5. **FAQ文档**：生成常见问题解答

## 使用方法

```typescript
import { DocumentationGenerator } from "./documentation-generator";

// 创建文档生成器实例
const generator = new DocumentationGenerator();

// 生成产品文档
const productDoc = generator.generateProductDocumentation({
  productName: 'Shell Formatter',
  version: '1.0.0',
  description: '智能Shell脚本格式化和错误检查工具',
  features: [
    'Shell脚本自动格式化',
    'Shellcheck错误检测',
    'VS Code集成',
  ],
});

// 生成API文档
const apiDoc = generator.generateAPIDocumentation({
  endpoints: [
    {
      method: 'POST',
      path: '/api/format',
      description: '格式化Shell脚本',
      parameters: [...],
      responses: [...],
    },
  ],
});

// 生成用户手册
const userManual = generator.generateUserManual({
  title: 'Shell Formatter 用户手册',
  sections: [
    { title: '安装', content: '...' },
    { title: '使用', content: '...' },
    { title: '配置', content: '...' },
  ],
});
```

## API

### generateProductDocumentation(config: ProductDocConfig)

生成产品文档。

```typescript
const doc = generator.generateProductDocumentation({
  productName: 'Shell Formatter',
  version: '1.0.0',
  description: '智能Shell脚本格式化和错误检查工具',
  features: ['Shell脚本自动格式化', 'Shellcheck错误检测'],
});
```

### generateAPIDocumentation(config: APIDocConfig)

生成API文档。

```typescript
const apiDoc = generator.generateAPIDocumentation({
  endpoints: [
    {
      method: 'POST',
      path: '/api/format',
      description: '格式化Shell脚本',
      parameters: [...],
      responses: [...],
    },
  ],
});
```

### generateUserManual(config: UserManualConfig)

生成用户手册。

```typescript
const manual = generator.generateUserManual({
  title: 'Shell Formatter 用户手册',
  sections: [
    { title: '安装', content: '...' },
    { title: '使用', content: '...' },
  ],
});
```

### generateFAQ(config: FAQConfig)

生成FAQ文档。

```typescript
const faq = generator.generateFAQ({
  questions: [
    {
      question: '如何安装Shell Formatter？',
      answer: '通过VS Code扩展市场安装...',
    },
  ],
});
```

## 数据类型

### ProductDocConfig

产品文档配置。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| productName | string | 产品名称 |
| version | string | 版本号 |
| description | string | 产品描述 |
| features | string[] | 功能列表 |
