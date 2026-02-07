# 多 Agent 调度框架技术方案

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 编写日期 | 2024-02-05 |
| 编写人 | AI Assistant |
| 状态 | 草案 |

---

## 1. 项目背景与目标

### 1.1 背景

随着 AI 技术的发展，单一 Agent 难以满足复杂业务流程的需求。在实际产品开发中，需要多个专业 Agent 协作完成从需求分析到交付的全流程。当前面临的主要挑战：

- **任务协调复杂**：多个 Agent 之间的依赖关系难以管理
- **资源利用不均**：LLM 调用缺乏有效的并发控制
- **执行效率低下**：可并行任务未能充分利用并行能力
- **故障恢复困难**：缺乏统一的状态管理和错误恢复机制

### 1.2 目标

构建一个多 Agent 调度框架，实现：

1. **智能任务分解**：基于工作流自动拆解复杂任务
2. **并行执行优化**：自动识别并最大化可并行任务的执行效率
3. **LLM 资源管控**：多 Provider 并发控制与智能路由
4. **高可用保障**：完善的状态管理、错误处理和恢复机制
5. **全流程可观测**：完整的监控、追踪和日志系统

### 1.3 适用范围

- 基于 skills 工作流的产品开发流程
- 需要多 Agent 协作的复杂任务场景
- 对执行效率和资源利用率有要求的场景

---

## 2. 需求分析

### 2.1 功能需求

#### 2.1.1 任务管理

| 需求编号 | 需求描述 | 优先级 | 验收标准 |
|---------|---------|--------|---------|
| F-001 | 支持工作流定义和解析 | 高 | 可配置 JSON/YAML 格式的工作流 |
| F-002 | 自动任务分解 | 高 | 根据工作流自动生成任务 DAG |
| F-003 | 依赖关系管理 | 高 | 支持任务间的依赖定义和检查 |
| F-004 | 并行任务识别 | 高 | 自动识别无依赖的任务并并行执行 |
| F-005 | 任务超时控制 | 中 | 支持任务级别的超时设置和处理 |

#### 2.1.2 Agent 管理

| 需求编号 | 需求描述 | 优先级 | 验收标准 |
|---------|---------|--------|---------|
| F-006 | Agent 动态注册 | 高 | 支持运行时注册和注销 Agent |
| F-007 | Agent 生命周期管理 | 高 | 支持初始化、执行、销毁等状态 |
| F-008 | Agent 健康检查 | 中 | 定期检测 Agent 健康状态 |
| F-009 | Agent 版本管理 | 低 | 支持多版本 Agent 共存 |

#### 2.1.3 并发控制

| 需求编号 | 需求描述 | 优先级 | 验收标准 |
|---------|---------|--------|---------|
| F-010 | 全局并发限制 | 高 | 支持配置全局最大并发数 |
| F-011 | Provider 级别限流 | 高 | 每个 LLM Provider 独立限流 |
| F-012 | 自适应限流 | 中 | 根据 Provider 负载动态调整 |
| F-013 | 请求队列管理 | 中 | 支持优先级队列和超时处理 |

#### 2.1.4 LLM 路由

| 需求编号 | 需求描述 | 优先级 | 验收标准 |
|---------|---------|--------|---------|
| F-014 | 多 Provider 支持 | 高 | 支持 OpenAI、GLM、Claude 等 |
| F-015 | 路由策略配置 | 高 | 支持成本/延迟/质量等策略 |
| F-016 | 健康检查与故障转移 | 高 | 自动检测 Provider 健康并切换 |
| F-017 | 负载均衡 | 中 | 支持轮询、加权随机等算法 |

#### 2.1.5 状态管理

| 需求编号 | 需求描述 | 优先级 | 验收标准 |
|---------|---------|--------|---------|
| F-018 | 状态持久化 | 高 | 支持任务状态持久化存储 |
| F-019 | 检查点机制 | 高 | 支持定时和手动创建检查点 |
| F-020 | 断点续执行 | 高 | 支持从检查点恢复执行 |
| F-021 | 上下文传递 | 高 | 支持任务间上下文传递 |

#### 2.1.6 错误处理

| 需求编号 | 需求描述 | 优先级 | 验收标准 |
|---------|---------|--------|---------|
| F-022 | 错误分类与处理 | 高 | 支持临时/业务/系统错误分类 |
| F-023 | 自动重试机制 | 高 | 支持配置重试次数和策略 |
| F-024 | 降级执行 | 中 | 支持失败时降级执行 |
| F-025 | 人工介入 | 中 | 支持人工审核和干预 |

### 2.2 非功能需求

#### 2.2.1 性能需求

| 需求编号 | 需求描述 | 目标值 |
|---------|---------|--------|
| NF-001 | 任务调度延迟 | < 100ms |
| NF-002 | 并行任务识别时间 | < 50ms |
| NF-003 | 状态保存时间 | < 200ms |
| NF-004 | 系统吞吐量 | > 100 任务/分钟 |

#### 2.2.2 可靠性需求

| 需求编号 | 需求描述 | 目标值 |
|---------|---------|--------|
| NF-005 | 系统可用性 | > 99.9% |
| NF-006 | 任务成功率 | > 95% |
| NF-007 | 数据持久化可靠性 | > 99.99% |

#### 2.2.3 扩展性需求

| 需求编号 | 需求描述 | 目标值 |
|---------|---------|--------|
| NF-008 | 支持 Agent 数量 | > 50 |
| NF-009 | 支持并发任务数 | > 100 |
| NF-010 | 支持工作流复杂度 | > 100 个任务 |

---

## 3. 技术架构

### 3.1 整体架构

系统采用分层架构设计，分为用户层、调度层、控制层、Agent 层和资源层。

```text
┌─────────────────────────────────────────────────────────────┐
│                           用户层                             │
│                    ┌─────────────┐                          │
│                    │   用户请求   │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         调度层                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ TaskPlanner │ │  Scheduler  │ │StateManager │           │
│  │   任务规划   │ │   任务调度   │ │   状态管理   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         控制层                               │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ ConcurrencyController│  │     LLMRouter       │          │
│  │     并发控制器       │  │     LLM 路由器       │          │
│  └─────────────────────┘  └─────────────────────┘          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Agent 层                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │Customer │ │Require- │ │ Product │ │   UI    │          │
│  │ Agent   │ │ments    │ │ Agent   │ │ Agent   │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Backend │ │Technical│ │ Tester  │ │  DevOps │          │
│  │ Agent   │ │Architect│ │ Agent   │ │ Agent   │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         资源层                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              │
│  │ OpenAI │ │  GLM   │ │ Claude │ │DeepSeek│              │
│  └────────┘ └────────┘ └────────┘ └────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 核心组件

#### 3.2.1 AgentOrchestrator（中央调度器）

**职责**：

- 接收用户请求，解析意图
- 协调 TaskPlanner 进行任务分解
- 调度 Scheduler 执行任务
- 聚合各 Agent 执行结果
- 处理异常和错误恢复

**核心方法**：

- `execute(workflow: Workflow, input: any)`: 执行工作流
- `registerAgent(agent: BaseAgent)`: 注册 Agent
- `getStatus(executionId: string)`: 获取执行状态
- `cancel(executionId: string)`: 取消执行

#### 3.2.2 TaskPlanner（任务规划器）

**职责**：

- 解析工作流定义
- 分解任务并识别依赖关系
- 构建任务 DAG（有向无环图）
- 优化任务执行顺序

**算法说明**：

1. **拓扑排序**：将任务 DAG 转换为线性执行序列
2. **并行识别**：识别同一层级无依赖的任务
3. **任务分组**：将可并行任务分组，批量调度

**核心方法**：

- `parseWorkflow(workflow: Workflow)`: 解析工作流
- `buildTaskDAG(tasks: Task[])`: 构建任务 DAG
- `identifyParallelTasks(graph: TaskGraph)`: 识别可并行任务
- `optimizeExecutionPlan(graph: TaskGraph)`: 优化执行计划

#### 3.2.3 Scheduler（调度器）

**职责**：

- 按执行计划调度任务
- 管理任务执行顺序
- 处理任务超时和重试
- 收集和聚合执行结果

**调度策略**：

1. **串行执行**：依赖任务按顺序执行
2. **并行执行**：无依赖任务并行执行
3. **混合执行**：串行和并行结合

**核心方法**：

- `schedule(taskGroup: TaskGroup)`: 调度任务组
- `executeTask(task: Task)`: 执行单个任务
- `cancelTask(taskId: string)`: 取消任务

#### 3.2.4 ConcurrencyController（并发控制器）

**职责**：

- 控制全局并发数
- 管理每个 Provider 的并发限制
- 实现请求队列和优先级管理
- 提供自适应限流能力

**限流算法**：

1. **令牌桶算法**：平滑限流，允许突发流量
2. **漏桶算法**：严格限流，平滑输出
3. **滑动窗口**：精确统计，防止突发

**核心方法**：

- `acquire(provider: string, timeout?)`: 获取执行许可
- `release(provider: string)`: 释放执行许可
- `getStatus()`: 获取当前状态

#### 3.2.5 LLMRouter（LLM 路由器）

**职责**：

- 管理多个 LLM Provider
- 根据策略选择最优 Provider
- 监控 Provider 健康状态
- 实现故障自动转移

**路由策略**：

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| 成本优先 | 选择成本最低的 Provider | 预算敏感场景 |
| 延迟优先 | 选择响应最快的 Provider | 实时性要求高 |
| 质量优先 | 选择效果最好的 Provider | 质量敏感场景 |
| 轮询 | 按顺序轮询各 Provider | 负载均衡 |
| 加权随机 | 按权重随机选择 | 综合平衡 |
| 故障转移 | 主备切换 | 高可用场景 |

**核心方法**：

- `registerProvider(config: ProviderConfig)`: 注册 Provider
- `selectProvider(strategy: RoutingStrategy)`: 选择 Provider
- `reportResult(provider: string, success: boolean, latency: number)`: 报告调用结果
- `getProviderStatus()`: 获取 Provider 状态

### 3.3 数据流

```text
用户请求
    │
    ▼
