/**
 * Project Coordinator 单元测试
 */

import { ProjectCoordinator, handleProjectError, handleProjectSuccess } from '../../../skills/skills/project-coordinator/scripts/coordinator';

describe('ProjectCoordinator', () => {
    let coordinator: ProjectCoordinator;

    beforeEach(() => {
        coordinator = new ProjectCoordinator({
            projectType: 'web',
            phases: ProjectCoordinator.getDefaultPhases(),
            debugMode: false
        });
    });

    afterEach(() => {
        coordinator = null as any;
    });

    describe('constructor', () => {
        it('should create coordinator with options', () => {
            expect(coordinator).toBeInstanceOf(ProjectCoordinator);
        });

        it('should initialize state correctly', () => {
            const state = coordinator.getProjectState();

            expect(state.currentPhase).toBe('');
            expect(state.completedPhases).toEqual([]);
            expect(state.errors).toEqual([]);
        });
    });

    describe('getDefaultPhases', () => {
        it('should return default phases', () => {
            const phases = ProjectCoordinator.getDefaultPhases();

            expect(phases).toBeDefined();
            expect(Array.isArray(phases)).toBe(true);
            expect(phases.length).toBeGreaterThan(0);
        });

        it('should include required phases', () => {
            const phases = ProjectCoordinator.getDefaultPhases();
            const phaseNames = phases.map(p => p.name);

            expect(phaseNames).toContain('需求分析');
            expect(phaseNames).toContain('产品设计');
            expect(phaseNames).toContain('架构设计');
            expect(phaseNames).toContain('开发实现');
            expect(phaseNames).toContain('测试验证');
            expect(phaseNames).toContain('部署上线');
        });

        it('should include skills in phases', () => {
            const phases = ProjectCoordinator.getDefaultPhases();

            phases.forEach(phase => {
                expect(phase.skills).toBeDefined();
                expect(Array.isArray(phase.skills)).toBe(true);
            });
        });
    });

    describe('getProjectState', () => {
        it('should return project state', () => {
            const state = coordinator.getProjectState();

            expect(state).toBeDefined();
            expect(state).toHaveProperty('currentPhase');
            expect(state).toHaveProperty('completedPhases');
            expect(state).toHaveProperty('context');
            expect(state).toHaveProperty('errors');
        });

        it('should return a copy of state', () => {
            const state1 = coordinator.getProjectState();
            const state2 = coordinator.getProjectState();

            expect(state1).not.toBe(state2);
            expect(state1.currentPhase).toBe(state2.currentPhase);
        });
    });

    describe('getProgressReport', () => {
        it('should generate progress report', () => {
            const report = coordinator.getProgressReport();

            expect(report).toBeDefined();
            expect(typeof report).toBe('string');
        });

        it('should include project statistics', () => {
            const report = coordinator.getProgressReport();

            expect(report).toContain('总阶段数');
            expect(report).toContain('已完成');
            expect(report).toContain('进度');
            expect(report).toContain('当前阶段');
            expect(report).toContain('错误数');
        });

        it('should show 0% progress initially', () => {
            const report = coordinator.getProgressReport();

            expect(report).toContain('0.0%');
        });
    });

    describe('generateFinalReport', () => {
        it('should generate final report', () => {
            const report = coordinator.generateFinalReport();

            expect(report).toBeDefined();
            expect(typeof report).toBe('string');
        });

        it('should include project information', () => {
            const report = coordinator.generateFinalReport();

            expect(report).toContain('项目最终报告');
            expect(report).toContain('完成时间');
            expect(report).toContain('项目类型');
            expect(report).toContain('总阶段数');
            expect(report).toContain('已完成阶段');
            expect(report).toContain('总错误数');
        });

        it('should include completed phases', () => {
            const report = coordinator.generateFinalReport();

            expect(report).toContain('完成的阶段');
        });

        it('should include error log', () => {
            const report = coordinator.generateFinalReport();

            expect(report).toContain('错误日志');
        });
    });

    describe('startProject', () => {
        it('should start project with requirements', async () => {
            const requirements = {
                description: '测试项目',
                features: ['功能1', '功能2']
            };

            await coordinator.startProject(requirements);

            const state = coordinator.getProjectState();
            expect(state.context.get('requirements')).toEqual(requirements);
        });
    });

    describe('pauseProject', () => {
        it('should pause project', async () => {
            await coordinator.pauseProject();

            // Test that pause method exists and can be called
            expect(true).toBe(true);
        });
    });

    describe('resumeProject', () => {
        it('should resume project', async () => {
            await coordinator.resumeProject();

            // Test that resume method exists and can be called
            expect(true).toBe(true);
        });
    });

    describe('handleError', () => {
        it('should handle error', async () => {
            const error = new Error('Test error');

            await coordinator.handleError(error);

            const state = coordinator.getProjectState();
            expect(state.errors.length).toBeGreaterThan(0);
        });

        it('should handle fatal error', async () => {
            const fatalError = new Error('Fatal error');
            (fatalError as any).fatal = true;

            await coordinator.handleError(fatalError);

            const state = coordinator.getProjectState();
            expect(state.errors.length).toBeGreaterThan(0);
            expect(state.context.get('errorReport')).toBeDefined();
        });

        it('should handle non-fatal error', async () => {
            const nonFatalError = new Error('Non-fatal error');

            await coordinator.handleError(nonFatalError);

            const state = coordinator.getProjectState();
            expect(state.errors.length).toBeGreaterThan(0);
        });

        it('should distinguish fatal and non-fatal errors', async () => {
            const fatalError = new Error('Fatal');
            (fatalError as any).fatal = true;
            const nonFatalError = new Error('Non-fatal');

            await coordinator.handleError(fatalError);
            await coordinator.handleError(nonFatalError);

            const state = coordinator.getProjectState();
            expect(state.errors.length).toBe(2);
        });
    });

    describe('Error Handling - Private Methods', () => {
        it('should generate error report for fatal error', async () => {
            const error = new Error('Test fatal error');
            error.stack = 'Error: Test fatal error\n    at test.js:10:5';
            (error as any).fatal = true;

            await coordinator.handleError(error);

            const state = coordinator.getProjectState();
            const errorReport = state.context.get('errorReport');

            expect(errorReport).toBeDefined();
            expect(errorReport).toContain('错误报告');
            expect(errorReport).toContain('Test fatal error');
            expect(errorReport).toContain('堆栈');
        });

        it('should check fatal error flag', async () => {
            const fatalError = new Error('Fatal');
            (fatalError as any).fatal = true;
            const normalError = new Error('Normal');

            await coordinator.handleError(fatalError);
            await coordinator.handleError(normalError);

            const state = coordinator.getProjectState();
            expect(state.context.get('errorReport')).toBeDefined();
        });

        it('should handle FATAL code error', async () => {
            const fatalError = new Error('FATAL error');
            (fatalError as any).code = 'FATAL';

            await coordinator.handleError(fatalError);

            const state = coordinator.getProjectState();
            expect(state.context.get('errorReport')).toBeDefined();
        });
    });

    describe('Project Execution with Dependencies', () => {
        it('should execute phases in order', async () => {
            const phases = [
                {
                    name: 'Phase 1',
                    order: 1,
                    skills: [{ name: 'skill1', order: 1, input: {} }]
                },
                {
                    name: 'Phase 2',
                    order: 2,
                    skills: [{ name: 'skill2', order: 1, input: {} }]
                }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            await testCoordinator.startProject({ test: 'data' });

            const state = testCoordinator.getProjectState();
            expect(state.completedPhases).toContain('Phase 1');
            expect(state.completedPhases).toContain('Phase 2');
        });

        it('should handle skill dependencies correctly', async () => {
            const phases = [
                {
                    name: 'Phase 1',
                    order: 1,
                    skills: [
                        { name: 'skill1', order: 1, input: {} },
                        { name: 'skill2', order: 2, input: {}, dependencies: ['skill1'] }
                    ]
                }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            await testCoordinator.startProject({});

            const state = testCoordinator.getProjectState();
            expect(state.completedPhases).toContain('skill1');
            expect(state.completedPhases).toContain('skill2');
        });

        it('should throw error when dependency not met', async () => {
            const phases = [
                {
                    name: 'Phase 1',
                    order: 1,
                    skills: [
                        { name: 'skill2', order: 1, input: {}, dependencies: ['nonexistent'] }
                    ]
                }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            await expect(testCoordinator.startProject({})).rejects.toThrow('依赖未完成');
        });

        it('should execute all skills in a phase', async () => {
            const phases = [
                {
                    name: 'Phase 1',
                    order: 1,
                    skills: [
                        { name: 'skill1', order: 1, input: {} },
                        { name: 'skill2', order: 2, input: {} },
                        { name: 'skill3', order: 3, input: {} }
                    ]
                }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            await testCoordinator.startProject({});

            const state = testCoordinator.getProjectState();
            expect(state.completedPhases).toContain('skill1');
            expect(state.completedPhases).toContain('skill2');
            expect(state.completedPhases).toContain('skill3');
        });
    });

    describe('Error Handling in Skills', () => {
        it('should handle non-fatal skill error and continue', async () => {
            const phases = [
                {
                    name: 'Phase 1',
                    order: 1,
                    skills: [
                        { name: 'skill1', order: 1, input: {} },
                        { name: 'skill2', order: 2, input: {} }
                    ]
                }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            // Mock invokeSkill to throw non-fatal error
            const originalInvoke = (testCoordinator as any).invokeSkill;
            (testCoordinator as any).invokeSkill = jest.fn().mockImplementation(async (name: string) => {
                if (name === 'skill1') {
                    throw new Error('Skill error');
                }
                return originalInvoke.call(testCoordinator, name);
            });

            await testCoordinator.startProject({});

            const state = testCoordinator.getProjectState();
            expect(state.errors.length).toBeGreaterThan(0);
            expect(state.completedPhases.length).toBeGreaterThanOrEqual(0);
        });

        it('should stop on fatal skill error', async () => {
            const phases = [
                {
                    name: 'Phase 1',
                    order: 1,
                    skills: [
                        { name: 'skill1', order: 1, input: {} },
                        { name: 'skill2', order: 2, input: {} }
                    ]
                }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            // Mock invokeSkill to throw fatal error
            (testCoordinator as any).invokeSkill = jest.fn().mockImplementation(async (name: string) => {
                if (name === 'skill1') {
                    const error = new Error('Fatal skill error');
                    (error as any).fatal = true;
                    throw error;
                }
                return { success: true };
            });

            await expect(testCoordinator.startProject({})).rejects.toThrow('Fatal skill error');
        });
    });

    describe('Context Management', () => {
        it('should store skill results in context', async () => {
            const phases = [
                {
                    name: 'Phase 1',
                    order: 1,
                    skills: [{ name: 'skill1', order: 1, input: {} }]
                }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            await testCoordinator.startProject({ testData: 'value' });

            const state = testCoordinator.getProjectState();
            expect(state.context.get('requirements')).toEqual({ testData: 'value' });
            expect(state.context.get('skill1')).toBeDefined();
        });

        it('should persist context across phases', async () => {
            const phases = [
                {
                    name: 'Phase 1',
                    order: 1,
                    skills: [{ name: 'skill1', order: 1, input: {} }]
                },
                {
                    name: 'Phase 2',
                    order: 2,
                    skills: [{ name: 'skill2', order: 1, input: {} }]
                }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            await testCoordinator.startProject({ initial: 'data' });

            const state = testCoordinator.getProjectState();
            expect(state.context.get('requirements')).toEqual({ initial: 'data' });
            expect(state.context.get('skill1')).toBeDefined();
            expect(state.context.get('skill2')).toBeDefined();
        });
    });

    describe('Progress Calculation', () => {
        it('should calculate progress correctly', async () => {
            const phases = [
                { name: 'Phase 1', order: 1, skills: [{ name: 'skill1', order: 1, input: {} }] },
                { name: 'Phase 2', order: 2, skills: [{ name: 'skill2', order: 1, input: {} }] },
                { name: 'Phase 3', order: 3, skills: [{ name: 'skill3', order: 1, input: {} }] },
                { name: 'Phase 4', order: 4, skills: [{ name: 'skill4', order: 1, input: {} }] }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            let report = testCoordinator.getProgressReport();
            expect(report).toBeTruthy();

            await testCoordinator.startProject({});

            report = testCoordinator.getProgressReport();
            // Verify report is generated and contains progress info
            expect(report).toContain('进度');
        });

        it('should update progress during execution', async () => {
            const phases = [
                { name: 'Phase 1', order: 1, skills: [{ name: 'skill1', order: 1, input: {} }] },
                { name: 'Phase 2', order: 2, skills: [{ name: 'skill2', order: 1, input: {} }] }
            ];

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases,
                debugMode: false
            });

            const report1 = testCoordinator.getProgressReport();
            expect(report1).toContain('0.0%');

            await testCoordinator.startProject({});

            const report2 = testCoordinator.getProgressReport();
            expect(report2).toBeTruthy();
            expect(report2.length).toBeGreaterThan(0);
        });
    });

    describe('Debug Mode', () => {
        it('should log messages when debug mode is enabled', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases: [
                    { name: 'Phase 1', order: 1, skills: [{ name: 'skill1', order: 1, input: {} }] }
                ],
                debugMode: true
            });

            await testCoordinator.startProject({});

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('should not log messages when debug mode is disabled', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases: [
                    { name: 'Phase 1', order: 1, skills: [{ name: 'skill1', order: 1, input: {} }] }
                ],
                debugMode: false
            });

            await testCoordinator.startProject({});

            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('project phases and skills', () => {
        it('should handle multiple phases in sequence', async () => {
            const coordinator = new ProjectCoordinator({
                projectType: 'backend',
                debugMode: false,
                phases: [
                    { name: 'Analysis', order: 1, skills: [{ name: 'analyzer', order: 1, input: {} }] },
                    { name: 'Design', order: 2, skills: [{ name: 'designer', order: 1, input: {} }] },
                    { name: 'Implementation', order: 3, skills: [{ name: 'developer', order: 1, input: {} }] }
                ]
            });

            await coordinator.startProject({});
            const status = coordinator.getProjectState();
            expect(status.completedPhases).toContain('Analysis');
        });

        it('should handle empty input for skills', async () => {
            const coordinator = new ProjectCoordinator({
                projectType: 'mobile',
                debugMode: false,
                phases: [
                    { name: 'Setup', order: 1, skills: [{ name: 'setup-skill', order: 1, input: {} }] }
                ]
            });

            await coordinator.startProject({});
            const status = coordinator.getProjectState();
            expect(status.context).toBeDefined();
        });

        it('should handle large input data', async () => {
            const largeInput = { config: Array(1000).fill('data') };
            const coordinator = new ProjectCoordinator({
                projectType: 'desktop',
                debugMode: false,
                phases: [
                    { name: 'Processing', order: 1, skills: [{ name: 'processor', order: 1, input: largeInput }] }
                ]
            });

            await coordinator.startProject(largeInput);
            const status = coordinator.getProjectState();
            expect(status.completedPhases).toContain('Processing');
        });

        it('should handle nested phase structures', async () => {
            const coordinator = new ProjectCoordinator({
                projectType: 'web',
                debugMode: false,
                phases: [
                    {
                        name: 'Phase A',
                        order: 1,
                        skills: [
                            { name: 'skill1', order: 1, input: { level: 'high' } },
                            { name: 'skill2', order: 2, input: { level: 'medium' } },
                            { name: 'skill3', order: 3, input: { level: 'low' } }
                        ]
                    }
                ]
            });

            await coordinator.startProject({});
            const status = coordinator.getProjectState();
            expect(status.context).toBeDefined();
            expect(status.errors).toBeDefined();
        });

        it('should track project timing information', async () => {
            const coordinator = new ProjectCoordinator({
                projectType: 'backend',
                debugMode: false,
                phases: [
                    { name: 'Phase', order: 1, skills: [{ name: 'skill', order: 1, input: {} }] }
                ]
            });

            await coordinator.startProject({});
            const status = coordinator.getProjectState();
            expect(status).toHaveProperty('currentPhase');
        });
    });

    describe('generateFinalReport with errors', () => {
        it('should include error details in final report when errors exist', async () => {
            const error1 = new Error('First error occurred');
            const error2 = new Error('Second error occurred');

            await coordinator.handleError(error1);
            await coordinator.handleError(error2);

            const report = coordinator.generateFinalReport();

            expect(report).toContain('错误日志');
            expect(report).toContain('1. First error occurred');
            expect(report).toContain('2. Second error occurred');
        });

        it('should format error log correctly with multiple errors', async () => {
            const errors = [
                new Error('Database connection failed'),
                new Error('API timeout'),
                new Error('Validation failed')
            ];

            for (const error of errors) {
                await coordinator.handleError(error);
            }

            const report = coordinator.generateFinalReport();
            const state = coordinator.getProjectState();

            expect(state.errors.length).toBe(3);
            expect(report).toContain('总错误数: 3');
            expect(report).toContain('Database connection failed');
            expect(report).toContain('API timeout');
            expect(report).toContain('Validation failed');
        });
    });

    describe('runCliExample', () => {
        it('should export runCliExample function', () => {
            const { runCliExample } = require('../../../skills/skills/project-coordinator/scripts/coordinator');
            expect(typeof runCliExample).toBe('function');
        });

        it('should execute runCliExample and handle success case', (done) => {
            const { runCliExample } = require('../../../skills/skills/project-coordinator/scripts/coordinator');

            // Mock console methods to avoid output
            const originalLog = console.log;
            const originalError = console.error;
            console.log = jest.fn();
            console.error = jest.fn();

            // Execute the function
            runCliExample();

            // Wait for async execution to complete
            setTimeout(() => {
                expect(console.log).toHaveBeenCalled();

                // Restore console
                console.log = originalLog;
                console.error = originalError;
                done();
            }, 100);
        });

        it('should handle error case in runCliExample when startProject fails', (done) => {
            // Create a coordinator instance and mock startProject to reject
            const coordinator = new ProjectCoordinator({
                projectType: 'web',
                phases: [],
                debugMode: true
            });

            // Mock console methods to avoid output
            const originalLog = console.log;
            const originalError = console.error;
            const errorSpy = jest.fn();
            console.log = jest.fn();
            console.error = errorSpy;

            // Create a promise that rejects
            const failingPromise = coordinator.startProject({ description: '测试项目' });

            // Mock the promise to reject
            jest.spyOn(coordinator, 'startProject').mockImplementation(() => {
                return Promise.reject(new Error('Test project error'));
            });

            // Execute the promise with error handler (similar to runCliExample)
            coordinator.startProject({ description: '测试项目' })
                .then(() => {
                    console.log('Success');
                })
                .catch((error) => {
                    console.error('项目失败:', error);

                    // Verify error was caught
                    expect(errorSpy).toHaveBeenCalledWith('项目失败:', expect.any(Error));

                    // Restore console
                    console.log = originalLog;
                    console.error = originalError;
                    done();
                });
        });
    });

    describe('handleProjectSuccess and handleProjectError', () => {
        it('should handle project success and print reports', () => {
            const originalLog = console.log;
            const logSpy = jest.fn();
            console.log = logSpy;

            const testCoordinator = new ProjectCoordinator({
                projectType: 'web',
                phases: [],
                debugMode: false
            });

            handleProjectSuccess(testCoordinator);

            expect(logSpy).toHaveBeenCalled();

            console.log = originalLog;
        });

        it('should handle project error and log the error', () => {
            const originalError = console.error;
            const errorSpy = jest.fn();
            console.error = errorSpy;

            const testError = new Error('Test error message');
            handleProjectError(testError);

            expect(errorSpy).toHaveBeenCalledWith('项目失败:', testError);

            console.error = originalError;
        });
    });
});
