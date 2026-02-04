# CodeBuddy CI/CD 配置文档

本文档详细说明 CodeBuddy 项目的持续集成配置，包括 CI 工作流的配置项、使用方式和效果说明。

## 目录

- [配置概述](#配置概述)
- [工作流配置详解](#工作流配置详解)
- [GitHub Actions uses 命令详解](#github-actions-uses-命令详解)
- [CI 作业详解](#ci-作业详解)
- [配置文件说明](#配置文件说明)
- [CI 优化](#ci-优化)
- [本地开发指南](#本地开发指南)
- [使用方式](#使用方式)
- [效果说明](#效果说明)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)
- [参考资料](#参考资料)

## 配置概述

### CI 工作流文件

**文件位置**: `.github/workflows/ci.yml`

**工作流名称**: CodeBuddy CI

**主要功能**:

1. 自动化代码质量检查（Markdown Lint、TypeScript Lint）
2. 自动化单元测试执行
3. 测试覆盖率监控
4. 文件完整性验证
5. CI 报告生成
6. 检查结果通知

### 触发条件

CI 工作流在以下情况下自动触发：

```yaml
on:
  push:
    branches: [main, develop]
    paths:
      - ".codebuddy/**"
      - ".github/workflows/**"
  pull_request:
    branches: [main, develop]
    paths:
      - ".codebuddy/**"
      - ".github/workflows/**"
  workflow_dispatch:  # 支持手动触发
```

**触发条件说明**:

| 触发类型 | 说明 | 使用场景 |
|----------|------|----------|
| push to main/develop | 代码推送到 main 或 develop 分支时触发 | 日常开发、合并 PR |
| pull_request | 创建或更新 PR 到 main 或 develop 时触发 | 代码审查、合并前检查 |
| workflow_dispatch | 支持在 GitHub Actions 页面手动触发 | 紧急重跑、调试 CI |
| paths 过滤 | 只在 `.codebuddy/**` 或 `.github/workflows/**` 目录变更时触发 | 跳过无关变更 |

**效果**:

- 确保所有提交都经过检查
- PR 创建时自动运行完整检查
- 支持手动重跑失败的 CI
- 避免无关变更触发 CI，节省资源

## 工作流配置详解

### 顶层配置项

```yaml
name: CodeBuddy CI  # 工作流名称
```

**说明**:

- 工作流名称显示在 GitHub Actions 页面
- 建议使用简洁、清晰的名称
- 支持中文和特殊字符

**效果**: 在 GitHub Actions 页面显示为 "CodeBuddy CI"

---

### runs-on 配置

```yaml
runs-on: ubuntu-latest
```

**配置选项**:

| 值 | 说明 | 使用场景 |
|-----|------|----------|
| ubuntu-latest | 使用最新 Ubuntu 虚拟机 | 标准场景，推荐 |
| ubuntu-22.04 | 使用固定版本 Ubuntu | 需要稳定环境 |
| windows-latest | 使用 Windows 虚拟机 | Windows 专用工具 |
| macos-latest | 使用 macOS 虚拟机 | macOS 专用测试 |

**效果**:

- 默认使用 Ubuntu 22.04 作为运行环境
- 提供稳定的 Linux 环境
- 包含常用工具和 Node.js

---

### needs 依赖关系

```yaml
needs: [markdown-lint, typescript-lint]
```

**配置说明**:

| 依赖配置 | 说明 | 示例 |
|----------|------|------|
| needs: [job1] | 等待 job1 完成后执行 | `needs: [markdown-lint]` |
| needs: [job1, job2] | 等待 job1 和 job2 都完成后执行 | `needs: [markdown-lint, typescript-lint]` |
| 无 needs | 立即执行，无依赖 | `runs-on: ubuntu-latest` |

**效果**:

- markdown-lint 和 typescript-lint 并行执行
- test 作业等待两个 lint 都通过后才开始
- 失败的作业会阻塞依赖它的作业

---

### if 条件执行

```yaml
if: always()
```

**配置选项**:

| 条件 | 说明 | 示例 |
|------|------|------|
| success() | 只在前置作业成功时执行 | `if: success()` |
| failure() | 只在前置作业失败时执行 | `if: failure()` |
| always() | 无论前置作业成功或失败都执行 | `if: always()` |
| cancelled() | 只在前置作业被取消时执行 | `if: cancelled()` |

**效果**:

- notify 作业无论前面成功或失败都会执行
- 确保总是发送通知
- 适合汇总所有作业状态的场景

## GitHub Actions uses 命令详解

GitHub Actions 中 `uses` 关键字用于引用和执行预定义的 Actions（可重用的工作流步骤）。以下是常见的 `uses` 命令及其分类和含义。

### 一、核心操作类

#### 1. 代码检出

```yaml
- uses: actions/checkout@v4
```

**含义**：检出代码到运行环境。

**常用参数**：

| 参数 | 说明 | 示例 |
|------|------|------|
| fetch-depth | 克隆深度（0 表示完整历史） | `fetch-depth: 0` |
| ref | 指定分支或标签 | `ref: develop` |
| path | 检出路径 | `path: ./subdirectory` |

**用途**：

- 克隆代码仓库到虚拟机
- 提供完整的工作目录
- 包含所有分支和标签信息

**示例**：

```yaml
- name: Checkout 代码
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
    ref: ${{ github.ref }}
```

---

#### 2. 环境设置

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: 'npm'
```

**含义**：设置编程语言环境。

**支持的 Actions**：

| Action | 语言 | 缓存参数 |
|--------|------|----------|
| actions/setup-node@v4 | Node.js | `cache: 'npm'` |
| actions/setup-python@v4 | Python | `cache: 'pip'` |
| actions/setup-go@v4 | Go | `cache: true` |
| actions/setup-java@v4 | Java | `distribution: 'temurin'` |

**用途**：

- 安装指定版本的语言运行时
- 配置包管理器（npm, pip, go mod 等）
- 设置 PATH 环境变量
- 自动缓存依赖以加速构建

**示例**：

```yaml
- name: 设置 Node.js 环境
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    cache-dependency-path: .codebuddy/package-lock.json
```

**版本选择建议**：

| 版本 | 说明 | 推荐场景 |
|------|------|----------|
| 20 | LTS 版本，稳定 | 推荐，生产环境 |
| 18 | LTS 版本，兼容性好 | 旧项目 |
| latest | 最新版本 | 开发测试 |

---

### 二、构建产物管理

#### 3. 上传产物

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: artifact-name
    path: ./dist
    retention-days: 30
```

**含义**：上传文件或目录为构建产物。

**参数说明**：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| name | Artifact 名称 | `artifact` |
| path | 要上传的文件或目录路径 | 必填 |
| retention-days | 保留天数 | 90 |
| compression-level | 压缩级别（0-9） | 6 |
| if-no-files-found | 无文件时的行为 | `warn` |

**用途**：

- 在不同 job 间共享文件
- 保存测试报告、构建结果
- 供后续下载查看

**示例**：

```yaml
- name: 上传测试报告
  uses: actions/upload-artifact@v4
  with:
    name: test-report
    path: .codebuddy/test/coverage/
    retention-days: 7
    if-no-files-found: error
```

---

#### 4. 下载产物

```yaml
- uses: actions/download-artifact@v4
  with:
    name: artifact-name
    path: ./output
```

**含义**：从其他 job 下载构建产物。

**参数说明**：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| name | Artifact 名称 | 下载所有 |
| path | 下载路径 | 当前目录 |
| pattern | 通配符模式 | - |

**用途**：

- 从之前的 job 下载文件
- 在多 job 工作流中传递数据
- 合并多个 artifact

**示例**：

```yaml
- name: 下载所有 artifacts
  uses: actions/download-artifact@v4
  with:
    path: ./artifacts

- name: 下载特定 artifact
  uses: actions/download-artifact@v4
  with:
    name: ci-report
    path: ./reports
```

---

### 三、测试和覆盖率

#### 5. Codecov

```yaml
- uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
    fail_ci_if_error: true
```

**含义**：上传测试覆盖率到 Codecov。

**参数说明**：

| 参数 | 说明 | 示例 |
|------|------|------|
| token | Codecov API 令牌 | `${{ secrets.CODECOV_TOKEN }}` |
| files | 覆盖率报告文件 | `./coverage/lcov.info` |
| flags | 标识报告 | `unittests`, `integration` |
| name | 报告名称 | `codecov-umbrella` |
| fail_ci_if_error | 上传失败时是否终止 CI | `true` / `false` |
| verbose | 显示详细输出 | `true` |

**用途**：

- 自动上传覆盖率到 Codecov
- 在 PR 中显示覆盖率变化
- 提供历史覆盖率趋势
- 生成覆盖率徽章

**GitHub Secrets 配置**：

1. 访问仓库设置：`Settings → Secrets and variables → Actions`
2. 点击 "New repository secret"
3. Name: `CODECOV_TOKEN`
4. Value: 你的 Codecov token
5. 点击 "Add secret"

**示例**：

```yaml
- name: 上传覆盖率报告
  uses: codecov/codecov-action@v4
  with:
    files: ./.codebuddy/test/coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
    verbose: true
```

---

### 四、Git 操作

#### 6. 创建 Pull Request

```yaml
- uses: peter-evans/create-pull-request@v6
  with:
    title: "Automated PR"
    body: "This is an automated PR"
    branch: automated-changes
```

**含义**：自动创建或更新 PR。

**参数说明**：

| 参数 | 说明 | 示例 |
|------|------|------|
| title | PR 标题 | "Automated PR" |
| body | PR 内容 | "描述信息" |
| branch | 新建分支 | `automated-changes` |
| base | 目标分支 | `main` |
| labels | PR 标签 | `automated, ci` |
| reviewers | 审查者 | `@user1, @user2` |

**用途**：

- 自动化代码更新
- 创建依赖更新 PR
- 生成文档更新 PR
- 自动修复问题

**示例**：

```yaml
- name: 创建 PR
  uses: peter-evans/create-pull-request@v6
  with:
    title: "Update dependencies"
    body: "Automated dependency update"
    branch: deps/update
    labels: dependencies, automated
```

---

### 五、通知和报告

#### 7. Slack 通知

```yaml
- uses: slackapi/slack-github-action@v1.25.0
  with:
    payload: |
      {
        "text": "Build completed!"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**含义**：发送 Slack 通知。

**参数说明**：

| 参数 | 说明 |
|------|------|
| payload | JSON 格式的消息内容 |
| SLACK_WEBHOOK_URL | Slack Webhook URL |

**用途**：

- 构建成功/失败通知
- PR 合并通知
- 部署完成通知

---

### 六、缓存优化

#### 8. 缓存依赖

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**含义**：缓存依赖以加速构建。

**参数说明**：

| 参数 | 说明 | 示例 |
|------|------|------|
| path | 要缓存的路径 | `node_modules`, `~/.npm` |
| key | 缓存键（唯一标识） | `${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}` |
| restore-keys | 备用缓存键 | `${{ runner.os }}-node-` |
| enableCrossOsArchive | 跨操作系统缓存 | `true` |

**用途**：

- 加速依赖安装
- 减少网络请求
- 节省 GitHub Actions 分钟数
- 提高 CI 执行速度

**缓存策略**：

| 场景 | path | key |
|------|------|-----|
| Node.js 依赖 | `node_modules` | `${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}` |
| Python 依赖 | `~/.cache/pip` | `${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}` |
| Go 依赖 | `~/go/pkg/mod` | `${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}` |

**示例**：

```yaml
- name: 缓存 node_modules
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

---

### 七、版本管理

#### 9. 语义化版本

```yaml
- uses: cycjimmy/semantic-release-action@v3
  with:
    semantic_version: 19
    extra_plugins: |
      @semantic-release/git
      @semantic-release/changelog
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**含义**：自动发布新版本。

**用途**：

- 根据提交历史自动版本号
- 创建 Git tag
- 生成 CHANGELOG
- 发布 GitHub Release

---

### 八、Docker 操作

#### 10. Docker 登录

```yaml
- uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

**含义**：登录到 Docker Hub 或其他容器注册表。

**参数说明**：

| 参数 | 说明 |
|------|------|
| username | Docker Hub 用户名 |
| password | Docker Hub 密码或 token |
| registry | 容器注册表地址（默认 Docker Hub） |
| logout | 登出（默认 true） |

**用途**：

- 为后续的构建和推送步骤认证

---

#### 11. Docker 构建和推送

```yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: user/app:latest
```

**含义**：构建并推送 Docker 镜像。

**参数说明**：

| 参数 | 说明 | 示例 |
|------|------|------|
| context | 构建上下文路径 | `.` |
| dockerfile | Dockerfile 路径 | `./Dockerfile` |
| push | 是否推送镜像 | `true` / `false` |
| tags | 镜像标签 | `user/app:latest, user/app:v1.0` |
| platforms | 目标平台 | `linux/amd64,linux/arm64` |

**用途**：

- 构建 Docker 镜像
- 推送到容器注册表
- 多平台构建

---

### 九、自定义 Actions

#### 12. 使用仓库内的 Action

```yaml
- uses: ./.github/actions/my-custom-action
  with:
    param1: value1
```

**含义**：使用同一仓库中的自定义 Action。

**结构**：

```text
.github/
  actions/
    my-custom-action/
      action.yml
      index.js
```

**action.yml 示例**：

```yaml
name: 'My Custom Action'
description: 'A custom GitHub Action'
inputs:
  param1:
    description: 'First parameter'
    required: true
runs:
  using: 'node20'
  main: 'index.js'
```

**用途**：

- 创建可重用的工作流步骤
- 封装复杂的逻辑
- 在多个工作流中共享

---

#### 13. 使用其他仓库的 Action

```yaml
- uses: octocat/awesome-action@v1
  with:
    param: value
```

**含义**：使用 GitHub 上公开的第三方 Action。

**来源**：

- GitHub Marketplace
- 其他公开仓库
- 组织内的私有仓库

---

### 十、版本号说明

**版本号格式**：

| 格式 | 说明 | 示例 |
|------|------|------|
| `@v4` | 引用主要版本 | `actions/checkout@v4` |
| `@v4.1.0` | 引用具体版本 | `actions/checkout@v4.1.0` |
| `@main` | 引用最新分支 | `actions/checkout@main` |
| 无版本 | 使用最新 | `actions/checkout`（不推荐） |

**推荐实践**：

- ✅ 使用 `@v4`：自动获取最新的 v4.x 版本
- ✅ 使用 `@v4.1.0`：完全锁定版本，最稳定
- ❌ 使用 `@main`：不推荐生产使用
- ❌ 不指定版本：行为不可预测

---

### 当前项目中使用的 uses 命令

在 CodeBuddy 项目的 CI 配置中，使用了以下 `uses` 命令：

#### 代码检出

```yaml
- uses: actions/checkout@v4
```

**使用位置**：所有作业的第一个步骤

**用途**：克隆代码仓库到虚拟机

---

#### 设置 Node.js 环境

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
```

**使用位置**：需要 Node.js 的作业

**用途**：安装 Node.js 20，配置 npm

---

#### 上传覆盖率报告

```yaml
- uses: codecov/codecov-action@v4
  with:
    files: ./.codebuddy/test/coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
```

**使用位置**：test 作业

**用途**：上传测试覆盖率到 Codecov

---

#### 上传构建产物

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: ci-report
    path: .codebuddy/CI_REPORT.md
```

**使用位置**：docs-build 作业

**用途**：上传 CI 报告作为 artifact

---

### uses 命令最佳实践

#### 1. 固定版本

始终使用固定版本而不是最新版本：

```yaml
# ✅ 推荐
- uses: actions/checkout@v4

# ❌ 不推荐
- uses: actions/checkout@latest
```

**原因**：

- 避免意外的破坏性变更
- 确保构建可重现
- 更容易排查问题

---

#### 2. 检查安全性

使用依赖扫描工具检查使用的 Actions：

- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

#### 3. 查看文档

在 [GitHub Marketplace](https://github.com/marketplace?type=actions) 查看 Action 的详细文档和用法。

---

#### 4. 谨慎使用第三方 Actions

优先使用 GitHub 官方 Actions：

- ✅ `actions/*`：官方 Actions
- ⚠️ 第三方 Actions：评估后再使用

---

### 参考资源

- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [创建自定义 Action](https://docs.github.com/en/actions/creating-actions)

---

## CI 作业详解

### 作业 1: Markdown Lint

#### 配置详解 - Markdown Lint

```yaml
markdown-lint:
  name: Markdown Lint
  runs-on: ubuntu-latest
  steps:
    - name: Checkout 代码
      uses: actions/checkout@v4
```

**配置项说明**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 作业名称 | markdown-lint | 作业标识，用于 needs 引用 |
| 显示名称 | Markdown Lint | 在 Actions 页面显示的名称 |
| 运行环境 | ubuntu-latest | 使用 Ubuntu 虚拟机 |

#### 步骤详解 - Markdown Lint

**步骤 1: Checkout 代码**

```yaml
- name: Checkout 代码
  uses: actions/checkout@v4
```

**配置说明**:

| 参数 | 说明 |
|------|------|
| name | 步骤名称 |
| uses | 使用的 GitHub Action |
| @v4 | Action 版本，建议固定版本确保稳定性 |

**效果**:

- 克隆代码仓库到虚拟机
- 提供完整的工作目录
- 包含所有分支和标签信息

---

**步骤 2: 安装 Node.js**

```yaml
- name: 安装 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
```

**配置说明**:

| 参数 | 值 | 说明 |
|------|-----|------|
| node-version | "20" | 指定 Node.js 版本 |
| with | 配置参数 | 传递给 Action 的参数 |

**版本选择**:

| 版本 | 说明 | 推荐场景 |
|------|------|----------|
| 20 | LTS 版本，稳定 | 推荐，生产环境 |
| 18 | LTS 版本，兼容性好 | 旧项目 |
| latest | 最新版本 | 开发测试 |

**效果**:

- 安装指定版本的 Node.js
- 配置 npm、npx 等工具
- 设置 PATH 环境变量

---

**步骤 3: 安装 markdownlint-cli**

```yaml
- name: 安装 markdownlint-cli
  run: npm install -g markdownlint-cli2
```

**配置说明**:

| 参数 | 说明 |
|------|------|
| run | 在 shell 中执行命令 |
| -g | 全局安装 |

**效果**:

- 全局安装 markdownlint-cli2
- 可直接使用 `markdownlint-cli2` 命令
- 无需在 package.json 中声明依赖

---

**步骤 4: 运行 Markdown Lint**

```yaml
- name: 运行 Markdown Lint
  run: |
    markdownlint-cli2 '.codebuddy/**/*.md' '.codebuddy/**/*.MD'
```

**命令说明**:

| 参数 | 说明 |
|------|------|
| '.codebuddy/**/*.md' | 检查所有 .md 文件 |
| '.codebuddy/**/*.MD' | 检查所有 .MD 文件 |
| \| | 多行命令，用于格式化 |

**效果**:

- 检查所有 Markdown 文件的格式
- 发现并报告不符合规范的文件
- 失败时输出具体错误信息

---

#### 使用方式 - Markdown Lint

**本地运行**:

```bash
# 安装 markdownlint-cli2
npm install -g markdownlint-cli2

# 检查所有 Markdown 文件
markdownlint-cli2 '.codebuddy/**/*.md'

# 自动修复可修复的问题
markdownlint-cli2 --fix '.codebuddy/**/*.md'
```

**CI 中的执行**:

1. 代码推送到 main/develop 分支
2. GitHub Actions 自动触发 markdown-lint 作业
3. 按顺序执行上述 5 个步骤
4. 如果所有步骤成功，作业通过
5. 如果任何步骤失败，作业失败

---

#### 效果说明 - Markdown Lint

**成功场景**:

```text
✅ Checkout 代码 - 成功克隆仓库
✅ 安装 Node.js - Node 20.10.0 安装完成
✅ 安装 markdownlint-cli - markdownlint-cli2@3.7.1 安装完成
✅ 运行 Markdown Lint - 检查了 45 个文件，0 个错误
✅ 检查 Markdown 合规性 - 所有文件符合规范
```

**失败场景**:

```text
❌ Checkout 代码 - 成功克隆仓库
❌ 安装 Node.js - Node 20.10.0 安装完成
❌ 安装 markdownlint-cli - markdownlint-cli2@3.7.1 安装完成
❌ 运行 Markdown Lint - 发现 5 个错误
  - README.md:12:1 MD013/line-length Line length [Expected: 120; Actual: 150]
  - SKILL.md:45:1 MD024/no-duplicate-heading Multiple headings
❌ 作业失败 - Markdown Lint 发现错误
```

**输出示例**:

```text
.codebuddy/README.md:12:1 MD013/line-length Line length [Expected: 120; Actual: 150]

  11 | # CodeBuddy 技能体系
  12 | 本技能体系包含 18 个专业技能，覆盖产品开发的全流程。
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

---

### 作业 2: TypeScript Lint

#### 配置详解 - TypeScript Lint

```yaml
typescript-lint:
  name: TypeScript Lint
  runs-on: ubuntu-latest
  steps:
    - name: Checkout 代码
      uses: actions/checkout@v4

    - name: 安装 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "20"

    - name: 安装依赖
      run: |
        cd .codebuddy
        npm ci
```

#### 步骤详解 - TypeScript Lint

**步骤 1-3**: 与 markdown-lint 类似

**步骤 3: 安装依赖**

```yaml
- name: 安装依赖
  run: |
    cd .codebuddy
    npm ci
```

**命令说明**:

| 命令 | 说明 | 与 npm install 的区别 |
|------|------|----------------------|
| npm ci | 安装 package-lock.json 中的精确版本 | 更快、更安全、适合 CI |
| npm install | 可能安装更新版本的依赖 | 较慢、不适合 CI |

**效果**:

- 快速安装精确版本的依赖
- 跳过 package.json 版本范围解析
- 确保构建可重现

---

**步骤 4: 运行 TypeScript Lint**

```yaml
- name: 运行 TypeScript Lint
  run: |
    cd .codebuddy
    npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts
```

**命令说明**:

| 参数 | 说明 |
|------|------|
| skills/**/*.ts | 检查 skills 目录下所有 .ts 文件 |
| scripts/**/*.ts | 检查 scripts 目录下所有 .ts 文件 |
| --ext .ts | 指定文件扩展名为 .ts |
| npx | 运行本地的 node_modules 中的 eslint |

**效果**:

- 检查所有 TypeScript 代码
- 根据 .eslintrc.json 的规则进行检查
- 输出发现的错误和警告

---

**步骤 5: 检查 Lint 错误**

```yaml
- name: 检查 Lint 错误
  run: |
    cd .codebuddy
    if npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts --max-warnings 0; then
      echo "✅ TypeScript 代码符合规范"
    else
      echo "❌ TypeScript Lint 失败"
      exit 1
    fi
```

**命令说明**:

| 参数 | 说明 |
|------|------|
| --max-warnings 0 | 警告也被视为错误 |
| if ...; then ... fi | Shell 条件判断 |
| exit 1 | 非零退出码表示失败 |

**效果**:

- 将警告也视为失败
- 提供清晰的通过/失败消息
- 确保 CI 在有警告时失败

---

#### 使用方式 - TypeScript Lint

**本地运行**:

```bash
cd .codebuddy

# 安装依赖
npm install

# 运行 Lint
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts

# 自动修复可修复的问题
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts --fix
```

**CI 中的执行**:

1. 代码推送到 main/develop 分支
2. GitHub Actions 自动触发 typescript-lint 作业
3. 与 markdown-lint 并行执行
4. 如果所有步骤成功，作业通过
5. 如果任何步骤失败，作业失败

---

#### 效果说明 - TypeScript Lint

**成功场景**:

```text
✅ Checkout 代码 - 成功克隆仓库
✅ 安装 Node.js - Node 20.10.0 安装完成
✅ 安装依赖 - 123 个包在 15s 内安装完成
✅ 运行 TypeScript Lint - 检查了 45 个文件，0 个错误
✅ 检查 Lint 错误 - ✅ TypeScript 代码符合规范
```

**失败场景**:

```text
❌ Checkout 代码 - 成功克隆仓库
❌ 安装 Node.js - Node 20.10.0 安装完成
❌ 安装依赖 - 123 个包在 15s 内安装完成
❌ 运行 TypeScript Lint - 发现 3 个错误，5 个警告
  /codebuddy/scripts/utils/logger.ts:45:5 error  no-console: Unexpected console statement
  /codebuddy/skills/tester/scripts/test-generator.ts:78:10 warning @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type
❌ 检查 Lint 错误 - ❌ TypeScript Lint 失败
```

---

### 作业 3: 单元测试

#### 配置详解 - 单元测试

```yaml
test:
  name: 单元测试
  runs-on: ubuntu-latest
  needs: [markdown-lint, typescript-lint]
  steps:
    - name: Checkout 代码
      uses: actions/checkout@v4

    - name: 安装 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "20"

    - name: 安装依赖
      run: |
        cd .codebuddy
        npm ci

    - name: 运行单元测试
      run: |
        cd .codebuddy
        npm run test:unit

    - name: 检查测试覆盖率
      run: |
        cd .codebuddy
        npm run test:unit:coverage

    - name: 上传覆盖率报告
      uses: codecov/codecov-action@v4
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
        files: ./.codebuddy/test/coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
      continue-on-error: true

    - name: 检查覆盖率阈值
      run: |
        cd .codebuddy
        coverage=$(cat test/coverage/coverage-summary.json | jq '.total.lines.pct')
        echo "代码行覆盖率: $coverage%"
        if (( $(echo "$coverage < 95" | bc -l) )); then
          echo "❌ 覆盖率不达标（要求 95%，实际 $coverage%）"
          exit 1
        else
          echo "✅ 覆盖率达标（$coverage%）"
        fi
```

#### 依赖关系 - 单元测试

```yaml
needs: [markdown-lint, typescript-lint]
```

**效果**:

- 等待 markdown-lint 和 typescript-lint 都完成后才开始
- 如果任何一个 lint 失败，test 作业不会执行
- 节省 CI 资源和执行时间

---

#### 步骤详解 - 单元测试

**步骤 1-3**: 与前面作业类似

**步骤 4: 运行单元测试**

```yaml
- name: 运行单元测试
  run: |
    cd .codebuddy
    npm run test:unit
```

**命令说明**:

```bash
# test:unit 脚本定义在 package.json
"scripts": {
  "test:unit": "jest --config=test/jest.config.js"
}
```

**效果**:

- 运行所有单元测试用例
- 输出测试结果
- 失败时作业失败

---

**步骤 5: 检查测试覆盖率**

```yaml
- name: 检查测试覆盖率
  run: |
    cd .codebuddy
    npm run test:unit:coverage
```

**命令说明**:

```bash
# test:unit:coverage 脚本
"scripts": {
  "test:unit:coverage": "jest --config=test/jest.config.js --coverage"
}
```

**效果**:

- 运行测试并生成覆盖率报告
- 输出覆盖率统计
- 生成 lcov.info 和 HTML 报告

---

**步骤 6: 上传覆盖率报告**

```yaml
- name: 上传覆盖率报告
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./.codebuddy/test/coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
  continue-on-error: true
```

**配置说明**:

| 参数 | 说明 |
|------|------|
| token | Codecov API 令牌，存储在 GitHub Secrets |
| files | 覆盖率报告文件路径 |
| flags | 标记报告为单元测试 |
| name | 报告名称，用于聚合 |
| continue-on-error: true | 即使上传失败也继续执行 |

**GitHub Secrets 配置**:

1. 访问仓库设置：`Settings → Secrets and variables → Actions`
2. 点击 "New repository secret"
3. Name: `CODECOV_TOKEN`
4. Value: 你的 Codecov token
5. 点击 "Add secret"

**效果**:

- 自动上传覆盖率到 Codecov
- 在 PR 中显示覆盖率变化
- 提供历史覆盖率趋势
- 失败时不阻塞 CI

---

**步骤 7: 检查覆盖率阈值**

```yaml
- name: 检查覆盖率阈值
  run: |
    cd .codebuddy
    coverage=$(cat test/coverage/coverage-summary.json | jq '.total.lines.pct')
    echo "代码行覆盖率: $coverage%"
    if (( $(echo "$coverage < 95" | bc -l) )); then
      echo "❌ 覆盖率不达标（要求 95%，实际 $coverage%）"
      exit 1
    else
      echo "✅ 覆盖率达标（$coverage%）"
    fi
```

**命令说明**:

| 命令 | 说明 |
|------|------|
| cat | 读取文件内容 |
| jq | JSON 解析工具，提取字段 |
| bc | 浮点数计算工具 |
| $(()) | Shell 算术比较 |

**覆盖率阈值配置**:

```javascript
// test/jest.config.js
coverageThreshold: {
  global: {
    branches: 75,      // 分支覆盖率 >= 75%
    functions: 100,    // 函数覆盖率 100%
    lines: 95,         // 行覆盖率 >= 95%
    statements: 95      // 语句覆盖率 >= 95%
  }
}
```

**效果**:

- 检查覆盖率是否达到阈值
- 不达标时作业失败
- 提供清晰的覆盖率百分比

---

#### 使用方式 - 单元测试

**本地运行**:

```bash
cd .codebuddy

# 运行测试
npm run test:unit

# 运行测试并生成覆盖率
npm run test:unit:coverage

# 查看覆盖率报告
open test/coverage/index.html
```

**CI 中的执行**:

1. 等待 markdown-lint 和 typescript-lint 完成
2. 如果都通过，开始执行 test 作业
3. 按顺序执行 7 个步骤
4. 如果任何步骤失败，作业失败

---

#### 效果说明 - 单元测试

**成功场景**:

```text
✅ Checkout 代码 - 成功克隆仓库
✅ 安装 Node.js - Node 20.10.0 安装完成
✅ 安装依赖 - 123 个包在 15s 内安装完成
✅ 运行单元测试 - 587 个测试，全部通过，耗时 25.3s
✅ 检查测试覆盖率 - 覆盖率报告生成完成
✅ 上传覆盖率报告 - 成功上传到 Codecov
✅ 检查覆盖率阈值 - 代码行覆盖率: 96.2% ✅ 覆盖率达标（96.2%）
```

**失败场景**:

```text
❌ Checkout 代码 - 成功克隆仓库
❌ 安装 Node.js - Node 20.10.0 安装完成
❌ 安装依赖 - 123 个包在 15s 内安装完成
❌ 运行单元测试 - 587 个测试，3 个失败
  ● TestGenerator › generateTestCases › should generate test cases
    expect(received).toHaveLength(expected)
    Expected length: 6, Received: 5
❌ 检查测试覆盖率 - 测试失败，跳过覆盖率检查
```

**覆盖率示例**:

```text
----------|---------|----------|---------|---------|------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|------------------
All files  |    96.2 |     78.5 |   100 |   96.2 |                 86
 scripts   |    98.5 |     82.3 |   100 |   98.5 |                  12
 skills    |    95.8 |     76.2 |   100 |   95.8 |                  74
----------|---------|----------|---------|---------|------------------
```

---

### 作业 4: 集成检查

#### 配置详解 - 集成检查

```yaml
integration-check:
  name: 集成检查
  runs-on: ubuntu-latest
  needs: [test]
  steps:
    - name: Checkout 代码
      uses: actions/checkout@v4

    - name: 检查文件完整性
      run: |
        # 检查脚本完整性...
        # 检查所有核心脚本文件是否存在

    - name: 检查 README 文档
      run: |
        # 检查文档完整性...
        # 检查所有 README 文件是否存在

    - name: 检查配置文件
      run: |
        # 检查配置文件...
        # 检查配置文件是否存在
```

#### 依赖关系 - 集成检查

```yaml
needs: [test]
```

**效果**:

- 等待 test 作业完成
- 如果测试失败，不执行集成检查
- 确保只有通过测试的代码才进行集成检查

---

#### 步骤详解 - 集成检查

**步骤 1: Checkout 代码**

```yaml
- name: Checkout 代码
  uses: actions/checkout@v4
```

**效果**: 克隆代码仓库到虚拟机

---

**步骤 2: 检查文件完整性**

```yaml
- name: 检查文件完整性
  run: |
    echo "检查脚本完整性..."

    # 检查 generators 目录
    if [ ! -f ".codebuddy/scripts/generators/code-generator.ts" ]; then
      echo "❌ 缺少: code-generator.ts"
      exit 1
    fi

    if [ ! -f ".codebuddy/scripts/generators/doc-generator.ts" ]; then
      echo "❌ 缺少: doc-generator.ts"
      exit 1
    fi

    # ... 更多文件检查

    echo "✅ 所有核心脚本文件存在"
```

**检查文件列表**:

| 类别 | 文件路径 | 说明 |
|------|----------|------|
| Generators | scripts/generators/code-generator.ts | 代码生成器 |
| Generators | scripts/generators/doc-generator.ts | 文档生成器 |
| Utils | scripts/utils/logger.ts | 日志工具 |
| Utils | scripts/utils/file-manager.ts | 文件管理工具 |
| Utils | scripts/utils/context-manager.ts | 上下文管理工具 |
| Validators | scripts/validators/code-validator.ts | 代码验证器 |
| Validators | scripts/validators/config-validator.ts | 配置验证器 |

**效果**:

- 检查所有核心脚本文件是否存在
- 缺少文件时作业失败
- 提供清晰的错误信息

---

**步骤 3: 检查 README 文档**

```yaml
- name: 检查 README 文档
  run: |
    echo "检查文档完整性..."

    if [ ! -f ".codebuddy/scripts/README.md" ]; then
      echo "❌ 缺少: scripts/README.md"
      exit 1
    fi

    if [ ! -f ".codebuddy/scripts/generators/README.md" ]; then
      echo "❌ 缺少: generators/README.md"
      exit 1
    fi

    # ... 更多文档检查

    echo "✅ 所有文档文件存在"
```

**检查文档列表**:

| 文档路径 | 说明 |
|----------|------|
| scripts/README.md | 脚本目录总览 |
| scripts/generators/README.md | 生成器文档 |
| scripts/utils/README.md | 工具文档 |
| scripts/validators/README.md | 验证器文档 |
| scripts/INTEGRATION_EXAMPLE.md | 集成示例 |

**效果**:

- 确保所有必要的 README 文件存在
- 缺少文档时作业失败
- 促进文档完整性

---

**步骤 4: 检查配置文件**

```yaml
- name: 检查配置文件
  run: |
    echo "检查配置文件..."

    if [ ! -f ".codebuddy/.markdownlintrc.json" ]; then
      echo "❌ 缺少: .markdownlintrc.json"
      exit 1
    fi

    if [ ! -f ".codebuddy/.eslintrc.json" ]; then
      echo "❌ 缺少: .eslintrc.json"
      exit 1
    fi

    echo "✅ 配置文件检查完成"
```

**检查配置文件列表**:

| 配置文件 | 说明 |
|----------|------|
| .markdownlintrc.json | Markdown Lint 配置 |
| .eslintrc.json | TypeScript Lint 配置 |
| .github/workflows/ci.yml | CI 工作流配置 |

**效果**:

- 确保所有必要的配置文件存在
- 缺少配置时作业失败
- 确保工具可以正常运行

---

#### 使用方式 - 集成检查

**本地运行**:

```bash
# 检查文件完整性
find .codebuddy/scripts -name "*.ts" | xargs ls -la

# 检查 README 文件
find .codebuddy/scripts -name "README.md" | xargs ls -la

# 检查配置文件
ls -la .codebuddy/.*json .codebuddy/.github/workflows/*.yml
```

**CI 中的执行**:

1. 等待 test 作业完成
2. 如果测试通过，开始执行 integration-check 作业
3. 按顺序执行 4 个步骤
4. 如果任何步骤失败，作业失败

---

#### 效果说明 - 集成检查

**成功场景**:

```text
✅ Checkout 代码 - 成功克隆仓库
✅ 检查文件完整性 - ✅ 所有核心脚本文件存在
✅ 检查 README 文档 - ✅ 所有文档文件存在
✅ 检查配置文件 - ✅ 配置文件检查完成
```

**失败场景**:

```text
❌ Checkout 代码 - 成功克隆仓库
❌ 检查文件完整性 - ❌ 缺少: code-validator.ts
  错误: 文件 .codebuddy/scripts/validators/code-validator.ts 不存在
❌ 作业失败 - 集成检查发现缺失文件
```

---

### 作业 5: 文档构建

#### 配置详解 - 文档构建

```yaml
docs-build:
  name: 构建文档
  runs-on: ubuntu-latest
  needs: [test]
  steps:
    - name: Checkout 代码
      uses: actions/checkout@v4

    - name: 安装 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "20"

    - name: 生成文档报告
      run: |
        cd .codebuddy
        echo "# CI 检查报告" > CI_REPORT.md
        echo "" >> CI_REPORT.md
        echo "生成时间: $(date -u +'%Y-%m-%dT%H:%M:%SZ')" >> CI_REPORT.md
        echo "" >> CI_REPORT.md
        echo "## 检查结果" >> CI_REPORT.md
        echo "- Markdown Lint: ✅ 通过" >> CI_REPORT.md
        echo "- TypeScript Lint: ✅ 通过" >> CI_REPORT.md
        echo "- 单元测试: ✅ 通过" >> CI_REPORT.md
        echo "- 文档完整性: ✅ 通过" >> CI_REPORT.md

    - name: 上传文档
      uses: actions/upload-artifact@v4
      with:
        name: ci-report
        path: .codebuddy/CI_REPORT.md
```

#### 步骤详解 - 文档构建

**步骤 1-3**: 与前面作业类似

**步骤 4: 生成文档报告**

```yaml
- name: 生成文档报告
  run: |
    cd .codebuddy
    echo "# CI 检查报告" > CI_REPORT.md
    echo "" >> CI_REPORT.md
    echo "生成时间: $(date -u +'%Y-%m-%dT%H:%M:%SZ')" >> CI_REPORT.md
    echo "" >> CI_REPORT.md
    echo "## 检查结果" >> CI_REPORT.md
    echo "- Markdown Lint: ✅ 通过" >> CI_REPORT.md
    echo "- TypeScript Lint: ✅ 通过" >> CI_REPORT.md
    echo "- 单元测试: ✅ 通过" >> CI_REPORT.md
    echo "- 文档完整性: ✅ 通过" >> CI_REPORT.md
```

**命令说明**:

| 命令 | 说明 |
|------|------|
| echo "" >> CI_REPORT.md | 追加空行 |
| date -u | UTC 时间戳 |
| > | 覆盖写入 |
| >> | 追加写入 |

**输出格式**:

```markdown
# CI 检查报告

生成时间: 2026-01-27T12:30:45Z

## 检查结果
- Markdown Lint: ✅ 通过
- TypeScript Lint: ✅ 通过
- 单元测试: ✅ 通过
- 文档完整性: ✅ 通过
```

**效果**:

- 生成 CI 检查报告
- 记录所有检查项的状态
- 包含时间戳

---

**步骤 5: 上传文档**

```yaml
- name: 上传文档
  uses: actions/upload-artifact@v4
  with:
    name: ci-report
    path: .codebuddy/CI_REPORT.md
```

**配置说明**:

| 参数 | 说明 |
|------|------|
| name | Artifact 名称 |
| path | 要上传的文件或目录路径 |

**效果**:

- 上传 CI_REPORT.md 作为 artifact
- 可在 GitHub Actions 页面下载
- 保留 90 天

---

#### 使用方式 - 文档构建

**本地运行**:

```bash
cd .codebuddy

# 手动生成报告
cat > CI_REPORT.md << EOF
# CI 检查报告

生成时间: $(date -u +'%Y-%m-%dT%H:%M:%SZ')

## 检查结果
- Markdown Lint: ✅ 通过
- TypeScript Lint: ✅ 通过
- 单元测试: ✅ 通过
- 文档完整性: ✅ 通过
EOF

# 查看报告
cat CI_REPORT.md
```

**CI 中的执行**:

1. 等待 test 作业完成
2. 如果测试通过，开始执行 docs-build 作业
3. 按顺序执行 5 个步骤
4. 生成并上传 CI 报告

---

#### 效果说明 - 文档构建

**成功场景**:

```text
✅ Checkout 代码 - 成功克隆仓库
✅ 安装 Node.js - Node 20.10.0 安装完成
✅ 生成文档报告 - CI_REPORT.md 生成完成
✅ 上传文档 - Artifact 'ci-report' 上传成功
```

**Artifact 下载**:

1. 访问 GitHub Actions 页面
2. 点击运行的工作流
3. 在页面底部找到 "Artifacts" 部分
4. 点击 "ci-report" 下载

---

### 作业 6: 通知

#### 配置详解 - 通知

```yaml
notify:
  name: 通知
  runs-on: ubuntu-latest
  needs: [markdown-lint, typescript-lint, test, integration-check, docs-build]
  if: always()
  steps:
    - name: 检查作业状态
      run: |
        if [ "${{ needs.markdown-lint.result }}" == "failure" ] || \
           [ "${{ needs.typescript-lint.result }}" == "failure" ] || \
           [ "${{ needs.test.result }}" == "failure" ] || \
           [ "${{ needs.integration-check.result }}" == "failure" ]; then
          echo "::warning::CI 检查失败，请查看详细信息"
          exit 1
        else
          echo "::notice::所有 CI 检查通过 ✅"
        fi
```

#### 依赖关系

```yaml
needs: [markdown-lint, typescript-lint, test, integration-check, docs-build]
if: always()
```

**效果**:

- 等待所有前置作业完成
- 无论前置作业成功或失败都执行
- 汇总所有作业的状态

---

#### 步骤详解 - 通知

**步骤 1: 检查作业状态**

```yaml
- name: 检查作业状态
  run: |
    if [ "${{ needs.markdown-lint.result }}" == "failure" ] || \
       [ "${{ needs.typescript-lint.result }}" == "failure" ] || \
       [ "${{ needs.test.result }}" == "failure" ] || \
       [ "${{ needs.integration-check.result }}" == "failure" ]; then
      echo "::warning::CI 检查失败，请查看详细信息"
      exit 1
    else
      echo "::notice::所有 CI 检查通过 ✅"
    fi
```

**命令说明**:

| 表达式 | 说明 |
|--------|------|
| needs.markdown-lint.result | 获取前置作业结果 |
| == "failure" | 检查是否失败 |
| \|\| | 逻辑或运算 |
| ::warning:: | GitHub Actions 警告消息 |
| ::notice:: | GitHub Actions 通知消息 |

**效果**:

- 检查所有前置作业的状态
- 任何失败都显示警告
- 全部通过显示通知

---

#### 使用方式 - 通知

**手动触发**:

1. 访问 GitHub Actions 页面
2. 选择 "CodeBuddy CI" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支，点击 "Run workflow"

**自动触发**:

- 推送代码到 main/develop 分支时自动触发
- 创建 PR 时自动触发

---

#### 效果说明 - 通知

**成功场景**:

```text
✅ 检查作业状态 - ::notice::所有 CI 检查通过 ✅
```

**失败场景**:

```text
❌ 检查作业状态 - ::warning::CI 检查失败，请查看详细信息
```

**GitHub Actions 输出**:

成功时显示绿色的 notice 消息，失败时显示黄色的 warning 消息。

## 配置文件说明

### .markdownlintrc.json

Markdown 文档规范配置，定义了 markdownlint 检查规则。

**主要配置项**:

```json
{
  "default": true,                    // 启用所有默认规则
  "MD013": {                         // 行长度限制
    "line_length": 120,                // 最大 120 字符
    "code_blocks": false,               // 代码块不检查
    "tables": false                     // 表格不检查
  },
  "MD003": {                         // 标题风格
    "style": "setext_with_atx"        // Setext + ATX 混合风格
  },
  "MD024": {                         // 标题重复检查
    "siblings_only": true               // 只检查同级标题
  },
  "MD033": false,                    // 禁用 HTML 标签检查
  "MD041": false,                    // 禁用首行标题检查
  "MD036": false                     // 禁用强调作为标题检查
}
```

**规则说明**:

| 规则 | 说明 | 严重级别 | 默认值 |
|------|------|----------|--------|
| MD013 | 行长度限制 | warn/error | 80 字符 |
| MD003 | 标题风格 | warn/error | consistent |
| MD024 | 标题重复 | error | - |
| MD033 | HTML 标签 | warn/error | - |
| MD041 | 首行标题 | warn/error | - |
| MD036 | 强调作为标题 | warn/error | - |

**本地使用**:

```bash
# 检查所有 Markdown 文件
markdownlint-cli2 '.codebuddy/**/*.md'

# 自动修复可修复的问题
markdownlint-cli2 --fix '.codebuddy/**/*.md'

# 指定配置文件
markdownlint-cli2 -c .markdownlintrc.json '.codebuddy/**/*.md'
```

---

### .eslintrc.json

TypeScript 代码规范配置，定义了 ESLint 检查规则。

**主要配置项**:

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    // TypeScript 规则
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error",

    // 代码质量规则
    "complexity": ["warn", { "max": 15 }],
    "max-lines-per-function": ["warn", { "max": 50 }],

    // 代码风格规则
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],

    // 安全规则
    "no-unsafe-optional": "error",
    "no-console": "off"  // 允许 console（测试中需要）
  },
  "overrides": [
    {
      "files": ["test/**/*.ts", "**/*.test.ts"],
      "env": { "jest": true },
      "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "off"
      }
    }
  ]
}
```

**规则分类**:

| 分类 | 规则示例 | 说明 |
|------|----------|------|
| TypeScript | no-explicit-any | 禁止显式 any 类型 |
| 代码质量 | complexity | 圈复杂度限制 |
| 代码风格 | indent, quotes | 缩进、引号风格 |
| 安全 | no-unsafe-optional | 不安全的可选链 |

**本地使用**:

```bash
# 检查所有 TypeScript 文件
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts

# 自动修复可修复的问题
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts --fix

# 指定配置文件
npx eslint -c .eslintrc.json skills/**/*.ts --ext .ts
```

---

### package.json

定义了 npm 脚本和项目配置。

**主要脚本**:

```json
{
  "scripts": {
    "lint:md": "markdownlint-cli2 '.codebuddy/**/*.md'",
    "lint:ts": "eslint skills/**/*.ts scripts/**/*.ts --ext .ts",
    "lint:ts:fix": "eslint skills/**/*.ts scripts/**/*.ts --ext .ts --fix",
    "test:unit": "jest --config=test/jest.config.js",
    "test:unit:coverage": "jest --config=test/jest.config.js --coverage"
  }
}
```

**脚本说明**:

| 脚本 | 说明 |
|------|------|
| lint:md | 运行 Markdown Lint |
| lint:ts | 运行 TypeScript Lint |
| lint:ts:fix | 自动修复 TypeScript 问题 |
| test:unit | 运行单元测试 |
| test:unit:coverage | 运行测试并生成覆盖率 |

**本地使用**:

```bash
cd .codebuddy

# 运行所有检查
npm run lint:md
npm run lint:ts
npm run test:unit

# 运行测试并生成覆盖率
npm run test:unit:coverage
```

---

## CI 优化

### 优化概述

为了提高 CI 的执行速度和可维护性，对 `.github/workflows/ci.yml` 进行了全面优化。这些优化显著减少了 CI 执行时间，提高了代码质量，并使配置更加易于维护。

**优化效果**：

| 优化项 | 优化前 | 优化后 | 改进 |
|--------|--------|--------|------|
| **并发控制** | 每次都运行 | 自动取消旧运行 | 节省资源 |
| **代码简洁性** | 重复 `cd .codebuddy` | 统一设置工作目录 | 减少 20+ 行代码 |
| **依赖安装时间** | 每次重新安装 | 命中缓存 | 节省 60-90 秒 |
| **覆盖率阈值** | 硬编码 95 | 环境变量 | 更灵活 |
| **CI 报告** | 静态硬编码 | 动态生成 | 更准确 |
| **总体执行时间** | ~5-8 分钟 | ~3-5 分钟 | 节省 30-40% |

---

### 优化 1: 并发控制

#### 并发控制配置

```yaml
# 并发控制：同一分支的多次运行会取消之前的运行
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

#### 并发控制参数

| 参数 | 说明 | 示例 |
|------|------|------|
| group | 并发组标识，同一组的运行会被处理 | `CodeBuddy CI-main` |
| cancel-in-progress | 是否取消正在进行的运行 | `true` |

#### 并发控制机制

1. **分组依据**：使用 `workflow` 名称和 `ref`（分支引用）作为分组键
2. **触发时机**：同一分支有新的运行时
3. **取消策略**：自动取消该分支所有正在进行的运行

#### 并发控制场景

| 场景 | 效果 |
|------|------|
| 连续提交代码到同一分支 | 自动取消之前的 CI 运行 |
| 多个 PR 同时推送到同一分支 | 只保留最新的运行 |
| 手动触发 CI | 会取消之前的自动运行 |

#### 并发控制效果

- 节省 GitHub Actions 分钟数
- 减少不必要的 CI 运行
- 更快获得最新代码的检查结果

---

### 优化 2: 全局环境变量

#### 环境变量配置

```yaml
# 全局环境变量
env:
  COVERAGE_THRESHOLD: 95  # 覆盖率阈值
```

#### 环境变量使用

```yaml
steps:
  - name: 检查覆盖率阈值
    run: |
      coverage=$(cat test/coverage/coverage-summary.json | jq '.total.lines.pct')
      if awk "BEGIN {exit !($coverage < ${{ env.COVERAGE_THRESHOLD }})}"; then
        echo "❌ 覆盖率不达标（要求 ${{ env.COVERAGE_THRESHOLD }}%，实际 $coverage%）"
        exit 1
      fi
```

#### 环境变量优势

| 优势 | 说明 |
|------|------|
| 集中管理 | 阈值定义在一处，易于修改 |
| 灵活调整 | 不同环境可使用不同阈值 |
| 代码清晰 | 使用 `${{ env.COVERAGE_THRESHOLD }}` 更易读 |

---

### 优化 3: 默认工作目录

#### 工作目录配置

```yaml
jobs:
  markdown-lint:
    name: Markdown Lint
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: .codebuddy  # 设置默认工作目录
    steps:
      - name: Checkout 代码
        uses: actions/checkout@v4

      - name: 运行检查
        run: npm test  # 不再需要 cd .codebuddy
```

#### 工作目录对比

**优化前**：

```yaml
steps:
  - name: Checkout 代码
    uses: actions/checkout@v4

  - name: 运行检查
    run: |
      cd .codebuddy
      npm test

  - name: 另一个步骤
    run: |
      cd .codebuddy
      npm run lint
```

**优化后**：

```yaml
defaults:
  run:
    working-directory: .codebuddy
steps:
  - name: Checkout 代码
    uses: actions/checkout@v4

  - name: 运行检查
    run: npm test  # 自动在 .codebuddy 目录执行

  - name: 另一个步骤
    run: npm run lint  # 自动在 .codebuddy 目录执行
```

#### 工作目录效果

- 减少了 20+ 行重复的 `cd .codebuddy` 命令
- 提高代码可读性
- 降低维护成本

#### 工作目录特殊处理

对于不需要 Node.js 环境的作业（如 `integration-check`），设置工作目录为根目录：

```yaml
integration-check:
  name: 集成检查
  runs-on: ubuntu-latest
  needs: [test]
  defaults:
    run:
      working-directory: .  # 根目录
```

---

### 优化 4: 依赖缓存

#### 缓存配置说明

**markdown-lint 作业**：

```yaml
- name: 缓存 markdownlint-cli
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-markdownlint-cli2
    restore-keys: |
      ${{ runner.os }}-npm-
```

**typescript-lint 和 test 作业**：

```yaml
- name: 缓存 node_modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

#### 缓存策略表

| 缓存对象 | 路径 | 缓存键 | 备用键 |
|----------|------|--------|--------|
| 全局 npm 包 | `~/.npm` | `Linux-npm-markdownlint-cli2` | `Linux-npm-` |
| 项目依赖 | `node_modules` | `Linux-node-abc123...` | `Linux-node-` |

#### 缓存工作机制

1. **缓存键生成**：
   - 基于 `runner.os`（操作系统）和 `package-lock.json` 的 hash 值
   - 确保依赖变化时自动失效缓存

2. **缓存查找**：
   - 首先尝试精确匹配（完整缓存键）
   - 如果未命中，尝试备用键（前缀匹配）

3. **缓存更新**：
   - 步骤成功执行后，自动更新缓存

#### 缓存效果对比

| 场景 | 优化前 | 优化后 |
|------|--------|--------|
| 首次运行 | 15-20 秒安装依赖 | 15-20 秒安装依赖 |
| 第二次运行（依赖未变） | 15-20 秒安装依赖 | 1-2 秒恢复缓存 |
| 第二次运行（依赖变化） | 15-20 秒安装依赖 | 15-20 秒安装依赖 |

**节省时间**：命中缓存时节省 60-90 秒

---

### 优化 5: 动态 CI 报告

#### CI 报告配置

**优化前（静态报告）**：

```yaml
needs: [test]

steps:
  - name: 生成文档报告
    run: |
      echo "- Markdown Lint: ✅ 通过" >> CI_REPORT.md
      echo "- TypeScript Lint: ✅ 通过" >> CI_REPORT.md
      echo "- 单元测试: ✅ 通过" >> CI_REPORT.md
      echo "- 文档完整性: ✅ 通过" >> CI_REPORT.md
```

**优化后（动态报告）**：

```yaml
needs: [markdown-lint, typescript-lint, test, integration-check]

steps:
  - name: 生成文档报告
    run: |
      echo "- Markdown Lint: ${{ needs.markdown-lint.result == 'success' && '✅ 通过' || '❌ 失败' }}" >> CI_REPORT.md
      echo "- TypeScript Lint: ${{ needs.typescript-lint.result == 'success' && '✅ 通过' || '❌ 失败' }}" >> CI_REPORT.md
      echo "- 单元测试: ${{ needs.test.result == 'success' && '✅ 通过' || '❌ 失败' }}" >> CI_REPORT.md
      echo "- 文档完整性: ${{ needs.integration-check.result == 'success' && '✅ 通过' || '❌ 失败' }}" >> CI_REPORT.md
```

#### 动态报告表达式说明

GitHub Actions 表达式：`${{ needs.<job>.result == 'success' && '✅ 通过' || '❌ 失败' }}`

| 条件 | 结果 |
|------|------|
| `needs.markdown-lint.result == 'success'` | 真 |
| `'✅ 通过'` | 如果条件为真，返回此值 |
| `'❌ 失败'` | 如果条件为假，返回此值 |

#### 动态报告效果

- 报告内容动态反映实际的检查结果
- 即使部分检查失败，也能准确报告
- 不再是静态的"✅ 通过"硬编码

---

### 优化 6: 改进错误提示

#### 错误提示配置

```yaml
steps:
  - name: 检查作业状态
    run: |
      if [ "${{ needs.test.result }}" == "failure" ]; then
        echo "::warning::CI 检查失败，请查看详细信息"
        echo "::error::请检查失败的作业并修复问题"
        exit 1
      fi
```

#### 错误日志级别

| 日志级别 | 用途 | 显示颜色 |
|----------|------|----------|
| `::notice::` | 通知消息 | 蓝色 |
| `::warning::` | 警告消息 | 黄色 |
| `::error::` | 错误消息 | 红色 |

#### 错误提示效果

- 同时显示 warning 和 error 级别的消息
- 更清晰的用户提示
- 更容易被注意到

---

### 后续可考虑的优化

以下是一些可选的优化，可以根据实际需求选择实施：

#### 1. 上传覆盖率报告为 artifact

**目的**：便于在 `docs-build` 中使用实际覆盖率数据

```yaml
- name: 上传覆盖率报告
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: .codebuddy/test/coverage/
```

#### 2. 矩阵测试

**目的**：测试多个 Node.js 版本

```yaml
test:
  strategy:
    matrix:
      node-version: [18, 20, 'latest']
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
```

#### 3. 并行运行集成检查

**目的**：`integration-check` 与 `docs-build` 并行运行

```yaml
integration-check:
  needs: [test]

docs-build:
  needs: [test]  # 改为只依赖 test
```

---

## 本地开发指南

### 完整检查流程

在提交代码前，建议运行完整的检查流程：

```bash
# 1. Markdown Lint
markdownlint-cli2 '.codebuddy/**/*.md'

# 2. TypeScript Lint
cd .codebuddy
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts

# 3. 单元测试
npm run test:unit

# 4. 测试覆盖率
npm run test:unit:coverage

# 5. 查看覆盖率报告
open test/coverage/index.html
```

### 使用 Git Hooks

配置 Git hooks 自动运行检查：

```bash
# 安装 husky
npm install -D husky

# 初始化 husky
npx husky install

# 创建 pre-commit hook
npx husky add .husky/pre-commit "cd .codebuddy && npm run lint:md && npm run lint:ts && npm run test:unit"
```

**效果**:

- 每次提交前自动运行检查
- 检查失败阻止提交
- 确保代码质量

### 配置 VS Code 集成

在 VS Code 中集成 Lint 工具：

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "markdownlint.config": {
    "extends": ".markdownlintrc.json"
  }
}
```

**推荐扩展**:

1. ESLint - ESLint 集成
2. Prettier - 代码格式化
3. Markdown Lint - Markdown 检查

## 使用方式

### 手动触发 CI

在 GitHub Actions 页面手动触发工作流：

1. 访问仓库的 Actions 页面
2. 选择 "CodeBuddy CI" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支
5. 点击 "Run workflow"

**使用场景**:

- 紧急重跑失败的 CI
- 调试 CI 问题
- 手动验证修复

### 查看运行结果

1. 访问 GitHub Actions 页面
2. 点击运行的工作流
3. 查看每个作业的状态
4. 点击作业查看详细日志

**作业状态**:

| 状态 | 说明 | 图标 |
|------|------|------|
| Pending | 等待中 | ⏳ |
| In progress | 运行中 | 🔄 |
| Success | 成功 | ✅ |
| Failed | 失败 | ❌ |
| Cancelled | 已取消 | ⚪ |

### 下载 Artifacts

下载 CI 生成的文件：

1. 访问运行的工作流页面
2. 滚动到页面底部
3. 找到 "Artifacts" 部分
4. 点击 artifact 下载

**可下载的文件**:

| Artifact | 说明 | 位置 |
|----------|------|------|
| ci-report | CI 检查报告 | .codebuddy/CI_REPORT.md |
| coverage | 测试覆盖率报告 | .codebuddy/test/coverage/ |

## 效果说明

### CI 成功效果

当所有检查通过时：

1. **GitHub Actions 状态**: 绿色 ✅
2. **PR 状态检查**: 显示 "All checks have passed"
3. **合并 PR**: 可以合并
4. **通知**: 显示成功通知

**示例**:

```text
✅ CodeBuddy CI - All checks have passed

markdown-lint     ✅ passed
typescript-lint  ✅ passed
test             ✅ passed (587 tests, coverage 96.2%)
integration-check ✅ passed
docs-build       ✅ passed
notify           ✅ success
```

### CI 失败效果

当任何检查失败时：

1. **GitHub Actions 状态**: 红色 ❌
2. **PR 状态检查**: 显示 "Some checks haven't completed"
3. **合并 PR**: 不能合并
4. **通知**: 显示失败通知

**示例**:

```text
❌ CodeBuddy CI - Some checks haven't completed

markdown-lint     ✅ passed
typescript-lint  ❌ failed (3 errors, 5 warnings)
test             ⏭️ skipped
integration-check ⏭️ skipped
docs-build       ⏭️ skipped
notify           ❌ failure
```

### 覆盖率效果

Codecov 集成效果：

1. **PR 注释**: 显示覆盖率变化
2. **徽章**: 显示在 README.md
3. **历史趋势**: 追踪覆盖率变化

**示例**:

```markdown
Coverage Report
- Base: 94.5%
- Head: 96.2%
- Delta: +1.7% 🟢
- Files: 45
- Lines: 2603/3309
```

## 最佳实践

### 1. 提交前检查

在提交代码前，确保所有检查通过：

```bash
# 完整的检查流程
npm run lint:md
npm run lint:ts
npm run test:unit
npm run test:unit:coverage
```

**效果**:

- 减少失败的 CI 运行
- 快速发现和修复问题
- 保持 CI 绿色状态

### 2. 使用分支策略

遵循分支策略：

1. **main 分支**: 生产代码，受保护
2. **develop 分支**: 开发主分支
3. **feature 分支**: 新功能开发
4. **hotfix 分支**: 紧急修复

**CI 配置**:

```yaml
on:
  push:
    branches: [main, develop]  # 只检查 main 和 develop
  pull_request:
    branches: [main, develop]  # PR 到 main 或 develop
```

**效果**:

- 功能分支不触发完整 CI
- PR 时自动运行检查
- 合并前确保质量

### 3. 处理 Lint 警告

警告不会导致 CI 失败，但应尽快修复：

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",  // 警告
    "complexity": ["warn", { "max": 15 }]        // 警告
  }
}
```

**处理方式**:

1. 在提交前运行 `npm run lint:ts`
2. 查看警告信息
3. 评估影响，决定是否立即修复
4. 优先处理影响代码质量的警告

### 4. 优化 CI 执行时间

优化 CI 执行时间：

1. **并行执行**: markdown-lint 和 typescript-lint 并行
2. **缓存依赖**: 使用 GitHub Actions 缓存
3. **增量检查**: 只检查变更的文件
4. **条件执行**: 使用 needs 控制依赖关系

**缓存示例**:

```yaml
- name: 缓存 node_modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**效果**:

- 减少 CI 执行时间
- 节省 GitHub Actions 分钟数
- 提高开发效率

### 5. 监控 CI 状态

定期监控 CI 状态：

1. **查看最近运行**: 检查是否有失败
2. **分析失败原因**: 找出常见问题
3. **更新文档**: 记录解决方案
4. **优化流程**: 减少失败次数

**监控指标**:

| 指标 | 正常值 | 警告值 | 处理方式 |
|------|--------|--------|----------|
| 成功率 | > 95% | 85-95% | 分析失败原因 |
| 平均时间 | < 5 分钟 | 5-10 分钟 | 优化流程 |
| 失败次数 | < 3/周 | 3-5/周 | 检查代码质量 |

## 常见问题

### Q1: CI 检查失败怎么办？

**Markdown Lint 失败**:

```bash
# 查看具体错误
markdownlint-cli2 '.codebuddy/**/*.md'

# 自动修复可修复的问题
markdownlint-cli2 --fix '.codebuddy/**/*.md'

# 参考规范文档
cat rules/markdown-compliance.mdc
```

**TypeScript Lint 失败**:

```bash
# 查看具体错误
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts

# 自动修复
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts --fix

# 查看错误详情
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts --format=stylish
```

**测试失败**:

```bash
# 查看失败测试
npm run test:unit -- --verbose

# 运行特定测试
npm run test:unit -- --testNamePattern="TestGenerator"

# 调试测试
npm run test:unit -- --detectOpenHandles
```

### Q2: 如何修改 Lint 规则？

**修改 Markdown 规则**:

```json
// .markdownlintrc.json
{
  "MD013": {
    "line_length": 150  // 修改行长度限制
  },
  "MD033": false      // 禁用规则
}
```

**修改 TypeScript 规则**:

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",  // 禁用
    "complexity": ["warn", { "max": 20 }]      // 调整阈值
  }
}
```

**验证规则**:

```bash
# 测试 Markdown 规则
markdownlint-cli2 -c .markdownlintrc.json test.md

# 测试 TypeScript 规则
npx eslint -c .eslintrc.json test.ts
```

### Q3: 如何提高测试覆盖率？

**分析覆盖率报告**:

```bash
# 生成覆盖率报告
npm run test:unit:coverage

# 查看未覆盖的文件
cat test/coverage/coverage-summary.json | jq '.files[] | select(.lines.pct < 100) | .file'

# 查看 HTML 报告
open test/coverage/index.html
```

**增加测试覆盖率**:

1. **编写缺失的测试用例**
2. **测试边缘情况**
3. **测试错误处理路径**
4. **测试异步代码**
5. **使用测试工具（mock、spy 等）**

### Q4: CI 运行太慢怎么办？

**优化策略**:

1. **使用缓存**:

```yaml
- name: 缓存依赖
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

1. **并行执行作业**:

```yaml
markdown-lint:  # 作业 1
  runs-on: ubuntu-latest
  steps: [...]

typescript-lint:  # 作业 2，与作业 1 并行
  runs-on: ubuntu-latest
  steps: [...]
```

1. **减少检查范围**:

```yaml
paths:
  - ".codebuddy/**/*.ts"  # 只检查 TypeScript 文件
  - ".codebuddy/**/*.md"  # 只检查 Markdown 文件
```

**效果**:

- 减少依赖安装时间
- 缩短总执行时间
- 节省 GitHub Actions 分钟数

### Q5: 如何本地验证后再提交？

**使用 Pre-commit Hooks**:

```bash
# 安装 husky
npm install -D husky

# 初始化
npx husky install

# 配置 pre-commit
npx husky add .husky/pre-commit "cd .codebuddy && npm run lint:md && npm run lint:ts && npm run test:unit"
```

**手动运行完整检查**:

```bash
cd .codebuddy

# 1. Markdown Lint
npm run lint:md

# 2. TypeScript Lint
npm run lint:ts

# 3. 单元测试
npm run test:unit

# 4. 覆盖率检查
npm run test:unit:coverage

# 5. 检查覆盖率
cat test/coverage/coverage-summary.json
```

### Q6: 如何调试 CI 问题？

**查看详细日志**:

1. 访问 GitHub Actions 页面
2. 点击失败的工作流运行
3. 点击失败的作业
4. 查看每个步骤的详细日志

**本地复现**:

```bash
# 在本地运行相同的命令
cd .codebuddy

# Markdown Lint
markdownlint-cli2 '.codebuddy/**/*.md'

# TypeScript Lint
npx eslint skills/**/*.ts scripts/**/*.ts --ext .ts

# 测试
npm run test:unit
```

**使用 GitHub Actions 调试**:

```yaml
- name: 调试信息
  run: |
    echo "Node 版本: $(node --version)"
    echo "NPM 版本: $(npm --version)"
    echo "当前目录: $(pwd)"
    echo "文件列表:"
    ls -la
```

## 参考资料

### 官方文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [MarkdownLint 规则](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [ESLint 规则](https://eslint.org/docs/latest/rules/)
- [Jest 配置](https://jestjs.io/docs/configuration)
- [Codecov 文档](https://docs.codecov.com/)

### 内部文档

- [Markdown 规范文档](../rules/markdown-compliance.mdc)
- [测试指南](../test/README.md)
- [开发指南](../SKILLS_INDEPENDENCE_OPTIMIZATION_PLAN.md)

### 相关工具

- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
- [ESLint](https://eslint.org/)
- [Jest](https://jestjs.io/)
- [Codecov](https://codecov.io/)

## 总结

本文档详细说明了 CodeBuddy CI/CD 配置的各个方面：

1. **工作流配置**: 6 个 CI 作业，覆盖代码质量检查到报告生成
2. **配置项详解**: 每个配置项的说明、使用方式和效果
3. **GitHub Actions uses 命令**: 13 种常用 Action 及其用法
4. **CI 优化**: 6 项优化措施，节省 30-40% 执行时间
5. **配置文件说明**: markdownlint、ESLint、package.json 配置
6. **本地开发**: 提供完整的本地检查流程
7. **最佳实践**: 分支策略、监控指标、优化方法
8. **常见问题**: 提供解决方案和调试方法

通过合理使用 CI/CD 配置，可以：

- 确保代码质量
- 提高开发效率
- 减少错误和问题
- 保持项目健康状态

---

**最后更新**: 2026-01-28
**维护者**: CodeBuddy Team
