# Flow Coordinator

流程协调器负责协调12个阶段的开发流程，管理阶段间的数据传递、进度跟踪和质量控制。

## 功能

1. **阶段调度**：按顺序调度各阶段的执行
2. **数据传递**：将上一阶段的输出传递给下一阶段
3. **进度跟踪**：跟踪各阶段的进度和状态
4. **质量监控**：监控各阶段的质量指标
5. **异常处理**：处理阶段失败或阻塞情况
6. **资源协调**：协调各角色技能的调用和上下文管理

## 使用方法

```typescript
import { FlowCoordinator } from "@codebuddy/skills/product-development-flow/scripts/flow-coordinator";

// 创建流程协调器实例
const coordinator = new FlowCoordinator({
  projectContext: {
    name: "MyProject",
    startDate: new Date(),
    targetEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90天
  },
  stages: [
    "requirements-proposal",
    "requirements-analysis",
    "product-design",
    "ui-design",
    "frontend-development",
    "backend-development",
    "architecture-guarantee",
    "testing-verification",
    "documentation-delivery",
    "security-review",
    "test-framework-setup",
    "release-operations",
    "project-coordination",
  ],
});

// 启动流程
await coordinator.start();

// 获取当前进度
const progress = await coordinator.getProgress();
console.log(`当前阶段：${progress.currentStage}`);
console.log(`整体进度：${progress.overallProgress}%`);
```

## API

### start()

启动产品开发流程。

```typescript
await coordinator.start();
```

### transitionTo(stage: string)

手动转换到指定阶段。

```typescript
await coordinator.transitionTo("product-design");
```

### getProgress()

获取当前进度信息。

```typescript
const progress = await coordinator.getProgress();
// 返回：{ currentStage, overallProgress, stageStatuses }
```

### passArtifact(stage: string, artifact: any)

将上一阶段的输出传递给下一阶段。

```typescript
await coordinator.passArtifact("requirements-analysis", {
  requirementsSpec: spec,
  useCases: useCases,
});
```

### handleFailure(stage: string, failure: Error)

处理阶段失败。

```typescript
await coordinator.handleFailure("product-design", new Error("设计不可行"));
```

### getQualityMetrics()

获取所有阶段的质量指标。

```typescript
const metrics = await coordinator.getQualityMetrics();
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| projectContext | object | 必填 | 项目上下文信息 |
| stages | string[] | 必填 | 阶段列表 |
| autoTransition | boolean | true | 是否自动转换阶段 |
| qualityThresholds | object | - | 各阶段质量阈值 |
| maxReviewAttempts | number | 3 | 最大校对次数 |
| failOnCritical | boolean | false | 严重问题是否失败整个流程 |
