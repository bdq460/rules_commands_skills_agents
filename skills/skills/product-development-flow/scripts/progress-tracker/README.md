# Progress Tracker

进度跟踪器负责跟踪产品开发流程的整体进度，提供可视化的进度报告和预警。

## 功能

1. **进度跟踪**：实时跟踪各阶段的进度
2. **里程碑管理**：定义和跟踪关键里程碑
3. **预警机制**：进度延迟或风险预警
4. **时间估算**：跟踪实际耗时与估算对比
5. **资源利用率**：监控各角色的资源使用情况
6. **进度报告**：生成各种格式的进度报告

## 使用方法

```typescript
import { ProgressTracker } from "@codebuddy/skills/product-development-flow/scripts/progress-tracker";

// 创建进度跟踪器
const tracker = new ProgressTracker({
  milestones: [
    {
      name: "MVP完成",
      targetDate: new Date("2024-03-01"),
      stages: ["requirements-proposal", "product-design", "ui-design", "frontend-development", "backend-development"],
    },
    {
      name: "正式发布",
      targetDate: new Date("2024-06-01"),
      stages: ["architecture-guarantee", "testing-verification", "documentation-delivery", "security-review", "test-framework-setup", "release-operations"],
    },
  ],
});

// 获取进度
const progress = await tracker.getProgress();
console.log(`整体进度：${progress.overallProgress}%`);
console.log(`预计完成日期：${progress.estimatedCompletionDate}`);
```

## API

### getProgress()

获取当前整体进度。

```typescript
const progress = await tracker.getProgress();
// 返回：{ overallProgress, completedStages, inProgressStages, milestonesStatus, riskLevel }
```

### getStageProgress(stageName: string)

获取指定阶段的进度。

```typescript
const stageProgress = await tracker.getStageProgress("ui-design");
// 返回：{ stage, progress, status, actualDuration, estimatedDuration, variance }
```

### updateStageProgress(stageName: string, progress: number)

更新阶段进度。

```typescript
await tracker.updateStageProgress("ui-design", 75);
```

### checkRisks()

检查项目风险（进度延迟、质量不达标等）。

```typescript
const risks = await tracker.checkRisks();
// 返回：{ risks, riskLevel, recommendations }
```

### generateReport(format: 'json' | 'markdown' | 'html')

生成进度报告。

```typescript
const report = await tracker.generateReport("markdown");
console.log(report);
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| milestones | Milestone[] | 必填 | 里程碑列表 |
| warningThreshold | number | 80 | 预警阈值（%） |
| criticalThreshold | number | 60 | 严重阈值（%） |
| timeVarianceThreshold | number | 20 | 时间偏差阈值（%） |
| enableNotifications | boolean | true | 是否启用通知 |
| reportFrequency | number | 1 | 报告频率（天） |
