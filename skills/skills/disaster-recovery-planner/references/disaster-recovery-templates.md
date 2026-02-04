# 灾难恢复模板

本文档提供灾难恢复（DR）相关的模板、策略和最佳实践。

## 📋 灾备需求分析

### 1. 需求分析模板

```markdown
# 灾备需求分析报告

## 项目信息

| 项目名称 | My Application | 版本   | v1.0.0     |
| -------- | -------------- | ------ | ---------- |
| 分析日期 | 2024-01-01     | 分析人 | 灾备工程师 |

## 业务影响分析

### 关键业务流程

| 业务流程 | 重要性 | 停机可容忍时间 | 数据丢失容忍度 | 影响描述         |
| -------- | ------ | -------------- | -------------- | ---------------- |
| 用户注册 | 高     | 4小时          | 无             | 新用户无法注册   |
| 用户登录 | 关键   | 1小时          | 无             | 现有用户无法登录 |
| 商品浏览 | 中     | 8小时          | 1小时          | 用户无法浏览商品 |
| 下单支付 | 关键   | 30分钟         | 无             | 影响收入         |
| 订单查询 | 高     | 2小时          | 1小时          | 用户无法查询订单 |
| 数据分析 | 低     | 24小时         | 24小时         | 影响运营决策     |

### RTO和RPO定义

| 系统     | RTO（恢复时间目标） | RPO（恢复点目标） | 优先级 |
| -------- | ------------------- | ----------------- | ------ |
| 用户认证 | 1小时               | 0                 | P0     |
| 订单系统 | 30分钟              | 0                 | P0     |
| 支付系统 | 30分钟              | 0                 | P0     |
| 商品系统 | 4小时               | 1小时             | P1     |
| 数据分析 | 24小时              | 24小时            | P2     |

*`RTO (Recovery Time Objective)`*：系统故障后，恢复业务运行所需的最长时间。

*`RPO (Recovery Point Objective)`*：可容忍的数据丢失时间范围。

## 风险识别

### 威胁类型

| 威胁类型 | 可能性 | 影响程度 | 风险等级 | 频率      |
| -------- | ------ | -------- | -------- | --------- |
| 硬件故障 | 中     | 高       | 高       | 每年1-2次 |
| 软件故障 | 高     | 中       | 高       | 每月1-2次 |
| 人为错误 | 高     | 高       | 高       | 每月2-3次 |
| 网络攻击 | 低     | 高       | 中       | 每年1次   |
| 自然灾害 | 低     | 高       | 高       | 每10年1次 |
| 电力故障 | 中     | 高       | 中       | 每年1-2次 |

### 灾难场景

**场景1：数据中心故障**

- 描述：主数据中心因电力故障或自然灾害无法访问
- 影响：所有服务中断
- 恢复时间：4-8小时
- 恢复措施：切换到备用数据中心

**场景2：数据库损坏**

- 描述：数据库因软件故障或人为错误导致数据损坏
- 影响：服务中断，数据丢失
- 恢复时间：1-4小时
- 恢复措施：从备份恢复数据

**场景3：勒索软件攻击**

- 描述：系统被勒索软件加密
- 影响：服务中断，数据被加密
- 恢复时间：1-3天
- 恢复措施：从离线备份恢复，清除恶意软件

## 现状评估

### 当前备份策略

| 数据类型 | 备份频率              | 保留时间 | 存储位置    | 恢复能力       |
| -------- | --------------------- | -------- | ----------- | -------------- |
| 数据库   | 每日全量 + 每小时增量 | 30天     | 本地 + 远程 | 支持时间点恢复 |
| 代码仓库 | 实时                  | 永久     | 云端        | 支持版本回退   |
| 配置文件 | 每日                  | 90天     | 本地 + 远程 | 支持快速恢复   |
| 日志文件 | 每日                  | 180天    | 远程        | 用于审计和分析 |

### 现有恢复能力

| 系统     | 当前RTO | 目标RTO | 达标情况 | 当前RPO | 目标RPO | 达标情况 |
| -------- | ------- | ------- | -------- | ------- | ------- | -------- |
| 用户认证 | 4小时   | 1小时   | ❌       | 1小时   | 0       | ❌       |
| 订单系统 | 4小时   | 30分钟  | ❌       | 1小时   | 0       | ❌       |
| 支付系统 | 4小时   | 30分钟  | ❌       | 1小时   | 0       | ❌       |
| 商品系统 | 8小时   | 4小时   | ✅       | 1小时   | 1小时   | ✅       |

## 改进建议

### 短期改进（1-3个月）

1. **备份优化**
   - [ ] 实现实时数据库复制
   - [ ] 增加备份频率到每15分钟
   - [ ] 实施备份验证机制

2. **恢复能力提升**
   - [ ] 建立备用数据中心
   - [ ] 制定详细恢复流程
   - [ ] 定期演练恢复流程

3. **监控告警**
   - [ ] 实施实时监控
   - [ ] 配置关键告警
   - [ ] 建立值班响应机制

### 长期改进（3-12个月）

1. **高可用架构**
   - [ ] 实施多活架构
   - [ ] 实现自动故障切换
   - [ ] 优化负载均衡

2. **自动化运维**
   - [ ] 实施基础设施即代码
   - [ ] 自动化部署和恢复
   - [ ] 持续集成灾备测试

3. **安全加固**
   - [ ] 实施零信任架构
   - [ ] 加强安全监控
   - [ ] 定期安全审计

## 资源需求

### 人力资源

| 角色       | 人数 | 职责               |
| ---------- | ---- | ------------------ |
| 灾备工程师 | 1    | 灾备方案设计和实施 |
| 运维工程师 | 2    | 日常监控和维护     |
| DBA        | 1    | 数据库备份和恢复   |
| 安全工程师 | 1    | 安全防护和审计     |

### 技术资源

| 资源类型   | 数量  | 用途           |
| ---------- | ----- | -------------- |
| 备用服务器 | 2     | 主备数据中心   |
| 存储设备   | 5TB   | 备份数据存储   |
| 网络带宽   | 1Gbps | 数据同步和恢复 |
| 备份软件   | 1套   | 数据备份管理   |

### 预算估算

| 项目     | 年度成本     |
| -------- | ------------ |
| 硬件设备 | $50,000      |
| 软件许可 | $20,000      |
| 云服务   | $30,000      |
| 人力成本 | $200,000     |
| 演练培训 | $10,000      |
| **总计**|**$310,000** |

```

