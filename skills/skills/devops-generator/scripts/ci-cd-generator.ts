#!/usr/bin/env node

/**
 * DevOps Generator - CI/CD配置生成脚本
 *
 * 用途：生成CI/CD配置文件、Docker配置、Kubernetes配置等
 * 使用场景：开发完成后配置持续集成和持续部署流程
 */

export class CICDGenerator {
    /**
     * 生成GitHub Actions配置
     */
    generateGitHubActions(): string {
        let result = 'name: CI/CD Pipeline\n\n';
        result += 'on:\n';
        result += '  push:\n';
        result += '    branches: [ main, develop ]\n';
        result += '  pull_request:\n';
        result += '    branches: [ main ]\n\n';
        result += 'env:\n';
        result += '  NODE_VERSION: \'18.x\'\n\n';
        result += 'jobs:\n';
        result += '  install:\n';
        result += '    runs-on: ubuntu-latest\n';
        result += '    steps:\n';
        result += '      - uses: actions/checkout@v3\n';
        result += '      - name: Setup Node.js\n';
        result += '        uses: actions/setup-node@v3\n';
        result += '        with:\n';
        result += '          node-version: ${{ env.NODE_VERSION }}\n';
        result += '          cache: \'npm\'\n';
        result += '      - name: Install dependencies\n';
        result += '        run: npm ci\n\n';
        result += '  test:\n';
        result += '    runs-on: ubuntu-latest\n';
        result += '    needs: [install]\n';
        result += '    steps:\n';
        result += '      - uses: actions/checkout@v3\n';
        result += '      - name: Setup Node.js\n';
        result += '        uses: actions/setup-node@v3\n';
        result += '        with:\n';
        result += '          node-version: ${{ env.NODE_VERSION }}\n';
        result += '          cache: \'npm\'\n';
        result += '      - run: npm ci\n';
        result += '      - run: npm run test\n';
        result += '      - run: npm run lint\n\n';
        result += '  build:\n';
        result += '    runs-on: ubuntu-latest\n';
        result += '    needs: [install]\n';
        result += '    steps:\n';
        result += '      - uses: actions/checkout@v3\n';
        result += '      - name: Setup Node.js\n';
        result += '        uses: actions/setup-node@v3\n';
        result += '        with:\n';
        result += '          node-version: ${{ env.NODE_VERSION }}\n';
        result += '          cache: \'npm\'\n';
        result += '      - run: npm ci\n';
        result += '      - run: npm run build\n';
        result += '      - uses: actions/upload-artifact@v3\n';
        result += '        with:\n';
        result += '          name: dist\n';
        result += '          path: dist/\n\n';
        result += '  deploy:\n';
        result += '    runs-on: ubuntu-latest\n';
        result += '    needs: [test, build]\n';
        result += '    if: github.ref == \'refs/heads/main\'\n';
        result += '    steps:\n';
        result += '      - uses: actions/checkout@v3\n';
        result += '      - name: Download artifacts\n';
        result += '        uses: actions/download-artifact@v3\n';
        result += '        with:\n';
        result += '          name: dist\n';
        result += '      - name: Deploy to production\n';
        result += '        run: |\n';
        result += '          echo "Deploying to production..."\n';
        result += '          # Add your deployment commands here\n';
        return result;
    }

    /**
     * 生成GitLab CI配置
     */
    generateGitLabCI(): string {
        let result = 'stages:\n';
        result += '  - install\n';
        result += '  - test\n';
        result += '  - build\n';
        result += '  - deploy\n\n';
        result += 'variables:\n';
        result += '  NODE_ENV: test\n\n';
        result += 'install:\n';
        result += '  stage: install\n';
        result += '  image: node:18\n';
        result += '  cache:\n';
        result += '    paths:\n';
        result += '      - node_modules/\n';
        result += '  script:\n';
        result += '    - npm ci\n';
        result += '  artifacts:\n';
        result += '    paths:\n';
        result += '      - node_modules/\n\n';
        result += 'test:\n';
        result += '  stage: test\n';
        result += '  image: node:18\n';
        result += '  dependencies:\n';
        result += '    - install\n';
        result += '  script:\n';
        result += '    - npm run test\n';
        result += '    - npm run lint\n\n';
        result += 'build:\n';
        result += '  stage: build\n';
        result += '  image: node:18\n';
        result += '  dependencies:\n';
        result += '    - install\n';
        result += '  script:\n';
        result += '    - npm run build\n';
        result += '  artifacts:\n';
        result += '    paths:\n';
        result += '      - dist/\n\n';
        result += 'deploy:\n';
        result += '  stage: deploy\n';
        result += '  image: node:18\n';
        result += '  dependencies:\n';
        result += '    - build\n';
        result += '  script:\n';
        result += '    - echo "Deploying to production..."\n';
        result += '    # Add your deployment commands here\n';
        result += '  only:\n';
        result += '    - main\n';
        return result;
    }

