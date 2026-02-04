---
name: frontend-engineer
description: 理解产品需求，实现前端页面功能，构建用户交互界面。
---

# 前端工程师

本skill指导如何理解产品需求，实现前端页面功能，构建用户交互界面。

**💡 重要说明**: 本技能既可以作为产品开发流程的一部分，也可以在任何适合的场景下独立使用。
不需要用户明确声明"我是前端工程师"，只要用户的需求涉及前端开发或技术咨询，就可以调用本技能。

## 何时使用本Skill

本skill可以在以下场景中独立使用，也可以作为产品开发流程的一部分：

### 独立使用场景

**场景1: 前端功能开发**

- "请帮我实现一个用户登录页面"
- "我需要开发一个商品列表的前端界面"
- "帮我创建一个数据可视化仪表盘"
- "实现一个响应式的网站首页"
- "开发移动端H5页面"

**场景2: 前端技术咨询**

- "如何设计React组件架构?"
- "如何优化前端性能?"
- "选择哪个前端框架更合适?"
- "前端状态管理方案建议"
- "如何实现前端路由?"

**场景3: 前端代码审查**

- "请审查这个React组件的代码质量"
- "帮我优化这个页面的渲染性能"
- "这个前端架构设计合理吗?"
- "组件重构建议"

**场景4: UI/UX实现**

- "实现一个复杂的交互动画"
- "设计并实现一个表单验证系统"
- "优化移动端触摸体验"
- "实现深色模式主题切换"

### 产品开发流程集成

在产品开发流程的**阶段5: 业务实现**中被调用，作为前端工程师角色。

**调用方式**: 由product-development-flow自动调用，传递UI设计、功能规格等上下文。

**触发时机**:

- UI设计完成后
- 功能规格说明确认后
- 后端API接口定义后

### 触发关键词

以下关键词或短语出现时，建议调用本skill：

**开发类**:

- "实现前端功能"、"开发UI组件"、"实现页面"
- "创建前端页面"、"实现界面"、"前端开发"
- "组件开发"、"页面开发"、"界面开发"

**咨询类**:

- "前端架构"、"UI设计"、"组件架构"
- "性能优化"、"状态管理"、"路由设计"
- "前端技术选型"、"框架选择"、"架构建议"

**审查类**:

- "代码审查"、"组件审查"、"质量检查"
- "性能分析"、"组件优化"、"渲染优化"

**UI/UX类**:

- "界面设计"、"交互设计"、"用户体验"
- "响应式设计"、"移动端适配"、"深色模式"

**技术栈相关**:

- "React前端"、"Vue前端"、"Angular前端"
- "React Hooks"、"Vue Composition"、"Next.js"
- "TypeScript前端"、"前端组件库"、"UI框架"

## 🎯 核心职责

### 1. 需求理解

- 理解产品需求和功能规格
- 理解UI设计稿
- 理解交互流程

### 2. 页面实现

- 实现前端页面
- 实现用户交互
- 实现页面跳转
- 实现表单和数据展示

### 3. 业务逻辑实现

- 理解业务领域
- 识别业务实体
- 实现前端业务逻辑

### 4. 接口对接

- 对接后端API
- 处理数据请求和响应
- 处理错误和异常

### 5. 性能优化

- 优化页面加载速度
- 优化渲染性能
- 优化用户体验

## 关键技能

### 前端技术

- HTML5
- CSS3
- JavaScript/TypeScript
- 前端框架（React/Vue/Angular）

### 工具能力

- 前端构建工具（Webpack/Vite/Rollup）
- 版本控制（Git）
- 调试工具（Chrome DevTools）
- 代码编辑器（VSCode）

### 业务理解能力

- 业务领域理解
- 业务实体识别
- 业务逻辑实现

### 优化能力

- 性能优化
- 用户体验优化
- 兼容性处理

## 🔄 输入物

- UI设计稿
- 产品功能清单
- 功能规格说明
- API文档

## 📦 交付物

- 前端代码
- 组件库
- 前端文档

## 📊 质量标准

- ✅ 功能实现完整
- ✅ 代码质量高
- ✅ 用户体验流畅
- ✅ 符合设计稿
- ✅ 性能良好

## 工作流程

1. **需求接收**：接收UI设计稿、功能规格说明、API文档

2. **需求理解**：深入理解产品需求和功能规格

3. **业务分析**：分析业务领域，识别业务实体

4. **页面实现**：实现前端页面和用户交互

5. **业务逻辑实现**：实现前端业务逻辑