┌─────────────────┐
│ AgentOrchestrator│
│    主调度器      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   TaskPlanner   │────▶│   返回任务DAG   │
│    任务规划器    │     └─────────────────┘
└─────────────────┘
         │
         ▼
┌─────────────────┐
│    Scheduler    │
│     调度器       │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ 任务组A │ │ 任务组B │  ← 并行执行
│(串行)   │ │(并行)   │
└────┬───┘ └────┬───┘
     │          │
     ▼          ▼
┌────────┐ ┌────────┐
│  Agent  │ │  Agent  │
└────┬───┘ └────┬───┘
     │          │
     ▼          ▼
┌────────┐ ┌────────┐
│  LLM   │ │  LLM   │
│Provider│ │Provider│
└────┬───┘ └────┬───┘
     │          │
     └────┬─────┘
          ▼
┌─────────────────┐
│    结果聚合      │
└─────────────────┘
         │
         ▼
    最终结果
```

### 3.4 Agent 内部架构设计

#### 3.4.1 三层任务分解模型

Agent 内部采用分层任务处理架构，实现从粗粒度任务到细粒度执行的逐级分解：

```text
┌─────────────────────────────────────────────────────────────┐
│                    Level 1: Orchestrator                    │
│              工作流级分解（13 个 Phase）                     │
│         例: Frontend Phase → "开发电商前台"                  │
└─────────────────────────┬───────────────────────────────────┘
                          │ 委托
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     Level 2: Agent                          │
│               任务级分解（Feature 粒度）                      │
│    例: FrontendAgent 分析 → 列表/详情/购物车/订单             │
└─────────────────────────┬───────────────────────────────────┘
                          │ 分析后创建
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Level 3: Sub-Task/Tool                     │
│              执行级分解（文件/函数 粒度）                     │
│       例: 商品列表 → API 调用 + 组件 + 样式文件               │
└─────────────────────────────────────────────────────────────┘
```

**分层职责**：

| 层级 | 控制器 | 分解粒度 | 决策依据 |
|------|--------|----------|----------|
| L1 | Orchestrator | Phase 级（13 个阶段） | 产品流程定义 |
| L2 | Agent | Feature/模块 级 | 领域专业知识 |
| L3 | Sub-Agent/Tool | 文件/函数 级 | 具体实现细节 |

#### 3.4.2 Agent 内部组件架构

```text
┌─────────────────────────────────────────────────────────────┐
│                      Agent 内部架构                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  TaskAnalyzer   │  │  SubTaskPlanner │  │  Execution  │ │
│  │   任务分析器     │  │  子任务规划器    │  │ Coordinator│ │
│  │                 │  │                 │  │  执行协调器  │ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘ │
│           │                    │                   │       │
│           └────────────────────┴───────────────────┘       │
│                              │                              │
│                    ┌─────────▼─────────┐                   │
│                    │   MemorySystem    │                   │
│                    │    记忆系统        │                   │
│                    └─────────┬─────────┘                   │
│                              │                              │
│         ┌────────────────────┼────────────────────┐        │
│         │                    │                    │        │
│         ▼                    ▼                    ▼        │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐  │
│  │ Sub-Agent 1 │     │ Sub-Agent 2 │     │   Tools     │  │
│  │(可选)       │     │(可选)       │     │             │  │
│  └─────────────┘     └─────────────┘     └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### 3.4.3 任务分析器（TaskAnalyzer）

**职责**：判断任务是否需要分解，评估任务复杂度

#### 3.4.4 子任务规划器（SubTaskPlanner）

**职责**：将复杂任务分解为可独立执行的子任务

#### 3.4.5 执行协调器（ExecutionCoordinator）

**职责**：调度子任务执行，管理依赖关系

#### 3.4.6 实际应用场景

##### 场景 1: FrontendAgent 开发复杂页面

##### 场景 2: ArchitectAgent 生成多方案对比

##### 场景 3: 递归创建子 Agent

---

## 4. 关键设计

### 4.1 任务模型

#### 4.1.1 任务定义

#### 4.1.2 任务状态

```text
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Pending │────▶│ Running │────▶│Completed│
│ (待调度) │     │ (执行中) │     │ (已完成) │
└─────────┘     └────┬────┘     └─────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
  ┌──────────┐  ┌─────────┐  ┌─────────┐
  │  Timeout │  │  Failed │  │Cancelled│
  │  (超时)  │  │  (失败) │  │ (已取消) │
  └────┬─────┘  └────┬────┘  └─────────┘
       │             │
       │             ▼
       │        ┌──────────┐
       │        │ Retrying │
       │        │ (重试中)  │
       │        └────┬─────┘
       │             │
       └─────────────┘
```

**状态说明**：

| 状态 | 说明 | 转换条件 |
|------|------|---------|
| Pending | 任务已创建，等待调度 | 调度器分配资源后转为 Running |
| Running | 任务正在执行 | 执行成功转为 Completed，失败转为 Failed |
| Completed | 任务执行成功 | 终态 |
| Failed | 任务执行失败 | 可重试则转为 Retrying，否则终态 |
| Retrying | 任务正在重试 | 重试次数未达上限则转为 Running |
| Timeout | 任务执行超时 | 转为 Failed |
| Cancelled | 任务被取消 | 终态 |

### 4.2 并发控制设计

#### 4.2.1 分层限流模型

系统采用两层限流模型：全局限流和 Provider 级别限流。

```text
                    全局限制 (max: 10)
                   ┌─────────────────┐
                   │ Global Counter  │
                   │    7 / 10       │
                   └────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │ OpenAI  │        │  GLM    │        │ Claude  │
   │  2 / 3  │        │  3 / 5  │        │  1 / 3  │
   └────┬────┘        └────┬────┘        └────┬────┘
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │ 队列A   │        │ 队列B   │        │ 队列C   │
   │Task A   │        │Task B   │        │Task C   │
   └─────────┘        └─────────┘        └─────────┘
```

**限流配置**：

#### 4.2.2 令牌桶算法

使用令牌桶算法实现平滑限流，允许突发流量。

### 4.3 LLM 路由设计

#### 4.3.1 Provider 配置

#### 4.3.2 路由策略实现

**成本优先策略**：

**延迟优先策略**：

**加权随机策略**：

### 4.4 状态管理设计

#### 4.4.1 检查点机制

#### 4.4.2 持久化策略

### 4.5 错误处理设计

#### 4.5.1 错误分类

#### 4.5.2 错误处理策略

### 4.3 Agent 内部并发控制

#### 4.3.1 Agent 内部并发场景

**为什么 Agent 内部需要并发调用 LLM？**