## 🔄 备份策略

### 1. 备份类型

```typescript
enum BackupType {
  Full = "full", // 全量备份
  Incremental = "incremental", // 增量备份
  Differential = "differential", // 差异备份
  Snapshot = "snapshot", // 快照
}

interface BackupSchedule {
  type: BackupType;
  frequency: string; // 每日、每小时等
  retentionPeriod: number; // 保留时间（天）
  storageLocation: string; // 存储位置
  compression: boolean; // 是否压缩
  encryption: boolean; // 是否加密
}

// 备份策略示例
const backupStrategy: BackupSchedule[] = [
  {
    type: BackupType.Full,
    frequency: "daily",
    retentionPeriod: 30,
    storageLocation: "remote",
    compression: true,
    encryption: true,
  },
  {
    type: BackupType.Incremental,
    frequency: "hourly",
    retentionPeriod: 7,
    storageLocation: "remote",
    compression: true,
    encryption: true,
  },
  {
    type: BackupType.Snapshot,
    frequency: "every_15min",
    retentionPeriod: 1,
    storageLocation: "local",
    compression: false,
    encryption: true,
  },
];

```

### 2. 数据库备份脚本

```bash
#!/bin/bash
# PostgreSQL备份脚本

# 配置
BACKUP_DIR="/backups/postgresql"
RETENTION_DAYS=30
DB_NAME="myapp"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP`FILE="${BACKUP`DIR}/${DB_NAME}_${TIMESTAMP}.dump.gz"
LOG_FILE="/var/log/postgres-backup.log"

# 创建备份目录
mkdir -p ${BACKUP_DIR}

# 执行全量备份
echo "[$(date)] Starting full backup" >> ${LOG_FILE}
pg`dump -h localhost -U postgres -d ${DB`NAME} | gzip > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup successful: ${BACKUP`FILE}" >> ${LOG`FILE}

  # 上传到远程存储
  aws s3 cp ${BACKUP_FILE} s3://my-backups/postgresql/

  # 删除过期备份
  find ${BACKUP_DIR} -name "*.dump.gz" -mtime +${RETENTION_DAYS} -delete

  # 记录备份元数据
  echo "{
    \"timestamp\": \"$(date -Iseconds)\",
    \"file\": \"${BACKUP_FILE}\",
    \"size\": \"$(stat -f%z ${BACKUP_FILE})\",
    \"type\": \"full\",
    \"status\": \"success\"
  }" > ${BACKUP`DIR}/metadata`${TIMESTAMP}.json
