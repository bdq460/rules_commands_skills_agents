# Backup Generator

备份生成器用于生成备份策略、灾难恢复方案和容灾配置。

## 功能

1. **备份策略**：生成数据备份策略
2. **恢复方案**：生成灾难恢复方案
3. **容灾配置**：生成容灾系统配置
4. **备份脚本**：生成自动备份脚本
5. **测试计划**：生成恢复测试计划

## 使用方法

```typescript
import { BackupGenerator } from "./backup-generator";

// 创建备份生成器实例
const generator = new BackupGenerator();

// 生成备份策略
const backupStrategy = generator.generateBackupStrategy({
  backupType: 'incremental',
  schedule: 'daily',
  retention: '30days',
  locations: [
    {
      type: 'local',
      path: '/backup',
    },
    {
      type: 'cloud',
      provider: 's3',
      bucket: 'my-backup-bucket',
    },
  ],
});

// 生成恢复方案
const recoveryPlan = generator.generateRecoveryPlan({
  rto: '4hours', // Recovery Time Objective
  rpo: '1hour', // Recovery Point Objective
  procedures: [
    {
      step: 1,
      action: '停止应用服务',
      priority: 'high',
    },
    {
      step: 2,
      action: '恢复数据库',
      priority: 'critical',
    },
  ],
});

// 生成备份脚本
const backupScript = generator.generateBackupScript({
  sources: ['/data', '/config'],
  destinations: ['/backup/local', 's3://my-backup-bucket'],
  compression: true,
  encryption: true,
});

// 生成容灾配置
const drConfig = generator.generateDisasterRecoveryConfig({
  primary: {
    region: 'us-east-1',
    instance: 'large',
  },
  secondary: {
    region: 'us-west-2',
    instance: 'large',
    mode: 'active-passive',
  },
});
```

## API

### generateBackupStrategy(config: BackupStrategyConfig)

生成备份策略。

```typescript
const strategy = generator.generateBackupStrategy({
  backupType: 'incremental',
  schedule: 'daily',
  retention: '30days',
  locations: [...],
});
```

### generateRecoveryPlan(config: RecoveryPlanConfig)

生成恢复方案。

```typescript
const recoveryPlan = generator.generateRecoveryPlan({
  rto: '4hours',
  rpo: '1hour',
  procedures: [...],
});
```

### generateBackupScript(config: BackupScriptConfig)

生成备份脚本。

```typescript
const script = generator.generateBackupScript({
  sources: ['/data', '/config'],
  destinations: ['/backup/local'],
  compression: true,
  encryption: true,
});
```

### generateDisasterRecoveryConfig(config: DRConfig)

生成容灾配置。

```typescript
const drConfig = generator.generateDisasterRecoveryConfig({
  primary: {...},
  secondary: {...},
  mode: 'active-passive',
});
```

### generateRecoveryTestPlan(config: TestPlanConfig)

生成恢复测试计划。

```typescript
const testPlan = generator.generateRecoveryTestPlan({
  frequency: 'monthly',
  scenarios: ['database-failure', 'region-failure'],
});
```

## 配置选项

### BackupStrategyConfig

备份策略配置。

| 字段 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| backupType | string | 'incremental' | 备份类型：full/incremental/differential |
| schedule | string | 'daily' | 备份计划：daily/weekly/hourly |
| retention | string | '30days' | 保留期：30days/90days/1year |
| locations | object[] | [] | 备份位置列表 |
