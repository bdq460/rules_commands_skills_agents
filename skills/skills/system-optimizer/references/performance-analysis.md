# Performance Analysis References

本文档提供性能分析的方法、工具和最佳实践。

## 📋 性能指标定义

### 1. 响应时间指标

**检查项**：

- [ ] 定义响应时间SLA
- [ ] 设置p50、p95、p99阈值
- [ ] 配置APM工具

**指标定义**：

```typescript
interface PerformanceMetrics {
  // 响应时间百分位
  p50: number;  // 50%的请求在此时间内完成
  p95: number;  // 95%的请求在此时间内完成
  p99: number;  // 99%的请求在此时间内完成
  
  // 吞吐量
  throughput: number;  // 每秒请求数（RPS）
  
  // 错误率
  errorRate: number;  // 错误请求百分比
  
  // 并发数
  concurrency: number;  // 同时处理的请求数
}

// SLA阈值示例
const slaThresholds = {
  api: {
    p50: 100,   // ms
    p95: 500,   // ms
    p99: 1000   // ms
  },
  database: {
    queryTime: {
      p50: 10,    // ms
      p95: 100,   // ms
      p99: 500    // ms
    }
  }
};

```

### 2. 资源利用率指标

**检查项**：

- [ ] CPU利用率监控
- [ ] 内存使用监控
- [ ] 磁盘I/O监控
- [ ] 网络流量监控
- [ ] 数据库连接池监控

**资源阈值配置**：

```typescript
interface ResourceThresholds {
  cpu: {
    warning: 70,   // %
    critical: 90   // %
  };
  memory: {
    warning: 80,   // %
    critical: 95   // %
  };
  disk: {
    warning: 80,   // %
    critical: 90   // %
  };
  connections: {
    warning: 70,   // %
    critical: 90   // %
  };
}

const thresholds: ResourceThresholds = {
  cpu: {
    warning: 70,
    critical: 90
  },
  memory: {
    warning: 80,
    critical: 95
  }
};

```

## 📋 性能瓶颈识别

### 1. 数据库性能

**检查项**：

- [ ] 慢查询分析
- [ ] 索引使用检查
- [ ] N+1查询检测
- [ ] 连接池配置
- [ ] 死锁检测

**慢查询分析示例**：

```sql
-- 查找慢查询（执行时间超过1秒）
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE total_time > 1000
ORDER BY mean_time DESC
LIMIT 20;

-- 查看执行计划
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 123;

-- 检查缺失的索引
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  seq_scan
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY n_distinct DESC;

-- 查看索引使用情况
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

```

### 2. 应用性能

**检查项**：

- [ ] 内存泄漏检测
- [ ] CPU密集型任务识别
- [ ] I/O阻塞识别
- [ ] 事件循环检测
- [ ] 同步操作检查

**Node.js性能分析示例**：

```typescript
import * as v8 from 'v8';

// 查看内存快照
function getMemorySnapshot() {
  const snapshot = v8.getHeapStatistics();
  console.log({
    total_heap_size: snapshot.total_heap_size / 1024 / 1024, // MB
    used_heap_size: snapshot.used_heap_size / 1024 / 1024, // MB
    heap_size_limit: snapshot.heap_size_limit / 1024 / 1024, // MB
    total_available_size: snapshot.total_available_size / 1024 / 1024 // MB
  });
}

// 检查事件循环延迟
function checkEventLoopDelay() {
  let lastTick = process.hrtime.bigint();
  let delaySum = 0;
  let delayCount = 0;
  
  setInterval(() => {
    const now = process.hrtime.bigint();
    const delay = Number(now - lastTick);
    
    if (delay > 10) {  // 延迟超过10ms
      delaySum += delay;
      delayCount++;
      
      console.log(`Event loop delay: ${delay}ms`);
    }
    
    lastTick = now;
  }, 1000);
  
  // 每分钟报告平均延迟
  setInterval(() => {
    if (delayCount > 0) {
      const avgDelay = delaySum / delayCount;
      console.log(`Average event loop delay: ${avgDelay.toFixed(2)}ms`);
      delaySum = 0;
      delayCount = 0;
    }
  }, 60000);
}

```

### 3. 网络性能

**检查项**：

- [ ] 带宽使用率
- [ ] 延迟监控
- [ ] 丢包率
- [ ] 连接数监控
- [ ] DNS解析时间

