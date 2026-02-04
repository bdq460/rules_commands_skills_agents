/**
 * 需求分析器
 *
 * 用于帮助需求分析师进行需求建模、用例分析和需求验证
 */

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 需求优先级
 */
export type RequirementPriority = "高" | "中" | "低";

/**
 * 需求状态
 */
export type RequirementStatus =
    | "草稿"
    | "待评审"
    | "已确认"
    | "已变更"
    | "已废弃";

/**
 * 用户故事
 */
export interface UserStory {
    id: string;
    role: string;
    goal: string;
    benefit: string;
    acceptanceCriteria: string[];
    priority: RequirementPriority;
    estimatedPoints?: number;
}

/**
 * 用例步骤
 */
export interface UseCaseStep {
    stepNumber: number;
    actorAction: string;
    systemResponse: string;
}

/**
 * 扩展流程
 */
export interface ExtensionFlow {
    condition: string;
    steps: string[];
    returnTo?: number;
}

/**
 * 用例
 */
export interface UseCase {
    id: string;
    name: string;
    actor: string;
    description: string;
    preconditions: string[];
    postconditions: {
        success: string[];
        failure: string[];
    };
    mainFlow: UseCaseStep[];
    extensions: ExtensionFlow[];
    businessRules: string[];
    priority: RequirementPriority;
}

/**
 * 需求项
 */
export interface Requirement {
    id: string;
    title: string;
    description: string;
    type: "功能需求" | "非功能需求" | "接口需求" | "数据需求";
    priority: RequirementPriority;
    status: RequirementStatus;
    source: string;
    relatedUseCases: string[];
    acceptanceCriteria: string[];
    dependencies: string[];
}

/**
 * 数据实体
 */
export interface DataEntity {
    name: string;
    description: string;
    attributes: {
        name: string;
        type: string;
        required: boolean;
        isPrimaryKey: boolean;
        description: string;
    }[];
    relationships: {
        targetEntity: string;
        type: "1:1" | "1:N" | "N:M";
        description: string;
    }[];
}

/**
 * 业务流程步骤
 */
export interface ProcessStep {
    id: string;
    name: string;
    role: string;
    input: string[];
    output: string[];
    rules: string[];
    nextSteps: { condition: string; stepId: string }[];
}

/**
 * 业务流程
 */
export interface BusinessProcess {
    id: string;
    name: string;
    description: string;
    trigger: string;
    roles: string[];
    steps: ProcessStep[];
    exceptions: { condition: string; handling: string }[];
}

/**
 * 需求验证结果
 */
export interface ValidationResult {
    isValid: boolean;
    score: number;
    details: {
        criterion: string;
        passed: boolean;
        message: string;
    }[];
}

// ============================================================================
// 核心功能
// ============================================================================

/**
 * 生成需求ID
 */
export function generateRequirementId(
    module: string,
    sequence: number,
): string {
    return `REQ-${module.toUpperCase()}-${String(sequence).padStart(3, "0")}`;
}

/**
 * 生成用例ID
 */
export function generateUseCaseId(sequence: number): string {
    return `UC-${String(sequence).padStart(3, "0")}`;
}

/**
 * 从用户故事生成用例
 */
export function userStoryToUseCase(story: UserStory): UseCase {
    return {
        id: generateUseCaseId(parseInt(story.id.split("-")[1]) || 1),
        name: story.goal,
        actor: story.role,
        description: `作为${story.role}，${story.goal}，以便${story.benefit}`,
        preconditions: ["用户已登录系统"],
        postconditions: {
            success: [`${story.goal}成功完成`],
            failure: ["系统显示错误信息，用户可以重试"],
        },
        mainFlow: [
            {
                stepNumber: 1,
                actorAction: "用户发起操作",
                systemResponse: "系统接收请求",
            },
            {
                stepNumber: 2,
                actorAction: "用户提供必要信息",
                systemResponse: "系统验证信息",
            },
            {
                stepNumber: 3,
                actorAction: "用户确认操作",
                systemResponse: "系统执行操作并返回结果",
            },
        ],
        extensions: [],
        businessRules: [],
        priority: story.priority,
    };
}