else
  echo "[$(date)] Backup failed" >> ${LOG_FILE}
  exit 1
fi

```

```bash
#!/bin/bash
# PostgreSQL增量备份脚本（使用WAL归档）

# 配置 (重复2)
WAL_DIR="/backups/postgresql/wal"
ARCHIVE`DIR="${WAL`DIR}/archive"
RETENTION_DAYS=7

# 创建WAL归档目录
mkdir -p ${ARCHIVE_DIR}

# 归档WAL日志
cp $1 ${ARCHIVE`DIR}/$(basename $1).$(date +%Y%m%d`%H%M%S)

# 清理过期的WAL日志
find ${ARCHIVE`DIR} -mtime +${RETENTION`DAYS} -delete

# 记录归档信息
echo "[$(date)] Archived WAL: $1" >> /var/log/postgres-wal-archive.log

```

## 🏗️ 容灾架构

### 1. 主备架构（Active-Passive）

```mermaid
graph LR
    A[用户] --> B[负载均衡]
    B -->|正常流量| C[主数据中心]
    C -->|实时复制| D[备数据中心]

    B -.->|故障时切换| D
    E[监控系统] --> C
    E --> D
    E -.->|检测到故障| B

```

**特点**：

- 主数据中心处理所有流量
- 备数据中心实时同步数据
- 故障时切换到备数据中心
- 资源利用率低，但实现简单

**配置示例**：

```yaml
# Docker Compose - 主数据中心
version: '3.8'

services:
  app-primary:
    image: myapp:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ROLE=primary
      - DATABASE_URL=postgresql://user:pass@db-primary:5432/myapp
    depends_on:
      db-primary:
        condition: service_healthy

  db-primary:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/postgres-backup.sh:/backup.sh
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s

volumes:
  postgres_data:

# Docker Compose - 备数据中心
version: '3.8'

services:
  app-standby:
    image: myapp:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ROLE=standby
      - DATABASE_URL=postgresql://user:pass@db-standby:5432/myapp
    depends_on:
      db-standby:
        condition: service_healthy

  db-standby:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_REPLICATION_USER=replicator
      - POSTGRES_REPLICATION_PASSWORD=replpass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    command: |
      postgres
      -c wal_level=replica
      -c hot_standby=on
      -c max_wal_senders=3
      -c max_replication_slots=3
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s

volumes:
  postgres_data:

```

### 2. 双活架构（Active-Active）

```mermaid
graph LR
    A[用户] --> B[负载均衡]
    B -->|50%流量| C[数据中心1]
    B -->|50%流量| D[数据中心2]
    C <-->|双向同步| D

    E[全局负载均衡] --> C
    E --> D

```

**特点**：

- 两个数据中心同时处理流量
- 数据双向实时同步
- 任一数据中心故障不影响服务
- 资源利用率高，但实现复杂

### 3. 数据复制策略

```typescript
enum ReplicationMode {
  Synchronous = "synchronous", // 同步复制
  Asynchronous = "asynchronous", // 异步复制
  SemiSynchronous = "semi-synchronous", // 半同步复制
}

interface ReplicationConfig {
  mode: ReplicationMode;
  primary: string;
  standbys: string[];
  lagThreshold: number; // 复制延迟阈值（秒）
  failoverEnabled: boolean;
}

// PostgreSQL复制配置
const postgresReplication: ReplicationConfig = {
  mode: ReplicationMode.Synchronous,
  primary: "db-primary.example.com",
  standbys: ["db-standby-1.example.com", "db-standby-2.example.com"],
  lagThreshold: 5,
  failoverEnabled: true,
};

```

## 🔄 故障切换方案

### 1. 自动故障切换

```typescript
/**
 *故障检测和自动切换*/
class FailoverController {
  private primaryUrl: string;
  private standbyUrls: string[];
  private currentPrimary: string;
  private healthCheckInterval: number;

  constructor(
    primaryUrl: string,
    standbyUrls: string[],
    healthCheckInterval: number = 30000, // 30秒
  ) {
    this.primaryUrl = primaryUrl;
    this.standbyUrls = standbyUrls;
    this.currentPrimary = primaryUrl;
    this.healthCheckInterval = healthCheckInterval;
  }

