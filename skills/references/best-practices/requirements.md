# 需求最佳实践

本文档说明如何有效地收集、分析、编写和管理软件需求。

## 需求收集

### 1. 与利益相关者沟通

#### 干系人识别

```markdown
## 项目干系人

| 角色 | 姓名 | 职责 | 影响力 |
|------|------|--------|--------|
| 客户 | 张三 | 提出需求 | 高 |
| 产品经理 | 李四 | 需求评审 | 高 |
| 技术负责人 | 王五 | 技术可行性 | 中 |
| UI设计师 | 赵六 | 用户体验 | 中 |
| 测试工程师 | 钱七 | 测试验证 | 中 |
| 最终用户 |  | 实际使用系统 | 高 |
```

#### 沟通策略

```markdown
## 沟通策略

### 访谈
- 一对一访谈（深入了解）
- 小组讨论（收集意见）
- 问卷调查（广泛收集）

### 用户研究
- 用户观察（了解实际行为）
- 用户测试（验证设计）
- 数据分析（支持决策）

### 原型设计
- 线框图（快速迭代）
- 交互原型（测试流程）
- 高保真原型（最终确认）
```

### 访谈技巧

```typescript
// 访谈准备
interface InterviewPreparation {
  questions: Question[];
  stakeholders: Stakeholder[];
  goal: string;
}

// 开放式问题
const openEndedQuestions = [
  '请描述您当前的工作流程',
  '您在使用现有系统时遇到的最大挑战是什么？',
  '如果可以改进任何方面，您希望是什么？',
];

// 封闭式问题
const closedQuestions = [
  '您每天需要进行多少次该操作？',
  '是否有其他系统需要与当前系统集成？',
  '您对响应时间有什么期望？',
];

// 访谈技巧
class InterviewSession {
  private notes: string[] = [];

  start(stakeholder: Stakeholder): void {
    console.log(`Starting interview with ${stakeholder.name}`);
    console.log(`Role: ${stakeholder.role}`);
    console.log(`Expectations: ${stakeholder.expectations}`);
  }

  ask(question: string): void {
    // 提问
    const response = this.prompt(question);
    
    // 记录回答
    this.notes.push({
      question,
      response,
      timestamp: new Date(),
    });

    // 澄清或追问
    if (response.needsClarification) {
      const followUp = this.askFollowUp(question, response);
      this.notes.push(followUp);
    }
  }

  private prompt(question: string): InterviewResponse {
    // 实际的提示逻辑
    return { /`...`/ };
  }

  private askFollowUp(question: string, response: InterviewResponse): FollowUpResponse {
    // 追问逻辑
    return { /`...`/ };
  }
}
```

---

## 需求分析

### 2. 需求分类

#### MoSCoW 方法