    /**
     * 生成Jenkins Pipeline配置
     */
    generateJenkinsPipeline(): string {
        let result = 'pipeline {\n';
        result += '  agent any\n\n';
        result += '  environment {\n';
        result += '    NODE_VERSION = \'18.x\'\n';
        result += '  }\n\n';
        result += '  stages {\n';
        result += '    stage(\'Install\') {\n';
        result += '      steps {\n';
        result += '        sh \'npm ci\'\n';
        result += '      }\n';
        result += '    }\n\n';
        result += '    stage(\'Test\') {\n';
        result += '      steps {\n';
        result += '        sh \'npm run test\'\n';
        result += '        sh \'npm run lint\'\n';
        result += '      }\n';
        result += '    }\n\n';
        result += '    stage(\'Build\') {\n';
        result += '      steps {\n';
        result += '        sh \'npm run build\'\n';
        result += '        archiveArtifacts artifacts: \'dist/**\', fingerprint: true\n';
        result += '      }\n';
        result += '    }\n\n';
        result += '    stage(\'Deploy\') {\n';
        result += '      when {\n';
        result += '        branch \'main\'\n';
        result += '      }\n';
        result += '      steps {\n';
        result += '        sh \'echo "Deploying to production..."\';\n';
        result += '        # Add your deployment commands here\n';
        result += '      }\n';
        result += '    }\n';
        result += '  }\n';
        result += '}\n';
        return result;
    }

    /**
     * 生成Dockerfile
     */
    generateDockerfile(): string {
        let result = 'FROM node:18-alpine AS builder\n\n';
        result += 'WORKDIR /app\n\n';
        result += 'COPY package*.json ./\n';
        result += 'RUN npm ci --only=production\n\n';
        result += 'COPY . .\n';
        result += 'RUN npm run build\n\n';
        result += 'FROM node:18-alpine\n\n';
        result += 'WORKDIR /app\n\n';
        result += 'COPY --from=builder /app/node_modules ./node_modules\n';
        result += 'COPY --from=builder /app/dist ./dist\n';
        result += 'COPY package*.json ./\n\n';
        result += 'EXPOSE 3000\n\n';
        result += 'CMD ["node", "dist/main.js"]\n';
        return result;
    }

    /**
     * 生成docker-compose.yml
     */
    generateDockerCompose(): string {
        let result = 'version: \'3.8\'\n\n';
        result += 'services:\n';
        result += '  app:\n';
        result += '    build:\n';
        result += '      context: .\n';
        result += '      dockerfile: Dockerfile\n';
        result += '    ports:\n';
        result += '      - "3000:3000"\n';
        result += '    environment:\n';
        result += '      - NODE_ENV=production\n';
        result += '      - PORT=3000\n';
        result += '    volumes:\n';
        result += '      - ./logs:/app/logs\n';
        result += '    restart: unless-stopped\n\n';
        result += '  nginx:\n';
        result += '    image: nginx:alpine\n';
        result += '    ports:\n';
        result += '      - "80:80"\n';
        result += '    volumes:\n';
        result += '      - ./nginx.conf:/etc/nginx/nginx.conf:ro\n';
        result += '    depends_on:\n';
        result += '      - app\n';
        result += '    restart: unless-stopped\n\n';
        result += '  redis:\n';
        result += '    image: redis:alpine\n';
        result += '    ports:\n';
        result += '      - "6379:6379"\n';
        result += '    restart: unless-stopped\n';
        return result;
    }

