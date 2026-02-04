/**
 * Requirement Collector 单元测试
 */

import {
    evaluatePriority,
    exampleUsage,
    generateRequirementDoc,
    generateUserStory,
    validateRequirement
} from '../../../skills/skills/customer-representative/scripts/requirement-collector';

describe('RequirementCollector', () => {
    describe('evaluatePriority', () => {
        it('should evaluate high priority (P0) for critical requirements', () => {
            const input = {
                businessValue: 5,
                userImpact: 5,
                urgency: 5,
                complexity: 1,
                strategicFit: 5
            };

            const result = evaluatePriority(input);

            expect(result.priority).toBe('P0');
            expect(result.score).toBeGreaterThan(4);
        });

        it('should evaluate low priority (P3) for low impact requirements', () => {
            const input = {
                businessValue: 1,
                userImpact: 1,
                urgency: 1,
                complexity: 5,
                strategicFit: 1
            };

            const result = evaluatePriority(input);

            expect(result.priority).toBe('P3');
            expect(result.score).toBeLessThan(2);
        });

        it('should calculate score with correct weights', () => {
            const input = {
                businessValue: 3,
                userImpact: 4,
                urgency: 2,
                complexity: 3,
                strategicFit: 3
            };

            const result = evaluatePriority(input);

            expect(result.breakdown).toBeDefined();
            expect(result.breakdown.businessValue).toBe(3 * 0.3);
            expect(result.breakdown.userImpact).toBe(4 * 0.25);
        });

        it('should return valid priority types', () => {
            const priorities: Set<string> = new Set(['P0', 'P1', 'P2', 'P3']);

            const inputs = [
                { businessValue: 5, userImpact: 5, urgency: 5, complexity: 1, strategicFit: 5 },
                { businessValue: 3, userImpact: 3, urgency: 3, complexity: 3, strategicFit: 3 },
                { businessValue: 1, userImpact: 1, urgency: 1, complexity: 5, strategicFit: 1 }
            ];

            inputs.forEach(input => {
                const result = evaluatePriority(input);
                expect(priorities.has(result.priority)).toBe(true);
            });
        });
    });

    describe('generateRequirementDoc', () => {
        it('should format requirement to markdown', () => {
            const input = {
                title: '测试需求',
                background: '测试背景',
                scenario: '测试场景',
                userRoles: [
                    { name: '管理员', description: '系统管理员', useFrequency: '每天' as const }
                ],
                painPoints: [
                    { description: '操作复杂', impact: '高' as const, frequency: '频繁' as const, affectedUsers: '管理员' }
                ],
                expectedSolution: '简化操作',
                acceptanceCriteria: [
                    { given: '用户登录', when: '点击按钮', then: '系统响应' }
                ]
            };

            const result = generateRequirementDoc(input);

            expect(result.markdown).toBeDefined();
            expect(result.markdown).toContain('测试需求');
            expect(result.markdown).toContain('测试背景');
            expect(result.summary).toBeDefined();
        });

        it('should generate metadata correctly', () => {
            const input = {
                title: '测试需求',
                background: '测试背景',
                scenario: '测试场景',
                userRoles: [],
                painPoints: [],
                expectedSolution: '测试方案',
                acceptanceCriteria: [],
                priority: 'P1' as const
            };

            const result = generateRequirementDoc(input);

            expect(result.metadata.title).toBe('测试需求');
            expect(result.metadata.priority).toBe('P1');
            expect(result.metadata.createdAt).toBeDefined();
            expect(result.metadata.painPointCount).toBe(0);
            expect(result.metadata.acceptanceCriteriaCount).toBe(0);
        });

        it('should count pain points and acceptance criteria', () => {
            const input = {
                title: '测试需求',
                background: '背景',
                scenario: '场景',
                userRoles: [],
                painPoints: [
                    { description: '痛点1', impact: '高' as const, frequency: '频繁' as const, affectedUsers: '用户' },
                    { description: '痛点2', impact: '中' as const, frequency: '偶尔' as const, affectedUsers: '用户' }
                ],
                expectedSolution: '方案',
                acceptanceCriteria: [
                    { given: '条件1', when: '动作1', then: '结果1' },
                    { given: '条件2', when: '动作2', then: '结果2' },
                    { given: '条件3', when: '动作3', then: '结果3' }
                ]
            };

            const result = generateRequirementDoc(input);

            expect(result.metadata.painPointCount).toBe(2);
            expect(result.metadata.acceptanceCriteriaCount).toBe(3);
        });
    });

    describe('validateRequirement', () => {
        it('should validate correct requirement input', () => {
            const input = {
                title: '测试需求',
                background: '测试背景',
                scenario: '测试场景',
                userRoles: [],
                painPoints: [],
                expectedSolution: '测试方案',
                acceptanceCriteria: []
            };

            const result = validateRequirement(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject input with missing title', () => {
            const input = {
                title: '',
                background: '测试背景',
                scenario: '测试场景',
                userRoles: [],
                painPoints: [],
                expectedSolution: '测试方案',
                acceptanceCriteria: []
            };

            const result = validateRequirement(input);

            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should warn about empty user roles', () => {
            const input = {
                title: '测试需求',
                background: '测试背景',
                scenario: '测试场景',
                userRoles: [] as any,
                painPoints: [],
                expectedSolution: '测试方案',
                acceptanceCriteria: []
            };

            const result = validateRequirement(input);

            expect(result.isValid).toBe(true);
            expect(result.warnings.some(w => w.includes('用户角色'))).toBe(true);
        });

        it('should return error messages', () => {
            const input = {
                title: '',
                background: '',
                scenario: '',
                userRoles: [],
                painPoints: [],
                expectedSolution: '',
                acceptanceCriteria: []
            };

            const result = validateRequirement(input);

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should return warnings for optional fields', () => {
            const input = {
                title: '测试需求',
                background: '测试背景',
                scenario: '测试场景',
                userRoles: [],
                painPoints: [],
                expectedSolution: '测试方案',
                acceptanceCriteria: []
            };

            const result = validateRequirement(input);

            expect(result.warnings).toBeDefined();
            expect(result.warnings.length).toBeGreaterThan(0);
        });
    });

    describe('generateUserStory', () => {
        it('should generate user story from requirement', () => {
            const acceptanceCriteria = [
                { given: '用户已登录', when: '点击管理按钮', then: '显示管理界面' }
            ];

            const result = generateUserStory('管理员', '管理用户', '提高效率', acceptanceCriteria);

            expect(result).toBeDefined();
            expect(result).toContain('管理员');
            expect(result).toContain('管理用户');
            expect(result).toContain('提高效率');
        });

        it('should format user story correctly', () => {
            const acceptanceCriteria = [
                { given: 'User is logged in', when: 'User clicks login', then: 'System shows dashboard' }
            ];

            const result = generateUserStory('User', 'Login to system', 'Access features', acceptanceCriteria);

            expect(result).toContain('User');
            expect(result).toContain('Login to system');
            expect(result).toContain('Access features');
        });

        it('should handle different user roles', () => {
            const roles = ['Admin', 'Developer', 'Tester', 'User'];
            const criteria = [
                { given: 'Prerequisite', when: 'Action', then: 'Result' }
            ];

            roles.forEach(role => {
                const result = generateUserStory(role, 'Complete task', 'Achieve goal', criteria);
                expect(result).toContain(role);
            });
        });

        it('should handle complex goals', () => {
            const acceptanceCriteria = [
                { given: 'Application is ready', when: 'Deploy command is run', then: 'Deployment succeeds' },
                { given: 'Old version is running', when: 'New version is deployed', then: 'Zero downtime achieved' }
            ];

            const result = generateUserStory(
                'Developer',
                'Deploy application to production with zero downtime',
                'Ensure business continuity',
                acceptanceCriteria
            );

            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle multiple acceptance criteria', () => {
            const acceptanceCriteria = [
                { given: 'Condition 1', when: 'Event 1', then: 'Result 1' },
                { given: 'Condition 2', when: 'Event 2', then: 'Result 2' },
                { given: 'Condition 3', when: 'Event 3', then: 'Result 3' }
            ];

            const result = generateUserStory('User', 'Perform action', 'Get benefit', acceptanceCriteria);

            expect(result).toContain('Condition 1');
            expect(result).toContain('Condition 2');
            expect(result).toContain('Condition 3');
        });

        it('should handle empty acceptance criteria', () => {
            const result = generateUserStory('User', 'Goal', 'Benefit', []);

            expect(result).toContain('User');
            expect(result).toContain('Goal');
            expect(result).toContain('Benefit');
        });
    });

    describe('exampleUsage', () => {
        it('should run without errors', () => {
            expect(() => exampleUsage()).not.toThrow();
        });

        it('should be callable', () => {
            const result = exampleUsage();
            expect(result).toBeUndefined();
        });
    });
});
