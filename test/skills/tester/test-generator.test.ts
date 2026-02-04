/**
 * Test Generator 单元测试
 */

import { TestGenerator, runCliExample } from '../../../skills/skills/tester/scripts/test-generator';

describe('TestGenerator', () => {
    let generator: TestGenerator;

    beforeEach(() => {
        generator = new TestGenerator();
    });

    afterEach(() => {
        // 清理测试环境，确保测试隔离
        generator = null as any;
    });

    describe('generateTestCases', () => {
        it('should generate test cases for given scenarios', () => {
            const scenarios = ['正常登录', '用户名错误', '密码错误'];
            const testCases = generator.generateTestCases('用户登录', scenarios);

            expect(testCases).toHaveLength(6); // 3 scenarios × 2 (normal + error)
            expect(testCases[0].id).toBe('TC001');
            expect(testCases[0].title).toContain('正常场景');
            expect(testCases[0].priority).toBe('high');
        });

        it('should generate correct test case structure', () => {
            const scenarios = ['正常登录'];
            const testCases = generator.generateTestCases('用户登录', scenarios);

            expect(testCases[0]).toHaveProperty('id');
            expect(testCases[0]).toHaveProperty('title');
            expect(testCases[0]).toHaveProperty('description');
            expect(testCases[0]).toHaveProperty('steps');
            expect(testCases[0]).toHaveProperty('expectedResult');
            expect(testCases[0]).toHaveProperty('priority');
            expect(testCases[0]).toHaveProperty('tags');
        });

        it('should pad test case IDs with zeros', () => {
            const scenarios = ['登录', '注册', '找回密码'];
            const testCases = generator.generateTestCases('用户功能', scenarios);

            expect(testCases[0].id).toBe('TC001');
            expect(testCases[1].id).toBe('TC002');
            expect(testCases[2].id).toBe('TC003');
        });
    });

    describe('generateTestData', () => {
        it('should generate test data for given scenarios', () => {
            const scenarios = ['正常登录', '密码错误', '账号不存在'];

            const testData = generator.generateTestData(scenarios);

            expect(testData).toHaveLength(9); // 3 scenarios × 3 (valid, invalid, boundary)
            expect(testData[0].scenario).toBeDefined();
            expect(testData[0].data).toBeDefined();
        });
    });

    describe('generateMockConfigs', () => {
        it('should generate mock configurations for API endpoints', () => {
            const endpoints = ['/api/login', '/api/users', '/api/posts'];

            const mockConfigs = generator.generateMockConfigs(endpoints);

            expect(mockConfigs).toHaveLength(6); // 3 endpoints × 2 (success + error)
            expect(mockConfigs[0].endpoint).toBeDefined();
            expect(mockConfigs[0].method).toBe('GET');
            expect(mockConfigs[0].statusCode).toBeDefined();
        });

        it('should generate both success and error responses', () => {
            const endpoints = ['/api/login'];

            const mockConfigs = generator.generateMockConfigs(endpoints);

            expect(mockConfigs).toHaveLength(2);
            expect(mockConfigs[0].statusCode).toBe(200);
            expect(mockConfigs[1].statusCode).toBe(404);
        });
    });

    describe('generateTestPlan', () => {
        it('should generate test plan document', () => {
            const feature = '用户登录';
            const scenarios = ['正常登录', '密码错误'];

            const testPlan = generator.generateTestPlan(feature, scenarios);

            expect(testPlan).toContain('用户登录 测试计划');
            expect(testPlan).toContain('测试范围');
            expect(testPlan).toContain('测试用例');
            expect(testPlan).toContain('测试数据');
            expect(testPlan).toContain('Mock配置');
        });

        it('should include all scenarios in test plan', () => {
            const feature = '用户登录';
            const scenarios = ['正常登录', '密码错误', '账号不存在'];

            const testPlan = generator.generateTestPlan(feature, scenarios);

            expect(testPlan).toContain('测试场景数：3个');
            expect(testPlan).toContain('TC001');
            expect(testPlan).toContain('TC002');
            expect(testPlan).toContain('TC003');
        });
    });

    describe('internal helpers', () => {
        it('should generate boundary steps', () => {
            const steps = (generator as any).generateBoundarySteps('用户登录', '密码校验');

            expect(steps.length).toBeGreaterThan(0);
            expect(steps.some((step: string) => step.includes('边界值测试数据'))).toBe(true);
        });

        it('should generate valid/invalid/boundary data', () => {
            const valid = (generator as any).generateValidData();
            const invalid = (generator as any).generateInvalidData();
            const boundary = (generator as any).generateBoundaryData();

            expect(valid.username).toContain('@');
            expect(invalid.password.length).toBeLessThan(valid.password.length);
            expect(boundary.age).toBe(0);
        });

        it('should generate mock data for user/product/others', () => {
            const userData = (generator as any).generateMockData('/api/user');
            const productData = (generator as any).generateMockData('/api/product');
            const otherData = (generator as any).generateMockData('/api/other');

            expect(userData.email).toBeDefined();
            expect(productData.price).toBeDefined();
            expect(otherData).toEqual({});
        });

        it('generateMockConfigs should cover user/product endpoints', () => {
            const configs = generator.generateMockConfigs(['/api/user', '/api/product']);

            const successConfigs = configs.filter(c => c.statusCode === 200);
            expect(successConfigs.some(c => c.response.data?.email)).toBe(true);
            expect(successConfigs.some(c => c.response.data?.price)).toBe(true);
        });

        it('should execute CLI example without throwing', () => {
            const logSpy = jest.spyOn(console, 'log').mockImplementation();

            expect(() => runCliExample()).not.toThrow();

            logSpy.mockRestore();
        });

        // 新增测试：明确测试所有私有方法
        describe('generateNormalSteps', () => {
            it('should generate correct normal steps for feature and scenario', () => {
                const steps = (generator as any).generateNormalSteps('用户登录', '正常流程');

                expect(steps).toHaveLength(5);
                expect(steps[0]).toContain('用户登录');
                expect(steps[1]).toContain('正常流程');
                expect(steps[2]).toContain('有效的测试数据');
            });

            it('should contain standard step structure', () => {
                const steps = (generator as any).generateNormalSteps('产品列表', '查看列表');

                expect(steps).toEqual([
                    '打开产品列表页面',
                    '执行查看列表操作',
                    '输入有效的测试数据',
                    '提交操作',
                    '验证操作结果是否符合预期'
                ]);
            });
        });

        describe('generateErrorSteps', () => {
            it('should generate correct error steps for feature and scenario', () => {
                const steps = (generator as any).generateErrorSteps('用户注册', '邮箱重复');

                expect(steps).toHaveLength(5);
                expect(steps[0]).toContain('用户注册');
                expect(steps[1]).toContain('邮箱重复');
                expect(steps[2]).toContain('无效或异常');
                expect(steps[4]).toContain('异常情况');
            });

            it('should contain error handling structure', () => {
                const steps = (generator as any).generateErrorSteps('数据导出', '文件生成');

                expect(steps).toEqual([
                    '打开数据导出页面',
                    '执行文件生成操作',
                    '输入无效或异常的测试数据',
                    '提交操作',
                    '验证系统是否正确处理异常情况'
                ]);
            });
        });

        describe('generateBoundarySteps', () => {
            it('should generate boundary steps for minimum value', () => {
                const steps = (generator as any).generateBoundarySteps('搜索功能', '结果数量');

                expect(steps.length).toBeGreaterThanOrEqual(7);

                expect(steps[4]).toContain('边界值处理');
            });

            it('should generate boundary steps for maximum value', () => {
                const steps = (generator as any).generateBoundarySteps('订单创建', '商品数量');

                const maxIndex = steps.findIndex((s: string) => s.includes('最大值'));
                expect(maxIndex).toBeGreaterThan(0);
                expect(steps[maxIndex]).toContain('最大值');
            });
        });

        describe('generateValidData', () => {
            it('should return valid user data structure', () => {
                const data = (generator as any).generateValidData();

                expect(data).toHaveProperty('username');
                expect(data).toHaveProperty('password');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('age');
                expect(data).toHaveProperty('status');

                expect(data.username).toContain('@');
                expect(data.password.length).toBeGreaterThan(6);
                expect(data.name.length).toBeGreaterThan(0);
                expect(data.age).toBeGreaterThan(0);
                expect(['active', 'inactive']).toContain(data.status);
            });
        });

        describe('generateInvalidData', () => {
            it('should return invalid data structure', () => {
                const data = (generator as any).generateInvalidData();

                expect(data).toHaveProperty('username');
                expect(data).toHaveProperty('password');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('age');
                expect(data).toHaveProperty('status');

                expect(data.username).toBe('');
                expect(data.password.length).toBeLessThan(6);
                expect(data.name).toBe('');
                expect(data.age).toBeLessThan(0);
                expect(data.status).toBe('invalid');
            });
        });

        describe('generateBoundaryData', () => {
            it('should return boundary data structure', () => {
                const data = (generator as any).generateBoundaryData();

                expect(data).toHaveProperty('username');
                expect(data).toHaveProperty('password');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('age');
                expect(data).toHaveProperty('status');

                expect(data.username).toBe('a@b.co');
                expect(data.password).toBe('Valid123!');
                expect(data.name).toBe('A');
                expect(data.age).toBe(0);
            });
        });

        describe('generateMockData', () => {
            it('should generate mock data for user endpoint', () => {
                const data = (generator as any).generateMockData('/api/user');

                expect(data).toHaveProperty('id');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('email');
                expect(data).toHaveProperty('createdAt');
                expect(data.email).toContain('@');
            });

            it('should generate mock data for product endpoint', () => {
                const data = (generator as any).generateMockData('/api/product');

                expect(data).toHaveProperty('id');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('price');
                expect(data).toHaveProperty('stock');
                expect(typeof data.price).toBe('number');
                expect(typeof data.stock).toBe('number');
            });

            it('should return empty object for unknown endpoint', () => {
                const data = (generator as any).generateMockData('/api/unknown');

                expect(data).toEqual({});
            });

            it('should handle partial endpoint matches', () => {
                const userData = (generator as any).generateMockData('/users/profile');
                const productData = (generator as any).generateMockData('/products/list');

                expect(userData).toHaveProperty('email');
                expect(productData).toHaveProperty('price');
            });
        });
    });
});
