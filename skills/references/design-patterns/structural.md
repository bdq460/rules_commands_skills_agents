# 结构型设计模式

结构型设计模式关注类和对象的组合，形成更大的结构。通过使用继承和组合，使系统能够灵活地组织类和对象。

## 模式概述

结构型模式包括：

- **适配器模式** (Adapter Pattern)
- **桥接模式** (Bridge Pattern)
- **组合模式** (Composite Pattern)
- **装饰器模式** (Decorator Pattern)
- **外观模式** (Facade Pattern)
- **享元模式** (Flyweight Pattern)
- **代理模式** (Proxy Pattern)

---

## 1. 适配器模式 (Adapter Pattern)

### 适用场景

- 需要让不兼容的接口一起工作
- 需要复用现有类，但接口不匹配
- 第三方库的接口与系统不兼容

### TypeScript 示例

```typescript
// 现有系统接口
interface ILogger {
  log(message: string): void;
}

// 第三方日志库（接口不兼容）
class ThirdPartyLogger {
  writeLog(text: string, level: number): void {
    console.log(`[${level}] ${text}`);
  }
}

// 适配器
class LoggerAdapter implements ILogger {
  private logger: ThirdPartyLogger;

  constructor(logger: ThirdPartyLogger) {
    this.logger = logger;
  }

  log(message: string): void {
    // 转换接口方法
    this.logger.writeLog(message, 1);
  }
}

// 使用示例
const thirdPartyLogger = new ThirdPartyLogger();
const logger = new LoggerAdapter(thirdPartyLogger);
logger.log('Application started');
```

### API 适配器

```typescript
// 系统期望的接口
interface PaymentGateway {
  processPayment(amount: number): Promise<boolean>;
}

// 第三方支付服务A
class StripePayment {
  charge(amount: number): Promise<{ success: boolean }> {
    // Stripe API调用
    return Promise.resolve({ success: true });
  }
}

// 第三方支付服务B
class PayPalPayment {
  pay(amount: number): Promise<{ status: 'OK' | 'FAIL' }> {
    // PayPal API调用
    return Promise.resolve({ status: 'OK' });
  }
}

// 适配器实现
class StripeAdapter implements PaymentGateway {
  private stripe: StripePayment;

  constructor(stripe: StripePayment) {
    this.stripe = stripe;
  }

  async processPayment(amount: number): Promise<boolean> {
    const result = await this.stripe.charge(amount);
    return result.success;
  }
}

class PayPalAdapter implements PaymentGateway {
  private paypal: PayPalPayment;

  constructor(paypal: PayPalPayment) {
    this.paypal = paypal;
  }

  async processPayment(amount: number): Promise<boolean> {
    const result = await this.paypal.pay(amount);
    return result.status === 'OK';
  }
}

// 使用
let paymentGateway: PaymentGateway;

if (paymentProvider === 'stripe') {
  paymentGateway = new StripeAdapter(new StripePayment());
} else if (paymentProvider === 'paypal') {
  paymentGateway = new PayPalAdapter(new PayPalPayment());
}

const success = await paymentGateway.processPayment(100);
```

---

## 2. 桥接模式 (Bridge Pattern)

### 适用场景 (重复2)

- 需要避免永久绑定抽象和实现
- 抽象和实现都应该能够独立扩展
- 需要在运行时切换实现

### TypeScript 示例 (重复2)