  /** *启动健康检查*/
  startHealthCheck(): void {
    setInterval(async () => {
      const isHealthy = await this.checkHealth(this.currentPrimary);

      if (!isHealthy) {
        console.warn("Primary is unhealthy, initiating failover");
        await this.failover();
      }
    }, this.healthCheckInterval);
  }

  /** *检查服务健康状态*/
  private async checkHealth(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${url}/health`, {
        method: "GET",
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.error(`Health check failed for ${url}:`, error);
      return false;
    }
  }

  /** *执行故障切换*/
  private async failover(): Promise<void> {
    console.log("Starting failover process...");

    // 查找健康的备用服务器
    for (const standby of this.standbyUrls) {
      const isHealthy = await this.checkHealth(standby);
      if (isHealthy) {
        // 切换主服务器
        await this.promoteToPrimary(standby);
        return;
      }
    }

    console.error("No healthy standby found, failover failed");
  }

  /** *提升备用服务器为主服务器*/
  private async promoteToPrimary(url: string): Promise<void> {
    console.log(`Promoting ${url} to primary...`);

    try {
      // 调用提升接口
      await fetch(`${url}/promote`, { method: "POST" });

      // 更新当前主服务器
      const oldPrimary = this.currentPrimary;
      this.currentPrimary = url;

      // 将旧主服务器降级为备用
      this.standbyUrls.push(oldPrimary);

      console.log(`Failover completed. New primary: ${url}`);

      // 发送告警通知
      this.sendAlert(`Failover completed. New primary: ${url}`);
    } catch (error) {
      console.error("Failover failed:", error);
      throw error;
    }
  }

  /** *发送告警*/
  private sendAlert(message: string): void {
    // 实现告警发送逻辑（邮件、短信、Slack等）
    console.log("ALERT:", message);
  }
}

```

### 2. 手动故障切换流程

```markdown
# 手动故障切换流程

## 前置条件

- [ ] 确认主服务器确实故障
- [ ] 检查备用服务器状态正常
- [ ] 通知相关团队
- [ ] 获得切换授权

## 切换步骤

### 1. 停止应用流量（可选）

```bash
# 停止负载均衡器到主服务器的转发
# 或使用DNS切换
```

### 2. 验证数据同步状态

```bash
# 检查备服务器数据滞后
psql -h standby -U postgres -c "SELECT pg_last_xact_replay_timestamp();"

```

### 3. 提升备用服务器

```bash
# 连接到备用服务器
psql -h standby -U postgres

# 提升为主服务器
SELECT pg_promote();

```

### 4. 更新应用配置

```bash
# 更新环境变量或配置文件
export DATABASE_URL="postgresql://user:pass@standby:5432/myapp"

# 重启应用
systemctl restart myapp

```

### 5. 更新负载均衡

```bash
# 更新负载均衡器配置
# 指向新的主服务器
```

### 6. 验证服务

```bash
# 检查应用状态
curl http://localhost:3000/health

# 检查数据库连接
psql -h standby -U postgres -d myapp -c "SELECT NOW();"

```

## 回滚方案

如果切换失败，执行回滚：

1. 停止应用流量

2. 降级新主服务器为备用

3. 恢复旧主服务器

4. 更新应用配置

5. 重启应用

6. 验证服务

## 切换后检查清单

- [ ] 应用服务正常
- [ ] 数据库连接正常
- [ ] 数据完整性验证
- [ ] 性能指标正常
- [ ] 日志正常记录
- [ ] 监控告警正常
- [ ] 备份策略生效

## 切换后操作

- [ ] 分析故障原因
- [ ] 修复故障系统
- [ ] 重新建立复制
- [ ] 更新文档
- [ ] 总结经验教训

## 📋 演练计划

### 1. 演练类型

```markdown
# 演练计划

## 演练目标

验证灾难恢复方案的有效性，提高团队应急响应能力。

## 演练类型

### 桌面演练（Tabletop Exercise）

- **频率**：每季度
- **时长**：2-4小时
- **参与人员**：所有关键角色
- **内容**：模拟灾难场景，讨论应对措施

### 模拟演练（Simulation Exercise）

- **频率**：每半年
- **时长**：1天
- **参与人员**：运维、开发、测试团队
- **内容**：在测试环境模拟故障，执行恢复流程

### 全面演练（Full-Scale Exercise）

- **频率**：每年
- **时长**：1-2天
- **参与人员**：所有相关人员
- **内容**：在生产环境演练（或尽可能接近生产）

```

### 2. 演练脚本

```markdown
# 灾难恢复演练脚本

## 演练信息

- **演练名称**：数据中心故障恢复演练
- **演练日期**：2024-01-15
- **演练时间**：09:00 - 17:00
- **演练负责人**：灾备工程师
- **参与人员**：运维工程师、DBA、开发工程师

## 演练场景

主数据中心因电力故障无法访问，需要切换到备用数据中心。

## 演练步骤

### 阶段1：故障检测（09:00-09:30）

- [ ] 模拟主数据中心故障
- [ ] 监控系统检测到故障
- [ ] 发送告警通知
- [ ] 组建应急响应团队

**检查点**：

- 监控系统在5分钟内检测到故障
- 告警通知在10分钟内发送
- 应急团队在30分钟内组建完成

### 阶段2：故障评估（09:30-10:00）

- [ ] 评估故障影响范围
- [ ] 确认备用数据中心状态
- [ ] 制定恢复计划
- [ ] 获得切换授权

**检查点**：

- 影响评估准确
- 备用数据中心状态正常
- 恢复计划合理

### 阶段3：故障切换（10:00-11:00）

- [ ] 停止流量到主数据中心
- [ ] 提升备用数据中心
- [ ] 更新应用配置
- [ ] 更新负载均衡
- [ ] 验证服务恢复

**检查点**：

- 切换在1小时内完成
- 服务恢复验证通过

### 阶段4：功能验证（11:00-12:00）

- [ ] 验证核心功能
- [ ] 验证数据完整性
- [ ] 验证性能指标
- [ ] 记录测试结果

**检查点**：

- 所有核心功能正常
- 数据完整性验证通过
- 性能指标符合要求

### 阶段5：回滚准备（14:00-15:00）

- [ ] 修复主数据中心
- [ ] 准备回滚方案
- [ ] 确认回滚步骤

**检查点**：

- 主数据中心恢复完成
- 回滚方案明确

### 阶段6：演练总结（15:00-17:00）

- [ ] 执行回滚（如需要）
- [ ] 收集演练数据
- [ ] 召开复盘会议
- [ ] 编写演练报告
- [ ] 制定改进计划

**检查点**：

- 演练报告完整
- 改进计划明确

## 演练指标

| 指标         | 目标值  | 实际值 | 达标情况 |
| ------------ | ------- | ------ | -------- |
| 故障检测时间 | <5分钟  | 分钟   |          |
| 告警发送时间 | <10分钟 | 分钟   |          |
| 团队组建时间 | <30分钟 | 分钟   |          |
| 故障切换时间 | <60分钟 | 分钟   |          |
| 服务恢复时间 | <2小时  | 小时   |          |
| 数据完整性   | 100%    | %      |          |

## 演练记录

### 问题记录

| 时间  | 问题描述          | 影响     | 处理措施     | 负责人 | 状态   |
| ----- | ----------------- | -------- | ------------ | ------ | ------ |
| 09:15 | 监控告警延迟5分钟 | 响应延迟 | 检查告警系统 | 运维   | 待处理 |

### 经验总结

**做得好的地方**：

- 备用数据中心状态正常
- 切换流程清晰
- 团队协作顺畅

**需要改进的地方**：

- 监控告警延迟
- 文档不够详细
- 演练前培训不足

### 改进计划

1. 优化监控系统，减少告警延迟

2. 完善演练文档，增加详细步骤

3. 增加演练前培训，提高团队熟悉度

## 演练报告

**演练结果**：✅ 通过 / ❌ 失败

**主要发现**：

- 备份恢复时间超出目标15分钟
- 部分功能验证不完整

**改进建议**：

- 优化恢复流程
- 完善验证清单

**后续行动**：

- [ ] 更新灾备文档（负责人：XXX，截止：2024-01-20）
- [ ] 优化恢复脚本（负责人：XXX，截止：2024-01-25）
- [ ] 安排下次演练（时间：2024-04-15）

```

## 📚 参考资料

- 《业务连续性与灾难恢复》- Paul Kirvan
- 《高可用MySQL》- Charles Bell
- PostgreSQL官方文档 - 备份与恢复
- AWS Disaster Recovery
