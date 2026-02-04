/**
 * 产品功能生成器
 *
 * 用于帮助产品专家生成功能规格、优先级评估和产品路线图
 */

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 功能优先级
 */
export type FeaturePriority = "P0" | "P1" | "P2" | "P3";

/**
 * MoSCoW 分类
 */
export type MoSCoWCategory = "Must" | "Should" | "Could" | "Wont";

/**
 * Kano 模型分类
 */
export type KanoCategory =
    | "Basic"
    | "Performance"
    | "Excitement"
    | "Indifferent"
    | "Reverse";

/**
 * 用户角色
 */
export interface TargetUser {
    role: string;
    scenario: string;
    frequency: string;
}

/**
 * 业务规则
 */
export interface BusinessRule {
    id: string;
    description: string;
    exceptionHandling: string;
}

/**
 * 数据字段
 */
export interface DataField {
    name: string;
    type: string;
    required: boolean;
    validation: string;
    description: string;
}

/**
 * 非功能需求
 */
export interface NonFunctionalRequirement {
    responseTime: string;
    concurrency: string;
    dataCapacity: string;
    browsers: string[];
    devices: string[];
    securityRequirements: string[];
}

/**
 * 功能规格输入
 */
export interface FeatureSpecInput {
    name: string;
    module: string;
    priority: FeaturePriority;
    estimatedEffort: number; // 人天
    owner: string;
    description: string;
    targetUsers: TargetUser[];
    businessValue: string[];
    entryPoint: string;
    mainFlow: string;
    businessRules: BusinessRule[];
    inputFields: DataField[];
    outputDescription: string;
    nonFunctional: NonFunctionalRequirement;
    acceptanceCriteria: string[];
    prototypeLink?: string;
}

/**
 * RICE 评分输入
 */
export interface RICEInput {
    reach: number; // 每季度影响的用户数
    impact: 0.25 | 0.5 | 1 | 2 | 3; // 影响程度
    confidence: 100 | 80 | 50; // 信心百分比
    effort: number; // 人月
}

/**
 * 功能项
 */
export interface FeatureItem {
    id: string;
    name: string;
    description: string;
    priority: FeaturePriority;
    moscow: MoSCoWCategory;
    estimatedEffort: number;
    riceScore?: number;
}

/**
 * 版本规划
 */
export interface VersionPlan {
    version: string;
    name: string;
    targetDate: string;
    features: FeatureItem[];
    goals: string[];
}

/**
 * 产品路线图
 */
export interface ProductRoadmap {
    productName: string;
    quarters: {
        quarter: string;
        versions: VersionPlan[];
    }[];
}

// ============================================================================
// 核心功能
// ============================================================================

/**
 * 生成功能编号
 */
export function generateFeatureId(): string {
    const year = new Date().getFullYear();
    const num = Math.floor(Math.random() * 900) + 100;
    return `FEA-${year}-${num}`;
}

/**
 * RICE 评分计算
 */
export function calculateRICE(input: RICEInput): number {
    const score =
        (input.reach * input.impact * input.confidence) / input.effort;
    return Math.round(score * 100) / 100;
}

/**
 * 批量 RICE 评分并排序
 */
export function rankFeaturesByRICE(
    features: Array<{ feature: FeatureItem; rice: RICEInput }>,
): Array<FeatureItem & { riceScore: number }> {
    return features
        .map(({ feature, rice }) => ({
            ...feature,
            riceScore: calculateRICE(rice),
        }))
        .sort((a, b) => b.riceScore - a.riceScore);
}

/**
 * MoSCoW 分类转优先级
 */
export function moscowToPriority(moscow: MoSCoWCategory): FeaturePriority {
    const mapping: Record<MoSCoWCategory, FeaturePriority> = {
        Must: "P0",
        Should: "P1",
        Could: "P2",
        Wont: "P3",
    };
    return mapping[moscow];
}

/**
 * 生成功能规格说明书
 */