    /**
     * 生成Kubernetes Deployment
     */
    generateK8sDeployment(appName: string, imageName: string, replicas: number = 3): string {
        let result = 'apiVersion: apps/v1\n';
        result += 'kind: Deployment\n';
        result += 'metadata:\n';
        result += '  name: ' + appName + '\n';
        result += 'spec:\n';
        result += '  replicas: ' + replicas + '\n';
        result += '  selector:\n';
        result += '    matchLabels:\n';
        result += '      app: ' + appName + '\n';
        result += '  template:\n';
        result += '    metadata:\n';
        result += '      labels:\n';
        result += '        app: ' + appName + '\n';
        result += '    spec:\n';
        result += '      containers:\n';
        result += '      - name: ' + appName + '\n';
        result += '        image: ' + imageName + '\n';
        result += '        ports:\n';
        result += '        - containerPort: 3000\n';
        result += '        env:\n';
        result += '        - name: NODE_ENV\n';
        result += '          value: "production"\n';
        result += '        resources:\n';
        result += '          requests:\n';
        result += '            cpu: "100m"\n';
        result += '            memory: "128Mi"\n';
        result += '          limits:\n';
        result += '            cpu: "500m"\n';
        result += '            memory: "256Mi"\n';
        result += '        livenessProbe:\n';
        result += '          httpGet:\n';
        result += '            path: /health\n';
        result += '            port: 3000\n';
        result += '          initialDelaySeconds: 30\n';
        result += '          periodSeconds: 10\n';
        result += '        readinessProbe:\n';
        result += '          httpGet:\n';
        result += '            path: /health\n';
        result += '            port: 3000\n';
        result += '          initialDelaySeconds: 5\n';
        result += '          periodSeconds: 5\n';
        return result;
    }

    /**
     * 生成Kubernetes Service
     */
    generateK8sService(appName: string, port: number = 3000): string {
        let result = 'apiVersion: v1\n';
        result += 'kind: Service\n';
        result += 'metadata:\n';
        result += '  name: ' + appName + '\n';
        result += 'spec:\n';
        result += '  type: ClusterIP\n';
        result += '  selector:\n';
        result += '    app: ' + appName + '\n';
        result += '  ports:\n';
        result += '  - port: ' + port + '\n';
        result += '    targetPort: 3000\n';
        result += '    protocol: TCP\n';
        return result;
    }

    /**
     * 生成Kubernetes Ingress
     */
    generateK8sIngress(appName: string, host: string, serviceName: string, servicePort: number): string {
        let result = 'apiVersion: networking.k8s.io/v1\n';
        result += 'kind: Ingress\n';
        result += 'metadata:\n';
        result += '  name: ' + appName + '-ingress\n';
        result += '  annotations:\n';
        result += '    kubernetes.io/ingress.class: nginx\n';
        result += '    cert-manager.io/cluster-issuer: letsencrypt-prod\n';
        result += 'spec:\n';
        result += '  tls:\n';
        result += '  - hosts:\n';
        result += '    - ' + host + '\n';
        result += '    secretName: ' + appName + '-tls\n';
        result += '  rules:\n';
        result += '  - host: ' + host + '\n';
        result += '    http:\n';
        result += '      paths:\n';
        result += '      - path: /\n';
        result += '        pathType: Prefix\n';
        result += '        backend:\n';
        result += '          service:\n';
        result += '            name: ' + serviceName + '\n';
        result += '            port:\n';
        result += '              number: ' + servicePort + '\n';
        return result;
    }

    /**
     * 生成完整的Kubernetes配置
     */
    generateK8sManifest(appName: string, imageName: string, host: string): string {
        const deployment = this.generateK8sDeployment(appName, imageName);
        const service = this.generateK8sService(appName);
        const ingress = this.generateK8sIngress(appName, host, appName, 3000);
        return deployment + '\n---\n' + service + '\n---\n' + ingress;
    }

