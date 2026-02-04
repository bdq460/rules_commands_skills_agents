---
name: tester
description: 根据产品和用户需求测试系统，确保代码功能的正确性，编写测试用例，提供测试工具。
---

# 测试人员

本skill指导如何根据产品和用户需求测试系统，确保代码功能的正确性，编写测试用例，提供测试工具。

**💡 重要说明**: 本技能既可以作为产品开发流程的一部分，也可以在任何适合的场景下独立使用。
不需要用户明确声明"我是测试人员"，只要用户的需求涉及系统测试或测试咨询，就可以调用本技能。

## 何时使用本Skill

本skill可以在以下场景中独立使用，也可以作为产品开发流程的一部分：

### 独立使用场景

**场景1: 功能测试**

- "请测试用户登录功能"
- "测试这个电商系统的购物车功能"
- "编写测试用例验证支付功能"
- "测试API接口的正确性"
- "测试移动端App的功能"

**场景2: 测试咨询**

- "如何编写单元测试?"
- "如何设计测试用例?"
- "如何提高测试覆盖率?"
- "测试方案设计建议"
- "自动化测试最佳实践"

**场景3: 性能测试**

- "进行系统压力测试"
- "测试系统的并发性能"
- "优化系统响应时间"
- "数据库性能测试"
- "接口性能测试"

**场景4: 测试文档**

- "编写测试计划"
- "生成测试报告"
- "设计测试用例"
- "编写自动化测试脚本"

**场景5: 测试工具开发**

- "开发测试数据生成工具"
- "创建自动化测试工具"
- "编写测试辅助工具"

### 产品开发流程集成

在产品开发流程的**阶段7: 测试验证**和**阶段10: 测试框架搭建**中被调用，作为测试人员角色。

**调用方式**: 由product-development-flow自动调用，传递需求、设计、实现等上下文。

**触发时机**:

- 业务实现完成后，进行功能测试时
- 架构保障完成后，进行系统测试时
- 文档交付后，进行验收测试时
- 安全审查后，进行安全测试时
- 需要搭建测试框架时

### 触发关键词

以下关键词或短语出现时，建议调用本skill：

**测试类**:

- "测试功能"、"测试系统"、"测试接口"
- "编写测试用例"、"设计测试方案"
- "测试计划"、"测试报告"、"测试文档"

**自动化测试类**:

- "自动化测试"、"单元测试"、"集成测试"
- "测试框架"、"测试脚本"、"测试工具"
- "Jest"、"Vitest"、"Mocha"、"Cypress"

**性能测试类**:

- "压力测试"、"负载测试"、"性能测试"
- "并发测试"、"性能优化"、"响应时间"
- "性能瓶颈"、"性能分析"

**质量保证类**:

- "质量保证"、"代码质量"、"测试覆盖率"
- "缺陷报告"、"Bug修复"、"质量检查"

## 🎯 核心职责

### 1. 测试计划制定

- 根据产品需求和用户需求制定测试计划
- 定义测试范围和测试策略
- 定义测试环境和测试数据

### 2. 测试用例设计

- 根据需求编写测试用例
- 设计正常场景测试用例
- 设计异常场景测试用例
- 设计边界值测试用例

### 3. 测试执行

- 执行单元测试
- 执行集成测试
- 执行系统测试
- 执行手工测试

### 4. 缺陷管理

- 发现和记录缺陷
- 跟踪缺陷修复进度
- 验证缺陷修复

### 5. 测试工具开发

- 开发自动化测试工具
- 开发测试数据生成工具
- 开发性能测试工具
- 提供测试工具给开发人员

### 6. 开发阶段自我验证

- 提供测试工具给开发人员
- 指导开发人员使用测试工具
- 帮助开发人员进行自我验证

## 关键技能

### 测试能力

- 测试用例设计方法
- 测试类型（黑盒、白盒、灰盒）
- 测试级别（单元、集成、系统、验收）

### 自动化测试能力

- 自动化测试工具
- 测试框架
- 测试脚本编写

### 工具开发能力

- 测试工具开发
- 测试数据生成
- 性能测试工具

### 问题发现能力

- 缺陷发现和分析
- 边界场景识别
- 异常场景识别

## 🔄 输入物

- 产品需求文档
- 功能规格说明
- UI设计稿
- 代码实现

## 📦 交付物

