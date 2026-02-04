# Performance Analyzer

性能分析器用于系统性能调优、系统优化和性能分析。

## 功能

1. **性能分析**：分析系统性能瓶颈
2. **性能监控**：监控关键性能指标
3. **优化建议**：提供性能优化建议
4. **基准测试**：运行性能基准测试
5. **性能报告**：生成性能分析报告

## 使用方法

```typescript
import { PerformanceAnalyzer } from "./performance-analyzer";

// 创建性能分析器实例
const analyzer = new PerformanceAnalyzer();

// 分析性能
const analysis = analyzer.analyzePerformance({
  metrics: {
    responseTime: 1500,
    throughput: 100,
    errorRate: 0.01,
    cpuUsage: 80,
    memoryUsage: 70,
  },
  thresholds: {
    responseTime: 1000,
    throughput: 200,
    errorRate: 0.005,
  },
});

// 生成优化建议
const recommendations = analyzer.generateRecommendations(analysis);

// 运行基准测试
const benchmark = analyzer.runBenchmark({
  scenarios: ['rest-api', 'database-query', 'file-io'],
  iterations: 1000,
});

// 生成性能报告
const report = analyzer.generatePerformanceReport({
  analysis,
  recommendations,
  benchmark,
});
```

## API

### analyzePerformance(config: PerformanceConfig)

分析性能。

```typescript
const analysis = analyzer.analyzePerformance({
  metrics: {
    responseTime: 1500,
    throughput: 100,
    errorRate: 0.01,
  },
  thresholds: {
    responseTime: 1000,
    throughput: 200,
    errorRate: 0.005,
  },
});
// 返回：{ status, issues, bottlenecks }
```

### generateRecommendations(analysis: AnalysisResult)

生成优化建议。

```typescript
const recommendations = analyzer.generateRecommendations(analysis);
// 返回：{ priority, action, expectedImpact }
```

### runBenchmark(config: BenchmarkConfig)

运行基准测试。

```typescript
const benchmark = analyzer.runBenchmark({
  scenarios: ['rest-api', 'database-query'],
  iterations: 1000,
});
```

### generatePerformanceReport(config: ReportConfig)

生成性能报告。

```typescript
const report = analyzer.generatePerformanceReport({
  analysis,
  recommendations,
  benchmark,
});
```

## 数据类型

### PerformanceMetrics

性能指标数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| responseTime | number | 响应时间（ms） |
| throughput | number | 吞吐量（req/s） |
| errorRate | number | 错误率 |
| cpuUsage | number | CPU使用率（%） |
| memoryUsage | number | 内存使用率（%） |
