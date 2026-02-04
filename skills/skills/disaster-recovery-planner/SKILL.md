---
name: disaster-recovery-planner
description: 制定灾备和容灾方案，确保系统在灾难发生时能够快速恢复业务。
---

# Disaster Recovery Planner Skill

本skill负责制定灾备和容灾方案，确保系统在灾难发生时能够快速恢复业务。

**💡 重要说明**: 本技能既可以作为产品开发流程的一部分，也可以在任何适合的场景下独立使用。
不需要用户明确声明"我是灾备规划师"，只要用户的需求涉及灾备规划或备份恢复，就可以调用本技能。

**重要说明**：本skill专注于生成灾备和容灾方案、配置和文档，不涉及实际部署灾备系统或执行灾备演练。

## 何时使用本Skill

本skill可以在以下场景中独立使用，也可以作为产品开发流程的一部分：

### 独立使用场景

**场景1: 灾备方案设计**

- "设计灾备方案"
- "设计容灾方案"
- "设计高可用方案"
- "设计双活方案"
- "设计异地多活方案"

**场景2: 备份策略设计**

- "设计备份策略"
- "设计数据备份方案"
- "设计增量备份方案"
- "设计全量备份方案"
- "设计备份存储策略"

**场景3: 恢复方案设计**

- "设计恢复方案"
- "设计故障恢复流程"
- "设计数据恢复方案"
- "设计系统恢复方案"
- "设计业务恢复方案"

**场景4: 高可用设计**

- "设计高可用架构"
- "设计负载均衡方案"
- "设计故障转移方案"
- "设计故障检测方案"
- "设计自动恢复方案"

**场景5: 灾备咨询**

- "如何设计灾备方案?"
- "灾备最佳实践"
- "如何保证业务连续性?"
- "如何设计高可用系统?"
- "备份恢复策略"

### 产品开发流程集成

在产品开发流程的**阶段6: 架构保障**中被调用，作为灾备规划师角色。

**调用方式**: 由product-development-flow自动调用，传递业务需求、架构设计等上下文。

**触发时机**:

- 业务实现期间，需要灾备设计时
- 需要设计高可用架构时
- 需要设计备份恢复方案时

### 触发关键词

以下关键词或短语出现时，建议调用本skill：

**灾备方案类**:

- "灾备方案"、"容灾方案"、"灾备设计"
- "高可用方案"、"双活方案"、"异地多活"

**备份策略类**:

- "备份策略"、"备份方案"、"数据备份"
- "增量备份"、"全量备份"、"备份存储"

**恢复方案类**:

- "恢复方案"、"故障恢复"、"数据恢复"
- "系统恢复"、"业务恢复"、"恢复流程"

**高可用类**:

- "高可用"、"高可用架构"、"负载均衡"
- "故障转移"、"故障检测"、"自动恢复"

**咨询类**:

- "灾备最佳实践"、"业务连续性"
- "RTO"、"RPO"、"灾备规划"

## 🎯 核心职责

### 1. 灾备需求分析

- 评估业务连续性要求
- 确定RTO（恢复时间目标）和RPO（恢复点目标）
- 识别关键业务流程
- 评估数据重要性
- 分析故障风险

### 2. 备份策略设计

- 制定数据备份计划
- 设计备份存储策略
- 设计备份验证机制
- 设计备份恢复流程

### 3. 容灾架构设计

- 设计高可用架构
- 设计故障切换机制
- 设计多地域部署方案
- 设计流量切换方案

### 4. 灾备演练计划

- 制定演练计划
- 设计演练场景
- 制定演练评估标准
- 设计演练报告模板

### 5. 灾备文档编写

- 编写灾备计划文档
- 编写恢复流程文档
- 编写应急响应文档
- 编写联系人清单

---

## 🤝 协作关系与RACI矩阵

### 本技能的定位

本技能负责制定灾备和容灾方案,确保系统在灾难发生时能够快速恢复业务。在产品开发流程中处于阶段6:架构保障,是业务连续性保障的核心。

### 协作的技能类型

本技能主要与以下类型技能协作:

1. **前置技能**: data-engineer、technical-architect
2. **后置技能**: devops-generator、tester
3. **同级技能**: 无
4. **依赖技能**: 无

### 协作场景

| 场景 | 协作技能 | 协作方式 | 协作内容 |
|------|----------|----------|----------|
| 数据备份协作 | data-engineer | 顺序协作 | 协作设计数据库备份策略 |
| 架构容灾设计 | technical-architect | 顺序协作 | 协作设计容灾架构 |
| 部署配置协作 | devops-generator | 顺序协作 | 提供备份和恢复部署要求 |
| 备份测试协作 | tester | 顺序协作 | 进行备份恢复测试 |

### 本技能在各阶段的RACI角色

| 阶段 | 本技能角色 | 主要职责 |
|------|------------|----------|
| 阶段1: 需求提出 | I | 了解灾备需求,参与需求评审 |
| 阶段2: 需求分析 | C | 咨询RTO/RPO要求 |
| 阶段5: 业务实现 | I | 了解实现进展,准备灾备设计 |
| 阶段6: 架构保障 | R/A | 设计灾备方案,制定恢复流程 |
| 阶段7: 测试验证 | C | 协作进行灾备演练 |
| 阶段11: DevOps配置 | C | 协作配置备份恢复系统 |

