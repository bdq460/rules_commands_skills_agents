/**
 * Product Expert 测试适配器
 *
 * 将产品专家技能的函数包装为测试期望的接口
 */

import { calculateRICE } from '../../../skills/product-expert/scripts/feature-generator';

// ============================================================================
// 类型定义 (测试期望的接口)
// ============================================================================

export interface RICEInput {
    reach: number;
    impact: 0.25 | 0.5 | 1 | 2 | 3;
    confidence: 100 | 80 | 50;
    effort: number;
}

export interface RICEScoreResult {
    score: number;
    breakdown: {
        reach: number;
        impact: number;
        confidence: number;
        effort: number;
    };
}

export interface MoSCoWInput {
    riceScore: number;
    businessValue: number;
    userImpact: number;
    strategicFit: number;
}

export interface MoSCoWResult {
    category: 'Must' | 'Should' | 'Could' | 'Wont';
    justification: string;
}

export interface KanoInput {
    mandatory?: boolean;
    differentiation?: boolean;
    customerSatisfactionImpact?: string;
    unexpected?: boolean;
}

export interface KanoResult {
    category: 'Basic' | 'Performance' | 'Excitement' | 'Indifferent' | 'Reverse';
    explanation: string;
}

export interface FeatureSpecInput {
    name: string;
    module: string;
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    estimatedEffort: number;
    owner: string;
    description: string;
    targetUsers: Array<{ role: string; scenario: string; frequency: string }>;
    businessValue: string[];
    entryPoint: string;
    mainFlow: string;
    businessRules: any[];
    inputFields: any[];
    outputDescription: string;
    nonFunctional: {
        responseTime: string;
        concurrency: string;
        dataCapacity: string;
        browsers: string[];
        devices: string[];
        securityRequirements: string[];
    };
    acceptanceCriteria: string[];
}

export interface FeatureSpecResult {
    markdown: string;
    summary: {
        name: string;
        priority: 'P0' | 'P1' | 'P2' | 'P3';
        estimatedEffort: number;
        owner: string;
        module: string;
    };
}

// ============================================================================
// 适配器函数
// ============================================================================

/**
 * 计算 RICE 评分
 * 适配器：包装 calculateRICE 函数
 */
export function calculateRICEScore(input: RICEInput): RICEScoreResult {
    const score = calculateRICE(input);
    return {
        score,
        breakdown: {
            reach: input.reach,
            impact: input.impact,
            confidence: input.confidence,
            effort: input.effort,
        },
    };
}

/**
 * 分配 MoSCoW 分类
 * 适配器：实现 MoSCoW 分类逻辑
 */
export function assignMoSCoWCategory(input: MoSCoWInput): MoSCoWResult {
    const totalScore = input.riceScore + input.businessValue * 100 + input.userImpact * 100 + input.strategicFit * 100;

    let category: 'Must' | 'Should' | 'Could' | 'Wont';
    let justification: string;

    if (totalScore > 2000) {
        category = 'Must';
        justification = '高优先级：综合评分超过2000，具有高业务价值和战略重要性';
    } else if (totalScore > 1500) {
        category = 'Should';
        justification = '中高优先级：综合评分在1500-2000之间，具有显著价值';
    } else if (totalScore > 1000) {
        category = 'Could';
        justification = '中低优先级：综合评分在1000-1500之间，具有适度价值';
    } else {
        category = 'Wont';
        justification = '低优先级：综合评分低于1000，业务价值有限';
    }

    return { category, justification };
}

/**
 * Kano 模型分类
 * 适配器：实现 Kano 模型分类逻辑
 */
export function categorizeKanoModel(feature: KanoInput): KanoResult {
    const { mandatory, differentiation, unexpected } = feature;

    let category: 'Basic' | 'Performance' | 'Excitement' | 'Indifferent' | 'Reverse';
    let explanation: string;

    if (mandatory) {
        category = 'Basic';
        explanation = '基础需求：必须满足的基本功能，没有会导致用户不满';
    } else if (unexpected && differentiation) {
        category = 'Excitement';
        explanation = '魅力需求：用户未预期但会带来惊喜的功能';
    } else if (differentiation) {
        category = 'Performance';
        explanation = '性能需求：与竞争对手区分的功能，越多越好';
    } else {
        category = 'Indifferent';
        explanation = '无差异需求：用户不在意的功能';
    }

    return { category, explanation };
}

/**
 * 生成功能规格
 * 适配器：生成 Markdown 格式的功能规格文档
 */
export function generateFeatureSpec(input: FeatureSpecInput): FeatureSpecResult {
    let markdown = `# 功能规格：${input.name}\n\n`;
    markdown += `**优先级**: ${input.priority}  \n`;
    markdown += `**预估工作量**: ${input.estimatedEffort} 人天  \n`;
    markdown += `**负责人**: ${input.owner}  \n`;
    markdown += `**所属模块**: ${input.module}\n\n`;

    markdown += `## 功能概述\n\n`;
    markdown += `${input.description}\n\n`;

    markdown += `## 业务价值\n\n`;
    if (input.businessValue.length > 0) {
        input.businessValue.forEach(value => {
            markdown += `- ${value}\n`;
        });
    } else {
        markdown += `- 暂无\n`;
    }
    markdown += `\n`;

    markdown += `## 目标用户\n\n`;
    if (input.targetUsers.length > 0) {
        input.targetUsers.forEach(user => {
            markdown += `- **${user.role}**: ${user.scenario} (${user.frequency})\n`;
        });
    } else {
        markdown += `- 暂无\n`;
    }
    markdown += `\n`;

    markdown += `## 入口点\n\n`;
    markdown += `${input.entryPoint}\n\n`;

    markdown += `## 主流程\n\n`;
    markdown += `${input.mainFlow}\n\n`;

    markdown += `## 业务规则\n\n`;
    if (input.businessRules.length > 0) {
        input.businessRules.forEach(rule => {
            markdown += `- ${rule}\n`;
        });
    } else {
        markdown += `- 暂无\n`;
    }
    markdown += `\n`;

    markdown += `## 非功能需求\n\n`;
    markdown += `- **响应时间**: ${input.nonFunctional.responseTime}\n`;
    markdown += `- **并发量**: ${input.nonFunctional.concurrency}\n`;
    markdown += `- **数据容量**: ${input.nonFunctional.dataCapacity}\n`;
    markdown += `- **支持浏览器**: ${input.nonFunctional.browsers.join(', ') || '所有主流浏览器'}\n`;
    markdown += `- **支持设备**: ${input.nonFunctional.devices.join(', ') || 'PC, Mobile'}\n`;
    markdown += `- **安全要求**: ${input.nonFunctional.securityRequirements.join(', ') || '暂无'}\n\n`;

    markdown += `## 验收标准\n\n`;
    if (input.acceptanceCriteria.length > 0) {
        input.acceptanceCriteria.forEach((criterion, index) => {
            markdown += `${index + 1}. ${criterion}\n`;
        });
    } else {
        markdown += `- 暂无\n`;
    }
    markdown += `\n`;

    return {
        markdown,
        summary: {
            name: input.name,
            priority: input.priority,
            estimatedEffort: input.estimatedEffort,
            owner: input.owner,
            module: input.module,
        },
    };
}