| 场景 | 说明 | 示例 |
|------|------|------|
| **批量分析** | 同时分析多个方案选项 | ArchitectAgent 同时生成 3 种架构方案对比 |
| **并行查询** | 多个独立信息检索 | ResearchAgent 同时查询技术文档、GitHub、API 文档 |
| **Map-Reduce** | 大任务拆分为子任务并行处理 | CodeReviewAgent 并行审查多个文件 |
| **投票机制** | 多模型投票提高准确性 | 同一 Prompt 发送给 3 个不同 Provider 投票决策 |
| **A/B 测试** | 对比不同 Prompt 效果 | ProductAgent 测试 2 种 PRD 撰写风格 |

#### 4.3.2 三层并发控制架构

```text
┌─────────────────────────────────────────────────────────────┐
│                      全局并发控制层                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              GlobalConcurrencyController             │   │
│  │                  (系统级总控: 100)                    │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Agent A     │  │  Agent B     │  │  Agent C     │
│  控制器 (20)  │  │  控制器 (30)  │  │  控制器 (15)  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
   ┌───┴───┐         ┌───┴───┐         ┌───┴───┐
   ▼       ▼         ▼       ▼         ▼       ▼
┌────┐  ┌────┐   ┌────┐  ┌────┐   ┌────┐  ┌────┐
│LLM1│  │LLM2│   │LLM1│  │LLM3│   │LLM2│  │LLM4│
└────┘  └────┘   └────┘  └────┘   └────┘  └────┘
```

**控制层级**：

| 层级 | 控制器 | 控制粒度 | 配置示例 |
|------|--------|----------|----------|
| L1 | GlobalConcurrencyController | 系统级 | 全局最多 100 并发 |
| L2 | AgentConcurrencyController | Agent 级 | FrontendAgent 最多 10 并发 |
| L3 | ProviderConcurrencyController | Provider 级 | OpenAI 最多 3 并发 |

#### 4.3.3 动态自适应并发调节

**动态调节策略**：

**动态调节示例场景**：

| 场景 | 触发条件 | 调节动作 | 结果 |
|------|----------|----------|------|
| 高峰期扩容 | QPS 上升，错误率 < 5% | 并发 +5 | 提升吞吐 |
| 故障降级 | OpenAI 错误率 > 20% | 并发减半，切换 Provider | 保障可用性 |
| 节流保护 | P95 延迟 > 10s | 并发降至最低，排队等待 | 防止雪崩 |
| 负载均衡 | Provider A 负载高 | 流量倾斜至 Provider B | 均衡负载 |

#### 4.3.4 Agent 内部并发接口

**使用示例**：

---

## 5. Agentic AI 记忆系统

### 5.1 设计目标

实现 P0/P1/P2 三级 Agentic AI 能力：

| 优先级 | 能力 | 核心功能 | 实现复杂度 |
|--------|------|----------|------------|
| **P0** | 工作记忆 | 工作流状态持久化、断点续传 | 低 |
| **P1** | 短期记忆 | 阶段间上下文传递、对话历史 | 低 |
| **P2** | 工具使用 | 工具注册、调用、结果处理 | 中 |

### 5.2 记忆架构设计

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Agentic Memory System                        │
├───────────────┬─────────────────┬───────────────────────────────┤
│   工作记忆     │    短期记忆      │         工具记忆              │
│  (Working)    │  (Short-term)   │       (Tool Memory)           │
├───────────────┼─────────────────┼───────────────────────────────┤
│ • 执行栈状态   │ • 对话历史      │ • 工具注册表                  │
│ • 中间结果    │ • 上下文窗口    │ • 工具调用记录                │
│ • 临时变量    │ • 会话状态      │ • 工具执行缓存                │
│ • 断点信息    │ • 用户偏好      │ • 工具参数模板                │
└───────┬───────┴────────┬────────┴───────────────┬───────────────┘
        │                │                        │
        └────────────────┴────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Memory Manager    │
              │    统一记忆管理器    │
              └─────────────────────┘
```

### 5.3 P0: 工作记忆（Working Memory）

#### 5.3.1 核心能力

| 能力 | 说明 | 应用场景 |
|------|------|----------|
| **执行栈管理** | 维护当前执行的任务栈 | 任务嵌套、子任务调用 |
| **状态持久化** | 定期保存执行状态到存储 | 系统崩溃后恢复 |
| **断点续传** | 从上次中断点恢复执行 | 长时间任务中断 |
| **中间结果缓存** | 保存各阶段产出 | 避免重复计算 |

#### 5.3.2 数据模型

#### 5.3.3 核心接口

### 5.4 P1: 短期记忆（Short-term Memory）

#### 5.4.1 核心能力

| 能力 | 说明 | 应用场景 |
|------|------|----------|
| **对话历史** | 维护多轮对话上下文 | Agent 与用户交互 |
| **上下文传递** | 前序阶段结果自动注入 | 13 阶段工作流连贯执行 |
| **用户偏好** | 记录用户习惯和偏好 | 个性化输出 |
| **会话状态** | 维护会话级变量 | 跨任务状态共享 |

#### 5.4.2 上下文传递机制

**产品设计工作流示例**：

```text
阶段1 (需求分析) ──▶ 阶段2 (产品设计) ──▶ 阶段3 (UI设计)
     │                    │                   │
     ▼                    ▼                   ▼
需求规格说明书 ─────▶ 自动注入上下文 ─────▶ 自动注入上下文
                              │                   │
                              ▼                   ▼
                        PRD 文档 ───────────▶ 设计约束
```

**上下文注入实现**：

#### 5.4.3 短期记忆存储

### 5.5 P2: 工具使用（Tool Use）

#### 5.5.1 工具系统架构

```text
┌─────────────────────────────────────────────────────────────┐
│                      Agent Tool System                       │
├─────────────────────────────────────────────────────────────┤
│                     ┌─────────────────┐                     │
│                     │   Tool Registry  │                     │
│                     │    工具注册表     │                     │
│                     └────────┬────────┘                     │
│                              │                              │
│        ┌─────────────────────┼─────────────────────┐        │
│        │                     │                     │        │
│        ▼                     ▼                     ▼        │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐ │
│  │  Code Tools │      │  File Tools │      │  Web Tools  │ │
│  │  • execute  │      │  • read     │      │  • search   │ │
│  │  • lint     │      │  • write    │      │  • fetch    │ │
│  │  • test     │      │  • list     │      │  • parse    │ │
│  └─────────────┘      └─────────────┘      └─────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Tool Executor (工具执行器)              │   │
│  │  • 参数验证  • 权限检查  • 沙箱执行  • 结果格式化     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### 5.5.2 工具定义

#### 5.5.3 内置工具集

**代码执行工具**：

**文件操作工具**：

**Web 搜索工具**：

#### 5.5.4 工具执行流程

#### 5.5.5 Agent 工具使用示例

### 5.6 记忆系统接口汇总

### 5.7 Agent 清单与定位

基于 skills 目录的 16 个 skill 定义完整的 Agent 体系，包含 17 个 Agent（13 个主导 Agent + 4 个支持性 Agent）。

#### 5.7.1 核心开发 Agent（9 个）

| Agent | 职责 | 技能 | 工作流阶段 |
|-------|------|------|-----------|
| RequirementsAgent | 需求分析 | 需求分析师 | 阶段 2: 需求分析 |
| ProductAgent | 产品设计 | 产品专家 | 阶段 3: 产品设计 |
| FrontendAgent | 前端开发 | 前端工程师 | 阶段 5: 前端开发 |
| BackendAgent | 后端开发 | 后端工程师 | 阶段 6: 后端开发 |
| ArchitectAgent | 架构设计审查 | 技术架构师 | 阶段 7: 架构审查 |
| DataEngineerAgent | 数据模型设计、数据库优化 | 数据工程师 | 阶段 6 支持者（子 Agent） |
| SecurityAgent | 安全审查 | 安全工程师 | 阶段 10: 安全审查 |
| DocumentationAgent | 文档编写 | 产品文档专家 | 阶段 9: 文档编写 |
| UIAgent | UI/UX 设计 | UI 专家 | 阶段 4: UI 设计 |

#### 5.7.2 质量保证 Agent（3 个）

| Agent | 职责 | 技能 | 工作流阶段 |
|-------|------|------|-----------|
| TesterAgent | 测试用例编写和执行 | 测试工程师 | 阶段 8: 测试验证 |
| TestFrameworkAgent | 测试框架搭建 | 测试框架构建师 | 阶段 11: 测试框架 |
| SystemOptimizerAgent | 性能分析、瓶颈识别、优化方案 | 系统优化师 | 阶段 11 支持者（子 Agent） |

#### 5.7.3 协调支持 Agent（5 个）

