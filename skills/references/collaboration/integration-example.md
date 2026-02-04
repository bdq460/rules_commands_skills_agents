# 集成使用示例

本文档展示如何在项目中使用CodeBuddy技能体系，包含单技能调用、多技能协作、错误处理和性能优化的完整示例。

## 目录

1. [快速开始](#快速开始)
2. [单技能调用示例](#单技能调用示例)
3. [多技能协作示例](#多技能协作示例)
4. [错误处理示例](#错误处理示例)
5. [性能优化示例](#性能优化示例)
6. [最佳实践](#最佳实践)

---

## 快速开始

### 基础配置

在项目中使用CodeBuddy技能前，首先需要配置基础环境：

#### 1. 安装依赖

```bash
# 安装CodeBuddy CLI
npm install -g @codebuddy/cli

# 或在项目中作为开发依赖
npm install --save-dev @codebuddy/cli
```

#### 2. 初始化配置

```bash
# 在项目根目录初始化CodeBuddy
codebuddy init

# 生成配置文件 .codebuddy/config.json
```

#### 3. 配置技能路径

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "cb": "codebuddy",
    "cb:dev": "codebuddy develop",
    "cb:review": "codebuddy review",
    "cb:test": "codebuddy test"
  }
}
```

---

## 单技能调用示例

### 示例1：调用后端工程师生成API

```typescript
import { SkillInvoker } from '@codebuddy/core';

async function generateUserAPI() {
  const invoker = new SkillInvoker();

  try {
    // 调用backend-engineer技能
    const result = await invoker.invoke({
      skill: 'backend-engineer',
      task: 'generate-api',
      input: {
        apiName: 'User Management API',
        endpoints: [
          {
            path: '/api/users',
            method: 'GET',
            description: '获取用户列表',
            parameters: {
              page: { type: 'number', description: '页码' },
              pageSize: { type: 'number', description: '每页数量' }
            }
          },
          {
            path: '/api/users/:id',
            method: 'GET',
            description: '获取单个用户',
            parameters: {
              id: { type: 'string', description: '用户ID' }
            }
          }
        ],
        framework: 'express',
        database: 'postgresql'
      }
    });

    // 保存生成的代码
    await result.saveTo('./src/api/users');
    console.log('API生成成功！');

    return result;
  } catch (error) {
    console.error('API生成失败:', error);
    throw error;
  }
}

// 执行
generateUserAPI();
```

### 示例2：调用测试人员编写测试用例

```typescript
import { SkillInvoker } from '@codebuddy/core';

async function generateTests() {
  const invoker = new SkillInvoker();

  try {
    // 调用tester技能生成测试用例
    const result = await invoker.invoke({
      skill: 'tester',
      task: 'generate-test-cases',
      input: {
        feature: 'User Authentication',
        requirements: [
          '用户可以使用邮箱和密码登录',
          '系统应该验证密码强度',
          '登录失败应该显示错误信息',
          '登录成功后应该重定向到仪表板'
        ],
        testType: 'unit',
        framework: 'jest'
      }
    });

    // 保存测试文件
    await result.saveTo('./tests/unit/auth.test.ts');
    console.log('测试用例生成成功！');

    return result;
  } catch (error) {
    console.error('测试用例生成失败:', error);
    throw error;
  }
}

// 执行
generateTests();
```

### 示例3：调用安全工程师进行安全审查

```typescript
import { SkillInvoker } from '@codebuddy/core';

async function securityAudit() {
  const invoker = new SkillInvoker();

  try {
    // 调用security-engineer进行安全审查
    const result = await invoker.invoke({
      skill: 'security-engineer',
      task: 'security-audit',
      input: {
        codebase: './src',
        scanType: 'comprehensive',
        checks: [
          'sql-injection',
          'xss',
          'csrf',
          'auth-bypass',
          'sensitive-data-exposure'
        ],
        complianceStandards: ['OWASP-Top-10', 'GDPR']
      }
    });

    // 生成安全报告
    await result.saveTo('./reports/security-audit.md');
    console.log('安全审查完成！');

    // 检查是否有严重漏洞
    if (result.vulnerabilities?.critical > 0) {
      console.warn('发现严重安全漏洞，请立即修复！');
    }

    return result;
  } catch (error) {
    console.error('安全审查失败:', error);
    throw error;
  }
}

// 执行
securityAudit();
```

---

## 多技能协作示例

### 示例1：完整的产品开发流程

使用 `product-development-flow` 技能编排完整的产品开发流程：

```typescript
import { ProductDevelopmentFlow } from '@codebuddy/skills/product-development-flow';

async function developProduct() {
  const flow = new ProductDevelopmentFlow({
    projectName: 'Shell Formatter',
    description: '智能Shell脚本格式化和错误检查工具',
    techStack: {
      frontend: 'react',
      backend: 'nodejs',
      database: 'postgresql',
      buildTool: 'vite'
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
      'release-operations'
    ]
  });

  try {
    // 执行完整流程
    const result = await flow.execute({
      enableAutoTransition: true,
      maxReviewAttempts: 3,
      qualityThresholds: {
        testing: { coverage: 0.8, passRate: 0.95 },
        security: { vulnerabilities: 0 }
      }
    });

    // 生成最终报告
    await result.saveReport('./reports/product-development.md');

    console.log('产品开发完成！');
    return result;
  } catch (error) {
    console.error('产品开发失败:', error);
    await flow.handleError(error);
    throw error;
  }
}

// 执行
developProduct();
```

### 示例2：前后端联调协作

```typescript
import { SkillInvoker } from '@codebuddy/core';

async function frontendBackendIntegration() {
  const invoker = new SkillInvoker();
  const context = new Map();

  try {
    // 阶段1: 后端API生成
    console.log('步骤1: 生成后端API...');
    const backendResult = await invoker.invoke({
      skill: 'backend-engineer',
      task: 'generate-api',
      input: {
        apiSpec: './specs/api.yaml',
        framework: 'express'
      }
    });

    // 保存API文档和接口定义
    context.set('backend-api', backendResult.apiDefinition);
    await backendResult.saveTo('./src/api');

    // 阶段2: 生成前端调用代码
    console.log('步骤2: 生成前端API客户端...');
    const frontendResult = await invoker.invoke({
      skill: 'frontend-engineer',
      task: 'generate-api-client',
      input: {
        apiDefinition: backendResult.apiDefinition,
        framework: 'react',
        httpClient: 'axios'
      }
    });

    await frontendResult.saveTo('./src/api-client');

    // 阶段3: 生成集成测试
    console.log('步骤3: 生成集成测试...');
    const integrationTestResult = await invoker.invoke({
      skill: 'tester',
      task: 'generate-integration-test',
      input: {
        apiSpec: backendResult.apiDefinition,
        testFramework: 'jest',
        apiClient: frontendResult.apiClientCode
      }
    });

    await integrationTestResult.saveTo('./tests/integration');

    // 阶段4: 技术架构审查
    console.log('步骤4: 进行架构审查...');
    const architectResult = await invoker.invoke({
      skill: 'technical-architect',
      task: 'review-integration',
      input: {
        frontendCode: frontendResult.generatedCode,
        backendCode: backendResult.generatedCode,
        integrationTests: integrationTestResult.testCode
      }
    });

    await architectResult.saveTo('./reviews/integration-review.md');

    console.log('前后端联调完成！');
    return {
      backend: backendResult,
      frontend: frontendResult,
      tests: integrationTestResult,
      review: architectResult
    };
  } catch (error) {
    console.error('前后端联调失败:', error);
    throw error;
  }
}

// 执行
frontendBackendIntegration();
```

### 示例3：持续集成中的自动化流程

```typescript
import { SkillInvoker } from '@codebuddy/core';

async function ciPipeline() {
  const invoker = new SkillInvoker();
  const report = {
    timestamp: new Date(),
    stages: [],
    summary: {}
  };

  try {
    // 阶段1: 代码质量检查
    console.log('阶段1: 代码质量检查...');
    const qualityResult = await invoker.invoke({
      skill: 'technical-architect',
      task: 'code-quality-check',
      input: {
        codebase: './src',
        standards: ['eslint', 'prettier'],
        thresholds: {
          complexity: 10,
          duplication: 5
        }
      }
    });

    report.stages.push({
      name: 'code-quality',
      status: qualityResult.passed ? 'passed' : 'failed',
      score: qualityResult.score
    });

    if (!qualityResult.passed) {
      throw new Error('代码质量检查未通过');
    }

    // 阶段2: 安全扫描
    console.log('阶段2: 安全扫描...');
    const securityResult = await invoker.invoke({
      skill: 'security-engineer',
      task: 'security-scan',
      input: {
        codebase: './src',
        scanLevel: 'critical'
      }
    });

    report.stages.push({
      name: 'security',
      status: securityResult.vulnerabilities.critical === 0 ? 'passed' : 'failed',
      vulnerabilities: securityResult.vulnerabilities
    });

    if (securityResult.vulnerabilities.critical > 0) {
      throw new Error(`发现${securityResult.vulnerabilities.critical}个严重安全漏洞`);
    }

    // 阶段3: 运行测试
    console.log('阶段3: 运行测试...');
    const testResult = await invoker.invoke({
      skill: 'tester',
      task: 'run-tests',
      input: {
        testDir: './tests',
        framework: 'jest',
        coverage: true
      }
    });

    report.stages.push({
      name: 'tests',
      status: testResult.passed ? 'passed' : 'failed',
      coverage: testResult.coverage,
      passRate: testResult.passRate
    });

    if (!testResult.passed) {
      throw new Error('测试未通过');
    }

    // 阶段4: 生成测试报告
    console.log('阶段4: 生成测试报告...');
    const docResult = await invoker.invoke({
      skill: 'product-documentation-expert',
      task: 'generate-test-report',
      input: {
        testResults: testResult,
        qualityResults: qualityResult,
        securityResults: securityResult
      }
    });

    await docResult.saveTo('./reports/ci-test-report.html');

    // 生成CI报告
    report.summary = {
      totalStages: report.stages.length,
      passedStages: report.stages.filter(s => s.status === 'passed').length,
      failedStages: report.stages.filter(s => s.status === 'failed').length,
      overallStatus: report.stages.every(s => s.status === 'passed') ? 'passed' : 'failed'
    };

    console.log('CI流水线完成！', report);
    return report;

  } catch (error) {
    console.error('CI流水线失败:', error);
    report.summary.error = error.message;
    return report;
  }
}

// 执行
ciPipeline();
```

---

## 错误处理示例

### 示例1：技能执行失败的重试机制

```typescript
import { SkillInvoker } from '@codebuddy/core';

class SkillExecutor {
  private maxRetries = 3;
  private retryDelay = 1000;

  async executeWithRetry(skillName: string, task: string, input: any) {
    const invoker = new SkillInvoker();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`尝试 ${attempt}/${this.maxRetries}: 执行${skillName}`);

        const result = await invoker.invoke({
          skill: skillName,
          task: task,
          input: input
        });

        console.log(`执行成功！`);
        return result;

      } catch (error) {
        lastError = error as Error;
        console.error(`尝试 ${attempt} 失败:`, error.message);

        if (attempt < this.maxRetries) {
          // 指数退避
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          console.log(`等待 ${delay}ms 后重试...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`${skillName} 执行失败，已重试${this.maxRetries}次。最后错误: ${lastError?.message}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 使用示例
async function executeWithRetryExample() {
  const executor = new SkillExecutor();

  try {
    const result = await executor.executeWithRetry(
      'backend-engineer',
      'generate-api',
      { apiName: 'User API' }
    );
    console.log('API生成成功！');
  } catch (error) {
    console.error('最终失败:', error);
  }
}

// 执行
executeWithRetryExample();
```

### 示例2：冲突升级处理

```typescript
import { SkillInvoker } from '@codebuddy/core';

enum ConflictLevel {
  LEVEL_1 = 'internal',     // 内部解决
  LEVEL_2 = 'coordinator',  // 协调器协调
  LEVEL_3 = 'rollback',      // 阶段回退
  LEVEL_4 = 'user'          // 用户介入
}

class ConflictResolver {
  private invoker: SkillInvoker;

  constructor() {
    this.invoker = new SkillInvoker();
  }

  async resolveConflict(
    conflict: {
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      context: any;
    }
  ): Promise<any> {
    console.log(`检测到冲突: ${conflict.message}`);

    // 根据严重程度选择解决策略
    const level = this.determineResolutionLevel(conflict);

    switch (level) {
      case ConflictLevel.LEVEL_1:
        return this.resolveInternal(conflict);

      case ConflictLevel.LEVEL_2:
        return this.resolveWithCoordinator(conflict);

      case ConflictLevel.LEVEL_3:
        return this.resolveWithRollback(conflict);

      case ConflictLevel.LEVEL_4:
        return this.resolveWithUser(conflict);

      default:
        throw new Error(`未知的冲突级别: ${level}`);
    }
  }

  private determineResolutionLevel(conflict: any): ConflictLevel {
    if (conflict.severity === 'low') {
      return ConflictLevel.LEVEL_1;
    }

    if (conflict.severity === 'medium') {
      return ConflictLevel.LEVEL_2;
    }

    if (conflict.severity === 'high') {
      return ConflictLevel.LEVEL_3;
    }

    return ConflictLevel.LEVEL_4;
  }

  // Level 1: 内部解决
  private async resolveInternal(conflict: any): Promise<any> {
    console.log('Level 1: 尝试内部解决...');

    try {
      // 尝试自动修复
      const result = await this.invoker.invoke({
        skill: 'technical-architect',
        task: 'auto-fix',
        input: {
          conflict: conflict,
          fixLevel: 'minor'
        }
      });

      console.log('冲突已内部解决！');
      return result;

    } catch (error) {
      console.error('内部解决失败，升级到Level 2');
      throw new ConflictEscalationError('Level 1 failed', ConflictLevel.LEVEL_2);
    }
  }

  // Level 2: 协调器协调
  private async resolveWithCoordinator(conflict: any): Promise<any> {
    console.log('Level 2: 请求协调器协调...');

    try {
      const result = await this.invoker.invoke({
        skill: 'project-coordinator',
        task: 'resolve-conflict',
        input: {
          conflict: conflict,
          participants: ['frontend-engineer', 'backend-engineer'],
          timeout: 15 * 60 * 1000 // 15分钟
        }
      });

      console.log('协调器已解决冲突！');
      return result;

    } catch (error) {
      console.error('协调器解决失败，升级到Level 3');
      throw new ConflictEscalationError('Level 2 failed', ConflictLevel.LEVEL_3);
    }
  }

  // Level 3: 阶段回退
  private async resolveWithRollback(conflict: any): Promise<any> {
    console.log('Level 3: 执行阶段回退...');

    try {
      const result = await this.invoker.invoke({
        skill: 'project-coordinator',
        task: 'rollback-stage',
        input: {
          targetStage: conflict.context.currentStage,
          reason: conflict.message,
          preserveContext: true
        }
      });

      console.log(`已回退到阶段: ${result.rollbackStage}`);
      return result;

    } catch (error) {
      console.error('回退失败，升级到Level 4');
      throw new ConflictEscalationError('Level 3 failed', ConflictLevel.LEVEL_4);
    }
  }

  // Level 4: 用户介入
  private async resolveWithUser(conflict: any): Promise<any> {
    console.log('Level 4: 等待用户决策...');

    // 生成冲突报告
    const report = await this.invoker.invoke({
      skill: 'product-documentation-expert',
      task: 'generate-conflict-report',
      input: {
        conflict: conflict,
        options: [
          {
            id: 'continue',
            description: '继续当前流程',
            action: 'continue'
          },
          {
            id: 'rollback',
            description: '回退到上一阶段',
            action: 'rollback'
          },
          {
            id: 'retry',
            description: '重试当前阶段',
            action: 'retry'
          }
        ]
      }
    });

    await report.saveTo('./reports/conflict-report.md');

    // 在实际应用中，这里应该等待用户输入
    // 这里只是示例
    console.log('请查看冲突报告并做出决策:', report.filePath);

    return {
      level: 'user-intervention',
      reportPath: report.filePath,
      status: 'awaiting-user-decision'
    };
  }
}

class ConflictEscalationError extends Error {
  constructor(message: string, public nextLevel: ConflictLevel) {
    super(message);
    this.name = 'ConflictEscalationError';
  }
}

// 使用示例
async function conflictResolutionExample() {
  const resolver = new ConflictResolver();

  const conflict = {
    type: 'integration-conflict',
    severity: 'high' as const,
    message: '前后端接口定义不一致',
    context: {
      currentStage: 'frontend-development',
      frontendDefinition: { ... },
      backendDefinition: { ... }
    }
  };

  try {
    const result = await resolver.resolveConflict(conflict);
    console.log('冲突解决成功:', result);
  } catch (error) {
    console.error('冲突解决失败:', error);
  }
}

// 执行
conflictResolutionExample();
```

### 示例3：优雅的错误恢复

```typescript
import { SkillInvoker } from '@codebuddy/core';

interface RecoveryStrategy {
  condition: (error: Error) => boolean;
  action: (error: Error) => Promise<any>;
  description: string;
}

class RobustSkillExecutor {
  private invoker: SkillInvoker;
  private recoveryStrategies: RecoveryStrategy[];

  constructor() {
    this.invoker = new SkillInvoker();
    this.recoveryStrategies = [
      {
        // 策略1: 网络错误 - 重试
        condition: (error) => error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT'),
        action: async (error) => {
          console.log('检测到网络错误，等待5秒后重试...');
          await this.sleep(5000);
          return { action: 'retry', delay: 5000 };
        },
        description: '网络错误 - 重试'
      },
      {
        // 策略2: 权限错误 - 检查权限
        condition: (error) => error.message.includes('EACCES') || error.message.includes('permission'),
        action: async (error) => {
          console.log('检测到权限错误，尝试修复权限...');
          // 调用技术架构师检查权限
          const result = await this.invoker.invoke({
            skill: 'technical-architect',
            task: 'fix-permissions',
            input: { error: error.message }
          });
          return result;
        },
        description: '权限错误 - 修复权限'
      },
      {
        // 策略3: 依赖缺失 - 安装依赖
        condition: (error) => error.message.includes('Cannot find module') || error.message.includes('ENOENT'),
        action: async (error) => {
          console.log('检测到依赖缺失，尝试安装...');
          const result = await this.invoker.invoke({
            skill: 'devops-generator',
            task: 'install-dependencies',
            input: { missingModule: this.extractModuleName(error.message) }
          });
          return result;
        },
        description: '依赖缺失 - 安装依赖'
      },
      {
        // 策略4: 内存不足 - 优化内存
        condition: (error) => error.message.includes('ENOMEM') || error.message.includes('out of memory'),
        action: async (error) => {
          console.log('检测到内存不足，尝试优化...');
          const result = await this.invoker.invoke({
            skill: 'system-optimizer',
            task: 'optimize-memory',
            input: { currentUsage: error.message }
          });
          return result;
        },
        description: '内存不足 - 优化内存'
      }
    ];
  }

  async executeWithRecovery(
    skillName: string,
    task: string,
    input: any
  ): Promise<any> {
    try {
      return await this.invoker.invoke({
        skill: skillName,
        task: task,
        input: input
      });
    } catch (error) {
      const errorObj = error as Error;
      console.error(`执行${skillName}失败:`, errorObj.message);

      // 查找适用的恢复策略
      const strategy = this.recoveryStrategies.find(s => s.condition(errorObj));

      if (strategy) {
        console.log(`找到恢复策略: ${strategy.description}`);
        try {
          const recoveryResult = await strategy.action(errorObj);
          console.log('恢复策略执行成功');

          // 如果策略建议重试，重新执行
          if (recoveryResult?.action === 'retry') {
            await this.sleep(recoveryResult.delay || 1000);
            return await this.invoker.invoke({
              skill: skillName,
              task: task,
              input: input
            });
          }

          return recoveryResult;
        } catch (recoveryError) {
          console.error('恢复策略执行失败:', recoveryError);
          throw new Error(`恢复失败: ${recoveryError}. 原始错误: ${errorObj.message}`);
        }
      }

      // 没有找到适用的恢复策略
      throw new Error(`无法恢复的错误: ${errorObj.message}`);
    }
  }

  private extractModuleName(errorMessage: string): string {
    const match = errorMessage.match(/Cannot find module ['"](.+?)['"]/);
    return match ? match[1] : '';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 使用示例
async function robustExecutionExample() {
  const executor = new RobustSkillExecutor();

  try {
    const result = await executor.executeWithRecovery(
      'backend-engineer',
      'generate-api',
      { apiName: 'User API' }
    );
    console.log('执行成功！');
  } catch (error) {
    console.error('最终失败:', error);
  }
}

// 执行
robustExecutionExample();
```

---

## 性能优化示例

### 示例1：并行执行多个独立技能

```typescript
import { SkillInvoker } from '@codebuddy/core';

class ParallelSkillExecutor {
  private invoker: SkillInvoker;
  private maxConcurrency: number;

  constructor(maxConcurrency: number = 4) {
    this.invoker = new SkillInvoker();
    this.maxConcurrency = maxConcurrency;
  }

  async executeParallel(tasks: Array<{ skill: string; task: string; input: any }>) {
    const results = new Map();
    const errors = new Map();

    // 使用并发控制
    const executing = new Set<Promise<any>>();

    for (const task of tasks) {
      // 等待并发数下降
      if (executing.size >= this.maxConcurrency) {
        await Promise.race(executing);
      }

      const promise = this.executeTask(task)
        .then(result => {
          results.set(task, result);
          executing.delete(promise);
        })
        .catch(error => {
          errors.set(task, error);
          executing.delete(promise);
        });

      executing.add(promise);
    }

    // 等待所有任务完成
    await Promise.all(executing);

    return {
      results: Object.fromEntries(results),
      errors: Object.fromEntries(errors),
      successCount: results.size,
      failureCount: errors.size
    };
  }

  private async executeTask(task: any): Promise<any> {
    return await this.invoker.invoke(task);
  }
}

// 使用示例
async function parallelExecutionExample() {
  const executor = new ParallelSkillExecutor(4);

  const tasks = [
    {
      skill: 'backend-engineer',
      task: 'generate-api',
      input: { apiName: 'User API' }
    },
    {
      skill: 'frontend-engineer',
      task: 'generate-component',
      input: { componentName: 'UserForm' }
    },
    {
      skill: 'tester',
      task: 'generate-tests',
      input: { feature: 'User Management' }
    },
    {
      skill: 'product-documentation-expert',
      task: 'generate-docs',
      input: { component: 'User Management' }
    }
  ];

  console.log('开始并行执行4个任务...');

  const result = await executor.executeParallel(tasks);

  console.log(`执行完成: ${result.successCount}成功, ${result.failureCount}失败`);

  if (result.failureCount > 0) {
    console.error('失败的任务:', result.errors);
  }

  return result;
}

// 执行
parallelExecutionExample();
```

### 示例2：技能缓存优化

```typescript
import { SkillInvoker } from '@codebuddy/core';
import { createHash } from 'crypto';

interface CacheEntry {
  result: any;
  timestamp: Date;
  hash: string;
}

class CachedSkillExecutor {
  private invoker: SkillInvoker;
  private cache: Map<string, CacheEntry>;
  private maxCacheSize: number;
  private cacheTTL: number; // 毫秒

  constructor(maxCacheSize: number = 100, cacheTTL: number = 30 * 60 * 1000) {
    this.invoker = new SkillInvoker();
    this.cache = new Map();
    this.maxCacheSize = maxCacheSize;
    this.cacheTTL = cacheTTL;
  }

  async executeWithCache(
    skillName: string,
    task: string,
    input: any
  ): Promise<any> {
    // 生成缓存键
    const cacheKey = this.generateCacheKey(skillName, task, input);

    // 检查缓存
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      console.log(`缓存命中: ${cacheKey}`);
      return cached.result;
    }

    // 执行技能
    console.log(`缓存未命中，执行技能: ${skillName}`);
    const result = await this.invoker.invoke({
      skill: skillName,
      task: task,
      input: input
    });

    // 缓存结果
    this.cache.set(cacheKey, {
      result: result,
      timestamp: new Date(),
      hash: this.hashResult(result)
    });

    // 清理过期缓存
    this.cleanExpiredCache();

    // 清理多余缓存
    this.cleanupCache();

    return result;
  }

  private generateCacheKey(skillName: string, task: string, input: any): string {
    const data = JSON.stringify({ skillName, task, input });
    return createHash('md5').update(data).digest('hex');
  }

  private hashResult(result: any): string {
    return createHash('md5').update(JSON.stringify(result)).digest('hex');
  }

  private isCacheValid(entry: CacheEntry): boolean {
    const age = Date.now() - entry.timestamp.getTime();
    return age < this.cacheTTL;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp.getTime();
      if (age >= this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  private cleanupCache(): void {
    while (this.cache.size > this.maxCacheSize) {
      // 删除最旧的缓存项
      const oldestKey = this.findOldestCacheKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  private findOldestCacheKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp.getTime() < oldestTime) {
        oldestTime = entry.timestamp.getTime();
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  // 清空缓存
  clearCache(): void {
    this.cache.clear();
    console.log('缓存已清空');
  }

  // 获取缓存统计
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      ttl: this.cacheTTL,
      utilization: this.cache.size / this.maxCacheSize
    };
  }
}

// 使用示例
async function cacheOptimizationExample() {
  const executor = new CachedSkillExecutor(100, 30 * 60 * 1000); // 30分钟TTL

  // 第一次执行 - 缓存未命中
  console.log('第一次执行...');
  await executor.executeWithCache('backend-engineer', 'generate-api', {
    apiName: 'User API'
  });

  // 第二次执行 - 缓存命中
  console.log('第二次执行（相同输入）...');
  await executor.executeWithCache('backend-engineer', 'generate-api', {
    apiName: 'User API'
  });

  // 查看缓存统计
  console.log('缓存统计:', executor.getCacheStats());

  // 清空缓存
  executor.clearCache();
}

// 执行
cacheOptimizationExample();
```

### 示例3：智能批量处理

```typescript
import { SkillInvoker } from '@codebuddy/core';

class BatchSkillProcessor {
  private invoker: SkillInvoker;
  private batchSize: number;

  constructor(batchSize: number = 10) {
    this.invoker = new SkillInvoker();
    this.batchSize = batchSize;
  }

  async processBatch<T>(
    items: T[],
    skillName: string,
    task: string,
    transform: (item: T) => any
  ): Promise<{ results: any[]; errors: any[] }> {
    const results: any[] = [];
    const errors: any[] = [];

    // 分批处理
    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize);
      console.log(`处理批次 ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(items.length / this.batchSize)}`);

      try {
        // 调用技能处理批次
        const batchInput = batch.map(transform);
        const batchResult = await this.invoker.invoke({
          skill: skillName,
          task: task,
          input: {
            batch: batchInput,
            batchIndex: Math.floor(i / this.batchSize)
          }
        });

        results.push(...batchResult.results || batchResult);

        if (batchResult.errors && batchResult.errors.length > 0) {
          errors.push(...batchResult.errors);
        }

      } catch (error) {
        console.error(`批次处理失败:`, error);
        errors.push({ batchIndex: Math.floor(i / this.batchSize), error });
      }
    }

    return { results, errors };
  }

  // 智能批量大小调整
  async processWithDynamicBatching<T>(
    items: T[],
    skillName: string,
    task: string,
    transform: (item: T) => any
  ): Promise<any> {
    let currentBatchSize = this.batchSize;
    const results: any[] = [];
    const errors: any[] = [];

    while (items.length > 0) {
      const batch = items.splice(0, currentBatchSize);
      console.log(`尝试批次大小: ${currentBatchSize}, 剩余: ${items.length}`);

      const startTime = Date.now();

      try {
        const batchInput = batch.map(transform);
        const batchResult = await this.invoker.invoke({
          skill: skillName,
          task: task,
          input: { batch: batchInput }
        });

        const duration = Date.now() - startTime;
        results.push(...batchResult.results || batchResult);

        // 根据执行时间动态调整批次大小
        if (duration < 2000) {
          currentBatchSize = Math.min(currentBatchSize * 2, 100);
        } else if (duration > 10000) {
          currentBatchSize = Math.max(Math.floor(currentBatchSize / 2), 5);
        }

      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`批次处理失败 (耗时${duration}ms):`, error);

        // 如果是超时或内存错误，减小批次大小
        if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('memory'))) {
          currentBatchSize = Math.max(Math.floor(currentBatchSize / 2), 1);
          // 将失败的批次重新放回队列
          items.unshift(...batch);
        } else {
          errors.push({ error, batch });
        }
      }
    }

    return { results, errors, finalBatchSize: currentBatchSize };
  }
}

// 使用示例
async function batchProcessingExample() {
  const processor = new BatchSkillProcessor(10);

  // 模拟大批量数据
  const apiEndpoints = Array.from({ length: 50 }, (_, i) => ({
    path: `/api/endpoint${i}`,
    method: 'GET',
    description: `Endpoint ${i}`
  }));

  console.log(`开始处理 ${apiEndpoints.length} 个API端点...`);

  // 批量生成API
  const result = await processor.processBatch(
    apiEndpoints,
    'backend-engineer',
    'generate-api-batch',
    (endpoint) => endpoint
  );

  console.log(`处理完成: ${result.results.length}成功, ${result.errors.length}失败`);

  // 使用动态批量大小
  console.log('\n使用动态批量大小处理...');
  const dynamicResult = await processor.processWithDynamicBatching(
    apiEndpoints,
    'backend-engineer',
    'generate-api-batch',
    (endpoint) => endpoint
  );

  console.log(`最终批次大小: ${dynamicResult.finalBatchSize}`);
}

// 执行
batchProcessingExample();
```

---

## 最佳实践

### 1. 技能调用最佳实践

```typescript
// ✅ 好的做法
const invoker = new SkillInvoker();

try {
  const result = await invoker.invoke({
    skill: 'backend-engineer',
    task: 'generate-api',
    input: { /* ... */ }
  });

  // 验证结果
  if (result && result.success) {
    await result.saveTo('./src/api');
  }
} catch (error) {
  // 详细的错误处理
  console.error('API生成失败:', error);
  await handleError(error);
}

// ❌ 不好的做法
await invoke('backend-engineer'); // 缺少错误处理
```

### 2. 性能优化最佳实践

```typescript
// ✅ 好的做法：使用缓存和并行
const cachedExecutor = new CachedSkillExecutor();
const parallelExecutor = new ParallelSkillExecutor(4);

// 并行执行 + 缓存
const tasks = [...];
const result = await parallelExecutor.executeParallel(tasks);

// ❌ 不好的做法：串行执行，无缓存
for (const task of tasks) {
  await invoke(task); // 慢
}
```

### 3. 错误处理最佳实践

```typescript
// ✅ 好的做法：多级错误恢复
class RobustExecutor {
  async execute() {
    try {
      return await this.primaryStrategy();
    } catch (error) {
      try {
        return await this.fallbackStrategy();
      } catch (fallbackError) {
        return await this.finalFallback();
      }
    }
  }
}

// ❌ 不好的做法：单一错误处理
try {
  await execute();
} catch (error) {
  console.error(error); // 只记录，不恢复
}
```

### 4. 资源管理最佳实践

```typescript
// ✅ 好的做法：使用资源池
class SkillPool {
  private pool: SkillInvoker[] = [];
  private maxPoolSize: number;

  constructor(maxPoolSize: number = 5) {
    this.maxPoolSize = maxPoolSize;
  }

  async acquire(): Promise<SkillInvoker> {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return new SkillInvoker();
  }

  async release(invoker: SkillInvoker): Promise<void> {
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(invoker);
    }
  }
}

// ❌ 不好的做法：每次都创建新实例
async function process() {
  const invoker1 = new SkillInvoker();
  await invoker1.invoke(...);

  const invoker2 = new SkillInvoker();
  await invoker2.invoke(...);
}
```

### 5. 监控和日志最佳实践

```typescript
// ✅ 好的做法：完整的监控和日志
class MonitoredSkillExecutor {
  private logger: Logger;
  private metrics: Metrics;

  async execute(skillName: string, task: string, input: any) {
    const startTime = Date.now();

    this.logger.info(`开始执行: ${skillName}/${task}`);
    this.metrics.counter('skill.execution.started').increment({ skill: skillName });

    try {
      const result = await this.invoker.invoke({ skill: skillName, task, input });

      const duration = Date.now() - startTime;
      this.logger.info(`执行成功: ${skillName}/${task}, 耗时${duration}ms`);
      this.metrics.histogram('skill.execution.duration').record(duration, { skill: skillName });
      this.metrics.counter('skill.execution.success').increment({ skill: skillName });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`执行失败: ${skillName}/${task}, 耗时${duration}ms, 错误: ${error}`);
      this.metrics.counter('skill.execution.failed').increment({ skill: skillName });

      throw error;
    }
  }
}

// ❌ 不好的做法：缺乏监控
async function execute(skillName: string, task: string, input: any) {
  // 没有日志
  // 没有指标
  // 没有监控
  return await invoke({ skill: skillName, task, input });
}
```

---

## 总结

本文档提供了CodeBuddy技能体系的完整集成示例，包括：

1. **单技能调用**：如何独立使用各个技能
2. **多技能协作**：如何组合多个技能完成复杂任务
3. **错误处理**：如何优雅地处理和恢复错误
4. **性能优化**：如何优化技能调用的性能

遵循这些最佳实践，可以构建高效、稳定、可维护的技能集成系统。
