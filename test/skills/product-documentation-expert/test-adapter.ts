/**
 * Product Documentation Expert 测试适配器
 *
 * 将产品文档专家技能的函数包装为测试期望的接口
 */

// ============================================================================
// 类型定义 (测试期望的接口)
// ============================================================================

export interface UserGuideInput {
    productName: string;
    version: string;
    features: string[];
    targetUsers: string[];
}

export interface UserGuideResult {
    markdown: string;
}

export interface APIEndpoint {
    method: string;
    path: string;
    description: string;
    parameters: Array<{ name: string; type: string; required: boolean }>;
    responses: Array<{ code: number; description: string }>;
}

export interface APIDocumentationResult {
    markdown: string;
}

export interface ReleaseNotesInput {
    version: string;
    releaseDate: string;
    newFeatures: string[];
    bugFixes: string[];
    breakingChanges: string[];
}

export interface ReleaseNotesResult {
    markdown: string;
}

// ============================================================================
// 适配器函数
// ============================================================================

/**
 * 生成用户指南
 * 适配器：生成 Markdown 格式的用户指南文档
 */
export function generateUserGuide(input: UserGuideInput): UserGuideResult {
    let markdown = `# ${input.productName} 用户指南\n\n`;
    markdown += `**版本**: ${input.version}\n\n`;

    markdown += `## 产品概述\n\n`;
    markdown += `${input.productName} 是一款功能强大的产品，旨在为用户提供优质的体验。\n\n`;

    markdown += `## 功能列表\n\n`;
    if (input.features.length > 0) {
        input.features.forEach((feature, index) => {
            markdown += `${index + 1}. ${feature}\n`;
        });
    } else {
        markdown += `- 暂无功能列表\n`;
    }
    markdown += `\n`;

    markdown += `## 目标用户\n\n`;
    if (input.targetUsers.length > 0) {
        input.targetUsers.forEach(user => {
            markdown += `- ${user}\n`;
        });
    } else {
        markdown += `- 暂无目标用户信息\n`;
    }
    markdown += `\n`;

    markdown += `## 快速开始\n\n`;
    markdown += `欢迎使用 ${input.productName}！按照以下步骤快速上手：\n\n`;
    markdown += `1. 访问官网并下载最新版本\n`;
    markdown += `2. 安装并启动应用\n`;
    markdown += `3. 根据向导完成初始配置\n`;
    markdown += `4. 开始使用各项功能\n\n`;

    markdown += `## 常见问题\n\n`;
    markdown += `### 如何重置密码？\n\n`;
    markdown += `请访问登录页面，点击"忘记密码"链接，按照提示操作即可。\n\n`;

    markdown += `### 如何联系技术支持？\n\n`;
    markdown += `如需技术支持，请发送邮件至 support@example.com\n\n`;

    return { markdown };
}

/**
 * 生成 API 文档
 * 适配器：生成 Markdown 格式的 API 文档
 */
export function generateAPIDocumentation(endpoints: APIEndpoint[]): APIDocumentationResult {
    let markdown = `# API 文档\n\n`;
    markdown += `本文档描述了所有可用的 API 接口。\n\n`;

    markdown += `## 接口列表\n\n`;

    if (endpoints.length > 0) {
        endpoints.forEach(endpoint => {
            markdown += `### ${endpoint.method} ${endpoint.path}\n\n`;
            markdown += `**描述**: ${endpoint.description}\n\n`;

            if (endpoint.parameters.length > 0) {
                markdown += `**请求参数**:\n\n`;
                markdown += `| 参数名 | 类型 | 必填 |\n`;
                markdown += `|--------|------|------|\n`;
                endpoint.parameters.forEach(param => {
                    markdown += `| ${param.name} | ${param.type} | ${param.required ? '是' : '否'} |\n`;
                });
                markdown += `\n`;
            }

            if (endpoint.responses.length > 0) {
                markdown += `**响应状态码**:\n\n`;
                markdown += `| 状态码 | 描述 |\n`;
                markdown += `|--------|------|\n`;
                endpoint.responses.forEach(response => {
                    markdown += `| ${response.code} | ${response.description} |\n`;
                });
                markdown += `\n`;
            }

            markdown += `---\n\n`;
        });
    } else {
        markdown += `暂无接口信息\n\n`;
    }

    return { markdown };
}

/**
 * 生成发布说明
 * 适配器：生成 Markdown 格式的发布说明
 */
export function generateReleaseNotes(input: ReleaseNotesInput): ReleaseNotesResult {
    let markdown = `# 发布说明 v${input.version}\n\n`;
    markdown += `**发布日期**: ${input.releaseDate}\n\n`;

    markdown += `## 新功能\n\n`;
    if (input.newFeatures.length > 0) {
        input.newFeatures.forEach(feature => {
            markdown += `- ${feature}\n`;
        });
    } else {
        markdown += `- 暂无新功能\n`;
    }
    markdown += `\n`;

    markdown += `## Bug 修复\n\n`;
    if (input.bugFixes.length > 0) {
        input.bugFixes.forEach(fix => {
            markdown += `- ${fix}\n`;
        });
    } else {
        markdown += `- 暂无修复\n`;
    }
    markdown += `\n`;

    if (input.breakingChanges.length > 0) {
        markdown += `## 破坏性变更\n\n`;
        input.breakingChanges.forEach(change => {
            markdown += `- ${change}\n`;
        });
        markdown += `\n`;
    }

    markdown += `## 升级说明\n\n`;
    markdown += `请仔细阅读破坏性变更部分，确保您的应用能够正常升级。\n\n`;

    return { markdown };
}

/**
 * 格式化 Markdown
 * 适配器：格式化 Markdown 文本
 */
export function formatMarkdown(content: string, language?: string): string {
    if (language) {
        return `\`\`\`${language}\n${content}\n\`\`\``;
    }

    // 简单的格式化处理
    let formatted = content;

    // 确保标题前后有空行
    formatted = formatted.replace(/^([#]+.*)$/gm, '\n$1\n');
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    return formatted.trim();
}
