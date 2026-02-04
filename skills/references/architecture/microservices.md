# 微服务架构 (Microservices Architecture)

微服务架构是一种将单一应用程序开发为一套小型服务的方法，每个服务运行在自己的进程中，并通过轻量级机制（通常是 HTTP 资源 API）进行通信。

## 架构概述

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Service   │     │   Service   │     │   Service   │
│     A       │     │     B       │     │     C       │
│             │     │             │     │             │
│  ┌───────┐ │     │  ┌───────┐ │     │  ┌───────┐ │
│  │ API GW │◄────►│  │ API GW │◄────►│  │ API GW │ │
│  └───────┘ │     │  └───────┘ │     │  └───────┘ │
└─────────────┘     └─────────────┘     └─────────────┘
        │                 │                 │
        └────────────────►┴────────────────►┘
                        ▼
              ┌─────────────────────┐
              │   API Gateway      │
              │   (Kong, Nginx)   │
              └──────────┬──────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌────────┐      ┌────────┐      ┌────────┐
   │ Client │      │ Client │      │ Client │
   │   1   │      │   2   │      │   3   │
   └────────┘      └────────┘      └────────┘
```

---

## 核心概念

### 1. 服务拆分原则

#### 业务边界 (Bounded Context)

每个微服务应该：

- 围绕业务能力构建
- 拥有自己的数据存储
- 可以独立开发和部署
- 有清晰的 API 界面

```typescript
// 订单服务 - 只负责订单相关逻辑
class OrderService {
  createOrder(userData: UserData): Promise<Order> {
    // 订单业务逻辑
  }

  getOrderStatus(orderId: string): Promise<OrderStatus> {
    // 订单查询逻辑
  }
}

// 用户服务 - 只负责用户相关逻辑
class UserService {
  registerUser(userData: UserData): Promise<User> {
    // 用户注册逻辑
  }

  getUserProfile(userId: string): Promise<User> {
    // 用户查询逻辑
  }
}

// 库存服务 - 只负责库存管理
class InventoryService {
  updateStock(productId: string, quantity: number): Promise<void> {
    // 库存更新逻辑
  }

  checkStock(productId: string): Promise<number> {
    // 库存查询逻辑
  }
}
```

#### 单一职责 (Single Responsibility)

每个服务应该：

- 只做一件事，并做好
- 避免服务间的紧耦合
- 保持服务的小型化和专注

---

### 2. 服务通信

#### 同步通信：HTTP/REST

```typescript
// 服务 A 调用服务 B
class OrderService {
  constructor(private httpClient: HttpClient) {}

  async createOrder(orderData: OrderData): Promise<Order> {
    // 创建订单

    // 同步调用用户服务获取用户信息
    const user = await this.httpClient.get(`/api/users/${orderData.userId}`);

    // 同步调用库存服务检查库存
    const stock = await this.httpClient.get(`/api/inventory/${orderData.productId}`);

    if (stock.available < orderData.quantity) {
      throw new Error('Insufficient stock');
    }

    return this.createOrderInDB(orderData, user, stock);
  }
}
```

#### 异步通信：消息队列

```typescript
// 服务 A 发布事件
class OrderService {
  constructor(private messageQueue: MessageQueue) {}

  async createOrder(orderData: OrderData): Promise<Order> {
    const order = await this.createOrderInDB(orderData);

    // 异步发布订单创建事件
    await this.messageQueue.publish('order.created', {
      orderId: order.id,
      userId: orderData.userId,
      productId: orderData.productId,
      quantity: orderData.quantity,
    });

    return order;
  }
}

// 服务 B 订阅事件
class NotificationService {
  constructor(private messageQueue: MessageQueue) {}

  async start(): Promise<void> {
    // 订阅订单创建事件
    await this.messageQueue.subscribe('order.created', async (message) => {
      await this.sendOrderNotification(message);
    });
  }

  private async sendOrderNotification(message: any): Promise<void> {
    await this.emailService.send({
      to: message.userId,
      subject: 'Order Confirmation',
      body: `Your order ${message.orderId} has been created`,
    });
  }
}
```

---

### 3. 数据管理策略

#### 每个服务自己的数据库

```typescript
// 订单服务 - PostgreSQL
class OrderRepository {
  constructor(private pgPool: any) {}

  async save(order: Order): Promise<Order> {
    const query = 'INSERT INTO orders ...';
    const result = await this.pgPool.query(query);
    return result.rows[0];
  }
}

