---
name: devops-generator
description: 生成DevOps相关的配置文件和脚本，为项目的部署、监控、自动化提供支持。
---

# DevOps Generator Skill

本skill负责生成DevOps相关的配置文件和脚本，为项目的部署、监控、自动化提供支持。

**💡 重要说明**: 本技能既可以作为产品开发流程的一部分，也可以在任何适合的场景下独立使用。
不需要用户明确声明"我是DevOps工程师"，只要用户的需求涉及DevOps配置或部署脚本生成，就可以调用本技能。

**重要说明**：本skill专注于生成配置文件和脚本，不涉及实际执行部署或与外部系统交互。实际的部署和系统运维需要人工操作或集成CI/CD系统。

## 何时使用本Skill

本skill可以在以下场景中独立使用，也可以作为产品开发流程的一部分：

### 独立使用场景

**场景1: Docker容器化**

- "生成Dockerfile"
- "生成docker-compose配置"
- "生成Kubernetes配置"
- "生成Docker镜像构建脚本"
- "生成容器部署配置"

**场景2: CI/CD配置**

- "生成GitHub Actions配置"
- "生成GitLab CI配置"
- "生成Jenkins Pipeline配置"
- "生成CI/CD工作流"
- "生成自动化部署脚本"

**场景3: 监控配置**

- "生成Prometheus配置"
- "生成Grafana配置"
- "生成日志采集配置"
- "生成告警配置"
- "生成性能监控配置"

**场景4: 部署脚本**

- "生成部署脚本"
- "生成回滚脚本"
- "生成健康检查脚本"
- "生成环境配置脚本"
- "生成数据备份脚本"

**场景5: DevOps咨询**

- "如何配置CI/CD?"
- "Docker最佳实践"
- "Kubernetes部署方案"
- "监控和日志方案"
- "自动化部署最佳实践"

### 产品开发流程集成

在产品开发流程的**阶段11: 发布与运维**中被调用，作为DevOps工程师角色。

**调用方式**: 由product-development-flow自动调用，传递项目结构、部署需求等上下文。

**触发时机**:

- 业务实现完成，需要准备部署时
- 需要搭建CI/CD流程时
- 需要配置监控和日志时

### 触发关键词

以下关键词或短语出现时，建议调用本skill：

**容器化类**:

- "Docker"、"Dockerfile"、"docker-compose"
- "Kubernetes"、"K8s"、"容器化"
- "容器部署"、"镜像构建"

**CI/CD类**:

- "CI/CD"、"持续集成"、"持续部署"
- "GitHub Actions"、"GitLab CI"、"Jenkins"
- "自动化部署"、"自动化构建"

**监控类**:

- "监控"、"Prometheus"、"Grafana"
- "日志"、"告警"、"性能监控"
- "日志采集"、"监控配置"

**部署类**:

- "部署脚本"、"部署配置"、"环境配置"
- "部署方案"、"自动化部署"、"DevOps"

**咨询类**:

- "DevOps配置"、"容器化方案"
- "CI/CD方案"、"监控方案"、"部署最佳实践"

## 🎯 核心职责

### 1. 容器化配置生成

生成容器化相关的配置文件，包括：

- Dockerfile（应用镜像构建）
- docker-compose.yml（本地开发环境）
- .dockerignore（Docker忽略文件）

### 2. CI/CD配置生成

生成持续集成和持续部署配置，包括：

- GitHub Actions workflows
- GitLab CI/CD pipelines
- Jenkins pipelines
- Azure DevOps pipelines

### 3. Kubernetes配置生成

生成容器编排配置，包括：

- Deployment（应用部署）
- Service（服务暴露）
- Ingress（路由规则）
- ConfigMap（配置管理）
- Secret（密钥管理）
- HPA（水平自动扩缩容）

### 4. 监控配置生成

生成应用监控和日志配置，包括：

- Prometheus配置（指标采集）
- Grafana Dashboard（监控面板）
- ELK Stack配置（日志管理）
- Health Check配置（健康检查）

### 5. 环境配置生成

生成不同环境的配置文件，包括：

- .env.example（环境变量模板）
- 环境特定的配置（dev/staging/prod）
- ConfigMap和Secret模板

## 🤝 协作关系与RACI矩阵

### 本技能的定位

本技能负责生成DevOps相关的配置文件和脚本,为项目的部署、监控、自动化提供支持。在产品开发流程中处于阶段11:发布与运维,是DevOps自动化配置的核心。