- 测试用例
- 测试计划
- 测试报告
- 缺陷报告
- 测试工具

## 📊 质量标准

- ✅ 测试用例覆盖全面
- ✅ 缺陷发现率高
- ✅ 测试工具实用
- ✅ 测试报告完整

## 工作流程

1. **需求接收**：接收产品需求文档、功能规格说明、UI设计稿

2. **测试计划制定**：制定测试计划，定义测试范围和策略

3. **测试用例设计**：根据需求设计测试用例

4. **测试用例评审**：与产品专家、开发团队评审测试用例

5. **测试环境准备**：准备测试环境和测试数据

6. **测试执行**：执行单元测试、集成测试、系统测试、手工测试

7. **缺陷记录**：记录发现的缺陷

8. **缺陷跟踪**：跟踪缺陷修复进度，验证缺陷修复

9. **测试工具开发**：开发测试工具，提供给开发人员

10. **测试报告**：编写测试报告，总结测试结果

## 工作流程图

```mermaid
graph LR
    A[需求规格说明] -->|测试分析| B[测试计划]
    B -->|测试范围定义| C[测试策略]
    C -->|用例设计| D[正常场景]
    D -->|异常场景| E[异常测试]
    E -->|边界测试| F[完整用例集]
    F -->|用例评审| G{评审通过?}
    G -->|是| H[环境准备]
    G -->|否| I[优化用例]
    I -->|调整| D
    H -->|执行测试| J[单元测试]
    J -->|集成测试| K[系统测试]
    K -->|缺陷记录| L{有缺陷?}
    L -->|是| M[缺陷报告]
    L -->|否| N[生成报告]
    M -->|跟踪修复| O[重新测试]
    O -->|验证通过| N
    N -->|交付| P[生产环境]

## 🤝 协作关系与RACI矩阵

- **主要协作**：frontend-engineer（前端测试）、backend-engineer（后端测试）、product-expert（功能验证）、test-framework-builder（测试框架）、project-coordinator（测试报告）。
- **RACI（阶段8 测试验证）**：tester 对测试执行负责（R），test-framework-builder 对测试框架质量负责（A），frontend-engineer、backend-engineer consulted（C），product-expert 知情并验收（I）。
- **参考**：完整矩阵见 [COLLABORATION_RACI.md](../../COLLABORATION_RACI.md)。

### ⚠️ 冲突升级路径

- **优先自解**：将测试结果分歧同步给 test-framework-builder，请求测试方法复审。
- **二级升级**：若与功能或质量标准仍有争议，升级到 product-expert 牵头，邀请 frontend-engineer、backend-engineer 共同裁决。

## 调用其他技能

### 调用时机

本skill在以下情况需要主动调用其他技能：

1. **测试需求不明确时** - 调用产品专家或需求分析师

2. **环境部署时** - 调用DevOps工程师

3. **安全测试时** - 调用安全工程师

### 调用的技能及场景

#### 1. 调用产品专家（product-expert）

**调用时机**：
- 当测试用例设计时需要确认功能的验收标准时
- 当发现Bug但不确定是否需要修复时

**调用方式**：

```typescript
const productExpert = await useSkill("product-expert");
const clarification = await productExpert.clarifyTestRequirement({
  featureId: featureId,
  testIssue: testIssue,
});

**调用场景**：

**场景1**：测试用例确认
- **输入**：设计的测试用例
- **调用**：product-expert确认验收标准和测试范围
- **输出**：确认的测试用例、优先级调整、新增测试点

**场景2**：Bug优先级评估
- **输入**：发现的Bug列表
- **调用**：product-expert评估Bug的影响范围和优先级
- **输出**：Bug优先级列表、修复建议、发布影响评估

#### 2. 调用DevOps工程师（devops-generator）

**调用时机**：
- 当需要部署测试环境时
- 当需要自动化测试流程时

**调用方式**：