// 用户服务 - MongoDB
class UserRepository {
  constructor(private mongoClient: any) {}

  async save(user: User): Promise<User> {
    const collection = this.mongoClient.db('users');
    await collection.insertOne(user);
    return user;
  }
}

// 库存服务 - Redis
class InventoryRepository {
  constructor(private redisClient: any) {}

  async updateStock(productId: string, quantity: number): Promise<void> {
    await this.redisClient.set(`stock:${productId}`, quantity);
  }

  async getStock(productId: string): Promise<number> {
    const stock = await this.redisClient.get(`stock:${productId}`);
    return parseInt(stock) || 0;
  }
}
```

#### 数据一致性模式

**saga 模式（长事务）**：

```typescript
// 订单 saga 编排器
class OrderSaga {
  async executeOrder(orderData: OrderData): Promise<void> {
    // 步骤1：创建订单
    const order = await this.createOrder(orderData);

    try {
      // 步骤2：扣减库存
      await this.deductInventory(orderData.productId, orderData.quantity);

      try {
        // 步骤3：处理支付
        await this.processPayment(orderData.payment);

        try {
          // 步骤4：发货
          await this.shipOrder(order.id);

          // 所有步骤成功，saga 完成
          await this.markOrderAsCompleted(order.id);
        } catch (shippingError) {
          // 发货失败，回退支付
          await this.refundPayment(order.id);
          // 回退库存
          await this.restoreInventory(orderData.productId, orderData.quantity);
          // 取消订单
          await this.cancelOrder(order.id);
        }
      } catch (paymentError) {
        // 支付失败，取消订单
        await this.cancelOrder(order.id);
      }
    } catch (inventoryError) {
      // 库存不足，取消订单
      await this.cancelOrder(order.id);
    }
  }

  private async deductInventory(productId: string, quantity: number): Promise<void> {
    // 扣减库存逻辑
  }

  private async restoreInventory(productId: string, quantity: number): Promise<void> {
    // 恢复库存逻辑
  }

  private async processPayment(payment: PaymentData): Promise<void> {
    // 处理支付逻辑
  }

  private async refundPayment(orderId: string): Promise<void> {
    // 退款逻辑
  }

  private async shipOrder(orderId: string): Promise<void> {
    // 发货逻辑
  }

  private async markOrderAsCompleted(orderId: string): Promise<void> {
    // 标记订单完成
  }

  private async cancelOrder(orderId: string): Promise<void> {
    // 取消订单
  }
}
```

---

### 4. API 网关

#### 统一入口点

```typescript
// API 网关 - Kong/Nginx 配置示例
class APIGateway {
  constructor(
    private jwtMiddleware: JWTMiddleware,
    private rateLimiter: RateLimiter,
    private loadBalancer: LoadBalancer,
    private serviceRegistry: ServiceRegistry
  ) {}

  async handleRequest(request: HttpRequest): Promise<HttpResponse> {
    // 1. 认证
    const user = await this.jwtMiddleware.validate(request);
    if (!user) {
      return { status: 401, body: 'Unauthorized' };
    }

    // 2. 限流
    if (!await this.rateLimiter.check(user.id, request.path)) {
      return { status: 429, body: 'Rate limit exceeded' };
    }

    // 3. 路由
    const service = this.serviceRegistry.getService(request.path);

    // 4. 负载均衡
    const instance = await this.loadBalancer.selectInstance(service);

    // 5. 转发请求
    const response = await this.forwardRequest(instance, request);

    return response;
  }

