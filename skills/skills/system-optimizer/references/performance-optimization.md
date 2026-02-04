# 性能优化参考指南

本文档提供系统性能优化的策略、方法和最佳实践。

## 🔍 性能分析

### 1. 性能指标

```typescript
interface PerformanceMetrics {
  // 响应时间
  responseTime: {
    avg: number; // 平均响应时间
    p50: number; // 50分位响应时间
    p95: number; // 95分位响应时间
    p99: number; // 99分位响应时间
    max: number; // 最大响应时间
  };

  // 吞吐量
  throughput: {
    rps: number; // 每秒请求数
    rpm: number; // 每分钟请求数
    rph: number; // 每小时请求数
  };

  // 错误率
  errorRate: {
    total: number; // 总错误率
    byType: {
      // 按类型分类的错误率
      clientError: number;
      serverError: number;
    };
  };

  // 资源使用
  resourceUsage: {
    cpu: {
      usage: number; // CPU使用率
      cores: number; // CPU核心数
    };
    memory: {
      used: number; // 已用内存(MB)
      total: number; // 总内存(MB)
      usage: number; // 内存使用率
    };
    disk: {
      used: number; // 已用磁盘(GB)
      total: number; // 总磁盘(GB)
      usage: number; // 磁盘使用率
      iops: number; // IOPS
    };
    network: {
      inbound: number; // 入网流量(MB/s)
      outbound: number; // 出网流量(MB/s)
    };
  };

  // 数据库
  database: {
    connections: {
      active: number;
      idle: number;
      max: number;
      usage: number;
    };
    queries: {
      slow: number; // 慢查询数量
      avgTime: number; // 平均查询时间
      maxTime: number; // 最大查询时间
    };
    cache: {
      hitRate: number; // 缓存命中率
      missRate: number; // 缓存未命中率
    };
  };
}

```

### 2. 性能瓶颈识别

```typescript
interface PerformanceBottleneck {
  id: string;
  type: "cpu" | "memory" | "disk" | "network" | "database" | "application";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metrics: {
    current: number;
    threshold: number;
    unit: string;
  };
  impact: string;
  recommendation: string;
}

class PerformanceAnalyzer {
  /** *分析性能瓶颈*/
  analyzeBottlenecks(metrics: PerformanceMetrics): PerformanceBottleneck[] {
    const bottlenecks: PerformanceBottleneck[] = [];

    // CPU瓶颈
    if (metrics.resourceUsage.cpu.usage > 80) {
      bottlenecks.push({
        id: "B001",
        type: "cpu",
        severity: metrics.resourceUsage.cpu.usage > 90 ? "critical" : "high",
        description: "CPU使用率过高",
        metrics: {
          current: metrics.resourceUsage.cpu.usage,
          threshold: 80,
          unit: "%",
        },
        impact: "系统响应变慢，可能导致请求超时",
        recommendation: "优化算法、减少循环、使用缓存、增加服务器资源",
      });
    }

    // 内存瓶颈
    if (metrics.resourceUsage.memory.usage > 85) {
      bottlenecks.push({
        id: "B002",
        type: "memory",
        severity: metrics.resourceUsage.memory.usage > 95 ? "critical" : "high",
        description: "内存使用率过高",
        metrics: {
          current: metrics.resourceUsage.memory.usage,
          threshold: 85,
          unit: "%",
        },
        impact: "系统可能触发OOM，导致服务崩溃",
        recommendation: "检查内存泄漏、优化数据结构、增加内存、使用内存池",
      });
    }

    // 数据库瓶颈
    if (metrics.database.queries.slow > 10) {
      bottlenecks.push({
        id: "B003",
        type: "database",
        severity: metrics.database.queries.slow > 50 ? "critical" : "high",
        description: "慢查询过多",
        metrics: {
          current: metrics.database.queries.slow,
          threshold: 10,
          unit: "queries",
        },
        impact: "数据库成为瓶颈，影响整体性能",
        recommendation: "优化SQL语句、添加索引、使用缓存、读写分离",
      });
    }

    return bottlenecks.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
}

```

## ⚡ 应用性能优化

### 1. 算法优化

```typescript
/**
 *算法优化示例*/

// ❌ 低效算法 - O(n²)
function findDuplicatesSlow(arr: number[]): number[] {
  const duplicates: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// ✅ 高效算法 - O(n)
function findDuplicatesFast(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();

  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    } else {
      seen.add(num);
    }
  }

  return Array.from(duplicates);
}

// ❌ 低效 - 每次都计算数组长度
function sumSlow(arr: number[]): number {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

// ✅ 高效 - 缓存数组长度
function sumFast(arr: number[]): number {
  let total = 0;
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    total += arr[i];
  }
  return total;
}

// ✅ 最优 - 使用reduce
function sumBest(arr: number[]): number {
  return arr.reduce((total, num) => total + num, 0);
}

```

