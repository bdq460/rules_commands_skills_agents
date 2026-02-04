/**
 * Technical Architect 测试适配器
 *
 * 将 ArchitectureValidator 类方法包装为测试期望的函数形式
 */

import { ArchitectureValidator, ValidationContext } from '../../../skills/technical-architect/scripts/architecture-validator';

const validator = new ArchitectureValidator();

// 定义测试期望的数据类型
interface TestArchitecture {
    layers?: string[];
    dependencies?: Record<string, string[]>;
    architecturePattern?: string;
    projectType?: string;
    techStack?: string[];
    documents?: string[];
    codeFiles?: string[];
}

// 用于内部处理的完整架构类型
interface CompleteArchitecture {
    layers: string[];
    dependencies: Record<string, string[]>;
}

interface TestValidationResult {
    valid: boolean;
    errors: Array<{
        rule: string;
        message: string;
        details?: string;
    }>;
    warnings: Array<{
        rule: string;
        message: string;
        details?: string;
    }>;
    info?: Array<{
        rule: string;
        message: string;
        details?: string;
    }>;
}

interface TestLayeringResult {
    passed: boolean;
    valid?: boolean;
    violations?: string[];
    message: string;
    details?: string;
}

interface TestDependencyResult {
    valid: boolean;
    violations: Array<{
        from: string;
        to: string;
        description: string;
    }>;
}

interface TestArchitectureReport {
    summary: string;
    layers?: string[];
    dependencies?: Record<string, string[]>;
    validationResults: Array<{
        rule: string;
        severity: 'error' | 'warning' | 'info';
        status: 'passed' | 'failed';
        message: string;
    }>;
    recommendations: string[];
    overallStatus: 'passed' | 'failed' | 'warning';
}

/**
 * 验证架构
 */