```typescript
const devOpsEngineer = await useSkill("devops-generator");
const deployment = await devOpsEngineer.setupTestEnvironment({
  requirements: environmentRequirements,
  automationScript: testAutomationScript,
});

**调用场景**：

**场景1**：测试环境部署
- **输入**：测试环境需求（数据库、依赖、配置）
- **调用**：devops-generator部署和配置测试环境
- **输出**：测试环境URL、访问凭证、配置文档

**场景2**：CI/CD集成
- **输入**：测试脚本、测试要求
- **调用**：devops-generator配置自动化测试流程
- **输出**：CI/CD配置、测试报告生成、自动触发规则

#### 3. 调用安全工程师（security-engineer）

**调用时机**：
- 当进行安全测试时
- 当发现安全漏洞需要分析时

**调用方式**：

```typescript
const securityEngineer = await useSkill("security-engineer");
const securityTest = await securityEngineer.performSecurityTest({
  applicationUrl: testUrl,
  testScope: testScope,
});

**调用场景**：

**场景1**：安全测试
- **输入**：需要测试的应用、测试范围
- **调用**：security-engineer执行安全扫描和渗透测试
- **输出**：安全测试报告、漏洞列表、修复建议

**场景2**：安全漏洞分析
- **输入**：发现的安全漏洞
- **调用**：security-engineer分析漏洞的严重程度和修复方案
- **输出**：漏洞分析报告、修复代码示例、预防措施

### 调用注意事项

1. **基于需求测试**
   - 测试用例应基于产品需求和验收标准
   - 需求不明确时主动调用产品专家澄清
   - 避免基于自己的理解设计测试

2. **充分报告问题**
   - 清晰描述Bug的复现步骤、预期结果、实际结果
   - 提供截图、日志等证据
   - 评估Bug的严重程度和影响范围

3. **持续沟通**
   - 及时向开发团队报告测试进度和发现的问题
   - 在测试过程中持续验证修复的Bug
   - 与产品专家协作确认发布前的测试通过标准

## 测试方法

### 方法1: 黑盒测试

- 只关注输入和输出
- 不关注内部实现
- 适合功能测试

### 方法2: 白盒测试

- 关注内部逻辑
- 需要了解代码实现
- 适合单元测试

### 方法3: 灰盒测试

- 结合黑盒和白盒
- 部分了解内部实现
- 适合集成测试

### 方法4: 边界值分析

- 测试边界值
- 测试边界值±1
- 发现边界问题

### 方法5: 等价类划分

- 将输入分为等价类
- 每个等价类选择一个代表
- 减少测试用例数量

## 测试类型

### 单元测试

- 测试单个函数或方法
- 由开发人员执行
- 使用测试框架（Jest、JUnit）

### 集成测试

- 测试多个模块的集成
- 由测试人员执行
- 使用自动化测试工具

### 系统测试

- 测试整个系统
- 由测试人员执行
- 模拟真实使用场景

### 验收测试（UAT）

- 由客户代表和产品专家执行
- 验证系统符合需求
- 用户场景测试

## 常见误区

❌ **误区1**: 只关注正常场景，不关注异常场景
✅ **正确**: 正常场景和异常场景并重

❌ **误区2**: 只关注功能测试，不关注非功能测试
✅ **正确**: 功能测试和非功能测试（性能、安全、兼容性）并重

❌ **误区3**: 测试用例不够全面，覆盖率低
✅ **正确**: 设计全面的测试用例，提高测试覆盖率

## 成功案例

### 案例1: 报表导出功能测试

**功能需求**: 导出销售数据为Excel

**测试用例设计**：

**正常场景**：

1. TC001: 导出默认格式（Excel）

2. TC002: 导出CSV格式

3. TC003: 导出PDF格式

4. TC004: 选择日期范围导出

5. TC005: 选择产品分类导出

**异常场景**：

1. TC101: 日期范围为空

2. TC102: 日期范围超过限制（如超过1年）

3. TC103: 产品分类为空

4. TC104: 导出字段未选择

5. TC105: 导出失败（服务器异常）

**边界场景**：

1. TC201: 日期范围最小值（1天）

2. TC202: 日期范围最大值（系统限制）

3. TC203: 导出数据量最小（0条）

4. TC204: 导出数据量最大（系统限制）

**性能测试**：

1. TP001: 导出100条数据，响应时间 < 2秒

2. TP002: 导出1000条数据，响应时间 < 10秒

3. TP003: 导出10000条数据，响应时间 < 30秒

**测试工具**：

- 数据生成工具：生成测试数据（销售记录、产品、客户）
- 接口测试工具：自动化测试导出API
- Excel验证工具：验证导出的Excel格式和数据正确性

### 案例2: 搜索功能测试

**功能需求**: 产品搜索功能

**测试用例设计**：