```typescript
// 需求优先级管理
enum MoSCoWPriority {
  MUST = 'Must have',     // 必须有
  SHOULD = 'Should have',   // 应该有
  COULD = 'Could have',     // 可以有
  WON_T = 'Won\'t have',   // 不会有
}

interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: MoSCoWPriority;
  stakeholder: string;
  estimatedEffort: number;
}

// 需求集合
const requirements: Requirement[] = [
  {
    id: 'REQ-001',
    title: '用户注册功能',
    description: '用户能够注册账号并登录系统',
    priority: MoSCoWPriority.MUST,
    stakeholder: '客户',
    estimatedEffort: 5, // 人天
  },
  {
    id: 'REQ-002',
    title: '用户资料管理',
    description: '用户能够查看和编辑个人资料',
    priority: MoSCoWPriority.MUST,
    stakeholder: '客户',
    estimatedEffort: 3,
  },
  {
    id: 'REQ-003',
    title: '数据导出功能',
    description: '用户能够导出数据为 Excel 文件',
    priority: MoSCoWPriority.SHOULD,
    stakeholder: '客户',
    estimatedEffort: 4,
  },
  {
    id: 'REQ-004',
    title: '高级搜索功能',
    description: '支持模糊搜索和多条件组合搜索',
    priority: MoSCoWPriority.COULD,
    stakeholder: '客户',
    estimatedEffort: 6,
  },
  {
    id: 'REQ-005',
    title: '系统通知功能',
    description: '通过短信和邮件通知用户重要事件',
    priority: MoSCoWPriority.WON_T,
    stakeholder: '客户',
    estimatedEffort: 8,
  },
];

// MoSCoW 分析工具
class MoSCoWAnalyzer {
  analyze(requirements: Requirement[]): MoSCoWAnalysis {
    const mustHave = requirements.filter(r => r.priority === MoSCoWPriority.MUST);
    const shouldHave = requirements.filter(r => r.priority === MoSCoWPriority.SHOULD);
    const couldHave = requirements.filter(r => r.priority === MoSCoWPriority.COULD);
    const wontHave = requirements.filter(r => r.priority === MoSCoWPriority.WON_T);

    return {
      mustHaveCount: mustHave.length,
      mustHaveEffort: mustHave.reduce((sum, r) => sum + r.estimatedEffort, 0),
      
      shouldHaveCount: shouldHave.length,
      shouldHaveEffort: shouldHave.reduce((sum, r) => sum + r.estimatedEffort, 0),
      
      couldHaveCount: couldHave.length,
      couldHaveEffort: couldHave.reduce((sum, r) => sum + r.estimatedEffort, 0),
      
      totalEffort: requirements.reduce((sum, r) => sum + r.estimatedEffort, 0),
      
      breakdown: this.calculateBreakdown(mustHave, shouldHave, couldHave),
    };
  }

  private calculateBreakdown(...groups: Requirement[][]): EffortBreakdown {
    return {
      // MVP (Minimum Viable Product)
      minimum: groups[0].reduce((sum, r) => sum + r.estimatedEffort, 0),
      
      // 推荐版本
      recommended: groups[0].reduce((sum, r) => sum + r.estimatedEffort, 0) +
                    groups[1].reduce((sum, r) => sum + r.estimatedEffort, 0),
      
      // 完整版本
      full: groups[0].reduce((sum, r) => sum + r.estimatedEffort, 0) +
                groups[1].reduce((sum, r) => sum + r.estimatedEffort, 0) +
                groups[2].reduce((sum, r) => sum + r.estimatedEffort, 0),
    };
  }
}

// 使用示例
const analyzer = new MoSCoWAnalyzer();
const analysis = analyzer.analyze(requirements);

console.log('=== MoSCoW 分析 ===');
console.log(`Must have: ${analysis.mustHaveCount} 个，${analysis.mustHaveEffort} 人天`);
console.log(`Should have: ${analysis.shouldHaveCount} 个，${analysis.shouldHaveEffort} 人天`);
console.log(`Could have: ${analysis.couldHaveCount} 个，${analysis.couldHaveEffort} 人天`);
console.log(`总工作量: ${analysis.totalEffort} 人天`);

console.log('\n=== 分阶段实施计划 ===');
console.log(`MVP: ${analysis.breakdown.minimum} 人天`);
console.log(`推荐版本: ${analysis.breakdown.recommended} 人天`);
console.log(`完整版本: ${analysis.breakdown.full} 人天`);
```

#### Kano 模型

```typescript
// Kano 模型：基于用户满意度评估需求价值
enum KanoCategory {
  DELIGHTERS = 'Delighters',  // 兴奋型
  PERFORMANCE = 'Performance',  // 性能型
  BASIC = 'Basic',             // 基本型
  INDIFFERENT = 'Indifferent', // 无差别型
}

interface KanoSurvey {
  requirementId: string;
  category: KanoCategory;
  reason: string;
}

// Kano 调查
class KanoModel {
  categorize(surveys: KanoSurvey[]): KanoAnalysis {
    const categories: Record<KanoCategory, KanoSurvey[]> = {
      [KanoCategory.DELIGHTERS]: [],
      [KanoCategory.PERFORMANCE]: [],
      [KanoCategory.BASIC]: [],
      [KanoCategory.INDIFFERENT]: [],
    };

    for (const survey of surveys) {
      categories[survey.category].push(survey);
    }

    return {
      ...categories,
      priorityOrder: [
        KanoCategory.DELIGHTERS,
        KanoCategory.PERFORMANCE,
        KanoCategory.BASIC,
        KanoCategory.INDIFFERENT,
      ],
    };
  }

  calculateSatisfactionIndex(surveys: KanoSurvey[]): SatisfactionScore {
    const categories = this.categorize(surveys);
    
    // 计算满意度指数
    let score = 0;
    score += categories[KanoCategory.DELIGHTERS].length * 2;
    score += categories[KanoCategory.PERFORMANCE].length * 1;
    score += categories[KanoCategory.BASIC].length * 0.5;
    score += categories[KanoCategory.INDIFFERENT].length * 0;

    return {
      score,
      maxScore: surveys.length * 2,
      percentage: (score / (surveys.length `2))` 100,
    };
  }
}

// 使用示例
const kanoSurveys: KanoSurvey[] = [
  { requirementId: 'REQ-001', category: KanoCategory.DELIGHTERS, reason: '非常实用的功能' },
  { requirementId: 'REQ-002', category: KanoCategory.DELIGHTERS, reason: '超出预期' },
  { requirementId: 'REQ-003', category: KanoCategory.PERFORMANCE, reason: '提升工作效率' },
  { requirementId: 'REQ-004', category: KanoCategory.BASIC, reason: '基本需要' },
  { requirementId: 'REQ-005', category: KanoCategory.INDIFFERENT, reason: '无所谓' },
];

const kanoModel = new KanoModel();
const analysis = kanoModel.categorize(kanoSurveys);
const satisfaction = kanoModel.calculateSatisfactionIndex(kanoSurveys);

console.log('=== Kano 分析 ===');
console.log(`兴奋型功能: ${analysis[KanoCategory.DELIGHTERS].length} 个`);
console.log(`性能型功能: ${analysis[KanoCategory.PERFORMANCE].length} 个`);
console.log(`基本型功能: ${analysis[KanoCategory.BASIC].length} 个`);
console.log(`无差别型功能: ${analysis[KanoCategory.INDIFFERENT].length} 个`);
console.log(`\n满意度指数: ${satisfaction.score}/${satisfaction.maxScore}`);
console.log(`满意度百分比: ${satisfaction.percentage.toFixed(1)}%`);
```

