# 产品开发流程集成示例

本文档展示如何组合使用product-development-flow的6个脚本模块来管理一个完整的产品开发项目。

## 概述

product-development-flow包含以下6个核心模块：

1. **Flow Coordinator** - 流程协调器，管理阶段转换
2. **Review Orchestrator** - 校对管理器，处理多轮校对
3. **Delivery Artifacts Manager** - 交付物管理器，管理交付物版本
4. **Progress Tracker** - 进度跟踪器，跟踪项目进度
5. **Quality Metrics Collector** - 质量指标收集器，收集质量指标
6. **Feedback Collector** - 反馈收集器，收集和分类反馈

## 完整集成示例

### 步骤1：初始化项目

```typescript
import {
  FlowCoordinator,
  ReviewOrchestrator,
  DeliveryArtifactsManager,
  ProgressTracker,
  QualityMetricsCollector,
  FeedbackCollector,
} from './scripts';

// 创建流程协调器
const coordinator = new FlowCoordinator({
  projectContext: {
    name: 'Shell Formatter',
    description: '智能Shell脚本格式化和错误检查工具',
    startDate: new Date(),
    targetEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  stages: [
    'requirements-proposal',
    'requirements-analysis',
    'product-design',
    'ui-design',
    'frontend-development',
    'backend-development',
    'architecture-guarantee',
    'testing-verification',
    'documentation-delivery',
    'security-review',
    'test-framework-setup',
    'release-operations',
  ],
  autoTransition: true,
  maxReviewAttempts: 3,
});

// 创建校对管理器
const reviewOrchestrator = new ReviewOrchestrator({
  maxReviewAttempts: 3,
  enableAutoTransition: true,
});

// 创建交付物管理器
const artifactManager = new DeliveryArtifactsManager({
  baseDir: './.codebuddy/artifacts',
  enableVersioning: true,
  enableArchive: true,
});

// 创建进度跟踪器
const progressTracker = new ProgressTracker({
  baseDir: './.codebuddy/progress',
  milestones: [
    { name: 'MVP完成', date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
    { name: '发布候选', date: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000) },
    { name: '正式发布', date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  ],
});

// 创建质量指标收集器
const metricsCollector = new QualityMetricsCollector({
  baseDir: './.codebuddy/metrics',
  enableAlerts: true,
  thresholds: {
    'requirements-proposal': { completeness: 0.95, clarity: 0.9 },
    'testing-verification': { coverage: 0.8, passRate: 0.95 },
  },
});

// 创建反馈收集器
const feedbackCollector = new FeedbackCollector({
  baseDir: './.codebuddy/feedback',
  enableCrossStage: true,
});
```

### 步骤2：启动流程

```typescript
// 启动产品开发流程
async function startProject() {
  // 1. 启动流程协调器
  await coordinator.start();

  // 2. 记录初始进度
  await progressTracker.recordProgress('requirements-proposal', {
    status: 'in-progress',
    startDate: new Date(),
    estimatedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // 3. 记录初始质量指标
  await metricsCollector.recordMetric('requirements-proposal', {
    metric: 'completeness',
    value: 0,
    timestamp: new Date(),
  });

  console.log('项目已启动');
}
```

### 步骤3：执行阶段转换

```typescript
// 执行单个阶段
async function executeStage(stageName: string, skills: string[]) {
  // 1. 触发校对
  await reviewOrchestrator.triggerSelfReview(stageName);

  // 2. 执行技能
  console.log(`执行阶段: ${stageName}`);
  console.log(`调用技能: ${skills.join(', ')}`);

  // 3. 记录进度
  await progressTracker.recordProgress(stageName, {
    status: 'in-progress',
    startDate: new Date(),
  });

  // 4. 模拟技能执行（实际使用时，这里会调用具体的技能）
  await executeSkills(skills);

  // 5. 注册交付物
  await artifactManager.registerArtifact({
    stage: stageName,
    name: `${stageName}-output`,
    version: '1.0.0',
    files: [
      {
        path: `${stageName}/output.json`,
        content: JSON.stringify({ status: 'completed' }),
      },
    ],
  });

  // 6. 记录质量指标
  await metricsCollector.recordMetric(stageName, {
    metric: 'quality',
    value: 0.9,
    timestamp: new Date(),
  });

  // 7. 提交校对决策
  await reviewOrchestrator.recordDecision(stageName, {
    decision: 'approved',
    reviewer: 'system',
    comments: '阶段完成，质量达标',
  });

  // 8. 记录反馈
  await feedbackCollector.collectFeedback({
    stage: stageName,
    source: 'system',
    category: 'quality',
    content: '阶段完成质量良好',
    severity: 'info',
  });

  console.log(`阶段 ${stageName} 完成`);
}
```

### 步骤4：管理多轮校对

```typescript
// 处理需要重新校对的阶段
async function handleRejection(stageName: string) {
  // 1. 获取当前审查状态
  const reviewStatus = reviewOrchestrator.getReviewStatus(stageName);

  // 2. 检查是否达到最大尝试次数
  if (reviewStatus.attemptCount >= reviewStatus.maxAttempts) {
    console.error(`阶段 ${stageName} 达到最大校对次数`);
    return;
  }

  // 3. 记录反馈
  await feedbackCollector.collectFeedback({
    stage: stageName,
    source: 'reviewer',
    category: 'quality',
    content: '需要改进：需求描述不够清晰',
    severity: 'warning',
  });

  // 4. 重新执行阶段
  console.log(`重新执行阶段: ${stageName}`);
  // 这里会重新调用相关技能进行改进
}
```

