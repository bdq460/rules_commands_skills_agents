/**
 * DevOps Generator 测试适配器
 *
 * 将 DevOps 生成器技能的函数包装为测试期望的接口
 */

// ============================================================================
// 类型定义 (测试期望的接口)
// ============================================================================

export interface GitHubActionsOptions {
    name?: string;
    on?: string[];
    jobs?: string[];
    nodeVersions?: number[];
}

export interface GitLabCIOptions {
    stages?: string[];
    artifacts?: {
        paths: string[];
        expire_in: string;
    };
}

export interface JenkinsOptions {
    stages?: string[];
    post?: {
        always?: string[];
        success?: string[];
        failure?: string[];
    };
}

export interface DockerfileOptions {
    baseImage?: string;
    workDir?: string;
    port?: number;
    installCommand?: string;
    startCommand?: string;
    multiStage?: boolean;
    buildStage?: {
        image: string;
        command: string;
    };
    runtimeStage?: {
        image: string;
        command: string;
    };
}

// ============================================================================
// 适配器函数
// ============================================================================

/**
 * 生成 GitHub Actions 配置
 * 适配器：生成 GitHub Actions 工作流配置
 */
export function generateGitHubActionsConfig(options: GitHubActionsOptions = {}): string {
    let config = '';

    if (options.name) {
        config += `name: ${options.name}\n`;
    } else {
        config += `name: CI\n`;
    }

    config += `\n`;

    if (options.on && options.on.length > 0) {
        config += `on:\n`;
        options.on.forEach(trigger => {
            config += `  - ${trigger}\n`;
        });
    } else {
        config += `on:\n`;
        config += `  - push\n`;
        config += `  - pull_request\n`;
    }

    config += `\n`;

    if (options.jobs && options.jobs.length > 0) {
        config += `jobs:\n`;
        options.jobs.forEach(job => {
            config += `  ${job}:\n`;
            config += `    runs-on: ubuntu-latest\n`;
            
            // 如果有多个 Node 版本，添加 matrix
            if (options.nodeVersions && options.nodeVersions.length > 1) {
                config += `    strategy:\n`;
                config += `      matrix:\n`;
                config += `        node-version: [${options.nodeVersions.join(', ')}]\n`;
                config += `\n`;
            }
            
            config += `    steps:\n`;
            config += `      - uses: actions/checkout@v3\n`;
            config += `      - name: Set up Node.js\n`;
            config += `        uses: actions/setup-node@v3\n`;
            
            if (options.nodeVersions && options.nodeVersions.length > 0) {
                const nodeVersionVar = '${' + '{ matrix.node-version }}';
                config += '        with:\n';
                config += '          node-version: ' + nodeVersionVar + '\n';
                config += "          cache: 'npm'\n";
            } else {
                config += `        with:\n`;
                config += `          node-version: '18'\n`;
            }
            config += `      - run: npm ci\n`;
            config += `      - run: npm test\n`;
        });
    } else {
        config += `jobs:\n`;
        config += `  test:\n`;
        config += `    runs-on: ubuntu-latest\n`;
        config += `\n`;
        config += `    steps:\n`;
        config += `      - uses: actions/checkout@v3\n`;
        config += `      - name: Set up Node.js\n`;
        config += `        uses: actions/setup-node@v3\n`;
        config += `        with:\n`;
        config += `          node-version: '18'\n`;
    }

    return config;
}

/**
 * 生成 GitLab CI 配置
 * 适配器：生成 GitLab CI/CD 配置
 */
export function generateGitLabCIConfig(options: GitLabCIOptions = {}): string {
    let config = '';

    if (options.stages && options.stages.length > 0) {
        config += `stages:\n`;
        options.stages.forEach(stage => {
            config += `  - ${stage}\n`;
        });
    } else {
        config += `stages:\n`;
        config += `  - build\n`;
        config += `  - test\n`;
        config += `  - deploy\n`;
    }

    config += `\n`;

    if (options.stages && options.stages.length > 0) {
        options.stages.forEach(stage => {
            config += `${stage}:\n`;
            config += `  stage: ${stage}\n`;
            config += `  script:\n`;
            config += `    - echo "Running ${stage}"\n`;
            // 如果有 artifacts 配置，只在 build 阶段添加
            if (options.artifacts && stage === 'build') {
                config += `  artifacts:\n`;
                config += `    paths:\n`;
                options.artifacts.paths.forEach(path => {
                    config += `      - ${path}\n`;
                });
                config += `    expire_in: ${options.artifacts.expire_in}\n`;
            }
            config += `\n`;
        });
    } else {
        // 默认 stages
        config += `build:\n`;
        config += `  stage: build\n`;
        config += `  script:\n`;
        config += `    - echo "Building"\n`;
        // 如果有 artifacts 配置，添加到 build 阶段
        if (options.artifacts) {
            config += `  artifacts:\n`;
            config += `    paths:\n`;
            options.artifacts.paths.forEach(path => {
                config += `      - ${path}\n`;
            });
            config += `    expire_in: ${options.artifacts.expire_in}\n`;
        }
        config += `\n`;
        config += `test:\n`;
        config += `  stage: test\n`;
        config += `  script:\n`;
        config += `    - echo "Testing"\n`;
        config += `\n`;
        config += `deploy:\n`;
        config += `  stage: deploy\n`;
        config += `  script:\n`;
        config += `    - echo "Deploying"\n`;
    }

    return config;
}

