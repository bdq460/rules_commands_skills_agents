---
name: system-optimizer
description: 系统性能调优、系统优化和性能分析，确保系统达到最佳性能状态。
---

# System Optimizer Skill

本skill负责系统性能调优、系统优化和性能分析，确保系统达到最佳性能状态。

**💡 重要说明**: 本技能既可以作为产品开发流程的一部分，也可以在任何适合的场景下独立使用。
不需要用户明确声明"我是系统优化师"，只要用户的需求涉及系统优化或性能调优，就可以调用本技能。

**重要说明**：本skill专注于生成优化方案和配置，不涉及实际执行优化操作或修改生产环境。

## 何时使用本Skill

本skill可以在以下场景中独立使用，也可以作为产品开发流程的一部分：

### 独立使用场景

**场景1: 性能优化**

- "优化系统性能"
- "优化数据库查询"
- "优化代码性能"
- "优化API响应时间"
- "优化页面加载速度"

**场景2: 性能分析**

- "分析系统性能瓶颈"
- "分析慢查询"
- "分析内存泄漏"
- "分析并发问题"
- "分析锁竞争"

**场景3: 系统调优**

- "数据库优化"
- "缓存优化"
- "系统调优"
- "性能调优"
- "架构优化"

**场景4: 性能测试**

- "进行压力测试"
- "进行负载测试"
- "进行性能基准测试"
- "进行并发测试"
- "进行性能监控"

**场景5: 性能咨询**

- "如何优化系统性能?"
- "性能优化最佳实践"
- "如何设计高性能系统?"
- "如何优化数据库?"
- "系统性能分析方法"

### 产品开发流程集成

在产品开发流程的**阶段7: 测试验证**中被调用，作为系统优化师角色。

**调用方式**: 由product-development-flow自动调用，传递系统实现、性能数据等上下文。

**触发时机**:

- 业务实现完成后
- 测试验证阶段
- 发现性能问题时

### 触发关键词

以下关键词或短语出现时，建议调用本skill：

**性能优化类**:

- "性能优化"、"系统优化"、"优化性能"
- "查询优化"、"代码优化"、"API优化"

**性能分析类**:

- "性能分析"、"性能瓶颈"、"性能测试"
- "压力测试"、"负载测试"、"性能监控"

**数据库优化类**:

- "数据库优化"、"慢查询优化"、"索引优化"
- "查询优化"、"数据库调优"、"SQL优化"

**缓存优化类**:

- "缓存优化"、"缓存设计"、"缓存策略"
- "缓存实现"、"Redis优化"、"缓存配置"

**咨询类**:

- "性能调优"、"系统调优"、"性能方案"
- "高并发"、"高性能"、"性能最佳实践"

## 🎯 核心职责

### 1. 性能分析和诊断

- 分析系统瓶颈（CPU、内存、I/O、网络）
- 识别慢查询
- 分析内存泄漏
- 检测锁竞争
- 分析并发问题

### 2. 应用性能优化

- 代码级优化建议
- 算法优化
- 缓存策略优化
- 连接池优化
- 异步处理优化

### 3. 数据库性能优化

- 查询优化
- 索引优化
- 表结构优化
- 配置优化
- 分区策略优化

### 4. 系统架构优化

- 负载均衡策略
- 水平扩展方案
- 垂直扩展方案
- CDN配置
- 微服务拆分建议

### 5. 网络和传输优化

- HTTP优化（压缩、缓存、Keep-Alive）
- TCP优化
- WebSocket优化
- 协议选择（HTTP/2, gRPC）

## 🤝 协作关系与RACI矩阵

### 本技能的定位

本技能负责系统性能调优、系统优化和性能分析,确保系统达到最佳性能状态。在产品开发流程中处于阶段7:测试验证,是系统性能保障的核心。

### 协作的技能类型

本技能主要与以下类型技能协作:

1. **前置技能**: backend-engineer、frontend-engineer、data-engineer
2. **后置技能**: devops-generator、tester
3. **同级技能**: 无
4. **依赖技能**: technical-architect

### 协作场景

| 场景 | 协作技能 | 协作方式 | 协作内容 |
|------|----------|----------|----------|
| 后端性能优化 | backend-engineer | 顺序协作 | 分析后端代码性能,提供优化建议 |
| 前端性能优化 | frontend-engineer | 顺序协作 | 分析前端代码性能,提供优化建议 |
| 数据库性能优化 | data-engineer | 顺序协作 | 分析数据库查询性能,提供优化方案 |
| 部署配置协作 | devops-generator | 顺序协作 | 提供性能监控配置要求 |
| 性能测试协作 | tester | 顺序协作 | 提供性能测试数据,分析测试结果 |

### 本技能在各阶段的RACI角色

| 阶段 | 本技能角色 | 主要职责 |
|------|------------|----------|
| 阶段1: 需求提出 | I | 了解性能需求,参与需求评审 |
| 阶段2: 需求分析 | I | 参与性能目标讨论 |
| 阶段5: 业务实现 | C | 咨询性能优化方案 |
| 阶段6: 架构保障 | C | 咨询架构对性能的影响 |
| 阶段7: 测试验证 | R/A | 进行性能分析,制定优化方案 |
| 阶段8: 性能优化 | R/A | 执行性能优化,监控效果 |
| 阶段11: DevOps配置 | C | 协作配置性能监控 |
| 阶段12: 项目协调与交付 | I | 知晓性能优化状态,确认交付 |

### 本技能的核心任务RACI

| 任务 | 本技能 | backend-engineer | frontend-engineer | tester |
|------|--------|-----------------|-----------------|--------|
| 性能分析 | R/A | C | C | I |
| 性能优化 | R/A | R/A | R/A | C |
| 性能测试 | C | C | C | R/A |
| 性能监控 | R/A | C | C | I |

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
| 性能目标冲突 | 低 | 直接协商 |
| 优化方案分歧 | 中 | 第三方协调 |
| 资源分配冲突 | 中 | 第三方协调 |
| 性能 vs 功能冲突 | 高 | 项目协调器介入 |

### 4级冲突升级路径

#### Level 1: 直接协商(本技能内部)

**适用场景**:

- 冲突严重程度: 低-中
- 冲突类型: 性能目标冲突、优化方案分歧
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
- 冲突类型: 资源分配冲突、优化方案无法达成一致
- 处理时限: < 15分钟

**协调人选择**:

| 冲突类型 | 推荐协调人 | 原因 |
|----------|-----------|------|
| 资源分配冲突 | devops-generator | 资源管理专家 |
| 性能目标冲突 | technical-architect | 技术架构权威 |
| 功能 vs 性能冲突 | product-expert | 产品决策权威 |

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
- 冲突类型: 性能 vs 功能冲突、核心决策无法达成一致
- 处理时限: < 30分钟

**项目协调器权限**:

- 暂停优化工作
- 重新评估优先级
- 修改性能目标
- 要求重新制定方案
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
- 冲突类型: 核心性能目标无法达成,涉及业务决策
- 处理时限: 无限制(等待用户决策)

**用户决策选项**:

| 选项 | 说明 | 适用场景 |
|------|------|----------|
| 选项A | 继续优化 | 继续当前优化方案,可能延长开发时间 |
| 选项B | 降低性能目标 | 降低性能目标,优先功能完整性 |
| 选项C | 增加资源 | 增加服务器资源,提升性能 |
| 选项D | 重新架构 | 根本性改变架构 |

---

## 📋 工作流程

