# 性能优化最佳实践

本文档提供前端、后端、数据库和系统层面的性能优化指南。

## 前端性能优化

### 1. 代码分割和懒加载

#### 路由懒加载

```typescript
// ❌ 错误示例：一次性加载所有页面
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
// 所有页面都在应用启动时加载

// ✅ 正确示例：路由懒加载
const routes = {
  home: () => import('./pages/HomePage').then(m => m.HomePage),
  about: () => import('./pages/AboutPage').then(m => m.AboutPage),
  contact: () => import('./pages/ContactPage').then(m => m.ContactPage),
};

// React Router 懒加载
import { lazy } from 'react';
import { Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Suspense>
  );
}
```

#### 组件懒加载

```typescript
// ✅ 正确示例：React.lazy
import { lazy, Suspense } from 'react';

// 大组件懒加载
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function Dashboard() {
  const [showReport, setShowReport] = useState(false);

  return (
    <div>
      <button onClick={() => setShowReport(true)}>
        Show Report
      </button>
      {showReport && (
        <Suspense fallback={<LoadingSpinner />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

---

### 2. 代码优化

#### 使用 useMemo 和 useCallback

```typescript
// ❌ 错误示例：每次渲染都重新计算
function ProductList({ products }: { products: Product[] }) {
  // 每次渲染都创建新数组和函数
  const filtered = products.filter(p => p.price > 100);
  const sorted = filtered.sort((a, b) => a.price - b.price);

  return (
    <ul>
      {sorted.map(product => (
        <li key={product.id} onClick={() => console.log(product)}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  );
}

// ✅ 正确示例：使用 Memoize 和 Callback
import { useMemo, useCallback } from 'react';

function ProductList({ products, minPrice }: { products: Product[]; minPrice: number }) {
  // 只在 products 或 minPrice 变化时重新计算
  const filtered = useMemo(() => {
    return products.filter(p => p.price > minPrice);
  }, [products, minPrice]);

  // 只在 products 变化时重新排序
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => a.price - b.price);
  }, [filtered]);

  // 只在 filtered 变化时重新创建函数
  const handleClick = useCallback((product: Product) => {
    console.log('Selected:', product);
  }, []);

  return (
    <ul>
      {sorted.map(product => (
        <li key={product.id} onClick={() => handleClick(product)}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  );
}
```

#### 列表优化

```typescript
// ❌ 错误示例：没有虚拟列表，大数据量时性能差
function LargeList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id} style={{ padding: '10px' }}>
          {item.content}
        </div>
      ))}
    </div>
  );
}

// ✅ 正确示例：使用虚拟列表
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      {items[index].content}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={120}
      width={800}
    >
      {Row}
    </List>
  );
}
```

---

### 3. 资源优化

#### 图片优化

```typescript
// ❌ 错误示例：使用大图
<img src="huge-image.jpg" alt="Product" />

// ✅ 正确示例：响应式图片
<picture>
  <source media="(min-width: 768px)" srcSet="large-2x.jpg 2x, large-1x.jpg" />
  <source media="(min-width: 480px)" srcSet="medium-2x.jpg 2x, medium-1x.jpg" />
  <img src="small.jpg" alt="Product" loading="lazy" />
</picture>

// ✅ 正确示例：WebP 格式
<picture>
  <source type="image/webp" srcSet="image.webp" />
  <source type="image/jpeg" srcSet="image.jpg" />
  <img src="image.jpg" alt="Product" loading="lazy" />
</picture>

// ✅ 正确示例：使用 CDN
<img src="https://cdn.example.com/image.jpg" alt="Product" loading="lazy" />
```

#### 字体优化

```typescript
// ❌ 错误示例：加载所有字体
import './fonts/Roboto-Regular.woff2';
import './fonts/Roboto-Bold.woff2';
import './fonts/Roboto-Italic.woff2';

// ✅ 正确示例：字体子集化
// 使用 Web Font Loader 异步加载需要的字体
const FontLoader = ({ fonts }: { fonts: string[] }) => {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  const handleLoad = (fontName: string) => {
    setLoadedFonts(prev => new Set([...prev, fontName]));
  };

  return (
    <div>
      {fonts.map(font => (
        <link
          key={font}
          href={`/fonts/${font}.woff2`}
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          onLoad={() => handleLoad(font)}
        />
      ))}
    </div>
  );
};
```

---

### 4. 网络优化

#### API 请求优化

```typescript
// ❌ 错误示例：没有缓存，重复请求相同的数据
class ProductService {
  async getProduct(id: string): Promise<Product> {
    // 每次都请求服务器
    const response = await fetch(`/api/products/${id}`);
    return response.json();
  }
}

// ✅ 正确示例：使用缓存和防抖
class OptimizedProductService {
  private cache = new Map<string, Product>();
  private pendingRequests = new Map<string, Promise<Product>>();

