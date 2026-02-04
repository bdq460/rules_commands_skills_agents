#!/usr/bin/env node

/**
 * Product Documentation Expert - 文档生成器脚本
 *
 * 用途：生成产品介绍、用户手册、API文档、常见问题等文档
 * 使用场景：产品发布前、功能更新时、文档维护时
 */

interface ProductInfo {
    name: string;
    version: string;
    description: string;
    features: string[];
    screenshots?: string[];
}

interface APIEndpoint {
    name?: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    description: string;
    parameters?: Parameter[];
    requestBody?: any;
    responses: Response[];
}

interface Parameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: any;
}

interface Response {
    statusCode: number;
    description: string;
    body?: any;
}

interface FAQ {
    question: string;
    answer: string;
    category: string;
}

export class DocumentationGenerator {
    /**
     * 生成产品介绍文档
     */
    generateProductIntroduction(product: ProductInfo): string {
        let md = `# ${product.name}

**版本**: ${product.version}

## 概述

${product.description}

## 主要功能

`;

        for (const feature of product.features) {
            md += `- ${feature}\n`;
        }

        if (product.screenshots && product.screenshots.length > 0) {
            md += `\n## 产品截图\n\n`;
            for (const screenshot of product.screenshots) {
                md += `![Screenshot](${screenshot})\n\n`;
            }
        }

        md += `## 快速开始

### 安装

\`\`\`bash
npm install ${product.name.toLowerCase().replace(/\s+/g, "-")}
\`\`\`

### 基本使用

\`\`\`typescript
import { ${product.name.replace(/\s+/g, "")} } from '${product.name.toLowerCase().replace(/\s+/g, "-")}';

const app = new ${product.name.replace(/\s+/g, "")}();
app.start();
\`\`\`

## 获取帮助

- 📖 官方文档: https://docs.example.com
- 💬 社区讨论: https://community.example.com
- 🐛 问题反馈: https://github.com/example/${product.name.toLowerCase().replace(/\s+/g, "-")}/issues
`;

        return md;
    }

    /**
     * 生成用户手册
     */
    generateUserManual(product: ProductInfo): string {
        return `# ${product.name} 用户手册

**版本**: ${product.version}

## 目录

1. [概述](#概述)
2. [安装指南](#安装指南)
3. [快速开始](#快速开始)
4. [功能说明](#功能说明)
5. [常见问题](#常见问题)
6. [高级配置](#高级配置)
7. [故障排除](#故障排除)

## 概述

${product.description}

## 安装指南

### 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装步骤

1. 通过npm安装：

\`\`\`bash
npm install ${product.name.toLowerCase().replace(/\s+/g, "-")}
\`\`\`

2. 或通过yarn安装：

\`\`\`bash
yarn add ${product.name.toLowerCase().replace(/\s+/g, "-")}
\`\`\`

## 快速开始

### 基本配置

\`\`\`typescript
import { ${product.name.replace(/\s+/g, "")} } from '${product.name.toLowerCase().replace(/\s+/g, "-")}';

const config = {
  apiKey: 'your-api-key',
  debug: false
};

const app = new ${product.name.replace(/\s+/g, "")}(config);
\`\`\`

### 运行示例

\`\`\`typescript
// 初始化应用
await app.initialize();

// 执行主要功能
const result = app.run();

console.log(result);
\`\`\`

## 功能说明

### 功能1

${product.features[0] || "功能描述"}

#### 使用方法

\`\`\`typescript
// 示例代码
\`\`\`

#### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| param1 | string | 是 | 参数说明 |
| param2 | number | 否 | 参数说明 |

### 功能2

${product.features[1] || "功能描述"}

## 常见问题

### Q: 如何配置API密钥？

A: 在配置文件中设置 \`apiKey\` 参数：

\`\`\`typescript
const config = {
  apiKey: 'your-api-key'
};
\`\`\`

### Q: 支持哪些浏览器？

A: 支持所有现代浏览器，包括Chrome、Firefox、Safari和Edge的最新版本。

## 高级配置

### 自定义插件

\`\`\`typescript
import { Plugin } from '${product.name.toLowerCase().replace(/\s+/g, "-")}';

const myPlugin: Plugin = {
  name: 'my-plugin',
  install(app) {
    // 插件逻辑
  }
};

app.use(myPlugin);
\`\`\`

## 故障排除

### 问题1: 安装失败

**解决方案**:
1. 检查Node.js版本是否满足要求
2. 清除npm缓存：\`npm cache clean --force\`
3. 使用管理员权限重新安装

### 问题2: 运行错误

**解决方案**:
1. 检查配置文件是否正确
2. 查看控制台错误信息
3. 确保所有依赖已正确安装

## 更多资源

- [API文档](./API.md)
- [更新日志](./CHANGELOG.md)
- [贡献指南](./CONTRIBUTING.md)
`;
    }