### 协作的技能类型

本技能主要与以下类型技能协作:

1. **前置技能**: backend-engineer、frontend-engineer、security-engineer、system-optimizer
2. **后置技能**: tester
3. **同级技能**: 无
4. **依赖技能**: 无

### 协作场景

| 场景 | 协作技能 | 协作方式 | 协作内容 |
|------|----------|----------|----------|
| 后端部署配置 | backend-engineer | 顺序协作 | 根据后端需求生成部署配置 |
| 前端部署配置 | frontend-engineer | 顺序协作 | 根据前端需求生成部署配置 |
| 安全配置协作 | security-engineer | 顺序协作 | 集成安全基线和密钥管理 |
| 性能配置协作 | system-optimizer | 顺序协作 | 集成性能监控和容量规划 |
| 测试环境配置 | tester | 顺序协作 | 提供测试环境部署配置 |

### 本技能在各阶段的RACI角色

| 阶段 | 本技能角色 | 主要职责 |
|------|------------|----------|
| 阶段1: 需求提出 | I | 了解部署需求,参与需求评审 |
| 阶段2: 需求分析 | I | 参与技术栈选择 |
| 阶段5: 业务实现 | I | 了解实现进展,准备部署配置 |
| 阶段10: 安全审查 | C | 集成安全配置要求 |
| 阶段11: 发布与运维 | R/A | 生成部署配置,配置CI/CD |
| 阶段12: 项目协调与交付 | I | 知晓部署状态,确认交付 |

### 本技能的核心任务RACI

| 任务 | 本技能 | backend-engineer | security-engineer | system-optimizer |
|------|--------|-----------------|------------------|------------------|
| 容器化配置 | R/A | C | C | I |
| CI/CD配置 | R/A | C | C | C |
| 监控配置 | R/A | C | C | R/A |
| 部署脚本 | R/A | R/A | C | I |

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
| 部署方案冲突 | 低 | 直接协商 |
| 安全基线冲突 | 中 | 第三方协调 |
| 资源分配冲突 | 中 | 第三方协调 |
| 发布节奏冲突 | 高 | 项目协调器介入 |

### 4级冲突升级路径

#### Level 1: 直接协商(本技能内部)

**适用场景**:

- 冲突严重程度: 低-中
- 冲突类型: 部署方案冲突、发布节奏冲突
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
- 冲突类型: 安全基线冲突、资源分配冲突
- 处理时限: < 15分钟

**协调人选择**:

| 冲突类型 | 推荐协调人 | 原因 |
|----------|-----------|------|
| 安全基线冲突 | security-engineer | 安全配置权威 |
| 资源分配冲突 | system-optimizer | 性能容量专家 |
| 技术方案冲突 | technical-architect | 架构设计权威 |

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
- 冲突类型: 发布节奏冲突、核心决策无法达成一致
- 处理时限: < 30分钟

**项目协调器权限**:

- 暂停部署
- 重新评估发布计划
- 修改部署方案
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
- 冲突类型: 核心发布决策无法达成,涉及业务上线
- 处理时限: 无限制(等待用户决策)

**用户决策选项**:

| 选项 | 说明 | 适用场景 |
|------|------|----------|
| 选项A | 按计划发布 | 按当前计划发布,可能存在风险 |
| 选项B | 延期发布 | 延期发布,优化后再发布 |
| 选项C | 增加资源 | 增加服务器资源,保障发布 |
| 选项D | 回滚方案 | 准备回滚方案,确保可以快速回滚 |

---

## 📋 工作流程

```mermaid
graph LR
    A[分析项目结构] --> B[确定技术栈]
    B --> C[生成容器化配置]
    C --> D[生成CI/CD配置]
    D --> E[生成K8s配置]
    E --> F[生成监控配置]
    F --> G[生成环境配置]
    G --> H[生成文档]
    H --> I[输出DevOps配置包]
## 🔄 输入要求

### 必需输入

- **项目结构**：项目的文件和目录结构
- **技术栈**：
  - 前端框架（React/Vue/Angular等）
  - 后端框架（Node.js/Python/Java/Go等）
  - 数据库（PostgreSQL/MySQL/MongoDB等）
  - 构建工具（Webpack/Vite/Gradle/Maven等）

### 可选输入

- **部署目标**：
  - Docker Compose（本地开发）
  - Kubernetes（生产环境）
  - 云平台（AWS/GCP/Azure）
- *`CI/CD平台`*：GitHub/GitLab/Jenkins/Azure DevOps
- **监控需求**：Prometheus/Grafana/ELK/自定义
- **环境数量**：dev/staging/prod等

## 📦 交付物

### 1. 容器化配置

#### Dockerfile示例

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
#### docker-compose.yml示例

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
### 2. CI/CD配置

#### GitHub Actions示例

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: dist/
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # 部署命令需要根据实际情况配置
#### GitLab CI示例

```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm run test
    - npm run test:coverage
  coverage: '/All files[^|]`\|[^|]`\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy:production:
  stage: deploy
  image: alpine:latest
  only:
    - main
  script:
    - apk add --no-cache openssh-client
    - echo "Deploying to production..."
    # 部署命令需要根据实际情况配置
