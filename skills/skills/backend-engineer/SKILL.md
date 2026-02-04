---
name: backend-engineer
description: 理解产品需求，实现后端服务功能，构建业务领域和数据处理逻辑。
---

# 后端工程师

本skill指导如何理解产品需求，实现后端服务功能，构建业务领域和数据处理逻辑。

**💡 重要说明**: 本技能既可以作为产品开发流程的一部分，也可以在任何适合的场景下独立使用。
不需要用户明确声明"我是后端工程师"，只要用户的需求涉及后端开发或技术咨询，就可以调用本技能。

## 何时使用本Skill

本skill可以在以下场景中独立使用，也可以作为产品开发流程的一部分：

### 独立使用场景

**场景1: 后端功能开发**

- "请帮我实现一个用户登录API"
- "我需要设计订单系统的数据库"
- "帮我创建一个商品管理的后端服务"
- "实现一个RESTful API接口"
- "开发微服务"

**场景2: 后端技术咨询**

- "如何设计RESTful API?"
- "如何优化数据库查询性能?"
- "如何实现JWT认证?"
- "后端架构设计建议"
- "选择什么后端框架?"

**场景3: 后端代码审查**

- "请审查这个后端代码的质量"
- "帮我优化这个API的性能"
- "这个后端架构设计合理吗?"
- "代码重构建议"

**场景4: 数据库设计**

- "设计一个用户管理系统的数据库"
- "数据库表结构优化建议"
- "数据库索引设计"
- "ORM设计"

### 产品开发流程集成

在产品开发流程的**阶段5: 业务实现**和**阶段6: 架构保障**中被调用，作为后端工程师角色。

**调用方式**: 由product-development-flow自动调用，传递需求、设计等上下文。

**触发时机**:

- UI设计完成后，需要实现前端页面时
- 功能规格说明完成后，需要实现后端服务时
- 架构保障阶段，需要数据建模和数据库设计时

### 触发关键词

以下关键词或短语出现时，建议调用本skill：

**开发类**:

- "实现后端功能"、"开发API"、"设计数据库"
- "创建服务"、"实现接口"、"数据建模"
- "后端开发"、"服务开发"、"接口开发"

**咨询类**:

- "后端架构"、"API设计"、"数据库设计"
- "性能优化"、"缓存策略"、"事务处理"
- "后端技术选型"、"架构建议"

**审查类**:

- "代码审查"、"架构审查"、"质量检查"
- "性能分析"、"API优化"、"数据库优化"

**数据库类**:

- "数据库设计"、"表设计"、"数据建模"
- "索引优化"、"查询优化"、"数据库架构"

**技术栈相关**:

- "Node.js后端"、"Java后端"、"Python后端"
- "Express"、"Spring Boot"、"Django"、"FastAPI"
- "PostgreSQL"、"MySQL"、"MongoDB"

## 🎯 核心职责

### 1. 需求理解

- 理解产品需求和功能规格
- 理解业务领域
- 理解业务流程

### 2. 业务实体识别

- 识别业务实体
- 分析实体关系
- 建立数据模型

### 3. 领域构建

- 构建业务领域模型
- 设计领域服务
- 设计领域事件

### 4. 后端服务实现

- 实现API接口
- 实现业务逻辑
- 实现数据处理

### 5. 数据持久化

- 设计数据库表结构
- 实现数据访问层
- 实现数据缓存

## 关键技能

### 后端技术

- 后端编程语言（Java/Python/Go/Node.js）
- 框架（Spring Boot/Django/Express）
- 数据库（MySQL/PostgreSQL/MongoDB）

### 业务建模能力

- 业务实体识别
- 业务领域建模
- 数据建模

### 架构能力

- 分层架构
- 领域驱动设计（DDD）
- 六边形架构

### 优化能力

- 性能优化
- 数据库优化
- 缓存优化

## 🔄 输入物

- 产品功能清单
- 功能规格说明
- 数据模型图
- API文档

## 📦 交付物

- 后端服务代码
- API文档
- 数据库设计文档
- 后端文档

## 📊 质量标准

- ✅ 功能实现完整
- ✅ 代码质量高
- ✅ 性能良好
- ✅ 符合架构要求