### 步骤5：生成项目报告

```typescript
// 生成项目进度报告
async function generateProgressReport() {
  // 1. 获取当前进度
  const progress = await progressTracker.generateReport();

  // 2. 获取质量指标
  const qualityReport = await metricsCollector.generateQualityReport();

  // 3. 获取反馈汇总
  const feedbackSummary = await feedbackCollector.getSummary();

  // 4. 获取交付物列表
  const artifacts = await artifactManager.getAllArtifacts();

  return {
    progress,
    quality: qualityReport,
    feedback: feedbackSummary,
    artifacts,
  };
}
```

## 完整的工作流示例

```typescript
// 完整的项目执行流程
async function executeProject() {
  try {
    // 启动项目
    await startProject();

    // 定义阶段到技能的映射
    const stageSkillMap = {
      'requirements-proposal': ['customer-representative'],
      'requirements-analysis': ['requirements-analyst', 'project-planner'],
      'product-design': ['product-expert'],
      'ui-design': ['ui-expert'],
      'frontend-development': ['frontend-engineer'],
      'backend-development': ['backend-engineer'],
      'architecture-guarantee': ['technical-architect', 'data-engineer', 'disaster-recovery-planner'],
      'testing-verification': ['tester', 'system-optimizer'],
      'documentation-delivery': ['product-documentation-expert'],
      'security-review': ['security-engineer'],
      'test-framework-setup': ['test-framework-builder'],
      'release-operations': ['devops-generator'],
    };

    // 依次执行各阶段
    for (const stageName of coordinator.stages) {
      const skills = stageSkillMap[stageName] || [];

      // 执行阶段
      await executeStage(stageName, skills);

      // 转换到下一阶段
      if (coordinator.getCurrentStage() !== stageName) {
        await coordinator.transitionTo(stageName);
      }

      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 生成最终报告
    const report = await generateProgressReport();
    console.log('项目完成！', report);

  } catch (error) {
    console.error('项目执行失败:', error);
    await handleProjectError(error);
  }
}

// 处理项目错误
async function handleProjectError(error: Error) {
  const currentStage = coordinator.getCurrentStage();

  // 记录错误反馈
  await feedbackCollector.collectFeedback({
    stage: currentStage,
    source: 'system',
    category: 'error',
    content: error.message,
    severity: 'critical',
  });

  // 标记阶段为失败状态
  await progressTracker.recordProgress(currentStage, {
    status: 'failed',
    error: error.message,
  });
}

// 执行技能（模拟函数）
async function executeSkills(skills: string[]) {
  console.log(`执行技能: ${skills.join(', ')}`);
  // 实际使用时，这里会调用具体的skill
  await new Promise(resolve => setTimeout(resolve, 500));
}

// 启动项目
executeProject();
```

## 进阶用法

### 1. 并行执行多个阶段

```typescript
// 并行执行前端和后端开发
async function parallelExecution() {
  // 前端开发
  const frontendPromise = executeStage('frontend-development', ['frontend-engineer']);

  // 后端开发
  const backendPromise = executeStage('backend-development', ['backend-engineer']);

  // 等待两个阶段都完成
  await Promise.all([frontendPromise, backendPromise]);
}
```

### 2. 自定义质量阈值

```typescript
// 为不同阶段设置不同的质量阈值
const customThresholds = {
  'requirements-proposal': { completeness: 0.95, clarity: 0.9 },
  'testing-verification': { coverage: 0.8, passRate: 0.95 },
  'security-review': { vulnerabilities: 0, compliance: 1.0 },
};

const customMetricsCollector = new QualityMetricsCollector({
  baseDir: './.codebuddy/metrics',
  enableAlerts: true,
  thresholds: customThresholds,
});
```

### 3. 反馈驱动的流程改进

```typescript
// 根据反馈自动调整流程
async function feedbackDrivenWorkflow() {
  // 获取所有反馈
  const feedback = await feedbackCollector.getAllFeedback();

  // 分析反馈趋势
  const criticalIssues = feedback.filter(f => f.severity === 'critical');
  if (criticalIssues.length > 0) {
    console.warn('发现严重问题，需要重新审视流程');
    // 可以在这里触发流程调整或回退
  }
}
```

## 最佳实践

1. **模块化初始化**：将各模块的初始化代码封装成独立函数
2. **错误处理**：为每个阶段添加完善的错误处理逻辑
3. **日志记录**：记录关键操作和决策，便于追踪和审计
4. **定期报告**：定期生成进度和质量报告，及时发现和解决问题
5. **反馈循环**：建立反馈驱动的改进机制，持续优化流程

## 总结

通过组合使用6个脚本模块，可以构建一个完整的产品开发流程管理系统。这个系统能够：

- ✅ 自动管理阶段转换
- ✅ 处理多轮校对
- ✅ 跟踪项目进度
- ✅ 收集质量指标
- ✅ 管理交付物版本
- ✅ 收集和分析反馈

这种集成方式为产品开发提供了一个标准化、自动化的管理平台。