### 3. Kubernetes配置

#### Deployment示例

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myregistry/myapp:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: myapp-secrets
                  key: database-url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
#### Service示例

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
#### Ingress示例

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - myapp.example.com
      secretName: myapp-tls
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: myapp-service
                port:
                  number: 80
#### HPA示例

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
### 4. 监控配置

#### Prometheus配置示例

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "myapp"
    metrics_path: "/metrics"
    static_configs:
      - targets: ["myapp-service:3000"]
        labels:
          app: "myapp"
          env: "production"

  - job_name: "postgres"
    static_configs:
      - targets: ["postgres-exporter:9187"]

  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]
#### Grafana Dashboard示例

```json
{
  "dashboard": {
    "title": "My Application Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "Server Errors"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Response Time",
        "targets": [
          {
            "expr": "histogram`quantile(0.95, http`request_duration_seconds_bucket)",
            "legendFormat": "95th Percentile"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
### 5. 环境配置

#### .env.example示例

```bash
# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# External Services
API_KEY=
API_SECRET=

# Monitoring
SENTRY_DSN=
#### ConfigMap示例

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  DATABASE_POOL_MIN: "2"
  DATABASE_POOL_MAX: "10"
#### Secret示例

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
type: Opaque
stringData:
  database-url: "postgresql://user:password@localhost:5432/myapp"
  jwt-secret: "your-secret-key-here"
## 🔍 技术栈识别

### 前端框架检测

```typescript
function detectFrontendFramework(
  projectStructure: ProjectStructure,
): Framework {
  if (hasFile("package.json")) {
    const pkg = readJson("package.json");
    if (pkg.dependencies["react"]) return "react";
    if (pkg.dependencies["vue"]) return "vue";
    if (pkg.dependencies["@angular/core"]) return "angular";
  }
  if (hasFile("angular.json")) return "angular";
  if (hasFile("vue.config.js")) return "vue";
  return "unknown";
}
### 后端框架检测

```typescript
function detectBackendFramework(projectStructure: ProjectStructure): Framework {
  if (hasFile("package.json")) {
    const pkg = readJson("package.json");
    if (pkg.dependencies["express"]) return "express";
    if (pkg.dependencies["fastify"]) return "fastify";
    if (pkg.dependencies["nest"]) return "nestjs";
    if (pkg.dependencies["next"]) return "nextjs";
  }
  if (hasFile("pom.xml")) return "spring";
  if (hasFile("requirements.txt")) {
    const requirements = readFile("requirements.txt");
    if (requirements.includes("django")) return "django";
    if (requirements.includes("flask")) return "flask";
    if (requirements.includes("fastapi")) return "fastapi";
  }
  if (hasFile("go.mod")) return "go";
  return "unknown";
}
### 数据库检测

```typescript
function detectDatabase(projectStructure: ProjectStructure): Database {
  if (hasFile("package.json")) {
    const pkg = readJson("package.json");
    if (pkg.dependencies["pg"]) return "postgresql";
    if (pkg.dependencies["mysql2"]) return "mysql";
    if (pkg.dependencies["mongodb"]) return "mongodb";
  }
  if (hasFile("requirements.txt")) {
    const requirements = readFile("requirements.txt");
    if (requirements.includes("psycopg2")) return "postgresql";
    if (requirements.includes("pymysql")) return "mysql";
    if (requirements.includes("pymongo")) return "mongodb";
  }
  return "postgresql"; // 默认值
}
## 🎨 配置模板库

### 按技术栈分类

```typescript
const templates = {
  "react+express+postgres": {
    dockerfile: "react-express-postgres.Dockerfile",
    compose: "react-express-postgres.compose.yml",
    githubActions: "react-express-postgres.github.yml",
    kubernetes: "react-express-postgres.k8s.yaml",
  },
  "vue+nextjs+mongodb": {
    dockerfile: "vue-nextjs-mongodb.Dockerfile",
    compose: "vue-nextjs-mongodb.compose.yml",
    githubActions: "vue-nextjs-mongodb.github.yml",
    kubernetes: "vue-nextjs-mongodb.k8s.yaml",
  },
  // ... 更多模板
};
## 📝 生成文档

### README.md DevOps章节

```markdown
## DevOps

### 本地开发

使用Docker Compose启动本地开发环境：

```bash
docker-compose up

### 构建

```bash
docker build -t myapp:latest .
### 部署

#### Kubernetes部署

```bash
kubectl apply -f k8s/
#### 查看状态

```bash
kubectl get pods -l app=myapp
kubectl logs -f deployment/myapp
### 监控

- Prometheus: <http://localhost:9090>
- Grafana: <http://localhost:3000>
- 应用指标: <http://localhost:3000/metrics>

### CI/CD

项目使用GitHub Actions进行持续集成和持续部署。

- 构建流水线：<https://github.com/username/repo/actions>
- 部署配置：`.github/workflows/ci-cd.yml`

## 🔄 集成到开发流程

### 触发时机

1. **项目初始化完成后**
   - 生成基础Docker配置
   - 生成开发环境docker-compose

2. **技术栈确定后**
   - 生成特定的CI/CD配置
   - 生成Kubernetes配置

3. **部署规划阶段**
   - 生成生产环境配置
   - 生成监控配置

### 调用方式

```typescript
// 在product-development-flow中调用
const devopsGenerator = await useSkill("devops-generator");

const devopsConfig = await devopsGenerator.generate({
  projectStructure: projectContext.structure,
  frontendFramework: "react",
  backendFramework: "express",
  database: "postgresql",
  deploymentTarget: "kubernetes",
  cicdPlatform: "github",
  environments: ["dev", "staging", "prod"],
  monitoring: ["prometheus", "grafana"],
});

// 保存配置文件
await saveDevopsConfig(devopsConfig);
## ⚙️ 配置选项

### 全局配置

```json
{
  "devops": {
    "dockerVersion": "20.10",
    "kubernetesVersion": "1.27",
    "baseImage": "node:18-alpine",
    "healthCheckEnabled": true,
    "monitoringEnabled": true,
    "logAggregation": "elk"
  }
}
### 部署配置

```json
{
  "deployment": {
    "strategy": "rollingUpdate",
    "maxSurge": 1,
    "maxUnavailable": 0,
    "minReplicas": 3,
    "maxReplicas": 10,
    "targetCPUUtilization": 70,
    "targetMemoryUtilization": 80
  }
}
## 📊 质量标准

- ✅ 配置文件语法正确
- ✅ 配置文件可被相关工具解析（docker/kubectl等）
- ✅ 配置文件包含必要的环境变量占位符
- ✅ 配置文件包含健康检查配置
- ✅ 配置文件包含资源限制
- ✅ 配置文件包含监控暴露端点
- ✅ 文档说明清晰完整

## ⚠️ 注意事项

### 安全注意事项

1. **敏感信息处理**
   - 不要在配置文件中硬编码密码、密钥
   - 使用Secret、ConfigMap管理配置
   - 提供`.env.example`而非`.env`

2. **权限配置**
   - 容器以非root用户运行
   - 文件系统权限最小化
   - 网络策略限制访问

3. **镜像安全**
   - 使用官方基础镜像
   - 定期更新基础镜像
   - 扫描镜像漏洞

### 最佳实践

1. **多阶段构建**
   - 分离构建环境和运行环境
   - 减小最终镜像体积

2. **缓存优化**
   - 利用Docker层缓存
   - 优先复制不变文件

3. **健康检查**
   - 配置liveness和readiness探针
   - 合理设置检查间隔

4. **资源限制**
   - 设置CPU和内存限制
   - 防止资源耗尽

5. **日志管理**
   - 标准输出和标准错误
   - 结构化日志格式
   - 日志级别配置

## 🚀 扩展性

### 支持更多平台

```typescript
interface PlatformSupport {
  name: string;
  dockerSupport: boolean;
  kubernetesSupport: boolean;
  cicdSupport: string[];
  monitoringSupport: string[];
}

const platforms: PlatformSupport[] = [
  {
    name: "AWS",
    dockerSupport: true,
    kubernetesSupport: true,
    cicdSupport: ["codebuild", "codepipeline"],
    monitoringSupport: ["cloudwatch"],
  },
  {
    name: "GCP",
    dockerSupport: true,
    kubernetesSupport: true,
    cicdSupport: ["cloud-build"],
    monitoringSupport: ["cloud-monitoring"],
  },
  {
    name: "Azure",
    dockerSupport: true,
    kubernetesSupport: true,
    cicdSupport: ["azure-pipelines"],
    monitoringSupport: ["azure-monitor"],
  },
];
### 自定义模板

用户可以提供自定义模板：

```typescript
interface CustomTemplate {
  name: string;
  type: "dockerfile" | "compose" | "kubernetes" | "cicd" | "monitoring";
  content: string;
  variables: string[];
}
---

## 调用其他技能

### 调用时机

本skill在以下情况需要主动调用其他技能：

1. **容器化配置时** - 调用后端工程师或前端工程师

2. **CI/CD配置时** - 调用测试框架构建者

3. **监控配置时** - 调用系统优化师

4. **安全配置时** - 调用安全工程师

### 调用的技能及场景

#### 1. 调用后端工程师（backend-engineer）

**调用时机**：

- 当需要了解后端运行环境时
- 当需要了解后端依赖时
- 当需要了解后端启动命令时

**调用方式**：

```typescript
const backendEngineer = await useSkill("backend-engineer");
const runtimeInfo = await backendEngineer.getRuntimeInfo({
  application: appName,
  environment: "production",
});
**调用场景**：

**场景1**：后端运行环境信息

- **输入**：应用名称、环境类型
- **调用**：backend-engineer提供运行环境信息
- **输出**：运行时环境、依赖列表

**场景2**：容器化配置信息

- **输入**：应用类型、运行要求
- **调用**：backend-engineer提供容器化需求
- **输出**：Docker配置需求、环境变量

#### 2. 调用前端工程师（frontend-engineer）

**调用时机**：

- 当需要了解前端构建配置时
- 当需要了解前端静态资源时
- 当需要了解前端部署方式时

**调用方式**：

```typescript
const frontendEngineer = await useSkill("frontend-engineer");
const buildInfo = await frontendEngineer.getBuildInfo({
  application: appName,
  environment: "production",
});
**调用场景**：

**场景1**：前端构建信息获取

- **输入**：应用名称、环境类型
- **调用**：frontend-engineer提供构建信息
- **输出**：构建配置、构建命令

**场景2**：前端静态资源信息

- **输入**：应用名称、资源列表
- **调用**：frontend-engineer提供资源信息
- **输出**：资源配置、CDN策略

#### 3. 调用测试框架构建者（test-framework-builder）

**调用时机**：

- 当需要配置测试自动化时
- 当需要配置测试报告时
- 当需要配置测试覆盖率时

**调用方式**：

```typescript
const testFrameworkBuilder = await useSkill("test-framework-builder");
const testCI = await testFrameworkBuilder.getTestCI({
  framework: testFramework,
  commands: testCommands,
});
**调用场景**：

**场景1**：测试自动化配置

- **输入**：测试框架、测试命令
- **调用**：test-framework-builder提供CI配置
- **输出**：测试CI配置、测试脚本

**场景2**：测试报告配置

- **输入**：测试框架、报告类型
- **调用**：test-framework-builder提供报告配置
- **输出**：报告配置、报告模板

#### 4. 调用系统优化师（system-optimizer）

**调用时机**：

- 当需要配置性能监控时
- 当需要配置资源监控时
- 当需要配置告警规则时

**调用方式**：

```typescript
const systemOptimizer = await useSkill("system-optimizer");
const monitoringConfig = await systemOptimizer.getMonitoringConfig({
  application: appName,
  metrics: performanceMetrics,
});
**调用场景**：

**场景1**：性能监控配置

- **输入**：应用名称、性能指标
- **调用**：system-optimizer提供监控配置
- **输出**：监控指标、采集配置

**场景2**：告警规则配置

- **输入**：应用名称、告警阈值
- **调用**：system-optimizer提供告警规则
- **输出**：告警规则、通知策略

#### 5. 调用安全工程师（security-engineer）

**调用时机**：

- 当需要配置安全扫描时
- 当需要配置容器安全时
- 当需要配置访问控制时

**调用方式**：

```typescript
const securityEngineer = await useSkill("security-engineer");
const securityConfig = await securityEngineer.getSecurityConfig({
  application: appName,
  environment: environmentType,
});
**调用场景**：

**场景1**：安全扫描配置

- **输入**：应用名称、扫描类型
- **调用**：security-engineer提供安全扫描配置
- **输出**：扫描配置、扫描规则

**场景2**：容器安全配置

- **输入**：镜像信息、安全要求
- **调用**：security-engineer提供容器安全配置
- **输出**：安全策略、扫描流程

### 调用注意事项

1. **环境一致**：确保开发、测试、生产环境配置一致

2. **安全优先**：安全配置必须包含在所有环境中

3. **监控完整**：监控配置必须覆盖关键指标

4. **自动化优先**：优先使用自动化配置而非手动配置

---

## 总结

DevOps Generator Skill专注于：

1. ✅ 生成容器化配置（Dockerfile, docker-compose）

2. ✅ 生成CI/CD配置（GitHub Actions, GitLab CI）

3. ✅ 生成Kubernetes配置（Deployment, Service, Ingress）

4. ✅ 生成监控配置（Prometheus, Grafana）

5. ✅ 生成环境配置（.env, ConfigMap, Secret）

6. ✅ 生成部署文档

**不负责**：

- ❌ 实际执行部署命令
- ❌ 与外部系统交互
- ❌ 管理CI/CD服务器
- ❌ 运维监控

这些工作需要由DevOps工程师人工操作，或集成到实际的CI/CD系统中。

---

## 📚 参考资料

### 全局参考资料

本skill参考以下全局参考资料：

- **编码规范**：`references/best-practices/coding.md`（包含命名规范、函数设计原则、代码组织规范、注释规范、错误处理规范）
- **设计模式**：`references/design-patterns/creational.md`、`references/design-patterns/structural.md`、`references/design-patterns/behavioral.md`
- **架构参考**：`references/architecture/hexagonal-architecture.md`、`references/architecture/microservices.md`

### 本skill特有参考资料

本skill使用以下特有的参考资料：

- **[DevOps配置模板](references/devops-config-templates.md)** - 包含Docker、Kubernetes、CI/CD等配置模板

## 🛠️ 工具脚本

### 全局工具脚本

本skill使用以下全局工具脚本：

- **Logger工具**：`scripts/utils/logger.ts`

  ```typescript
  import { createLogger } from "@codebuddy/scripts/utils/logger";
  const logger = createLogger("DevOps Generator");
  logger.info("开始生成DevOps配置");
  logger.skillComplete("DevOps Generator", 5000);

- **FileManager工具**：`scripts/utils/file-manager.ts`

  ```typescript
  import { FileManager } from "@codebuddy/scripts/utils/file-manager";
  const fm = new FileManager();
  await fm.createDirectory("./k8s");
  await fm.writeFile("./k8s/deployment.yaml", deploymentConfig);

- **ContextManager工具**：`scripts/utils/context-manager.ts`

  ```typescript
  import { ContextManager } from "@codebuddy/scripts/utils/context-manager";
  const ctx = new ContextManager();
  ctx.set("dockerImage", "myapp:latest");

- **CodeValidator**：`scripts/validators/code-validator.ts`

  ```typescript
  import { CodeValidator } from "@codebuddy/scripts/validators/code-validator";
  const validator = new CodeValidator();
  const result = await validator.validate("./k8s", { language: "yaml" });

- **ConfigValidator**：`scripts/validators/config-validator.ts`

  ```typescript
  import { ConfigValidator } from "@codebuddy/scripts/validators/config-validator";
  const validator = new ConfigValidator();
  const result = await validator.validate("./config", { schema: "docker-compose" });

### 本skill特有脚本

本skill使用以下特有的工具脚本：

- **[CI/CD生成器](scripts/ci-cd-generator.ts)** - 生成CI/CD配置文件

  ```typescript
  import { CICDGenerator } from "./scripts/ci-cd-generator";
  const generator = new CICDGenerator();
  await generator.generateGitHubActions({
    project: "myapp",
    techStack: "react+nodejs",
  });

  ```

---

## 📝 使用示例

### 示例1：生成CI/CD配置

**场景描述**：为Node.js项目生成GitHub Actions配置

**输入示例**：

```text
请为Node.js项目生成GitHub Actions CI/CD配置，包括：

1. 运行测试

2. 构建Docker镜像

3. 部署到生产环境

```

**调用方式**：

```bash
invoke skill devops-generator

```

**输出示例**：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test

```