| Agent | 职责 | 技能 | 工作流阶段 |
|-------|------|------|-----------|
| CustomerAgent | 用户需求代表 | 客户代表 | 阶段 1: 需求提出 |
| ProjectPlannerAgent | 项目范围定义、时间规划、资源分配 | 项目规划师 | 阶段 1/13 支持者（子 Agent） |
| CoordinatorAgent | 协调虚拟团队、任务排期 | 项目协调员 | 阶段 13: 项目协调 |
| DevOpsAgent | DevOps 配置生成、部署脚本 | DevOps 生成器 | 阶段 12: DevOps 配置 |
| DisasterRecoveryPlannerAgent | 灾备方案、备份策略、恢复流程 | 灾备规划师 | 阶段 12 支持者（子 Agent） |

#### 5.7.4 Agent 映射表

| 序号 | Skill 名称 | Agent 名称 | 工作流阶段 | Agent 类型 |
|------|-----------|-----------|-----------|-----------|
| 1 | customer-representative | CustomerAgent | 阶段 1: 需求提出 | 输入层（主导） |
| 2 | requirements-analyst | RequirementsAgent | 阶段 2: 需求分析 | 核心开发（主导） |
| 3 | product-expert | ProductAgent | 阶段 3: 产品设计 | 核心开发（主导） |
| 4 | ui-expert | UIAgent | 阶段 4: UI 设计 | 核心开发（主导） |
| 5 | frontend-engineer | FrontendAgent | 阶段 5: 前端开发 | 核心开发（主导） |
| 6 | backend-engineer | BackendAgent | 阶段 6: 后端开发 | 核心开发（主导） |
| 7 | technical-architect | ArchitectAgent | 阶段 7: 架构审查 | 核心开发（主导） |
| 8 | tester | TesterAgent | 阶段 8: 测试验证 | 质量保证（主导） |
| 9 | product-documentation-expert | DocumentationAgent | 阶段 9: 文档编写 | 核心开发（主导） |
| 10 | security-engineer | SecurityAgent | 阶段 10: 安全审查 | 质量保证（主导） |
| 11 | test-framework-builder | TestFrameworkAgent | 阶段 11: 测试框架 | 质量保证（主导） |
| 12 | devops-generator | DevOpsAgent | 阶段 12: DevOps 配置 | 协调支持（主导） |
| 13 | project-coordinator | CoordinatorAgent | 阶段 13: 项目协调 | 协调支持（主导） |
| 14 | data-engineer | DataEngineerAgent | 阶段 6 支持者 | 核心开发（子 Agent） |
| 15 | project-planner | ProjectPlannerAgent | 阶段 1/13 支持者 | 协调支持（子 Agent） |
| 16 | disaster-recovery-planner | DisasterRecoveryPlannerAgent | 阶段 12 支持者 | 协调支持（子 Agent） |
| 17 | system-optimizer | SystemOptimizerAgent | 阶段 11 支持者 | 质量保证（子 Agent） |

#### 5.7.5 支持性 Agent 使用场景

**DataEngineerAgent - 数据工程师**

调用时机：

- 在 BackendAgent 执行过程中，当涉及数据库设计、数据模型优化时
- 在 ProductAgent 设计阶段，当需要评估数据复杂度时

核心能力：

**ProjectPlannerAgent - 项目规划师**

调用时机：

- 在 CustomerAgent 提出需求后，进行初步的项目范围评估
- 在 CoordinatorAgent 协调时，提供详细的时间线和资源分配建议

核心能力：

**DisasterRecoveryPlannerAgent - 灾备规划师**

调用时机：

- 在 DevOpsAgent 生成部署配置时，同步生成灾备方案
- 在 ArchitectAgent 审查架构时，评估架构的灾备能力

核心能力：

**SystemOptimizerAgent - 系统优化师**

调用时机：

- 在 TestFrameworkAgent 搭建完成后，进行性能基准测试
- 在 TesterAgent 测试发现性能问题时，提供优化建议

核心能力：

#### 5.7.6 Agent 体系架构

```text
┌─────────────────────────────────────────────────────────────┐
│                   17 个 Agent 体系                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           13 个主导 Agent（工作流阶段）             │   │
│  │                                                     │   │
│  │  阶段1: CustomerAgent          (输入层)            │   │
│  │  阶段2: RequirementsAgent      (核心开发)           │   │
│  │  阶段3: ProductAgent           (核心开发)           │   │
│  │  阶段4: UIAgent                (核心开发)           │   │
│  │  阶段5: FrontendAgent         (核心开发)           │   │
│  │  阶段6: BackendAgent          (核心开发) ─┐        │   │
│  │  阶段7: ArchitectAgent        (核心开发)   │        │   │
│  │  阶段8: TesterAgent            (质量保证)   │        │   │
│  │  阶段9: DocumentationAgent    (核心开发)   │        │   │
│  │  阶段10: SecurityAgent        (质量保证)   │        │   │
│  │  阶段11: TestFrameworkAgent   (质量保证) ─┤        │   │
│  │  阶段12: DevOpsAgent          (协调支持) ──┤        │   │
│  │  阶段13: CoordinatorAgent      (协调支持)   │        │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │     │     │                │
│                              ▼     ▼     ▼                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           4 个支持性 Agent（子 Agent）               │   │
│  │                                                     │   │
│  │  DataEngineerAgent              (支持阶段6)          │   │
│  │  ProjectPlannerAgent            (支持阶段1/13)       │   │
│  │  DisasterRecoveryPlannerAgent   (支持阶段12)         │   │
│  │  SystemOptimizerAgent           (支持阶段11)         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.8 主 Agent 决策机制

#### 5.7.1 决策流程模型

主 Agent 根据子 Agent 的执行结果进行智能决策，形成闭环控制：

```text
┌─────────────────────────────────────────────────────────────┐
│                        主 Agent                              │
│                    (决策指挥中心)                             │
└─────────────────────────┬───────────────────────────────────┘
                          │ 1. 下发任务
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        子 Agent                              │
│                     (执行单元)                               │
└─────────────────────────┬───────────────────────────────────┘
                          │ 2. 返回结果
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      决策评估器                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  结果质量    │  │  条件判断    │  │  风险评估    │         │
│  │  评估        │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────┬───────────────────────────────────┘
                          │ 3. 决策
                          ▼
              ┌─────────────────────┐
              │   下一步行动         │
              │  • 继续下一阶段      │
              │  • 重新执行          │
              │  • 切换方案          │
              │  • 人工介入          │
              └─────────────────────┘
