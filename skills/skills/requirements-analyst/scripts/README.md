# Requirements Analyzer

需求分析器用于帮助需求分析师进行需求建模、用例分析和需求验证。

## 功能

1. **需求建模**：创建结构化的需求模型
2. **用户故事**：生成用户故事和验收标准
3. **用例分析**：生成详细的用例描述
4. **需求验证**：验证需求的完整性和一致性
5. **优先级评估**：评估需求的优先级和MoSCoW分类

## 使用方法

```typescript
import { RequirementsAnalyzer } from "./requirements-analyzer";

// 创建需求分析器实例
const analyzer = new RequirementsAnalyzer();

// 创建用户故事
const userStory = analyzer.createUserStory({
  id: 'US001',
  role: '用户',
  goal: '登录系统',
  benefit: '可以访问系统功能',
  acceptanceCriteria: [
    '用户输入正确的用户名和密码',
    '系统验证用户信息',
    '登录成功后跳转到首页',
  ],
  priority: '高',
  estimatedPoints: 3,
});

// 创建用例
const useCase = analyzer.createUseCase({
  id: 'UC001',
  name: '用户登录',
  description: '用户通过用户名和密码登录系统',
  actor: '用户',
  preconditions: ['用户已注册'],
  postconditions: ['用户成功登录'],
  steps: [
    {
      stepNumber: 1,
      actorAction: '输入用户名和密码',
      systemResponse: '验证用户信息',
    },
  ],
});

// 验证需求
const validation = analyzer.validateRequirements([userStory, useCase]);
```

## API

### createUserStory(story: UserStory)

创建用户故事。

```typescript
const story = analyzer.createUserStory({
  id: 'US001',
  role: '用户',
  goal: '登录系统',
  benefit: '可以访问系统功能',
  acceptanceCriteria: [...],
  priority: '高',
});
```

### createUseCase(useCase: UseCase)

创建用例。

```typescript
const useCase = analyzer.createUseCase({
  id: 'UC001',
  name: '用户登录',
  description: '用户通过用户名和密码登录系统',
  actor: '用户',
  preconditions: ['用户已注册'],
  postconditions: ['用户成功登录'],
  steps: [...],
});
```

### validateRequirements(requirements: Requirement[])

验证需求的完整性和一致性。

```typescript
const validation = analyzer.validateRequirements([userStory, useCase]);
// 返回：{ isValid, errors, warnings }
```

### prioritizeRequirements(requirements: Requirement[])

评估需求优先级（MoSCoW分类）。

```typescript
const priorities = analyzer.prioritizeRequirements([userStory]);
// 返回：[{ id, priority, moSCoWCategory, kanoCategory, ... }]
```

## 数据类型

### UserStory

用户故事数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| id | string | 用户故事ID |
| role | string | 用户角色 |
| goal | string | 目标 |
| benefit | string | 收益 |
| acceptanceCriteria | string[] | 验收标准 |
| priority | string | 优先级：高/中/低 |
| estimatedPoints | number | 估算点数 |

### UseCase

用例数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| id | string | 用例ID |
| name | string | 用例名称 |
| description | string | 描述 |
| actor | string | 参与者 |
| preconditions | string[] | 前置条件 |
| postconditions | string[] | 后置条件 |
| steps | UseCaseStep[] | 步骤列表 |
