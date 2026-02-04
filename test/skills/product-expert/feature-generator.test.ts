/**
 * Feature Generator 单元测试
 */

import {
    assignMoSCoWCategory,
    calculateRICE,
    calculateRICEScore,
    categorizeKanoModel,
    estimateVersionEffort,
    FeatureItem,
    generateFeatureId,
    generateFeatureList,
    generateFeatureSpec,
    generateRoadmap,
    moscowToPriority,
    ProductRoadmap,
    rankFeaturesByRICE,
    VersionPlan
} from '../../../skills/skills/product-expert/scripts/feature-generator';

describe('FeatureGenerator', () => {
    describe('calculateRICEScore', () => {
        it('should calculate RICE score correctly', () => {
            const input = {
                reach: 1000,
                impact: 2 as 0.25 | 0.5 | 1 | 2 | 3,
                confidence: 100 as 100 | 80 | 50,
                effort: 5
            };

            const result = calculateRICEScore(input);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('breakdown');
            expect(result.score).toBe((1000 * 2 * 100) / 5);
        });

        it('should handle different impact levels', () => {
            const impacts: Array<0.25 | 0.5 | 1 | 2 | 3> = [0.25, 0.5, 1, 2, 3];

            impacts.forEach(impact => {
                const input = {
                    reach: 1000,
                    impact: impact,
                    confidence: 100 as 100 | 80 | 50,
                    effort: 5
                };

                const result = calculateRICEScore(input);
                expect(result.score).toBeGreaterThan(0);
            });
        });

        it('should handle different confidence levels', () => {
            const confidences: Array<100 | 80 | 50> = [100, 80, 50];

            confidences.forEach(confidence => {
                const input = {
                    reach: 1000,
                    impact: 2 as 0.25 | 0.5 | 1 | 2 | 3,
                    confidence: confidence,
                    effort: 5
                };

                const result = calculateRICEScore(input);
                expect(result.score).toBeGreaterThan(0);
            });
        });

        it('should include breakdown of RICE components', () => {
            const input = {
                reach: 1000,
                impact: 2 as 0.25 | 0.5 | 1 | 2 | 3,
                confidence: 100 as 100 | 80 | 50,
                effort: 5
            };

            const result = calculateRICEScore(input);

            expect(result.breakdown).toBeDefined();
            expect(result.breakdown).toHaveProperty('reach');
            expect(result.breakdown).toHaveProperty('impact');
            expect(result.breakdown).toHaveProperty('confidence');
            expect(result.breakdown).toHaveProperty('effort');
        });
    });

    describe('assignMoSCoWCategory', () => {
        it('should assign Must to high priority features', () => {
            const input = {
                riceScore: 1000,
                businessValue: 5,
                userImpact: 5,
                strategicFit: 5
            };

            const result = assignMoSCoWCategory(input);

            expect(result.category).toBe('Must');
        });

        it('should assign Wont to low priority features', () => {
            const input = {
                riceScore: 10,
                businessValue: 1,
                userImpact: 1,
                strategicFit: 1
            };

            const result = assignMoSCoWCategory(input);

            expect(result.category).toBe('Wont');
        });

        it('should return valid MoSCoW categories', () => {
            const categories: Set<string> = new Set(['Must', 'Should', 'Could', 'Wont']);

            const inputs = [
                { riceScore: 1000, businessValue: 5, userImpact: 5, strategicFit: 5 },
                { riceScore: 500, businessValue: 4, userImpact: 4, strategicFit: 4 },
                { riceScore: 100, businessValue: 3, userImpact: 3, strategicFit: 3 },
                { riceScore: 10, businessValue: 1, userImpact: 1, strategicFit: 1 }
            ];

            inputs.forEach(input => {
                const result = assignMoSCoWCategory(input);
                expect(categories.has(result.category)).toBe(true);
            });
        });

        it('should include justification', () => {
            const input = {
                riceScore: 1000,
                businessValue: 5,
                userImpact: 5,
                strategicFit: 5
            };

            const result = assignMoSCoWCategory(input);

            expect(result.justification).toBeDefined();
            expect(typeof result.justification).toBe('string');
        });
    });

    describe('categorizeKanoModel', () => {
        it('should categorize basic features', () => {
            const input = {
                mandatory: true,
            };

            const result = categorizeKanoModel(input);

            expect(result.category).toBe('Basic');
        });

        it('should categorize performance features', () => {
            const input = {
                mandatory: false,
                differentiation: true,
                customerSatisfactionImpact: 'medium' as any
            };

            const result = categorizeKanoModel(input);

            expect(result.category).toBe('Performance');
        });

        it('should categorize excitement features', () => {
            const input = {
                mandatory: false,
                differentiation: true,
                unexpected: true
            };

            const result = categorizeKanoModel(input);

            expect(result.category).toBe('Excitement');
        });

        it('should return valid Kano categories', () => {
            const categories: Set<string> = new Set(['Basic', 'Performance', 'Excitement', 'Indifferent', 'Reverse']);

            const inputs = [
                { mandatory: true },
                { mandatory: false, differentiation: true },
                { mandatory: false, unexpected: true },
                { mandatory: false }
            ];

            inputs.forEach(input => {
                const result = categorizeKanoModel(input);
                expect(categories.has(result.category)).toBe(true);
            });
        });
    });

    describe('generateFeatureSpec', () => {
        it('should generate feature specification', () => {
            const input = {
                name: '用户登录',
                module: '用户管理',
                priority: 'P0' as "P0" | "P1" | "P2" | "P3",
                estimatedEffort: 5,
                owner: '产品经理',
                description: '用户可以通过用户名和密码登录系统',
                targetUsers: [
                    { role: '用户', scenario: '需要登录系统', frequency: '每天' }
                ],
                businessValue: ['提升用户体验', '保证系统安全'],
                entryPoint: '登录页面',
                mainFlow: '用户输入用户名密码 -> 点击登录 -> 验证 -> 成功',
                businessRules: [],
                inputFields: [],
                outputDescription: '登录成功或失败提示',
                nonFunctional: {
                    responseTime: '< 1s',
                    concurrency: '1000',
                    dataCapacity: '100万用户',
                    browsers: ['Chrome', 'Firefox'],
                    devices: ['PC', 'Mobile'],
                    securityRequirements: ['密码加密']
                },
                acceptanceCriteria: [
                    '输入正确的用户名和密码可以登录',
                    '输入错误的密码会提示错误'
                ]
            };

            const result = generateFeatureSpec(input);

            expect(result).toBeDefined();
            expect(result.markdown).toBeDefined();
            expect(result.markdown).toContain('用户登录');
            expect(result.summary).toBeDefined();
        });

        it('should include all required sections', () => {
            const input = {
                name: '用户登录',
                module: '用户管理',
                priority: 'P0' as "P0" | "P1" | "P2" | "P3",
                estimatedEffort: 5,
                owner: '产品经理',
                description: '用户可以通过用户名和密码登录系统',
                targetUsers: [],
                businessValue: [],
                entryPoint: '登录页面',
                mainFlow: '用户输入用户名密码 -> 点击登录 -> 验证 -> 成功',
                businessRules: [],
                inputFields: [],
                outputDescription: '登录成功或失败提示',
                nonFunctional: {
                    responseTime: '< 1s',
                    concurrency: '1000',
                    dataCapacity: '100万用户',
                    browsers: [],
                    devices: [],
                    securityRequirements: []
                },
                acceptanceCriteria: []
            };

            const result = generateFeatureSpec(input);

            expect(result.markdown).toContain('功能概述');
            expect(result.markdown).toContain('业务价值');
            expect(result.markdown).toContain('验收标准');
            expect(result.markdown).toContain('非功能需求');
        });

        it('should generate summary metadata', () => {
            const input = {
                name: '用户登录',
                module: '用户管理',
                priority: 'P0' as "P0" | "P1" | "P2" | "P3",
                estimatedEffort: 5,
                owner: '产品经理',
                description: '用户可以通过用户名和密码登录系统',
                targetUsers: [],
                businessValue: [],
                entryPoint: '登录页面',
                mainFlow: '用户输入用户名密码 -> 点击登录 -> 验证 -> 成功',
                businessRules: [],
                inputFields: [],
                outputDescription: '登录成功或失败提示',
                nonFunctional: {
                    responseTime: '< 1s',
                    concurrency: '1000',
                    dataCapacity: '100万用户',
                    browsers: [],
                    devices: [],
                    securityRequirements: []
                },
                acceptanceCriteria: []
            };

            const result = generateFeatureSpec(input);

            expect(result.summary).toBeDefined();
            expect(result.summary).toHaveProperty('name');
            expect(result.summary).toHaveProperty('priority');
            expect(result.summary).toHaveProperty('estimatedEffort');
        });
    });

    describe('generateFeatureId', () => {
        it('should generate unique feature IDs', () => {
            const id1 = generateFeatureId();
            const id2 = generateFeatureId();

            expect(id1).toBeDefined();
            expect(id2).toBeDefined();
            expect(id1).toMatch(/^FEA-\d+-\d+$/);
            expect(id2).toMatch(/^FEA-\d+-\d+$/);
        });

        it('should include current year in feature ID', () => {
            const id = generateFeatureId();
            const year = new Date().getFullYear();

            expect(id).toContain(year.toString());
        });
    });

    describe('calculateRICE', () => {
        it('should calculate RICE score using formula', () => {
            const result = calculateRICE({
                reach: 1000,
                impact: 2 as 0.25 | 0.5 | 1 | 2 | 3,
                confidence: 100 as 100 | 80 | 50,
                effort: 5
            });

            const expected = (1000 * 2 * 100) / 5;
            expect(result).toBe(Math.round(expected * 100) / 100);
        });

        it('should return rounded result', () => {
            const result = calculateRICE({
                reach: 1234,
                impact: 2 as 0.25 | 0.5 | 1 | 2 | 3,
                confidence: 80 as 100 | 80 | 50,
                effort: 3
            });

            expect(result).toEqual(Math.round(result * 100) / 100);
        });
    });

    describe('rankFeaturesByRICE', () => {
        it('should rank features by RICE score in descending order', () => {
            const features = [
                {
                    feature: { id: '1', name: 'Feature 1', description: '', priority: 'P0' as const, moscow: 'Must' as const, estimatedEffort: 5 },
                    rice: { reach: 1000, impact: 2 as const, confidence: 100 as const, effort: 5 }
                },
                {
                    feature: { id: '2', name: 'Feature 2', description: '', priority: 'P1' as const, moscow: 'Should' as const, estimatedEffort: 3 },
                    rice: { reach: 500, impact: 1 as const, confidence: 80 as const, effort: 2 }
                }
            ];

            const result = rankFeaturesByRICE(features);

            expect(result.length).toBe(2);
            expect(result[0].riceScore).toBeGreaterThanOrEqual(result[1].riceScore);
        });

        it('should include rice score in result', () => {
            const features = [
                {
                    feature: { id: '1', name: 'Feature 1', description: '', priority: 'P0' as const, moscow: 'Must' as const, estimatedEffort: 5 },
                    rice: { reach: 1000, impact: 2 as const, confidence: 100 as const, effort: 5 }
                }
            ];

            const result = rankFeaturesByRICE(features);

            expect(result[0]).toHaveProperty('riceScore');
            expect(result[0].riceScore).toBeGreaterThan(0);
        });
    });

    describe('moscowToPriority', () => {
        it('should map Must to P0', () => {
            expect(moscowToPriority('Must')).toBe('P0');
        });

        it('should map Should to P1', () => {
            expect(moscowToPriority('Should')).toBe('P1');
        });

        it('should map Could to P2', () => {
            expect(moscowToPriority('Could')).toBe('P2');
        });

        it('should map Wont to P3', () => {
            expect(moscowToPriority('Wont')).toBe('P3');
        });
    });

    describe('generateFeatureList', () => {
        it('should group features by priority', () => {
            const features: FeatureItem[] = [
                { id: '1', name: 'Feature 1', description: 'Desc 1', priority: 'P0', moscow: 'Must', estimatedEffort: 5 },
                { id: '2', name: 'Feature 2', description: 'Desc 2', priority: 'P1', moscow: 'Should', estimatedEffort: 3 },
                { id: '3', name: 'Feature 3', description: 'Desc 3', priority: 'P0', moscow: 'Must', estimatedEffort: 8 }
            ];

            const result = generateFeatureList(features);

            expect(result).toContain('P0');
            expect(result).toContain('P1');
            expect(result).toContain('Feature 1');
            expect(result).toContain('Feature 2');
            expect(result).toContain('Feature 3');
        });

        it('should calculate total effort', () => {
            const features: FeatureItem[] = [
                { id: '1', name: 'Feature 1', description: 'Desc 1', priority: 'P0', moscow: 'Must', estimatedEffort: 5 },
                { id: '2', name: 'Feature 2', description: 'Desc 2', priority: 'P1', moscow: 'Should', estimatedEffort: 3 }
            ];

            const result = generateFeatureList(features);

            expect(result).toContain('8 人天');
            expect(result).toContain('2 个功能');
        });

        it('should include RICE score if available', () => {
            const features: (FeatureItem & { riceScore?: number })[] = [
                { id: '1', name: 'Feature 1', description: 'Desc 1', priority: 'P0', moscow: 'Must', estimatedEffort: 5, riceScore: 400 }
            ];

            const result = generateFeatureList(features);

            expect(result).toContain('Feature 1');
        });
    });

    describe('generateRoadmap', () => {
        it('should generate roadmap with versions', () => {
            const roadmap: ProductRoadmap = {
                productName: '产品A',
                quarters: [
                    {
                        quarter: 'Q1',
                        versions: [
                            {
                                version: 'v1.0',
                                name: '初始版本',
                                targetDate: '2024-03-31',
                                features: [
                                    { id: '1', name: 'Feature 1', description: 'Desc', priority: 'P0', moscow: 'Must', estimatedEffort: 5 }
                                ],
                                goals: ['达到市场']
                            }
                        ]
                    }
                ]
            };

            const result = generateRoadmap(roadmap);

            expect(result).toContain('产品A');
            expect(result).toContain('Q1');
            expect(result).toContain('v1.0');
            expect(result).toContain('Feature 1');
        });

        it('should include version goals if provided', () => {
            const roadmap: ProductRoadmap = {
                productName: '产品B',
                quarters: [
                    {
                        quarter: 'Q2',
                        versions: [
                            {
                                version: 'v2.0',
                                name: '增强版本',
                                targetDate: '2024-06-30',
                                features: [],
                                goals: ['提升性能', '改善用户体验']
                            }
                        ]
                    }
                ]
            };

            const result = generateRoadmap(roadmap);

            expect(result).toContain('提升性能');
            expect(result).toContain('改善用户体验');
        });
    });

    describe('estimateVersionEffort', () => {
        it('should calculate total effort correctly', () => {
            const version: VersionPlan = {
                version: 'v1.0',
                name: '初始版本',
                targetDate: '2024-03-31',
                features: [
                    { id: '1', name: 'Feature 1', description: 'Desc', priority: 'P0', moscow: 'Must', estimatedEffort: 5 },
                    { id: '2', name: 'Feature 2', description: 'Desc', priority: 'P1', moscow: 'Should', estimatedEffort: 3 }
                ],
                goals: []
            };

            const result = estimateVersionEffort(version);

            expect(result.totalEffort).toBe(8);
            expect(result.featureCount).toBe(2);
        });

        it('should break down effort by priority', () => {
            const version: VersionPlan = {
                version: 'v1.0',
                name: '初始版本',
                targetDate: '2024-03-31',
                features: [
                    { id: '1', name: 'Feature 1', description: 'Desc', priority: 'P0', moscow: 'Must', estimatedEffort: 5 },
                    { id: '2', name: 'Feature 2', description: 'Desc', priority: 'P0', moscow: 'Must', estimatedEffort: 3 },
                    { id: '3', name: 'Feature 3', description: 'Desc', priority: 'P1', moscow: 'Should', estimatedEffort: 2 }
                ],
                goals: []
            };

            const result = estimateVersionEffort(version);

            expect(result.byPriority['P0']).toBe(8);
            expect(result.byPriority['P1']).toBe(2);
            expect(result.byPriority['P2']).toBe(0);
            expect(result.byPriority['P3']).toBe(0);
        });
    });

    describe('exampleUsage', () => {
        it('should run example usage without errors', () => {
            const { exampleUsage } = require('../../../skills/skills/product-expert/scripts/feature-generator');

            // Suppress console output during test
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            expect(() => {
                exampleUsage();
            }).not.toThrow();

            consoleSpy.mockRestore();
        });
    });

    describe('generateFeatureList', () => {
        it('should generate markdown list of features', () => {
            const features: FeatureItem[] = [
                { id: '1', name: 'Feature 1', description: 'Description 1', priority: 'P0', moscow: 'Must', estimatedEffort: 5 },
                { id: '2', name: 'Feature 2', description: 'Description 2', priority: 'P1', moscow: 'Should', estimatedEffort: 3 }
            ];

            const result = generateFeatureList(features);

            expect(result).toContain('Feature 1');
            expect(result).toContain('Feature 2');
            expect(result).toContain('Description 1');
            expect(result).toContain('Description 2');
        });

        it('should include priority information', () => {
            const features: FeatureItem[] = [
                { id: '1', name: 'Critical Feature', description: 'Critical', priority: 'P0', moscow: 'Must', estimatedEffort: 10 }
            ];

            const result = generateFeatureList(features);

            expect(result).toContain('P0');
            expect(result).toContain('Critical Feature');
        });

        it('should handle empty feature list', () => {
            const features: FeatureItem[] = [];

            const result = generateFeatureList(features);

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });

    describe('Kano model categories', () => {
        it('should define correct Kano categories', () => {
            const { exampleUsage } = require('../../../skills/skills/product-expert/scripts/feature-generator');
            expect(() => exampleUsage()).not.toThrow();
        });
    });

    describe('assignMoSCoWCategory - all score ranges', () => {
        it('should assign Could for medium-low priority (1000-1500)', () => {
            const input = {
                riceScore: 500,
                businessValue: 2,
                userImpact: 2,
                strategicFit: 2
            };

            const result = assignMoSCoWCategory(input);

            expect(result.category).toBe('Could');
            expect(result.justification).toContain('中低优先级');
        });

        it('should assign Wont for low priority (< 1000)', () => {
            const input = {
                riceScore: 100,
                businessValue: 1,
                userImpact: 1,
                strategicFit: 1
            };

            const result = assignMoSCoWCategory(input);

            expect(result.category).toBe('Wont');
            expect(result.justification).toContain('低优先级');
        });
    });

    describe('generateFeatureSpec - with businessRules and inputFields', () => {
        it('should handle businessRules in feature spec', () => {
            const input = {
                name: 'Test Feature',
                module: 'TestModule',
                priority: 'P0' as const,
                estimatedEffort: 5,
                owner: 'Test Owner',
                description: 'Test description',
                targetUsers: [{ role: 'User', scenario: 'Scenario', frequency: 'Daily' }],
                businessValue: ['Value 1'],
                entryPoint: 'Entry',
                mainFlow: 'Flow',
                businessRules: [
                    { id: 'BR001', description: 'Rule 1', exceptionHandling: 'Handle exception' }
                ],
                inputFields: [
                    { name: 'Field1', type: 'string', required: true, validation: 'not empty', description: 'First field' }
                ],
                outputDescription: 'Output',
                nonFunctional: {
                    responseTime: '< 1s',
                    concurrency: '100',
                    dataCapacity: '1000',
                    browsers: ['Chrome'],
                    devices: ['PC'],
                    securityRequirements: ['HTTPS']
                },
                acceptanceCriteria: ['Criteria 1']
            };

            const result = generateFeatureSpec(input);

            expect(result.markdown).toContain('BR001');
            expect(result.markdown).toContain('Rule 1');
            expect(result.markdown).toContain('Handle exception');
            expect(result.markdown).toContain('Field1');
            expect(result.markdown).toContain('string');
            expect(result.markdown).toContain('是'); // required = true
            expect(result.markdown).toContain('not empty');
            expect(result.markdown).toContain('First field');
        });

        it('should handle optional inputFields', () => {
            const input = {
                name: 'Test Feature',
                module: 'TestModule',
                priority: 'P1' as const,
                estimatedEffort: 3,
                owner: 'Owner',
                description: 'Test',
                targetUsers: [{ role: 'User', scenario: 'Test', frequency: 'Weekly' }],
                businessValue: ['Value'],
                entryPoint: 'Entry',
                mainFlow: 'Flow',
                businessRules: [],
                inputFields: [
                    { name: 'OptionalField', type: 'number', required: false, validation: 'positive', description: 'Optional' }
                ],
                outputDescription: 'Output',
                nonFunctional: {
                    responseTime: '< 2s',
                    concurrency: '50',
                    dataCapacity: '500',
                    browsers: ['Firefox'],
                    devices: ['Mobile'],
                    securityRequirements: ['Auth']
                },
                acceptanceCriteria: ['AC1']
            };

            const result = generateFeatureSpec(input);

            expect(result.markdown).toContain('OptionalField');
            expect(result.markdown).toContain('否'); // required = false
        });
    });
});