```

#### 5.7.2 决策类型定义

#### 5.7.3 决策执行流程

#### 5.7.4 典型决策场景

##### 场景 1: 质量门控 - 代码审查不通过

##### 场景 2: 多方案选择 - 架构设计

##### 场景 3: 条件分支 - 根据复杂度选择路径

##### 场景 4: 错误补偿与回滚

##### 场景 5: 风险升级

#### 5.7.5 决策模式总结

| 模式 | 触发条件 | 决策逻辑 | 适用场景 |
|------|----------|----------|----------|
| **质量门控** | 结果评分低于阈值 | 重试/要求改进 | 代码审查、测试 |
| **多选一** | 多个可行方案 | 评分选择最优 | 架构设计、技术选型 |
| **条件分支** | 特定条件满足 | 走不同分支 | 根据复杂度选流程 |
| **依赖等待** | 依赖项缺失 | 创建依赖任务 | 接口未定义时 |
| **故障恢复** | 执行失败 | 补偿/重试/升级 | 部署失败、异常错误 |
| **人工升级** | 置信度低/特殊情况 | 人工介入 | 无法自动决策时 |

---

## 6. 产品开发工作流

### 6.1 工作流定义

基于 skills 工作流的产品开发流程包含 13 个主导阶段，并在关键阶段调用 4 个支持性 Agent 辅助执行：

| 阶段 | 任务名称 | Agent | 并行性 | 超时 | 输入 | 输出 |
|-----|---------|-------|--------|------|------|------|
| 1 | 需求提出 | CustomerAgent | 否 | 5m | 用户原始需求 | 需求描述文档 |
| 2 | 需求分析 | RequirementsAgent | 否 | 10m | 需求描述文档 | 需求规格说明书 |
| 3 | 产品设计 | ProductAgent | 否 | 15m | 需求规格说明书 | PRD文档 |
| 4 | UI设计 | UIAgent | 否 | 20m | PRD文档 | UI设计稿 |
| 5 | 前端开发 | FrontendAgent | 是 | 60m | UI设计稿 | 前端代码 |
| 6 | 后端开发 | BackendAgent | 是 | 60m | PRD文档 | 后端代码 |
| 7 | 架构审查 | ArchitectAgent | 否 | 30m | 前后端代码 | 架构审查报告 |
| 8 | 测试验证 | TesterAgent | 是 | 40m | 代码 | 测试报告 |
| 9 | 文档编写 | DocumentationAgent | 否 | 30m | 代码+测试报告 | 技术文档 |
| 10 | 安全审查 | SecurityAgent | 是 | 30m | 代码 | 安全审查报告 |
| 11 | 测试框架 | TestFrameworkAgent | 否 | 45m | 代码 | 测试框架 |
| 12 | DevOps配置 | DevOpsAgent | 否 | 30m | 代码 | CI/CD配置 |
| 13 | 项目协调 | CoordinatorAgent | 否 | 20m | 所有产出 | 项目总结报告 |

**支持性 Agent 调用说明：**

| 主导阶段 | 支持性 Agent | 调用场景 | 说明 |
|---------|-------------|---------|------|
| 阶段 1: 需求提出 | ProjectPlannerAgent | 需求初步评估后 | 提供项目范围、时间线估算 |
| 阶段 6: 后端开发 | DataEngineerAgent | 涉及数据库设计时 | 设计数据模型、优化数据库schema |
| 阶段 11: 测试框架 | SystemOptimizerAgent | 测试框架搭建后 | 性能基准测试、优化建议 |
| 阶段 12: DevOps 配置 | DisasterRecoveryPlannerAgent | 生成部署配置时 | 同步生成灾备方案、备份策略 |
| 阶段 13: 项目协调 | ProjectPlannerAgent | 最终总结时 | 资源分配报告、项目时间回顾 |

### 6.2 依赖关系

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                          主导阶段依赖链                                     │
└────────────────────────────────────────────────────────────────────────────┘

阶段1 ──▶ 阶段2 ──▶ 阶段3 ──▶ 阶段4
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
                阶段5(前端)                      阶段6(后端)
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                              阶段7(架构审查)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
                阶段8(测试)    阶段10(安全)    阶段11(测试框架)
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                              阶段9(文档)
                                    │
                                    ▼
                              阶段12(DevOps)
                                    │
                                    ▼
                              阶段13(协调)

┌────────────────────────────────────────────────────────────────────────────┐
│                      支持性 Agent 调用关系（虚线表示）                       │
└────────────────────────────────────────────────────────────────────────────┘

阶段1 ........ ProjectPlannerAgent
                          │
                          ▼
                    (项目范围评估)

阶段6 ........ DataEngineerAgent
                          │
                          ▼
                    (数据库设计优化)

阶段11 ........ SystemOptimizerAgent
                          │
                          ▼
                    (性能优化建议)

阶段12 ........ DisasterRecoveryPlannerAgent
                          │
                          ▼
                    (灾备方案生成)

阶段13 ........ ProjectPlannerAgent
                          │
                          ▼
                    (项目总结报告)

图例:
──▶   主导阶段的依赖关系（必须顺序执行）
..... 支持性 Agent 的调用关系（辅助执行）

                              阶段12(DevOps)
                                    │
                                    ▼
                              阶段13(协调)
```

### 6.3 工作流配置示例

```yaml
# workflow-config.yaml
workflow:
  name: "Product Development Workflow"
  version: "1.0"

phases:
  - id: "phase-1-requirements"
    name: "需求分析"
    agent: "RequirementsAgent"
    timeout: "10m"
    inputs:
      - type: "user_input"
        description: "用户原始需求"
    outputs:
      - name: "requirements_spec"
        type: "document"
        description: "需求规格说明书"

  - id: "phase-2-product-design"
    name: "产品设计"
    agent: "ProductAgent"
    timeout: "15m"
    dependencies: ["phase-1-requirements"]
    context_injection:
      - source: "phase-1-requirements"
        field: "requirements_spec"
        target: "prompt_prefix"
    outputs:
      - name: "prd"
        type: "document"
        description: "产品需求文档"

  - id: "phase-5-frontend"
    name: "前端开发"
    agent: "FrontendAgent"
    timeout: "60m"
    parallel: true
    dependencies: ["phase-4-ui-design"]
    context_injection:
      - source: "phase-4-ui-design"
        field: "ui_design"
        target: "prompt_prefix"
    tools:
      - "read_file"
      - "write_file"
      - "execute_code"
    outputs:
      - name: "frontend_code"
        type: "code"
        description: "前端代码"

  - id: "phase-6-backend"
    name: "后端开发"
    agent: "BackendAgent"
    timeout: "60m"
    parallel: true
    dependencies: ["phase-2-product-design"]
    context_injection:
      - source: "phase-2-product-design"
        field: "prd"
        target: "prompt_prefix"
    tools:
      - "read_file"
      - "write_file"
      - "execute_code"
      - "web_search"
    outputs:
      - name: "backend_code"
        type: "code"
        description: "后端代码"

retry_policy:
  max_attempts: 3
  backoff_strategy: "exponential"
  initial_delay: "5s"
  max_delay: "60s"

concurrency:
  global_max: 10
  agent_limits:
    FrontendAgent: 3
    BackendAgent: 3
    TesterAgent: 5
    # 支持性 Agent 并发限制（子 Agent）
    DataEngineerAgent: 2
    ProjectPlannerAgent: 2
    DisasterRecoveryPlannerAgent: 1
    SystemOptimizerAgent: 2

memory:
  checkpoint_interval: "30s"
  max_history: 20
  enabled_tools:
    - "read_file"
    - "write_file"
    - "execute_code"
    - "web_search"

# 支持性 Agent 调用配置
supporting_agents:
  # ProjectPlannerAgent 调用配置
  project-planner:
    enabled: true
    trigger_on:
      - phase: 1
        condition: "after_completion"
      - phase: 13
        condition: "before_start"
    concurrency_limit: 2
    timeout: "15m"

  # DataEngineerAgent 调用配置
  data-engineer:
    enabled: true
    trigger_on:
      - phase: 6
        condition: "when_keywords_match"
        keywords: ["数据库", "schema", "data model", "数据迁移"]
    concurrency_limit: 2
    timeout: "20m"

  # SystemOptimizerAgent 调用配置
  system-optimizer:
    enabled: true
    trigger_on:
      - phase: 11
        condition: "after_completion"
        min_test_coverage: 0.8
    concurrency_limit: 2
    timeout: "30m"

  # DisasterRecoveryPlannerAgent 调用配置
  disaster-recovery-planner:
    enabled: true
    trigger_on:
      - phase: 12
        condition: "after_completion"
    concurrency_limit: 1
    timeout: "25m"

```

---

## 7. 接口设计

### 7.1 核心接口

#### 7.1.1 Orchestrator API

#### 7.1.2 Agent API

#### 7.1.3 监控 API

### 7.2 SDK 接口

---

## 8. 数据模型

### 8.1 核心实体

#### 8.1.1 Workflow（工作流）

#### 8.1.2 Execution（执行实例）

#### 8.1.3 Task（任务）

### 8.2 数据库设计

#### 8.2.1 表结构