**网络性能检查示例**：

```bash
# 测试网络延迟
ping -c 100 api.example.com | tail -5

# 测试带宽
iperf3 -c api.example.com -t 60

# 检查DNS解析时间
time nslookup api.example.com

# 检查TCP连接时间
time nc -zv api.example.com 443

```

## 📋 性能优化策略

### 1. 缓存优化

**检查项**：

- [ ] 应用层缓存（Redis、Memcached）
- [ ] CDN缓存配置
- [ ] 数据库查询缓存
- [ ] HTTP缓存头设置
- [ ] 缓存失效策略

**Redis缓存配置示例**：

```typescript
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    keepAlive: 30000,
    reconnectStrategy: 'reconnect'
  }
});

interface CacheOptions {
  ttl: number;  // 过期时间（秒）
  prefix: string;
}

// 通用缓存函数
async function cacheGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = { ttl: 3600, prefix: 'app:' }
): Promise<T> {
  // 1. 尝试从缓存获取
  const cached = await redis.get(options.prefix + key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. 缓存未命中，调用fetcher
  const data = await fetcher();
  
  // 3. 存入缓存
  await redis.setex(
    options.prefix + key,
    options.ttl,
    JSON.stringify(data)
  );
  
  return data;
}

// 使用示例
async function getUser(id: string) {
  return cacheGet(
    `user:${id}`,
    () => db.query('SELECT * FROM users WHERE id = $1', [id]),
    { ttl: 3600, prefix: 'user:' }
  );
}

```

### 2. 数据库优化

**检查项**：

- [ ] 索引优化
- [ ] 查询优化
- [ ] 连接池配置
- [ ] 读写分离
- [ ] 分区表设计

**查询优化示例**：

```sql
-- ❌ 低效：子查询
SELECT u.* FROM users u
WHERE u.id IN (
  SELECT user_id FROM orders WHERE created_at > NOW() - INTERVAL '30 days'
);

-- ✅ 高效：JOIN
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id;

-- ✅ 使用索引覆盖查询
CREATE INDEX CONCURRENTLY idx_orders_user_created 
ON orders(user_id, created_at DESC);

-- ✅ 使用EXISTS代替IN
SELECT 1 as exists
FROM users u
WHERE u.email = 'test@example.com'
AND EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

```

### 3. 异步处理

**检查项**：

- [ ] 异步任务队列
- [ ] 后台作业处理
- [ ] Web Worker使用
- [ ] 流处理
- [ ] 批量处理

**Node.js Worker示例**：

```typescript
// worker.js
const { parentPort, workerData } = require('worker_threads');

function processTask(task: any) {
  // 执行CPU密集型任务
  const result = heavyComputation(task.data);
  parentPort.postMessage({ taskId: task.id, result });
}

parentPort.on('message', (message) => {
  if (message.type === 'task') {
    processTask(message);
  }
});

// 主线程使用
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

function runInWorker(task: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', {
      workerData: task
    });
    
    worker.on('message', (result) => {
      if (result.taskId === task.id) {
        resolve(result.result);
        worker.terminate();
      }
    });
    
    worker.on('error', reject);
  });
}

// 使用示例
async function processLargeDataset(data: any[]) {
  const chunkSize = 1000;
  const chunks = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  
  // 并行处理
  const results = await Promise.all(
    chunks.map(chunk => runInWorker(chunk))
  );
  
  return results.flat();
}

```

## 📋 性能监控工具

### 1. APM工具配置

**检查项**：

- [ ] APM agent安装
- [ ] 应用性能追踪
- [ ] 分布式追踪
- [ ] 错误追踪
- [ ] 自定义监控

**APM集成示例**：

```typescript
import * as apm from 'elastic-apm-node';

const apmClient = apm.start({
  serviceName: 'my-app',
  serverUrl: process.env.APM_SERVER_URL,
  environment: process.env.NODE_ENV,
  
  // 配置追踪
  captureSpanStackTraces: true,
  centralConfig: true,
  active: true,
  instrument: true,
  
  // 配置错误追踪
  logLevel: 'info',
  captureErrorLogStackTraces: true,
});

// 创建自定义事务
async function processRequest(req: any, res: any) {
  const transaction = apmClient.startTransaction(
    'request',
    'custom'
  );
  
  try {
    // 处理请求
    await handleRequest(req, res);
    transaction.setOutcome('success');
  } catch (error) {
    transaction.setOutcome('error');
    apmClient.captureError(error);
    throw error;
  } finally {
    transaction.end();
  }
}

```

