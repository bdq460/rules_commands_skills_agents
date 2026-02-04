# Security Checker

安全检查器用于代码安全审查、漏洞检测和安全配置生成。

## 功能

1. **代码审查**：检查代码中的安全漏洞
2. **漏洞检测**：检测已知的安全漏洞
3. **安全配置**：生成安全配置文件
4. **依赖检查**：检查依赖包的安全性
5. **安全报告**：生成安全检查报告

## 使用方法

```typescript
import { SecurityChecker } from "./security-checker";

// 创建安全检查器实例
const checker = new SecurityChecker();

// 检查代码安全
const vulnerabilities = checker.checkCodeSecurity({
  code: `
    const userInput = req.query.user;
    const query = \`SELECT * FROM users WHERE name = '\${userInput}'\`;
  `,
  language: 'javascript',
});

// 检查依赖安全
const dependencyVulnerabilities = checker.checkDependencies({
  packageJson: './package.json',
});

// 生成安全配置
const securityConfig = checker.generateSecurityConfig({
  enableCORS: true,
  enableHelmet: true,
  enableRateLimit: true,
});

// 生成安全报告
const report = checker.generateSecurityReport({
  vulnerabilities: [...],
  recommendations: [...],
});
```

## API

### checkCodeSecurity(config: CodeSecurityConfig)

检查代码安全。

```typescript
const vulnerabilities = checker.checkCodeSecurity({
  code: `const userInput = req.query.user;`,
  language: 'javascript',
});
// 返回：{ type, severity, description, location }
```

### checkDependencies(config: DependencyConfig)

检查依赖安全。

```typescript
const vulnerabilities = checker.checkDependencies({
  packageJson: './package.json',
});
```

### generateSecurityConfig(config: SecurityConfigOptions)

生成安全配置。

```typescript
const config = checker.generateSecurityConfig({
  enableCORS: true,
  enableHelmet: true,
  enableRateLimit: true,
});
```

### generateSecurityReport(config: ReportConfig)

生成安全报告。

```typescript
const report = checker.generateSecurityReport({
  vulnerabilities: [...],
  recommendations: [...],
});
```

## 数据类型

### Vulnerability

漏洞数据结构。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| type | string | 漏洞类型：SQL注入/XSS/CSRF等 |
| severity | string | 严重程度：critical/high/medium/low |
| description | string | 漏洞描述 |
| location | string | 漏洞位置 |
| recommendation | string | 修复建议 |
