# 行为型设计模式

行为型设计模式关注对象之间的通信、职责划分和算法的封装。通过使用这些模式，可以更灵活地分配职责、传递消息和遍历对象。

## 模式概述

行为型模式包括：

- **策略模式** (Strategy Pattern)
- **观察者模式** (Observer Pattern)
- **命令模式** (Command Pattern)
- **责任链模式** (Chain of Responsibility Pattern)
- **状态模式** (State Pattern)
- **模板方法模式** (Template Method Pattern)
- **迭代器模式** (Iterator Pattern)
- **中介者模式** (Mediator Pattern)
- **备忘录模式** (Memento Pattern)
- **访问者模式** (Visitor Pattern)
- **解释器模式** (Interpreter Pattern)

---

## 1. 策略模式 (Strategy Pattern)

### 策略模式的适用场景

- 需要在运行时选择不同的算法
- 有多个方式完成同一个任务
- 需要避免大量的条件语句

### 策略模式的TypeScript实现示例

```typescript
// 策略接口
interface PaymentStrategy {
  pay(amount: number): boolean;
}

// 具体策略实现
class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): boolean {
    console.log(`Processing credit card payment: $${amount}`);
    return true;
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number): boolean {
    console.log(`Processing PayPal payment: $${amount}`);
    return true;
  }
}

class BitcoinPayment implements PaymentStrategy {
  pay(amount: number): boolean {
    console.log(`Processing Bitcoin payment: $${amount}`);
    return true;
  }
}

// 上下文
class PaymentContext {
  private strategy: PaymentStrategy;

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  pay(amount: number): boolean {
    return this.strategy.pay(amount);
  }
}

// 使用示例
const context = new PaymentContext();

// 根据用户选择策略
context.setStrategy(new CreditCardPayment());
context.pay(100);

context.setStrategy(new PayPalPayment());
context.pay(50);
```

### 该模式在实际项目中的应用

```typescript
// 排序策略
interface SortStrategy<T> {
  sort(array: T[]): T[];
}

class BubbleSort<T> implements SortStrategy<T> {
  sort(array: T[]): T[] {
    // 冒泡排序实现
    return array.slice().sort((a, b) => (a > b ? 1 : -1));
  }
}

class QuickSort<T> implements SortStrategy<T> {
  sort(array: T[]): T[] {
    // 快速排序实现
    return array.slice().sort((a, b) => (a > b ? 1 : -1));
  }
}

class MergeSort<T> implements SortStrategy<T> {
  sort(array: T[]): T[] {
    // 归并排序实现
    return array.slice().sort((a, b) => (a > b ? 1 : -1));
  }
}

// 根据数据量选择策略
class Sorter<T> {
  private strategy: SortStrategy<T>;

  constructor(array: T[]) {
    if (array.length < 10) {
      this.strategy = new BubbleSort<T>();
    } else if (array.length < 100) {
      this.strategy = new QuickSort<T>();
    } else {
      this.strategy = new MergeSort<T>();
    }
  }

  sort(array: T[]): T[] {
    return this.strategy.sort(array);
  }
}
```

---

## 2. 观察者模式 (Observer Pattern)

### 观察者模式的适用场景

- 一个对象的状态变化需要通知其他对象
- 需要松耦合的通信机制
- 事件驱动系统、UI更新、消息队列

### 观察者模式的TypeScript实现示例

```typescript
// 观察者接口
interface Observer {
  update(data: any): void;
}

// 被观察者
interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(data: any): void;
}

// 具体被观察者
class NewsPublisher implements Subject {
  private observers: Observer[] = [];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: any): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

// 具体观察者
class EmailSubscriber implements Observer {
  update(data: any): void {
    console.log(`Sending email: ${data.title}`);
  }
}

class SMSSubscriber implements Observer {
  update(data: any): void {
    console.log(`Sending SMS: ${data.title}`);
  }
}

class PushNotificationSubscriber implements Observer {
  update(data: any): void {
    console.log(`Sending push notification: ${data.title}`);
  }
}

// 使用示例
const newsPublisher = new NewsPublisher();
newsPublisher.attach(new EmailSubscriber());
newsPublisher.attach(new SMSSubscriber());
newsPublisher.attach(new PushNotificationSubscriber());

// 发布新闻，所有订阅者都会收到通知
newsPublisher.notify({ title: "Breaking News!" });
// 输出:
// Sending email: Breaking News!
// Sending SMS: Breaking News!
// Sending push notification: Breaking News!
```

### 该模式在实际项目中的应用 (重复2)