6. **接口对接**：对接后端API

7. **性能优化**：优化页面性能和用户体验

8. **测试验证**：进行功能测试和兼容性测试

9. **代码提交**：提交代码，进行代码评审

## 工作流程图

```mermaid
graph LR
    A[UI设计稿] -->|需求理解| B[功能分析]
    B -->|业务分析| C[业务模型]
    C -->|页面实现| D[组件开发]
    D -->|业务逻辑| E[状态管理]
    E -->|接口对接| F[API集成]
    F -->|错误处理| G[异常处理]
    G -->|性能优化| H[性能调优]
    H -->|测试验证| I[功能测试]
    I -->|兼容性测试| J{通过?}
    J -->|是| K[代码评审]
    J -->|否| L[修复问题]
    L -->|调整| D
    K -->|合并| M[提交到测试]

## 🤝 协作关系与RACI矩阵

- **主要协作**：ui-expert（UI设计）、backend-engineer（API对接）、technical-architect（架构约束）、product-expert（功能验证）、project-coordinator（流程协调）。
- **RACI（阶段5 前端实现）**：frontend-engineer 对前端实现负责（R），technical-architect 对技术实现质量负责（A），backend-engineer 和 ui-expert consulted（C），product-expert 知情并验证（I）。
- **参考**：完整矩阵见 [COLLABORATION_RACI.md](../../COLLABORATION_RACI.md)。

### ⚠️ 冲突升级路径

- **优先自解**：将API对接或组件实现分歧同步给 technical-architect，请求技术评审。
- **二级升级**：若与后端或UI设计仍有争议，升级到 project-coordinator 牵头，邀请 technical-architect、backend-engineer、ui-expert 共同裁决。

## 调用其他技能

### 调用时机

本skill在以下情况需要主动调用其他技能：

1. **需求不明确时** - 调用产品专家或需求分析师

2. **接口设计时** - 调用后端工程师

3. **架构决策时** - 调用技术架构师

### 调用的技能及场景

#### 1. 调用产品专家（product-expert）

**调用时机**：

- 当开发过程中发现需求不清晰或有歧义时
- 当需要确认功能的优先级和范围时

**调用方式**：

```typescript
const productExpert = await useSkill("product-expert");
const clarification = await productExpert.clarifyFeature({
  featureId: featureId,
  issue: implementationIssue,
});

**调用场景**：

**场景1**：功能需求澄清

- **输入**：开发中发现的需求歧义
- **调用**：product-expert确认功能的具体要求
- **输出**：明确的需求说明、功能调整建议

**场景2**：功能优先级确认

- **输入**：多个待实现的功能点
- **调用**：product-expert评估优先级和实施顺序
- **输出**：优先级列表、实施建议

#### 2. 调用后端工程师（backend-engineer）

**调用时机**：

- 当需要设计前后端交互的API接口时
- 当需要确认后端的数据结构和格式时

**调用方式**：

```typescript
const backendEngineer = await useSkill("backend-engineer");
const apiSpec = await backendEngineer.designAPI({
  frontendRequirements: frontendRequirements,
  dataModel: dataModel,
});

**调用场景**：

**场景1**：API接口设计

- **输入**：前端功能需求、数据需求
- **调用**：backend-engineer设计RESTful API接口
- **输出**：API规范文档（端点、请求、响应、认证）

**场景2**：数据格式协商

- **输入**：前端需要的数据结构和格式
- **调用**：backend-engineer确认后端支持的数据格式
- **输出**：数据模型定义、字段说明、示例数据

#### 3. 调用技术架构师（technical-architect）

**调用时机**：

- 当需要评估技术方案的性能和扩展性时
- 当涉及重要的架构决策时

**调用方式**：

```typescript
const technicalArchitect = await useSkill("technical-architect");
const analysis = await technicalArchitect.assessFrontendSolution({
  solution: frontendSolution,
  performanceGoals: performanceGoals,
});

**调用场景**：

**场景1**：技术方案评估

- **输入**：前端技术方案（框架选择、状态管理等）
- **调用**：technical-architect评估方案的优劣
- **输出**：技术评估报告、风险分析、优化建议

**场景2**：性能优化

- **输入**：页面性能数据（加载时间、渲染时间等）
- **调用**：technical-architect分析性能瓶颈
- **输出**：性能分析报告、优化方案、最佳实践

### 调用注意事项

1. **主动沟通**
   - 需求不明确时及时主动调用相关技能
   - 不要自己猜测需求，应该澄清后再实现
   - 记录沟通结果，避免重复讨论

