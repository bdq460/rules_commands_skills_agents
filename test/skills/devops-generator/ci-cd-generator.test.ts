/**
 * CI/CD Generator 单元测试
 */

import {
    generateDockerfile,
    generateGitHubActionsConfig,
    generateGitLabCIConfig,
    generateJenkinsfile
} from '../../../skills/skills/devops-generator/scripts/ci-cd-generator';

describe('CICDGenerator', () => {
    describe('generateGitHubActionsConfig', () => {
        it('should generate GitHub Actions workflow', () => {
            const options = {
                name: 'CI',
                on: ['push', 'pull_request'],
                jobs: ['test', 'build', 'deploy']
            };

            const result = generateGitHubActionsConfig(options);

            expect(result).toBeDefined();
            expect(result).toContain('name: CI');
            expect(result).toContain('on:');
            expect(result).toContain('jobs:');
        });

        it('should include test job', () => {
            const options = {
                jobs: ['test']
            };

            const result = generateGitHubActionsConfig(options);

            expect(result).toContain('test:');
            expect(result).toContain('runs-on:');
        });

        it('should include build job', () => {
            const options = {
                jobs: ['build']
            };

            const result = generateGitHubActionsConfig(options);

            expect(result).toContain('build:');
        });

        it('should include deploy job', () => {
            const options = {
                jobs: ['deploy']
            };

            const result = generateGitHubActionsConfig(options);

            expect(result).toContain('deploy:');
        });

        it('should support node version matrix', () => {
            const options = {
                nodeVersions: [14, 16, 18]
            };

            const result = generateGitHubActionsConfig(options);

            expect(result).toContain('matrix:');
            expect(result).toContain('strategy:');
        });
    });

    describe('generateGitLabCIConfig', () => {
        it('should generate GitLab CI configuration', () => {
            const options = {
                stages: ['build', 'test', 'deploy']
            };

            const result = generateGitLabCIConfig(options);

            expect(result).toBeDefined();
            expect(result).toContain('stages:');
            expect(result).toContain('build');
            expect(result).toContain('test');
            expect(result).toContain('deploy');
        });

        it('should include build stage', () => {
            const options = {
                stages: ['build']
            };

            const result = generateGitLabCIConfig(options);

            expect(result).toContain('build:');
            expect(result).toContain('script:');
        });

        it('should include test stage', () => {
            const options = {
                stages: ['test']
            };

            const result = generateGitLabCIConfig(options);

            expect(result).toContain('test:');
            expect(result).toContain('script:');
        });

        it('should include deploy stage', () => {
            const options = {
                stages: ['deploy']
            };

            const result = generateGitLabCIConfig(options);

            expect(result).toContain('deploy:');
            expect(result).toContain('script:');
        });

        it('should support artifacts configuration', () => {
            const options = {
                artifacts: {
                    paths: ['dist/', 'build/'],
                    expire_in: '1 week'
                }
            };

            const result = generateGitLabCIConfig(options);

            expect(result).toContain('artifacts:');
            expect(result).toContain('paths:');
            expect(result).toContain('expire_in:');
        });
    });

    describe('generateJenkinsfile', () => {
        it('should generate Jenkins pipeline', () => {
            const options = {
                stages: ['Build', 'Test', 'Deploy']
            };

            const result = generateJenkinsfile(options);

            expect(result).toBeDefined();
            expect(result).toContain('pipeline');
            expect(result).toContain('stages');
        });

        it('should include Build stage', () => {
            const options = {
                stages: ['Build']
            };

            const result = generateJenkinsfile(options);

            expect(result).toContain('stage(\'Build\')');
            expect(result).toContain('steps');
        });

        it('should include Test stage', () => {
            const options = {
                stages: ['Test']
            };

            const result = generateJenkinsfile(options);

            expect(result).toContain('stage(\'Test\')');
        });

        it('should include Deploy stage', () => {
            const options = {
                stages: ['Deploy']
            };

            const result = generateJenkinsfile(options);

            expect(result).toContain('stage(\'Deploy\')');
        });

        it('should support post-build actions', () => {
            const options = {
                post: {
                    always: ['cleanup'],
                    success: ['notify success'],
                    failure: ['notify failure']
                }
            };

            const result = generateJenkinsfile(options);

            expect(result).toContain('post');
            expect(result).toContain('always');
            expect(result).toContain('success');
            expect(result).toContain('failure');
        });
    });

    describe('generateDockerfile', () => {
        it('should generate Dockerfile', () => {
            const options = {
                baseImage: 'node:18-alpine',
                workDir: '/app',
                port: 3000
            };

            const result = generateDockerfile(options);

            expect(result).toBeDefined();
            expect(result).toContain('FROM');
            expect(result).toContain('WORKDIR');
            expect(result).toContain('EXPOSE');
        });

        it('should include base image', () => {
            const options = {
                baseImage: 'node:18-alpine'
            };

            const result = generateDockerfile(options);

            expect(result).toContain('FROM node:18-alpine');
        });

        it('should include working directory', () => {
            const options = {
                workDir: '/app'
            };

            const result = generateDockerfile(options);

            expect(result).toContain('WORKDIR /app');
        });

        it('should include package installation', () => {
            const options = {
                installCommand: 'npm ci'
            };

            const result = generateDockerfile(options);

            expect(result).toContain('RUN');
            expect(result).toContain('npm ci');
        });

        it('should include port exposure', () => {
            const options = {
                port: 3000
            };

            const result = generateDockerfile(options);

            expect(result).toContain('EXPOSE 3000');
        });

        it('should include startup command', () => {
            const options = {
                startCommand: 'npm start'
            };

            const result = generateDockerfile(options);

            expect(result).toContain('CMD');
            expect(result).toContain('npm start');
        });

        it('should support multi-stage builds', () => {
            const options = {
                multiStage: true,
                buildStage: {
                    image: 'node:18',
                    command: 'npm run build'
                },
                runtimeStage: {
                    image: 'node:18-alpine',
                    command: 'npm start'
                }
            };

            const result = generateDockerfile(options);

            expect(result).toContain('AS build');
            expect(result).toContain('AS runtime');
        });
    });
});
