# Schema Generator

数据库Schema生成脚本根据数据模型生成数据库Schema、ER图、迁移脚本等。

## 功能

1. **Schema生成**：生成数据库表结构定义
2. **迁移脚本**：生成数据库迁移脚本
3. **ER图生成**：生成实体关系图
4. **索引优化**：生成索引优化建议
5. **关系定义**：生成表关系定义（一对一、一对多、多对多）

## 使用方法

```typescript
import { SchemaGenerator } from "./schema-generator";

// 创建Schema生成器实例
const generator = new SchemaGenerator({
  database: 'postgresql',
  outputDir: './database',
  generateMigration: true,
});

// 定义数据模型
const userModel = {
  name: 'User',
  tableName: 'users',
  fields: [
    {
      name: 'id',
      type: 'number',
      required: true,
      primaryKey: true,
      indexed: true,
    },
    {
      name: 'name',
      type: 'string',
      required: true,
    },
    {
      name: 'email',
      type: 'string',
      required: true,
      unique: true,
      indexed: true,
    },
  ],
  indexes: [
    {
      name: 'idx_user_email',
      fields: ['email'],
      unique: true,
    },
  ],
};

// 生成Schema
const schema = generator.generateSchema([userModel]);

// 生成迁移脚本
const migration = generator.generateMigration(userModel);

// 生成ER图
const erd = generator.generateERD([userModel]);
```

## API

### generateSchema(models: Model[])

生成数据库Schema。

```typescript
const schema = generator.generateSchema([userModel, postModel]);
```

### generateMigration(model: Model)

生成数据库迁移脚本。

```typescript
const migration = generator.generateMigration(userModel);
```

### generateERD(models: Model[])

生成实体关系图（Mermaid格式）。

```typescript
const erd = generator.generateERD([userModel, postModel]);
```

### generateIndexes(models: Model[])

生成索引优化建议。

```typescript
const indexes = generator.generateIndexes([userModel]);
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| database | string | 'postgresql' | 数据库类型：postgresql/mysql/mongodb/sqlite |
| outputDir | string | - | 输出目录 |
| generateMigration | boolean | true | 是否生成迁移脚本 |
| generateERD | boolean | true | 是否生成ER图 |