### 本技能的核心任务RACI

| 任务 | 本技能 | data-engineer | devops-generator | tester |
|------|--------|---------------|-----------------|--------|
| 灾备方案设计 | R/A | C | C | I |
| 备份策略设计 | R/A | R/A | C | I |
| 恢复流程设计 | R/A | C | R/A | C |
| 灾备演练 | C | C | C | R/A |

### RACI角色说明

- **R (Responsible)** - 负责人: 本技能实际执行的任务
- **A (Accountable)** - 拥有人: 本技能对结果负最终责任的任务
- **C (Consulted)** - 咨询人: 需要咨询其他技能的任务
- **I (Informed)** - 知情人: 需要通知其他技能进展的任务

---

## ⚠️ 冲突升级路径

### 冲突类型

本技能可能遇到的冲突类型:

| 冲突类型 | 严重程度 | 默认处理方式 |
|----------|----------|--------------|
| RTO/RPO目标冲突 | 低 | 直接协商 |
| 备份策略分歧 | 中 | 第三方协调 |
| 资源分配冲突 | 中 | 第三方协调 |
| 灾备方案冲突 | 高 | 项目协调器介入 |

### 4级冲突升级路径

#### Level 1: 直接协商(本技能内部)

**适用场景**:

- 冲突严重程度: 低-中
- 冲突类型: RTO/RPO目标冲突、备份策略分歧
- 处理时限: < 5分钟

**处理流程**:

```typescript
async function resolveConflictLevel1(
  conflict: Conflict,
): Promise<Resolution> {
  // 1. 识别冲突类型
  const conflictType = identifyConflictType(conflict);

  // 2. 分析冲突原因
  const rootCause = analyzeRootCause(conflict);

  // 3. 提出解决方案
  const solutions = generateSolutions(conflictType, rootCause);

  // 4. 评估方案
  const bestSolution = evaluateSolutions(solutions);

  // 5. 执行解决方案
  await implementSolution(bestSolution);

  // 6. 记录结果
  recordConflictResolution(conflict, bestSolution);

  return bestSolution;
}
```

#### Level 2: 第三方协调(相关技能协调)

**适用场景**:

- 冲突严重程度: 中
- 冲突类型: 资源分配冲突、备份方案无法达成一致
- 处理时限: < 15分钟

**协调人选择**:

| 冲突类型 | 推荐协调人 | 原因 |
|----------|-----------|------|
| 资源分配冲突 | devops-generator | 资源管理专家 |
| 备份策略冲突 | data-engineer | 数据管理权威 |
| 架构方案冲突 | technical-architect | 架构设计权威 |

**处理流程**:

```typescript
async function resolveConflictLevel2(
  conflict: Conflict,
  mediator: string,
): Promise<Resolution> {
  // 1. 选择协调人
  const coordinator = selectCoordinator(mediator);

  // 2. 提供冲突信息
  await coordinator.informConflict(conflict);

  // 3. 协调人分析
  const analysis = await coordinator.analyzeConflict(conflict);

  // 4. 协调人提出方案
  const proposal = await coordinator.proposeSolution(analysis);

  // 5. 双方确认
  const confirmed = await confirmSolution(conflict, proposal);

  if (confirmed) {
    // 6. 执行方案
    await implementSolution(proposal);
    recordConflictResolution(conflict, proposal, "Level 2");
  }

  return proposal;
}
```

#### Level 3: 项目协调器介入

**适用场景**:

- 冲突严重程度: 高
- 冲突类型: 灾备方案冲突、核心决策无法达成一致
- 处理时限: < 30分钟

**项目协调器权限**:

- 暂停灾备设计
- 重新评估RTO/RPO
- 修改灾备方案
- 要求重新设计
- 权威决策

**处理流程**:

```typescript
async function resolveConflictLevel3(
  conflict: Conflict,
): Promise<Resolution> {
  // 1. 通知项目协调器
  await projectCoordinator.reportConflict(conflict);

  // 2. 项目协调器全面收集信息
  const fullContext = await projectCoordinator.gatherContext(conflict);

  // 3. 深度分析
  const deepAnalysis = await projectCoordinator.deepAnalyze(
    fullContext,
  );

  // 4. 权威决策
  const decision = await projectCoordinator.makeDecision(deepAnalysis);

  // 5. 强制执行
  await projectCoordinator.enforceDecision(decision);

  // 6. 记录结果
  recordConflictResolution(conflict, decision, "Level 3");

  return decision;
}
```

#### Level 4: 用户介入(最后手段)

**适用场景**:

- 冲突严重程度: 极高
- 冲突类型: 核心灾备决策无法达成,涉及业务连续性
- 处理时限: 无限制(等待用户决策)

**用户决策选项**:

| 选项 | 说明 | 适用场景 |
|------|------|----------|
| 选项A | 继续当前方案 | 方案基本可行,有小的调整 |
| 选项B | 放宽RTO/RPO | 降低灾备要求,减少成本 |
| 选项C | 增加预算 | 增加灾备投入,提升灾备能力 |
| 选项D | 接受风险 | 接受部分风险,平衡成本 |

---

## 📋 工作流程