```sql
-- 工作流表
CREATE TABLE workflows (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    definition JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 执行实例表
CREATE TABLE executions (
    id VARCHAR(36) PRIMARY KEY,
    workflow_id VARCHAR(36) NOT NULL,
    status ENUM('pending', 'running', 'paused', 'completed', 'failed', 'cancelled'),
    input JSON,
    output JSON,
    current_phase VARCHAR(50),
    completed_phases JSON,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error JSON,
    metrics JSON,
    checkpoint JSON,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id)
);

-- 任务表
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    execution_id VARCHAR(36) NOT NULL,
    phase_id VARCHAR(50) NOT NULL,
    agent_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'running', 'completed', 'failed', 'retrying', 'cancelled'),
    input JSON,
    output JSON,
    attempt INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error JSON,
    tool_calls JSON,
    FOREIGN KEY (execution_id) REFERENCES executions(id)
);

-- Agent 注册表
CREATE TABLE agents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    capabilities JSON,
    config JSON,
    status ENUM('active', 'inactive', 'error') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 记忆表（工作记忆持久化）
CREATE TABLE working_memories (
    execution_id VARCHAR(36) PRIMARY KEY,
    execution_stack JSON,
    intermediate_results JSON,
    checkpoint JSON,
    variables JSON,
    version INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (execution_id) REFERENCES executions(id)
);

-- LLM 调用日志
CREATE TABLE llm_calls (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36),
    provider VARCHAR(50),
    model VARCHAR(100),
    input_tokens INT,
    output_tokens INT,
    latency_ms INT,
    cost DECIMAL(10, 6),
    success BOOLEAN,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 工具调用日志
CREATE TABLE tool_calls (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36),
    tool_name VARCHAR(100),
    arguments JSON,
    result JSON,
    execution_time_ms INT,
    success BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. 部署架构

### 9.1 部署模式

#### 9.1.1 单机模式

```text
┌─────────────────────────────────────────────┐
│                 单机部署                      │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐          │
│  │  Agent      │  │  Agent      │          │
│  │  Orchestrator│  │  Process    │          │
│  └──────┬──────┘  └──────┬──────┘          │
│         │                │                  │
│         └────────────────┘                  │
│                   │                         │
│         ┌─────────▼─────────┐              │
│         │   SQLite/Redis    │              │
│         │   (本地存储)       │              │
│         └───────────────────┘              │
└─────────────────────────────────────────────┘
```

**适用场景**：

- 个人开发
- 小型项目
- 本地测试

**资源配置**：

- CPU: 2-4 核
- 内存: 4-8 GB
- 存储: 10 GB SSD

#### 9.1.2 分布式模式

```text
┌─────────────────────────────────────────────────────────────┐
│                     分布式部署                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Agent     │  │   Agent     │  │   Agent     │         │
│  │   Node 1    │  │   Node 2    │  │   Node N    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          │                                │
│                   ┌──────▼──────┐                        │
│                   │   Redis     │                        │
│                   │  (消息队列)  │                        │
│                   └──────┬──────┘                        │
│                          │                                │
│         ┌────────────────┼────────────────┐              │
│         │                │                │              │
│    ┌────▼────┐     ┌────▼────┐     ┌────▼────┐          │
│    │PostgreSQL│     │  MongoDB │     │   S3    │          │
│    │ (主存储) │     │ (日志)   │     │ (文件)  │          │
│    └─────────┘     └─────────┘     └─────────┘          │
└─────────────────────────────────────────────────────────────┘
```

**适用场景**：

- 企业级应用
- 高并发场景
- 团队协作

### 9.2 资源配置

#### 9.2.1 单机模式

| 组件 | CPU | 内存 | 存储 |
|------|-----|------|------|
| Agent Orchestrator | 1 核 | 2 GB | 5 GB |
| SQLite | - | 512 MB | 5 GB |
| 总计 | 2 核 | 4 GB | 10 GB |

#### 9.2.2 分布式模式

| 组件 | 实例数 | 单实例 CPU | 单实例内存 | 单实例存储 |
|------|--------|-----------|-----------|-----------|
| Agent Node | 3-5 | 2 核 | 4 GB | 10 GB |
| Redis | 1-3 | 1 核 | 2 GB | - |
| PostgreSQL | 1-2 | 2 核 | 4 GB | 100 GB |
| MongoDB | 1-2 | 1 核 | 2 GB | 50 GB |

### 9.3 配置挂载

#### 9.3.1 配置文件挂载

```yaml
# docker-compose.yaml
version: '3.8'
services:
  agent-orchestrator:
    image: agent-orchestrator:latest
    volumes:
      # 挂载配置文件
      - ./config/production.yaml:/app/config/production.yaml:ro
      - ./config/providers:/app/config/providers:ro
      # 挂载密钥 (从 Vault Agent 获取)
      - ./secrets:/app/secrets:ro
    environment:
      # 仅指定环境类型，不暴露敏感配置
      - NODE_ENV=production
      - CONFIG_PATH=/app/config/production.yaml
```

#### 9.3.2 Kubernetes ConfigMap

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-orchestrator-config
data:
  production.yaml: |
    environment: production
    server:
      port: 8080
      logLevel: info
    database:
      type: postgresql
      url: "postgresql://$(DB_HOST):5432/agent_db"
---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: agent-orchestrator-secrets
type: Opaque
stringData:
  # 使用 External Secrets Operator 从 Vault 同步
  openai-api-key: "<from-vault>"
  glm-api-key: "<from-vault>"
```

#### 9.3.3 配置中心集成

```yaml
# 使用 Consul 作为配置中心
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-orchestrator
spec:
  template:
    spec:
      containers:
        - name: agent-orchestrator
          image: agent-orchestrator:latest
          volumeMounts:
            - name: config
              mountPath: /app/config
          env:
            - name: CONFIG_CENTER_TYPE
              value: "consul"
            - name: CONFIG_CENTER_ADDRESS
              value: "consul.service.consul:8500"
            - name: CONFIG_CENTER_NAMESPACE
              value: "agent-orchestrator/prod"
      # 使用 Consul Template 注入配置
      initContainers:
        - name: consul-template
          image: hashicorp/consul-template:latest
          command:
            - consul-template
            - -config=/etc/consul-template/config.hcl
          volumeMounts:
            - name: consul-template-config
              mountPath: /etc/consul-template
            - name: config
              mountPath: /app/config
```

---

## 10. 测试策略

### 10.1 测试类型

| 测试类型 | 覆盖范围 | 工具 | 频率 |
|---------|---------|------|------|
| 单元测试 | 核心组件 | Jest | 每次提交 |
| 集成测试 | 组件交互 | Jest + TestContainers | 每次 PR |
| E2E 测试 | 完整工作流 | Playwright | 每日构建 |
| 性能测试 | 并发控制 | k6 | 每周 |
| 混沌测试 | 故障恢复 | Chaos Mesh | 每月 |

### 10.2 关键测试场景

#### 10.2.1 并发控制测试

#### 10.2.2 LLM 路由测试

#### 10.2.3 工作流执行测试

---

## 11. 实施计划

### 11.1 里程碑

| 里程碑 | 时间 | 交付物 | 验收标准 |
|--------|------|--------|----------|
| M1 | 第 2 周 | 基础框架 | 单个 Agent 可执行简单任务 |
| M2 | 第 4 周 | 调度系统 | 支持 13 阶段串行执行 |
| M3 | 第 6 周 | 并发控制 | 支持并行任务、限流、路由 |
| M4 | 第 8 周 | Agentic AI | P0/P1/P2 记忆系统完整实现 |
| M5 | 第 10 周 | 完整工作流 | 支持完整产品开发流程 |
| M6 | 第 12 周 | 生产就绪 | 监控、日志、文档完善 |

### 11.2 风险与应对

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| LLM API 不稳定 | 高 | 中 | 多 Provider 故障转移 |
| Token 成本超支 | 中 | 高 | 动态限流、成本预算控制 |
| 并发瓶颈 | 高 | 中 | 自适应并发调节、队列缓冲 |
| 状态丢失 | 高 | 低 | 定期检查点、持久化存储 |
| 工具安全风险 | 高 | 中 | 沙箱执行、权限控制、审计日志 |

---

**文档版本**: 1.2
**更新日期**: 2026-02-06
**变更说明**:

- 新增 Agent 内部并发控制设计（三层架构、动态自适应调节）
- 新增 Agentic AI 记忆系统（P0/P1/P2：工作记忆、短期记忆、工具使用）
- 新增 Agent 内部架构设计（任务分析器、子任务规划器、执行协调器）
- 新增主 Agent 决策机制（决策引擎、6 种决策模式、闭环控制）

### 5.1 工作流定义

基于 skills 工作流的产品开发流程包含 13 个主导阶段，并在关键阶段调用 4 个支持性 Agent 辅助执行：

| 阶段 | 任务名称 | Agent | 并行性 | 超时 | 输入 | 输出 |
|-----|---------|-------|--------|------|------|------|
| 1 | 需求提出 | CustomerAgent | 否 | 5m | 用户原始需求 | 需求描述文档 |
| 2 | 需求分析 | RequirementsAgent | 否 | 10m | 需求描述文档 | 需求规格说明书 |
| 3 | 产品设计 | ProductAgent | 否 | 15m | 需求规格说明书 | PRD文档 |
| 4 | UI设计 | UIAgent | 否 | 20m | PRD文档 | UI设计稿 |
| 5 | 前端开发 | FrontendAgent | 是 | 60m | UI设计稿 | 前端代码 |
| 6 | 后端开发 | BackendAgent | 是 | 60m | PRD文档 | 后端代码 |
| 7 | 架构审查 | ArchitectAgent | 否 | 30m | 前后端代码 | 架构审查报告 |
| 8 | 测试验证 | TesterAgent | 是 | 40m | 代码 | 测试报告 |
| 9 | 文档编写 | DocumentationAgent | 否 | 30m | 代码+测试报告 | 技术文档 |
| 10 | 安全审查 | SecurityAgent | 是 | 30m | 代码 | 安全审查报告 |
| 11 | 测试框架 | TestFrameworkAgent | 否 | 45m | 代码 | 测试框架 |
| 12 | DevOps配置 | DevOpsAgent | 否 | 30m | 代码 | CI/CD配置 |
| 13 | 项目协调 | CoordinatorAgent | 否 | 20m | 所有产出 | 项目总结报告 |