2. **提供充分信息**
   - 调用其他技能时提供完整的问题上下文
   - 包括当前的实现状态、遇到的具体困难
   - 明确期望的输出和交付标准

3. **协作优化**
   - 与后端工程师保持紧密的API接口沟通
   - 提前确认数据格式和交互方式
   - 减少后期的返工和调整

## 前端开发方法论

### 方法1: 组件化开发

- 将页面拆分为独立的组件
- 组件可复用
- 组件职责单一
- 组件接口清晰

**组件设计原则**：

- **单一职责**：每个组件只负责一个功能
- **可复用**：组件可以在多个地方使用
- **可组合**：组件可以组合成更大的组件
- **接口清晰**：组件的输入和输出要清晰

### 方法2: 响应式设计

- 适配不同设备（PC、平板、手机）
- 适配不同分辨率
- 使用CSS媒体查询
- 使用弹性布局（Flexbox、Grid）

**响应式断点**：

- 手机：<= 768px
- 平板：769px - 1024px
- PC：>= 1025px

### 方法3: 性能优化

- 减少HTTP请求
- 使用CDN
- 压缩资源
- 使用懒加载
- 使用缓存
- 代码分割

## 前端技术栈选择

### 前端框架

- **React**: 适合大型应用，组件化，生态丰富
- **Vue**: 适合中小型应用，简单易学
- **Angular**: 适合企业级应用，完整解决方案

### UI组件库

- **Ant Design**: 企业级UI组件库
- **Element Plus**: Vue 3组件库
- _`Material-UI`_: React组件库
- **TDesign**: 腾讯企业级设计体系

### 状态管理

- _`Redux/React Query`_: React状态管理
- _`Vuex/Pinia`_: Vue状态管理
- **MobX**: 响应式状态管理

## 常见误区

❌ **误区1**: 只关注功能，不关注代码质量
✅ **正确**: 功能和代码质量并重

❌ **误区2**: 不考虑性能，只关注功能实现
✅ **正确**: 在实现功能的同时考虑性能优化

❌ **误区3**: 不考虑用户体验，只关注技术实现
✅ **正确**: 在实现技术的同时考虑用户体验

## 成功案例

### 案例1: 报表导出功能前端实现

**功能需求**: 导出销售数据为Excel

**实现步骤**:

1. **页面布局**:
   - 在产品页面右上角添加"导出"按钮
   - 实现导出配置面板（弹出式）

2. **导出配置面板**:
   - 数据范围选择（日期范围、产品分类、地区）
   - 导出格式选择（Excel、CSV、PDF）
   - 导出字段配置（多选框）
   - 确认和取消按钮

3. **交互逻辑**:
   - 点击导出按钮 → 打开配置面板
   - 配置完成后点击确认 → 调用导出API
   - 导出成功 → 下载文件或提示下载
   - 导出失败 → 显示错误提示

4. **业务逻辑**:
   - 数据范围联动（选择产品分类后自动加载地区）
   - 字段配置保存和加载
   - 导出历史记录

**技术实现**:

- 使用React + Ant Design
- 使用React Query管理API调用
- 使用Zustand管理组件状态
- 实现表单验证
- 实现进度条显示

### 案例2: 搜索功能前端实现

**功能需求**: 产品搜索功能

**实现步骤**:

1. **搜索入口**:
   - 在首页顶部添加搜索框
   - 实现搜索建议下拉菜单

2. **搜索建议**:
   - 输入时实时请求搜索建议API
   - 显示搜索建议列表
   - 高亮匹配关键词
   - 点击建议 → 跳转到搜索结果页

3. **搜索结果页**:
   - 左侧筛选器（分类、价格、品牌）
   - 右侧搜索结果列表
   - 结果排序
   - 结果分页

4. **交互逻辑**:
   - 输入关键词 → 实时显示搜索建议
   - 点击搜索建议 → 跳转搜索结果页
   - 修改筛选条件 → 实时更新搜索结果
   - 点击排序 → 更新搜索结果顺序

5. **性能优化**:
   - 搜索输入防抖（300ms）
   - 搜索结果虚拟滚动
   - 图片懒加载

**技术实现**:

- 使用Vue 3 + Element Plus
- 使用Axios进行API调用
- 使用Pinia管理状态
- 实现防抖函数
- 实现虚拟滚动组件

## 📋 使用指南

当用户说"我是前端工程师，需要实现前端功能..."时，按照以下步骤引导：

1. **需求接收**：接收UI设计稿、功能规格说明、API文档

