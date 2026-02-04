# CI/CD Generator

CI/CD配置生成脚本用于生成CI/CD配置文件、Docker配置、Kubernetes配置等。

## 功能

1. **CI配置**：生成GitHub Actions、GitLab CI等CI配置
2. **CD配置**：生成持续部署配置
3. **Docker配置**：生成Dockerfile和docker-compose.yml
4. **Kubernetes配置**：生成K8s部署配置
5. **监控配置**：生成监控和日志收集配置

## 使用方法

```typescript
import { CICDGenerator } from "./ci-cd-generator";

// 创建CI/CD生成器实例
const generator = new CICDGenerator();

// 生成GitHub Actions配置
const githubActions = generator.generateGitHubActions({
  nodeVersion: '18.x',
  runTests: true,
  runLint: true,
  deploy: true,
});

// 生成Dockerfile
const dockerfile = generator.generateDockerfile({
  baseImage: 'node:18-alpine',
  workDir: '/app',
  port: 3000,
});

// 生成docker-compose.yml
const dockerCompose = generator.generateDockerCompose({
  services: ['app', 'database', 'redis'],
});

// 生成Kubernetes配置
const k8sConfig = generator.generateKubernetesConfig({
  appName: 'myapp',
  replicas: 3,
  image: 'myapp:1.0.0',
});
```

## API

### generateGitHubActions(options: GitHubActionsOptions)

生成GitHub Actions配置文件。

```typescript
const config = generator.generateGitHubActions({
  nodeVersion: '18.x',
  runTests: true,
  runLint: true,
  deploy: true,
});
```

### generateDockerfile(options: DockerfileOptions)

生成Dockerfile。

```typescript
const dockerfile = generator.generateDockerfile({
  baseImage: 'node:18-alpine',
  workDir: '/app',
  port: 3000,
});
```

### generateDockerCompose(options: DockerComposeOptions)

生成docker-compose.yml。

```typescript
const dockerCompose = generator.generateDockerCompose({
  services: ['app', 'database', 'redis'],
});
```

### generateKubernetesConfig(options: K8sOptions)

生成Kubernetes部署配置。

```typescript
const k8sConfig = generator.generateKubernetesConfig({
  appName: 'myapp',
  replicas: 3,
  image: 'myapp:1.0.0',
});
```

### generateMonitoringConfig(options: MonitoringOptions)

生成监控配置。

```typescript
const monitoring = generator.generateMonitoringConfig({
  enablePrometheus: true,
  enableGrafana: true,
  enableAlerts: true,
});
```

## 配置选项

### GitHubActionsOptions

GitHub Actions配置选项。

| 字段 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| nodeVersion | string | '18.x' | Node.js版本 |
| runTests | boolean | true | 是否运行测试 |
| runLint | boolean | true | 是否运行lint |
| deploy | boolean | true | 是否部署 |

### DockerfileOptions

Dockerfile配置选项。

| 字段 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| baseImage | string | 'node:18-alpine' | 基础镜像 |
| workDir | string | '/app' | 工作目录 |
| port | number | 3000 | 应用端口 |