function generateFeatureSpecInternal(input: FeatureSpecInput): string {
    const featureId = generateFeatureId();

    const targetUsersTable = input.targetUsers
        .map((u) => `| ${u.role} | ${u.scenario} | ${u.frequency} |`)
        .join("\n");

    const businessValueList = input.businessValue.map((v) => `- ${v}`).join("\n");

    const businessRulesTable = input.businessRules
        .map((r) => `| ${r.id} | ${r.description} | ${r.exceptionHandling} |`)
        .join("\n");

    const inputFieldsTable = input.inputFields
        .map(
            (f) =>
                `| ${f.name} | ${f.type} | ${f.required ? "是" : "否"} | ${f.validation} | ${f.description} |`,
        )
        .join("\n");

    const browsersList = input.nonFunctional.browsers.join("、");
    const devicesList = input.nonFunctional.devices.join("、");
    const securityList = input.nonFunctional.securityRequirements
        .map((s) => `- ${s}`)
        .join("\n");

    const acceptanceList = input.acceptanceCriteria
        .map((a) => `- [ ] ${a}`)
        .join("\n");

    return `# 功能规格说明书：${input.name}

## 基本信息
- **功能编号**：${featureId}
- **所属模块**：${input.module}
- **优先级**：${input.priority}
- **预估工时**：${input.estimatedEffort} 人天
- **负责人**：${input.owner}

## 1. 功能概述

### 1.1 功能描述
${input.description}

### 1.2 目标用户
| 用户角色 | 使用场景 | 使用频率 |
|----------|----------|----------|
${targetUsersTable}

### 1.3 业务价值
${businessValueList}

## 2. 功能详情

### 2.1 功能入口
${input.entryPoint}

### 2.2 主要流程
${input.mainFlow}

### 2.3 业务规则
| 规则编号 | 规则描述 | 异常处理 |
|----------|----------|----------|
${businessRulesTable}

## 3. 数据要求

### 3.1 输入数据
| 字段名 | 类型 | 必填 | 校验规则 | 说明 |
|--------|------|------|----------|------|
${inputFieldsTable}

### 3.2 输出数据
${input.outputDescription}

## 4. 非功能需求

### 4.1 性能要求
- 响应时间：${input.nonFunctional.responseTime}
- 并发支持：${input.nonFunctional.concurrency}
- 数据量支持：${input.nonFunctional.dataCapacity}

### 4.2 兼容性要求
- 浏览器：${browsersList}
- 设备：${devicesList}

### 4.3 安全要求
${securityList}

${input.prototypeLink ? `## 5. 原型设计\n[查看原型](${input.prototypeLink})` : ""}

## ${input.prototypeLink ? "6" : "5"}. 验收标准
${acceptanceList}
`;
}

/**
 * 生成功能清单
 */
export function generateFeatureList(features: FeatureItem[]): string {
    const grouped = features.reduce(
        (acc, feature) => {
            if (!acc[feature.priority]) {
                acc[feature.priority] = [];
            }
            acc[feature.priority].push(feature);
            return acc;
        },
        {} as Record<FeaturePriority, FeatureItem[]>,
    );

    const priorityLabels: Record<FeaturePriority, string> = {
        P0: "🔴 P0 - 必须实现",
        P1: "🟠 P1 - 高优先级",
        P2: "🟡 P2 - 中优先级",
        P3: "🟢 P3 - 低优先级",
    };

    let output = "# 产品功能清单\n\n";

    for (const priority of ["P0", "P1", "P2", "P3"] as FeaturePriority[]) {
        const items = grouped[priority];
        if (items?.length) {
            output += `## ${priorityLabels[priority]}\n\n`;
            output += "| 编号 | 功能名称 | 描述 | 工时(人天) | RICE分 |\n";
            output += "|------|----------|------|------------|--------|\n";
            items.forEach((f) => {
                output += `| ${f.id} | ${f.name} | ${f.description} | ${f.estimatedEffort} | ${f.riceScore || "-"} |\n`;
            });
            output += "\n";
        }
    }

    const totalEffort = features.reduce((sum, f) => sum + f.estimatedEffort, 0);
    output += `---\n**总计**: ${features.length} 个功能，预估 ${totalEffort} 人天\n`;

    return output;
}

/**
 * 生成产品路线图
 */
export function generateRoadmap(roadmap: ProductRoadmap): string {
    let output = `# 产品路线图 - ${roadmap.productName}\n\n`;

    for (const quarter of roadmap.quarters) {
        output += `## ${quarter.quarter}\n\n`;

        for (const version of quarter.versions) {
            output += `### ${version.version} - ${version.name} (${version.targetDate})\n\n`;

            if (version.goals.length > 0) {
                output += "**版本目标**：\n";
                version.goals.forEach((g) => {
                    output += `- ${g}\n`;
                });
                output += "\n";
            }

            output += "**功能列表**：\n";
            version.features.forEach((f) => {
                const priorityIcon = { P0: "🔴", P1: "🟠", P2: "🟡", P3: "🟢" }[
                    f.priority
                ];
                output += `- [ ] ${priorityIcon} ${f.name} (${f.estimatedEffort}人天)\n`;
            });
            output += "\n";
        }
    }

    return output;
}

/**
 * 估算版本工时
 */