---

## 需求规格说明

### 3. 用户故事

#### 用户故事模板

```markdown
## 用户故事标准格式

**标题**：[用户故事标题]

**格式**：作为一个[角色]，我想要[功能]，以便[目的]

**描述**：
- **角色**：谁使用这个功能
- **功能**：用户想要什么
- **目的**：为什么需要这个功能

**验收标准**：
- [验收条件 1]
- [验收条件 2]
- [验收条件 3]

**优先级**：[Must have / Should have / Could have]

**估算**：[故事点数]

---

## 示例

### 1. 数据导出功能

**标题**：导出销售数据为 Excel

**用户故事**：作为一个销售员，我想要导出我的销售数据为 Excel 文件，以便给财务部门提供报表。

**描述**：
- **角色**：销售员
- **功能**：导出数据为 Excel 文件
- **目的**：给财务部门提供报表

**验收标准**：
- [ ] 可以选择日期范围
- [ ] 可以选择产品分类
- [ ] 可以选择导出字段
- [ ] Excel 文件格式正确
- [ ] 支持大数据量导出（后台任务）

**优先级**：Should have

**估算**：3 故事点

**依赖**：
- 数据导出后端 API
- Excel 生成库

---

### 2. 高级搜索功能

**标题**：多条件组合搜索

**用户故事**：作为一个用户，我想要同时按产品名称、分类和价格范围搜索产品，以便快速找到我想要的产品。

**描述**：
- **角色**：用户
- **功能**：多条件组合搜索
- **目的**：快速找到目标产品

**验收标准**：
- [ ] 支持产品名称搜索
- [ ] 支持分类筛选
- [ ] 支持价格范围筛选
- [ ] 搜索结果实时更新
- [ ] 支持搜索历史记录
- [ ] 支持保存搜索条件

**优先级**：Could have

**估算**：2 故事点

**依赖**：
- 搜索后端 API
- Elasticsearch 或类似搜索引擎

---

### 3. 用户注册流程

**标题**：完成用户注册并登录

**用户故事**：作为一个新用户，我想要通过邮箱注册账号并完成邮箱验证，以便开始使用系统。

**描述**：
- **角色**：新用户
- **功能**：用户注册和登录
- **目的**：创建账号并开始使用系统

**验收标准**：
- [ ] 可以填写注册表单（邮箱、密码、姓名）
- [ ] 密码强度验证
- [ ] 邮箱格式验证
- [ ] 发送验证邮件
- [ ] 点击邮件链接完成验证
- [ ] 验证后自动登录
- [ ] 邮箱未验证时提醒重发

**优先级**：Must have

**估算**：1 故事点

**依赖**：
- 用户管理后端 API
- 邮件发送服务
```

### 用户故事管理