  private async forwardRequest(
    instance: ServiceInstance,
    request: HttpRequest
  ): Promise<HttpResponse> {
    // 转发到具体的服务实例
    return await fetch(`http://${instance.host}:${instance.port}${request.path}`, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  }
}
```

---

## 微服务示例：电商系统

### 服务架构

```text
电商系统微服务架构
│
├── 订单服务 (Order Service)
│   ├── 端口：8080
│   ├── 数据库：PostgreSQL
│   ├── 职责：订单管理、订单查询
│   └── API：/api/orders/*
│
├── 用户服务 (User Service)
│   ├── 端口：8081
│   ├── 数据库：MongoDB
│   ├── 职责：用户注册、用户管理
│   └── API：/api/users/*
│
├── 产品服务 (Product Service)
│   ├── 端口：8082
│   ├── 数据库：PostgreSQL
│   ├── 职责：产品管理、产品查询
│   └── API：/api/products/*
│
├── 库存服务 (Inventory Service)
│   ├── 端口：8083
│   ├── 数据库：Redis
│   ├── 职责：库存管理、库存查询
│   └── API：/api/inventory/*
│
├── 支付服务 (Payment Service)
│   ├── 端口：8084
│   ├── 数据库：PostgreSQL
│   ├── 职责：支付处理、支付查询
│   └── API：/api/payments/*
│
├── 通知服务 (Notification Service)
│   ├── 端口：8085
│   ├── 数据库：MongoDB
│   ├── 职责：邮件发送、短信发送
│   └── API：/api/notifications/*
│
└── 搜索服务 (Search Service)
    ├── 端口：8086
    ├── 数据库：Elasticsearch
    ├── 职责：产品搜索、建议查询
    └── API：/api/search/*
```

### 创建订单流程

```typescript
// 前端应用
class OrderClient {
  async createOrder(orderData: OrderData): Promise<Order> {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }
}

// 订单服务（通过 API Gateway）
class OrderController {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private inventoryService: InventoryService,
    private paymentService: PaymentService
  ) {}

  async createOrder(orderData: OrderData): Promise<Order> {
    // 1. 验证用户
    const user = await this.userService.getUser(orderData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 2. 检查库存
    const stock = await this.inventoryService.getStock(orderData.productId);
    if (stock < orderData.quantity) {
      throw new Error('Insufficient stock');
    }

    // 3. 创建订单
    const order = await this.orderService.createOrder({
      ...orderData,
      user,
      productStock: stock,
    });

    // 4. 异步扣减库存（通过消息队列）
    await this.inventoryService.reserveStock(order.id, orderData.productId, orderData.quantity);

    // 5. 返回订单
    return order;
  }
}
```

---

## 微服务的优势

### ✅ 优点

1. **独立开发和部署**
   - 每个服务可以独立开发
   - 不同的团队可以并行工作
   - 独立部署，更新某个服务不影响其他服务

2. **技术栈灵活性**
   - 不同服务可以使用不同技术
   - 选择最适合的技术栈
   - 渐进式迁移和升级

3. **可扩展性**
   - 根据负载独立扩展
   - 水平扩展更简单
   - 资源利用率更高

4. **故障隔离**
   - 一个服务故障不影响其他服务
   - 提高系统整体可用性
   - 故障恢复更快

5. **代码组织和可维护性**
   - 代码更小，更容易理解
   - 职责清晰
   - 新人更容易上手

### ❌ 缺点

1. **分布式系统复杂性**
   - 需要服务发现机制
   - 需要分布式追踪
   - 需要配置管理
   - 需要监控和日志聚合

2. **数据一致性挑战**
   - 跨服务事务复杂
   - 需要最终一致性
   - 需要 Saga 或事件溯源

3. **网络开销**
   - 服务间通信增加延迟
   - 需要处理网络故障
   - 需要实现重试和超时

4. **运维复杂性**
   - 部署和管理更多服务
   - 需要容器化和编排
   - 基础设施成本增加

---

## 最佳实践

### ✅ 何时使用微服务架构

- 大型、复杂的应用
- 多个团队并行开发
- 需要技术栈多样性
- 需要独立扩展
- 需要高可用性

### ❌ 何时不用微服务架构

- 小型、简单的应用
- 单一团队开发
- 技术栈统一
- 快速原型开发
- 资源有限

### 💡 实施建议

1. **从单体应用开始**
   - 先构建功能完整的单体应用
   - 识别清晰的服务边界
   - 理解业务需求

2. **渐进式拆分**
   - 识别可以独立拆分的模块
   - 逐个拆分并验证
   - 保持单体和微服务共存

3. **优先基础设施**
   - 建立服务发现机制
   - 实现分布式追踪
   - 配置监控和日志聚合
   - 建立消息队列

4. **明确服务边界**
   - 围绕业务能力拆分
   - 确保服务的高内聚低耦合
   - 定义清晰的 API 契约

5. **处理数据一致性**
   - 设计 Saga 模式处理跨服务事务
   - 使用事件溯源实现最终一致性
   - 实现幂等性处理重试

---

## 相关资源

- [六边形架构](./hexagonal-architecture.md)
- [事件驱动架构](./event-driven.md)
- [设计模式](../design-patterns/)
- [编码最佳实践](../best-practices/coding.md)