```typescript
// React 组件状态变化通知
interface ComponentStateObserver {
  onStateChange(state: any): void;
}

class Store {
  private observers: ComponentStateObserver[] = [];
  private state: any = {};

  subscribe(observer: ComponentStateObserver): void {
    this.observers.push(observer);
  }

  setState(newState: any): void {
    this.state = { ...this.state, ...newState };
    this.notifyObservers();
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.onStateChange(this.state);
    }
  }
}

// 组件订阅状态变化
class UserProfileComponent implements ComponentStateObserver {
  constructor(private store: Store) {
    this.store.subscribe(this);
  }

  onStateChange(state: any): void {
    console.log("UserProfile updated with:", state.user);
    // 更新UI
  }
}
```

---

## 3. 命令模式 (Command Pattern)

### 命令模式的适用场景

- 需要将请求封装为对象
- 需要支持撤销/重做操作
- 需要队列或日志记录操作

### 命令模式的TypeScript实现示例

```typescript
// 命令接口
interface Command {
  execute(): void;
  undo(): void;
}

// 接收者
class TextEditor {
  private text: string = "";

  insert(text: string): void {
    this.text += text;
  }

  delete(count: number): void {
    this.text = this.text.slice(0, -count);
  }

  getText(): string {
    return this.text;
  }
}

// 具体命令
class InsertCommand implements Command {
  constructor(
    private editor: TextEditor,
    private text: string,
  ) {}

  execute(): void {
    this.editor.insert(this.text);
  }

  undo(): void {
    this.editor.delete(this.text.length);
  }
}

class DeleteCommand implements Command {
  constructor(
    private editor: TextEditor,
    private count: number,
  ) {}

  execute(): void {
    this.editor.delete(this.count);
  }

  undo(): void {
    this.editor.insert("x".repeat(this.count)); // 简化：假设删除的都是'x'
  }
}

// 调用者
class CommandInvoker {
  private history: Command[] = [];
  private current: number = 0;

  execute(command: Command): void {
    command.execute();
    this.history = this.history.slice(0, this.current);
    this.history.push(command);
    this.current++;
  }

  undo(): void {
    if (this.current > 0) {
      this.current--;
      this.history[this.current].undo();
    }
  }

  redo(): void {
    if (this.current < this.history.length) {
      this.history[this.current].execute();
      this.current++;
    }
  }
}

// 使用示例
const editor = new TextEditor();
const invoker = new CommandInvoker();

// 执行操作
invoker.execute(new InsertCommand(editor, "Hello "));
console.log(editor.getText()); // "Hello "

invoker.execute(new InsertCommand(editor, "World"));
console.log(editor.getText()); // "Hello World"

// 撤销操作
invoker.undo();
console.log(editor.getText()); // "Hello "

// 重做操作
invoker.redo();
console.log(editor.getText()); // "Hello World"
```

### 该模式在实际项目中的应用 (重复3)

```typescript
// RESTful API 命令封装
interface APICommand {
  execute(): Promise<any>;
}

class CreateUserCommand implements APICommand {
  constructor(private userData: any) {}

  async execute(): Promise<any> {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(this.userData),
    });
    return response.json();
  }
}

class DeleteUserCommand implements APICommand {
  constructor(private userId: string) {}

  async execute(): Promise<any> {
    const response = await fetch(`/api/users/${this.userId}`, {
      method: "DELETE",
    });
    return response.json();
  }
}

// 命令队列
class CommandQueue {
  private queue: APICommand[] = [];
  private isProcessing: boolean = false;

  enqueue(command: APICommand): void {
    this.queue.push(command);
    this.process();
  }

  private async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const command = this.queue.shift()!;
      await command.execute();
    }
    this.isProcessing = false;
  }
}
```

---

## 4. 责任链模式 (Chain of Responsibility Pattern)

### 责任链模式的适用场景

- 有多个对象可以处理同一个请求
- 不确定哪个对象应该处理请求
- 需要动态指定处理顺序

### 责任链模式的TypeScript实现示例

```typescript
// 处理者接口
interface Handler {
  setNext(handler: Handler): void;
  handle(request: string): string | null;
}

// 抽象处理者
abstract class AbstractHandler implements Handler {
  private next: Handler | null = null;

  setNext(handler: Handler): void {
    this.next = handler;
  }

  handle(request: string): string | null {
    const result = this.processRequest(request);
    if (result !== null) {
      return result;
    }
    return this.next ? this.next.handle(request) : null;
  }

  protected abstract processRequest(request: string): string | null;
}

// 具体处理者
class ManagerHandler extends AbstractHandler {
  protected processRequest(request: string): string | null {
    if (request === "increase_salary") {
      return "Manager approved the salary increase";
    }
    return null;
  }
}

class DirectorHandler extends AbstractHandler {
  protected processRequest(request: string): string | null {
    if (request === "approve_budget") {
      return "Director approved the budget";
    }
    return null;
  }
}

class CEOHandler extends AbstractHandler {
  protected processRequest(request: string): string | null {
    // CEO 可以处理所有请求
    return "CEO approved: " + request;
  }
}

// 使用示例
const manager = new ManagerHandler();
const director = new DirectorHandler();
const ceo = new CEOHandler();

// 构建责任链
manager.setNext(director);
director.setNext(ceo);

// 发送请求
const requests = ["approve_budget", "increase_salary", "hire_employee"];

for (const request of requests) {
  console.log(`Request: ${request}`);
  const result = manager.handle(request);
  if (result) {
    console.log(`Response: ${result}`);
  } else {
    console.log("Response: No handler found");
  }
}
```