### 2. 缓存优化

```typescript
/**
 *缓存优化示例*/

interface CacheOptions {
  ttl?: number; // 过期时间(秒)
  maxSize?: number; // 最大缓存条目数
  staleWhileRevalidate?: boolean; // 允许返回过期缓存同时更新
}

class MemoryCache<T> {
  private cache = new Map<string, { value: T; expires: number }>();
  private maxSize: number;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 300; // 默认5分钟
  }

  /** *获取缓存*/
  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // 检查是否过期
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /** *设置缓存*/
  set(key: string, value: T, ttl?: number): void {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const expires = Date.now() + (ttl || this.ttl) * 1000;
    this.cache.set(key, { value, expires });
  }

  /** *删除缓存*/
  delete(key: string): void {
    this.cache.delete(key);
  }

  /** *清空缓存*/
  clear(): void {
    this.cache.clear();
  }

  /** *获取缓存统计*/
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

// 使用缓存装饰器
function cached(cache: MemoryCache<any>, ttl?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;

      // 尝试从缓存获取
      const cachedResult = cache.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // 执行原始方法
      const result = await originalMethod.apply(this, args);

      // 存入缓存
      cache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

// 使用示例
const userCache = new MemoryCache({ ttl: 600, maxSize: 500 });

class UserService {
  @cached(userCache)
  async getUserById(id: string): Promise<User> {
    // 模拟数据库查询
    return await this.userRepository.findById(id);
  }
}

```

### 3. 异步优化

```typescript
/**
 *异步优化示例*/

// ❌ 串行执行 - 慢
async function fetchUsersSlow(userIds: string[]): Promise<User[]> {
  const users: User[] = [];
  for (const id of userIds) {
    const user = await fetchUserById(id);
    users.push(user);
  }
  return users;
}

// ✅ 并行执行 - 快
async function fetchUsersFast(userIds: string[]): Promise<User[]> {
  const promises = userIds.map(id => fetchUserById(id));
  return Promise.all(promises);
}

// ✅ 限制并发数
async function fetchUsersWithLimit(
  userIds: string[],
  limit: number = 5
): Promise<User[]> {
  const results: User[] = [];

  for (let i = 0; i < userIds.length; i += limit) {
    const batch = userIds.slice(i, i + limit);
    const promises = batch.map(id => fetchUserById(id));
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  return results;
}

/**
 `请求去重 - 避免重复请求`/
class RequestDeduplicator<T> {
  private pendingRequests = new Map<string, Promise<T>>();

  async execute(key: string, fn: () => Promise<T>): Promise<T> {
    // 检查是否有相同请求正在进行
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // 执行新请求
    const promise = fn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// 使用示例
const deduplicator = new RequestDeduplicator<User>();

async function getUserWithDedupe(id: string): Promise<User> {
  return deduplicator.execute(`user:${id}`, () => fetchUserById(id));
}

```

## 🗄️ 数据库性能优化

### 1. SQL优化

```sql
-- ❌ 低效查询 - 全表扫描
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

-- ✅ 高效查询 - 使用范围查询
SELECT * FROM orders
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- ❌ 低效查询 - 子查询
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE status = 'completed');

-- ✅ 高效查询 - JOIN
SELECT DISTINCT u.*
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed';

-- ❌ 低效查询 - SELECT *SELECT* FROM products WHERE category_id = 1;

-- ✅ 高效查询 - 只选择需要的字段
SELECT id, name, price FROM products WHERE category_id = 1;

-- ❌ 低效查询 - N+1问题
-- 1. 先查询用户
SELECT * FROM users LIMIT 10;
-- 2. 为每个用户查询订单（执行10次）
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM orders WHERE user_id = 2;
-- ...

-- ✅ 高效查询 - 使用JOIN或子查询
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
LIMIT 10;

-- ✅ 使用分页避免一次性加载大量数据
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

```

### 2. 索引优化

```sql
-- 创建单列索引
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 创建复合索引
CREATE INDEX idx_orders_user`status ON orders(user_id, status);

-- 创建部分索引（只索引满足条件的行）
CREATE INDEX idx_active`orders ON orders(user_id, created_at)
WHERE status IN ('pending', 'paid');

-- 创建表达式索引
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- 创建全文搜索索引
CREATE INDEX idx_products_name_gin ON products USING gin(to_tsvector('english', name));

-- 创建哈希索引（适合等值查询）
CREATE INDEX idx_users_id_hash ON users USING HASH (id);

-- 删除索引
DROP INDEX idx_orders_created_at;

-- 分析索引使用情况
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

```