/**
 * 验证用户故事是否符合INVEST原则
 */
export function validateUserStory(story: UserStory): ValidationResult {
    const details: ValidationResult["details"] = [];

    // Independent - 独立性
    const isIndependent =
        story.goal.length > 10 &&
        !story.goal.includes("和") &&
        !story.goal.includes("并且");
    details.push({
        criterion: "Independent（独立）",
        passed: isIndependent,
        message: isIndependent
            ? "故事看起来是独立的"
            : "故事可能包含多个功能，建议拆分",
    });

    // Negotiable - 可协商
    const isNegotiable = story.acceptanceCriteria.length > 0;
    details.push({
        criterion: "Negotiable（可协商）",
        passed: isNegotiable,
        message: isNegotiable ? "有验收标准，细节可协商" : "缺少验收标准",
    });

    // Valuable - 有价值
    const isValuable = story.benefit.length > 5;
    details.push({
        criterion: "Valuable（有价值）",
        passed: isValuable,
        message: isValuable ? "价值描述清晰" : "价值描述不够清晰",
    });

    // Estimable - 可估算
    const isEstimable = story.estimatedPoints !== undefined;
    details.push({
        criterion: "Estimable（可估算）",
        passed: isEstimable,
        message: isEstimable
            ? `已估算为 ${story.estimatedPoints} 点`
            : "尚未估算工作量",
    });

    // Small - 小的
    const isSmall = !story.estimatedPoints || story.estimatedPoints <= 8;
    details.push({
        criterion: "Small（小的）",
        passed: isSmall,
        message: isSmall ? "规模适中" : "故事可能太大，建议拆分",
    });

    // Testable - 可测试
    const isTestable = story.acceptanceCriteria.length >= 2;
    details.push({
        criterion: "Testable（可测试）",
        passed: isTestable,
        message: isTestable
            ? `有 ${story.acceptanceCriteria.length} 个验收标准`
            : "验收标准不足",
    });

    const passedCount = details.filter((d) => d.passed).length;

    return {
        isValid: passedCount >= 5,
        score: Math.round((passedCount / 6) * 100),
        details,
    };
}

/**
 * 验证需求质量
 */
export function validateRequirement(req: Requirement): ValidationResult {
    const details: ValidationResult["details"] = [];

    // 完整性
    const isComplete = Boolean(
        req.title && req.description && req.acceptanceCriteria.length > 0,
    );
    details.push({
        criterion: "完整性",
        passed: isComplete,
        message: isComplete ? "需求信息完整" : "缺少标题、描述或验收标准",
    });

    // 可验证性
    const isVerifiable = req.acceptanceCriteria.every(
        (ac) =>
            ac.includes("应该") ||
            ac.includes("必须") ||
            ac.includes("能够") ||
            ac.includes("When") ||
            ac.includes("Then"),
    );
    details.push({
        criterion: "可验证性",
        passed: isVerifiable,
        message: isVerifiable ? "验收标准可测试" : "部分验收标准不够具体",
    });

    // 无歧义性
    const isUnambiguous =
        !req.description.includes("等") &&
        !req.description.includes("可能") &&
        !req.description.includes("大概");
    details.push({
        criterion: "无歧义性",
        passed: isUnambiguous,
        message: isUnambiguous ? "描述清晰无歧义" : "描述中存在模糊词汇",
    });

    // 可追踪性
    const isTraceable = req.source.length > 0 && req.relatedUseCases.length > 0;
    details.push({
        criterion: "可追踪性",
        passed: isTraceable,
        message: isTraceable ? "来源和关联用例明确" : "缺少来源或关联用例",
    });

    // 必要性
    const isNecessary = req.priority !== undefined;
    details.push({
        criterion: "必要性",
        passed: isNecessary,
        message: isNecessary ? `优先级为 ${req.priority}` : "未设置优先级",
    });

    const passedCount = details.filter((d) => d.passed).length;

    return {
        isValid: passedCount >= 4,
        score: Math.round((passedCount / 5) * 100),
        details,
    };
}