```typescript
// 用户故事数据结构
interface UserStory {
  id: string;
  title: string;
  description: string;
  actor: string;
  feature: string;
  benefit: string;
  acceptanceCriteria: string[];
  priority: MoSCoWPriority;
  estimate: number; // 故事点
  dependencies: string[];
  status: 'backlog' | 'in-progress' | 'completed';
}

// 用户故事仓库
class UserStoryRepository {
  private stories: Map<string, UserStory> = new Map();

  addStory(story: UserStory): void {
    this.stories.set(story.id, story);
  }

  getStory(id: string): UserStory | undefined {
    return this.stories.get(id);
  }

  getAllStories(): UserStory[] {
    return Array.from(this.stories.values());
  }

  getStoriesByPriority(priority: MoSCoWPriority): UserStory[] {
    return this.getAllStories()
      .filter(story => story.priority === priority)
      .sort((a, b) => a.estimate - b.estimate); // 按估算排序
  }

  updateStatus(id: string, status: UserStory['status']): void {
    const story = this.stories.get(id);
    if (story) {
      story.status = status;
      this.stories.set(id, story);
    }
  }
}

// 使用示例
const repository = new UserStoryRepository();

// 添加用户故事
repository.addStory({
  id: 'US-001',
  title: '数据导出功能',
  description: '作为一个销售员，我想要导出我的销售数据为 Excel 文件，以便给财务部门提供报表。',
  actor: '销售员',
  feature: '导出数据为 Excel 文件',
  benefit: '给财务部门提供报表',
  acceptanceCriteria: [
    '可以选择日期范围',
    '可以选择产品分类',
    '可以选择导出字段',
    'Excel 文件格式正确',
    '支持大数据量导出',
  ],
  priority: MoSCoWPriority.SHOULD,
  estimate: 3,
  dependencies: ['API-001', 'LIB-001'],
  status: 'backlog',
});

// 获取高优先级故事
const highPriorityStories = repository.getStoriesByPriority(MoSCoWPriority.MUST);

console.log(`高优先级故事数量: ${highPriorityStories.length}`);
```

---

## 需求验证

### 4. 需求质量标准

#### SMART 原则

```markdown
## 需求质量检查清单

### SMART 原则
- [ ] **S**pecific（具体的）：需求描述清楚明确
- [ ] **M**easurable（可衡量的）：有明确的验收标准
- [ ] **A**chievable（可实现的）：技术上可行
- [ ] **R**elevant（相关的）：与项目目标相关
- [ ] **T**ime-bound（有时限的）：有明确的完成时间

### 完整性检查
- [ ] **功能完整性**：覆盖所有业务场景
- [ ] **一致性检查**：与其他需求无冲突
- [ ] **可测试性**：可以编写测试用例
- [ ] **用户价值**：明确用户收益
- [ ] **技术可行性**：技术团队已评估
- [ ] **资源评估**：有明确的工时估算
- [ ] **依赖关系**：明确需求间的依赖
```

#### 需求评审流程

```typescript
// 需求评审流程
interface RequirementReview {
  id: string;
  title: string;
  description: string;
  priority: MoSCoWPriority;
  category: 'functional' | 'non-functional';
  feasibility: 'high' | 'medium' | 'low';
  risks: Risk[];
}

class RequirementReviewProcess {
  // 步骤1：需求收集
  collectRequirements(stakeholders: Stakeholder[]): void {
    for (const stakeholder of stakeholders) {
      this.conductInterview(stakeholder);
    }
  }

  // 步骤2：需求分析
  analyzeRequirements(requirements: Requirement[]): void {
    // MoSCoW 分析
    const moscowAnalysis = this.runMoSCoW(requirements);
    
    // Kano 分析
    const kanoAnalysis = this.runKano(requirements);
    
    // 技术可行性评估
    const feasibilityAnalysis = this.assessFeasibility(requirements);
    
    // 依赖关系分析
    const dependencyAnalysis = this.analyzeDependencies(requirements);
  }

  // 步骤3：需求优先级
  prioritizeRequirements(analyses: ReviewAnalyses): Requirement[] {
    // 综合多个分析结果
    return requirements.map(req => ({
      ...req,
      finalPriority: this.calculateFinalPriority(req, analyses),
    }));
  }

  // 步骤4：需求验证
  validateRequirements(requirements: Requirement[]): ValidationResult {
    const errors: string[] = [];
    
    for (const req of requirements) {
      // SMART 检查
      if (!this.isSMART(req)) {
        errors.push(`需求 ${req.id} 不符合 SMART 原则`);
      }
      
      // 可测试性检查
      if (!this.isTestable(req)) {
        errors.push(`需求 ${req.id} 无法编写测试用例`);
      }
      
      // 技术可行性检查
      if (req.feasibility === 'low') {
        errors.push(`需求 ${req.id} 技术可行性低，建议重新评估`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
```

---

## 需求文档结构

### 5. 需求规格说明书（SRS）