### 3. 数据库连接池优化

```typescript
/**
 *数据库连接池配置*/
import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  // 最大连接数
  max: 20,

  // 最小连接数
  min: 2,

  // 获取连接超时时间(毫秒)
  connectionTimeoutMillis: 10000,

  // 空闲连接超时时间(毫秒)
  idleTimeoutMillis: 30000,

  // 查询超时时间(毫秒)
  query_timeout: 5000,

  // 连接最大使用次数
  maxUses: 7500,

  // SSL配置
  ssl: process.env.NODE_ENV === "production",
};

const pool = new Pool(poolConfig);

/**
 *监控连接池状态*/
function getPoolStats() {
  return {
    totalCount: pool.totalCount, // 总连接数
    idleCount: pool.idleCount, // 空闲连接数
    waitingCount: pool.waitingCount, // 等待连接数
  };
}

// 定期监控连接池
setInterval(() => {
  const stats = getPoolStats();
  console.log("Pool stats:", stats);

  // 如果等待连接数过多，增加连接池大小
  if (stats.waitingCount > 5) {
    console.warn("High waiting count, consider increasing pool size");
  }
}, 60000);

```

## 🌐 网络优化

### 1. HTTP/2和HTTP/3

```typescript
import http2 from 'http2';

/**
 `使用HTTP/2服务器`/
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  // HTTP/2多路复用
  stream.respond({
    'content-type': 'application/json',
    ':status': 200
  });

  stream.end(JSON.stringify({ message: 'Hello HTTP/2' }));
});

server.listen(3000);

/**
 `HTTP/2推送（Server Push）`/
server.on('stream', (stream, headers) => {
  const filePath = headers[':path'];

  // 推送相关资源
  stream.pushStream({ ':path': '/styles.css' }, (err, pushStream) => {
    if (err) return;

    pushStream.respond({ 'content-type': 'text/css' });
    pushStream.end('body { margin: 0; }');
  });

  // 响应主要请求
  stream.respond({ 'content-type': 'text/html' });
  stream.end('<html><body>Hello</body></html>');
});

```

### 2. CDN和缓存策略

```typescript
/**
 *CDN缓存策略配置*/
const cacheConfig = {
  // 静态资源 - 长时间缓存
  '/static/*`/`': {
    'Cache-Control': 'public, max-age=31536000, immutable'
  },

  // 图片 - 中等时间缓存
  '/images/*`/`': {
    'Cache-Control': 'public, max-age=86400'
  },

  // API响应 - 短时间缓存
  '/api/**': {
    'Cache-Control': 'public, max-age=300, s-maxage=600'
  },

  // HTML - 不缓存
  '/*.html': {
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  },

  // 动态内容 - 不缓存
  '/dashboard/**': {
    'Cache-Control': 'private, no-cache'
  }
};

/**
 `ETag和Last-Modified支持`/
function setCacheHeaders(res: any, entity: any) {
  // 生成ETag
  const etag = generateETag(entity);
  res.setHeader('ETag', etag);

  // 设置Last-Modified
  if (entity.updatedAt) {
    res.setHeader('Last-Modified', entity.updatedAt.toUTCString());
  }

  // 检查条件请求
  const ifNoneMatch = req.headers['if-none-match'];
  const ifModifiedSince = req.headers['if-modified-since'];

  if (ifNoneMatch === etag || ifModifiedSince === entity.updatedAt.toUTCString()) {
    res.statusCode = 304;
    res.end();
    return true;
  }

  return false;
}

```

## 📊 性能监控

### 1. 应用性能监控(APM)

```typescript
/**
 *性能监控工具*/
class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  /** *记录指标*/
  record(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // 只保留最近1000个数据点
    if (values.length > 1000) {
      values.shift();
    }
  }

  /** *获取统计信息*/
  getStats(name: string) {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /** *清空指标*/
  clear(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
}

/**
 *函数执行时间监控*/
function measureTime<T>(name: string, fn: () => T): T {
  const monitor = PerformanceMonitor.getInstance();
  const start = Date.now();

  try {
    const result = fn();
    const duration = Date.now() - start;
    monitor.record(name, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    monitor.record(`${name}.error`, duration);
    throw error;
  }
}

/**
 *异步函数执行时间监控*/
async function measureTimeAsync<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();
  const start = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - start;
    monitor.record(name, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    monitor.record(`${name}.error`, duration);
    throw error;
  }
}

```

## 📚 参考资料

- 《高性能MySQL》- Baron Schwartz
- 《深入理解计算机系统》- Randal E. Bryant
- 《性能之巅》- Brendan Gregg
- 《Web性能权威指南》- Ilya Grigorik