  async getProduct(id: string): Promise<Product> {
    // 1. 检查缓存
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    // 2. 检查是否有正在进行的请求
    if (this.pendingRequests.has(id)) {
      return this.pendingRequests.get(id)!;
    }

    // 3. 发起新请求
    const request = fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        // 4. 缓存结果
        this.cache.set(id, data);
        this.pendingRequests.delete(id);
        return data;
      });

    this.pendingRequests.set(id, request);
    return request;
  }

  // 批量请求
  async getProducts(ids: string[]): Promise<Product[]> {
    const response = await fetch('/api/products/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    return response.json();
  }
}
```

#### Service Worker 缓存

```typescript
// ✅ 正确示例：使用 Service Worker 离线缓存
// service-worker.js
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/api/products',
  '/api/users',
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache.map(url => new Request(url)));
    })
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then(response => {
        // 缓存 API 响应
        if (response.ok && response.url.startsWith('/api/')) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      });
    })
  );
});
```

---

## 后端性能优化

### 5. 数据库优化

#### 查询优化

```typescript
// ❌ 错误示例：SELECT * 查询所有字段
async function getAllUsers(pool: any): Promise<User[]> {
  const query = 'SELECT * FROM users';
  const result = await pool.query(query);
  return result.rows;
}

// ✅ 正确示例：只查询需要的字段，添加索引
async function getAllUsers(pool: any): Promise<User[]> {
  // 只查询需要的字段
  const query = 'SELECT id, name, email, created_at FROM users';
  const result = await pool.query(query);
  return result.rows;
}

// ✅ 正确示例：使用索引
// 创建索引
const createIndexes = async () => {
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_users_name ON users USING gin(to_tsvector('name'));
  `);

  console.log('Indexes created successfully');
};

// ✅ 正确示例：使用连接查询，避免 N+1 问题
async function getUsersWithOrders(pool: any, userId: string): Promise<any[]> {
  const query = `
    SELECT u.id, u.name, u.email,
           json_agg(json_build_object('o', o.id, o.status)) as orders
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id = $1
    GROUP BY u.id, u.name, u.email
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}
```

#### 连接池配置

```typescript
// ✅ 正确示例：配置连接池
import { Pool } from 'pg';

const poolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,              // 最大连接数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(poolConfig);

// 使用连接池
async function queryDatabase(sql: string, params: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}
```

---

### 6. 缓存策略

#### Redis 缓存

```typescript
// ✅ 正确示例：使用 Redis 缓存热点数据
import { createClient } from 'redis';

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

interface CacheOptions {
  expiry: number;  // 过期时间（秒）
  keyPrefix: string; // 键前缀
}

// 通用缓存服务
class CacheService {
  constructor(private redis: ReturnType<typeof createClient>) {}

  // 设置缓存
  async set<T>(key: string, value: T, options: CacheOptions): Promise<void> {
    const cacheKey = `${options.keyPrefix}:${key}`;
    await this.redis.set(cacheKey, JSON.stringify(value));
    await this.redis.expire(cacheKey, options.expiry);
  }

  // 获取缓存
  async get<T>(key: string, options: CacheOptions): Promise<T | null> {
    const cacheKey = `${options.keyPrefix}:${key}`;
    const data = await this.redis.get(cacheKey);
    return data ? JSON.parse(data) : null;
  }

  // 删除缓存
  async delete(key: string, options: CacheOptions): Promise<void> {
    const cacheKey = `${options.keyPrefix}:${key}`;
    await this.redis.del(cacheKey);
  }

  // 批量获取
  async mget<T>(keys: string[], options: CacheOptions): Promise<(T | null)[]> {
    const cacheKeys = keys.map(key => `${options.keyPrefix}:${key}`);
    const values = await this.redis.mget(cacheKeys);
    return values.map(v => v ? JSON.parse(v) : null);
  }
}

// 使用示例
const cacheService = new CacheService(redisClient);

class ProductService {
  async getProduct(id: string): Promise<Product> {
    // 1. 尝试从缓存获取
    const cached = await cacheService.get<Product>(id, {
      expiry: 3600,  // 1 小时
      keyPrefix: 'product',
    });

    if (cached) {
      return cached;
    }

    // 2. 从数据库查询
    const product = await this.fetchProductFromDB(id);

    // 3. 写入缓存
    await cacheService.set(id, product, {
      expiry: 3600,
      keyPrefix: 'product',
    });

    return product;
  }

  async fetchProductFromDB(id: string): Promise<Product> {
    // 数据库查询
    return {} as Product;
  }
}
```

---

### 7. 异步处理

#### 队列任务

```typescript
// ✅ 正确示例：使用消息队列异步处理耗时任务
import { Queue, Worker } from 'bullmq';

// 定义任务接口
interface EmailTask {
  to: string;
  subject: string;
  body: string;
}