```mermaid
graph LR
    A[分析灾备需求] --> B[确定RTO/RPO]
    B --> C[设计备份策略]
    C --> D[设计容灾架构]
    D --> E[设计故障切换]
    E --> F[制定演练计划]
    F --> G[编写灾备文档]

## 🔄 输入要求

### 必需输入

- **系统架构**：系统规模、技术栈、部署架构
- **业务需求**：业务重要性、用户规模、SLA要求
- **数据规模**：数据量、增长速度、数据重要性
- **资源预算**：预算限制、资源可用性

### 可选输入

- **现有灾备方案**：已有的备份和容灾措施
- **风险评估**：已识别的风险和威胁
- **合规要求**：法律法规、行业标准要求
- **历史故障**：过往故障案例和教训

## 📦 交付物

### 1. 灾备需求分析报告

#### 灾备需求分析示例

```markdown
# 灾备需求分析报告

## 业务概况

- 系统类型：电商平台
- 日活用户：100万
- 日交易额：1000万
- 业务重要性：关键业务

## 🎯 RTO/RPO目标

| 业务组件 | RPO   | RTO    | 说明                         |
| -------- | ----- | ------ | ---------------------------- |
| 订单服务 | 0     | 15分钟 | 订单数据零丢失，15分钟内恢复 |
| 支付服务 | 0     | 5分钟  | 支付数据零丢失，5分钟内恢复  |
| 商品服务 | 1小时 | 30分钟 | 商品数据可接受1小时损失      |
| 用户服务 | 5分钟 | 10分钟 | 用户数据5分钟内恢复          |
| 日志服务 | 1天   | 1天    | 日志可接受1天损失            |

## ⚠️ 风险评估

### 技术风险

- 服务器故障（概率：中等）
- 数据库故障（概率：中等）
- 网络故障（概率：高）
- 数据中心故障（概率：低）

### 自然风险

- 火灾（概率：极低）
- 地震（概率：极低）
- 洪水（概率：极低）

### 人为风险

- 误操作（概率：中等）
- 恶意攻击（概率：低）

## 🛡️ 灾备策略

基于风险评估和RTO/RPO目标，推荐以下灾备策略：
[详见灾备方案]

### 2. 备份策略文档

#### 备份策略示例

```markdown
# 备份策略

## 📦 备份级别

### 1. 完全备份

- 频率：每周一次
- 时间：周日凌晨2:00
- 保留期：3个月
- 存储：异地灾备中心

### 2. 增量备份

- 频率：每天一次
- 时间：凌晨1:00
- 保留期：1个月
- 存储：本地+异地

### 3. 事务日志备份

- 频率：每15分钟一次
- 保留期：7天
- 存储：本地+异地

### 4. 实时备份

- 类型：流式复制
- 延迟：< 1秒
- 保留：永久
- 存储：异地灾备中心

## 📦 备份存储策略

### 本地存储

- 位置：本地数据中心
- 存储：NAS设备
- 容量：100TB
- 冗余：RAID 10

### 异地存储

- 位置：灾备数据中心（距主数据中心500km）
- 存储：云存储（AWS S3 / Azure Blob）
- 容量：200TB
- 冗余：跨区域复制

## 📦 备份验证

### 自动验证

- 频率：每天一次
- 方式：随机抽取备份恢复到测试环境
- 验证内容：数据完整性、数据一致性
- 告警：验证失败立即告警

### 手动验证

- 频率：每月一次
- 方式：完全恢复演练
- 验证内容：完整恢复流程、数据准确性
- 报告：生成验证报告

## 🔒 备份加密

- 传输加密：TLS 1.3
- 存储加密：AES-256
- 密钥管理：AWS KMS / Azure Key Vault

#### 备份脚本示例

```bash
#!/bin/bash
# backup_database.sh

# PostgreSQL备份脚本

BACKUP_DIR="/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
pg`dump -h $DB`HOST -U $DB`USER -d $DB`NAME \
  -F c -f $BACKUP`DIR/backup`$TIMESTAMP.dump

# 压缩备份
gzip $BACKUP`DIR/backup`$TIMESTAMP.dump

# 上传到异地存储
aws s3 cp $BACKUP`DIR/backup`$TIMESTAMP.dump.gz \
  s3://my-backups/postgresql/

# 删除过期备份
find $BACKUP`DIR -name "backup`*.dump.gz" \
  -mtime +$RETENTION_DAYS -delete

# 验证备份
if [ $? -eq 0 ]; then
  echo "Backup completed successfully: backup_$TIMESTAMP.dump.gz"
else
  echo "Backup failed!"
  # 发送告警
  curl -X POST $SLACK_WEBHOOK \
    -d '{"text":"Database backup failed!"}'
  exit 1
fi

