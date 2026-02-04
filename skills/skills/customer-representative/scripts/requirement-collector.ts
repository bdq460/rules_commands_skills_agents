/**
 * 客户需求收集器
 *
 * 用于帮助客户代表收集、整理和格式化需求信息
 */

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 需求优先级
 */
export type Priority = "P0" | "P1" | "P2" | "P3";

/**
 * 需求紧急程度
 */
export type Urgency = "紧急" | "重要" | "一般";

/**
 * 用户角色
 */
export interface UserRole {
    name: string;
    description: string;
    useFrequency: "每天" | "每周" | "每月" | "偶尔";
}

/**
 * 痛点信息
 */
export interface PainPoint {
    description: string;
    impact: "高" | "中" | "低";
    frequency: "频繁" | "偶尔" | "少见";
    affectedUsers: string;
}

/**
 * 验收标准
 */
export interface AcceptanceCriteria {
    given: string;
    when: string;
    then: string;
}

/**
 * 原始需求输入
 */
export interface RequirementInput {
    title: string;
    background: string;
    scenario: string;
    userRoles: UserRole[];
    painPoints: PainPoint[];
    expectedSolution: string;
    acceptanceCriteria: AcceptanceCriteria[];
    priority?: Priority;
    expectedDelivery?: string;
    additionalNotes?: string;
}

/**
 * 格式化后的需求文档
 */
export interface FormattedRequirement {
    markdown: string;
    summary: string;
    metadata: {
        title: string;
        priority: Priority;
        createdAt: string;
        painPointCount: number;
        acceptanceCriteriaCount: number;
    };
}

// ============================================================================
// 核心功能
// ============================================================================

/**
 * 评估需求优先级
 */
export function evaluatePriority(input: {
    businessValue: number; // 1-5
    userImpact: number; // 1-5
    urgency: number; // 1-5
    complexity: number; // 1-5 (反向：复杂度越高分越低)
    strategicFit: number; // 1-5
}): { priority: Priority; score: number; breakdown: Record<string, number> } {
    const weights = {
        businessValue: 0.3,
        userImpact: 0.25,
        urgency: 0.2,
        complexity: 0.15,
        strategicFit: 0.1,
    };

    const breakdown = {
        businessValue: input.businessValue * weights.businessValue,
        userImpact: input.userImpact * weights.userImpact,
        urgency: input.urgency * weights.urgency,
        complexity: (6 - input.complexity) * weights.complexity, // 反向计算
        strategicFit: input.strategicFit * weights.strategicFit,
    };

    const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    let priority: Priority;
    if (score >= 4.5) priority = "P0";
    else if (score >= 4.0) priority = "P1";
    else if (score >= 3.0) priority = "P2";
    else priority = "P3";

    return { priority, score: Math.round(score * 100) / 100, breakdown };
}

/**
 * 生成需求文档
 */