```mermaid
graph LR
    A[收集性能数据] --> B[分析瓶颈]
    B --> C[识别问题]
    C --> D[制定优化方案]
    D --> E[生成优化配置]
    E --> F[生成监控方案]
    F --> G[编写优化文档]

## 🔄 输入要求

### 必需输入

- **系统架构**：技术栈、架构设计
- **性能指标**：当前性能数据（QPS、响应时间、错误率）
- **业务场景**：用户量、并发量、数据量
- **性能目标**：目标性能指标

### 可选输入

- **性能分析报告**：APM工具报告、监控数据
- **慢查询日志**：数据库慢查询日志
- **应用日志**：应用性能日志
- **资源使用数据**：CPU、内存、磁盘、网络使用情况

## 📦 交付物

### 1. 性能分析报告

#### 性能瓶颈分析示例

```markdown
# 性能分析报告

## 系统概况

- 系统类型：电商网站
- 用户规模：日活10万
- 并发量：峰值5000 QPS
- 响应时间：平均300ms，P99 2000ms

## 性能瓶颈分析

### 1. 数据库瓶颈 ⚠️ 严重

**问题描述**：

- 80%的请求涉及数据库查询
- 平均查询时间：150ms
- 慢查询数量：5000/天
- 数据库CPU使用率：85%

**影响范围**：

- 商品列表页
- 订单查询
- 用户信息查询

**根本原因**：

1. 缺乏索引（orders表）

2. N+1查询问题

3. 没有使用缓存

### 2. 应用内存瓶颈 ⚠️ 中等

**问题描述**：

- 内存使用率：75%
- GC频率：每分钟10次
- GC时间：平均50ms

**影响范围**：

- 所有API端点

**根本原因**：

1. 对象创建过多

2. 缓存配置不当

3. 缺乏对象池

### 3. 网络I/O瓶颈 ⚠️ 中等

**问题描述**：

- 响应体平均大小：500KB
- HTTP/1.1协议
- 没有启用压缩

**影响范围**：

- 静态资源加载
- API响应

## 优化建议

[见优化方案]

### 2. 应用性能优化方案

#### 代码级优化示例

```typescript
// 优化前：N+1查询问题
async function getUserOrders(userId: number) {
  const user = await db.users.findById(userId);
  const orders = await db.orders.findMany({ userId });

  // N+1查询
  for (const order of orders) {
    order.items = await db.orderItems.findMany({ orderId: order.id });
    for (const item of order.items) {
      item.product = await db.products.findById(item.productId);
    }
  }

  return { user, orders };
}

// 优化后：使用JOIN和批量查询
async function getUserOrdersOptimized(userId: number) {
  const user = await db.users.findById(userId);
  const orders = await db.orders.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return { user, orders };
}

// 性能对比：
// 优化前：1 + N + N*M 次查询
// 优化后：1 次查询
// 优化效果：查询次数减少99%，响应时间从2000ms降到50ms

#### 缓存策略示例

```typescript
import { Redis } from "ioredis";

const redis = new Redis();

// 多级缓存策略
async function getProduct(productId: number) {
  // L1: 内存缓存
  const l1Cache = memoryCache.get(`product:${productId}`);
  if (l1Cache) {
    return l1Cache;
  }

  // L2: Redis缓存
  const l2Cache = await redis.get(`product:${productId}`);
  if (l2Cache) {
    const data = JSON.parse(l2Cache);
    memoryCache.set(`product:${productId}`, data, 60); // 60秒内存缓存
    return data;
  }

  // L3: 数据库
  const product = await db.products.findById(productId);
  if (product) {
    // 设置Redis缓存，1小时过期
    await redis.setex(`product:${productId}`, 3600, JSON.stringify(product));
    // 设置内存缓存
    memoryCache.set(`product:${productId}`, product, 60);
  }

  return product;
}

// 缓存预热
async function warmupCache() {
  const popularProducts = await db.products.findMany({
    where: { popular: true },
  });

  for (const product of popularProducts) {
    await redis.setex(`product:${product.id}`, 3600, JSON.stringify(product));
  }
}