    /**
     * 生成Nginx配置
     */
    generateNginxConfig(upstreamName: string, port: number = 3000): string {
        let result = 'events {\n';
        result += '    worker_connections 1024;\n';
        result += '}\n\n';
        result += 'http {\n';
        result += '    upstream ' + upstreamName + ' {\n';
        result += '        least_conn;\n';
        result += '        server app:' + port + ';\n';
        result += '    }\n\n';
        result += '    server {\n';
        result += '        listen 80;\n';
        result += '        server_name _;\n\n';
        result += '        location / {\n';
        result += '            proxy_pass http://' + upstreamName + ';\n';
        result += '            proxy_set_header Host $host;\n';
        result += '            proxy_set_header X-Real-IP $remote_addr;\n';
        result += '            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n';
        result += '            proxy_set_header X-Forwarded-Proto $scheme;\n';
        result += '        }\n\n';
        result += '        location /health {\n';
        result += '            proxy_pass http://' + upstreamName + '/health;\n';
        result += '            access_log off;\n';
        result += '        }\n';
        result += '    }\n';
        result += '}\n';
        return result;
    }

    /**
     * 生成部署脚本
     */
    generateDeployScript(): string {
        let result = '#!/bin/bash\n\n';
        result += 'set -e\n\n';
        result += 'echo "🚀 Starting deployment..."\n\n';
        result += '# Variables\n';
        result += 'IMAGE_NAME="${1:-myapp}"\n';
        result += 'TAG="${2:-latest}"\n';
        result += 'REGISTRY="${REGISTRY:-docker.io}"\n\n';
        result += '# Build Docker image\n';
        result += 'echo "📦 Building Docker image..."\n';
        result += 'docker build -t ${IMAGE_NAME}:${TAG} .\n\n';
        result += '# Tag and push to registry\n';
        result += 'echo "📤 Pushing image to registry..."\n';
        result += 'docker tag ${IMAGE_NAME}:${TAG} ${REGISTRY}/${IMAGE_NAME}:${TAG}\n';
        result += 'docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}\n\n';
        result += '# Apply Kubernetes manifests\n';
        result += 'echo "🔧 Applying Kubernetes manifests..."\n';
        result += 'kubectl apply -f k8s/\n\n';
        result += '# Wait for rollout\n';
        result += 'echo "⏳ Waiting for rollout..."\n';
        result += 'kubectl rollout status deployment/${IMAGE_NAME}\n\n';
        result += 'echo "✅ Deployment complete!"\n';
        return result;
    }
}

// Export interfaces and functional generators for unit tests
export interface GitHubActionsOptions {
    name?: string;
    on?: string[];
    jobs?: string[];
    nodeVersions?: Array<string | number>;
}

export function generateGitHubActionsConfig(options: GitHubActionsOptions = {}): string {
    const name = options.name ?? 'CI';
    const triggers = options.on ?? ['push', 'pull_request'];
    const jobs = options.jobs ?? ['test'];
    const nodeVersions = options.nodeVersions?.map(String) ?? ['18'];

    let result = 'name: ' + name + '\n';

    if (triggers.length === 1) {
        result += 'on: ' + triggers[0] + '\n';
    } else {
        result += 'on:\n';
        for (const trigger of triggers) {
            result += '  ' + trigger + '\n';
        }
    }

    result += 'jobs:\n';

    for (const job of jobs) {
        result += '  ' + job + ':\n';
        result += '    runs-on: ubuntu-latest\n';
        result += '    steps:\n';
        result += '      - uses: actions/checkout@v3\n';
        result += '      - uses: actions/setup-node@v3\n';
        result += '        with:\n';
        result += '          node-version: ' + nodeVersions[0] + '\n';
        result += '      - run: echo "' + job + ' step"\n';
    }

    if (nodeVersions.length > 1) {
        result += '    strategy:\n';
        result += '      matrix:\n';
        result += '        node-version: [' + nodeVersions.join(', ') + ']\n';
    }

    return result;
}

export interface GitLabCIOptions {
    stages?: string[];
    artifacts?: { paths?: string[]; expire_in?: string };
}

