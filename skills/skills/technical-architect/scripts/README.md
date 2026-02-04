# Architecture Validator

架构验证器用于验证系统架构设计、评估架构质量并提出改进建议。

## 功能

1. **架构验证**：验证架构设计是否符合规范
2. **质量评估**：评估架构质量（可维护性、可扩展性等）
3. **依赖分析**：分析模块间的依赖关系
4. **架构文档**：生成架构文档
5. **改进建议**：提供架构改进建议

## 使用方法

```typescript
import { ArchitectureValidator } from "./architecture-validator";

// 创建架构验证器实例
const validator = new ArchitectureValidator();

// 验证架构
const validation = validator.validateArchitecture({
  layers: ['presentation', 'business', 'data'],
  rules: [
    {
      source: 'presentation',
      target: 'business',
      allowed: true,
    },
    {
      source: 'data',
      target: 'presentation',
      allowed: false,
    },
  ],
  modules: [...],
});

// 评估架构质量
const quality = validator.assessQuality({
  maintainability: 'high',
  scalability: 'medium',
  testability: 'high',
  performance: 'medium',
});

// 分析依赖关系
const dependencies = validator.analyzeDependencies({
  modules: [...],
});

// 生成架构文档
const doc = validator.generateArchitectureDoc({
  architecture: {...},
  validation,
  recommendations,
});
```

## API

### validateArchitecture(config: ArchitectureConfig)

验证架构。

```typescript
const validation = validator.validateArchitecture({
  layers: ['presentation', 'business', 'data'],
  rules: [...],
  modules: [...],
});
// 返回：{ isValid, violations, warnings }
```

### assessQuality(config: QualityConfig)

评估架构质量。

```typescript
const quality = validator.assessQuality({
  maintainability: 'high',
  scalability: 'medium',
  testability: 'high',
  performance: 'medium',
});
// 返回：{ overallScore, dimensions, strengths, weaknesses }
```

### analyzeDependencies(config: DependencyConfig)

分析依赖关系。

```typescript
const dependencies = validator.analyzeDependencies({
  modules: [...],
});
// 返回：{ graph, cycles, recommendations }
```

### generateArchitectureDoc(config: DocConfig)

生成架构文档。

```typescript
const doc = validator.generateArchitectureDoc({
  architecture: {...},
  validation,
  recommendations,
});
```

## 数据类型

### LayerRule

层规则数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| source | string | 源层 |
| target | string | 目标层 |
| allowed | boolean | 是否允许依赖 |