// 缓存失效策略
async function updateProduct(productId: number, data: any) {
  // 更新数据库
  await db.products.update(productId, data);

  // 删除缓存
  await redis.del(`product:${productId}`);
  memoryCache.del(`product:${productId}`);
}

#### 连接池优化示例

```typescript
import { Pool as PostgresPool } from "pg";

// 优化连接池配置
const dbPool = new PostgresPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // 最大连接数
  min: 5, // 最小连接数
  idleTimeoutMillis: 30000, // 空闲连接超时
  connectionTimeoutMillis: 2000, // 连接超时
});

// Redis连接池优化
import Redis from "ioredis";

const redisCluster = new Redis.Cluster(
  [
    { host: "redis-1", port: 6379 },
    { host: "redis-2", port: 6379 },
    { host: "redis-3", port: 6379 },
  ],
  {
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    scaleReads: "slave",
    redisOptions: {
      connectTimeout: 10000,
      maxRetriesPerRequest: 3,
    },
  },
);

### 3. 数据库性能优化方案

#### 查询优化示例

```sql
-- 优化前：全表扫描
SELECT * FROM orders
WHERE status = 'pending'
AND created_at > '2024-01-01'
ORDER BY created_at DESC
LIMIT 100;

-- 执行计划：Seq Scan on orders (cost=0.00..12345.67 rows=100 width=1024)
-- 实际执行时间：2.5s

-- 优化1：添加索引
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);

-- 执行计划：Index Scan using idx_orders_status_created
--   on orders (cost=0.29..1234.56 rows=100 width=1024)
-- 实际执行时间：0.05s

-- 优化2：使用覆盖索引
CREATE INDEX idx_orders_status_created`covering ON orders(status, created_at DESC)
INCLUDE (user_id, total_amount);

-- 优化3：使用部分索引
CREATE INDEX idx_orders`active ON orders(status, created_at DESC)
WHERE status IN ('pending', 'paid');

-- 优化后查询
SELECT user_id, total_amount, created_at
FROM orders
WHERE status = 'pending'
AND created_at > '2024-01-01'
ORDER BY created_at DESC
LIMIT 100;

-- 执行时间：0.01s
-- 性能提升：250倍

#### 数据库配置优化示例

```ini
# PostgreSQL优化配置

# 内存配置
shared_buffers = 4GB              # 系统内存的25%
effective_cache_size = 12GB        # 系统内存的75%
work_mem = 64MB                   # 每个查询操作的工作内存
maintenance_work_mem = 512MB       # 维护操作内存

# 连接配置
max_connections = 200              # 最大连接数
superuser_reserved_connections = 3  # 超级用户保留连接

# WAL配置
wal_buffers = 16MB                 # WAL缓冲区
checkpoint_completion_target = 0.9 # 检查点完成目标
max_wal_size = 4GB                # 最大WAL大小

# 查询优化
random_page_cost = 1.1            # 随机页面访问成本（SSD）
effective_io_concurrency = 200     # 有效IO并发数

# 统计信息
default_statistics_target = 100     # 统计信息目标

# 自动清理
autovacuum = on                    # 启用自动清理
autovacuum_max_workers = 4         # 自动清理工作进程

### 4. 系统架构优化方案

#### 负载均衡配置示例

```nginx
# Nginx负载均衡配置
upstream backend {
    least_conn;  # 最少连接算法

    server backend1.example.com:3000 weight=3;
    server backend2.example.com:3000 weight=2;
    server backend3.example.com:3000 weight=1;
    server backend4.example.com:3000 backup;  # 备用服务器

    # 健康检查
    health_check interval=5s fails=3 passes=2;
}

server {
    listen 80;
    server_name api.example.com;

    # HTTP/2支持
    http2 on;

    # 启用压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 连接优化
    keepalive_timeout 65;
    keepalive_requests 100;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set`header X-Real-IP $remote`addr;
        proxy_set`header X-Forwarded-For $proxy`add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时配置
        proxy_connect_timeout 5s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}

