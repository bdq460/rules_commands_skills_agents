# Coordinator

项目协调器用于协调虚拟AI团队的技能调用顺序、上下文传递、状态管理和错误处理。

## 功能

1. **技能调度**：协调多个技能的调用顺序
2. **上下文管理**：管理各技能间的上下文传递
3. **状态跟踪**：跟踪项目执行状态
4. **错误处理**：处理技能执行中的错误
5. **结果汇总**：汇总各技能的输出结果

## 使用方法

```typescript
import { Coordinator } from "./coordinator";

// 创建协调器实例
const coordinator = new Coordinator({
  projectName: 'Shell Formatter',
  skills: [
    'customer-representative',
    'requirements-analyst',
    'product-expert',
    'frontend-engineer',
    'backend-engineer',
  ],
});

// 执行技能流程
const result = await coordinator.execute({
  initialContext: {
    projectName: 'Shell Formatter',
    requirements: '智能Shell脚本格式化和错误检查工具',
  },
  workflow: [
    { skill: 'customer-representative', action: 'collectRequirements' },
    { skill: 'requirements-analyst', action: 'analyzeRequirements' },
    { skill: 'product-expert', action: 'designFeatures' },
    { skill: 'frontend-engineer', action: 'implementUI' },
    { skill: 'backend-engineer', action: 'implementAPI' },
  ],
});

// 获取执行状态
const status = coordinator.getStatus();

// 获取执行结果
const outputs = coordinator.getOutputs();
```

## API

### execute(config: WorkflowConfig)

执行技能流程。

```typescript
const result = await coordinator.execute({
  initialContext: {
    projectName: 'Shell Formatter',
    requirements: '智能Shell脚本格式化和错误检查工具',
  },
  workflow: [
    { skill: 'customer-representative', action: 'collectRequirements' },
    { skill: 'requirements-analyst', action: 'analyzeRequirements' },
  ],
});
```

### getStatus()

获取执行状态。

```typescript
const status = coordinator.getStatus();
// 返回：{ currentSkill, completedSkills, failedSkills, ... }
```

### getOutputs()

获取执行结果。

```typescript
const outputs = coordinator.getOutputs();
// 返回：{ [skillName]: { action, output, status } }
```

### handleError(skill: string, error: Error)

处理错误。

```typescript
coordinator.handleError('frontend-engineer', new Error('组件生成失败'));
```

## 配置选项

### CoordinatorOptions

协调器配置选项。

| 字段 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| projectName | string | - | 项目名称 |
| skills | string[] | [] | 技能列表 |
| maxRetries | number | 3 | 最大重试次数 |
| parallel | boolean | false | 是否并行执行 |