    /**
     * 生成API文档
     */
    generateAPIDocumentation(endpoints: APIEndpoint[]): string {
        let md = `# API 文档

**Base URL**: \`https://api.example.com/v1\`

## 认证

所有API请求都需要在Header中包含API密钥：

\`\`\`http
Authorization: Bearer YOUR_API_KEY
\`\`\`

## 接口列表

`;

        for (const endpoint of endpoints) {
            md += `### ${endpoint.method} ${endpoint.path}

${endpoint.description}

`;

            if (endpoint.parameters && endpoint.parameters.length > 0) {
                md += `**参数**:`;

                if (endpoint.method === "GET") {
                    md += `
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
`;
                    for (const param of endpoint.parameters) {
                        md += `| ${param.name} | ${param.type} | ${param.required ? "是" : "否"} | ${param.description} | ${param.example || "-"} |\n`;
                    }
                } else {
                    md += `\n\`\`\`json\n{\n`;
                    for (const param of endpoint.parameters) {
                        md += `  "${param.name}": ${param.example ? JSON.stringify(param.example) : "null"}, // ${param.description}\n`;
                    }
                    md += `}\n\`\`\`\n`;
                }

                md += "\n";
            }

            if (endpoint.requestBody) {
                md += `**请求体**:

\`\`\`json
${JSON.stringify(endpoint.requestBody, null, 2)}
\`\`\`

`;
            }

            md += `**响应**:

`;

            for (const response of endpoint.responses) {
                md += `
\`\`\`http
${response.statusCode} ${response.description}
\`\`\`

`;
                if (response.body) {
                    md += `\`\`\`json
${JSON.stringify(response.body, null, 2)}
\`\`\`

`;
                }
            }

            md += `---

`;
        }

        md += `## 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 速率限制

API调用频率限制为：100次/分钟，超出限制将返回429状态码。

## SDK支持

我们提供以下语言的SDK：

- [JavaScript](https://github.com/example/${endpoints[0]?.name || "sdk"}-js)
- [Python](https://github.com/example/${endpoints[0]?.name || "sdk"}-py)
- [Go](https://github.com/example/${endpoints[0]?.name || "sdk"}-go)
`;

        return md;
    }

    /**
     * 生成常见问题文档
     */
    generateFAQ(faqs: FAQ[]): string {
        let md = `# 常见问题 (FAQ)

## 目录

`;

        const categories = Array.from(new Set(faqs.map((f) => f.category)));
        for (const category of categories) {
            md += `- [${category}](#${category.toLowerCase().replace(/\s+/g, "-")})\n`;
        }

        md += "\n";

        for (const category of categories) {
            md += `## ${category}\n\n`;
            const categoryFaqs = faqs.filter((f) => f.category === category);

            for (const faq of categoryFaqs) {
                md += `### ${faq.question}\n\n`;
                md += `${faq.answer}\n\n`;
            }
        }

        md += `## 联系支持

如果您的问题不在FAQ中，请联系我们的支持团队：

- 📧 Email: support@example.com
- 💬 在线客服: https://chat.example.com
- 📱 电话: +1 (555) 123-4567

## 更多资源

- [用户手册](./USER_MANUAL.md)
- [API文档](./API.md)
- [视频教程](https://tutorial.example.com)
`;

        return md;
    }