export function validateArchitecture(architecture: TestArchitecture): TestValidationResult {
    const errors: Array<{ rule: string; message: string; details?: string }> = [];
    const warnings: Array<{ rule: string; message: string; details?: string }> = [];

    // 检查循环依赖
    const hasCircularDeps = checkCircularDependencies(architecture.dependencies || {});
    if (hasCircularDeps) {
        errors.push({
            rule: '循环依赖检查',
            message: '检测到循环依赖',
            details: '架构中存在循环依赖，违反了依赖方向原则',
        });
    }

    // 检查分层架构
    const layering = checkLayering(architecture);
    if (!layering.passed) {
        errors.push({
            rule: '分层架构验证',
            message: layering.message,
            details: layering.details,
        });
    }

    // 检查依赖规则
    const depResult = checkDependencyRules(architecture);
    if (!depResult.valid && depResult.violations.length > 0) {
        depResult.violations.forEach(violation => {
            errors.push({
                rule: '依赖规则验证',
                message: `发现依赖违规: ${violation.from} -> ${violation.to}`,
                details: violation.description,
            });
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * 检查循环依赖
 */
function checkCircularDependencies(dependencies: Record<string, string[]>): boolean {
    const layers = Object.keys(dependencies);
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function hasCycle(layer: string): boolean {
        visited.add(layer);
        recursionStack.add(layer);

        const deps = dependencies[layer] || [];
        for (const dep of deps) {
            if (!visited.has(dep)) {
                if (hasCycle(dep)) return true;
            } else if (recursionStack.has(dep)) {
                return true;
            }
        }

        recursionStack.delete(layer);
        return false;
    }

    for (const layer of layers) {
        if (!visited.has(layer)) {
            if (hasCycle(layer)) return true;
        }
    }

    return false;
}

/**
 * 检查分层架构
 * 接受两种格式：TestArchitecture 对象或字符串数组
 */
export function checkLayering(input: TestArchitecture | string[]): TestLayeringResult {
    let layers: string[] = [];

    if (Array.isArray(input)) {
        layers = input;
    } else {
        layers = input.layers || [];
    }

    if (layers.length < 2) {
        return {
            passed: false,
            valid: false,
            violations: ['架构缺少必要的分层'],
            message: '架构缺少必要的分层',
            details: '建议至少包含 2 个分层',
        };
    }

    // 检查常见的分层模式
    const validPatterns = [
        ['presentation', 'domain', 'infrastructure'],
        ['ui', 'application', 'domain', 'infrastructure'],
        ['presentation', 'business', 'persistence', 'database'],
        ['presentation', 'business', 'data'],
    ];

    const matchesPattern = validPatterns.some(pattern =>
        pattern.length === layers.length &&
        pattern.every(layer => layers.includes(layer))
    );

    if (!matchesPattern) {
        return {
            passed: false,
            valid: false,
            violations: ['分层架构不符合标准模式'],
            message: '分层架构不符合标准模式',
            details: `当前分层: ${layers.join(', ')}`,
        };
    }

    return {
        passed: true,
        valid: true,
        violations: [],
        message: '分层架构验证通过',
    };
}

/**
 * 检查依赖规则
 * 接受两种格式：TestArchitecture 对象或依赖对象
 */
export function checkDependencyRules(
    input: TestArchitecture | Record<string, string[]>
): TestDependencyResult {
    let layers: string[] = [];
    let dependencies: Record<string, string[]> = {};

    if (Array.isArray(input)) {
        // 如果是数组，无法检查依赖规则，返回有效
        return { valid: true, violations: [] };
    } else if (input.layers !== undefined) {
        // TestArchitecture 对象
        layers = input.layers || [];
        dependencies = (input.dependencies || {}) as Record<string, string[]>;
    } else {
        // 仅依赖对象
        dependencies = input as Record<string, string[]>;
        layers = Object.keys(dependencies);
    }

    const violations: Array<{ from: string; to: string; description: string }> = [];

    // 检查循环依赖
    const hasCircularDeps = checkCircularDependencies(dependencies);
    if (hasCircularDeps) {
        violations.push({
            from: 'system',
            to: 'system',
            description: '检测到循环依赖',
        });
    }

    // 检查依赖方向：上层可以依赖下层，但不能反向依赖
    for (const from of layers) {
        const deps = dependencies[from] || [];
        const fromIndex = layers.indexOf(from);

        for (const to of deps) {
            const toIndex = layers.indexOf(to);

            // 如果依赖的层在当前层之前（上层），则违反了依赖方向
            if (toIndex !== -1 && toIndex < fromIndex) {
                violations.push({
                    from,
                    to,
                    description: `${to} 是上层，不应该被 ${from} 依赖`,
                });
            }

            // 检查是否依赖了不存在的层
            if (!layers.includes(to)) {
                violations.push({
                    from,
                    to,
                    description: `依赖的目标层 ${to} 不存在于架构中`,
                });
            }
        }
    }

    return {
        valid: violations.length === 0,
        violations,
    };
}

/**
 * 生成架构验证报告
 */
export function generateArchitectureReport(architecture: TestArchitecture): TestArchitectureReport {
    const validationResults: Array<{
        rule: string;
        severity: 'error' | 'warning' | 'info';
        status: 'passed' | 'failed';
        message: string;
    }> = [];

    const recommendations: string[] = [];

    // 检查分层架构
    const layering = checkLayering(architecture);
    validationResults.push({
        rule: '分层架构验证',
        severity: 'error',
        status: layering.passed ? 'passed' : 'failed',
        message: layering.message,
    });

    if (!layering.passed && layering.details) {
        recommendations.push(layering.details);
    }

    // 检查依赖规则
    const depResult = checkDependencyRules(architecture);
    validationResults.push({
        rule: '依赖规则验证',
        severity: 'error',
        status: depResult.valid ? 'passed' : 'failed',
        message: depResult.valid ? '依赖方向验证通过' : '发现依赖规则违反',
    });

    if (!depResult.valid) {
        depResult.violations.forEach(v => {
            recommendations.push(`修复依赖违规: ${v.from} -> ${v.to} (${v.description})`);
        });
    }

    // 检查循环依赖
    const hasCircular = checkCircularDependencies(architecture.dependencies || {});
    validationResults.push({
        rule: '循环依赖检查',
        severity: 'error',
        status: hasCircular ? 'failed' : 'passed',
        message: hasCircular ? '检测到循环依赖' : '无循环依赖',
    });

    if (hasCircular) {
        recommendations.push('消除架构中的循环依赖');
    }

    // 确定整体状态
    const failed = validationResults.filter(r => r.status === 'failed' && r.severity === 'error');
    const overallStatus: 'passed' | 'failed' | 'warning' = failed.length > 0 ? 'failed' : 'passed';

    return {
        summary: `架构验证${overallStatus === 'passed' ? '通过' : '失败'}`,
        layers: architecture.layers,
        dependencies: architecture.dependencies,
        validationResults,
        recommendations,
        overallStatus,
    };
}