/**
 * 生成 Jenkinsfile
 * 适配器：生成 Jenkins Pipeline 配置
 */
export function generateJenkinsfile(options: JenkinsOptions = {}): string {
    let pipeline = 'pipeline {\n';
    pipeline += '    agent any\n';
    pipeline += '\n';

    if (options.stages && options.stages.length > 0) {
        pipeline += '    stages {\n';
        options.stages.forEach(stage => {
            pipeline += `        stage('${stage}') {\n`;
            pipeline += '            steps {\n';
            pipeline += `                echo "Running ${stage}"\n`;
            pipeline += '            }\n';
            pipeline += '        }\n';
        });
        pipeline += '    }\n';
    } else {
        pipeline += '    stages {\n';
        pipeline += '        stage(\'Build\') {\n';
        pipeline += '            steps {\n';
        pipeline += '                echo "Building..."\n';
        pipeline += '            }\n';
        pipeline += '        }\n';
        pipeline += '        stage(\'Test\') {\n';
        pipeline += '            steps {\n';
        pipeline += '                echo "Testing..."\n';
        pipeline += '            }\n';
        pipeline += '        }\n';
        pipeline += '        stage(\'Deploy\') {\n';
        pipeline += '            steps {\n';
        pipeline += '                echo "Deploying..."\n';
        pipeline += '            }\n';
        pipeline += '        }\n';
        pipeline += '    }\n';
    }

    if (options.post) {
        pipeline += '    post {\n';
        if (options.post.always && options.post.always.length > 0) {
            pipeline += '        always {\n';
            options.post.always.forEach(action => {
                pipeline += `                echo "${action}"\n`;
            });
            pipeline += '        }\n';
        }
        if (options.post.success && options.post.success.length > 0) {
            pipeline += '        success {\n';
            options.post.success.forEach(action => {
                pipeline += `                echo "${action}"\n`;
            });
            pipeline += '        }\n';
        }
        if (options.post.failure && options.post.failure.length > 0) {
            pipeline += '        failure {\n';
            options.post.failure.forEach(action => {
                pipeline += `                echo "${action}"\n`;
            });
            pipeline += '        }\n';
        }
        pipeline += '    }\n';
    }

    pipeline += '}';

    return pipeline;
}

/**
 * 生成 Dockerfile
 * 适配器：生成 Docker 配置文件
 */
export function generateDockerfile(options: DockerfileOptions = {}): string {
    let dockerfile = '';

    if (options.multiStage) {
        // 多阶段构建
        if (options.buildStage) {
            dockerfile += `FROM ${options.buildStage.image} AS build\n`;
            dockerfile += `WORKDIR /app\n`;
            dockerfile += `COPY . .\n`;
            dockerfile += `RUN ${options.buildStage.command}\n`;
            dockerfile += `\n`;
        }

        if (options.runtimeStage) {
            dockerfile += `FROM ${options.runtimeStage.image} AS runtime\n`;
            if (options.workDir) {
                dockerfile += `WORKDIR ${options.workDir}\n`;
            } else {
                dockerfile += `WORKDIR /app\n`;
            }
            if (options.buildStage) {
                dockerfile += `COPY --from=build /app/dist ./dist\n`;
            }
            if (options.port) {
                dockerfile += `EXPOSE ${options.port}\n`;
            }
            if (options.startCommand) {
                dockerfile += `CMD ["${options.startCommand}"]\n`;
            } else if (options.runtimeStage.command) {
                dockerfile += `CMD ["${options.runtimeStage.command}"]\n`;
            }
        }
    } else {
        // 单阶段构建
        if (options.baseImage) {
            dockerfile += `FROM ${options.baseImage}\n`;
        } else {
            dockerfile += `FROM node:18-alpine\n`;
        }

        if (options.workDir) {
            dockerfile += `WORKDIR ${options.workDir}\n`;
        } else {
            dockerfile += `WORKDIR /app\n`;
        }

        dockerfile += `COPY package*.json ./\n`;

        if (options.installCommand) {
            dockerfile += `RUN ${options.installCommand}\n`;
        } else {
            dockerfile += `RUN npm ci\n`;
        }

        dockerfile += `COPY . .\n`;

        if (options.port) {
            dockerfile += `EXPOSE ${options.port}\n`;
        }

        if (options.startCommand) {
            dockerfile += `CMD ${options.startCommand}\n`;
        } else {
            dockerfile += `CMD ["npm", "start"]\n`;
        }
    }

    return dockerfile;
}