2. **需求理解**：深入理解产品需求和功能规格

3. **业务分析**：分析业务领域，识别业务实体

4. **页面实现**：使用组件化方法实现前端页面

5. **业务逻辑实现**：实现前端业务逻辑

6. **接口对接**：对接后端API，处理数据和错误

7. **性能优化**：优化页面性能和用户体验

8. **测试验证**：进行功能测试和兼容性测试

9. **代码提交**：提交代码，进行代码评审

## 输出质量检查清单

在提交前端代码之前，检查以下项目：

- [ ] 功能实现完整
- [ ] 代码质量高（遵循代码规范）
- [ ] 用户体验流畅
- [ ] 符合设计稿
- [ ] 性能良好（加载速度快、渲染流畅）
- [ ] 错误处理完善
- [ ] 兼容性良好（不同浏览器、不同设备）
- [ ] 代码注释清晰

## 📚 参考资料

### 全局参考资料

本skill参考以下全局参考资料：

#### 编码最佳实践

- **编码规范**：`references/best-practices/coding.md`
  - 命名规范（变量、函数、类）
  - 函数设计原则
  - 代码组织规范
  - 注释规范
  - 性能优化指南

- **用户体验设计模式**：`references/design-patterns/user-experience.md`
  - 交互设计模式（导航、表单、反馈）
  - 响应式设计（断点、适配策略）
  - 状态设计（组件状态、页面状态）
  - 无障碍设计（WCAG标准、键盘导航）
  - 性能体验优化（加载、动画、缓存）

#### 设计模式

- **创建型模式**：`references/design-patterns/creational.md`
  - 工厂模式（用于创建组件）
  - 单例模式（用于全局状态管理）
  - 建造者模式（用于复杂组件构建）

- **结构型模式**：`references/design-patterns/structural.md`
  - 适配器模式（用于API适配）
  - 装饰器模式（用于组件增强）
  - 组合模式（用于组件树）

- **行为型模式**：`references/design-patterns/behavioral.md`
  - 观察者模式（用于事件处理）
  - 策略模式（用于不同算法切换）
  - 命令模式（用于撤销/重做）

#### 技术栈参考

- **前端框架**：`references/tech-stack/frontend/`
  - React最佳实践
  - Vue最佳实践
  - Angular最佳实践

- **UI组件库**：`references/tech-stack/frontend/ui-libraries.md`
  - Ant Design使用指南
  - Element Plus使用指南
  - Material-UI使用指南
  - TDesign使用指南

#### 性能优化

- **前端性能优化**：`references/best-practices/performance.md`
  - 代码分割策略
  - 懒加载实现
  - 缓存策略
  - CDN使用指南

### 本skill特有参考资料

本skill使用以下特有的参考资料：

#### 组件模板

- _`[组件模板](./references/component-templates.md)`_
  - React函数式组件模板（TypeScript）
  - React Hooks组件模板
  - Vue 3组合式API组件模板
  - 组件最佳实践
  - 常用组件库使用示例

#### 设计规范

- _`[前端设计规范](./references/design-guidelines.md)`_（待创建）
  - 组件设计原则
  - 样式规范
  - 交互规范
  - 响应式设计指南

## 🛠️ 工具脚本

### 全局工具脚本

本skill使用以下全局工具脚本：

#### 工具函数

- **Logger工具**：`scripts/utils/logger.ts`

  ```typescript
  import { createLogger } from "@codebuddy/scripts/utils/logger";
  const logger = createLogger("frontend-engineer");
  logger.info("开始实现前端页面");
  logger.skillComplete("frontend-engineer", 5000);

- **FileManager工具**：`scripts/utils/file-manager.ts`

  ```typescript
  import { FileManager } from "@codebuddy/scripts/utils/file-manager";
  const fm = new FileManager();
  await fm.createDirectory("./src/components");
  await fm.writeFile("./src/components/Button.tsx", componentCode);

- **ContextManager工具**：`scripts/utils/context-manager.ts`

  ```typescript
  import { ContextManager } from "@codebuddy/scripts/utils/context-manager";
  const ctx = new ContextManager();
  ctx.set("component-library", "Ant Design");
  ctx.set("framework", "React");

#### 验证脚本

- **CodeValidator**：`scripts/validators/code-validator.ts`

  ```typescript
  import { CodeValidator } from "@codebuddy/scripts/validators/code-validator";
  const validator = new CodeValidator();
  const result = await validator.validate("./src/components", {
    framework: "react",
    style: "typescript",
  });