/**
 * 生成用户故事文档
 */
export function generateUserStoryDoc(story: UserStory): string {
    const acList = story.acceptanceCriteria.map((ac) => `- [ ] ${ac}`).join("\n");

    return `## 用户故事：${story.id}

作为 **${story.role}**，
我想要 **${story.goal}**，
以便 **${story.benefit}**。

### 验收标准
${acList}

### 元信息
- **优先级**：${story.priority}
${story.estimatedPoints ? `- **故事点**：${story.estimatedPoints}` : ""}
`;
}

/**
 * 生成用例文档
 */
export function generateUseCaseDoc(useCase: UseCase): string {
    const mainFlowTable = useCase.mainFlow
        .map(
            (step) =>
                `| ${step.stepNumber} | ${step.actorAction} | ${step.systemResponse} |`,
        )
        .join("\n");

    const extensionsList = useCase.extensions
        .map((ext) => {
            const steps = ext.steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n");
            return `### ${ext.condition}\n${steps}${ext.returnTo ? `\n  → 返回主流程步骤 ${ext.returnTo}` : ""}`;
        })
        .join("\n\n");

    const precondList = useCase.preconditions.map((p) => `- ${p}`).join("\n");
    const successList = useCase.postconditions.success
        .map((p) => `- ${p}`)
        .join("\n");
    const failureList = useCase.postconditions.failure
        .map((p) => `- ${p}`)
        .join("\n");
    const rulesList = useCase.businessRules.map((r) => `- ${r}`).join("\n");

    return `# 用例：${useCase.name}

## 基本信息
- **用例ID**：${useCase.id}
- **参与者**：${useCase.actor}
- **优先级**：${useCase.priority}

## 简要描述
${useCase.description}

## 前置条件
${precondList}

## 后置条件

### 成功后置条件
${successList}

### 失败后置条件
${failureList}

## 基本流程

| 步骤 | 参与者动作 | 系统响应 |
|------|------------|----------|
${mainFlowTable}

${useCase.extensions.length > 0 ? `## 扩展流程\n\n${extensionsList}` : ""}

${useCase.businessRules.length > 0 ? `## 业务规则\n${rulesList}` : ""}
`;
}

/**
 * 生成数据实体文档
 */
export function generateEntityDoc(entity: DataEntity): string {
    const attrTable = entity.attributes
        .map(
            (a) =>
                `| ${a.name} | ${a.type} | ${a.required ? "是" : "否"} | ${a.isPrimaryKey ? "是" : "否"} | ${a.description} |`,
        )
        .join("\n");

    const relTable = entity.relationships
        .map((r) => `| ${r.targetEntity} | ${r.type} | ${r.description} |`)
        .join("\n");

    return `# 实体：${entity.name}

## 描述
${entity.description}

## 属性

| 属性名 | 数据类型 | 必填 | 主键 | 说明 |
|--------|----------|------|------|------|
${attrTable}

## 关系

| 关联实体 | 关系类型 | 说明 |
|----------|----------|------|
${relTable}
`;
}

/**
 * 生成需求追踪矩阵
 */
export function generateTraceabilityMatrix(
    requirements: Requirement[],
    useCases: UseCase[],
): string {
    const useCaseMap = new Map(useCases.map((uc) => [uc.id, uc]));

    let table = "| 需求ID | 需求标题 | 优先级 | 状态 | 关联用例 |\n";
    table += "|--------|----------|--------|------|----------|\n";

    for (const req of requirements) {
        const useCaseLinks = req.relatedUseCases
            .map((ucId) => {
                const uc = useCaseMap.get(ucId);
                return uc ? `${ucId}(${uc.name})` : ucId;
            })
            .join(", ");

        table += `| ${req.id} | ${req.title} | ${req.priority} | ${req.status} | ${useCaseLinks || "-"} |\n`;
    }

    return `# 需求追踪矩阵\n\n${table}`;
}