```typescript
// 实现接口
interface IDrawingAPI {
  drawCircle(x: number, y: number, radius: number): void;
  drawRectangle(x: number, y: number, width: number, height: number): void;
}

// 红色实现
class RedDrawingAPI implements IDrawingAPI {
  drawCircle(x: number, y: number, radius: number): void {
    console.log(`Drawing red circle at (${x}, ${y}) with radius ${radius}`);
  }

  drawRectangle(x: number, y: number, width: number, height: number): void {
    console.log(`Drawing red rectangle at (${x}, ${y}) with size ${width}x${height}`);
  }
}

// 蓝色实现
class BlueDrawingAPI implements IDrawingAPI {
  drawCircle(x: number, y: number, radius: number): void {
    console.log(`Drawing blue circle at (${x}, ${y}) with radius ${radius}`);
  }

  drawRectangle(x: number, y: number, width: number, height: number): void {
    console.log(`Drawing blue rectangle at (${x}, ${y}) with size ${width}x${height}`);
  }
}

// 抽象
abstract class Shape {
  protected drawingAPI: IDrawingAPI;

  constructor(drawingAPI: IDrawingAPI) {
    this.drawingAPI = drawingAPI;
  }

  abstract draw(): void;
}

// 具体形状
class Circle extends Shape {
  private x: number;
  private y: number;
  private radius: number;

  constructor(x: number, y: number, radius: number, drawingAPI: IDrawingAPI) {
    super(drawingAPI);
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(): void {
    this.drawingAPI.drawCircle(this.x, this.y, this.radius);
  }
}

class Rectangle extends Shape {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(x: number, y: number, width: number, height: number, drawingAPI: IDrawingAPI) {
    super(drawingAPI);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(): void {
    this.drawingAPI.drawRectangle(this.x, this.y, this.width, this.height);
  }
}

// 使用示例
const redAPI = new RedDrawingAPI();
const blueAPI = new BlueDrawingAPI();

const redCircle = new Circle(10, 10, 5, redAPI);
const blueRectangle = new Rectangle(20, 20, 10, 15, blueAPI);

redCircle.draw();
blueRectangle.draw();

// 运行时切换API
const greenCircle = new Circle(10, 10, 5, redAPI); // 可以换成其他API
```

### 跨平台桥接

```typescript
// 数据库抽象接口
interface IDatabase {
  connect(): Promise<void>;
  query(sql: string): Promise<any[]>;
  disconnect(): Promise<void>;
}

// PostgreSQL 实现
class PostgreSQLDB implements IDatabase {
  async connect(): Promise<void> {
    // PostgreSQL 连接逻辑
    console.log('Connecting to PostgreSQL');
  }

  async query(sql: string): Promise<any[]> {
    // PostgreSQL 查询
    return [];
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from PostgreSQL');
  }
}

// MongoDB 实现
class MongoDB implements IDatabase {
  async connect(): Promise<void> {
    // MongoDB 连接逻辑
    console.log('Connecting to MongoDB');
  }

  async query(sql: string): Promise<any[]> {
    // MongoDB 查询
    return [];
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from MongoDB');
  }
}

// 业务逻辑（不关心具体数据库）
class UserRepository {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  async getUsers(): Promise<any[]> {
    return await this.database.query('SELECT * FROM users');
  }
}

// 使用 - 可以轻松切换数据库
const pgDB = new PostgreSQLDB();
const mongoDB = new MongoDB();

const userRepo = new UserRepository(pgDB); // 或 mongoDB
await userRepo.getUsers();
```

---

## 3. 组合模式 (Composite Pattern)

### 适用场景 (重复3)

- 需要表示部分-整体层次结构
- 需要统一处理单个对象和对象组合
- 树形结构：文件系统、目录树、组织架构

### TypeScript 示例 (重复3)

```typescript
// 组件接口
interface FileSystemComponent {
  getName(): string;
  getSize(): number;
  print(indent: number): void;
}

// 文件（叶子节点）
class File implements FileSystemComponent {
  constructor(
    private name: string,
    private size: number
  ) {}

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  print(indent: number): void {
    console.log('  '.repeat(indent) + `📄 ${this.name} (${this.size} bytes)`);
  }
}

// 目录（组合节点）
class Directory implements FileSystemComponent {
  private name: string;
  private children: FileSystemComponent[] = [];

  constructor(name: string) {
    this.name = name;
  }

  add(component: FileSystemComponent): void {
    this.children.push(component);
  }

  remove(component: FileSystemComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    let total = 0;
    for (const child of this.children) {
      total += child.getSize();
    }
    return total;
  }

  print(indent: number): void {
    console.log('  '.repeat(indent) + `📁 ${this.name}/`);
    for (const child of this.children) {
      child.print(indent + 2);
    }
  }
}

// 使用示例
const file1 = new File('index.html', 1024);
const file2 = new File('style.css', 512);
const file3 = new File('app.js', 2048);

const cssDir = new Directory('css');
cssDir.add(file2);

const jsDir = new Directory('js');
jsDir.add(file3);

const rootDir = new Directory('root');
rootDir.add(file1);
rootDir.add(cssDir);
rootDir.add(jsDir);

// 统一处理单个文件和目录
rootDir.print(0);
// 📁 root/
//   📁 css/
//     📄 style.css (512 bytes)
//   📁 js/
//     📄 app.js (2048 bytes)
//   📄 index.html (1024 bytes)
```

### UI 组件树