#### 水平扩展方案示例

```yaml
# Kubernetes水平扩展配置
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 30
        - type: Pods
          value: 4
          periodSeconds: 30
      selectPolicy: Max

### 5. 网络和传输优化方案

#### HTTP优化示例

```typescript
// 启用HTTP/2和压缩
import express from "express";
import compression from "compression";
import helmet from "helmet";

const app = express();

// 安全头
app.use(helmet());

// 启用Gzip压缩
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 1024, // 大于1KB才压缩
    level: 6, // 压缩级别
  }),
);

// 启用Brotli压缩（需要nginx支持）
// nginx.conf:
// brotli on;
// brotli_comp_level 6;
// brotli_types text/plain text/css application/json application/javascript;

// 缓存策略
app.use(
  express.static("public", {
    maxAge: "1y", // 静态资源缓存1年
    etag: true,
    lastModified: true,
  }),
);

// API响应缓存
app.get("/api/products", async (req, res) => {
  res.set("Cache-Control", "public, max-age=300"); // 5分钟缓存
  const products = await getProducts();
  res.json(products);
});

### 6. 监控和告警配置

#### Prometheus监控配置示例

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "api"
    static_configs:
      - targets: ["api:3000"]
    metrics_path: "/metrics"
    scrape_interval: 10s

  - job_name: "postgres"
    static_configs:
      - targets: ["postgres-exporter:9187"]

  - job_name: "redis"
    static_configs:
      - targets: ["redis-exporter:9121"]

  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]

# 告警规则
rule_files:
  - "alerts.yml"

#### 告警规则示例