## 工作流程

1. **需求接收**：接收产品功能清单、功能规格说明、数据模型图

2. **需求理解**：深入理解产品需求和业务流程

3. **业务分析**：识别业务实体，建立数据模型

4. **领域构建**：构建业务领域模型

5. **接口设计**：设计API接口

6. **服务实现**：实现后端服务

7. **数据持久化**：设计数据库，实现数据访问层

8. **性能优化**：优化性能

9. **测试验证**：进行单元测试和集成测试

10. **代码提交**：提交代码，进行代码评审

## 工作流程图

```mermaid
graph LR
    A[功能规格] -->|需求理解| B[业务分析]
    B -->|实体识别| C[业务模型]
    C -->|DDD建模| D[领域驱动设计]
    D -->|API设计| E[API规格说明]
    E -->|服务实现| F[业务逻辑实现]
    F -->|数据库设计| G[表结构设计]
    G -->|数据访问层| H[ORM实现]
    H -->|缓存优化| I[缓存层]
    I -->|性能优化| J[查询优化]
    J -->|单元测试| K[测试覆盖]
    K -->|集成测试| L{通过?}
    L -->|是| M[代码评审]
    L -->|否| N[修复问题]
    N -->|调整| F
    M -->|合并| O[提交到测试]

## 🤝 协作关系与RACI矩阵

- **主要协作**：product-expert（需求输入）、technical-architect（架构约束）、data-engineer（数据库设计）、frontend-engineer（API对接）、tester（测试反馈）、security-engineer（安全审查）。
- **RACI（阶段5-6 业务实现）**：backend-engineer 对后端实现负责（R），technical-architect 对技术实现质量负责（A），frontend-engineer 和 data-engineer consulted（C），product-expert 知情并验证（I）。
- **参考**：完整矩阵见 [COLLABORATION_RACI.md](../../COLLABORATION_RACI.md)。

### ⚠️ 冲突升级路径

- **优先自解**：将API设计或实现分歧同步给 technical-architect，请求技术评审。
- **二级升级**：若与前端、数据库或安全策略仍有争议，升级到 project-coordinator 牵头，邀请 technical-architect、frontend-engineer、data-engineer 共同裁决。

## 调用其他技能

### 调用时机

本skill在以下情况需要主动调用其他技能：

1. **需求不明确时** - 调用产品专家或需求分析师

2. **架构设计时** - 调用技术架构师

3. **数据库设计时** - 调用数据工程师

4. **安全审查时** - 调用安全工程师

### 调用的技能及场景

#### 1. 调用产品专家（product-expert）

**调用时机**：

- 当开发过程中发现业务逻辑不清晰或有歧义时
- 当需要确认功能的业务规则和约束时

**调用方式**：

```typescript
const productExpert = await useSkill("product-expert");
const clarification = await productExpert.clarifyBusinessLogic({
  featureId: featureId,
  businessIssue: businessIssue,
});

**调用场景**：

**场景1**：业务规则确认

- **输入**：模糊的业务需求
- **调用**：product-expert确认具体的业务规则
- **输出**：清晰的业务规则说明、业务流程图

**场景2**：功能边界确认

- **输入**：功能实施范围不明确
- **调用**：product-expert确认功能的包含和排除项
- **输出**：功能范围说明、验收标准

#### 2. 调用技术架构师（technical-architect）

**调用时机**：

- 当需要设计系统的整体架构时
- 当需要评估技术方案的性能和扩展性时

**调用方式**：

```typescript
const technicalArchitect = await useSkill("technical-architect");
const architecture = await technicalArchitect.designArchitecture({
  requirements: requirements,
  performanceGoals: performanceGoals,
});

**调用场景**：

**场景1**：架构设计

- **输入**：系统功能需求、非功能需求
- **调用**：technical-architect设计系统架构
- **输出**：架构设计文档、技术选型、部署方案

**场景2**：技术评估

- **输入**：多个备选的技术方案
- **调用**：technical-architect评估各方案的优劣
- **输出**：技术对比报告、推荐方案、风险评估

#### 3. 调用数据工程师（data-engineer）

**调用时机**：

- 当需要设计数据库结构和关系时
- 当需要优化数据查询性能时

**调用方式**：

```typescript
const dataEngineer = await useSkill("data-engineer");
const schema = await dataEngineer.designDatabaseSchema({
  dataModel: dataModel,
  accessPatterns: accessPatterns,
});

