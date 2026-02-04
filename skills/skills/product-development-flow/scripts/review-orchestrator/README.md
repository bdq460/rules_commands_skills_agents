# Review Orchestrator

校对编排器负责管理各阶段的校对流程，包括自审、交叉审查和最终确认。

## 功能

1. **自审触发**：每个阶段完成后自动触发自审
2. **交叉审查**：安排下一阶段或相关角色进行交叉审查
3. **审查通知**：及时通知相关人员参与审查
4. **审查决策**：记录审查决策（通过/不通过/需修改）
5. **审查限制**：控制每个阶段最多3次校对
6. **审查记录**：完整记录审查过程和结果

## 使用方法

```typescript
import { ReviewOrchestrator } from "@codebuddy/skills/product-development-flow/scripts/review-orchestrator";

// 创建校对编排器
const orchestrator = new ReviewOrchestrator({
  maxReviewAttempts: 3,
  autoTransition: true,
  notifyParticipants: true,
});

// 触发自审
await orchestrator.triggerSelfReview("product-design");

// 查看审查状态
const status = await orchestrator.getReviewStatus("product-design");
console.log(`审查状态：${status.status} (${status.attempt}/${status.maxAttempts})`);
```

## API

### triggerSelfReview(stage: string)

触发阶段的自审。

```typescript
await orchestrator.triggerSelfReview("requirements-analysis");
```

### getReviewStatus(stage: string)

获取阶段的审查状态。

```typescript
const status = await orchestrator.getReviewStatus("ui-design");
// 返回：{ status, attempt, maxAttempts, decisions, comments }
```

### addComment(stage: string, comment: string)

添加审查评论。

```typescript
await orchestrator.addComment("product-design", "建议简化交互流程");
```

### recordDecision(stage: string, decision: 'pass' | 'fail' | 'needs-revision')

记录审查决策。

```typescript
await orchestrator.recordDecision("product-design", "pass");
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| maxReviewAttempts | number | 3 | 最大校对次数 |
| autoTransition | boolean | true | 审查通过后是否自动进入下一阶段 |
| notifyParticipants | boolean | true | 是否通知审查参与者 |
| reviewerAssignment | object | - | 审查者分配规则 |
| approvalWorkflow | 'strict' | 'loose' | 审批流程严格度 |