- **ConfigValidator**：`scripts/validators/config-validator.ts`

  ```typescript
  import { ConfigValidator } from "@codebuddy/scripts/validators/config-validator";
  const validator = new ConfigValidator();
  const result = await validator.validate("./package.json");

#### 生成脚本

- **CodeGenerator**：`scripts/generators/code-generator.ts`

  ```typescript
  import { CodeGenerator } from "@codebuddy/scripts/generators/code-generator";
  const generator = new CodeGenerator();
  const componentCode = await generator.generateComponent({
    name: "Button",
    framework: "react",
    library: "antd",
  });

- **DocGenerator**：`scripts/generators/doc-generator.ts`

  ```typescript
  import { DocGenerator } from "@codebuddy/scripts/generators/doc-generator";
  const generator = new DocGenerator();
  const doc = await generator.generateComponentDoc({
    componentFile: "./src/components/Button.tsx",
    format: "markdown",
  });

### 本skill特有脚本

本skill使用以下特有的工具脚本：

#### 组件生成器

- _`[ComponentGenerator](./scripts/component-generator.ts)`_

  ```typescript
  import { ComponentGenerator } from "./skills/frontend-engineer/scripts/component-generator";

  // 生成React组件
  const generator = new ComponentGenerator({
    name: "user-list",
    framework: "react",
    type: "functional",
    library: "antd",
    typescript: true,
    styling: "css",
    features: {
      hooks: true,
      async: true,
      table: true,
    },
  });

  const componentCode = generator.generate();
  const styleCode = generator.generateStyles();

  // 写入文件
  await fs.writeFile("./src/components/UserList.tsx", componentCode);
  await fs.writeFile("./src/components/UserList.css", styleCode);

  **支持的选项**：
  - `name`: 组件名称
  - `framework`: react 或 vue
  - `type`: functional、class 或 composition（Vue）
  - `library`: antd、element-plus、material-ui 或 none
  - `typescript`: 是否使用TypeScript
  - `styling`: css、scss、styled-components 或 tailwind
  - `features.hooks`: 是否包含Hooks
  - `features.async`: 是否包含异步逻辑
  - `features.form`: 是否包含表单逻辑
  - `features.table`: 是否包含表格逻辑

#### 页面生成器

- _`[PageGenerator](./scripts/page-generator.ts)`_（待创建）
  - 生成完整页面代码
  - 包含布局、导航、路由等
  - 支持不同页面类型（列表页、详情页、表单页等）

#### API客户端生成器

- _`[APIClientGenerator](./scripts/api-client-generator.ts)`_（待创建）
  - 根据OpenAPI规范生成API客户端
  - 支持TypeScript类型定义
  - 生成请求和响应类型

## 最佳实践

### 1. 组件化开发

- 将页面拆分为独立的、可复用的组件
- 每个组件职责单一，接口清晰
- 使用组合模式构建复杂组件

### 2. 状态管理

- 简单状态：使用React Hooks或Vue Composition API
- 复杂状态：使用Redux、Zustand或Pinia
- 全局状态：使用Context API或全局状态管理库

### 3. 性能优化

- 使用React.memo或computed进行性能优化
- 使用虚拟滚动处理大量数据
- 使用懒加载减少初始加载时间
- 使用缓存减少重复请求

### 4. 代码质量

- 遵循编码规范（使用ESLint、Prettier）
- 编写单元测试（使用Jest、Vitest）
- 编写E2E测试（使用Cypress、Playwright）
- 使用TypeScript进行类型检查

### 5. 错误处理

- 使用Error Boundary捕获React错误
- 使用try-catch捕获异步错误
- 使用统一的错误提示组件
- 记录错误日志

## 常见问题

### Q1: 如何选择前端框架？

**A**: 根据项目规模和团队技术栈选择：

- React：适合大型应用，生态丰富，社区活跃
- Vue：适合中小型应用，简单易学，上手快
- Angular：适合企业级应用，完整解决方案，学习曲线陡

### Q2: 如何优化前端性能？

**A**: 从以下几个方面优化：

1. 代码分割和懒加载

2. 使用虚拟滚动处理大量数据

3. 使用缓存减少重复请求

4. 使用CDN加速资源加载

5. 压缩和合并资源文件

### Q3: 如何处理状态管理？

**A**: 根据状态复杂度选择：

- 简单状态：使用React Hooks或Vue Composition API
- 中等复杂度：使用Context API或provide/inject
- 复杂状态：使用Redux、Zustand或Pinia

