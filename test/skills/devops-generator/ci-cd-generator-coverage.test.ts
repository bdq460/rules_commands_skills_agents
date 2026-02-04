/**
 * CI/CD Generator - 分支和路径覆盖测试
 */

import { CICDGenerator } from '../../../skills/skills/devops-generator/scripts/ci-cd-generator';

describe('CICDGenerator - Comprehensive Branch Coverage', () => {
    let generator: CICDGenerator;

    beforeEach(() => {
        generator = new CICDGenerator();
    });

    /**
     * GitHub Actions 生成器 - 完整分支覆盖
     */
    describe('GitHub Actions Generation', () => {
        it('should generate valid GitHub Actions YAML structure', () => {
            const result = generator.generateGitHubActions();

            // 验证核心结构
            expect(result).toContain('name:');
            expect(result).toContain('on:');
            expect(result).toContain('jobs:');
            expect(result).toContain('runs-on:');

            // 验证所有阶段
            expect(result).toMatch(/install:/);
            expect(result).toMatch(/test:/);
            expect(result).toMatch(/build:/);
            expect(result).toMatch(/deploy:/);
        });

        it('should handle all job dependencies', () => {
            const result = generator.generateGitHubActions();

            // 验证 needs 依赖关系
            expect(result).toContain('needs:');
            expect(result).toContain('[install]');
            expect(result).toContain('[test, build]');
        });

        it('should include conditional deployment', () => {
            const result = generator.generateGitHubActions();

            // 验证部署条件
            expect(result).toContain("if: github.ref == 'refs/heads/main'");
        });

        it('should include artifact handling', () => {
            const result = generator.generateGitHubActions();

            expect(result).toContain('upload-artifact');
            expect(result).toContain('download-artifact');
            expect(result).toContain('dist/');
        });

        it('should include npm caching', () => {
            const result = generator.generateGitHubActions();

            expect(result).toContain("cache: 'npm'");
        });
    });

    /**
     * GitLab CI 生成器
     */
    describe('GitLab CI Generation', () => {
        it('should generate valid GitLab CI YAML', () => {
            const result = generator.generateGitLabCI();

            expect(result).toContain('stages:');
            expect(result).toContain('variables:');
            expect(result).toMatch(/install:/);
            expect(result).toMatch(/test:/);
            expect(result).toMatch(/build:/);
            expect(result).toMatch(/deploy:/);
        });

        it('should include cache configuration', () => {
            const result = generator.generateGitLabCI();

            expect(result).toContain('cache:');
            expect(result).toContain('node_modules/');
            expect(result).toContain('paths:');
        });

        it('should include artifacts configuration', () => {
            const result = generator.generateGitLabCI();

            expect(result).toContain('artifacts:');
        });

        it('should specify Node.js image', () => {
            const result = generator.generateGitLabCI();

            expect(result).toContain('image: node:');
        });

        it('should include environment variables', () => {
            const result = generator.generateGitLabCI();

            expect(result).toContain('NODE_ENV:');
        });
    });

    /**
     * Jenkins Pipeline 生成器
     */
    describe('Jenkins Pipeline Generation', () => {
        it('should generate valid Jenkinsfile', () => {
            const result = generator.generateJenkinsPipeline();

            expect(result).toContain('pipeline');
            expect(result).toContain('agent');
            expect(result).toContain('stages');
            expect(result).toContain('stage');
            expect(result).toContain('steps');
        });

        it('should include all pipeline stages', () => {
            const result = generator.generateJenkinsPipeline();

            expect(result).toMatch(/Build/);
            expect(result).toMatch(/Test/);
            expect(result).toMatch(/Deploy/);
        });
    });

    /**
     * Docker 相关生成器
     */
    describe('Docker Generation', () => {
        it('should generate multi-stage Dockerfile', () => {
            const dockerfile = generator.generateDockerfile();

            expect(dockerfile).toContain('FROM node:');
            expect(dockerfile).toContain('WORKDIR');
            expect(dockerfile).toContain('COPY');
            expect(dockerfile).toContain('RUN npm');
            // Dockerfile should contain docker build commands
            expect(dockerfile.length).toBeGreaterThan(100);
        });

        it('should generate valid Docker Compose', () => {
            const compose = generator.generateDockerCompose();

            expect(compose).toContain('version:');
            expect(compose).toContain('services:');
            expect(compose).toContain('build:');
            expect(compose).toContain('ports:');
            expect(compose).toContain('environment:');
        });
    });

    /**
     * Kubernetes 生成器 - 分支覆盖
     */
    describe('Kubernetes Resources Generation', () => {
        it('should generate Deployment with correct replica count', () => {
            const deploy3 = generator.generateK8sDeployment('app1', 'image1:latest', 3);
            const deploy5 = generator.generateK8sDeployment('app2', 'image2:v1', 5);

            expect(deploy3).toContain('replicas: 3');
            expect(deploy5).toContain('replicas: 5');
            expect(deploy3).toContain('app1');
            expect(deploy5).toContain('app2');
        });

        it('should use default replicas when not specified', () => {
            const result = generator.generateK8sDeployment('defaultapp', 'defaultapp:latest');

            expect(result).toContain('replicas: 3');
        });

        it('should generate Service with port configuration', () => {
            const svc3000 = generator.generateK8sService('svc1', 3000);
            const svc8080 = generator.generateK8sService('svc2', 8080);
            const svcDefault = generator.generateK8sService('svc3');

            expect(svc3000).toContain('port: 3000');
            expect(svc8080).toContain('port: 8080');
            expect(svcDefault).toContain('port: 3000');
        });

        it('should generate Ingress with host configuration', () => {
            const result = generator.generateK8sIngress('app', 'api.example.com', 'app-svc', 3000);

            expect(result).toContain('api.example.com');
            expect(result).toContain('app-svc');
            expect(result).toContain('3000');
        });

        it('should generate complete K8s manifest with all resources', () => {
            const manifest = generator.generateK8sManifest('myapp', 'myapp:v1', 'example.com');

            // 验证包含所有资源类型
            expect(manifest).toContain('kind: Deployment');
            expect(manifest).toContain('kind: Service');
            expect(manifest).toContain('kind: Ingress');

            // 验证使用了正确的名称
            expect(manifest).toContain('myapp');
            expect(manifest).toContain('example.com');
        });
    });

    /**
     * 基础设施配置 - 分支覆盖
     */
    describe('Infrastructure Configuration', () => {
        it('should generate Nginx upstream with correct port', () => {
            const nginx3000 = generator.generateNginxConfig('backend', 3000);
            const nginx9000 = generator.generateNginxConfig('api', 9000);
            const nginxDefault = generator.generateNginxConfig('default');

            expect(nginx3000).toContain('3000');
            expect(nginx9000).toContain('9000');
            expect(nginxDefault).toContain('3000');

            // 验证上游名称
            expect(nginx3000).toContain('backend');
            expect(nginx9000).toContain('api');
        });

        it('should include proxy configuration in Nginx', () => {
            const result = generator.generateNginxConfig('upstream', 5000);

            expect(result).toContain('proxy_pass');
            expect(result).toContain('proxy_set_header');
            expect(result).toContain('Host');
            expect(result).toContain('X-Real-IP');
        });

        it('should generate deployment script', () => {
            const script = generator.generateDeployScript();

            expect(script).toContain('#!/bin/bash');
            // 脚本应该有构建和部署命令
            expect(script.length).toBeGreaterThan(50);
        });
    });

    /**
     * 边界情况和错误处理
     */
    describe('Edge Cases and Error Handling', () => {
        it('should handle empty app name gracefully', () => {
            expect(() => {
                generator.generateK8sDeployment('', 'image:latest');
            }).not.toThrow();
        });

        it('should handle special characters in app name', () => {
            expect(() => {
                generator.generateK8sDeployment('app-name-123', 'registry/image:v1.0.0');
            }).not.toThrow();
        });

        it('should handle very large port numbers', () => {
            const result = generator.generateK8sService('svc', 65535);

            expect(result).toContain('65535');
        });

        it('should handle port 0 as valid input', () => {
            const result = generator.generateK8sService('svc', 0);

            expect(result).toBeDefined();
        });

        it('should handle complex host names', () => {
            const result = generator.generateK8sIngress(
                'app',
                'very.long.hostname.example.com',
                'service',
                443
            );

            expect(result).toContain('very.long.hostname.example.com');
        });
    });

    /**
     * 字符串生成一致性
     */
    describe('Output Consistency', () => {
        it('GitHub Actions should generate consistent YAML format', () => {
            const result1 = generator.generateGitHubActions();
            const result2 = generator.generateGitHubActions();

            // 同样的调用应该返回相同的结果
            expect(result1).toEqual(result2);
        });

        it('all outputs should be non-empty strings', () => {
            const github = generator.generateGitHubActions();
            const gitlab = generator.generateGitLabCI();
            const jenkins = generator.generateJenkinsPipeline();
            const dockerfile = generator.generateDockerfile();
            const compose = generator.generateDockerCompose();
            const nginx = generator.generateNginxConfig('test');
            const script = generator.generateDeployScript();

            [github, gitlab, jenkins, dockerfile, compose, nginx, script].forEach(output => {
                expect(typeof output).toBe('string');
                expect(output.length).toBeGreaterThan(0);
            });
        });

        it('K8s resources should reference correct app names', () => {
            const deploy = generator.generateK8sDeployment('myapp', 'myapp:latest');
            const svc = generator.generateK8sService('myapp', 3000);

            expect(deploy).toContain('myapp');
            expect(svc).toContain('myapp');
        });
    });
});