    /**
     * 生成更新日志
     */
    generateChangelog(
        releases: Array<{
            version: string;
            date: string;
            type: "major" | "minor" | "patch";
            changes: {
                added?: string[];
                fixed?: string[];
                changed?: string[];
                deprecated?: string[];
                removed?: string[];
                security?: string[];
            };
        }>,
    ): string {
        let md = `# 更更日志

本文档记录了项目的所有重要更改。

`;

        for (const release of releases) {
            const typeEmoji = {
                major: "🎉",
                minor: "✨",
                patch: "🐛",
            };

            md += `## [${release.version}] - ${release.date} ${typeEmoji[release.type]}\n\n`;

            const changes = release.changes;

            if (changes.added && changes.added.length > 0) {
                md += `### 新增\n`;
                for (const item of changes.added) {
                    md += `- ${item}\n`;
                }
                md += "\n";
            }

            if (changes.fixed && changes.fixed.length > 0) {
                md += `### 修复\n`;
                for (const item of changes.fixed) {
                    md += `- ${item}\n`;
                }
                md += "\n";
            }

            if (changes.changed && changes.changed.length > 0) {
                md += `### 变更\n`;
                for (const item of changes.changed) {
                    md += `- ${item}\n`;
                }
                md += "\n";
            }

            if (changes.deprecated && changes.deprecated.length > 0) {
                md += `### 弃用\n`;
                for (const item of changes.deprecated) {
                    md += `- ${item}\n`;
                }
                md += "\n";
            }

            if (changes.removed && changes.removed.length > 0) {
                md += `### 移除\n`;
                for (const item of changes.removed) {
                    md += `- ${item}\n`;
                }
                md += "\n";
            }

            if (changes.security && changes.security.length > 0) {
                md += `### 安全\n`;
                for (const item of changes.security) {
                    md += `- ${item}\n`;
                }
                md += "\n";
            }
        }

        return md;
    }

    /**
     * 生成README文件
     */
    generateREADME(product: ProductInfo): string {
        return `# ${product.name}

${product.description}

[![NPM Version](https://img.shields.io/npm/v/${product.name.toLowerCase().replace(/\s+/g, "-")}?style=flat-square)](https://www.npmjs.com/package/${product.name.toLowerCase().replace(/\s+/g, "-")})
[![License](https://img.shields.io/npm/l/${product.name.toLowerCase().replace(/\s+/g, "-")}?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/github/workflows/CI/${product.name.toLowerCase().replace(/\s+/g, "-")}?style=flat-square)](https://github.com/example/${product.name.toLowerCase().replace(/\s+/g, "-")}/actions)

## 功能特性

${product.features.map((f) => `- ${f}`).join("\n")}

## 快速开始

\`\`\`bash
# 安装
npm install ${product.name.toLowerCase().replace(/\s+/g, "-")}

# 使用
import { ${product.name.replace(/\s+/g, "")} } from '${product.name.toLowerCase().replace(/\s+/g, "-")}';

const app = new ${product.name.replace(/\s+/g, "")}();
app.start();
\`\`\`

## 文档

- [快速开始](./docs/QUICK_START.md)
- [用户手册](./docs/USER_MANUAL.md)
- [API文档](./docs/API.md)
- [常见问题](./docs/FAQ.md)

## 贡献

欢迎贡献！请查看[贡献指南](./CONTRIBUTING.md)了解详情。

## 许可证

MIT © 2024 ${product.name}
`;
    }

