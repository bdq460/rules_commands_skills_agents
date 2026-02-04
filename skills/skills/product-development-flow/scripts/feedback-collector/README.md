# Feedback Collector

反馈收集器负责收集来自各阶段的反馈，包括客户反馈、内部评审反馈和用户反馈。

## 功能

1. **需求反馈**：收集客户对需求和产品的反馈
2. **设计反馈**：收集用户对设计的反馈
3. **开发反馈**：收集测试人员和QA对实现的反馈
4. **文档反馈**：收集用户对文档的反馈
5. **运维反馈**：收集生产环境的反馈和问题
6. **反馈分类**：自动分类反馈（功能、性能、UX、Bug等）
7. **反馈优先级**：根据影响程度设置优先级
8. **反馈跟踪**：跟踪反馈的处理状态

## 使用方法

```typescript
import { FeedbackCollector } from "@codebuddy/skills/product-development-flow/scripts/feedback-collector";

// 创建反馈收集器
const collector = new FeedbackCollector({
  storageDir: "./feedback",
  autoClassification: true,
  notificationEnabled: true,
});

// 收集需求阶段反馈
await collector.collect("requirements-proposal", {
  source: "customer",
  category: "requirements",
  priority: "high",
  content: "需要增加更多功能...",
});

// 查看反馈汇总
const summary = await collector.getSummary();
console.log(`总反馈数：${summary.total}`);
console.log(`待处理：${summary.pending}`);
```

## API

### collect(stage: string, feedback: Feedback)

收集反馈。

```typescript
await collector.collect("ui-design", {
  source: "user",
  category: "ux",
  priority: "medium",
  content: "按钮位置不明显",
});
```

### getSummary()

获取反馈汇总统计。

```typescript
const summary = await collector.getSummary();
// 返回：{ total, pending, processing, completed, byCategory, byPriority }
```

### processFeedback(feedbackId: string, action: 'resolve' | 'reject' | 'defer')

处理反馈。

```typescript
await collector.processFeedback("FB-001", "resolve");
```

### getFeedbackByStage(stage: string)

按阶段获取反馈。

```typescript
const feedbacks = await collector.getFeedbackByStage("product-design");
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| storageDir | string | "./feedback" | 反馈存储目录 |
| autoClassification | boolean | true | 是否自动分类反馈 |
| notificationEnabled | boolean | true | 是否启用通知 |
| categories | string[] | ['feature', 'bug', 'performance', 'ux', 'doc'] | 反馈分类 |
| priorities | string[] | ['critical', 'high', 'medium', 'low'] | 优先级 |