### 该模式在实际项目中的应用 (重复4)

```typescript
// HTTP 请求处理链
interface RequestHandler {
  setNext(handler: RequestHandler): void;
  handle(request: any): any;
}

class AuthHandler implements RequestHandler {
  private next: RequestHandler | null = null;
  private authService: any;

  setNext(handler: RequestHandler): void {
    this.next = handler;
  }

  async handle(request: any): Promise<any> {
    const token = request.headers?.authorization;
    if (!token) {
      return { error: "Unauthorized", status: 401 };
    }

    const isValid = await this.authService.validateToken(token);
    if (!isValid) {
      return { error: "Invalid token", status: 401 };
    }

    return this.next ? await this.next.handle(request) : request;
  }
}

class RateLimitHandler implements RequestHandler {
  private next: RequestHandler | null = null;
  private rateLimiter: any;

  setNext(handler: RequestHandler): void {
    this.next = handler;
  }

  async handle(request: any): Promise<any> {
    const isAllowed = await this.rateLimiter.check(request.ip);
    if (!isAllowed) {
      return { error: "Rate limit exceeded", status: 429 };
    }

    return this.next ? await this.next.handle(request) : request;
  }
}

class RequestProcessor implements RequestHandler {
  private next: RequestHandler | null = null;

  setNext(handler: RequestHandler): void {
    this.next = handler;
  }

  async handle(request: any): Promise<any> {
    // 实际业务逻辑处理
    console.log("Processing request:", request.path);
    return { success: true };
  }
}
```

---

## 5. 状态模式 (State Pattern)

### 状态模式的适用场景

- 对象的行为依赖于它的状态
- 状态会在运行时改变
- 需要避免大量的条件语句

### 状态模式的TypeScript实现示例

```typescript
// 状态接口
interface State {
  insertCoin(): void;
  ejectCoin(): void;
  pressButton(): void;
}

// 具体状态
class NoCoinState implements State {
  constructor(private vendingMachine: VendingMachine) {}

  insertCoin(): void {
    console.log("Coin inserted");
    this.vendingMachine.setState(new HasCoinState(this.vendingMachine));
  }

  ejectCoin(): void {
    console.log("No coin to eject");
  }

  pressButton(): void {
    console.log("Please insert coin first");
  }
}

class HasCoinState implements State {
  constructor(private vendingMachine: VendingMachine) {}

  insertCoin(): void {
    console.log("Already have coin, please eject first");
  }

  ejectCoin(): void {
    console.log("Coin ejected");
    this.vendingMachine.setState(new NoCoinState(this.vendingMachine));
  }

  pressButton(): void {
    console.log("Dispensing item");
    this.vendingMachine.setState(new NoCoinState(this.vendingMachine));
  }
}

// 上下文
class VendingMachine {
  private state: State;

  setState(state: State): void {
    this.state = state;
  }

  getState(): State {
    return this.state;
  }

  insertCoin(): void {
    this.state.insertCoin();
  }

  ejectCoin(): void {
    this.state.ejectCoin();
  }

  pressButton(): void {
    this.state.pressButton();
  }
}

// 使用示例
const machine = new VendingMachine();
console.log("Initial state:", machine.getState().constructor.name);
// NoCoinState

machine.pressButton();
// Output: Please insert coin first

machine.insertCoin();
// Output: Coin inserted
console.log("Current state:", machine.getState().constructor.name);
// HasCoinState

machine.pressButton();
// Output: Dispensing item
console.log("Final state:", machine.getState().constructor.name);
// NoCoinState
```

### 该模式在实际项目中的应用 (重复5)