**支持性 Agent 调用说明：**

| 主导阶段 | 支持性 Agent | 调用场景 | 说明 |
|---------|-------------|---------|------|
| 阶段 1: 需求提出 | ProjectPlannerAgent | 需求初步评估后 | 提供项目范围、时间线估算 |
| 阶段 6: 后端开发 | DataEngineerAgent | 涉及数据库设计时 | 设计数据模型、优化数据库schema |
| 阶段 11: 测试框架 | SystemOptimizerAgent | 测试框架搭建后 | 性能基准测试、优化建议 |
| 阶段 12: DevOps 配置 | DisasterRecoveryPlannerAgent | 生成部署配置时 | 同步生成灾备方案、备份策略 |
| 阶段 13: 项目协调 | ProjectPlannerAgent | 最终总结时 | 资源分配报告、项目时间回顾 |

### 5.2 依赖关系

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                          主导阶段依赖链                                     │
└────────────────────────────────────────────────────────────────────────────┘

阶段1 ──▶ 阶段2 ──▶ 阶段3 ──▶ 阶段4
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
                阶段5(前端)                      阶段6(后端)
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                              阶段7(架构审查)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
                阶段8(测试)    阶段10(安全)    阶段11(测试框架)
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                              阶段9(文档)
                                    │
                                    ▼
                              阶段12(DevOps)
                                    │
                                    ▼
                              阶段13(协调)

┌────────────────────────────────────────────────────────────────────────────┐
│                      支持性 Agent 调用关系（虚线表示）                       │
└────────────────────────────────────────────────────────────────────────────┘

阶段1 ........ ProjectPlannerAgent
                          │
                          ▼
                    (项目范围评估)

阶段6 ........ DataEngineerAgent
                          │
                          ▼
                    (数据库设计优化)

阶段11 ........ SystemOptimizerAgent
                          │
                          ▼
                    (性能优化建议)

阶段12 ........ DisasterRecoveryPlannerAgent
                          │
                          ▼
                    (灾备方案生成)

阶段13 ........ ProjectPlannerAgent
                          │
                          ▼
                    (项目总结报告)

图例:
──▶   主导阶段的依赖关系（必须顺序执行）
..... 支持性 Agent 的调用关系（辅助执行）
```

**并行执行说明**：

- 阶段5 & 6：前端开发和后端开发可以并行执行
- 阶段8 & 10：测试验证和安全审查可以并行执行

### 5.3 工作流配置示例

```yaml
# workflow.yaml
name: product-development
version: '1.0'
description: 产品开发全流程

tasks:
  - id: task-1
    name: 需求提出
    agent: customer-agent
    timeout: 300000
    retry:
      maxAttempts: 3
      backoffStrategy: exponential
      initialDelay: 1000

  - id: task-2
    name: 需求分析
    agent: requirements-agent
    dependencies: [task-1]
    timeout: 600000

  - id: task-3
    name: 产品设计
    agent: product-agent
    dependencies: [task-2]
    timeout: 900000

  - id: task-4
    name: UI设计
    agent: ui-agent
    dependencies: [task-3]
    timeout: 1200000

  - id: task-5
    name: 前端开发
    agent: frontend-agent
    dependencies: [task-4]
    parallelism: true
    timeout: 3600000

  - id: task-6
    name: 后端开发
    agent: backend-agent
    dependencies: [task-4]
    parallelism: true
    timeout: 3600000

  - id: task-7
    name: 架构审查
    agent: architect-agent
    dependencies: [task-5, task-6]
    timeout: 1800000

  - id: task-8
    name: 测试验证
    agent: tester-agent
    dependencies: [task-7]
    parallelism: true
    timeout: 2400000

  - id: task-10
    name: 安全审查
    agent: security-agent
    dependencies: [task-7]
    parallelism: true
    timeout: 1800000

  - id: task-9
    name: 文档编写
    agent: documentation-agent
    dependencies: [task-8, task-10]
    timeout: 1800000

  - id: task-11
    name: 测试框架
    agent: test-framework-agent
    dependencies: [task-9]
    timeout: 2700000

  - id: task-12
    name: DevOps配置
    agent: devops-agent
    dependencies: [task-11]
    timeout: 1800000

  - id: task-13
    name: 项目协调
    agent: coordinator-agent
    dependencies: [task-12]
    timeout: 1200000
```

---

## 6. 接口设计

### 6.1 核心接口

#### 6.1.1 Orchestrator API

#### 6.1.2 Agent API

#### 6.1.3 监控 API

### 6.2 SDK 接口

---

## 7. 数据模型

### 7.1 核心实体

#### 7.1.1 Workflow（工作流）

#### 7.1.2 Execution（执行实例）

#### 7.1.3 Task（任务）

### 7.2 数据库设计

#### 7.2.1 表结构

```sql
-- 工作流表
CREATE TABLE workflows (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  version VARCHAR(32) NOT NULL,
  description TEXT,
  definition JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 执行实例表
CREATE TABLE executions (
  id VARCHAR(64) PRIMARY KEY,
  workflow_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL,
  input JSON,
  output JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id)
);

-- 任务状态表
CREATE TABLE task_states (
  id VARCHAR(64) PRIMARY KEY,
  execution_id VARCHAR(64) NOT NULL,
  task_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL,
  input JSON,
  output JSON,
  error TEXT,
  retry_count INT DEFAULT 0,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (execution_id) REFERENCES executions(id)
);

-- 检查点表
CREATE TABLE checkpoints (
  id VARCHAR(64) PRIMARY KEY,
  execution_id VARCHAR(64) NOT NULL,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (execution_id) REFERENCES executions(id)
);

-- 日志表
CREATE TABLE logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  execution_id VARCHAR(64) NOT NULL,
  task_id VARCHAR(64),
  level VARCHAR(16) NOT NULL,
  message TEXT NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (execution_id) REFERENCES executions(id)
);
```

---

## 8. 配置管理方案

### 8.1 配置分层架构

系统采用分层配置管理策略，支持从系统级到任务级的多级配置覆盖：

```text
┌─────────────────────────────────────────────────────────────┐
│                      配置分层架构                            │
├─────────────────────────────────────────────────────────────┤
│  Level 4: 任务级配置 (Task Config)                          │
│  - 单个任务的超时、重试策略                                  │
│  - 任务特定的 LLM 参数                                       │
├─────────────────────────────────────────────────────────────┤
│  Level 3: Agent 级配置 (Agent Config)                        │
│  - Agent 类型定义                                            │
│  - Agent 特定的工具、内存设置                                │
├─────────────────────────────────────────────────────────────┤
│  Level 2: 工作流级配置 (Workflow Config)                     │
│  - 工作流定义 (YAML/JSON)                                    │
│  - 阶段依赖、并行设置                                        │
├─────────────────────────────────────────────────────────────┤
│  Level 1: 系统级配置 (System Config)                         │
│  - 配置文件 (YAML/JSON)                                      │
│  - 配置中心 (Consul/etcd)                                    │
│  - 全局并发、Provider 设置                                   │
│  - 数据库、缓存连接                                          │
├─────────────────────────────────────────────────────────────┤
│  Level 0: 默认配置 (Default Config)                          │
│  - 硬编码默认值                                              │
│  - 兜底配置                                                  │
└─────────────────────────────────────────────────────────────┘
```

**配置优先级**：Task > Agent > Workflow > System > Default

### 8.2 配置类型定义

#### 8.2.1 系统级配置

#### 8.2.2 Provider 配置

#### 8.2.3 Agent 配置

#### 8.2.4 工作流配置

```yaml
# config/workflows/product-development.yaml
workflow:
  id: product-development
  name: 产品开发工作流
  version: "1.0.0"
  description: 完整的 13 阶段产品开发流程

  # 全局配置
  defaults:
    timeout: 1800000  # 30 分钟
    retry:
      maxAttempts: 3
      backoffStrategy: exponential
      initialDelay: 5000
      maxDelay: 60000

  # 阶段定义
  phases:
    - id: phase-1-requirements
      name: 需求分析
      agent: requirements-agent
      timeout: 600000  # 10 分钟
      inputs:
        - name: raw_requirements
          type: string
          required: true
      outputs:
        - name: requirements_spec
          type: document
      contextInjection: []

    - id: phase-2-product-design
      name: 产品设计
      agent: product-agent
      timeout: 900000  # 15 分钟
      dependencies: [phase-1-requirements]
      contextInjection:
        - source: phase-1-requirements
          output: requirements_spec
          target: prompt_prefix
          transform: summary
          maxLength: 4000
      outputs:
        - name: prd
          type: document

    - id: phase-5-frontend
      name: 前端开发
      agent: frontend-agent
      timeout: 3600000  # 60 分钟
      parallel: true
      dependencies: [phase-4-ui-design]
      contextInjection:
        - source: phase-4-ui-design
          output: ui_design
          target: prompt_prefix
      tools:
        - read_file
        - write_file
        - execute_code
      outputs:
        - name: frontend_code
          type: code

    - id: phase-6-backend
      name: 后端开发
      agent: backend-agent
      timeout: 3600000
      parallel: true
      dependencies: [phase-2-product-design]
      contextInjection:
        - source: phase-2-product-design
          output: prd
          target: prompt_prefix
      tools:
        - read_file
        - write_file
        - execute_code
        - web_search
      outputs:
        - name: backend_code
          type: code

  # 条件分支
  conditions:
    - name: complexity-check
      expression: "phases.phase-2-product-design.outputs.complexity > 8"
      trueBranch: phase-4-detailed-design
      falseBranch: phase-4-agile-sprint

  # 并发控制
  concurrency:
    globalMax: 10
    phaseLimits:
      phase-5-frontend: 3
      phase-6-backend: 3
      phase-8-testing: 5

  # 内存配置
  memory:
    checkpointInterval: 30000
    maxHistoryLength: 20
    enabledTools:
      - read_file
      - write_file
      - execute_code
      - web_search