```yaml
# Kubernetes CronJob配置
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgresql-backup
spec:
  schedule: "0 1 * * *" # 每天凌晨1点执行
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: postgres:15-alpine
              command:
                - /bin/bash
                - -c
                - |
                  pg`dump -h $DB`HOST -U $DB`USER -d $DB`NAME \
                    -F c -f /backup/backup`$(date +%Y%m%d`%H%M%S).dump
                  aws s3 cp /backup/ s3://my-backups/postgresql/ --recursive
              env:
                - name: DB_HOST
                  valueFrom:
                    secretKeyRef:
                      name: postgresql-secret
                      key: host
                - name: DB_USER
                  valueFrom:
                    secretKeyRef:
                      name: postgresql-secret
                      key: user
                - name: DB_NAME
                  valueFrom:
                    configMapKeyRef:
                      name: postgresql-config
                      key: database
                - name: AWS_ACCESS_KEY_ID
                  valueFrom:
                    secretKeyRef:
                      name: aws-secret
                      key: access-key-id
                - name: AWS_SECRET_ACCESS_KEY
                  valueFrom:
                    secretKeyRef:
                      name: aws-secret
                      key: secret-access-key
              volumeMounts:
                - name: backup
                  mountPath: /backup
          volumes:
            - name: backup
              emptyDir: {}
          restartPolicy: OnFailure

### 3. 容灾架构设计文档

#### 高可用架构示例

```yaml
# PostgreSQL主从复制架构
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgresql-ha-config
data:
  postgresql.conf: |
    # 主节点配置
    listen_addresses = '*'
    max_wal_senders = 10
    max_replication_slots = 10
    wal_level = replica
    hot_standby = on
    synchronous_commit = on
    synchronous_standby_names = 'postgresql-standby-0,postgresql-standby-1'
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgresql
spec:
  serviceName: postgresql
  replicas: 3
  template:
    spec:
      containers:
        - name: postgresql
          image: bitnami/postgresql-repmgr:15
          env:
            - name: POSTGRESQL_USERNAME
              value: postgres
            - name: POSTGRESQL_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgresql-secret
                  key: password
            - name: POSTGRESQL_REPLICATION_MODE
              value: ha
            - name: POSTGRESQL_NUM_SYNCHRONOUS_REPLICAS
              value: "2"
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: data
              mountPath: /bitnami/postgresql
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 100Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgresql
spec:
  selector:
    app: postgresql
  ports:
    - port: 5432
  clusterIP: None

#### 多地域部署示例

```yaml
# 多地域部署架构
# 主地域：us-east-1
# 灾备地域：us-west-2

# 主地域配置
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
spec:
  replicas: 10
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
        region: us-east-1
    spec:
      containers:
        - name: api
          image: myapp/api:latest
          env:
            - name: DATABASE_URL
              value: "postgresql://primary:5432/mydb"
            - name: REDIS_URL
              value: "redis://primary:6379"
---
# 灾备地域配置
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: disaster-recovery
spec:
  replicas: 5
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
        region: us-west-2
    spec:
      containers:
        - name: api
          image: myapp/api:latest
          env:
            - name: DATABASE_URL
              value: "postgresql://standby:5432/mydb"
            - name: REDIS_URL
              value: "redis://standby:6379"

### 4. 故障切换方案

#### 自动故障切换示例

```typescript
// 自动故障切换服务
import { Pool } from "pg";

interface FailoverConfig {
  primaryDatabase: DatabaseConfig;
  standbyDatabases: DatabaseConfig[];
  healthCheckInterval: number; // seconds
  maxRetries: number;
}

class FailoverManager {
  private currentPool: Pool;
  private standbyPools: Pool[];
  private currentPrimary: string;

  constructor(private config: FailoverConfig) {
    this.currentPool = new Pool(config.primaryDatabase);
    this.standbyPools = config.standbyDatabases.map((db) => new Pool(db));
    this.currentPrimary = config.primaryDatabase.host;

    // 启动健康检查
    this.startHealthCheck();
  }

  private async startHealthCheck() {
    setInterval(async () => {
      const isHealthy = await this.checkHealth(this.currentPrimary);

      if (!isHealthy) {
        console.error("Primary database is down, initiating failover...");
        await this.failover();
      }
    }, this.config.healthCheckInterval * 1000);
  }

  private async checkHealth(host: string): Promise<boolean> {
    try {
      const pool = this.getPool(host);
      const result = await pool.query("SELECT 1");
      return result.rowCount === 1;
    } catch (error) {
      console.error(`Health check failed for ${host}:`, error);
      return false;
    }
  }

  private async failover() {
    console.log("Starting failover process...");

    // 1. 检查standby数据库的健康状态
    for (const standby of this.config.standbyDatabases) {
      const isHealthy = await this.checkHealth(standby.host);
      if (isHealthy) {
        console.log(`Promoting standby ${standby.host} to primary...`);

        // 2. 提升standby为primary
        await this.promoteStandby(standby);

        // 3. 更新应用连接
        await this.updateConnections(standby);

        // 4. 发送告警通知
        await this.sendAlert(
          "Failover completed",
          `Standby ${standby.host} promoted to primary`,
        );

        console.log("Failover completed successfully");
        return;
      }
    }

    throw new Error("No healthy standby database available for failover");
  }

  private async promoteStandby(standby: DatabaseConfig) {
    // 提升standby为primary
    const pool = new Pool(standby);
    await pool.query("SELECT pg_promote()");

    // 更新当前连接池
    this.currentPool.end();
    this.currentPool = pool;
    this.currentPrimary = standby.host;

    // 通知其他standby跟随新的primary
    for (const otherStandby of this.config.standbyDatabases) {
      if (otherStandby.host !== standby.host) {
        await this.updateReplication(otherStandby, standby);
      }
    }
  }

  private async updateConnections(newPrimary: DatabaseConfig) {
    // 更新应用配置或重新创建连接池
    console.log(`Updating connections to new primary: ${newPrimary.host}`);
    // 这里需要根据具体应用实现
  }

  private async updateReplication(
    standby: DatabaseConfig,
    primary: DatabaseConfig,
  ) {
    // 更新standby的复制目标
    const pool = new Pool(standby);
    await pool.query(`
      ALTER SYSTEM SET primary`conninfo = 'host=${primary.host} port=${primary.port} user=replication`user password=${primary.password}'
    `);
    await pool.query("SELECT pg_reload_conf()");
  }

  private async sendAlert(subject: string, message: string) {
    // 发送告警通知
    console.log(`Alert: ${subject} - ${message}`);
    // 可以集成Slack、PagerDuty等告警系统
  }

  private getPool(host: string): Pool {
    if (host === this.currentPrimary) {
      return this.currentPool;
    }
    const standby = this.config.standbyDatabases.find((db) => db.host === host);
    return standby ? this.standbyPools.find((p) => p === standby) : null;
  }
}

#### DNS切换配置示例

```yaml
# Route53故障切换配置
Type: A Record Set
Failover: Primary and Secondary

# 主记录
Name: api.example.com
Type: A
Alias: No
TTL: 60
Health Check: Yes
Resource Records: 1.2.3.4 (Primary IP)
Failover: PRIMARY

# 备用记录
Name: api.example.com
Type: A
Alias: No
TTL: 60
Health Check: Yes
Resource Records: 5.6.7.8 (Standby IP)
Failover: SECONDARY

# 健康检查配置
Health Check Type: HTTPS
Protocol: HTTPS
Port: 443
Path: /health
Interval: 30 seconds
Failure Threshold: 3
Success Threshold: 2

### 5. 灾备演练计划

#### 演练计划示例

```markdown
# 灾备演练计划

## 🎯 演练目标

- 验证备份恢复流程
- 验证故障切换机制
- 验证团队应急响应能力
- 识别潜在问题和改进点

## 🎯 演练类型

### 1. 桌面演练

- 频率：每季度一次
- 时长：2小时
- 参与者：核心团队
- 内容：模拟故障场景，讨论应对方案

### 2. 模拟演练

- 频率：每半年一次
- 时长：4小时
- 参与者：全体技术团队
- 内容：在测试环境中模拟故障，执行恢复流程

### 3. 实战演练

- 频率：每年一次
- 时长：1天
- 参与者：全体相关人员
- 内容：在生产环境（低峰时段）真实触发故障切换

## 演练场景

### 场景1：数据库故障

- 故障描述：主数据库服务器宕机
- 预期结果：30秒内自动切换到备用数据库
- 验证点：
  - [ ] 故障检测时间 < 10秒
  - [ ] 故障切换时间 < 30秒
  - [ ] 数据一致性验证通过
  - [ ] 业务功能正常

### 场景2：应用服务器故障

- 故障描述：50%的应用服务器宕机
- 预期结果：剩余服务器自动承担流量
- 验证点：
  - [ ] 负载均衡器检测故障 < 5秒
  - [ ] 流量重新分配 < 10秒
  - [ ] 业务连续性不受影响
  - [ ] 自动扩容触发

### 场景3：网络故障

- 故障描述：主数据中心网络中断
- 预期结果：流量自动切换到灾备数据中心
- 验证点：
  - [ ] 网络故障检测 < 30秒
  - [ ] DNS切换完成 < 60秒
  - [ ] 灾备环境正常提供服务
  - [ ] 数据同步恢复

### 场景4：数据损坏

- 故障描述：生产数据库数据损坏
- 预期结果：从备份恢复数据
- 验证点：
  - [ ] 数据损坏检测 < 1分钟
  - [ ] 备份恢复时间 < 30分钟
  - [ ] 数据完整性验证通过
  - [ ] 业务恢复到故障前状态

## 演练评估

### 评估维度

- **时间指标**：各步骤耗时是否达标
- **功能指标**：系统功能是否正常
- **数据指标**：数据是否一致完整
- **流程指标**：流程是否顺畅高效

### 评估标准

| 维度     | 优秀     | 良好     | 需改进   |
| -------- | -------- | -------- | -------- |
| 故障检测 | < 10秒   | < 30秒   | > 30秒   |
| 故障切换 | < 1分钟  | < 5分钟  | > 5分钟  |
| 业务恢复 | < 5分钟  | < 15分钟 | > 15分钟 |
| 团队配合 | 无缝协作 | 有沟通   | 协作不畅 |

## 演练报告模板

[见演练报告示例]

### 6. 灾备文档

#### 灾备计划文档模板

```markdown
# 灾备计划文档

## 文档信息

- 版本：1.0
- 编写日期：2024-01-01
- 编写人：DevOps团队
- 审核人：CTO
- 批准人：CEO

## 1. 概述

### 1.1 目的

本文档旨在定义[系统名称]的灾备策略、恢复流程和应急响应措施，确保系统在灾难发生时能够快速恢复业务。

### 1.2 适用范围

本文档适用于[系统名称]的所有相关人员和系统。

### 1.3 术语定义

- *`RTO (Recovery Time Objective)`*：恢复时间目标，从故障发生到系统恢复正常的时间。
- *`RPO (Recovery Point Objective)`*：恢复点目标，允许丢失的最大数据量。
- *`DR (Disaster Recovery)`*：灾难恢复。

## 2. 系统概况

### 2.1 系统架构

[系统架构图]

### 2.2 关键业务流程

[业务流程图]

### 2.3 RTO/RPO目标

[RTO/RPO表格]

## 3. 灾备策略

### 3.1 备份策略

[备份策略文档]

### 3.2 容灾架构

[容灾架构设计]

### 3.3 故障切换机制

[故障切换方案]

## 4. 应急响应流程

### 4.1 故障等级定义

| 等级 | 描述                         | 响应时间 | 通知范围     |
| ---- | ---------------------------- | -------- | ------------ |
| P1   | 系统完全不可用，严重影响业务 | 5分钟    | 全体相关人员 |
| P2   | 部分功能不可用，影响业务     | 15分钟   | 技术团队     |
| P3   | 系统性能下降，不影响业务     | 1小时    | 技术团队     |

### 4.2 响应流程图

[响应流程图]

### 4.3 联系人清单

| 角色       | 姓名 | 电话        | 邮箱                 | 备用电话    |
| ---------- | ---- | ----------- | -------------------- | ----------- |
| 应急指挥   | 张三 | 13800000001 | zhangsan@example.com | 13800000002 |
| 技术负责人 | 李四 | 13800000003 | lisi@example.com     | 13800000004 |
| 运维负责人 | 王五 | 13800000005 | wangwu@example.com   | 13800000006 |

## 5. 恢复流程

### 5.1 数据库恢复流程

[恢复步骤]

### 5.2 应用恢复流程

[恢复步骤]

### 5.3 验证清单

[验证清单]

## 6. 演练计划

[演练计划文档]

## 7. 附录

### 7.1 相关文档

- [备份策略文档]
- [容灾架构文档]
- [监控告警文档]

### 7.2 更新记录

| 版本 | 日期       | 修改内容 | 修改人     |
| ---- | ---------- | -------- | ---------- |
| 1.0  | 2024-01-01 | 初始版本 | DevOps团队 |

#### 应急响应文档示例

```markdown
# 应急响应流程

## P1故障响应流程

### 1. 故障发现（5分钟内）

- 监控系统自动告警
- 值班人员接收告警

### 2. 初步评估（5-10分钟）

- 确认故障范围
- 评估故障影响
- 确定故障等级

### 3. 启动应急响应（10-15分钟）

- 召开紧急会议
- 分配任务
- 启动备用系统

### 4. 故障处理（15-60分钟）

- 执行恢复流程
- 验证系统恢复
- 监控系统状态

### 5. 业务恢复（60-120分钟）

- 通知用户
- 恢复业务
- 监控数据一致性

### 6. 事后复盘（24小时内）

- 分析故障原因
- 总结教训
- 更新灾备计划
- 制定改进措施

## 🔍 灾备工具

### 备份工具

| 工具               | 类型       | 特点       |
| ------------------ | ---------- | ---------- |
| pg_dump            | PostgreSQL | 逻辑备份   |
| Percona XtraBackup | MySQL      | 物理热备份 |
| mongodump          | MongoDB    | 逻辑备份   |
| Velero             | Kubernetes | K8s备份    |
| AWS Backup         | 云服务     | 云原生备份 |

### 容灾工具

| 工具          | 类型       | 特点               |
| ------------- | ---------- | ------------------ |
| repmgr        | PostgreSQL | 高可用管理         |
| Orchestrator  | MySQL      | 拓扑管理和故障切换 |
| MongoDB Atlas | MongoDB    | 云原生高可用       |
| Kubernetes    | 容器编排   | 自愈能力           |
| Consul        | 服务发现   | 健康检查和故障转移 |

### 监控工具

| 工具       | 类型     | 特点       |
| ---------- | -------- | ---------- |
| Prometheus | 指标监控 | 灵活强大   |
| Grafana    | 可视化   | 丰富的面板 |
| PagerDuty  | 告警管理 | 多通道通知 |
| Slack      | 通讯工具 | 团队协作   |

## 📊 灾备成熟度评估

### 评估维度 (重复2)

| 成熟度级别 | 描述         | 关键指标           |
| ---------- | ------------ | ------------------ |
| Level 0    | 无灾备措施   | -                  |
| Level 1    | 仅有备份     | 有定期备份         |
| Level 2    | 有灾备计划   | 有文档、有演练     |
| Level 3    | 自动化灾备   | 自动备份、自动切换 |
| Level 4    | 多地域灾备   | 异地容灾、自动演练 |
| Level 5    | 持续灾备优化 | 实时监控、持续改进 |

### 自评估清单

- [ ] 有完整的灾备计划文档
- [ ] 定期进行灾备演练
- [ ] 有明确的RTO/RPO目标
- [ ] 有自动化的备份机制
- [ ] 有高可用架构
- [ ] 有故障切换机制
- [ ] 有异地灾备中心
- [ ] 有完善的监控告警
- [ ] 有应急响应流程
- [ ] 有联系人清单

## 🔄 集成到开发流程

### 触发时机

1. **新系统上线前**
   - 制定灾备方案
   - 配置备份和容灾

2. **系统重大变更**
   - 更新灾备方案
   - 重新评估RTO/RPO

3. **定期评估**
   - 每半年评估灾备成熟度
   - 根据业务发展调整方案

### 调用方式

```typescript
const disasterRecoveryPlanner = await useSkill("disaster-recovery-planner");

const drPlan = await disasterRecoveryPlanner.plan({
  systemArchitecture: systemArchitecture,
  businessRequirements: businessRequirements,
  rtoRpoTargets: rtoRpoTargets,
  budget: budget,
  existingDRMeasures: existingDR,
});

await saveDRPlan(drPlan.plan);
await saveBackupScripts(drPlan.backupScripts);
await saveFailoverConfig(drPlan.failoverConfig);
await saveDisasterRecoveryDocumentation(drPlan.documentation);

## 📊 质量标准

- ✅ 灾备需求分析准确
- ✅ RTO/RPO目标合理可行
- ✅ 备份策略完整可靠
- ✅ 容灾架构高可用
- ✅ 故障切换机制可靠
- ✅ 演练计划可行
- ✅ 文档清晰完整

## ⚠️ 注意事项

### 灾备原则

1. **预防优于恢复**
   - 建立高可用架构
   - 实施预防性措施
   - 定期维护和检查

2. **备份必须验证**
   - 定期验证备份可恢复性
   - 不依赖未验证的备份

3. **演练必须真实**
   - 模拟真实故障场景
   - 测试完整恢复流程
   - 评估团队能力

4. **持续改进**
   - 定期评估灾备成熟度
   - 根据演练结果改进
   - 跟踪新技术和最佳实践

### 常见错误

- ❌ 只备份不验证
- ❌ RTO/RPO目标不切实际
- ❌ 灾备计划不更新
- ❌ 不进行演练
- ❌ 演练流于形式
- ❌ 缺乏应急培训
- ❌ 联系人信息过期

## 🤝 协作关系与RACI矩阵

- **主要协作**：technical-architect（架构设计）、devops-generator（部署配置）、data-engineer（数据备份）、project-coordinator（流程协调）。
- **RACI（阶段7 架构保障）**：disaster-recovery-planner 对灾备方案设计负责（R），technical-architect 对架构完整性负责（A），data-engineer 和 devops-generator consulted（C），project-coordinator 知情并记录（I）。
- **参考**：完整矩阵见 [COLLABORATION_RACI.md](../../COLLABORATION_RACI.md)。

### ⚠️ 冲突升级路径

- **优先自解**：将灾备需求分歧同步给 technical-architect，请求架构评审。
- **二级升级**：若与部署或数据策略仍有争议，升级到 project-coordinator 牵头，邀请 technical-architect、devops-generator、data-engineer 共同裁决。

---

## 调用其他技能

### 调用时机

本skill在以下情况需要主动调用其他技能：

1. **数据备份设计时** - 调用数据工程师

2. **架构容灾设计时** - 调用技术架构师

3. **安全灾备设计时** - 调用安全工程师

4. **灾备运维配置时** - 调用DevOps配置生成器

### 调用的技能及场景

#### 1. 调用数据工程师（data-engineer）

**调用时机**：

- 当需要设计数据库备份方案时
- 当需要设计数据恢复方案时
- 当需要设计数据同步方案时

**调用方式**：

```typescript
const dataEngineer = await useSkill("data-engineer");
const backupStrategy = await dataEngineer.designDataBackup({
  database: databaseType,
  rpo: recoveryPointObjective,
  rto: recoveryTimeObjective,
});

**调用场景**：

**场景1**：数据库备份方案

- **输入**：数据库类型、RPO/RPO要求
- **调用**：data-engineer设计备份策略
- **输出**：备份方案、备份脚本

**场景2**：数据恢复流程

- **输入**：备份方案、恢复目标
- **调用**：data-engineer设计恢复流程
- **输出**：恢复脚本、验证方案

#### 2. 调用技术架构师（technical-architect）

**调用时机**：

- 当需要设计容灾架构时
- 当需要设计故障切换架构时
- 当需要评估架构容灾能力时

**调用方式**：

```typescript
const technicalArchitect = await useSkill("technical-architect");
const drArchitecture = await technicalArchitect.designDisasterRecovery({
  systemArchitecture: currentArchitecture,
  availability: availabilityRequirements,
});

**调用场景**：

**场景1**：容灾架构设计

- **输入**：当前架构、可用性要求
- **调用**：technical-architect设计容灾架构
- **输出**：容灾架构方案、部署拓扑

**场景2**：故障切换设计

- **输入**：系统架构、切换要求
- **调用**：technical-architect设计切换机制
- **输出**：切换方案、自动切换配置

#### 3. 调用安全工程师（security-engineer）

**调用时机**：

- 当需要设计灾备安全策略时
- 当需要设计数据备份加密时
- 当需要设计恢复权限控制时

**调用方式**：

```typescript
const securityEngineer = await useSkill("security-engineer");
const securityConfig = await securityEngineer.configureDRSecurity({
  backupData: backupType,
  recoveryProcess: recoveryRequirements,
});

**调用场景**：

**场景1**：灾备安全策略

- **输入**：灾备场景、安全要求
- **调用**：security-engineer设计安全策略
- **输出**：安全策略、加密方案

**场景2**：备份加密设计

- **输入**：备份数据类型、加密需求
- **调用**：security-engineer设计加密方案
- **输出**：加密实现、密钥管理

#### 4. 调用DevOps配置生成器（devops-generator）

**调用时机**：

- 当需要配置灾备自动化时
- 当需要配置灾备监控时
- 当需要配置灾备告警时

**调用方式**：

```typescript
const devopsGenerator = await useSkill("devops-generator");
const automationConfig = await devopsGenerator.configureDRAutomation({
  backupPlan: backupStrategy,
  recoveryPlan: recoveryStrategy,
});

**调用场景**：

**场景1**：灾备自动化配置

- **输入**：备份计划、恢复计划
- **调用**：devops-generator生成自动化配置
- **输出**：自动化脚本、CI/CD配置

**场景2**：灾备监控配置

- **输入**：监控要求、告警规则
- **调用**：devops-generator配置监控告警
- **输出**：监控配置、告警规则

### 调用注意事项

1. **RTO/RPO优先**：灾备设计以RTO/RPO为首要目标

2. **定期演练**：灾备方案必须定期演练验证

3. **安全第一**：灾备数据必须加密保护

4. **自动化优先**：优先采用自动化灾备方案

---

## 总结

Disaster Recovery Planner Skill专注于：

1. ✅ 灾备需求分析

2. ✅ 备份策略设计

3. ✅ 容灾架构设计

4. ✅ 故障切换机制设计

5. ✅ 灾备演练计划制定

6. ✅ 灾备文档编写

**重要说明**：

- ❌ 不实际部署灾备系统
- ❌ 不执行灾备演练
- ❌ 不处理真实故障
- ✅ 专注于生成灾备方案、配置和文档
- ✅ 由DevOps工程师或运维工程师实际执行

---

## 📚 参考资料

### 全局参考资料

本skill参考以下全局参考资料：

- **编码规范**：`references/best-practices/coding.md`（包含命名规范、函数设计原则、代码组织规范、注释规范、错误处理规范）
- **设计模式**：`references/design-patterns/creational.md`、`references/design-patterns/structural.md`、`references/design-patterns/behavioral.md`
- **架构参考**：`references/architecture/hexagonal-architecture.md`、`references/architecture/microservices.md`

### 本skill特有参考资料

本skill使用以下特有的参考资料：

- **[灾备方案模板](references/disaster-recovery-templates.md)** - 包含备份策略、容灾架构、演练计划等模板

## 🛠️ 工具脚本

### 全局工具脚本

本skill使用以下全局工具脚本：

- **Logger工具**：`scripts/utils/logger.ts`

  ```typescript
  import { createLogger } from "@codebuddy/scripts/utils/logger";
  const logger = createLogger("Disaster Recovery Planner");
  logger.info("开始制定灾备方案");
  logger.skillComplete("Disaster Recovery Planner", 5000);

- **FileManager工具**：`scripts/utils/file-manager.ts`

  ```typescript
  import { FileManager } from "@codebuddy/scripts/utils/file-manager";
  const fm = new FileManager();
  await fm.createDirectory("./disaster-recovery");
  await fm.writeFile("./disaster-recovery/backup-plan.md", backupPlan);

- **ContextManager工具**：`scripts/utils/context-manager.ts`

  ```typescript
  import { ContextManager } from "@codebuddy/scripts/utils/context-manager";
  const ctx = new ContextManager();
  ctx.set("rpo", "5分钟");
  ctx.set("rto", "15分钟");

- **CodeValidator**：`scripts/validators/code-validator.ts`

  ```typescript
  import { CodeValidator } from "@codebuddy/scripts/validators/code-validator";
  const validator = new CodeValidator();
  const result = await validator.validate("./scripts", { language: "bash" });

- **ConfigValidator**：`scripts/validators/config-validator.ts`

  ```typescript
  import { ConfigValidator } from "@codebuddy/scripts/validators/config-validator";
  const validator = new ConfigValidator();
  const result = await validator.validate("./config", { schema: "cronjob" });

### 本skill特有脚本

本skill使用以下特有的工具脚本：

- **[备份生成器](scripts/backup-generator.ts)** - 生成备份脚本和配置

  ```typescript
  import { BackupGenerator } from "./scripts/backup-generator";
  const generator = new BackupGenerator();
  await generator.generatePostgreSQLBackup({
    database: "mydb",
    schedule: "0 1 * * *",
  });

  ```

---

## 📝 使用示例

### 示例1：制定灾备计划

**场景描述**：为在线支付系统制定灾备计划

**输入示例**：

```text
请为在线支付系统制定灾备计划，包括：

1. RTO: 15分钟

2. RPO: 5分钟

3. 需要保证99.9%的可用性

```

**调用方式**：

```bash
invoke skill disaster-recovery-planner

```

**输出示例**：

```markdown
# 灾备计划

## 1. 灾备目标

- **RTO（恢复时间目标）**: 15分钟
- **RPO（恢复点目标）**: 5分钟
- **可用性目标**: 99.9%

## 2. 备份策略

### 2.1 数据备份
- **备份频率**: 每5分钟一次
- **备份方式**: 增量备份 + 每日全量备份
- **备份位置**: 本地 + 异地

```
