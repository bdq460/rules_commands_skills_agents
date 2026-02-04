# References 目录

本目录包含18个skills所需的参考资料、最佳实践、模板和工具指南。

## 📁 目录结构

```text
references/
├── best-practices/          # 最佳实践
│   ├── coding.md            # 编码最佳实践
│   ├── testing.md           # 测试最佳实践
│   ├── devops.md           # DevOps最佳实践
│   ├── security.md          # 安全最佳实践
│   └── documentation.md     # 文档编写最佳实践
│
├── design-patterns/         # 设计模式
│   ├── creational.md        # 创建型模式
│   ├── structural.md        # 结构型模式
│   ├── behavioral.md        # 行为型模式
│   └── architectural.md     # 架构模式
│
├── collaboration/           # 协作相关
│   ├── collaboration-raci.md    # 协作RACI矩阵
│   ├── conflict-escalation-path.md  # 冲突升级路径
│   ├── integration-example.md     # 集成使用示例
│   └── verification-checklist.md  # 验证检查清单
│
├── tech-stack/              # 技术栈参考
│   ├── frontend/           # 前端技术
│   │   ├── react.md
│   │   ├── vue.md
│   │   └── angular.md
│   ├── backend/            # 后端技术
│   │   ├── nodejs.md
│   │   ├── python.md
│   │   ├── java.md
│   │   └── go.md
│   ├── database/           # 数据库
│   │   ├── postgresql.md
│   │   ├── mysql.md
│   │   └── mongodb.md
│   ├── devops/             # DevOps工具
│   │   ├── docker.md
│   │   ├── kubernetes.md
│   │   ├── github-actions.md
│   │   └── gitlab-ci.md
│   └── testing/            # 测试工具
│       ├── jest.md
│       ├── cypress.md
│       └── playwright.md
│
├── security/               # 安全参考
│   ├── owasp-top10.md      # OWASP Top 10
│   ├── authentication.md   # 认证最佳实践
│   ├── authorization.md    # 授权最佳实践
│   ├── encryption.md       # 加密最佳实践
│   └── vulnerability-checklist.md # 漏洞检查清单
│
├── architecture/           # 架构参考
│   ├── hexagonal-architecture.md    # 六边形架构
│   ├── microservices.md             # 微服务架构
│   ├── event-driven-architecture.md # 事件驱动架构
│   ├── cqrs.md                     # CQRS模式
│   └── saga-pattern.md             # Saga模式
│
└── templates/              # 模板
    ├── project/            # 项目模板
    │   ├── fullstack/     # 全栈项目模板
    │   ├── frontend/      # 前端项目模板
    │   └── backend/       # 后端项目模板
    ├── documents/         # 文档模板
    │   ├── architecture.md
    │   ├── api.md
    │   └── deployment.md
    └── configs/           # 配置模板
        ├── docker/
        ├── k8s/
        └── ci-cd/
```

## 📚 各分类说明

### 1. best-practices/ - 最佳实践

通用的编码、测试、DevOps、安全和文档编写最佳实践，适用于所有项目。

**使用场景**：

- skill执行时参考最佳实践
- 代码审查时对照标准
- 新人入职时学习

### 2. design-patterns/ - 设计模式

常见的设计模式和架构模式，帮助设计和实现高质量的代码。

**使用场景**：

- 架构设计时选择合适的设计模式
- 代码重构时参考设计模式
- 代码审查时评估设计是否合理

### 3. collaboration/ - 协作相关

技能协作相关文档，包含RACI矩阵、冲突升级路径、集成示例和验证检查清单。

**使用场景**：

- 多技能协作时参考RACI矩阵
- 发生冲突时参考冲突升级路径
- 集成技能时参考集成示例
- 验证技能改进时参考检查清单

### 4. tech-stack/ - 技术栈参考

各个技术栈的详细参考文档，包含快速开始、最佳实践、常见问题等。

**使用场景**：

- 技术选型时评估技术栈
- 开发时查阅API和最佳实践
- 问题排查时查看解决方案

### 5. security/ - 安全参考

安全相关的参考资料，包含OWASP标准、漏洞检查清单、最佳实践等。

**使用场景**：

- 安全审查时参考标准
- 开发时遵循安全最佳实践
- 代码审查时检查安全问题

### 6. architecture/ - 架构参考

常见架构模式的详细说明，帮助设计高质量的架构。

**使用场景**：

- 系统架构设计时选择合适的架构模式
- 架构审查时评估设计是否合理
- 技术分享时参考架构模式

### 7. templates/ - 模板

可复用的项目模板、文档模板、配置模板等。

**使用场景**：

- 新项目启动时使用项目模板
- 编写文档时使用文档模板
- 配置环境时使用配置模板

## 🔍 如何使用Reference

### 1. Skill执行时自动引用

```typescript
// skill执行时自动引用相关reference
const securityEngineer = await useSkill("security-engineer");

// 自动加载security相关的references
const securityRefs = await loadReferences("security", [
  "owasp-top10",
  "authentication",
  "authorization",
  "encryption",
]);

// skill执行时可以参考这些references
await securityEngineer.analyze({
  code: codebase,
  references: securityRefs,
});
```

### 2. 人工查阅

```bash
# 查看某个技术栈的参考
cat references/tech-stack/frontend/react.md

# 查看最佳实践
cat references/best-practices/coding.md

# 查看架构模式
cat references/architecture/hexagonal-architecture.md

# 查看协作相关文档
cat references/collaboration/collaboration-raci.md
cat references/collaboration/conflict-escalation-path.md
cat references/collaboration/integration-example.md
cat references/collaboration/verification-checklist.md
```

### 3. 集成到开发工具

```json
// VS Code settings.json
{
  "codebuddy.reference.path": ".codebuddy/references",
  "codebuddy.reference.autoLoad": true,
  "codebuddy.reference.suggestions": true
}
```

## 📝 贡献指南

### 添加新的reference

1. 确定reference的分类
2. 创建对应的.md文件
3. 按照模板编写内容
4. 更新README.md

### 更新现有reference

1. 找到对应的reference文件
2. 更新内容
3. 记录更新日志

### Reference模板

```markdown
# Reference标题

## 概述

简要描述这个reference的内容和用途

## 核心概念

列出核心概念和关键点

## 最佳实践

列出相关的最佳实践

## 常见问题

列出常见问题和解决方案

## 参考资源

列出外部参考资源链接

## 示例代码

提供示例代码
```

## 🔗 相关资源

- [Skills文档](../skills/README.md)
- [Scripts文档](../scripts/README.md)
- [主README](../README.md)

---

**最后更新**：2026-01-22
**维护者**：CodeBuddy Team