```typescript
// UI组件接口
interface UIComponent {
  render(): string;
  add(component: UIComponent): void;
  remove(component: UIComponent): void;
}

// 基础组件
class Button implements UIComponent {
  constructor(private text: string) {}

  render(): string {
    return `<button>${this.text}</button>`;
  }

  add(component: UIComponent): void {
    throw new Error('Cannot add child to Button');
  }

  remove(component: UIComponent): void {
    throw new Error('Cannot remove child from Button');
  }
}

// 容器组件
class Panel implements UIComponent {
  private children: UIComponent[] = [];

  add(component: UIComponent): void {
    this.children.push(component);
  }

  remove(component: UIComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  render(): string {
    const childrenHTML = this.children
      .map(child => child.render())
      .join('\n  ');
    return `<div class="panel">\n  ${childrenHTML}\n</div>`;
  }
}

// 使用示例
const button1 = new Button('Submit');
const button2 = new Button('Cancel');

const panel = new Panel();
panel.add(button1);
panel.add(button2);

console.log(panel.render());
// <div class="panel">
//   <button>Submit</button>
//   <button>Cancel</button>
// </div>
```

---

## 4. 装饰器模式 (Decorator Pattern)

### 适用场景 (重复4)

- 需要在运行时动态地添加职责
- 需要避免类爆炸（通过继承实现所有组合）
- 需要保持接口稳定

### TypeScript 示例 (重复4)

```typescript
// 咖啡接口
interface Coffee {
  cost(): number;
  description(): string;
}

// 基础咖啡
class SimpleCoffee implements Coffee {
  constructor(private cost: number, private description: string) {}

  cost(): number {
    return this.cost;
  }

  description(): string {
    return this.description;
  }
}

// 装饰器基类
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost();
  }

  description(): string {
    return this.coffee.description();
  }
}

// 牛奶装饰器
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return super.cost() + 0.5;
  }

  description(): string {
    return super.description() + ', Milk';
  }
}

// 摩卡装饰器
class MochaDecorator extends CoffeeDecorator {
  cost(): number {
    return super.cost() + 1.0;
  }

  description(): string {
    return super.description() + ', Mocha';
  }
}

// 奶泡装饰器
class WhippedCreamDecorator extends CoffeeDecorator {
  cost(): number {
    return super.cost() + 0.75;
  }

  description(): string {
    return super.description() + ', Whipped Cream';
  }
}

// 使用示例
let coffee: Coffee = new SimpleCoffee(2.0, 'Simple House Blend');
console.log(`$${coffee.cost()} - ${coffee.description()}`);
// $2.0 - Simple House Blend

coffee = new MilkDecorator(coffee);
console.log(`$${coffee.cost()} - ${coffee.description()}`);
// $2.5 - Simple House Blend, Milk

coffee = new MochaDecorator(coffee);
console.log(`$${coffee.cost()} - ${coffee.description()}`);
// $3.5 - Simple House Blend, Milk, Mocha

coffee = new WhippedCreamDecorator(coffee);
console.log(`$${coffee.cost()} - ${coffee.description()}`);
// $4.25 - Simple House Blend, Milk, Mocha, Whipped Cream
```

### HTTP 请求装饰器

```typescript
// 基础请求处理器
interface RequestHandler {
  handle(request: any): any;
}

// 基础实现
class BaseRequestHandler implements RequestHandler {
  handle(request: any): any {
    console.log('Processing base request');
    return { success: true, data: request };
  }
}

// 装饰器基类
abstract class RequestDecorator implements RequestHandler {
  constructor(protected handler: RequestHandler) {}

  handle(request: any): any {
    return this.handler.handle(request);
  }
}

// 认证装饰器
class AuthDecorator extends RequestDecorator {
  handle(request: any): any {
    console.log('Checking authentication');
    if (!request.token) {
      return { error: 'Unauthorized' };
    }
    return super.handle(request);
  }
}

// 日志装饰器
class LoggingDecorator extends RequestDecorator {
  handle(request: any): any {
    console.log(`[LOG] ${JSON.stringify(request)}`);
    const result = super.handle(request);
    console.log(`[LOG] Response: ${JSON.stringify(result)}`);
    return result;
  }
}

// 缓存装饰器
class CacheDecorator extends RequestHandler {
  private cache: Map<string, any> = new Map();

  constructor(private handler: RequestHandler) {}

  handle(request: any): any {
    const key = JSON.stringify(request);
    if (this.cache.has(key)) {
      console.log('[CACHE HIT]');
      return this.cache.get(key);
    }
    console.log('[CACHE MISS]');
    const result = this.handler.handle(request);
    this.cache.set(key, result);
    return result;
  }
}

// 使用示例 - 动态组合装饰器
let handler: RequestHandler = new BaseRequestHandler();
handler = new AuthDecorator(handler);
handler = new LoggingDecorator(handler);
handler = new CacheDecorator(handler);

const response = handler.handle({ token: 'abc123', url: '/api/users' });
```

