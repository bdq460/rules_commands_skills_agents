#!/usr/bin/env node

/**
 * Tester - Test Generator Script
 *
 * 用途：根据需求自动生成测试用例、测试数据和Mock数据
 * 使用场景：测试设计阶段，快速生成测试基础
 */

interface TestCase {
    id: string;
    title: string;
    description: string;
    steps: string[];
    expectedResult: string;
    priority: 'high' | 'medium' | 'low';
    tags: string[];
}

interface TestData {
    scenario: string;
    data: Record<string, any>;
}

interface MockConfig {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    response: any;
    statusCode?: number;
}

class TestGenerator {
    /**
     * 根据功能需求生成测试用例
     */
    generateTestCases(feature: string, scenarios: string[]): TestCase[] {
        const testCases: TestCase[] = [];
        let idCounter = 1;

        for (const scenario of scenarios) {
            // 生成正常场景测试用例
            testCases.push({
                id: `TC${String(idCounter++).padStart(3, '0')}`,
                title: `${feature} - ${scenario} - 正常场景`,
                description: `测试${feature}在${scenario}情况下的正常流程`,
                steps: this.generateNormalSteps(feature, scenario),
                expectedResult: `功能正常执行，预期结果符合需求`,
                priority: 'high',
                tags: ['normal', scenario]
            });

            // 生成异常场景测试用例
            testCases.push({
                id: `TC${String(idCounter++).padStart(3, '0')}`,
                title: `${feature} - ${scenario} - 异常场景`,
                description: `测试${feature}在${scenario}情况下的异常处理`,
                steps: this.generateErrorSteps(feature, scenario),
                expectedResult: `系统返回正确的错误提示，不会崩溃`,
                priority: 'medium',
                tags: ['error', scenario]
            });
        }

        return testCases;
    }

    /**
     * 生成正常场景步骤
     */
    private generateNormalSteps(feature: string, scenario: string): string[] {
        return [
            `打开${feature}页面`,
            `执行${scenario}操作`,
            `输入有效的测试数据`,
            `提交操作`,
            `验证操作结果是否符合预期`
        ];
    }

    /**
     * 生成异常场景步骤
     */
    private generateErrorSteps(feature: string, scenario: string): string[] {
        return [
            `打开${feature}页面`,
            `执行${scenario}操作`,
            `输入无效或异常的测试数据`,
            `提交操作`,
            `验证系统是否正确处理异常情况`
        ];
    }

    /**
     * 生成边界场景步骤
     */
    private generateBoundarySteps(feature: string, scenario: string): string[] {
        return [
            `打开${feature}页面`,
            `执行${scenario}操作`,
            `输入边界值测试数据（最小值）`,
            `提交操作`,
            `验证边界值处理是否正确`,
            `输入边界值测试数据（最大值）`,
            `提交操作`,
            `验证边界值处理是否正确`
        ];
    }

    /**
     * 生成测试数据
     */
    generateTestData(scenarios: string[]): TestData[] {
        const testData: TestData[] = [];

        for (const scenario of scenarios) {
            testData.push({
                scenario: `${scenario} - 有效数据`,
                data: this.generateValidData()
            });

            testData.push({
                scenario: `${scenario} - 无效数据`,
                data: this.generateInvalidData()
            });

            testData.push({
                scenario: `${scenario} - 边界数据`,
                data: this.generateBoundaryData()
            });
        }

        return testData;
    }

    /**
     * 生成有效数据
     */
    private generateValidData(): Record<string, any> {
        return {
            username: 'testuser@example.com',
            password: 'ValidPass123!',
            name: 'Test User',
            age: 25,
            status: 'active'
        };
    }

    /**
     * 生成无效数据
     */
    private generateInvalidData(): Record<string, any> {
        return {
            username: '',
            password: '123',
            name: '',
            age: -1,
            status: 'invalid'
        };
    }

    /**
     * 生成边界数据
     */
    private generateBoundaryData(): Record<string, any> {
        return {
            username: 'a@b.co',  // 最短有效邮箱
            password: 'Valid123!', // 最小有效密码
            name: 'A',  // 最短有效名称
            age: 0,    // 最小有效年龄
            status: 'active'
        };
    }