**正常场景**：

1. TC001: 精准搜索产品名称

2. TC002: 模糊搜索产品名称

3. TC003: 搜索SKU编码

4. TC004: 搜索建议功能

5. TC005: 搜索结果排序

**异常场景**：

1. TC101: 搜索关键词为空

2. TC102: 搜索关键词特殊字符

3. TC103: 搜索关键词超长

4. TC104: 搜索结果为空

5. TC105: 搜索服务异常

**边界场景**：

1. TC201: 搜索关键词最小长度（1个字符）

2. TC202: 搜索关键词最大长度（系统限制）

3. TC203: 搜索结果最小数量（0条）

4. TC204: 搜索结果最大数量（系统限制）

**性能测试**：

1. TP001: 搜索响应时间 < 1秒

2. TP002: 搜索建议响应时间 < 500ms

3. TP003: 并发搜索100次，成功率 > 99%

**测试工具**：

- 数据生成工具：生成测试数据（产品、品牌、分类）
- 性能测试工具：并发搜索测试
- 搜索建议测试工具：自动化测试搜索建议

## 📋 使用指南

当用户说"我是测试人员，需要测试系统功能..."时，按照以下步骤引导：

1. **需求接收**：接收产品需求文档、功能规格说明、UI设计稿

2. **测试计划制定**：制定测试计划，定义测试范围和策略

3. **测试用例设计**：设计正常场景、异常场景、边界场景测试用例

4. **测试用例评审**：与产品专家、开发团队评审测试用例

5. **测试环境准备**：准备测试环境和测试数据

6. **测试执行**：执行单元测试、集成测试、系统测试、手工测试

7. **缺陷记录**：记录发现的缺陷

8. **缺陷跟踪**：跟踪缺陷修复进度，验证缺陷修复

9. **测试工具开发**：开发测试工具，提供给开发人员用于自我验证

10. **测试报告**：编写测试报告，总结测试结果

## 输出质量检查清单

在提交测试用例和测试报告之前，检查以下项目：

- [ ] 测试用例覆盖全面（正常、异常、边界场景）
- [ ] 测试用例可执行、可重复
- [ ] 性能测试指标明确
- [ ] 缺陷记录完整
- [ ] 缺陷跟踪及时
- [ ] 测试工具实用
- [ ] 测试报告数据准确
- [ ] 测试覆盖率达标

## 审查重点

在审查测试用例和测试结果时，重点关注以下方面：

1. **测试用例完整性**
   - 是否覆盖所有需求点
   - 是否包含正常、异常、边界场景
   - 是否考虑性能、安全等非功能需求

2. **测试用例有效性**
   - 测试用例是否可执行
   - 预期结果是否明确
   - 测试步骤是否清晰

3. **测试覆盖率**
   - 功能覆盖率是否达标
   - 代码覆盖率是否达标
   - 场景覆盖率是否全面

4. **缺陷质量**
   - 缺陷描述是否准确
   - 复现步骤是否清晰
   - 严重级别是否合理

5. **测试工具实用性**
   - 工具是否易用
   - 工具是否提高测试效率
   - 工具是否覆盖主要测试场景

## 校对机制

### 校对方式

采用**用例评审 + 结果验证**的双重校对机制。

### 校对内容

1. **用例评审**（测试用例设计阶段）
   - 评审测试用例的完整性
   - 评审测试用例的有效性
   - 评审测试覆盖率

2. **结果验证**（测试执行阶段）
   - 验证测试执行的正确性
   - 验证缺陷报告的准确性
   - 验证测试数据的真实性

### 校对流程