```yaml
# alerts.yml
groups:
  - name: api_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} for the last 5 minutes"

      - alert: HighResponseTime
        expr: histogram`quantile(0.99, http`request_duration_seconds_bucket) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "P99 response time is {{ $value }}s"

      - alert: HighCPUUsage
        expr: rate(process_cpu_seconds_total[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is {{ $value }}%"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 / 1024 > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is {{ $value }}GB"

### 7. 性能优化文档

#### 优化文档模板

```markdown
# 性能优化文档

## 优化概述

本文档描述了[系统名称]的性能优化方案。

## 性能目标

- QPS目标：10000
- 平均响应时间：< 100ms
- P99响应时间：< 500ms
- 错误率：< 0.1%

## 性能现状

- 当前QPS：5000
- 平均响应时间：300ms
- P99响应时间：2000ms
- 错误率：0.5%

## 优化方案

### 1. 数据库优化

[详细方案]

### 2. 缓存优化

[详细方案]

### 3. 应用优化

[详细方案]

### 4. 架构优化

[详细方案]

## 优化效果预估

- 预期QPS提升：2倍
- 预期响应时间降低：60%
- 预期错误率降低：90%

## 监控方案

[监控配置]

## 实施计划

[实施步骤和时间表]

## 🔍 性能分析工具

### 应用性能监控（APM）

| 工具        | 适用场景 | 特点           |
| ----------- | -------- | -------------- |
| New Relic   | 全栈APM  | 功能全面，易用 |
| Datadog     | 云原生   | 集成度高       |
| Elastic APM | 开源     | 自主可控       |
| Prometheus  | 指标监控 | 灵活强大       |

### 数据库性能分析

| 工具                     | 数据库     | 特点         |
| ------------------------ | ---------- | ------------ |
| pg_stat_statements       | PostgreSQL | 查询性能统计 |
| Explain Plan             | 通用       | 查询执行计划 |
| MySQL Performance Schema | MySQL      | 性能监控     |
| MongoDB Profiler         | MongoDB    | 查询分析     |

### 代码性能分析

| 工具             | 语言       | 特点         |
| ---------------- | ---------- | ------------ |
| Chrome DevTools  | JavaScript | 浏览器端分析 |
| Node.js Profiler | Node.js    | 服务端分析   |
| pprof            | Go         | CPU/内存分析 |
| JProfiler        | Java       | 综合分析     |

## 📊 性能优化清单

### 应用层优化

- [ ] 审查并优化慢查询
- [ ] 实施缓存策略
- [ ] 优化数据库连接池
- [ ] 实施异步处理
- [ ] 优化算法和数据结构
- [ ] 减少内存分配
- [ ] 优化序列化/反序列化

### 数据库层优化

- [ ] 添加缺失的索引
- [ ] 优化现有索引
- [ ] 实施数据库分区
- [ ] 优化数据库配置
- [ ] 实施读写分离
- [ ] 清理过期数据
- [ ] 定期更新统计信息

### 网络层优化

- [ ] 启用HTTP/2
- [ ] 启用压缩
- [ ] 配置缓存头
- [ ] 使用CDN
- [ ] 优化TCP配置
- [ ] 减少DNS查询

### 系统层优化

- [ ] 配置负载均衡
- [ ] 实施水平扩展
- [ ] 优化系统内核参数
- [ ] 配置资源限制
- [ ] 实施容器化

### 监控优化

- [ ] 配置性能监控
- [ ] 设置告警规则
- [ ] 配置日志收集
- [ ] 实施链路追踪

## 🔄 集成到开发流程

### 触发时机

1. **系统性能不达标**
   - 响应时间超过阈值
   - QPS无法满足需求
   - 错误率过高

2. **系统扩容前**
   - 用户量增长
   - 业务量增加

3. **定期优化**
   - 每季度一次全面评估
   - 每月一次性能检查

### 调用方式

```typescript
const systemOptimizer = await useSkill("system-optimizer");

const optimization = await systemOptimizer.optimize({
  architecture: systemArchitecture,
  performanceData: currentPerformance,
  performanceGoals: targetPerformance,
  monitoringTools: ["prometheus", "grafana"],
});

await saveOptimizationPlan(optimization.plan);
await saveMonitoringConfig(optimization.monitoring);
await saveOptimizationDocumentation(optimization.documentation);

## 📊 质量标准

- ✅ 性能分析准确
- ✅ 优化方案可行
- ✅ 优化效果可量化
- ✅ 监控配置完善
- ✅ 文档清晰完整

## ⚠️ 注意事项

### 优化原则

1. **先测量，后优化**
   - 使用性能数据指导优化
   - 避免过早优化

2. **优化瓶颈优先**
   - 找出最大瓶颈
   - 优先解决影响最大的问题

3. **渐进式优化**
   - 一次只优化一个方面
   - 每次优化后评估效果

4. **权衡取舍**
   - 权衡性能与可维护性
   - 权衡成本与收益

### 优化风险

- 过度优化可能降低可维护性
- 优化可能引入新问题
- 需要充分的测试验证
- 需要监控优化效果

---

## 调用其他技能

### 调用时机

本skill在以下情况需要主动调用其他技能：

1. **数据库优化时** - 调用数据工程师

2. **应用优化时** - 调用前端工程师或后端工程师

3. **架构优化时** - 调用技术架构师

4. **监控配置时** - 调用DevOps配置生成器

### 调用的技能及场景

#### 1. 调用数据工程师（data-engineer）

**调用时机**：

- 当需要优化数据库Schema时
- 当需要设计索引策略时
- 当需要优化查询性能时

**调用方式**：

```typescript
const dataEngineer = await useSkill("data-engineer");
const optimization = await dataEngineer.optimizeDatabase({
  queries: slowQueries,
  schema: currentSchema,
});

**调用场景**：

**场景1**：数据库索引优化

- **输入**：慢查询分析、访问模式
- **调用**：data-engineer设计索引策略
- **输出**：索引设计方案、创建脚本

**场景2**：查询性能优化

- **输入**：慢查询SQL、执行计划
- **调用**：data-engineer优化查询
- **输出**：优化后的SQL、性能对比

#### 2. 调用后端工程师（backend-engineer）

**调用时机**：

- 当需要优化应用代码时
- 当需要优化算法时
- 当需要优化数据结构时

**调用方式**：

```typescript
const backendEngineer = await useSkill("backend-engineer");
const optimizedCode = await backendEngineer.optimizePerformance({
  code: sourceCode,
  bottlenecks: performanceBottlenecks,
});

**调用场景**：

**场景1**：代码性能优化

- **输入**：性能瓶颈分析、源代码
- **调用**：backend-engineer优化代码实现
- **输出**：优化后的代码、性能提升对比

**场景2**：算法优化

- **输入**：算法复杂度分析、数据特征
- **调用**：backend-engineer优化算法
- **输出**：优化后的算法、复杂度分析

#### 3. 调用前端工程师（frontend-engineer）

**调用时机**：

- 当需要优化前端性能时
- 当需要优化资源加载时
- 当需要优化渲染性能时

**调用方式**：

```typescript
const frontendEngineer = await useSkill("frontend-engineer");
const optimizedFrontend = await frontendEngineer.optimizePerformance({
  performanceIssues: frontendIssues,
  bundleSize: bundleMetrics,
});

**调用场景**：

**场景1**：前端资源优化

- **输入**：资源大小、加载时间
- **调用**：frontend-engineer优化资源加载
- **输出**：优化后的资源、加载方案

**场景2**：渲染性能优化

- **输入**：渲染瓶颈、组件树
- **调用**：frontend-engineer优化渲染
- **输出**：优化后的组件、渲染方案

#### 4. 调用技术架构师（technical-architect）

**调用时机**：

- 当需要优化系统架构时
- 当需要设计缓存架构时
- 当需要设计负载均衡时

**调用方式**：

```typescript
const technicalArchitect = await useSkill("technical-architect");
const architectureOptimization = await technicalArchitect.optimizeArchitecture({
  currentArchitecture: architecture,
  performanceGoals: goals,
});

**调用场景**：

**场景1**：架构性能优化

- **输入**：当前架构、性能目标
- **调用**：technical-architect优化架构设计
- **输出**：优化后的架构、迁移方案

**场景2**：缓存架构设计

- **输入**：访问模式、数据特征
- **调用**：technical-architect设计缓存架构
- **输出**：缓存架构方案、缓存策略

#### 5. 调用DevOps配置生成器（devops-generator）

**调用时机**：

- 当需要配置性能监控时
- 当需要配置告警规则时
- 当需要配置日志收集时

**调用方式**：

```typescript
const devopsGenerator = await useSkill("devops-generator");
const monitoringConfig = await devopsGenerator.configureMonitoring({
  metrics: performanceMetrics,
  thresholds: alertThresholds,
});

**调用场景**：

**场景1**：监控配置生成

- **输入**：性能指标、监控目标
- **调用**：devops-generator生成监控配置
- **输出**：监控配置文件、仪表板配置

**场景2**：告警规则配置

- **输入**：性能阈值、业务目标
- **调用**：devops-generator设计告警规则
- **输出**：告警规则配置、通知策略

### 调用注意事项

1. **基线建立**：优化前必须建立性能基线

2. **影响评估**：评估优化对其他功能的影响

3. **渐进优化**：采用渐进式优化策略

4. **效果验证**：优化后必须验证效果

---

## 总结

System Optimizer Skill专注于：

1. ✅ 性能分析和诊断

2. ✅ 应用性能优化

3. ✅ 数据库性能优化

4. ✅ 系统架构优化

5. ✅ 网络和传输优化

6. ✅ 生成监控和告警配置

7. ✅ 编写性能优化文档

**重要说明**：

- ❌ 不实际执行优化操作
- ❌ 不修改生产环境
- ✅ 专注于生成优化方案和配置
- ✅ 由DevOps工程师或系统管理员实际执行优化

## 📚 参考资料

### 全局参考资料

本skill参考以下全局参考资料：

- **编码规范**：`references/best-practices/coding.md`（包含命名规范、函数设计原则、代码组织规范、注释规范、错误处理规范）
- **设计模式**：`references/design-patterns/creational.md`、`references/design-patterns/structural.md`、`references/design-patterns/behavioral.md`
- **架构参考**：`references/architecture/hexagonal-architecture.md`、`references/architecture/microservices.md`

### 本skill特有参考资料

本skill使用以下特有的参考资料：

- **[性能优化指南](references/performance-optimization.md)** - 包含性能优化策略和方法

## 🛠️ 工具脚本

### 全局工具脚本

本skill使用以下全局工具脚本：

- **Logger工具**：`scripts/utils/logger.ts`

```typescript
import { createLogger } from "@codebuddy/scripts/utils/logger";
const logger = createLogger("System Optimizer");
logger.info("开始性能优化");
logger.skillComplete("System Optimizer", 5000);

- **FileManager工具**：`scripts/utils/file-manager.ts`

```typescript
import { FileManager } from "@codebuddy/scripts/utils/file-manager";
const fm = new FileManager();
await fm.createDirectory("./optimization");
await fm.writeFile("./optimization/report.md", optimizationReport);

- **ContextManager工具**：`scripts/utils/context-manager.ts`

```typescript
import { ContextManager } from "@codebuddy/scripts/utils/context-manager";
const ctx = new ContextManager();
ctx.set("optimizationType", "performance");

- **CodeValidator**：`scripts/validators/code-validator.ts`

```typescript
import { CodeValidator } from "@codebuddy/scripts/validators/code-validator";
const validator = new CodeValidator();
const result = await validator.validate("./src", { checkPerformance: true });

- **ConfigValidator**：`scripts/validators/config-validator.ts`

```typescript
import { ConfigValidator } from "@codebuddy/scripts/validators/config-validator";
const validator = new ConfigValidator();
const result = await validator.validate("./config", { schema: "performance" });

### 本skill特有脚本

本skill使用以下特有的工具脚本：

- **[性能优化器](scripts/performance-optimizer.ts)** - 生成性能优化方案

```typescript
import { PerformanceOptimizer } from "./scripts/performance-optimizer";
const optimizer = new PerformanceOptimizer();
await optimizer.optimize({
  target: "response-time",
  threshold: 500,
});

---

## 📝 使用示例

### 示例1：性能优化

**场景描述**：优化API响应速度

**输入示例**：

```text

请优化商品列表API的性能，当前问题：

- 响应时间：2秒
- 数据量：10万条商品记录
- QPS：100

```

**调用方式**：

```bash
invoke skill system-optimizer

```

**输出示例**：

```markdown
# 性能优化方案

## 问题分析

当前商品列表API响应时间为2秒，无法满足业务需求。

## 优化方案

### 1. 数据库优化

**添加索引**

```sql
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_status ON products(status);

```

### 2.1 优化查询

```sql
-- 优化前
SELECT * FROM products WHERE status = 'active';

-- 优化后
SELECT id, name, price FROM products
WHERE status = 'active'
LIMIT 20;

```

### 2. 缓存优化

```typescript
// 使用Redis缓存
async function getProductList(categoryId: string) {
  const cacheKey = `products:${categoryId}`;

  // 尝试从缓存获取
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 从数据库查询
  const products = await db.query(
    'SELECT * FROM products WHERE category_id = ?',
    [categoryId]
  );

  // 写入缓存（过期时间5分钟）
  await redis.setex(cacheKey, 300, JSON.stringify(products));

  return products;
}

```

## 预期效果

- 响应时间：2秒 → 100ms
- QPS：100 → 1000