---

## 5. 外观模式 (Facade Pattern)

### 适用场景 (重复5)

- 需要为复杂的子系统提供简单接口
- 需要解耦客户端和子系统
- 需要分层架构

### TypeScript 示例 (重复5)

```typescript
// 复杂子系统
class DatabaseService {
  connect(): void { console.log('Connecting to database'); }
  query(sql: string): any[] { return []; }
  close(): void { console.log('Closing database'); }
}

class CacheService {
  get(key: string): any { console.log(`Getting ${key} from cache`); return null; }
  set(key: string, value: any): void { console.log(`Setting ${key} in cache`); }
}

class LoggerService {
  log(message: string): void { console.log(`[LOG] ${message}`); }
}

class EmailService {
  send(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

// 外观 - 提供简单接口
class UserServiceFacade {
  private db: DatabaseService;
  private cache: CacheService;
  private logger: LoggerService;
  private email: EmailService;

  constructor() {
    this.db = new DatabaseService();
    this.cache = new CacheService();
    this.logger = new LoggerService();
    this.email = new EmailService();
  }

  // 复杂操作简化为单个方法
  async registerUser(userData: any): Promise<void> {
    this.logger.log('Starting user registration');

    // 检查缓存
    const cached = this.cache.get(`user:${userData.email}`);
    if (cached) {
      this.logger.log('User already registered (from cache)');
      return;
    }

    // 数据库操作
    this.db.connect();
    this.db.query(`INSERT INTO users ...`);
    this.db.close();

    // 清除缓存
    this.cache.set(`user:${userData.email}`, userData);

    // 发送欢迎邮件
    this.email.send(userData.email, 'Welcome!', 'Thank you for registering');

    this.logger.log('User registration completed');
  }
}

// 使用示例 - 客户端不需要了解复杂的子系统
const userService = new UserServiceFacade();
await userService.registerUser({
  name: 'John',
  email: 'john@example.com',
  password: 'secret'
});
```

### 文件系统外观

```typescript
// 复杂的文件操作子系统
class FileReader {
  read(path: string): string {
    console.log(`Reading file: ${path}`);
    return 'file content';
  }
}

class FileParser {
  parse(content: string): any {
    console.log('Parsing file content');
    return { data: 'parsed' };
  }
}

class FileValidator {
  validate(content: string): boolean {
    console.log('Validating file content');
    return true;
  }
}

// 外观 - 简化文件处理
class FileProcessorFacade {
  private reader: FileReader;
  private parser: FileParser;
  private validator: FileValidator;

  constructor() {
    this.reader = new FileReader();
    this.parser = new FileParser();
    this.validator = new FileValidator();
  }

  processFile(path: string): any {
    // 对客户端隐藏复杂性
    const content = this.reader.read(path);
    if (!this.validator.validate(content)) {
      throw new Error('Invalid file');
    }
    return this.parser.parse(content);
  }
}

// 使用示例
const processor = new FileProcessorFacade();
const data = processor.processFile('/path/to/file.csv');
```

---

## 6. 享元模式 (Flyweight Pattern)

### 适用场景 (重复6)

- 有大量相似对象
- 对象的大部分状态可以外部化
- 需要减少内存使用

### TypeScript 示例 (重复6)