    /**
     * 生成所有文档
     */
    generateAllDocuments(
        product: ProductInfo,
        endpoints?: APIEndpoint[],
        faqs?: FAQ[],
        releases?: any[],
    ): Map<string, string> {
        const docs = new Map<string, string>();

        docs.set("README.md", this.generateREADME(product));
        docs.set(
            "PRODUCT_INTRODUCTION.md",
            this.generateProductIntroduction(product),
        );
        docs.set("USER_MANUAL.md", this.generateUserManual(product));

        if (endpoints && endpoints.length > 0) {
            docs.set("API.md", this.generateAPIDocumentation(endpoints));
        }

        if (faqs && faqs.length > 0) {
            docs.set("FAQ.md", this.generateFAQ(faqs));
        }

        if (releases && releases.length > 0) {
            docs.set("CHANGELOG.md", this.generateChangelog(releases));
        }

        return docs;
    }

    /**
     * 获取示例数据
     */
    static getExampleData() {
        return {
            product: {
                name: "Example App",
                version: "1.0.0",
                description: "一个功能强大的示例应用程序",
                features: [
                    "功能1：快速的数据处理",
                    "功能2：灵活的配置选项",
                    "功能3：丰富的插件系统",
                    "功能4：完整的API支持",
                ],
            },
            endpoints: [
                {
                    method: "GET" as const,
                    path: "/users",
                    description: "获取用户列表",
                    parameters: [
                        {
                            name: "page",
                            type: "number",
                            required: false,
                            description: "页码",
                            example: 1,
                        },
                        {
                            name: "limit",
                            type: "number",
                            required: false,
                            description: "每页数量",
                            example: 20,
                        },
                    ],
                    responses: [
                        {
                            statusCode: 200,
                            description: "成功",
                            body: { data: [], total: 100 },
                        },
                    ],
                },
                {
                    method: "POST" as const,
                    path: "/users",
                    description: "创建用户",
                    requestBody: {
                        name: "John Doe",
                        email: "john@example.com",
                    },
                    responses: [
                        {
                            statusCode: 201,
                            description: "创建成功",
                            body: { id: 1, name: "John Doe", email: "john@example.com" },
                        },
                    ],
                },
            ],
            faqs: [
                {
                    question: "如何安装这个应用？",
                    answer: "使用npm安装：npm install example-app",
                    category: "安装",
                },
                {
                    question: "支持哪些操作系统？",
                    answer: "支持Windows、macOS和Linux",
                    category: "系统要求",
                },
            ],
            releases: [
                {
                    version: "1.0.0",
                    date: "2024-01-15",
                    type: "major" as const,
                    changes: {
                        added: ["初始版本发布", "核心功能实现"],
                        fixed: [],
                    },
                },
            ],
        };
    }
}

// CLI使用示例
if (require.main === module) {
    const generator = new DocumentationGenerator();
    const exampleData = DocumentationGenerator.getExampleData();

    // 生成所有文档
    const docs = generator.generateAllDocuments(
        exampleData.product,
        exampleData.endpoints,
        exampleData.faqs,
        exampleData.releases,
    );

    console.log("=== 生成的文档 ===");
    Array.from(docs.entries()).forEach(([filename, content]) => {
        console.log(`\n--- ${filename} ---\n`);
        console.log(content);
    });
}

// Export functions for unit tests
export interface UserGuideInput {
    productName: string;
    version: string;
    features: string[];
    targetUsers: string[];
}

export interface APIDocumentationInput {
    method: string;
    path: string;
    description: string;
    parameters?: any[];
    responses?: any[];
}

export interface ReleaseNoteInput {
    version: string;
    releaseDate: string;
    newFeatures: string[];
    bugFixes: string[];
    breakingChanges?: string[];
}

export interface DocumentationResult {
    markdown: string;
}