#### SRS 模板

```markdown
# 需求规格说明书

## 文档信息
- 文档版本：1.0
- 编写日期：2024-01-01
- 编写人员：[姓名]
- 审核人员：[姓名]
- 批准人员：[姓名]

## 1. 引言
### 1.1 编写目的
本文档的编写目的是明确 [项目名称] 的需求，作为开发和测试的基础。

### 1.2 项目范围
包含：
- 在范围：[明确的功能]
- 不在范围：[明确排除的功能]

## 2. 总体描述
[项目总体描述]

## 3. 功能需求
### 3.1 [功能模块 1]
#### [用户故事 1]
作为 [角色]，我想要 [功能]，以便 [目的]。

**验收标准**：
- [ ] [标准 1]
- [ ] [标准 2]
- [ ] [标准 3]

**优先级**：[Must have / Should have / Could have]

#### [用户故事 2]
...

### 3.2 [功能模块 2]
...

## 4. 非功能需求
### 4.1 性能需求
- [ ] [性能指标 1]
- [ ] [性能指标 2]

### 4.2 安全需求
- [ ] [安全需求 1]
- [ ] [安全需求 2]

### 4.3 可用性需求
- [ ] [可用性需求 1]
- [ ] [可用性需求 2]

### 4.4 兼容性需求
- [ ] [兼容性要求 1]
- [ ] [兼容性需求 2]

## 5. 系统约束
### 5.1 技术约束
- 前端框架：React
- 后端框架：Express
- 数据库：PostgreSQL

### 5.2 业务约束
- 必须符合 [法规要求]
- 必须支持 [业务规则]

### 5.3 时间约束
- [ ] [里程碑 1]：[日期]
- [ ] [里程碑 2]：[日期]

## 6. 验收标准
系统开发完成后，需要满足以下标准：
- [ ] [标准 1]
- [ ] [标准 2]
- [ ] [标准 3]

## 7. 附录
### 7.1 术语表
| 术语 | 定义 |
|------|--------|
| [术语1] | [定义] |
| [术语2] | [定义] |

### 7.2 参考文档
- [ ] [文档1]
- [ ] [文档2]
```

---

## 最佳实践

### ✅ 需求收集最佳实践

1. **利益相关者参与**
   - 确保所有相关方都参与需求收集
   - 识别关键决策者和影响者
   - 定期与利益相关者沟通

2. **用户中心设计**
   - 从用户角度编写需求
   - 使用用户故事描述功能
   - 关注用户价值和体验

3. **需求的可追溯性**
   - 每个需求都有唯一 ID
   - 记录需求的来源和变更历史
   - 需求与设计、测试用例关联

4. **持续验证和澄清**
   - 定期与利益相关者确认需求
   - 及时澄清模糊的需求
   - 记录需求变更的原因

### ✅ 需求分析最佳实践

1. **使用 MoSCoW 方法**
   - 明确区分必须、应该、可以有
   - 与利益相关者达成共识
   - 动态调整优先级

2. **使用 Kano 模型**
   - 了解用户对功能的期望
   - 区分兴奋型、性能型、基本型功能
   - 指导产品迭代方向

3. **进行技术可行性分析**
   - 技术团队评估每个需求
   - 识别技术风险和挑战
   - 提供替代方案

4. **识别需求依赖关系**
   - 明确需求间的依赖
   - 绘制需求依赖图
   - 规划需求的实施顺序

### ✅ 需求编写最佳实践

1. **使用 SMART 原则**
   - 需求描述具体明确
   - 有可衡量的验收标准
   - 技术上可行可实现
   - 与项目目标相关
   - 有明确的时间限制

2. **用户故事格式**
   - 使用标准模板
   - 包含角色、功能、目的
   - 明确验收标准

3. **完整的非功能需求**
   - 性能需求（响应时间、吞吐量）
   - 安全需求（认证、授权、加密）
   - 可用性需求（可访问性、国际化）
   - 兼容性需求（浏览器、设备）

### ✅ 需求变更管理

1. **需求变更流程**
   - 提交变更请求
   - 评估变更影响
   - 批准或拒绝变更
   - 更新需求文档

2. **变更影响分析**
   - 对进度的影响
   - 对成本的影响
   - 对其他需求的影响

3. **变更沟通**
   - 及时通知相关方
   - 记录变更原因
   - 更新项目计划

---

## 相关资源

- [产品设计最佳实践](../best-practices/product-design.md)
- [编码最佳实践](./coding.md)
- [用户设计模式](../design-patterns/user-experience.md)