/**
 * 分析需求覆盖度
 */
export function analyzeRequirementCoverage(
    requirements: Requirement[],
    useCases: UseCase[],
): {
    totalRequirements: number;
    coveredRequirements: number;
    coverageRate: number;
    uncoveredRequirements: Requirement[];
    orphanUseCases: UseCase[];
} {
    const coveredReqIds = new Set<string>();
    const linkedUcIds = new Set<string>();

    for (const req of requirements) {
        if (req.relatedUseCases.length > 0) {
            coveredReqIds.add(req.id);
            req.relatedUseCases.forEach((ucId) => linkedUcIds.add(ucId));
        }
    }

    const uncoveredRequirements = requirements.filter(
        (r) => !coveredReqIds.has(r.id),
    );
    const orphanUseCases = useCases.filter((uc) => !linkedUcIds.has(uc.id));

    return {
        totalRequirements: requirements.length,
        coveredRequirements: coveredReqIds.size,
        coverageRate: Math.round((coveredReqIds.size / requirements.length) * 100),
        uncoveredRequirements,
        orphanUseCases,
    };
}

// ============================================================================
// 使用示例
// ============================================================================

export function exampleUsage(): void {
    // 1. 创建用户故事
    const story: UserStory = {
        id: "US-001",
        role: "普通用户",
        goal: "能够搜索商品",
        benefit: "快速找到想要购买的商品",
        acceptanceCriteria: [
            "Given 用户在首页，When 输入关键词并点击搜索，Then 显示匹配的商品列表",
            'Given 搜索结果为空，When 显示结果页，Then 提示"未找到相关商品"',
        ],
        priority: "高",
        estimatedPoints: 5,
    };

    // 验证用户故事
    const validation = validateUserStory(story);
    console.log("INVEST 验证结果:", validation);

    // 生成用户故事文档
    const storyDoc = generateUserStoryDoc(story);
    console.log(storyDoc);

    // 2. 从用户故事生成用例
    const useCase = userStoryToUseCase(story);
    const useCaseDoc = generateUseCaseDoc(useCase);
    console.log(useCaseDoc);

    // 3. 创建需求并验证
    const requirement: Requirement = {
        id: "REQ-SEARCH-001",
        title: "商品搜索功能",
        description: "用户能够通过关键词搜索商品，系统返回匹配的商品列表",
        type: "功能需求",
        priority: "高",
        status: "已确认",
        source: "客户代表-张三",
        relatedUseCases: ["UC-001"],
        acceptanceCriteria: [
            "用户输入关键词后应该在2秒内返回结果",
            "搜索结果必须按相关度排序",
        ],
        dependencies: [],
    };

    const reqValidation = validateRequirement(requirement);
    console.log("需求验证结果:", reqValidation);
}

// Additional functions for unit tests
export interface CreateUserStoryInput {
    role: string;
    goal: string;
    benefit: string;
    priority: string;
}

export function createUserStory(input: CreateUserStoryInput): UserStory {
    const sequence = Math.floor(Math.random() * 1000) + 1;
    const id = generateRequirementId('US', sequence);

    const priority = input.priority as RequirementPriority;
    const acceptanceCriteria = generateAcceptanceCriteria(input.goal);

    return {
        id,
        role: input.role,
        goal: input.goal,
        benefit: input.benefit,
        priority,
        acceptanceCriteria,
        estimatedPoints: estimateStoryPoints(priority),
    };
}

function generateAcceptanceCriteria(goal: string): string[] {
    const criteria: string[] = [];
    criteria.push('用户能够成功' + goal);
    criteria.push('系统提供清晰的反馈');
    criteria.push('操作流程符合用户预期');
    return criteria;
}

function estimateStoryPoints(priority: RequirementPriority): number {
    switch (priority) {
        case '高':
            return 8;
        case '中':
            return 5;
        case '低':
            return 3;
        default:
            return 5;
    }
}

