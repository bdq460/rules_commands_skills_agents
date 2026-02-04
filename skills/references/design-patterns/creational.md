# 创建型设计模式

创建型设计模式关注对象的创建过程，将对象的创建和使用分离，使系统能够灵活地决定创建何种对象。

## 模式概述

创建型模式包括：

- **工厂模式** (Factory Pattern)
- **单例模式** (Singleton Pattern)
- **建造者模式** (Builder Pattern)
- **原型模式** (Prototype Pattern)

---

## 1. 工厂模式 (Factory Pattern)

### 工厂模式的适用场景

- 需要根据条件创建不同类型的对象
- 对象的创建逻辑复杂，需要集中管理
- 系统需要动态决定创建哪种对象

### 工厂模式的TypeScript实现示例

```typescript
// 产品接口
interface Product {
  operation(): string;
}

// 具体产品实现
class ConcreteProductA implements Product {
  operation(): string {
    return 'ConcreteProductA result';
  }
}

class ConcreteProductB implements Product {
  operation(): string {
    return 'ConcreteProductB result';
  }
}

// 工厂类
class Factory {
  createProduct(type: string): Product {
    switch(type) {
      case 'A':
        return new ConcreteProductA();
      case 'B':
        return new ConcreteProductB();
      default:
        throw new Error(`Invalid product type: ${type}`);
    }
  }
}

// 使用示例
const factory = new Factory();
const productA = factory.createProduct('A');
console.log(productA.operation()); // "ConcreteProductA result"

const productB = factory.createProduct('B');
console.log(productB.operation()); // "ConcreteProductB result"
```

### 该模式在实际项目中的应用

```typescript
// API工厂 - 根据不同需求创建不同的API客户端
class APIClientFactory {
  createClient(type: 'rest' | 'graphql' | 'grpc'): APIClient {
    switch(type) {
      case 'rest':
        return new RestAPIClient();
      case 'graphql':
        return new GraphQLAPIClient();
      case 'grpc':
        return new GRPCClient();
      default:
        throw new Error(`Unknown API type: ${type}`);
    }
  }
}

// 数据库工厂 - 根据不同数据库创建连接
class DatabaseConnectionFactory {
  createConnection(type: 'mysql' | 'postgresql' | 'mongodb'): DatabaseConnection {
    switch(type) {
      case 'mysql':
        return new MySQLConnection();
      case 'postgresql':
        return new PostgreSQLConnection();
      case 'mongodb':
        return new MongoDBConnection();
      default:
        throw new Error(`Unknown database type: ${type}`);
    }
  }
}
```

---

## 2. 单例模式 (Singleton Pattern)

### 单例模式的适用场景

- 确保类只有一个实例
- 需要全局访问点
- 资源共享（数据库连接、配置管理）

### 单例模式的TypeScript实现示例

```typescript
class Database {
  private static instance: Database;
  private connection: any;

  private constructor() {
    // 私有构造函数，防止外部直接创建实例
    this.connection = this.createConnection();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private createConnection(): any {
    // 创建数据库连接
    return { /*connection object*/ };
  }

  query(sql: string): any[] {
    return this.connection.query(sql);
  }
}

// 使用示例
const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true - 是同一个实例

// 查询数据库
const results = db1.query('SELECT * FROM users');
```

### 惰性单例 vs 饥饿式单例

```typescript
// 惰性单例 - 延迟初始化
class LazySingleton {
  private static instance: LazySingleton;

  private constructor() {}

  static getInstance(): LazySingleton {
    if (!LazySingleton.instance) {
      LazySingleton.instance = new LazySingleton();
    }
    return LazySingleton.instance;
  }
}

// 饥饿式单例 - 启动时初始化
class EagerSingleton {
  private static readonly instance: EagerSingleton = new EagerSingleton();

  private constructor() {}

  static getInstance(): EagerSingleton {
    return EagerSingleton.instance;
  }
}
```

### 该模式在实际项目中的应用 (重复2)

```typescript
// 日志管理器
class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    this.logs.push(`${new Date().toISOString()}: ${message}`);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

// 配置管理器
class ConfigManager {
  private static instance: ConfigManager;
  private config: Map<string, any> = new Map();

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): void {
    // 加载配置文件
    this.config.set('apiKey', '12345');
    this.config.set('timeout', 5000);
  }

  get(key: string): any {
    return this.config.get(key);
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
  }
}
```

---

## 3. 建造者模式 (Builder Pattern)

### 建造者模式的适用场景

- 创建复杂对象，需要分步构建
- 对象的创建过程有多个可选参数
- 需要不同配置的对象

### 建造者模式的TypeScript实现示例

```typescript
// 产品类
class Product {
  constructor(
    public name: string,
    public price: number,
    public description: string = '',
    public features: string[] = [],
    public available: boolean = true
  ) {}
}

// 建造者类
class ProductBuilder {
  private name: string = '';
  private price: number = 0;
  private description: string = '';
  private features: string[] = [];
  private available: boolean = true;

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setPrice(price: number): this {
    this.price = price;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  addFeature(feature: string): this {
    this.features.push(feature);
    return this;
  }

  setAvailable(available: boolean): this {
    this.available = available;
    return this;
  }

  build(): Product {
    return new Product(
      this.name,
      this.price,
      this.description,
      this.features,
      this.available
    );
  }
}

// 使用示例 - 流式接口
const product = new ProductBuilder()
  .setName('Laptop')
  .setPrice(999)
  .setDescription('High-performance laptop')
  .addFeature('16GB RAM')
  .addFeature('512GB SSD')
  .addFeature('Intel i7 Processor')
  .build();

console.log(product);
// Product {
//   name: "Laptop",
//   price: 999,
//   description: "High-performance laptop",
//   features: ["16GB RAM", "512GB SSD", "Intel i7 Processor"],
//   available: true
// }
```