```typescript
// 享元接口
interface TreeType {
  draw(canvas: any, x: number, y: number): void;
}

// 具体享元（共享状态）
class PineTree implements TreeType {
  constructor(private color: string, private texture: string) {}

  draw(canvas: any, x: number, y: number): void {
    console.log(`Drawing pine tree at (${x}, ${y}) - color: ${this.color}, texture: ${this.texture}`);
  }
}

class OakTree implements TreeType {
  constructor(private color: string, private texture: string) {}

  draw(canvas: any, x: number, y: number): void {
    console.log(`Drawing oak tree at (${x}, ${y}) - color: ${this.color}, texture: ${this.texture}`);
  }
}

// 上下文（非共享状态）
class Tree {
  constructor(
    private type: TreeType,
    private x: number,
    private y: number,
    private size: number
  ) {}

  draw(canvas: any): void {
    this.type.draw(canvas, this.x, this.y);
    console.log(`  Size: ${this.size}`);
  }
}

// 享元工厂
class TreeFactory {
  private static flyweights: Map<string, TreeType> = new Map();

  static getTreeType(type: 'pine' | 'oak', color: string, texture: string): TreeType {
    const key = `${type}_${color}_${texture}`;
    
    if (!this.flyweights.has(key)) {
      if (type === 'pine') {
        this.flyweights.set(key, new PineTree(color, texture));
      } else if (type === 'oak') {
        this.flyweights.set(key, new OakTree(color, texture));
      }
    }
    
    return this.flyweights.get(key)!;
  }
}

// 使用示例
const pineType1 = TreeFactory.getTreeType('pine', 'green', 'rough');
const pineType2 = TreeFactory.getTreeType('pine', 'green', 'rough');
const oakType = TreeFactory.getTreeType('oak', 'brown', 'smooth');

const tree1 = new Tree(pineType1, 10, 10, 50);
const tree2 = new Tree(pineType2, 20, 20, 60); // 复用相同的享元
const tree3 = new Tree(oakType, 30, 30, 70);

tree1.draw(null);
tree2.draw(null);
tree3.draw(null);

// pineType1 === pineType2 (true) - 共享同一个对象
console.log(`Flyweights count: ${TreeFactory['flyweights'].size}`); // 1个享元
```

### 文本渲染

```typescript
// 享元 - 共享的字符样式
class TextStyle {
  constructor(
    public fontFamily: string,
    public fontSize: number,
    public color: string
  ) {}
}

// 上下文 - 每个字符的位置和具体样式
class Character {
  constructor(
    private character: string,
    private style: TextStyle,
    private x: number,
    private y: number
  ) {}

  render(): string {
    return `<span style="font-family:${this.style.fontFamily};font-size:${this.style.fontSize}px;color:${this.style.color};position:absolute;left:${this.x}px;top:${this.y}px">${this.character}</span>`;
  }
}

// 享元工厂
class TextStyleFactory {
  private static styles: Map<string, TextStyle> = new Map();

  static getStyle(fontFamily: string, fontSize: number, color: string): TextStyle {
    const key = `${fontFamily}_${fontSize}_${color}`;
    if (!this.styles.has(key)) {
      this.styles.set(key, new TextStyle(fontFamily, fontSize, color));
    }
    return this.styles.get(key)!;
  }
}

// 使用示例 - 大量字符共享少量样式
const style1 = TextStyleFactory.getStyle('Arial', 12, 'red');
const style2 = TextStyleFactory.getStyle('Arial', 12, 'red'); // 复用
const style3 = TextStyleFactory.getStyle('Arial', 14, 'blue');
const style4 = TextStyleFactory.getStyle('Arial', 14, 'blue'); // 复用

const characters = [
  new Character('H', style1, 10, 10),
  new Character('e', style1, 25, 10),
  new Character('l', style1, 40, 10),
  new Character('l', style1, 55, 10),
  new Character('o', style2, 70, 10),
];

// 渲染 HTML
characters.forEach(c => console.log(c.render()));
```

---

## 7. 代理模式 (Proxy Pattern)

### 适用场景 (重复7)

- 需要控制对对象的访问
- 需要延迟初始化
- 需要添加额外功能（缓存、日志、权限检查）

### TypeScript 示例 (重复7)

```typescript
// 真实对象接口
interface IImage {
  display(): void;
}

// 真实图像
class RealImage implements IImage {
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Loading ${this.filename} from disk...`);
    // 模拟加载高开销操作
  }

  display(): void {
    console.log(`Displaying ${this.filename}`);
  }
}