```

### 8.3 配置加载与合并

### 8.4 配置热更新

### 8.5 配置文件示例

#### 8.5.1 开发环境配置

```yaml
# config/development.yaml
environment: development

server:
  port: 8080
  host: "0.0.0.0"
  logLevel: debug

database:
  type: sqlite
  url: "file:./data/dev.db"
  poolSize: 5

cache:
  type: memory
  ttl: 3600

llm:
  defaultProvider: openai
  defaultModel: gpt-4
  timeout: 60000
  maxRetries: 3

providers:
  openai:
    enabled: true
    apiKey: "${OPENAI_API_KEY}"  # 从密钥管理服务获取
    baseURL: "https://api.openai.com/v1"
    models:
      - id: gpt-4
        enabled: true
      - id: gpt-3.5-turbo
        enabled: true

  glm:
    enabled: true
    apiKey: "${GLM_API_KEY}"  # 从密钥管理服务获取
    models:
      - id: glm-4
        enabled: true

concurrency:
  globalMax: 20
  adaptiveEnabled: true
  providers:
    openai:
      maxConcurrent: 5
      maxQueueSize: 50
    glm:
      maxConcurrent: 10
      maxQueueSize: 100

security:
  apiKeyRequired: false
  rateLimitEnabled: false

# 配置中心 (可选)
configCenter:
  enabled: false
  type: file  # file/consul/etcd/nacos
  # type: consul
  # address: "localhost:8500"
```

#### 8.5.2 生产环境配置

```yaml
# config/production.yaml
environment: production

server:
  port: 8080
  host: "0.0.0.0"
  logLevel: warn

database:
  type: postgresql
  url: "postgresql://user:pass@localhost:5432/agent_db"
  poolSize: 20

cache:
  type: redis
  url: "redis://localhost:6379"
  ttl: 3600

llm:
  defaultProvider: openai
  defaultModel: gpt-4
  timeout: 60000
  maxRetries: 3

providers:
  openai:
    enabled: true
    apiKey: "${vault:openai/api-key}"  # 从 Vault 获取
    baseURL: "https://api.openai.com/v1"
    models:
      - id: gpt-4
        enabled: true
      - id: gpt-3.5-turbo
        enabled: true

  glm:
    enabled: true
    apiKey: "${vault:glm/api-key}"  # 从 Vault 获取
    models:
      - id: glm-4
        enabled: true

concurrency:
  globalMax: 100
  adaptiveEnabled: true
  providers:
    openai:
      maxConcurrent: 20
      maxQueueSize: 200
    glm:
      maxConcurrent: 30
      maxQueueSize: 300

security:
  apiKeyRequired: true
  rateLimitEnabled: true
  maxRequestSize: "10mb"

# 配置中心
configCenter:
  enabled: true
  type: consul
  address: "consul.service.consul:8500"
  namespace: "agent-orchestrator"
  watchInterval: 30000  # 30秒检查一次配置变化
```

#### 8.5.3 Provider 独立配置

```yaml
# config/providers/openai.yaml
name: openai
enabled: true
apiKey: "${vault:openai/api-key}"
baseURL: "https://api.openai.com/v1"
organization: "${vault:openai/org-id}"

models:
  - id: gpt-4
    name: "GPT-4"
    maxTokens: 8192
    contextWindow: 8192
    supportsFunctions: true
    supportsVision: true
    defaultParams:
      temperature: 0.7
      topP: 1.0
      frequencyPenalty: 0
      presencePenalty: 0

  - id: gpt-4-turbo
    name: "GPT-4 Turbo"
    maxTokens: 4096
    contextWindow: 128000
    supportsFunctions: true
    supportsVision: true
    defaultParams:
      temperature: 0.7
      topP: 1.0

concurrency:
  maxConcurrent: 20
  maxQueueSize: 200
  timeout: 60000

cost:
  inputTokenPrice: 0.03
  outputTokenPrice: 0.06
  currency: USD

routing:
  weight: 100
  priority: 1
  healthCheck:
    enabled: true
    interval: 30000
    timeout: 10000
```

#### 8.5.4 密钥管理

使用 Vault 或 AWS Secrets Manager 管理敏感配置：

---

## 9. 测试策略

### 9.1 测试类型

| 测试类型 | 覆盖率目标 | 工具 |
|---------|-----------|------|
| 单元测试 | > 80% | Jest |
| 集成测试 | > 60% | Jest + TestContainers |
| E2E测试 | 核心流程 | Playwright |
| 性能测试 | 关键路径 | k6 |

### 9.2 关键测试场景

#### 9.2.1 并发控制测试

#### 9.2.2 LLM 路由测试

#### 9.2.3 工作流执行测试

---

## 10. 实施计划

### 10.1 里程碑

| 阶段 | 时间 | 目标 | 交付物 |
|------|------|------|--------|
| Phase 1 | 2周 | 核心框架 | Orchestrator + TaskPlanner + Scheduler |
| Phase 2 | 2周 | 控制组件 | ConcurrencyController + LLMRouter |
| Phase 3 | 2周 | Agent实现 | 17个 Agent 实现 |
| Phase 4 | 1周 | 工作流 | 产品开发工作流 |
| Phase 5 | 1周 | 测试优化 | 测试覆盖 + 性能优化 |
| Phase 6 | 1周 | 部署文档 | 部署方案 + 运维文档 |

### 10.2 风险与应对

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| LLM Provider 不稳定 | 高 | 中 | 实现多 Provider 故障转移 |
| 并发控制复杂 | 中 | 高 | 分阶段实现，先全局后 Provider |
| 性能不达预期 | 高 | 中 | 预留优化时间，准备降级方案 |
| Agent 协作问题 | 中 | 中 | 增加集成测试，完善上下文传递 |

---

## 11. 附录

### 11.1 术语表

| 术语 | 说明 |
|------|------|
| Agent | 执行特定任务的智能体 |
| Workflow | 定义任务执行流程的配置 |
| DAG | 有向无环图，表示任务依赖关系 |
| Provider | LLM 服务提供商 |
| Checkpoint | 执行状态检查点 |
| Orchestrator | 中央调度器 |

### 11.2 参考资料

- OpenAI API 文档
- Mermaid 语法文档
- Node.js 最佳实践
- 微服务设计模式

### 11.3 修订记录

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2024-02-05 | 初始版本 | AI Assistant |

---

**文档结束**