export function generateRequirementDoc(
    input: RequirementInput,
): FormattedRequirement {
    const createdAt = new Date().toISOString().split("T")[0];
    const priority = input.priority || "P2";

    const painPointsTable = input.painPoints
        .map(
            (p) =>
                `| ${p.description} | ${p.impact} | ${p.frequency} | ${p.affectedUsers} |`,
        )
        .join("\n");

    const acceptanceCriteriaList = input.acceptanceCriteria
        .map((ac) => `- [ ] Given ${ac.given}，When ${ac.when}，Then ${ac.then}`)
        .join("\n");

    const userRolesList = input.userRoles
        .map(
            (r) => `- **${r.name}**：${r.description}（使用频率：${r.useFrequency}）`,
        )
        .join("\n");

    const markdown = `# 需求标题：${input.title}

## 1. 背景说明
- **业务背景**：${input.background}
- **提出时间**：${createdAt}
- **优先级**：${priority}
${input.expectedDelivery ? `- **期望上线时间**：${input.expectedDelivery}` : ""}

## 2. 业务场景

### 场景描述
${input.scenario}

### 用户角色
${userRolesList}

## 3. 当前痛点

| 痛点 | 影响程度 | 发生频率 | 影响范围 |
|------|----------|----------|----------|
${painPointsTable}

## 4. 期望方案

### 期望效果
${input.expectedSolution}

### 验收标准
${acceptanceCriteriaList}

${input.additionalNotes ? `## 5. 补充说明\n${input.additionalNotes}` : ""}
`;

    const summary = `【${priority}】${input.title} - ${input.painPoints.length}个痛点，${input.acceptanceCriteria.length}个验收标准`;

    return {
        markdown,
        summary,
        metadata: {
            title: input.title,
            priority,
            createdAt,
            painPointCount: input.painPoints.length,
            acceptanceCriteriaCount: input.acceptanceCriteria.length,
        },
    };
}

/**
 * 生成用户故事
 */
export function generateUserStory(
    role: string,
    goal: string,
    benefit: string,
    acceptanceCriteria: AcceptanceCriteria[],
): string {
    const criteriaList = acceptanceCriteria
        .map((ac) => `- [ ] Given ${ac.given}，When ${ac.when}，Then ${ac.then}`)
        .join("\n");

    return `作为 ${role}，
我想要 ${goal}，
以便 ${benefit}。

### 验收标准
${criteriaList}
`;
}

/**
 * 验证需求完整性
 */
export function validateRequirement(input: RequirementInput): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 必填项检查
    if (!input.title?.trim()) {
        errors.push("需求标题不能为空");
    }
    if (!input.background?.trim()) {
        errors.push("业务背景不能为空");
    }
    if (!input.scenario?.trim()) {
        errors.push("业务场景不能为空");
    }
    if (!input.expectedSolution?.trim()) {
        errors.push("期望方案不能为空");
    }

    // 数据完整性检查
    if (input.painPoints.length === 0) {
        warnings.push("建议至少描述一个业务痛点");
    }
    if (input.acceptanceCriteria.length === 0) {
        warnings.push("建议至少定义一个验收标准");
    }
    if (input.userRoles.length === 0) {
        warnings.push("建议至少定义一个用户角色");
    }

    // 验收标准完整性
    input.acceptanceCriteria.forEach((ac, index) => {
        if (!ac.given || !ac.when || !ac.then) {
            errors.push(`验收标准 #${index + 1} 不完整，需要完整的 Given/When/Then`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

// ============================================================================
// 使用示例
// ============================================================================

/**
 * 示例：创建一个完整的需求文档
 */
export function exampleUsage(): void {
    const requirement: RequirementInput = {
        title: "支持批量导出报表",
        background:
            "目前系统只支持单个报表导出，用户需要频繁操作才能完成多个报表的导出工作",
        scenario:
            "财务人员每月月底需要导出多个部门的财务报表进行汇总分析，目前需要逐个点击导出，效率低下",
        userRoles: [
            {
                name: "财务人员",
                description: "负责财务报表汇总和分析",
                useFrequency: "每月",
            },
        ],
        painPoints: [
            {
                description: "单次只能导出一个报表",
                impact: "高",
                frequency: "频繁",
                affectedUsers: "所有财务人员（约50人）",
            },
            {
                description: "导出等待时间长",
                impact: "中",
                frequency: "频繁",
                affectedUsers: "所有财务人员",
            },
        ],
        expectedSolution: "支持勾选多个报表后一键批量导出，导出后打包为ZIP文件下载",
        acceptanceCriteria: [
            {
                given: "用户在报表列表页",
                when: "勾选多个报表并点击批量导出",
                then: "系统开始生成所有选中的报表",
            },
            {
                given: "批量导出完成",
                when: "用户点击下载",
                then: "下载包含所有报表的ZIP文件",
            },
        ],
        expectedDelivery: "2024-03-31",
    };

    // 验证需求
    const validation = validateRequirement(requirement);
    console.log("验证结果:", validation);

    // 评估优先级
    const priorityResult = evaluatePriority({
        businessValue: 4,
        userImpact: 4,
        urgency: 3,
        complexity: 2,
        strategicFit: 3,
    });
    console.log("优先级评估:", priorityResult);

    // 生成文档
    requirement.priority = priorityResult.priority;
    const doc = generateRequirementDoc(requirement);
    console.log("需求文档:\n", doc.markdown);
    console.log("摘要:", doc.summary);
}
