# Delivery Artifacts Manager

交付物管理器负责管理各阶段的交付物，确保交付物的完整性和可追溯性。

## 功能

1. **交付物注册**：记录和跟踪各阶段的交付物
2. **版本管理**：管理交付物的版本和历史
3. **格式验证**：验证交付物格式是否正确
4. **内容校验**：检查交付物内容是否完整
5. **交付通知**：通知相关方交付物已就绪
6. **归档管理**：将交付物归档存储

## 使用方法

```typescript
import { DeliveryArtifactsManager } from "@codebuddy/skills/product-development-flow/scripts/delivery-artifacts-manager";

// 创建交付物管理器
const manager = new DeliveryArtifactsManager({
  storageDir: "./artifacts",
  formats: ["json", "markdown", "pdf"],
  versioning: true,
});

// 注册交付物
await manager.registerArtifact("requirements-spec", {
  stage: "requirements-analysis",
  type: "document",
  format: "markdown",
  description: "需求规格说明书",
});

// 获取交付物
const artifact = await manager.getArtifact("requirements-spec");
console.log(artifact.path, artifact.version);

// 验证交付物
const isValid = await manager.validateArtifact("requirements-spec");
console.log(`交付物验证结果：${isValid}`);
```

## API

### registerArtifact(name: string, config: ArtifactConfig)

注册新的交付物。

```typescript
await manager.registerArtifact("ui-design", {
  stage: "ui-design",
  type: "design",
  format: "figma",
  description: "UI设计稿",
  files: ["homepage.fig", "dashboard.fig"],
});
```

### getArtifact(name: string)

获取指定名称的交付物信息。

```typescript
const artifact = await manager.getArtifact("requirements-spec");
```

### updateArtifact(name: string, update: Partial```<Artifact>```)

更新交付物信息。

```typescript
await manager.updateArtifact("requirements-spec", {
  version: "v1.1",
  description: "更新后的需求规格说明书",
});
```

### validateArtifact(name: string)

验证交付物的完整性和正确性。

```typescript
const result = await manager.validateArtifact("requirements-spec");
// 返回：{ isValid, errors, warnings }
```

### listArtifacts(stage?: string)

列出交付物，可选按阶段筛选。

```typescript
const allArtifacts = await manager.listArtifacts();
const stageArtifacts = await manager.listArtifacts("requirements-analysis");
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| storageDir | string | "./artifacts" | 交付物存储目录 |
| formats | string[] | ["json", "markdown", "pdf"] | 支持的格式 |
| versioning | boolean | true | 是否启用版本管理 |
| archive | boolean | true | 是否自动归档 |
| compression | boolean | false | 是否压缩交付物 |
| checksumValidation | boolean | true | 是否验证校验和 |