    /**
     * 生成Mock配置
     */
    generateMockConfigs(apiEndpoints: string[]): MockConfig[] {
        const mockConfigs: MockConfig[] = [];

        for (const endpoint of apiEndpoints) {
            // 成功响应
            mockConfigs.push({
                endpoint,
                method: 'GET',
                response: {
                    success: true,
                    data: this.generateMockData(endpoint)
                },
                statusCode: 200
            });

            // 错误响应
            mockConfigs.push({
                endpoint,
                method: 'GET',
                response: {
                    success: false,
                    error: 'Resource not found',
                    code: 404
                },
                statusCode: 404
            });
        }

        return mockConfigs;
    }

    /**
     * 生成Mock数据
     */
    private generateMockData(endpoint: string): any {
        if (endpoint.includes('user')) {
            return {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                createdAt: new Date().toISOString()
            };
        } else if (endpoint.includes('product')) {
            return {
                id: 1,
                name: 'Test Product',
                price: 99.99,
                stock: 100
            };
        } else {
            return {};
        }
    }

    /**
     * 生成测试计划
     */
    generateTestPlan(feature: string, scenarios: string[]): string {
        const testCases = this.generateTestCases(feature, scenarios);
        const testData = this.generateTestData(scenarios);
        const mockConfigs = this.generateMockConfigs([`/api/${feature}`]);

        let plan = `# ${feature} 测试计划\n\n`;
        plan += `## 测试范围\n`;
        plan += `- 功能名称：${feature}\n`;
        plan += `- 测试场景数：${scenarios.length}个\n\n`;
        plan += `## 测试用例\n\n`;

        testCases.forEach(tc => {
            plan += `### ${tc.id}: ${tc.title}\n`;
            plan += `**描述**：${tc.description}\n\n`;
            plan += `**步骤**：\n`;
            tc.steps.forEach((step, index) => {
                plan += `${index + 1}. ${step}\n`;
            });
            plan += `\n**预期结果**：${tc.expectedResult}\n`;
            plan += `**优先级**：${tc.priority}\n`;
            plan += `**标签**：${tc.tags.join(', ')}\n\n`;
        });

        plan += `## 测试数据\n\n`;
        testData.forEach((td, index) => {
            plan += `### 测试数据集 ${index + 1}\n`;
            plan += `**场景**：${td.scenario}\n`;
            plan += `\`\`\`json\n${JSON.stringify(td.data, null, 2)}\n\`\`\`\n\n`;
        });

        plan += `## Mock配置\n\n`;
        mockConfigs.forEach((config, index) => {
            plan += `### Mock配置 ${index + 1}\n`;
            plan += `**端点**：${config.endpoint}\n`;
            plan += `**方法**：${config.method}\n`;
            plan += `**状态码**：${config.statusCode}\n`;
            plan += `\`\`\`json\n${JSON.stringify(config.response, null, 2)}\n\`\`\`\n\n`;
        });

        return plan;
    }
}

function runCliExample(): void {
    const generator = new TestGenerator();

    // 示例：生成用户登录功能的测试用例
    const feature = '用户登录';
    const scenarios = ['正常登录', '密码错误', '账号不存在'];

    console.log('=== 测试用例生成 ===\n');
    const testCases = generator.generateTestCases(feature, scenarios);
    testCases.forEach(tc => {
        console.log(`${tc.id}: ${tc.title}`);
        console.log(`  优先级: ${tc.priority}`);
        console.log(`  标签: ${tc.tags.join(', ')}`);
        console.log('');
    });

    console.log('\n=== 测试数据生成 ===\n');
    const testData = generator.generateTestData(scenarios);
    testData.forEach((td, index) => {
        console.log(`场景 ${index + 1}: ${td.scenario}`);
        console.log(JSON.stringify(td.data, null, 2));
        console.log('');
    });

    console.log('\n=== Mock配置生成 ===\n');
    const mockConfigs = generator.generateMockConfigs(['/api/login']);
    mockConfigs.forEach((config, index) => {
        console.log(`Mock ${index + 1}: ${config.endpoint}`);
        console.log(JSON.stringify(config.response, null, 2));
        console.log('');
    });

    console.log('\n=== 测试计划生成 ===\n');
    const testPlan = generator.generateTestPlan(feature, scenarios);
    console.log(testPlan);
}

// CLI使用示例
if (require.main === module) {
    runCliExample();
}

export { MockConfig, TestCase, TestData, TestGenerator, runCliExample };
