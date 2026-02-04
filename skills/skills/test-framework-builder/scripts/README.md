# Test Framework Config Generator

测试框架配置生成器用于生成自动化测试框架和基础设施配置。

## 功能

1. **框架配置**：生成测试框架配置文件
2. **测试脚本**：生成测试脚本和测试用例模板
3. **Mock配置**：生成Mock数据和Mock服务器配置
4. **CI集成**：生成CI/CD测试集成配置
5. **覆盖率配置**：生成代码覆盖率配置

## 使用方法

```typescript
import { TestFrameworkBuilder } from "./config-generator";

// 创建测试框架生成器实例
const builder = new TestFrameworkBuilder();

// 生成Jest配置
const jestConfig = builder.generateJestConfig({
  testEnvironment: 'node',
  coverageThreshold: 80,
  collectCoverageFrom: ['src/**/*.ts'],
});

// 生成测试脚本模板
const testTemplate = builder.generateTestTemplate({
  framework: 'jest',
  language: 'typescript',
});

// 生成Mock配置
const mockConfig = builder.generateMockConfig({
  endpoints: ['/api/users', '/api/posts'],
  responses: {...},
});

// 生成CI测试配置
const ciConfig = builder.generateCITestConfig({
  platform: 'github-actions',
  framework: 'jest',
  runOn: ['push', 'pull-request'],
});

// 生成覆盖率配置
const coverageConfig = builder.generateCoverageConfig({
  framework: 'jest',
  reporters: ['html', 'lcov', 'text'],
  thresholds: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
});
```

## API

### generateJestConfig(options: JestConfigOptions)

生成Jest配置。

```typescript
const config = builder.generateJestConfig({
  testEnvironment: 'node',
  coverageThreshold: 80,
  collectCoverageFrom: ['src/**/*.ts'],
});
```

### generateTestTemplate(options: TemplateOptions)

生成测试脚本模板。

```typescript
const template = builder.generateTestTemplate({
  framework: 'jest',
  language: 'typescript',
});
```

### generateMockConfig(options: MockConfigOptions)

生成Mock配置。

```typescript
const mockConfig = builder.generateMockConfig({
  endpoints: ['/api/users'],
  responses: {...},
});
```

### generateCITestConfig(options: CIConfigOptions)

生成CI测试配置。

```typescript
const ciConfig = builder.generateCITestConfig({
  platform: 'github-actions',
  framework: 'jest',
  runOn: ['push', 'pull-request'],
});
```

### generateCoverageConfig(options: CoverageOptions)

生成覆盖率配置。

```typescript
const coverageConfig = builder.generateCoverageConfig({
  framework: 'jest',
  reporters: ['html', 'lcov'],
  thresholds: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
});
```

## 配置选项

### JestConfigOptions

Jest配置选项。

| 字段 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| testEnvironment | string | 'node' | 测试环境 |
| coverageThreshold | number | 80 | 覆盖率阈值 |
| collectCoverageFrom | string[] | ['src/**/*.ts'] | 收集覆盖率的文件 |