export function estimateVersionEffort(version: VersionPlan): {
    totalEffort: number;
    byPriority: Record<FeaturePriority, number>;
    featureCount: number;
} {
    const byPriority: Record<FeaturePriority, number> = {
        P0: 0,
        P1: 0,
        P2: 0,
        P3: 0,
    };

    version.features.forEach((f) => {
        byPriority[f.priority] += f.estimatedEffort;
    });

    return {
        totalEffort: version.features.reduce(
            (sum, f) => sum + f.estimatedEffort,
            0,
        ),
        byPriority,
        featureCount: version.features.length,
    };
}

// ============================================================================
// 使用示例
// ============================================================================

export function exampleUsage(): void {
    // 1. RICE 评分示例
    const riceScore = calculateRICE({
        reach: 1000,
        impact: 2,
        confidence: 80,
        effort: 2,
    });
    console.log("RICE 评分:", riceScore);

    // 2. 功能清单示例
    const features: FeatureItem[] = [
        {
            id: "FEA-001",
            name: "用户登录",
            description: "支持账号密码登录",
            priority: "P0",
            moscow: "Must",
            estimatedEffort: 3,
        },
        {
            id: "FEA-002",
            name: "批量导出",
            description: "支持批量导出报表",
            priority: "P1",
            moscow: "Should",
            estimatedEffort: 5,
        },
        {
            id: "FEA-003",
            name: "深色模式",
            description: "支持深色主题",
            priority: "P2",
            moscow: "Could",
            estimatedEffort: 2,
        },
    ];

    const featureList = generateFeatureList(features);
    console.log(featureList);

    // 3. 路线图示例
    const roadmap: ProductRoadmap = {
        productName: "示例产品",
        quarters: [
            {
                quarter: "Q1 2024",
                versions: [
                    {
                        version: "v1.0.0",
                        name: "基础版本",
                        targetDate: "2024-01",
                        goals: ["完成核心功能", "支持基础配置"],
                        features: features.filter((f) => f.priority === "P0"),
                    },
                ],
            },
        ],
    };

    const roadmapDoc = generateRoadmap(roadmap);
    console.log(roadmapDoc);
}

// Additional export functions for unit tests
export function calculateRICEScore(input: RICEInput): { score: number; breakdown: { reach: number; impact: number; confidence: number; effort: number } } {
    const score = calculateRICE(input);
    return {
        score,
        breakdown: {
            reach: input.reach,
            impact: input.impact,
            confidence: input.confidence,
            effort: input.effort
        }
    };
}

export interface AssignMoSCoWInput {
    riceScore: number;
    businessValue: number;
    userImpact: number;
    strategicFit: number;
}

export interface AssignMoSCoWResult {
    category: "Must" | "Should" | "Could" | "Wont";
    justification: string;
}

export function assignMoSCoWCategory(input: AssignMoSCoWInput): AssignMoSCoWResult {
    const totalScore = input.riceScore + input.businessValue * 100 + input.userImpact * 100 + input.strategicFit * 100;

    let category: "Must" | "Should" | "Could" | "Wont";
    let justification: string;

    if (totalScore > 2000) {
        category = "Must";
        justification = "高优先级：综合评分超过2000，具有高业务价值和战略重要性";
    } else if (totalScore > 1500) {
        category = "Should";
        justification = "中高优先级：综合评分在1500-2000之间，具有显著价值";
    } else if (totalScore > 1000) {
        category = "Could";
        justification = "中低优先级：综合评分在1000-1500之间，具有适度价值";
    } else {
        category = "Wont";
        justification = "低优先级：综合评分低于1000，业务价值有限";
    }

    return { category, justification };
}

export interface CategorizeKanoResult {
    category: 'Basic' | 'Performance' | 'Excitement' | 'Indifferent' | 'Reverse';
    explanation: string;
}

export function categorizeKanoModel(feature: {
    mandatory?: boolean;
    differentiation?: boolean;
    customerSatisfactionImpact?: string;
    unexpected?: boolean;
}): CategorizeKanoResult {
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

export interface FeatureSpecSummary {
    name: string;
    priority: FeaturePriority;
    estimatedEffort: number;
    owner: string;
    module: string;
}

export function generateFeatureSpec(input: FeatureSpecInput): { markdown: string; summary: FeatureSpecSummary } {
    const markdown = generateFeatureSpecInternal(input);
    const summary: FeatureSpecSummary = {
        name: input.name,
        priority: input.priority,
        estimatedEffort: input.estimatedEffort,
        owner: input.owner,
        module: input.module
    };
    return { markdown, summary };
}