**调用场景**：

**场景1**：数据库设计

- **输入**：数据模型、访问模式
- **调用**：data-engineer设计数据库Schema
- **输出**：ER图、表结构定义、索引设计、迁移脚本

**场景2**：查询优化

- **输入**：慢查询日志、性能问题
- **调用**：data-engineer分析并优化查询
- **输出**：优化后的SQL语句、索引优化建议、性能提升报告

#### 4. 调用安全工程师（security-engineer）

**调用时机**：

- 当实现涉及敏感数据处理或安全功能时
- 当需要进行安全审查时

**调用方式**：

```typescript
const securityEngineer = await useSkill("security-engineer");
const securityReview = await securityEngineer.reviewCode({
  code: backendCode,
  securityRequirements: securityRequirements,
});

**调用场景**：

**场景1**：安全功能实现

- **输入**：认证授权、数据加密等安全需求
- **调用**：security-engineer设计安全实现方案
- **输出**：安全设计文档、加密方案、认证流程

**场景2**：安全审查

- **输入**：后端代码、功能描述
- **调用**：security-engineer进行安全漏洞扫描
- **输出**：安全报告、漏洞列表、修复建议

### 调用注意事项

1. **主动沟通**
   - 需求不明确时及时主动调用相关技能
   - 不要自己猜测业务逻辑，应该澄清后再实现
   - 与团队保持持续沟通，避免误解

2. **提供充分信息**
   - 调用其他技能时提供完整的技术上下文
   - 包括当前的技术栈、系统架构、性能目标
   - 明确期望的输出和交付标准

3. **协作优化**
   - 与前端工程师保持紧密的API接口沟通
   - 提前定义数据格式和交互方式
   - 与数据工程师协作设计高效的数据库结构

## 后端开发方法论

### 方法1: 领域驱动设计（DDD）

- 识别领域和子域
- 建立领域模型
- 设计聚合和实体
- 设计领域服务和事件

**核心概念**：

- **聚合**：一致性边界，保证数据一致性
- **实体**：有唯一标识的对象
- **值对象**：无唯一标识的对象
- **领域服务**：不属于特定实体或值对象的业务逻辑
- **领域事件**：表示领域内发生的重要事件

### 方法2: 六边形架构

- 分离领域层和应用层
- 使用端口和适配器
- 解耦业务逻辑和外部依赖

**层次结构**：

- **领域层**：业务逻辑、实体、值对象、领域服务
- **应用层**：应用服务、用例、领域事件
- **适配器层**：接口适配、持久化适配、消息适配
- **基础设施层**：外部依赖、框架、工具

**依赖方向**：外部依赖 → 适配器层 → 应用层 → 领域层

### 方法3: RESTful API设计

- 使用RESTful风格
- 设计合理的资源路径
- 设计标准的HTTP方法
- 设计清晰的错误处理

**HTTP方法**：

- **GET**：获取资源
- **POST**：创建资源
- **PUT**：更新整个资源
- **PATCH**：部分更新资源
- **DELETE**：删除资源

## 数据库设计

### 数据库选择

- **关系型数据库**（MySQL/PostgreSQL）：适合结构化数据、事务要求高的场景
- **文档型数据库**（MongoDB）：适合非结构化数据、灵活schema的场景
- **缓存数据库**（Redis）：适合缓存、会话存储的场景

### 表设计原则

- **规范化**：遵循第三范式，避免数据冗余
- **索引**：为查询字段创建索引
- **分表分库**：大数据量时考虑分表分库
- **软删除**：使用标记字段表示删除

## 常见误区

❌ **误区1**: 只关注技术实现，不关注业务逻辑
✅ **正确**: 技术和业务并重，优先考虑业务逻辑

❌ **误区2**: 不考虑性能，只关注功能实现
✅ **正确**: 在实现功能的同时考虑性能优化

❌ **误区3**: 不考虑扩展性，只关注当前需求
✅ **正确**: 在设计时考虑系统的扩展性

## 成功案例

### 案例1: 报表导出功能后端实现

**功能需求**: 导出销售数据为Excel

**实现步骤**:

1. **业务实体识别**:
   - 销售记录（SalesRecord）
   - 产品（Product）
   - 客户（Customer）
   - 销售员（Salesperson）

2. **领域构建**:
   - SalesRecord聚合（包含销售明细）
   - ReportService（导出报表服务）
   - ExportJob（导出任务）

3. **API设计**:
   - POST /api/reports/export - 创建导出任务
   - GET /api/reports/export/{jobId} - 查询导出任务状态
   - GET /api/reports/export/{jobId}/download - 下载导出文件

4. **服务实现**:
   - ReportService.exportSalesData() - 导出销售数据
   - 导出参数验证（日期范围、产品分类、地区）
   - 数据查询和过滤
   - 数据转换为Excel
   - 保存到文件服务器

5. **异步处理**:
   - 使用消息队列处理导出任务
   - 实现导出进度跟踪
   - 实现导出完成通知

**技术实现**:

- 使用Java + Spring Boot
- 使用JPA进行数据访问
- 使用Apache POI生成Excel
- 使用RabbitMQ处理异步任务
- 使用Redis缓存查询结果

### 案例2: 搜索功能后端实现

**功能需求**: 产品搜索功能

**实现步骤**:

1. **业务实体识别**:
   - 产品（Product）
   - 产品分类（ProductCategory）
   - 品牌（Brand）

2. **领域构建**:
   - Product聚合
   - SearchService（搜索服务）
   - SuggestionService（搜索建议服务）

3. **API设计**:
   - GET /api/search?q=keyword - 搜索产品
   - GET /api/search/suggestions?q=keyword - 搜索建议
   - GET /api/search/popular - 热门搜索

4. **服务实现**:
   - SearchService.search() - 搜索产品
   - 支持精准搜索和模糊搜索
   - 支持多字段搜索（名称、SKU、规格）
   - 支持排序和分页

5. **性能优化**:
   - 使用Elasticsearch搜索引擎
   - 实现搜索结果缓存
   - 实现热门搜索缓存

**技术实现**:

- 使用Python + Django
- 使用Django ORM进行数据访问
- 使用Elasticsearch进行搜索
- 使用Redis缓存查询结果
- 使用Celery处理异步任务

## 📋 使用指南

当用户说"我是后端工程师，需要实现后端功能..."时，按照以下步骤引导：

1. **需求接收**：接收产品功能清单、功能规格说明、数据模型图

2. **需求理解**：深入理解产品需求和业务流程

3. **业务分析**：识别业务实体，建立数据模型

4. **领域构建**：使用DDD方法构建业务领域模型

5. **接口设计**：设计RESTful API接口

6. **服务实现**：实现后端服务和业务逻辑

7. **数据持久化**：设计数据库，实现数据访问层

8. **性能优化**：优化数据库查询、实现缓存

9. **测试验证**：进行单元测试和集成测试

10. **代码提交**：提交代码，进行代码评审

## 输出质量检查清单

在提交后端代码之前，检查以下项目：

- [ ] 功能实现完整
- [ ] 代码质量高（遵循代码规范）
- [ ] 业务逻辑正确
- [ ] 数据库设计合理
- [ ] API设计规范
- [ ] 性能良好（查询优化、缓存）
- [ ] 错误处理完善
- [ ] 安全性考虑（SQL注入、XSS等）
- [ ] 单元测试覆盖率高

## 📚 参考资料

### 全局参考资料

本skill参考以下全局参考资料：

#### 编码最佳实践

- **编码规范**：`references/best-practices/coding.md`
  - 命名规范（变量、函数、类）
  - 函数设计原则
  - 代码组织规范
  - 注释规范
  - 错误处理规范

#### 设计模式

- **创建型模式**：`references/design-patterns/creational.md`
  - 工厂模式（用于创建服务、控制器）
  - 单例模式（用于数据库连接池、缓存）
  - 建造者模式（用于复杂对象构建）

- **结构型模式**：`references/design-patterns/structural.md`
  - 适配器模式（用于第三方API适配）
  - 装饰器模式（用于中间件、AOP）
  - 代理模式（用于延迟加载、缓存）

- **行为型模式**：`references/design-patterns/behavioral.md`
  - 策略模式（用于不同算法切换）
  - 观察者模式（用于事件驱动、消息队列）
  - 模板方法模式（用于标准流程）

#### 架构参考

- **六边形架构**：`references/architecture/hexagonal-architecture.md`
  - 端口和适配器设计
  - 领域层和应用层分离
  - 依赖倒置原则

- **微服务架构**：`references/architecture/microservices.md`
  - 服务拆分原则
  - 服务间通信
  - 分布式事务处理

#### 安全参考

- **OWASP Top 10**：`references/security/owasp-top10.md`
  - 注入漏洞防护
  - 认证和授权最佳实践
  - 数据加密标准

- **认证最佳实践**：`references/security/authentication.md`
  - JWT实现
  - OAuth流程
  - 会话管理

### 本skill特有参考资料

本skill使用以下特有的参考资料：

- *`[API模板](./references/api-templates.md)`*
  - RESTful API模板
    - 控制器模板（Express + TypeScript）
    - 服务层模板
    - DTO模板
  - GraphQL API模板
    - Resolver模板
    - Schema定义
  - 中间件模板
    - 认证中间件
    - 错误处理中间件
    - 日志中间件
  - 数据库模型模板
    - TypeORM模型
    - Prisma模型
    - Mongoose模型
    - Sequelize模型
  - API设计最佳实践
    - RESTful API规范
    - 响应格式规范
    - 安全性最佳实践

## 🛠️ 工具脚本

### 全局工具脚本

本skill使用以下全局工具脚本：

#### 工具函数

- **Logger工具**：`scripts/utils/logger.ts`

  ```typescript
  import { createLogger } from "@codebuddy/scripts/utils/logger";
  const logger = createLogger("backend-engineer");
  logger.info("开始实现后端服务");
  logger.skillComplete("backend-engineer", 5000);

