# Feature Generator

产品功能生成器用于帮助产品专家生成功能规格、优先级评估和产品路线图。

## 功能

1. **功能规格**：生成详细的功能规格说明
2. **优先级评估**：使用MoSCoW和Kano模型评估优先级
3. **产品路线图**：生成产品路线图
4. **业务规则**：定义和记录业务规则
5. **数据模型**：生成数据模型和字段定义

## 使用方法

```typescript
import { FeatureGenerator } from "./feature-generator";

// 创建功能生成器实例
const generator = new FeatureGenerator();

// 创建功能规格
const feature = generator.createFeature({
  id: 'F001',
  name: '用户登录',
  description: '允许用户通过用户名和密码登录系统',
  targetUsers: [
    { role: '普通用户', scenario: '访问个人账户', frequency: '每天' },
  ],
  businessRules: [
    {
      id: 'BR001',
      description: '密码至少8位，包含字母和数字',
      exceptionHandling: '提示用户重新输入',
    },
  ],
  priority: 'P0',
  moSCoWCategory: 'Must',
  kanoCategory: 'Basic',
});

// 生成功能规格文档
const spec = generator.generateFeatureSpec(feature);

// 评估优先级
const priorities = generator.evaluatePriorities([feature]);

// 生成产品路线图
const roadmap = generator.generateRoadmap([feature], {
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});
```

## API

### createFeature(config: FeatureConfig)

创建功能规格。

```typescript
const feature = generator.createFeature({
  id: 'F001',
  name: '用户登录',
  description: '允许用户通过用户名和密码登录系统',
  targetUsers: [...],
  businessRules: [...],
  priority: 'P0',
  moSCoWCategory: 'Must',
  kanoCategory: 'Basic',
});
```

### generateFeatureSpec(feature: Feature)

生成功能规格文档。

```typescript
const spec = generator.generateFeatureSpec(feature);
```

### evaluatePriorities(features: Feature[])

评估功能优先级。

```typescript
const priorities = generator.evaluatePriorities([feature1, feature2]);
// 返回：[{ id, priority, moSCoWCategory, kanoCategory, score }]
```

### generateRoadmap(features: Feature[], options: RoadmapOptions)

生成产品路线图。

```typescript
const roadmap = generator.generateRoadmap([feature1, feature2], {
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});
```

## 数据类型

### Feature

功能数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| id | string | 功能ID |
| name | string | 功能名称 |
| description | string | 功能描述 |
| targetUsers | TargetUser[] | 目标用户列表 |
| businessRules | BusinessRule[] | 业务规则列表 |
| priority | string | 优先级：P0/P1/P2/P3 |
| moSCoWCategory | string | MoSCoW分类：Must/Should/Could/Wont |
| kanoCategory | string | Kano分类：Basic/Performance/Excitement |

### BusinessRule

业务规则数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| id | string | 规则ID |
| description | string | 规则描述 |
| exceptionHandling | string | 异常处理方式 |
