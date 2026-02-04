/**
 * WBS Generator 单元测试
 */

import { WBSGenerator } from '../../../skills/skills/project-planner/scripts/wbs-generator';

describe('WBSGenerator', () => {
    let generator: WBSGenerator;

    beforeEach(() => {
        generator = new WBSGenerator();
    });

    afterEach(() => {
        // 清理测试环境，确保测试隔离
        generator = null as any;
    });

    describe('generateWBS', () => {
        it('should create a valid WBS structure', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
            });

            expect(wbs).toHaveProperty('project');
            expect(wbs).toHaveProperty('version');
            expect(wbs).toHaveProperty('startDate');
            expect(wbs).toHaveProperty('endDate');
            expect(wbs).toHaveProperty('totalDuration');
            expect(wbs).toHaveProperty('phases');
            expect(wbs).toHaveProperty('milestones');
        });

        it('should handle phases with tasks', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
                phases: [
                    {
                        id: 'PH001',
                        name: '需求分析',
                        description: '收集和分析需求',
                        startDate: '2024-01-01',
                        endDate: '2024-01-31',
                        tasks: [
                            {
                                id: 'T001',
                                name: '用户调研',
                                description: '收集用户需求',
                                duration: 10,
                                unit: 'days',
                                dependencies: [],
                                assignees: ['产品经理'],
                                priority: 'high',
                                status: 'pending',
                                deliverables: ['调研报告'],
                            },
                        ],
                        dependencies: [],
                    },
                ],
            });

            expect(wbs.phases.length).toBeGreaterThan(0);
            expect(wbs.phases[0].tasks.length).toBeGreaterThan(0);
        });
    });

    describe('generateMermaidGantt', () => {
        it('should generate Mermaid gantt chart format', () => {
            const wbs = {
                project: '测试项目',
                version: '1.0',
                startDate: '2024-01-01',
                endDate: '2024-06-30',
                totalDuration: 180,
                phases: [
                    {
                        id: 'PH001',
                        name: '需求分析',
                        description: '收集和分析需求',
                        startDate: '2024-01-01',
                        endDate: '2024-01-31',
                        tasks: [
                            {
                                id: 'T001',
                                name: '用户调研',
                                description: '收集用户需求',
                                duration: 10,
                                unit: 'days' as const,
                                dependencies: [],
                                assignees: ['产品经理'],
                                priority: 'high' as const,
                                status: 'pending' as const,
                                deliverables: ['调研报告'],
                            },
                        ],
                        dependencies: [],
                    },
                ],
                milestones: [],
            };

            const gantt = generator.generateMermaidGantt(wbs);

            expect(gantt).toContain('gantt');
            expect(gantt).toContain('title');
            expect(gantt).toContain('需求分析');
        });
    });

    // TODO: 在 WBSGenerator 中实现 calculateCriticalPath 方法后启用此测试
    // describe('calculateCriticalPath', () => {
    //   it('should calculate critical path for WBS', () => {
    //     const wbs = {
    //       phases: [
    //         {
    //           id: 'PH001',
    //           name: '需求分析',
    //           tasks: [
    //             { id: 'T001', duration: 10, dependencies: [] },
    //             { id: 'T002', duration: 5, dependencies: ['T001'] },
    //           ],
    //         },
    //       ],
    //     };
    //
    //     const criticalPath = generator.calculateCriticalPath(wbs);
    //
    //     expect(criticalPath).toBeDefined();
    //     expect(Array.isArray(criticalPath)).toBe(true);
    //   });
    // });

    describe('helper methods coverage', () => {
        test('generateGanttChart should handle task dependencies', () => {
            const phases: any[] = [
                {
                    id: 'P1',
                    name: 'Phase 1',
                    description: 'Test phase',
                    startDate: '2024-01-01',
                    endDate: '2024-01-10',
                    tasks: [
                        {
                            id: 'T1',
                            name: 'Task 1',
                            duration: 2,
                            unit: 'days',
                            dependencies: [],
                            assignees: ['Dev'],
                            priority: 'high',
                            status: 'completed',
                            deliverables: []
                        },
                        {
                            id: 'T2',
                            name: 'Task 2',
                            duration: 3,
                            unit: 'days',
                            dependencies: ['T1'],
                            assignees: ['Dev'],
                            priority: 'high',
                            status: 'pending',
                            deliverables: []
                        }
                    ],
                    dependencies: []
                }
            ];

            const wbs = generator.generateWBS({
                name: 'Deps Test',
                startDate: '2024-01-01',
                description: 'Test',
                phases
            });

            const gantt = generator.generateGanttChart(wbs);
            const t1 = gantt.tasks.find(t => t.id === 'T1');
            const t2 = gantt.tasks.find(t => t.id === 'T2');

            expect(t1).toBeDefined();
            expect(t2?.start).toBe(t1?.end);
        });

        test('getTaskEndDate should return empty string when not found', () => {
            const end = (generator as any).getTaskEndDate([], 'UNKNOWN');
            expect(end).toBe('');
        });

        test('getDependencyStartDate should return empty string', () => {
            const start = (generator as any).getDependencyStartDate('T1');
            expect(start).toBe('');
        });

        test('calculateDuration should compute day difference', () => {
            const days = (generator as any).calculateDuration('2024-01-01', '2024-01-05');
            expect(days).toBe(4);
        });
    });

    describe('generateMarkdownWBS', () => {
        it('should generate Markdown format WBS', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
            });

            const markdown = generator.generateMarkdownWBS(wbs);

            expect(markdown).toContain('工作分解结构 (WBS)');
            expect(markdown).toContain('测试项目');
            expect(markdown).toContain('版本');
            expect(markdown).toContain('开始日期');
            expect(markdown).toContain('结束日期');
        });

        it('should include milestones in Markdown', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
            });

            const markdown = generator.generateMarkdownWBS(wbs);

            expect(markdown).toContain('项目里程碑');
            expect(markdown).toContain('- [ ]');
        });

        it('should include phases with tasks', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
            });

            const markdown = generator.generateMarkdownWBS(wbs);

            expect(markdown).toContain('项目阶段');
            expect(markdown).toContain('###');
            expect(markdown).toContain('任务列表');
        });

        it('should include task priorities with emojis', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
            });

            const markdown = generator.generateMarkdownWBS(wbs);

            // 检查至少有一个emoji存在
            expect(markdown.length).toBeGreaterThan(0);
            expect(markdown).toContain('🔴');
            expect(markdown).toContain('🟠');
            expect(markdown).toContain('🟡');
            // 注意：根据实际任务优先级，可能不一定有🟢
        });

        it('should include task details', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
            });

            const markdown = generator.generateMarkdownWBS(wbs);

            expect(markdown).toContain('工期');
            expect(markdown).toContain('描述');
            expect(markdown).toContain('依赖');
            expect(markdown).toContain('负责人');
            expect(markdown).toContain('交付物');
        });
    });

    describe('generateResourceAllocation', () => {
        it('should generate resource allocation table', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
            });

            const allocation = generator.generateResourceAllocation(wbs);

            expect(allocation).toContain('资源分配表');
            expect(allocation).toContain('| 资源 | 任务数 | 总工时 |');
            expect(allocation).toContain('|------|--------|--------|');
        });

        it('should calculate correct resource allocation', () => {
            const wbs = generator.generateWBS({
                name: '测试项目',
                startDate: '2024-01-01',
                description: '测试项目描述',
            });

            const allocation = generator.generateResourceAllocation(wbs);

            // Check that there are resource rows
            const lines = allocation.split('\n');
            const resourceLines = lines.filter(line => line.startsWith('| ') && !line.includes('资源'));
            expect(resourceLines.length).toBeGreaterThan(0);
        });

        it('should handle multiple assignees per task', () => {
            const wbs = generator.generateWBS({
                name: '多资源测试',
                startDate: '2024-01-01',
                description: '测试多资源分配',
            });

            const allocation = generator.generateResourceAllocation(wbs);

            // Should include multiple resources
            expect(allocation).toContain('| Product Manager |');
            expect(allocation).toContain('| Requirements Analyst |');
        });
    });

    describe('generateGanttChart with different statuses', () => {
        it('should set progress to 100% for completed tasks', () => {
            const wbs = generator.generateWBS({
                name: '状态测试',
                startDate: '2024-01-01',
                description: '测试不同状态的任务',
                phases: [
                    {
                        id: 'P1',
                        name: 'Phase 1',
                        description: 'Test',
                        startDate: '2024-01-01',
                        endDate: '2024-01-10',
                        tasks: [
                            {
                                id: 'T1',
                                name: 'Completed Task',
                                duration: 5,
                                unit: 'days' as const,
                                dependencies: [],
                                assignees: ['Dev'],
                                priority: 'high' as const,
                                status: 'completed' as const,
                                deliverables: []
                            }
                        ],
                        dependencies: []
                    }
                ]
            });

            const gantt = generator.generateGanttChart(wbs);
            const task = gantt.tasks.find(t => t.id === 'T1');

            expect(task?.progress).toBe(100);
        });

        it('should set progress to 50% for in-progress tasks', () => {
            const wbs = generator.generateWBS({
                name: '状态测试',
                startDate: '2024-01-01',
                description: '测试不同状态的任务',
                phases: [
                    {
                        id: 'P1',
                        name: 'Phase 1',
                        description: 'Test',
                        startDate: '2024-01-01',
                        endDate: '2024-01-10',
                        tasks: [
                            {
                                id: 'T1',
                                name: 'In Progress Task',
                                duration: 5,
                                unit: 'days' as const,
                                dependencies: [],
                                assignees: ['Dev'],
                                priority: 'high' as const,
                                status: 'in-progress' as const,
                                deliverables: []
                            }
                        ],
                        dependencies: []
                    }
                ]
            });

            const gantt = generator.generateGanttChart(wbs);
            const task = gantt.tasks.find(t => t.id === 'T1');

            expect(task?.progress).toBe(50);
        });

        it('should set progress to 0 for pending tasks', () => {
            const wbs = generator.generateWBS({
                name: '状态测试',
                startDate: '2024-01-01',
                description: '测试不同状态的任务',
                phases: [
                    {
                        id: 'P1',
                        name: 'Phase 1',
                        description: 'Test',
                        startDate: '2024-01-01',
                        endDate: '2024-01-10',
                        tasks: [
                            {
                                id: 'T1',
                                name: 'Pending Task',
                                duration: 5,
                                unit: 'days' as const,
                                dependencies: [],
                                assignees: ['Dev'],
                                priority: 'high' as const,
                                status: 'pending' as const,
                                deliverables: []
                            }
                        ],
                        dependencies: []
                    }
                ]
            });

            const gantt = generator.generateGanttChart(wbs);
            const task = gantt.tasks.find(t => t.id === 'T1');

            expect(task?.progress).toBe(0);
        });
    });

    describe('addDays', () => {
        it('should add days to date correctly', () => {
            const result = (generator as any).addDays('2024-01-01', 10);
            expect(result).toBe('2024-01-11');
        });

        it('should handle month boundaries', () => {
            const result = (generator as any).addDays('2024-01-31', 1);
            expect(result).toBe('2024-02-01');
        });

        it('should handle year boundaries', () => {
            const result = (generator as any).addDays('2024-12-31', 1);
            expect(result).toBe('2025-01-01');
        });
    });

    describe('calculateTotalDays', () => {
        it('should calculate total days for phases', () => {
            const phases: any[] = [
                { id: 'P1', name: 'Phase 1', description: '', startDate: '', endDate: '', tasks: [], dependencies: [] },
                { id: 'P2', name: 'Phase 2', description: '', startDate: '', endDate: '', tasks: [], dependencies: [] },
                { id: 'P3', name: 'Phase 3', description: '', startDate: '', endDate: '', tasks: [], dependencies: [] }
            ];

            const total = (generator as any).calculateTotalDays(phases);
            expect(total).toBe(45); // 3 phases * 15 days
        });
    });

    describe('generateMilestones', () => {
        it('should create milestones for each phase', () => {
            const phases: any[] = [
                {
                    id: 'P1',
                    name: '需求分析',
                    description: '收集需求',
                    startDate: '2024-01-01',
                    endDate: '2024-01-10',
                    tasks: [
                        { id: 'T1', name: 'Task 1', duration: 5, unit: 'days', dependencies: [], assignees: [], priority: 'high', status: 'pending', deliverables: [] }
                    ],
                    dependencies: []
                },
                {
                    id: 'P2',
                    name: '设计',
                    description: '设计产品',
                    startDate: '2024-01-11',
                    endDate: '2024-01-20',
                    tasks: [
                        { id: 'T2', name: 'Task 2', duration: 5, unit: 'days', dependencies: [], assignees: [], priority: 'high', status: 'pending', deliverables: [] }
                    ],
                    dependencies: ['P1']
                }
            ];

            const wbs: any = {
                project: '测试项目',
                version: '1.0',
                startDate: '2024-01-01',
                endDate: '2024-01-20',
                totalDuration: 20,
                phases,
                milestones: []
            };

            const milestones = (generator as any).generateMilestones(wbs);

            expect(milestones).toHaveLength(2);
            expect(milestones[0].id).toBe('MP1');
            expect(milestones[0].name).toBe('需求分析完成');
            expect(milestones[1].id).toBe('MP2');
            expect(milestones[1].name).toBe('设计完成');
        });

        it('should include task dependencies in milestone dependencies', () => {
            const phases: any[] = [
                {
                    id: 'P1',
                    name: 'Phase 1',
                    description: '',
                    startDate: '2024-01-01',
                    endDate: '2024-01-10',
                    tasks: [
                        { id: 'T1', name: 'Task 1', duration: 5, unit: 'days', dependencies: [], assignees: [], priority: 'high', status: 'pending', deliverables: [] },
                        { id: 'T2', name: 'Task 2', duration: 5, unit: 'days', dependencies: ['T1'], assignees: [], priority: 'high', status: 'pending', deliverables: [] }
                    ],
                    dependencies: []
                }
            ];

            const wbs: any = {
                project: '测试项目',
                version: '1.0',
                startDate: '2024-01-01',
                endDate: '2024-01-10',
                totalDuration: 10,
                phases,
                milestones: []
            };

            const milestones = (generator as any).generateMilestones(wbs);

            expect(milestones[0].dependencies).toContain('T1');
            expect(milestones[0].dependencies).toContain('T2');
        });
    });
});