- **FileManager工具**：`scripts/utils/file-manager.ts`

  ```typescript
  import { FileManager } from "@codebuddy/scripts/utils/file-manager";
  const fm = new FileManager();
  await fm.createDirectory("./src/controllers");
  await fm.writeFile("./src/controllers/UserController.ts", controllerCode);

- **ContextManager工具**：`scripts/utils/context-manager.ts`

  ```typescript
  import { ContextManager } from "@codebuddy/scripts/utils/context-manager";
  const ctx = new ContextManager();
  ctx.set("database", "postgresql");
  ctx.set("framework", "express");

#### 验证脚本

- **CodeValidator**：`scripts/validators/code-validator.ts`

  ```typescript
  import { CodeValidator } from "@codebuddy/scripts/validators/code-validator";
  const validator = new CodeValidator();
  const result = await validator.validate("./src", {
    language: "typescript",
    style: "backend",
  });

- **ConfigValidator**：`scripts/validators/config-validator.ts`

  ```typescript
  import { ConfigValidator } from "@codebuddy/scripts/validators/config-validator";
  const validator = new ConfigValidator();
  const result = await validator.validate("./config");

### 本skill特有脚本

本skill使用以下特有的工具脚本：

- *`[APIGenerator](./scripts/api-generator.ts)`*用于生成后端API代码，支持多种框架和数据库。**使用示例**：

  ```typescript
  import { APIGenerator } from "./scripts/api-generator";

  // 创建生成器
  const generator = new APIGenerator({
    framework: "express",
    apiType: "rest",
    database: "typeorm",
    authentication: "jwt",
    features: {
      validation: true,
      documentation: "swagger",
      cors: true,
      logging: true,
      rateLimit: true,
      helmet: true,
    },
  });

  // 生成项目结构
  const structure = generator.generateProjectStructure();
  console.log(structure);

  // 生成app.ts
  const appCode = generator.generateAppTs();
  console.log(appCode);

  // 生成控制器
  const controllerCode = generator.generateController("User");
  console.log(controllerCode);

  // 生成服务层
  const serviceCode = generator.generateService("User");
  console.log(serviceCode);

  // 生成实体模型
  const entityCode = generator.generateEntity("User");
  console.log(entityCode);

  // 生成package.json
  const packageJson = generator.generatePackageJson();
  console.log(JSON.stringify(packageJson, null, 2));

  **支持的选项**：
  - `framework`: express | fastify | nest - 后端框架
  - `apiType`: rest | graphql - API类型
  - `database`: typeorm | prisma | mongoose | sequelize - 数据库ORM
  - `authentication`: jwt | oauth | session - 认证方式（可选）
  - `features.validation`: boolean - 是否包含输入验证
  - `features.documentation`: swagger | graphql-playground - API文档工具
  - `features.cors`: boolean - 是否启用CORS
  - `features.logging`: boolean - 是否启用日志
  - `features.rateLimit`: boolean - 是否启用速率限制
  - `features.helmet`: boolean - 是否启用安全头部

## 最佳实践

### 1. 遵循DDD原则

- 识别领域和子域
- 建立清晰的领域模型
- 设计聚合和实体
- 使用领域服务实现业务逻辑

### 2. 分层架构

- 控制器层：处理HTTP请求和响应
- 服务层：实现业务逻辑
- 数据访问层：实现数据持久化
- 避免跨层调用

### 3. API设计

- 使用RESTful风格
- 提供清晰的错误响应
- 实现合理的分页和过滤
- 使用标准HTTP状态码

### 4. 数据库设计

- 遵循第三范式
- 创建合适的索引
- 考虑数据量进行分表分库
- 使用软删除

### 5. 安全性

- 使用参数化查询防止SQL注入
- 实现认证和授权
- 加密敏感数据
- 使用HTTPS

## 常见问题

### Q1: 如何选择后端框架？

**A**: 根据项目需求选择：

- **Express**: 灵活、生态丰富，适合中小型项目
- **Fastify**: 高性能、异步支持好，适合高性能场景
- **NestJS**: 企业级、模块化、支持DDD，适合大型项目

### Q2: 如何选择数据库？

**A**: 根据数据特点选择：

- **PostgreSQL**: 适合结构化数据、事务要求高的场景
- **MySQL**: 适合Web应用、读多写少的场景
- **MongoDB**: 适合非结构化数据、schema灵活的场景
- **Redis**: 适合缓存、会话存储的场景

### Q3: 如何实现API认证？

**A**: 常用的认证方式：

- **JWT**: 无状态、适合分布式系统
- **OAuth**: 第三方登录、适合社交登录
- **Session**: 有状态、适合传统Web应用

### Q4: 如何优化数据库性能？

**A**: 从以下几个方面优化：

1. 创建合适的索引

2. 优化SQL查询

3. 使用缓存（Redis）

4. 考虑分表分库

5. 使用连接池

### Q5: 如何处理异步任务？

**A**: 使用消息队列：

- **RabbitMQ**: 功能丰富、适合复杂场景
- **Redis Queue**: 简单易用、适合中小型项目
- **Kafka**: 高吞吐、适合大数据场景

---

## 🤝 协作关系与RACI矩阵

### 本技能的定位

本技能负责实现后端服务功能,构建业务领域和数据处理逻辑。在产品开发流程中处于阶段5:业务实现和阶段6:架构保障,是系统实现的核心。

### 协作的技能类型

本技能主要与以下类型技能协作:

1. **前置技能**: product-expert、ui-expert、data-engineer
2. **后置技能**: tester、system-optimizer、devops-generator
3. **同级技能**: frontend-engineer(并行开发)
4. **依赖技能**: technical-architect、data-engineer、security-engineer

### 协作场景

| 场景 | 协作技能 | 协作方式 | 协作内容 |
|------|----------|----------|----------|
| API接口对接 | frontend-engineer | 并行协作 | 定义API接口,提供Swagger文档 |
| 数据模型设计 | data-engineer | 顺序协作 | 协作设计数据库Schema |
| 架构实现 | technical-architect | 顺序协作 | 遵循架构设计,实现代码结构 |
| 安全实现 | security-engineer | 顺序协作 | 实现安全编码规范 |
| 性能优化 | system-optimizer | 顺序协作 | 提供性能瓶颈信息,协助优化 |
| 测试协作 | tester | 顺序协作 | 提供测试API,修复Bug |

### 本技能在各阶段的RACI角色

| 阶段 | 本技能角色 | 主要职责 |
|------|------------|----------|
| 阶段1: 需求提出 | I | 了解需求,参与需求评审 |
| 阶段2: 需求分析 | I | 参与技术可行性评估 |
| 阶段3: 产品化设计 | C | 咨询技术实现方案 |
| 阶段5: 业务实现 | R/A | 实现后端服务,构建业务逻辑 |
| 阶段6: 架构保障 | R/A | 实现架构设计,数据建模 |
| 阶段7: 测试验证 | C | 协助测试,修复Bug |
| 阶段8: 性能优化 | R/A | 优化代码性能,数据库查询 |
| 阶段10: 安全审查 | R/A | 实现安全编码,修复安全漏洞 |
| 阶段11: DevOps配置 | C | 提供部署要求,协助配置 |

### 本技能的核心任务RACI

| 任务 | 本技能 | frontend-engineer | data-engineer | technical-architect | tester |
|------|--------|------------------|---------------|--------------------|--------|
| API接口实现 | R/A | C | C | C | I |
| 数据库实现 | R/A | I | C | C | I |
| 业务逻辑实现 | R/A | I | I | C | I |
| 性能优化 | R/A | I | I | C | C |
| Bug修复 | R/A | C | I | I | C |

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
| API接口不一致 | 低 | 直接协商 |
| 数据模型冲突 | 低 | 直接协商 |
| 性能要求冲突 | 中 | 第三方协调 |
| 架构实现冲突 | 中 | 第三方协调 |
| 技术方案分歧 | 高 | 项目协调器介入 |

### 4级冲突升级路径

#### Level 1: 直接协商(本技能内部)

**适用场景**:

- 冲突严重程度: 低-中
- 冲突类型: API接口不一致、数据模型冲突
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

### Level 2: 第三方协调(相关技能协调)

**适用场景**:

- 冲突严重程度: 中
- 冲突类型: 性能要求冲突、架构实现冲突
- 处理时限: < 15分钟

**协调人选择**:

| 冲突类型 | 推荐协调人 | 原因 |
|----------|-----------|------|
| 性能要求冲突 | system-optimizer | 性能优化专家 |
| 架构实现冲突 | technical-architect | 架构设计权威 |
| 数据模型冲突 | data-engineer | 数据建模专家 |
| 技术方案分歧 | project-coordinator | 项目协调 |

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
- 冲突类型: 技术方案分歧、资源冲突
- 处理时限: < 30分钟

**项目协调器权限**:

- 暂停开发
- 重新分配资源
- 修改技术方案
- 要求重新设计
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
- 冲突类型: 核心技术决策无法达成一致
- 处理时限: 无限制(等待用户决策)

**用户决策选项**:

| 选项 | 说明 | 适用场景 |
|------|------|----------|
| 选项A | 继续当前方案 | 方案基本可行,有小的调整 |
| 选项B | 采用备选方案 | 当前方案有明显缺陷 |
| 选项C | 重新设计 | 方案存在根本性问题 |
| 选项D | 终止项目 | 项目不可行 |

---

## 📝 使用示例

### 示例1：实现用户认证API

**场景描述**：实现用户登录和注册功能

**输入示例**：

```text

请实现用户认证API，包括：

1. 用户注册接口

2. 用户登录接口

3. Token刷新接口

```

**调用方式**：

```bash
invoke skill backend-engineer

```

**输出示例**：

```typescript
// 用户实体
class User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

// 用户服务
class UserService {
  async register(username: string, email: string, password: string): Promise<User>;
  async login(email: string, password: string): Promise<string>;
  async refreshToken(token: string): Promise<string>;
}

```

### 示例2：设计数据库模型

**场景描述**：设计电商系统的数据库模型

**输入示例**：

```text
请设计电商系统的数据库模型，包括：

1. 用户表

2. 商品表

3. 订单表

4. 订单详情表

```

**调用方式**：

```bash
invoke skill backend-engineer

```

**输出示例**：

```typescript
// 数据模型定义
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

```