### 2. 日志分析

**检查项**：

- [ ] 结构化日志
- [ ] 日志级别配置
- [ ] 错误日志聚合
- [ ] 日志搜索和过滤
- [ ] 日志保留策略

**结构化日志示例**：

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    }
  }
});

// 结构化日志记录
logger.info({
  event: 'user_login',
  userId: 123,
  timestamp: new Date().toISOString(),
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0'
});

// 错误日志
logger.error({
  event: 'database_error',
  error: {
    message: error.message,
    stack: error.stack,
    code: 'ERR_DB_QUERY'
  },
  query: 'SELECT * FROM users WHERE id = 123',
  params: [123]
});

```

## 📋 性能测试

### 1. 负载测试

**检查项**：

- [ ] 并发用户配置
- [ ] 测试场景设计
- [ ] 阶梯式压测
- [ ] 持续压测
- [ ] 瓶颈识别

**K6负载测试示例**：

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },   // 预热阶段
    { duration: '5m', target: 500 },   // 正常负载
    { duration: '5m', target: 1000 }, // 峰值负载
    { duration: '2m', target: 100 },   // 降级阶段
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],     // 95%的请求在500ms内完成
    http_req_failed: ['rate<0.01'],        // 错误率低于1%
  },
};

export default function () {
  // 模拟用户登录
  let loginRes = http.post('https://api.example.com/login', {
    username: 'testuser',
    password: 'testpass'
  });
  
  check(loginRes, {
    'status is 200': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined
  });
  
  let token = loginRes.json('token');
  
  // 执行API请求
  const requests = http.batch([
    ['GET', 'https://api.example.com/users', null, { headers: { 'Authorization': `Bearer ${token}` }}],
    ['GET', 'https://api.example.com/users/1', null, { headers: { 'Authorization': `Bearer ${token}` }}],
    ['GET', 'https://api.example.com/users/2', null, { headers: { 'Authorization': `Bearer ${token}` }}],
    ['GET', 'https://api.example.com/users/3', null, { headers: { 'Authorization': `Bearer ${token}` }}],
  ]);
  
  check(requests[0], {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}

```

### 2. 压力测试

**检查项**：

- [ ] 极限负载测试
- [ ] 系统极限识别
- [ ] 失败点识别
- [ ] 自动扩缩容触发测试
- [ ] 恢复能力测试

**JMeter压测计划**：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0">
  <hashTree>
    <TestPlan>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">100</stringProp>
        <stringProp name="ThreadGroup.ramp_time">60</stringProp>
        <LoopController>
          <stringProp name="LoopController.loops">-1</stringProp>
        </LoopController>
        
        <!-- HTTP请求 -->
        <HTTPSamplerProxy guiclass="HTTPSamplerProxy">
          <stringProp name="HTTPSampler.domain">api.example.com</stringProp>
          <stringProp name="HTTPSampler.port">443</stringProp>
          <stringProp name="HTTPSampler.path">/api/users</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
        </HTTPSamplerProxy>
        
        <!-- 监听器 -->
        <ResultCollector guiclass="ViewResultsFullVisualizer"/>
        <Summariser guiclass="SummaryReport"/>
        <GraphVisualizer guiclass="StatVisualizer"/>
      </ThreadGroup>
    </TestPlan>
  </hashTree>
</jmeterTestPlan>

```

## 📚 参考资料

### 性能优化资源

- [Google Web Performance](https://web.dev/performance/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [Performance Budgets](https://web.dev/performance-budget-calculator/)
- [Node.js Performance](https://nodejs.org/en/docs/guides/simple-profiling/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

### 监控和APM工具

- [New Relic](https://newrelic.com/)
- [Datadog](https://www.datadoghq.com/)
- [Elastic APM](https://www.elastic.co/apm/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [Jaeger](https://www.jaegertracing.io/)

### 测试工具

- [Apache JMeter](https://jmeter.apache.org/)
- [k6](https://k6.io/)
- [Gatling](https://gatling.io/)
- [Locust](https://locust.io/)
- [Artillery](https://artillery.io/)