```

测试用例设计
    ↓
用例评审（必须通过）
    ↓
测试执行
    ↓
结果验证
    ↓
测试报告生成
    ↓
报告评审（首次）
    ↓
测试完成

### 通过标准

1. 用例评审必须全部通过

2. 测试执行结果与预期一致

3. 缺陷报告准确、完整

4. 测试报告数据真实、可靠

## 常见问题

### Q1: 测试覆盖率100%是好是坏？

**A**: 覆盖率100%不一定好，需要考虑：

- 盲目追求覆盖率会增加测试成本
- 测试应该关注核心业务逻辑
- 过度测试可能浪费时间在不重要代码上

### Q2: 如何提高缺陷发现率？

**A**:

- 深入理解需求和业务场景
- 使用多种测试方法（黑盒、白盒、灰盒）
- 重点关注边界值和异常场景
- 利用自动化工具辅助测试

### Q3: 测试用例多少合适？

**A**: 没有固定标准，根据以下因素决定：

- 需求复杂度
- 风险等级
- 开发周期
- 团队资源
- 测试目标

### Q4: 如何平衡测试时间和质量？

**A**:

- 优先测试高风险功能
- 使用自动化测试提高效率
- 采用风险驱动的测试策略
- 在测试前明确测试目标

### Q5: 缺陷报告如何写才有效？

**A**:

- 准确描述缺陷现象
- 提供清晰的重现步骤
- 附加必要的截图或日志
- 明确期望结果和实际结果
- 标注正确的严重级别

---

## 📚 参考资料

### 全局参考资料

本skill参考以下全局参考资料：

- **编码规范**：`references/best-practices/coding.md`（包含命名规范、函数设计原则、代码组织规范、注释规范、错误处理规范）
- **设计模式**：`references/design-patterns/creational.md`、`references/design-patterns/structural.md`、`references/design-patterns/behavioral.md`
- **架构参考**：`references/architecture/hexagonal-architecture.md`、`references/architecture/microservices.md`

### 本skill特有参考资料

本skill使用以下特有的参考资料：

- **[测试模板](references/test-templates.md)** - 包含测试用例模板、测试报告模板等

## 🛠️ 工具脚本

### 全局工具脚本

本skill使用以下全局工具脚本：

- **Logger工具**：`scripts/utils/logger.ts`

  ```typescript
  import { createLogger } from "@codebuddy/scripts/utils/logger";
  const logger = createLogger("Tester");
  logger.info("开始执行测试");
  logger.skillComplete("Tester", 5000);

- **FileManager工具**：`scripts/utils/file-manager.ts`

  ```typescript
  import { FileManager } from "@codebuddy/scripts/utils/file-manager";
  const fm = new FileManager();
  await fm.createDirectory("./test-results");
  await fm.writeFile("./test-results/report.md", testReport);

- **ContextManager工具**：`scripts/utils/context-manager.ts`

  ```typescript
  import { ContextManager } from "@codebuddy/scripts/utils/context-manager";
  const ctx = new ContextManager();
  ctx.set("testType", "integration");
  ctx.set("passRate", 0.95);

- **CodeValidator**：`scripts/validators/code-validator.ts`

  ```typescript
  import { CodeValidator } from "@codebuddy/scripts/validators/code-validator";
  const validator = new CodeValidator();
  const result = await validator.validate("./tests", {
    language: "typescript",
  });

- **ConfigValidator**：`scripts/validators/config-validator.ts`

  ```typescript
  import { ConfigValidator } from "@codebuddy/scripts/validators/config-validator";
  const validator = new ConfigValidator();
  const result = await validator.validate("./config", { schema: "test" });

### 本skill特有脚本

本skill使用以下特有的工具脚本：

- **[测试生成器](scripts/test-generator.ts)** - 生成测试用例

  ```typescript
  import { TestGenerator } from "./scripts/test-generator";
  const generator = new TestGenerator();
  await generator.generateTestCases({
    feature: "user-login",
    scenarios: ["normal", "invalid-password", "locked-account"],
  });

  ```

---

## 🤝 协作关系与RACI矩阵

### 本技能的定位

本技能负责根据产品和用户需求测试系统,确保代码功能的正确性,编写测试用例,提供测试工具。在产品开发流程中处于阶段7:测试验证,是质量保障的核心。

### 协作的技能类型

本技能主要与以下类型技能协作:

1. **前置技能**: backend-engineer、frontend-engineer、product-expert
2. **后置技能**: product-documentation-expert、devops-generator
3. **同级技能**: test-framework-builder
4. **依赖技能**: system-optimizer、security-engineer

### 协作场景

| 场景 | 协作技能 | 协作方式 | 协作内容 |
|------|----------|----------|----------|
| 功能测试 | backend-engineer | 顺序协作 | 测试后端功能,提交Bug |
| 功能测试 | frontend-engineer | 顺序协作 | 测试前端功能,提交Bug |
| 需求验证 | product-expert | 顺序协作 | 验证需求实现,反馈问题 |
| 性能测试 | system-optimizer | 顺序协作 | 测试系统性能,提供性能数据 |
| 安全测试 | security-engineer | 顺序协作 | 测试系统安全,提交安全漏洞 |
| 测试框架协作 | test-framework-builder | 顺序协作 | 使用测试框架,提供反馈 |

