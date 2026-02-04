# Test Generator

测试生成脚本根据需求自动生成测试用例、测试数据和Mock数据。

## 功能

1. **测试用例生成**：根据功能需求生成测试用例
2. **测试数据生成**：生成各种场景的测试数据
3. **Mock数据生成**：生成API Mock配置
4. **覆盖率分析**：分析测试覆盖率
5. **测试报告**：生成测试报告

## 使用方法

```typescript
import { TestGenerator } from "./test-generator";

// 创建测试生成器实例
const generator = new TestGenerator();

// 生成测试用例
const testCases = generator.generateTestCases('用户登录', [
  '正常登录',
  '用户名错误',
  '密码错误',
  '账号被禁用',
]);

// 生成测试数据
const testData = generator.generateTestData('用户登录', {
  normal: {
    username: 'testuser',
    password: 'testpass',
  },
  error: {
    username: 'wronguser',
    password: 'wrongpass',
  },
});

// 生成Mock配置
const mockConfig = generator.generateMockConfig('/api/login', 'POST', {
  success: {
    statusCode: 200,
    response: {
      token: 'mock-token-123',
      user: { id: 1, name: 'Test User' },
    },
  },
  error: {
    statusCode: 401,
    response: {
      error: 'Invalid credentials',
    },
  },
});
```

## API

### generateTestCases(feature: string, scenarios: string[])

根据功能需求生成测试用例。

```typescript
const testCases = generator.generateTestCases('用户登录', [
  '正常登录',
  '用户名错误',
  '密码错误',
]);
```

### generateTestData(feature: string, scenarios: object)

生成测试数据。

```typescript
const testData = generator.generateTestData('用户登录', {
  normal: { username: 'test', password: 'test' },
  error: { username: 'wrong', password: 'wrong' },
});
```

### generateMockConfig(endpoint: string, method: string, responses: object)

生成Mock配置。

```typescript
const mockConfig = generator.generateMockConfig('/api/login', 'POST', {
  success: { statusCode: 200, response: { token: 'xxx' } },
  error: { statusCode: 401, response: { error: 'xxx' } },
});
```

### generateTestReport(testResults: TestResult[])

生成测试报告。

```typescript
const report = generator.generateTestReport(testResults);
// 返回：{ total, passed, failed, coverage, ... }
```

## 数据类型

### TestCase

测试用例数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| id | string | 测试用例ID |
| title | string | 测试用例标题 |
| description | string | 描述 |
| steps | string[] | 测试步骤 |
| expectedResult | string | 预期结果 |
| priority | string | 优先级：high/medium/low |
| tags | string[] | 标签 |

### TestData

测试数据数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| scenario | string | 场景名称 |
| data | object | 测试数据 |