// 代理 - 延迟加载
class ImageProxy implements IImage {
  private realImage: RealImage | null = null;
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  display(): void {
    if (!this.realImage) {
      // 延迟加载
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// 使用示例
console.log('Creating image proxy (no heavy loading yet)');
const image = new ImageProxy('large_image.jpg');
console.log('Image created, now displaying...');
image.display(); // 这里才真正加载图像
```

### 缓存代理

```typescript
// 数据库接口
interface IDatabase {
  query(sql: string): Promise<any[]>;
}

// 真实数据库
class RealDatabase implements IDatabase {
  async query(sql: string): Promise<any[]> {
    console.log(`Executing SQL: ${sql}`);
    // 模拟数据库查询
    await new Promise(resolve => setTimeout(resolve, 100));
    return [{ id: 1, name: 'Data' }];
  }
}

// 缓存代理
class CachedDatabaseProxy implements IDatabase {
  private realDatabase: RealDatabase;
  private cache: Map<string, any[]> = new Map();
  private maxCacheSize: number = 100;

  constructor() {
    this.realDatabase = new RealDatabase();
  }

  async query(sql: string): Promise<any[]> {
    // 检查缓存
    if (this.cache.has(sql)) {
      console.log('[CACHE HIT]');
      return this.cache.get(sql)!;
    }

    console.log('[CACHE MISS] - Querying real database');
    const result = await this.realDatabase.query(sql);

    // 更新缓存
    if (this.cache.size < this.maxCacheSize) {
      this.cache.set(sql, result);
    }

    return result;
  }
}

// 使用示例
const db = new CachedDatabaseProxy();

// 第一次查询 - 缓存未命中
db.query('SELECT * FROM users').then(results => console.log(results));

// 第二次查询 - 缓存命中
db.query('SELECT * FROM users').then(results => console.log(results));
```

### 权限控制代理

```typescript
// 敏感文件操作接口
interface IFileOperation {
  read(path: string): string;
  write(path: string, content: string): void;
}

// 真实文件操作
class FileOperation implements IFileOperation {
  read(path: string): string {
    return `Content of ${path}`;
  }

  write(path: string, content: string): void {
    console.log(`Writing to ${path}`);
  }
}

// 权限代理
class FilePermissionProxy implements IFileOperation {
  private fileOperation: FileOperation;
  private permissions: Map<string, string[]> = new Map();

  constructor() {
    this.fileOperation = new FileOperation();
    // 初始化权限
    this.permissions.set('/sensitive/file.txt', ['admin', 'manager']);
    this.permissions.set('/public/file.txt', ['all']);
  }

  private checkPermission(path: string): boolean {
    const allowed = this.permissions.get(path);
    // 简化：假设当前用户是 'admin'
    return allowed ? allowed.includes('admin') : true;
  }

  read(path: string): string {
    if (!this.checkPermission(path)) {
      throw new Error(`Permission denied for ${path}`);
    }
    return this.fileOperation.read(path);
  }

  write(path: string, content: string): void {
    if (!this.checkPermission(path)) {
      throw new Error(`Permission denied for ${path}`);
    }
    this.fileOperation.write(path, content);
  }
}

// 使用示例
const fileProxy = new FilePermissionProxy();
fileProxy.read('/sensitive/file.txt'); // 成功
fileProxy.write('/sensitive/file.txt', 'new content'); // 成功
fileProxy.read('/restricted/file.txt'); // 抛出权限错误
```

---

## 模式对比

| 模式 | 优点 | 缺点 | 使用场景 |
|------|------|--------|---------|
| **适配器** | 让不兼容接口工作 | 可能增加类数量 | 接口转换、第三方集成 |
| **桥接** | 抽象和实现独立扩展 | 增加系统复杂性 | 跨平台、切换实现 |
| **组合** | 统一处理单个和组合 | 过度设计可能复杂 | 树形结构、UI组件 |
| **装饰器** | 动态添加职责，避免继承 | 装饰器顺序影响结果 | 运行时扩展、AOP |
| **外观** | 简化复杂子系统接口 | 外观可能变成上帝类 | 简化API、分层架构 |
| **享元** | 减少内存，共享状态 | 管理复杂性 | 大量相似对象 |
| **代理** | 控制访问，延迟加载 | 响应可能变慢 | 缓存、权限、远程代理 |

---

## 最佳实践

### ✅ 何时使用结构型模式

- 需要组织类和对象结构
- 需要解耦接口和实现
- 需要动态组合对象
- 需要控制访问

### ❌ 何时不用结构型模式

- 系统结构简单
- 不需要动态组合
- 不需要接口转换
- 没有性能问题

### 💡 设计建议

1. **优先组合而非继承**：组合模式比继承更灵活
2. **保持接口稳定**：适配器、桥接、代理都需要稳定的接口
3. **注意装饰器顺序**：装饰器的顺序会影响最终结果
4. **谨慎使用享元**：外部化状态时要考虑线程安全
5. **外观要适度**：不要把所有功能都放在一个外观里
6. **代理要透明**：客户端不应该知道自己使用的是代理

---

## 相关资源

- [创建型设计模式](./creational.md)
- [行为型设计模式](./behavioral.md)
- [编码最佳实践](../best-practices/coding.md)
- [架构参考](../architecture/)