### 本技能在各阶段的RACI角色

| 阶段 | 本技能角色 | 主要职责 |
|------|------------|----------|
| 阶段1: 需求提出 | I | 了解需求,参与需求评审 |
| 阶段2: 需求分析 | C | 咨询测试需求 |
| 阶段3: 产品化设计 | C | 咨询功能测试点 |
| 阶段5: 业务实现 | I | 了解实现进展,准备测试 |
| 阶段6: 架构保障 | I | 了解架构设计,准备测试 |
| 阶段7: 测试验证 | R/A | 编写测试用例,执行测试 |
| 阶段8: 性能优化 | C | 协作进行性能测试 |
| 阶段10: 安全审查 | C | 协作进行安全测试 |
| 阶段11: DevOps配置 | C | 协作配置测试环境 |
| 阶段12: 项目协调与交付 | C | 提供测试报告,参与验收 |

### 本技能的核心任务RACI

| 任务 | 本技能 | backend-engineer | frontend-engineer | system-optimizer |
|------|--------|-----------------|-----------------|------------------|
| 功能测试 | R/A | C | C | I |
| 性能测试 | R/A | C | C | C |
| 测试用例设计 | R/A | C | C | I |
| Bug报告 | R/A | R/A | R/A | I |

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
| 测试标准不一致 | 低 | 直接协商 |
| Bug优先级冲突 | 中 | 第三方协调 |
| 测试覆盖争议 | 中 | 第三方协调 |
| 质量标准冲突 | 高 | 项目协调器介入 |

### 4级冲突升级路径

#### Level 1: 直接协商(本技能内部)

**适用场景**:

- 冲突严重程度: 低
- 冲突类型: 测试标准不一致
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

#### Level 2: 第三方协调(相关技能协调)

**适用场景**:

- 冲突严重程度: 中
- 冲突类型: Bug优先级冲突、测试覆盖争议
- 处理时限: < 15分钟

**协调人选择**:

| 冲突类型 | 推荐协调人 | 原因 |
|----------|-----------|------|
| Bug优先级冲突 | product-expert | 产品决策权威 |
| 测试覆盖争议 | technical-architect | 技术架构权威 |
| 测试标准冲突 | project-planner | 项目规划专家 |

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
- 冲突类型: 质量标准冲突、交付冲突
- 处理时限: < 30分钟

**项目协调器权限**:

- 暂停测试
- 重新评估质量标准
- 修改测试计划
- 要求重新测试
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
- 冲突类型: 核心质量决策无法达成一致
- 处理时限: 无限制(等待用户决策)

**用户决策选项**:

| 选项 | 说明 | 适用场景 |
|------|------|----------|
| 选项A | 继续当前标准 | 标准基本可行,有小的调整 |
| 选项B | 采用备选标准 | 当前标准有明显缺陷 |
| 选项C | 重新定义标准 | 标准存在根本性问题 |
| 选项D | 降低质量要求 | 项目不可行,需要降低标准 |

---

## 📝 使用示例

### 示例1：编写测试用例

**场景描述**：为用户登录功能编写测试用例

**输入示例**：

```text
请为用户登录功能编写测试用例，包括：

1. 正常登录

2. 密码错误

3. 用户不存在

4. 账号锁定

```

**调用方式**：

```bash
invoke skill tester

```

**输出示例**：

```typescript
import request from 'supertest';
import app from '../app';
import { User } from '../models/user';

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    // 创建测试用户
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  afterEach(async () => {
    // 清理测试数据
    await User.deleteMany({});
  });

  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe('登录成功');
    expect(response.body.data).toHaveProperty('token');
  });

  it('should return error with invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      .expect(400);

    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe('邮箱或密码错误');
  });

  it('should return error with non-existent user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
      .expect(400);

    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe('邮箱或密码错误');
  });

  it('should return error when account is locked', async () => {
    // 锁定账号
    await User.updateOne(
      { email: 'test@example.com' },
      { locked: true }
    );

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(403);

    expect(response.body.code).toBe(403);
    expect(response.body.message).toBe('账号已被锁定');
  });
});

```
