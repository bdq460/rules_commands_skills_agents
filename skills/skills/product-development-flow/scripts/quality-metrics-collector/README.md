# Quality Metrics Collector

质量指标收集器负责收集和统计各阶段的质量指标，用于评估项目质量。

## 功能

1. **指标收集**：自动收集各阶段的质量指标
2. **指标计算**：根据收集的数据计算综合质量评分
3. **趋势分析**：分析质量指标的趋势和变化
4. **阈值告警**：指标低于阈值时触发告警
5. **报告生成**：生成质量分析报告
6. **基准对比**：与历史项目或行业基准对比

## 使用方法

```typescript
import { QualityMetricsCollector } from "@codebuddy/skills/product-development-flow/scripts/quality-metrics-collector";

// 创建质量指标收集器
const collector = new QualityMetricsCollector({
  thresholds: {
    clarity: 95,
    completeness: 100,
    feasibility: 100,
  },
});

// 记录质量指标
await collector.recordMetric("requirements-analysis", "clarity", 97);
await collector.recordMetric("product-design", "completeness", 98);

// 获取质量报告
const report = await collector.getReport();
console.log(`整体质量评分：${report.overallScore}`);
```

## API

### recordMetric(stage: string, metric: string, value: number)

记录质量指标。

```typescript
await collector.recordMetric("ui-design", "brandCompliance", 92);
```

### getStageMetrics(stage: string)

获取指定阶段的所有指标。

```typescript
const metrics = await collector.getStageMetrics("frontend-development");
// 返回：{ metric1: value, metric2: value, ... }
```

### getOverallMetrics()

获取整体质量指标汇总。

```typescript
const overall = await collector.getOverallMetrics();
// 返回：{ overallScore, stageScores, trendAnalysis }
```

### getReport()

生成质量报告。

```typescript
const report = await collector.getReport("markdown");
console.log(report);
```

### checkThresholds()

检查指标是否达到阈值。

```typescript
const alert = await collector.checkThresholds();
if (alert.hasAlerts) {
  console.log("触发告警：", alert.alerts);
}
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| thresholds | object | - | 各阶段质量阈值 |
| enableAlerts | boolean | true | 是否启用阈值告警 |
| trendAnalysisDays | number | 30 | 趋势分析天数 |
| reportFormats | string[] | ['json', 'markdown', 'html'] | 报告格式 |
| benchmarkComparison | boolean | true | 是否与基准对比 |