export function generateGitLabCIConfig(options: GitLabCIOptions = {}): string {
    const stages = options.stages ?? ['build', 'test', 'deploy'];
    const artifacts = options.artifacts;

    let result = 'stages:\n';
    for (const stage of stages) {
        result += '  - ' + stage + '\n';
    }
    result += '\n';

    for (const stage of stages) {
        result += stage + ':\n';
        result += '  stage: ' + stage + '\n';
        result += '  script:\n';
        result += '    - echo "' + stage + ' stage"\n';
        result += '\n';

        if (artifacts) {
            result += '  artifacts:\n';
            if (artifacts.paths) {
                result += '    paths:\n';
                for (const path of artifacts.paths) {
                    result += '      - ' + path + '\n';
                }
            }
            result += '    expire_in: ' + (artifacts.expire_in ?? '1 week') + '\n';
            result += '\n';
        }
    }

    return result;
}

export interface JenkinsOptions {
    stages?: string[];
    post?: {
        always?: string[];
        success?: string[];
        failure?: string[];
    };
}

export function generateJenkinsfile(options: JenkinsOptions = {}): string {
    const stages = options.stages ?? ['Build', 'Test', 'Deploy'];
    const post = options.post;

    let result = 'pipeline {\n';
    result += '  agent any\n';
    result += '  stages {\n';

    for (const stage of stages) {
        result += '    stage(\'' + stage + '\') {\n';
        result += '      steps {\n';
        result += '        echo \'' + stage + ' stage\'\n';
        result += '      }\n';
        result += '    }\n';
    }

    result += '  }\n';

    if (post) {
        result += '  post {\n';
        if (post.always) {
            result += '    always { ' + post.always.join('; ') + ' }\n';
        }
        if (post.success) {
            result += '    success { ' + post.success.join('; ') + ' }\n';
        }
        if (post.failure) {
            result += '    failure { ' + post.failure.join('; ') + ' }\n';
        }
        result += '  }\n';
    }

    result += '}\n';
    return result;
}

export interface DockerfileOptions {
    baseImage?: string;
    workDir?: string;
    installCommand?: string;
    port?: number;
    startCommand?: string;
    multiStage?: boolean;
    buildStage?: { image?: string; command?: string };
    runtimeStage?: { image?: string; command?: string };
}

export function generateDockerfile(options: DockerfileOptions = {}): string {
    const baseImage = options.baseImage ?? 'node:18-alpine';
    const workDir = options.workDir ?? '/app';
    const installCommand = options.installCommand ?? 'npm ci';
    const port = options.port ?? 3000;
    const startCommand = options.startCommand ?? 'npm start';

    let result = '';

    if (options.multiStage) {
        const buildImage = options.buildStage?.image ?? baseImage;
        const buildCmd = options.buildStage?.command ?? 'npm run build';
        const runtimeImage = options.runtimeStage?.image ?? 'node:18-alpine';
        const runtimeCmd = options.runtimeStage?.command ?? startCommand;

        result += 'FROM ' + buildImage + ' AS build\n';
        result += 'WORKDIR ' + workDir + '\n';
        result += 'COPY package*.json ./\n';
        result += 'RUN ' + installCommand + '\n';
        result += 'COPY . .\n';
        result += 'RUN ' + buildCmd + '\n\n';

        result += 'FROM ' + runtimeImage + ' AS runtime\n';
        result += 'WORKDIR ' + workDir + '\n';
        result += 'COPY --from=build ' + workDir + '/dist ./dist\n';
        result += 'EXPOSE ' + port + '\n';
        result += 'CMD ' + runtimeCmd + '\n';
    } else {
        result += 'FROM ' + baseImage + '\n';
        result += 'WORKDIR ' + workDir + '\n';
        result += 'COPY package*.json ./\n';
        result += 'RUN ' + installCommand + '\n';
        result += 'COPY . .\n';
        result += 'EXPOSE ' + port + '\n';
        result += 'CMD ' + startCommand + '\n';
    }

    return result;
}

// CLI使用示例
if (require.main === module) {
    const generator = new CICDGenerator();

    console.log('=== GitHub Actions ===');
    console.log(generator.generateGitHubActions());

    console.log('\n=== GitLab CI ===');
    console.log(generator.generateGitLabCI());

    console.log('\n=== Dockerfile ===');
    console.log(generator.generateDockerfile());

    console.log('\n=== Kubernetes Manifest ===');
    console.log(generator.generateK8sManifest('myapp', 'myapp:v1.0.0', 'app.example.com'));
}
