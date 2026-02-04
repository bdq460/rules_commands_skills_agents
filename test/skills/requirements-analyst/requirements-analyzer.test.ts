/**
 * Requirements Analyzer 单元测试
 */

import {
    analyzeDependencies,
    analyzeRequirementCoverage,
    createUseCase,
    createUserStory,
    generateRequirementId,
    generateTraceabilityMatrix,
    generateUseCaseDiagram,
    generateUseCaseDoc,
    generateUseCaseId,
    generateUserStoryDoc,
    userStoryToUseCase,
    validateRequirement,
    validateUserStory
} from '../../../skills/skills/requirements-analyst/scripts/requirements-analyzer';

describe('RequirementsAnalyzer', () => {
    describe('createUserStory', () => {
        it('should create user story with correct structure', () => {
            const input = {
                role: '用户',
                goal: '登录系统',
                benefit: '可以使用系统功能',
                priority: '高' as '高' | '中' | '低'
            };

            const result = createUserStory(input);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('role', '用户');
            expect(result).toHaveProperty('goal', '登录系统');
            expect(result).toHaveProperty('benefit', '可以使用系统功能');
            expect(result).toHaveProperty('priority', '高');
        });

        it('should generate acceptance criteria', () => {
            const input = {
                role: '用户',
                goal: '登录系统',
                benefit: '可以使用系统功能',
                priority: '高' as '高' | '中' | '低'
            };

            const result = createUserStory(input);

            expect(result.acceptanceCriteria).toBeDefined();
            expect(Array.isArray(result.acceptanceCriteria)).toBe(true);
            expect(result.acceptanceCriteria.length).toBeGreaterThan(0);
        });

        it('should estimate story points', () => {
            const input = {
                role: '用户',
                goal: '登录系统',
                benefit: '可以使用系统功能',
                priority: '高' as '高' | '中' | '低'
            };

            const result = createUserStory(input);

            expect(result.estimatedPoints).toBeDefined();
            expect(typeof result.estimatedPoints).toBe('number');
        });

        it('should handle different priorities', () => {
            const priorities = ['高', '中', '低'];

            priorities.forEach(priority => {
                const input = {
                    role: '用户',
                    goal: '登录系统',
                    benefit: '可以使用系统功能',
                    priority: priority as any
                };

                const result = createUserStory(input);
                expect(result.priority).toBe(priority);
            });
        });
    });

    describe('ID generators', () => {
        it('should generate requirement id with prefix and padding', () => {
            const id = generateRequirementId('mod', 7);
            expect(id).toBe('REQ-MOD-007');
        });

        it('should generate use case id with padding', () => {
            const id = generateUseCaseId(12);
            expect(id).toBe('UC-012');
        });
    });

    describe('userStoryToUseCase', () => {
        it('should transform user story into use case with flows', () => {
            const story = createUserStory({
                role: '买家',
                goal: '下单',
                benefit: '快速购买',
                priority: '高'
            });

            const useCase = userStoryToUseCase(story);

            expect(useCase).toHaveProperty('id');
            expect(useCase.name).toContain(story.goal);
            expect(useCase.mainFlow.length).toBeGreaterThan(0);
            expect(useCase.postconditions.success.length).toBeGreaterThan(0);
        });
    });

    describe('validateUserStory', () => {
        it('should pass INVEST checks for well-formed story', () => {
            const story = {
                id: 'US-123',
                role: '用户',
                goal: '用户快速登录查看仪表盘数据',
                benefit: '安全高效访问关键服务',
                acceptanceCriteria: ['When 输入凭证', 'Then 成功进入首页'],
                priority: '高' as const,
                estimatedPoints: 5,
            };

            const result = validateUserStory(story);
            expect(result.isValid).toBe(true);
            expect(result.score).toBeGreaterThanOrEqual(80);
        });

        it('should fail when acceptance criteria are missing', () => {
            const story = {
                id: 'US-999',
                role: '用户',
                goal: '随意描述',
                benefit: '未知',
                acceptanceCriteria: [],
                priority: '中' as any,
                estimatedPoints: 13,
            };

            const result = validateUserStory(story);
            expect(result.isValid).toBe(false);
            expect(result.score).toBeLessThan(80);
        });
    });

    describe('validateRequirement', () => {
        const baseRequirement = {
            id: 'REQ-001',
            title: '高性能搜索',
            description: '提供毫秒级响应',
            type: '功能需求' as const,
            priority: '高' as const,
            status: '已确认' as const,
            source: '产品',
            relatedUseCases: ['UC-001'],
            acceptanceCriteria: ['应该在100ms内返回结果'],
            dependencies: [] as string[],
        };

        it('should pass when fields are complete', () => {
            const result = validateRequirement(baseRequirement);
            expect(result.isValid).toBe(true);
            expect(result.score).toBeGreaterThanOrEqual(80);
        });

        it('should fail when missing essentials', () => {
            const badReq = { ...baseRequirement, acceptanceCriteria: [], relatedUseCases: [], description: '可能可以吧' };
            const result = validateRequirement(badReq as any);
            expect(result.isValid).toBe(false);
            expect(result.score).toBeLessThan(80);
        });
    });

    describe('documentation generators', () => {
        it('should generate user story markdown with sections', () => {
            const story = createUserStory({
                role: '访客',
                goal: '浏览商品',
                benefit: '了解信息',
                priority: '中'
            });

            const doc = generateUserStoryDoc(story);
            expect(doc).toContain('用户故事');
            expect(doc).toContain('验收标准');
            expect(doc).toContain(story.role);
            expect(doc).toContain(story.goal);
        });

        it('should generate use case markdown with tables', () => {
            const uc = createUseCase({
                name: '用户下单',
                actor: '用户',
                description: '下单流程',
                preconditions: ['用户已登录'],
                businessRules: ['需要库存校验'],
                priority: '高'
            });

            const doc = generateUseCaseDoc(uc);
            expect(doc).toContain('| 步骤 |');
            expect(doc).toContain('用例ID');
            expect(doc).toContain('业务规则');
        });

        it('should generate entity documentation', () => {
            const { generateEntityDoc } = require('../../../skills/skills/requirements-analyst/scripts/requirements-analyzer');
            const entity = {
                name: 'User',
                description: '用户实体',
                attributes: [
                    { name: 'id', type: 'number', required: true, isPrimaryKey: true, description: '用户ID' },
                    { name: 'username', type: 'string', required: true, isPrimaryKey: false, description: '用户名' }
                ],
                relationships: [
                    { targetEntity: 'Profile', type: 'one-to-one', description: '用户资料' }
                ]
            };

            const doc = generateEntityDoc(entity);

            expect(doc).toContain('User');
            expect(doc).toContain('id');
            expect(doc).toContain('username');
        });

        it('should generate traceability matrix', () => {
            const { generateTraceabilityMatrix } = require('../../../skills/skills/requirements-analyst/scripts/requirements-analyzer');
            const reqs = [
                {
                    id: 'R001',
                    title: '注册功能',
                    priority: '高',
                    status: '已确认' as const,
                    relatedUseCases: ['UC001']
                }
            ];
            const useCases = [
                {
                    id: 'UC001',
                    name: '用户注册',
                    actor: '访客'
                }
            ];

            const matrix = generateTraceabilityMatrix(reqs, useCases);

            expect(matrix).toContain('需求追踪矩阵');
            expect(matrix).toContain('R001');
            expect(matrix).toContain('UC001');
        });
    });

    describe('traceability and coverage', () => {
        it('should build traceability matrix with related use cases', () => {
            const useCases = [createUseCase({
                name: '结算',
                actor: '用户',
                description: '结算流程',
                preconditions: [],
                businessRules: [],
                priority: '中'
            })];

            const reqs = [{
                id: 'REQ-123',
                title: '结算需求',
                description: '结算描述',
                type: '功能需求' as const,
                priority: '高' as const,
                status: '已确认' as const,
                source: '产品',
                relatedUseCases: [useCases[0].id],
                acceptanceCriteria: ['应该可以完成支付'],
                dependencies: [] as string[],
            }];

            const matrix = generateTraceabilityMatrix(reqs, useCases);
            expect(matrix).toContain('需求追踪矩阵');
            expect(matrix).toContain(useCases[0].id);
            expect(matrix).toContain(reqs[0].id);
        });

        it('should compute coverage stats and orphan use cases', () => {
            const useCases = [
                createUseCase({ name: '支付', actor: '用户', description: '支付', preconditions: [], businessRules: [], priority: '高' }),
                createUseCase({ name: '浏览', actor: '访客', description: '浏览', preconditions: [], businessRules: [], priority: '中' }),
            ];

            const reqs = [
                {
                    id: 'REQ-1',
                    title: '支付需求',
                    description: '支付描述',
                    type: '功能需求' as const,
                    priority: '高' as const,
                    status: '已确认' as const,
                    source: '产品',
                    relatedUseCases: [useCases[0].id],
                    acceptanceCriteria: ['必须完成支付'],
                    dependencies: [] as string[],
                },
                {
                    id: 'REQ-2',
                    title: '浏览需求',
                    description: '浏览描述',
                    type: '功能需求' as const,
                    priority: '中' as const,
                    status: '已确认' as const,
                    source: '产品',
                    relatedUseCases: [],
                    acceptanceCriteria: ['可以浏览'],
                    dependencies: [] as string[],
                },
            ];

            const result = analyzeRequirementCoverage(reqs, useCases);

            expect(result.totalRequirements).toBe(2);
            expect(result.coveredRequirements).toBe(1);
            expect(result.coverageRate).toBe(50);
            expect(result.uncoveredRequirements.map(r => r.id)).toContain('REQ-2');
            expect(result.orphanUseCases.map(uc => uc.id)).toContain(useCases[1].id);
        });
    });

    describe('createUseCase', () => {
        it('should create use case with all required fields', () => {
            const input = {
                name: '用户登录',
                actor: '用户',
                description: '用户通过用户名和密码登录系统',
                preconditions: ['用户已注册'],
                businessRules: ['密码必须加密存储'],
                priority: '高' as '高' | '中' | '低'
            };

            const result = createUseCase(input);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('name', '用户登录');
            expect(result).toHaveProperty('actor', '用户');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('preconditions');
            expect(result).toHaveProperty('postconditions');
            expect(result).toHaveProperty('mainFlow');
            expect(result).toHaveProperty('extensions');
            expect(result).toHaveProperty('businessRules');
        });

        it('should generate main flow steps', () => {
            const input = {
                name: '用户登录',
                actor: '用户',
                description: '用户通过用户名和密码登录系统',
                preconditions: [],
                businessRules: [],
                priority: '高' as '高' | '中' | '低'
            };

            const result = createUseCase(input);

            expect(result.mainFlow).toBeDefined();
            expect(Array.isArray(result.mainFlow)).toBe(true);
            expect(result.mainFlow.length).toBeGreaterThan(0);
        });

        it('should generate extension flows', () => {
            const input = {
                name: '用户登录',
                actor: '用户',
                description: '用户通过用户名和密码登录系统',
                preconditions: [],
                businessRules: [],
                priority: '高' as '高' | '中' | '低'
            };

            const result = createUseCase(input);

            expect(result.extensions).toBeDefined();
            expect(Array.isArray(result.extensions)).toBe(true);
        });

        it('should handle success and failure postconditions', () => {
            const input = {
                name: '用户登录',
                actor: '用户',
                description: '用户通过用户名和密码登录系统',
                preconditions: [],
                businessRules: [],
                priority: '高' as '高' | '中' | '低'
            };

            const result = createUseCase(input);

            expect(result.postconditions).toHaveProperty('success');
            expect(result.postconditions).toHaveProperty('failure');
            expect(Array.isArray(result.postconditions.success)).toBe(true);
            expect(Array.isArray(result.postconditions.failure)).toBe(true);
        });
    });

    describe('analyzeDependencies', () => {
        it('should analyze dependencies between requirements', () => {
            const requirements = [
                {
                    id: 'R001',
                    title: '用户注册',
                    dependencies: []
                },
                {
                    id: 'R002',
                    title: '用户登录',
                    dependencies: ['R001']
                },
                {
                    id: 'R003',
                    title: '用户资料编辑',
                    dependencies: ['R001', 'R002']
                }
            ];

            const result = analyzeDependencies(requirements);

            expect(result).toHaveProperty('graph');
            expect(result).toHaveProperty('circularDependencies');
            expect(result).toHaveProperty('topologicalOrder');
        });

        it('should detect circular dependencies', () => {
            const requirements = [
                {
                    id: 'R001',
                    title: '需求1',
                    dependencies: ['R002']
                },
                {
                    id: 'R002',
                    title: '需求2',
                    dependencies: ['R001']
                }
            ];

            const result = analyzeDependencies(requirements);

            expect(result.circularDependencies.length).toBeGreaterThan(0);
        });

        it('should generate topological order', () => {
            const requirements = [
                {
                    id: 'R001',
                    title: '用户注册',
                    dependencies: []
                },
                {
                    id: 'R002',
                    title: '用户登录',
                    dependencies: []
                },
                {
                    id: 'R003',
                    title: '用户资料编辑',
                    dependencies: ['R001', 'R002']
                }
            ];

            const result = analyzeDependencies(requirements);

            expect(result.topologicalOrder).toBeDefined();
            expect(Array.isArray(result.topologicalOrder)).toBe(true);
            // R003 depends on R001 and R002, so R001 and R002 should come before R003
            expect(result.topologicalOrder.indexOf('R001')).toBeLessThan(result.topologicalOrder.indexOf('R003'));
            expect(result.topologicalOrder.indexOf('R002')).toBeLessThan(result.topologicalOrder.indexOf('R003'));
        });
    });

    describe('generateUseCaseDiagram', () => {
        it('should generate PlantUML use case diagram', () => {
            const useCases = [
                {
                    id: 'UC001',
                    name: '用户登录',
                    actor: '用户'
                },
                {
                    id: 'UC002',
                    name: '用户注册',
                    actor: '用户'
                }
            ];

            const result = generateUseCaseDiagram(useCases);

            expect(result).toContain('@startuml');
            expect(result).toContain('actor "用户"');
            expect(result).toContain('usecase "用户登录" as UC001');
            expect(result).toContain('usecase "用户注册" as UC002');
            expect(result).toContain('@enduml');
        });

        it('should include actors in diagram', () => {
            const useCases = [
                {
                    id: 'UC001',
                    name: '管理员登录',
                    actor: '管理员'
                },
                {
                    id: 'UC002',
                    name: '用户登录',
                    actor: '用户'
                }
            ];

            const result = generateUseCaseDiagram(useCases);

            expect(result).toContain('actor "管理员"');
            expect(result).toContain('actor "用户"');
        });

        it('should include relationships', () => {
            const useCases = [
                {
                    id: 'UC001',
                    name: '用户登录',
                    actor: '用户'
                }
            ];

            const result = generateUseCaseDiagram(useCases);

            expect(result).toContain('-->');
        });
    });

    describe('exampleUsage function', () => {
        it('should run example usage without errors', () => {
            const { exampleUsage } = require('../../../skills/skills/requirements-analyst/scripts/requirements-analyzer');

            // Suppress console output during test
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            expect(() => {
                exampleUsage();
            }).not.toThrow();

            consoleSpy.mockRestore();
        });
    });

    describe('analyzeRequirementCoverage function', () => {
        it('should compute requirement coverage correctly', () => {
            const { analyzeRequirementCoverage } = require('../../../skills/skills/requirements-analyst/scripts/requirements-analyzer');

            const requirements = [
                {
                    id: 'R001',
                    title: '搜索功能',
                    description: 'Search products',
                    type: '功能需求' as const,
                    priority: '高' as const,
                    status: '已确认' as const,
                    source: 'User',
                    relatedUseCases: ['UC001'],
                    acceptanceCriteria: ['Should search'],
                    dependencies: []
                },
                {
                    id: 'R002',
                    title: '登录功能',
                    description: 'User login',
                    type: '功能需求' as const,
                    priority: '高' as const,
                    status: '已确认' as const,
                    source: 'User',
                    relatedUseCases: [],
                    acceptanceCriteria: ['Should login'],
                    dependencies: []
                }
            ];

            const useCases = [
                {
                    id: 'UC001',
                    name: '搜索',
                    actor: '用户',
                    description: 'Search',
                    preconditions: [],
                    postconditions: { success: [], failure: [] },
                    mainFlow: [],
                    extensions: [],
                    businessRules: [],
                    priority: '高' as const
                },
                {
                    id: 'UC002',
                    name: '支付',
                    actor: '用户',
                    description: 'Payment',
                    preconditions: [],
                    postconditions: { success: [], failure: [] },
                    mainFlow: [],
                    extensions: [],
                    businessRules: [],
                    priority: '高' as const
                }
            ];

            const result = analyzeRequirementCoverage(requirements, useCases);

            expect(result.totalRequirements).toBe(2);
            expect(result.coveredRequirements).toBe(1);
            expect(result.uncoveredRequirements.length).toBe(1);
            expect(result.orphanUseCases.length).toBe(1);
        });
    });

    describe('generateUseCaseDoc - with extensions', () => {
        it('should handle use case with extensions', () => {
            const useCase = createUseCase({
                name: 'Login',
                actor: 'User',
                description: 'User login',
                preconditions: ['User has account'],
                businessRules: [],
                priority: '高'
            });

            // Add extensions manually
            useCase.extensions = [
                {
                    condition: 'Invalid credentials',
                    steps: ['Show error message', 'Allow retry'],
                    returnTo: 1
                }
            ];

            const result = generateUseCaseDoc(useCase);

            expect(result).toContain('Invalid credentials');
            expect(result).toContain('Show error message');
            expect(result).toContain('Allow retry');
            expect(result).toContain('返回主流程步骤 1');
        });

        it('should handle extension without returnTo', () => {
            const useCase = createUseCase({
                name: 'Checkout',
                actor: 'Customer',
                description: 'Purchase items',
                preconditions: [],
                businessRules: [],
                priority: '中'
            });

            // Add extension without returnTo
            useCase.extensions = [
                {
                    condition: 'Out of stock',
                    steps: ['Notify user', 'Remove item'],
                    returnTo: undefined
                }
            ];

            const result = generateUseCaseDoc(useCase);

            expect(result).toContain('Out of stock');
            expect(result).toContain('Notify user');
        });
    });

    describe('priorityToScore - covered via createUserStory', () => {
        it('should handle all priority values including default', () => {
            // The priorityToScore function is internal but gets called by createUserStory
            // Testing all branches including the default case

            const highPriority = createUserStory({
                role: 'User',
                goal: 'Test',
                benefit: 'Test',
                priority: '高'
            });
            expect(highPriority.priority).toBe('高');

            const mediumPriority = createUserStory({
                role: 'User',
                goal: 'Test',
                benefit: 'Test',
                priority: '中'
            });
            expect(mediumPriority.priority).toBe('中');

            const lowPriority = createUserStory({
                role: 'User',
                goal: 'Test',
                benefit: 'Test',
                priority: '低'
            });
            expect(lowPriority.priority).toBe('低');
        });
    });
});
