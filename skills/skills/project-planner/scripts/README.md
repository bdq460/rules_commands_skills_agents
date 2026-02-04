# WBS Generator

工作分解结构（WBS）生成脚本用于生成项目计划、任务分解和甘特图。

## 功能

1. **WBS生成**：生成完整的工作分解结构
2. **任务分解**：将项目分解为可管理的任务
3. **项目计划**：生成项目计划和时间表
4. **甘特图**：生成甘特图（Mermaid格式）
5. **里程碑管理**：定义和管理项目里程碑

## 使用方法

```typescript
import { WBSGenerator } from "./wbs-generator";

// 创建WBS生成器实例
const generator = new WBSGenerator();

// 创建项目WBS
const wbs = generator.createWBS({
  project: '电商系统',
  version: '1.0',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  totalDuration: 180,
  phases: [
    {
      id: 'PH001',
      name: '需求分析',
      description: '收集和分析系统需求',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      tasks: [
        {
          id: 'T001',
          name: '用户调研',
          description: '收集用户需求和反馈',
          duration: 10,
          unit: 'days',
          dependencies: [],
          assignees: ['产品经理'],
          priority: 'high',
          status: 'pending',
          deliverables: ['用户调研报告'],
        },
      ],
      dependencies: [],
    },
  ],
  milestones: [
    {
      id: 'M001',
      name: '需求确认',
      date: '2024-01-31',
      description: '完成需求分析和确认',
      dependencies: ['PH001'],
    },
  ],
});

// 生成甘特图
const gantt = generator.generateGantt(wbs);

// 生成项目计划
const plan = generator.generateProjectPlan(wbs);
```

## API

### createWBS(config: WBSConfig)

创建工作分解结构。

```typescript
const wbs = generator.createWBS({
  project: '电商系统',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  phases: [...],
  milestones: [...],
});
```

### generateGantt(wbs: WBS)

生成甘特图（Mermaid格式）。

```typescript
const gantt = generator.generateGantt(wbs);
```

### generateProjectPlan(wbs: WBS)

生成项目计划文档。

```typescript
const plan = generator.generateProjectPlan(wbs);
```

### calculateCriticalPath(wbs: WBS)

计算关键路径。

```typescript
const criticalPath = generator.calculateCriticalPath(wbs);
```

## 数据类型

### Task

任务数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| id | string | 任务ID |
| name | string | 任务名称 |
| description | string | 任务描述 |
| duration | number | 持续时间 |
| unit | string | 单位：days/hours |
| dependencies | string[] | 依赖任务ID列表 |
| assignees | string[] | 负责人列表 |
| priority | string | 优先级：critical/high/medium/low |
| status | string | 状态：pending/in-progress/completed |
| deliverables | string[] | 交付物列表 |

### Milestone

里程碑数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| id | string | 里程碑ID |
| name | string | 里程碑名称 |
| date | string | 目标日期 |
| description | string | 描述 |
| dependencies | string[] | 依赖的阶段/任务ID |