export function generateUserGuide(input: UserGuideInput): DocumentationResult {
    let result = '# ' + input.productName + ' 用户指南\n\n';
    result += '**版本**: ' + input.version + '\n\n';
    result += '## 简介\n\n';
    result += '欢迎使用 ' + input.productName + '！\n\n';
    result += '## 快速开始\n\n';
    result += '### 安装\n\n';
    result += '```bash\n';
    result += 'npm install ' + input.productName.toLowerCase() + '\n';
    result += '```\n\n';
    result += '### 使用\n\n';
    result += '1. 配置环境变量\n';
    result += '2. 启动应用\n';
    result += '3. 访问应用\n\n';
    result += '## 功能特性\n\n';
    for (const feature of input.features) {
        result += '- ' + feature + '\n';
    }
    result += '\n';
    result += '## 目标用户\n\n';
    for (const user of input.targetUsers) {
        result += '- ' + user + '\n';
    }
    result += '\n';
    result += '## 常见问题\n\n';
    result += '### 如何重置密码？\n\n';
    result += '点击"忘记密码"链接，按照提示操作即可。\n\n';
    result += '### 如何联系客服？\n\n';
    result += '发送邮件至 support@example.com\n';
    return { markdown: result };
}

export function generateAPIDocumentation(endpoints: APIDocumentationInput[]): DocumentationResult {
    let result = '# API 文档\n\n';
    result += '## 基础信息\n\n';
    result += 'Base URL: `https://api.example.com/v1`\n\n';
    result += '## 接口列表\n\n';

    for (const endpoint of endpoints) {
        result += '### ' + endpoint.method.toUpperCase() + ' ' + endpoint.path + '\n\n';
        result += endpoint.description + '\n\n';

        if (endpoint.parameters && endpoint.parameters.length > 0) {
            result += '#### 参数\n\n';
            result += '| 参数名 | 类型 | 描述 |\n';
            result += '|--------|------|------|\n';
            for (const param of endpoint.parameters) {
                result += '| ' + param.name + ' | ' + param.type + ' | ' + (param.description || param.required ? '必填' : '可选') + ' |\n';
            }
            result += '\n';
        }

        result += '#### 请求示例\n\n';
        result += '```bash\n';
        result += 'curl -X ' + endpoint.method.toUpperCase() + ' https://api.example.com/v1' + endpoint.path + '\n';
        result += '```\n\n';
        result += '#### 响应示例\n\n';
        result += '```json\n{\n  "success": true\n}\n```\n\n';
    }

    result += '## 错误码\n\n';
    result += '| 错误码 | 说明 |\n';
    result += '|--------|------|\n';
    result += '| 200 | 成功 |\n';
    result += '| 400 | 请求错误 |\n';
    result += '| 401 | 未授权 |\n';
    result += '| 404 | 未找到 |\n';
    result += '| 500 | 服务器错误 |\n';
    return { markdown: result };
}

export function generateReleaseNotes(input: ReleaseNoteInput): DocumentationResult {
    let result = '# 发布说明\n\n';
    result += '## ' + input.version + ' (' + input.releaseDate + ')\n\n';

    if (input.newFeatures && input.newFeatures.length > 0) {
        result += '### 新功能\n\n';
        for (const feature of input.newFeatures) {
            result += '- ' + feature + '\n';
        }
        result += '\n';
    }

    if (input.bugFixes && input.bugFixes.length > 0) {
        result += '### Bug 修复\n\n';
        for (const fix of input.bugFixes) {
            result += '- ' + fix + '\n';
        }
        result += '\n';
    }

    if (input.breakingChanges && input.breakingChanges.length > 0) {
        result += '### 破坏性变更\n\n';
        for (const change of input.breakingChanges) {
            result += '- ' + change + '\n';
        }
        result += '\n';
    }

    return { markdown: result };
}

export function formatMarkdown(text: string, language?: string): string {
    let result = text;

    // Remove excessive blank lines
    result = result.replace(/\n{3,}/g, '\n\n');

    // Ensure headers have proper spacing
    result = result.replace(/([^\n])\n(#+)/g, '$1\n\n$2');

    // Ensure lists are properly formatted
    result = result.replace(/([^\n])\n(-)/g, '$1\n-');

    // Trim whitespace
    result = result.trim();

    // If language is provided, wrap in code block
    if (language) {
        result = '```' + language + '\n' + result + '\n```';
    }

    return result;
}
