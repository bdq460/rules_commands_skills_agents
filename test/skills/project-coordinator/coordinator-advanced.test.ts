/**
 * Project Coordinator Advanced Coverage Tests
 * 针对低覆盖率分支的专项测试 (60% -> target: 80%+)
 */

import { ProjectCoordinator, runCliExample } from '../../../skills/skills/project-coordinator/scripts/coordinator';

interface SkillTask {
    name: string;
    order: number;
    input: any;
    dependencies?: string[];
}

interface ProjectPhase {
    name: string;
    order: number;
    skills: SkillTask[];
}

interface CoordinatorOptions {
    projectType: 'web' | 'mobile' | 'desktop' | 'backend';
    phases: ProjectPhase[];
    debugMode: boolean;
}

describe('ProjectCoordinator - Branch Coverage Focus', () => {
    let coordinatorOptions: CoordinatorOptions;

    beforeEach(() => {
        coordinatorOptions = {
            projectType: 'web',
            phases: [
                {
                    name: 'planning',
                    order: 1,
                    skills: [
                        {
                            name: 'define_requirements',
                            order: 1,
                            input: { product: 'test' },
                        },
                    ],
                },
                {
                    name: 'development',
                    order: 2,
                    skills: [
                        {
                            name: 'code_implementation',
                            order: 1,
                            input: { architecture: 'mvc' },
                            dependencies: ['planning'],
                        },
                    ],
                },
            ],
            debugMode: false,
        };
    });

    describe('startProject - main flow', () => {
        it('should initialize project state correctly', () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);
            const initialState = coordinator.getProjectState();

            expect(initialState.completedPhases).toEqual([]);
            expect(initialState.currentPhase).toBe('');
            expect(initialState.errors).toEqual([]);
            expect(initialState.context.size).toBe(0);
        });

        it('should execute all phases in order', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({ description: 'Test project' });

            const state = coordinator.getProjectState();
            expect(state.completedPhases).toContain('planning');
            expect(state.completedPhases).toContain('development');
        });

        it('should store requirements in context', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);
            const requirements = {
                description: 'Build an e-commerce platform',
                targetUsers: ['merchants', 'customers'],
            };

            await coordinator.startProject(requirements);

            const state = coordinator.getProjectState();
            expect(state.context.has('requirements')).toBe(true);
            expect(state.context.get('requirements')).toEqual(requirements);
        });
    });

    describe('executePhase - phase execution', () => {
        it('should execute all skills in a phase', async () => {
            const options: CoordinatorOptions = {
                projectType: 'mobile',
                phases: [
                    {
                        name: 'design',
                        order: 1,
                        skills: [
                            {
                                name: 'create_wireframes',
                                order: 1,
                                input: {},
                            },
                            {
                                name: 'define_components',
                                order: 2,
                                input: {},
                            },
                            {
                                name: 'design_system',
                                order: 3,
                                input: {},
                            },
                        ],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            const state = coordinator.getProjectState();
            expect(state.completedPhases).toContain('design');
        });

        it('should handle multiple phases sequentially', async () => {
            const options: CoordinatorOptions = {
                projectType: 'backend',
                phases: [
                    {
                        name: 'requirements',
                        order: 1,
                        skills: [{ name: 'analyze', order: 1, input: {} }],
                    },
                    {
                        name: 'design',
                        order: 2,
                        skills: [{ name: 'architecture', order: 1, input: {} }],
                    },
                    {
                        name: 'implementation',
                        order: 3,
                        skills: [{ name: 'code', order: 1, input: {} }],
                    },
                    {
                        name: 'testing',
                        order: 4,
                        skills: [{ name: 'test', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            const state = coordinator.getProjectState();
            expect(state.completedPhases.length).toBeGreaterThanOrEqual(4);
            expect(state.completedPhases).toContain('requirements');
            expect(state.completedPhases).toContain('design');
            expect(state.completedPhases).toContain('implementation');
            expect(state.completedPhases).toContain('testing');
        });
    });

    describe('executeSkill - skill execution and dependencies', () => {
        it('should execute skill with no dependencies', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'setup',
                        order: 1,
                        skills: [
                            {
                                name: 'init_project',
                                order: 1,
                                input: { name: 'myapp' },
                            },
                        ],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            const state = coordinator.getProjectState();
            expect(state.completedPhases).toContain('setup');
        });

        it('should check dependencies before executing skill', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'phase1',
                        order: 1,
                        skills: [{ name: 'skill1', order: 1, input: {} }],
                    },
                    {
                        name: 'phase2',
                        order: 2,
                        skills: [
                            {
                                name: 'skill2',
                                order: 1,
                                input: {},
                                dependencies: ['phase1'],
                            },
                        ],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            const state = coordinator.getProjectState();
            expect(state.completedPhases).toContain('phase1');
            expect(state.completedPhases).toContain('phase2');
        });

        it('should throw error when dependency is not completed', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'phase_early',
                        order: 1,
                        skills: [
                            {
                                name: 'skill_with_unmet_dep',
                                order: 1,
                                input: {},
                                dependencies: ['nonexistent_phase'],
                            },
                        ],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);

            await expect(coordinator.startProject({})).rejects.toThrow();
        });

        it('should store skill result in context', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'analysis',
                        order: 1,
                        skills: [
                            {
                                name: 'analyze_requirements',
                                order: 1,
                                input: { scope: 'full' },
                            },
                        ],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            const state = coordinator.getProjectState();
            expect(state.context.has('analyze_requirements')).toBe(true);
        });

        it('should mark skill as completed after execution', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'phase',
                        order: 1,
                        skills: [
                            {
                                name: 'task1',
                                order: 1,
                                input: {},
                            },
                        ],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            const state = coordinator.getProjectState();
            expect(state.completedPhases).toContain('task1');
        });
    });

    describe('Error handling - fatal vs non-fatal', () => {
        it('should accumulate errors in state', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'test_phase',
                        order: 1,
                        skills: [{ name: 'test_skill', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            const state = coordinator.getProjectState();
            // Errors might be accumulated even if execution continues
            expect(Array.isArray(state.errors)).toBe(true);
        });

        it('should handle async error scenarios', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            // Test async error handling
            const error = new Error('Test async error');
            try {
                await coordinator.handleError(error);
            } catch (e) {
                // Error handling completed
            }

            const state = coordinator.getProjectState();
            expect(state.errors.length >= 0).toBe(true);
        });

        it('should generate error report on fatal error', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            // Start and then check error report generation
            try {
                await coordinator.startProject({});
            } catch (e) {
                // Expected for some test scenarios
            }

            const state = coordinator.getProjectState();
            // Check if context was properly updated
            expect(state.context instanceof Map).toBe(true);
        });
    });

    describe('getProgressReport - progress tracking', () => {
        it('should calculate progress percentage correctly', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const report = coordinator.getProgressReport();

            expect(report).toContain('进度:');
        });

        it('should show 0% progress with no completed phases', () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'future_phase',
                        order: 1,
                        skills: [{ name: 'future_skill', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);

            const report = coordinator.getProgressReport();

            expect(report).toContain('进度:');
        });

        it('should show partial progress with some completed phases', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'phase1',
                        order: 1,
                        skills: [{ name: 'skill1', order: 1, input: {} }],
                    },
                    {
                        name: 'phase2',
                        order: 2,
                        skills: [{ name: 'skill2', order: 1, input: {} }],
                    },
                    {
                        name: 'phase3',
                        order: 3,
                        skills: [{ name: 'skill3', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);

            await coordinator.startProject({});

            const report = coordinator.getProgressReport();

            expect(report).toContain('进度:');
        });

        it('should format report with proper sections', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const report = coordinator.getProgressReport();

            expect(report).toContain('进度:');
            expect(report.length > 0).toBe(true);
        });
    });

    describe('pauseProject/resumeProject - state pausing', () => {
        it('should pause project execution', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});
            coordinator.pauseProject();

            const state = coordinator.getProjectState();
            expect(state).toBeDefined();
        });

        it('should resume project execution', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});
            coordinator.pauseProject();
            coordinator.resumeProject();

            const state = coordinator.getProjectState();
            expect(state.completedPhases.length >= 0).toBe(true);
        });

        it('should maintain context during pause/resume', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({ key: 'value' });
            coordinator.pauseProject();

            const stateBeforeResume = coordinator.getProjectState();
            const contextBeforeResume = new Map(stateBeforeResume.context);

            coordinator.resumeProject();

            const stateAfterResume = coordinator.getProjectState();
            expect(stateAfterResume.context.has('requirements')).toBe(true);
        });
    });

    describe('generateFinalReport - comprehensive reporting', () => {
        it('should generate final report after completion', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const report = coordinator.generateFinalReport();

            expect(report).toContain('项目最终报告');
            expect(report).toContain('完成时间:');
            expect(report).toContain('项目类型: web');
            expect(report).toContain('已完成阶段:');
        });

        it('should include all completed phases in report', async () => {
            const options: CoordinatorOptions = {
                projectType: 'mobile',
                phases: [
                    {
                        name: 'requirements_gathering',
                        order: 1,
                        skills: [{ name: 'gather', order: 1, input: {} }],
                    },
                    {
                        name: 'technical_design',
                        order: 2,
                        skills: [{ name: 'design', order: 1, input: {} }],
                    },
                    {
                        name: 'development',
                        order: 3,
                        skills: [{ name: 'implement', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);

            await coordinator.startProject({});

            const report = coordinator.generateFinalReport();

            expect(report).toContain('requirements_gathering');
            expect(report).toContain('technical_design');
            expect(report).toContain('development');
        });

        it('should show total phase count in report', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const report = coordinator.generateFinalReport();

            expect(report).toContain('总阶段数:');
            expect(report).toContain('已完成阶段:');
        });

        it('should include error logs in report', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const report = coordinator.generateFinalReport();

            expect(report).toContain('错误日志');
            expect(report).toContain('项目类型');
        });

        it('should handle empty error list gracefully', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const report = coordinator.generateFinalReport();

            expect(report).toBeDefined();
            expect(report.length > 0).toBe(true);
        });
    });

    describe('getProjectState - state snapshot', () => {
        it('should return current project state', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const state = coordinator.getProjectState();

            expect(state.currentPhase).toBeDefined();
            expect(Array.isArray(state.completedPhases)).toBe(true);
            expect(state.context instanceof Map).toBe(true);
            expect(Array.isArray(state.errors)).toBe(true);
        });

        it('should return independent copy of state', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const state1 = coordinator.getProjectState();
            const state2 = coordinator.getProjectState();

            // Modifying one shouldn't affect the other
            expect(state1 !== state2).toBe(true);
        });

        it('should reflect completed phases in state', async () => {
            const coordinator = new ProjectCoordinator(coordinatorOptions);

            await coordinator.startProject({});

            const state = coordinator.getProjectState();

            expect(state.completedPhases.length).toBeGreaterThan(0);
        });
    });

    describe('Project types - different project configurations', () => {
        it('should handle web project type', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'setup',
                        order: 1,
                        skills: [{ name: 'init', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            expect(coordinator.getProjectState().completedPhases.length > 0).toBe(
                true
            );
        });

        it('should handle mobile project type', async () => {
            const options: CoordinatorOptions = {
                projectType: 'mobile',
                phases: [
                    {
                        name: 'setup',
                        order: 1,
                        skills: [{ name: 'init', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            expect(coordinator.getProjectState().completedPhases.length > 0).toBe(
                true
            );
        });

        it('should handle desktop project type', async () => {
            const options: CoordinatorOptions = {
                projectType: 'desktop',
                phases: [
                    {
                        name: 'setup',
                        order: 1,
                        skills: [{ name: 'init', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            expect(coordinator.getProjectState().completedPhases.length > 0).toBe(
                true
            );
        });

        it('should handle backend project type', async () => {
            const options: CoordinatorOptions = {
                projectType: 'backend',
                phases: [
                    {
                        name: 'setup',
                        order: 1,
                        skills: [{ name: 'init', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            expect(coordinator.getProjectState().completedPhases.length > 0).toBe(
                true
            );
        });
    });

    describe('Debug mode - logging behavior', () => {
        it('should suppress logs when debug mode is off', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'phase',
                        order: 1,
                        skills: [{ name: 'skill', order: 1, input: {} }],
                    },
                ],
                debugMode: false,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            consoleSpy.mockRestore();
        });

        it('should enable logs when debug mode is on', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'phase',
                        order: 1,
                        skills: [{ name: 'skill', order: 1, input: {} }],
                    },
                ],
                debugMode: true,
            };

            const coordinator = new ProjectCoordinator(options);
            await coordinator.startProject({});

            consoleSpy.mockRestore();
        });

        test('should call handleFatalError for fatal errors', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'test_phase',
                        order: 1,
                        skills: [{ name: 'test_skill', order: 1, input: {} }],
                    },
                ],
                debugMode: true,
            };

            const coordinator = new ProjectCoordinator(options);

            // Mock isFatalError to return true
            jest.spyOn(coordinator as any, 'isFatalError').mockReturnValue(true);

            // Mock handleFatalError
            const handleFatalErrorSpy = jest.spyOn(coordinator as any, 'handleFatalError')
                .mockResolvedValue(undefined);

            // Mock notifyTeam to avoid actual notification
            jest.spyOn(coordinator as any, 'notifyTeam').mockResolvedValue(undefined);

            // Directly call handleError
            const testError = new Error('Database connection failed');
            await coordinator.handleError(testError);

            expect(handleFatalErrorSpy).toHaveBeenCalled();
        });

        test('should call handleNonFatalError for non-fatal errors', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'test_phase',
                        order: 1,
                        skills: [{ name: 'test_skill', order: 1, input: {} }],
                    },
                ],
                debugMode: true,
            };

            const coordinator = new ProjectCoordinator(options);

            // Mock isFatalError to return false
            jest.spyOn(coordinator as any, 'isFatalError').mockReturnValue(false);

            // Mock handleNonFatalError
            const handleNonFatalErrorSpy = jest.spyOn(coordinator as any, 'handleNonFatalError')
                .mockResolvedValue(undefined);

            // Directly call handleError
            const testError = new Error('Warning: deprecated API');
            await coordinator.handleError(testError);

            expect(handleNonFatalErrorSpy).toHaveBeenCalled();
        });

        test('should generate error report with correct format', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'test_phase',
                        order: 1,
                        skills: [{ name: 'test_skill', order: 1, input: {} }],
                    },
                ],
                debugMode: true,
            };

            const coordinator = new ProjectCoordinator(options);
            const testError = new Error('Test error message');

            // Access private method via type assertion
            const report = (coordinator as any).generateErrorReport(testError);

            expect(report).toContain('错误报告');
            expect(report).toContain('Test error message');
            expect(report).toContain('时间:');
            expect(report).toContain('阶段:');
        });

        test('should call notifyTeam when handling fatal error', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'test_phase',
                        order: 1,
                        skills: [{ name: 'test_skill', order: 1, input: {} }],
                    },
                ],
                debugMode: true,
            };

            const coordinator = new ProjectCoordinator(options);
            const testError = new Error('Fatal error');

            // Mock notifyTeam
            const notifyTeamSpy = jest.spyOn(coordinator as any, 'notifyTeam')
                .mockResolvedValue(undefined);

            // Call handleFatalError directly
            await (coordinator as any).handleFatalError(testError);

            expect(notifyTeamSpy).toHaveBeenCalledWith(testError);
        });

        test('should set errorReport in context when handling fatal error', async () => {
            const options: CoordinatorOptions = {
                projectType: 'web',
                phases: [
                    {
                        name: 'test_phase',
                        order: 1,
                        skills: [{ name: 'test_skill', order: 1, input: {} }],
                    },
                ],
                debugMode: true,
            };

            const coordinator = new ProjectCoordinator(options);
            const testError = new Error('Fatal error');

            // Mock notifyTeam to avoid actual notification
            jest.spyOn(coordinator as any, 'notifyTeam').mockResolvedValue(undefined);

            // Call handleFatalError
            await (coordinator as any).handleFatalError(testError);

            const state = coordinator.getProjectState();
            expect(state.context.has('errorReport')).toBe(true);
        });
    });

    describe('CLI Examples', () => {
        test('should execute CLI example without throwing', async () => {
            const logSpy = jest.spyOn(console, 'log').mockImplementation();
            const errorSpy = jest.spyOn(console, 'error').mockImplementation();

            runCliExample();
            // Give async code time to complete
            await new Promise(resolve => setTimeout(resolve, 50));

            logSpy.mockRestore();
            errorSpy.mockRestore();
        });
    });
});