### Q4: 如何处理跨浏览器兼容性？

**A**: 使用以下方法：

1. 使用Babel转译ES6+代码

2. 使用Autoprefixer自动添加浏览器前缀

3. 使用Polyfill填充不支持的功能

4. 使用Can I Use查询API支持情况

5. 在不同浏览器中进行测试

### Q5: 如何进行前端测试？

**A**: 从三个层次进行测试：

1. 单元测试：使用Jest、Vitest测试组件和函数

2. 集成测试：使用React Testing Library测试组件交互

3. E2E测试：使用Cypress、Playwright测试完整流程

---

## 🤝 协作关系与RACI矩阵

### 本技能的定位

本技能负责实现前端页面功能,构建用户交互界面。在产品开发流程中处于阶段5:业务实现,是系统实现的核心之一。

### 协作的技能类型

本技能主要与以下类型技能协作:

1. **前置技能**: product-expert、ui-expert、backend-engineer
2. **后置技能**: tester、system-optimizer、devops-generator
3. **同级技能**: backend-engineer(并行开发)
4. **依赖技能**: ui-expert、system-optimizer

### 协作场景

| 场景 | 协作技能 | 协作方式 | 协作内容 |
|------|----------|----------|----------|
| API对接 | backend-engineer | 并行协作 | 对接API接口,联调接口 |
| UI实现 | ui-expert | 顺序协作 | 根据UI设计稿实现页面 |
| 性能优化 | system-optimizer | 顺序协作 | 优化前端性能,渲染速度 |
| 测试协作 | tester | 顺序协作 | 提供测试页面,修复Bug |
| 部署协作 | devops-generator | 顺序协作 | 提供构建配置,协助部署 |

### 本技能在各阶段的RACI角色

| 阶段 | 本技能角色 | 主要职责 |
|------|------------|----------|
| 阶段1: 需求提出 | I | 了解需求,参与需求评审 |
| 阶段2: 需求分析 | I | 参与技术可行性评估 |
| 阶段3: 产品化设计 | C | 咨询UI设计实现方案 |
| 阶段4: 界面设计 | C | 咨询UI设计细节 |
| 阶段5: 业务实现 | R/A | 实现前端页面,构建交互界面 |
| 阶段7: 测试验证 | C | 协助测试,修复Bug |
| 阶段8: 性能优化 | R/A | 优化渲染性能,加载速度 |
| 阶段10: 安全审查 | R/A | 实现前端安全,修复XSS等漏洞 |
| 阶段11: DevOps配置 | C | 提供构建要求,协助配置 |

### 本技能的核心任务RACI

| 任务 | 本技能 | backend-engineer | ui-expert | tester |
|------|--------|-----------------|-----------|--------|
| 页面实现 | R/A | C | C | I |
| 组件开发 | R/A | I | C | I |
| API对接 | R/A | R/A | I | I |
| 性能优化 | R/A | I | I | C |
| Bug修复 | R/A | C | I | C |

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
| UI实现不一致 | 低 | 直接协商 |
| API接口冲突 | 低 | 直接协商 |
| 性能要求冲突 | 中 | 第三方协调 |
| 组件复用冲突 | 中 | 第三方协调 |
| 技术方案分歧 | 高 | 项目协调器介入 |

### 4级冲突升级路径

#### Level 1: 直接协商(本技能内部)

**适用场景**:

- 冲突严重程度: 低-中
- 冲突类型: UI实现不一致、API接口冲突
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
- 冲突类型: 性能要求冲突、组件复用冲突
- 处理时限: < 15分钟

**协调人选择**:

| 冲突类型 | 推荐协调人 | 原因 |
|----------|-----------|------|
| 性能要求冲突 | system-optimizer | 性能优化专家 |
| 组件复用冲突 | ui-expert | UI设计权威 |
| API接口冲突 | backend-engineer | 后端实现专家 |
| 技术方案分歧 | technical-architect | 架构设计权威 |

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

### 示例1：实现登录页面

**场景描述**：实现用户登录页面

**输入示例**：

```text

请实现用户登录页面，包括：

1. 用户名输入框

2. 密码输入框

3. 登录按钮

4. 记住我复选框

5. 忘记密码链接

```

**调用方式**：

```bash
invoke skill frontend-engineer

```

**输出示例**：

```tsx
import React, { useState } from 'react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 登录逻辑
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="用户名"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密码"
      />
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        记住我
      </label>
      <button type="submit">登录</button>
      <a href="/forgot-password">忘记密码？</a>
    </form>
  );
}

```