export interface CreateUseCaseInput {
    name: string;
    actor: string;
    description: string;
    preconditions: string[];
    businessRules: string[];
    priority?: string;
}

export function createUseCase(input: CreateUseCaseInput): UseCase {
    const sequence = Math.floor(Math.random() * 1000) + 1;
    const id = generateUseCaseId(sequence);

    const priority = (input.priority || '中') as RequirementPriority;

    const mainFlow: UseCaseStep[] = [
        {
            stepNumber: 1,
            actorAction: '用户发起操作',
            systemResponse: '系统响应请求'
        }
    ];

    return {
        id,
        name: input.name,
        actor: input.actor,
        description: input.description,
        preconditions: input.preconditions,
        postconditions: {
            success: ['操作成功完成'],
            failure: ['操作失败，系统显示错误信息']
        },
        mainFlow,
        extensions: [],
        businessRules: input.businessRules,
        priority,
    };
}

export interface DependencyAnalysisResult {
    graph: Record<string, string[]>;
    circularDependencies: string[][];
    topologicalOrder: string[];
}

export function analyzeDependencies(requirements: Array<{ id: string; dependencies: string[] }>): DependencyAnalysisResult {
    const graph: Record<string, string[]> = {};

    // Build dependency graph
    for (const req of requirements) {
        graph[req.id] = req.dependencies || [];
    }

    // Detect circular dependencies
    const circularDependencies: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function detectCircular(node: string, path: string[]): void {
        visited.add(node);
        recursionStack.add(node);
        const currentPath = [...path, node];

        for (const dep of graph[node] || []) {
            if (!visited.has(dep)) {
                detectCircular(dep, currentPath);
            } else if (recursionStack.has(dep)) {
                const cycle = currentPath.slice(currentPath.indexOf(dep));
                circularDependencies.push([...cycle, dep]);
            }
        }

        recursionStack.delete(node);
    }

    for (const nodeId in graph) {
        if (!visited.has(nodeId)) {
            detectCircular(nodeId, []);
        }
    }

    // Generate topological order (Kahn's algorithm)
    const inDegree: Record<string, number> = {};
    const dependents: Record<string, string[]> = {};

    for (const nodeId in graph) {
        inDegree[nodeId] = (graph[nodeId] || []).length;

        for (const dep of graph[nodeId] || []) {
            if (!dependents[dep]) {
                dependents[dep] = [];
            }
            dependents[dep].push(nodeId);
        }
    }

    const queue: string[] = [];
    for (const nodeId in inDegree) {
        if (inDegree[nodeId] === 0) {
            queue.push(nodeId);
        }
    }

    const topologicalOrder: string[] = [];
    while (queue.length > 0) {
        const node = queue.shift()!;
        topologicalOrder.push(node);

        for (const dependent of dependents[node] || []) {
            inDegree[dependent]--;
            if (inDegree[dependent] === 0) {
                queue.push(dependent);
            }
        }
    }

    return {
        graph,
        circularDependencies,
        topologicalOrder
    };
}

export interface UseCaseDiagramOptions {
    useCases: Array<{
        id: string;
        name: string;
        actor: string;
    }>;
}

export function generateUseCaseDiagram(useCases: Array<{ id: string; name: string; actor: string }>): string {
    let diagram = '@startuml\n';
    diagram += 'left to right direction\n';
    diagram += 'skinparam packageStyle rectangle\n';

    const actors = new Set<string>();
    for (const uc of useCases) {
        actors.add(uc.actor);
    }

    const actorArray = Array.from(actors);
    for (const actor of actorArray) {
        diagram += 'actor "' + actor + '"\n';
    }

    diagram += 'rectangle "系统" {\n';

    for (const uc of useCases) {
        diagram += '  usecase "' + uc.name + '" as ' + uc.id + '\n';
    }

    diagram += '}\n';

    for (const uc of useCases) {
        diagram += '"' + uc.actor + '" --> ' + uc.id + '\n';
    }

    diagram += '@enduml';
    return diagram;
}