```typescript
// 订单状态管理
interface OrderState {
  processPayment(): Promise<void>;
  ship(): Promise<void>;
  cancel(): Promise<void>;
  getName(): string;
}

class PendingState implements OrderState {
  constructor(private order: Order) {}

  async processPayment(): Promise<void> {
    await this.order.markAsPaid();
    this.order.setState(new ProcessingState(this.order));
  }

  async ship(): Promise<void> {
    throw new Error("Cannot ship pending order");
  }

  async cancel(): Promise<void> {
    await this.order.markAsCancelled();
  }

  getName(): string {
    return "Pending";
  }
}

class ProcessingState implements OrderState {
  constructor(private order: Order) {}

  async processPayment(): Promise<void> {
    throw new Error("Payment already processed");
  }

  async ship(): Promise<void> {
    await this.order.markAsShipped();
    this.order.setState(new ShippedState(this.order));
  }

  async cancel(): Promise<void> {
    await this.order.markAsCancelled();
  }

  getName(): string {
    return "Processing";
  }
}

class ShippedState implements OrderState {
  constructor(private order: Order) {}

  async processPayment(): Promise<void> {
    throw new Error("Order already shipped");
  }

  async ship(): Promise<void> {
    throw new Error("Order already shipped");
  }

  async cancel(): Promise<void> {
    throw new Error("Cannot cancel shipped order");
  }

  getName(): string {
    return "Shipped";
  }
}
```

---

## 6. 模板方法模式 (Template Method Pattern)

### 模板方法模式的适用场景

- 算法的结构相同，但某些步骤不同
- 需要避免代码重复
- 需要固定算法框架，允许子类自定义部分步骤

### 模板方法模式的TypeScript实现示例

```typescript
// 抽象模板类
abstract class DataExporter {
  // 模板方法
  export(data: any[]): void {
    // 步骤1：验证数据
    this.validate(data);

    // 步骤2：格式化数据
    const formattedData = this.formatData(data);

    // 步骤3：创建文件
    this.createFile(formattedData);

    // 步骤4：上传文件
    this.uploadFile();
  }

  protected abstract validate(data: any[]): void;
  protected abstract formatData(data: any[]): any[];
  protected abstract createFile(formattedData: any[]): void;
  protected abstract uploadFile(): void;
}

// 具体实现
class CSVExporter extends DataExporter {
  protected validate(data: any[]): void {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array");
    }
  }

  protected formatData(data: any[]): any[] {
    return data; // CSV 不需要特殊格式化
  }

  protected createFile(formattedData: any[]): void {
    const csv = formattedData.map((row) => row.join(",")).join("\n");
    console.log("CSV file created");
  }

  protected uploadFile(): void {
    console.log("Uploading CSV file");
  }
}

class JSONExporter extends DataExporter {
  protected validate(data: any[]): void {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array");
    }
  }

  protected formatData(data: any[]): any[] {
    return data; // JSON 不需要特殊格式化
  }

  protected createFile(formattedData: any[]): void {
    const json = JSON.stringify(formattedData, null, 2);
    console.log("JSON file created");
  }

  protected uploadFile(): void {
    console.log("Uploading JSON file");
  }
}

// 使用示例
const data = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];

const csvExporter = new CSVExporter();
csvExporter.export(data);
// 步骤：
// 1. 验证数据
// 2. 格式化数据
// 3. 创建 CSV 文件
// 4. 上传 CSV 文件

const jsonExporter = new JSONExporter();
jsonExporter.export(data);
// 步骤相同，但第3步不同
```

---

## 模式对比总结

| 模式           | 优点                       | 缺点                   | 使用场景           |
| -------------- | -------------------------- | ---------------------- | ------------------ |
| **策略模式**   | 避免大量条件语句，易于扩展 | 增加类的数量           | 运行时选择算法     |
| **观察者模式** | 松耦合，支持一对多通知     | 观察者过多可能影响性能 | 事件驱动、UI更新   |
| **命令模式**   | 封装操作，支持撤销/重做    | 增加类数量             | 操作封装、日志记录 |
| **责任链**     | 灵活处理请求，动态指定顺序 | 请求可能不被处理       | 请求处理、异常处理 |
| **状态模式**   | 避免条件语句，状态转换清晰 | 状态类可能过多         | 状态机、游戏角色   |
| **模板方法**   | 代码复用，固定算法框架     | 部分步骤不能修改       | 算法框架、数据处理 |

---

## 最佳实践

### ✅ 何时使用行为型模式

- 需要管理对象间的通信
- 需要动态选择算法
- 需要封装操作
- 需要状态管理
- 需要避免大量条件语句

### ❌ 何时不用行为型模式

- 行为简单直接
- 不需要动态变化
- 只有一个实现方式
- 性能要求极高（模式可能有额外开销）

### 💡 设计建议

1. **接口保持稳定**：行为模式的接口一旦定义，不应该频繁修改
2. **状态要互斥**：状态模式中，各个状态之间应该是互斥的
3. **避免循环依赖**：观察者模式中要注意循环通知问题
4. **命令要可序列化**：如果需要持久化，命令对象应该可以序列化
5. **责任链要有限**：设置合理的链长度和超时机制

---

## 相关资源

- [创建型设计模式](./creational.md)
- [结构型设计模式](./structural.md)
- [编码最佳实践](../best-practices/coding.md)