// 创建队列
const emailQueue = new Queue<EmailTask>('emails', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// 创建任务处理器
const emailWorker = new Worker('emails', async (job: Job<EmailTask>) => {
  const { to, subject, body } = job.data;

  // 发送邮件
  await sendEmail({ to, subject, body });

  console.log(`Email sent to ${to}`);
});

// 添加任务
async function sendWelcomeEmail(email: string): Promise<void> {
  await emailQueue.add('welcome', {
    to: email,
    subject: 'Welcome to our service',
    body: 'Thank you for registering!',
  });
}

// 批量任务
async function sendBulkEmails(emails: string[]): Promise<void> {
  const jobs = emails.map(email => ({
    name: `send-${email}`,
    data: { to: email, subject: 'Newsletter', body: '...' },
  }));

  await emailQueue.addBulk(jobs);
}
```

---

## 系统监控和调优

### 8. 性能监控

#### 性能指标收集

```typescript
// ✅ 正确示例：监控关键性能指标
import { PerformanceObserver, performance } from 'perf_hooks';

const perfObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  for (const entry of entries) {
    console.log('Performance Entry:', {
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      entryType: entry.entryType,
    });
  }
});

// 监控 API 响应时间
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  recordApiResponse(endpoint: string, duration: number): void {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, []);
    }
    this.metrics.get(endpoint)!.push(duration);
  }

  getAverageResponseTime(endpoint: string): number {
    const durations = this.metrics.get(endpoint) || [];
    if (durations.length === 0) return 0;

    const sum = durations.reduce((a, b) => a + b, 0);
    return sum / durations.length;
  }

  getPercentile(endpoint: string, percentile: number): number {
    const durations = (this.metrics.get(endpoint) || []).sort((a, b) => a - b);
    const index = Math.floor((percentile / 100) * durations.length);
    return durations[index];
  }
}

// 使用示例
const monitor = new PerformanceMonitor();

// 记录 API 响应时间
app.use((req, res, next) => {
  const startTime = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - startTime;
    monitor.recordApiResponse(`${req.method} ${req.path}`, duration);
  });

  next();
});
```

#### Web Vitals

```typescript
// ✅ 正确示例：使用 Web Vitals 监控真实用户体验
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// 收集关键性能指标
function collectWebVitals() {
  // LCP (Largest Contentful Paint) - 最大内容绘制
  getLCP('CLS', (metric) => {
    console.log('LCP:', metric.value);
    // 发送到分析服务
    sendToAnalytics({
      metricName: 'LCP',
      value: metric.value,
      rating: getLCPRating(metric.value),
    });
  });

  // FID (First Input Delay) - 首次输入延迟
  getFID('FID', (metric) => {
    console.log('FID:', metric.value);
    sendToAnalytics({
      metricName: 'FID',
      value: metric.value,
      rating: getFIDRating(metric.value),
    });
  });

  // CLS (Cumulative Layout Shift) - 累积布局偏移
  getCLS('CLS', (metric) => {
    console.log('CLS:', metric.value);
    sendToAnalytics({
      metricName: 'CLS',
      value: metric.value,
      rating: getCLSRating(metric.value),
    });
  });

  // FCP (First Contentful Paint) - 首次内容绘制
  getFCP('FCP', (metric) => {
    console.log('FCP:', metric.value);
    sendToAnalytics({
      metricName: 'FCP',
      value: metric.value,
    rating: getFCPRating(metric.value),
    });
  });

  // TTFB (Time to First Byte) - 首字节时间
  getTTFB('TTFB', (metric) => {
    console.log('TTFB:', metric.value);
    sendToAnalytics({
      metricName: 'TTFB',
      value: metric.value,
      rating: getTTFBRating(metric.value),
    });
  });
}

// 评分函数
function getLCPRating(value: number): string {
  if (value <= 2.5) return 'Good';
  if (value <= 4.0) return 'Needs Improvement';
  return 'Poor';
}
```

---

## 性能优化清单

### 前端性能

- [ ] 代码分割和懒加载
- [ ] 使用 useMemo 和 useCallback 优化计算
- [ ] 大列表使用虚拟滚动
- [ ] 图片懒加载和响应式图片
- [ ] 字体子集化和异步加载
- [ ] API 请求缓存和防抖
- [ ] 使用 Service Worker 离线缓存
- [ ] 减少 DOM 操作
- [ ] 使用 CSS 变换代替动画
- [ ] 减少 HTTP 请求数量

### 后端性能

- [ ] 数据库查询优化（只查询需要的字段）
- [ ] 添加合适的数据库索引
- [ ] 使用连接池
- [ ] 实现多层缓存（Redis、应用缓存）
- [ ] 异步处理耗时任务（消息队列）
- [ ] 使用 CDN 分发静态资源
- [ ] 启用 HTTP 压缩（Gzip, Brotli）
- [ ] 优化数据库连接和查询
- [ ] 实现分页查询
- [ ] 监控数据库慢查询

### 系统性能

- [ ] 实施性能监控（APM）
- [ ] 收集 Web Vitals 指标
- [ ] 设置性能预算和告警
- [ ] 定期进行性能测试
- [ ] 优化关键路径（用户常用功能）
- [ ] 使用 CDN 加速资源加载

---

## 相关资源

- [编码最佳实践](./coding.md)
- [架构最佳实践](../architecture/)
- [安全最佳实践](../security/)