### 复杂对象的构建

```typescript
// API请求构建器
class APIRequestBuilder {
  private url: string = '';
  private method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
  private headers: Record<string, string> = {};
  private body: any = null;
  private timeout: number = 5000;

  setURL(url: string): this {
    this.url = url;
    return this;
  }

  setMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): this {
    this.method = method;
    return this;
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setBody(body: any): this {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  build(): APIRequest {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      body: this.body,
      timeout: this.timeout,
    };
  }
}

// 使用示例
const request = new APIRequestBuilder()
  .setURL('https://api.example.com/users')
  .setMethod('POST')
  .setHeader('Authorization', 'Bearer token')
  .setHeader('Content-Type', 'application/json')
  .setBody({ name: 'John', email: 'john@example.com' })
  .setTimeout(10000)
  .build();

// 发送请求
fetch(request.url, {
  method: request.method,
  headers: request.headers,
  body: JSON.stringify(request.body),
});
```

---

## 4. 原型模式 (Prototype Pattern)

### 原型模式的适用场景

- 通过复制已有对象创建新对象
- 对象的创建成本较高
- 需要大量相似对象

### 原型模式的TypeScript实现示例

```typescript
// 原型接口
interface Prototype {
  clone(): Prototype;
}

// 具体原型
class Document implements Prototype {
  constructor(
    public title: string,
    public content: string,
    public author: string
  ) {}

  clone(): Document {
    // 创建一个新对象，复制当前对象的所有属性
    return new Document(this.title, this.content, this.author);
  }
}

// 原型注册表
class PrototypeRegistry {
  private static prototypes: Map<string, Prototype> = new Map();

  static register(key: string, prototype: Prototype): void {
    this.prototypes.set(key, prototype);
  }

  static get(key: string): Prototype {
    const prototype = this.prototypes.get(key);
    if (!prototype) {
      throw new Error(`Prototype not found: ${key}`);
    }
    return prototype.clone();
  }
}

// 注册原型
PrototypeRegistry.register('report', new Document('Report', 'Template content', 'System'));
PrototypeRegistry.register('contract', new Document('Contract', 'Legal terms', 'Legal'));

// 使用原型创建新文档
const report1 = PrototypeRegistry.get('report');
report1.title = 'Q1 Financial Report';
report1.content = 'Financial data for Q1 2024';

const report2 = PrototypeRegistry.get('report');
report2.title = 'Q2 Financial Report';
report2.content = 'Financial data for Q2 2024';

console.log(report1 !== report2); // true - 是不同的对象
```

### 该模式在实际项目中的应用 (重复3)

```typescript
// 产品模板
class ProductTemplate implements Prototype {
  constructor(
    public category: string,
    public basePrice: number,
    public defaultFeatures: string[] = []
  ) {}

  clone(): ProductTemplate {
    return new ProductTemplate(
      this.category,
      this.basePrice,
      [...this.defaultFeatures]
    );
  }
}

// 模板注册
const templates = {
  electronics: new ProductTemplate('Electronics', 100, ['warranty', 'support']),
  clothing: new ProductTemplate('Clothing', 50, ['return policy']),
  books: new ProductTemplate('Books', 30, ['exchange allowed']),
};

// 从模板创建产品
const laptop = templates.electronics.clone();
laptop.basePrice = 999;
laptop.defaultFeatures.push('16GB RAM', '512GB SSD');

const shirt = templates.clothing.clone();
shirt.basePrice = 29;
shirt.defaultFeatures.push('cotton material');
```

---

## 模式对比

| 模式 | 优点 | 缺点 | 使用场景 |
|------|------|--------|---------|
| **工厂模式** | 解耦创建和使用，易于扩展 | 工厂类可能变得复杂 | 根据条件创建不同对象 |
| **单例模式** | 确保只有一个实例，全局访问 | 难以测试，可能隐藏依赖 | 数据库连接、日志管理、配置 |
| **建造者模式** | 分步构建，可选参数，代码清晰 | 产品类可能变得复杂 | 复杂对象、多种配置 |
| **原型模式** | 避免重复初始化，性能好 | 深拷贝可能复杂 | 创建相似对象、模板系统 |

---

## 最佳实践

### ✅ 何时使用创建型模式

- 需要解耦对象的创建和使用
- 需要动态决定创建哪种对象
- 需要避免重复的初始化代码
- 需要创建复杂对象

### ❌ 何时不用创建型模式

- 对象创建简单直接
- 只有一种类型的对象
- 不需要动态创建
- 初始化代码很少

### 💡 设计建议

1. **保持简单**：不要过度使用设计模式，保持代码简洁
2. **明确意图**：使用设计模式时要有明确的目的
3. **文档注释**：在代码中标注使用了哪种设计模式
4. **考虑性能**：原型模式可以提升性能，但要注意深拷贝
5. **测试友好**：单例模式可能影响测试，考虑依赖注入

---

## 相关资源

- [结构型设计模式](./structural.md)
- [行为型设计模式](./behavioral.md)
- [编码最佳实践](../best-practices/coding.md)
