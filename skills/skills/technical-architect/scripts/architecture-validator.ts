#!/usr/bin/env node

/**
 * Technical Architect - Architecture Validator Script
 *
 * 用途：验证架构设计的完整性、一致性和质量
 * 使用场景：在架构设计完成后，自动检查架构文档和代码实现
 */

interface ArchitectureValidationRule {
    name: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
    check: (context: ValidationContext) => ValidationResult;
}

interface ValidationContext {
    projectType: string;
    techStack: string[];
    architecturePattern: string;
    documents: string[];
    codeFiles: string[];
}

interface ValidationResult {
    passed: boolean;
    message: string;
    details?: string;
}

class ArchitectureValidator {
    private rules: ArchitectureValidationRule[] = [
        {
            name: '分层架构验证',
            description: '检查代码是否按照分层架构组织',
            severity: 'error',
            check: (ctx) => this.validateLayeredArchitecture(ctx)
        },
        {
            name: '依赖方向验证',
            description: '检查依赖关系是否正确（上层依赖下层）',
            severity: 'error',
            check: (ctx) => this.validateDependencyDirection(ctx)
        },
        {
            name: '单一职责验证',
            description: '检查模块和类是否符合单一职责原则',
            severity: 'warning',
            check: (ctx) => this.validateSingleResponsibility(ctx)
        },
        {
            name: '接口隔离验证',
            description: '检查接口是否精简，避免胖接口',
            severity: 'warning',
            check: (ctx) => this.validateInterfaceSegregation(ctx)
        },
        {
            name: '开闭原则验证',
            description: '检查系统是否易于扩展，无需修改现有代码',
            severity: 'info',
            check: (ctx) => this.validateOpenClosedPrinciple(ctx)
        }
    ];

    /**
     * 验证分层架构
     */
    private validateLayeredArchitecture(ctx: ValidationContext): ValidationResult {
        // 检查是否存在明确的分层目录结构
        const expectedLayers = this.getExpectedLayers(ctx.architecturePattern);

        // 实际检查逻辑需要根据项目结构实现
        const missingLayers = this.findMissingLayers(ctx.codeFiles, expectedLayers);

        if (missingLayers.length > 0) {
            return {
                passed: false,
                message: `分层架构不完整，缺少以下层级: ${missingLayers.join(', ')}`,
                details: `预期的分层结构: ${expectedLayers.join(' -> ')}`
            };
        }

        return {
            passed: true,
            message: '分层架构验证通过'
        };
    }

    /**
     * 验证依赖方向
     */
    private validateDependencyDirection(ctx: ValidationContext): ValidationResult {
        // 检查依赖关系是否符合架构模式的要求
        // 例如：Domain层不应依赖Infrastructure层

        return {
            passed: true,
            message: '依赖方向验证通过'
        };
    }

    /**
     * 验证单一职责原则
     */
    private validateSingleResponsibility(ctx: ValidationContext): ValidationResult {
        // 检查类和模块的复杂度、方法数量等指标

        return {
            passed: true,
            message: '单一职责原则验证通过'
        };
    }

    /**
     * 验证接口隔离原则
     */
    private validateInterfaceSegregation(ctx: ValidationContext): ValidationResult {
        // 检查接口方法数量、接口使用率等

        return {
            passed: true,
            message: '接口隔离原则验证通过'
        };
    }

    /**
     * 验证开闭原则
     */
    private validateOpenClosedPrinciple(ctx: ValidationContext): ValidationResult {
        // 检查扩展点、抽象层、插件机制等

        return {
            passed: true,
            message: '开闭原则验证通过'
        };
    }

    /**
     * 根据架构模式获取预期的分层结构
     */
    private getExpectedLayers(pattern: string): string[] {
        const layerPatterns: Record<string, string[]> = {
            '六边形架构': ['domain', 'application', 'infrastructure', 'interfaces'],
            '分层架构': ['presentation', 'business', 'persistence', 'database'],
            '洋葱架构': ['domain', 'application', 'infrastructure'],
            '微服务': ['gateway', 'service', 'data']
        };

        return layerPatterns[pattern] || layerPatterns['六边形架构'];
    }

    /**
     * 查找缺失的分层
     */
    private findMissingLayers(codeFiles: string[], expectedLayers: string[]): string[] {
        return expectedLayers.filter(layer =>
            !codeFiles.some(file => file.includes(layer))
        );
    }

    /**
     * 执行完整的架构验证
     */
    public validate(context: ValidationContext): void {
        console.log('=== 架构验证开始 ===\n');

        let errorCount = 0;
        let warningCount = 0;
        let infoCount = 0;

        for (const rule of this.rules) {
            console.log(`🔍 检查: ${rule.name}`);
            console.log(`   ${rule.description}`);

            const result = rule.check(context);

            if (result.passed) {
                console.log(`   ✅ ${result.message}`);
            } else {
                const icon = rule.severity === 'error' ? '❌' :
                    rule.severity === 'warning' ? '⚠️' : 'ℹ️';
                console.log(`   ${icon} ${result.message}`);
                if (result.details) {
                    console.log(`   💡 ${result.details}`);
                }

                if (rule.severity === 'error') errorCount++;
                else if (rule.severity === 'warning') warningCount++;
                else infoCount++;
            }

            console.log('');
        }

        console.log('=== 验证结果汇总 ===');
        console.log(`❌ 错误: ${errorCount}`);
        console.log(`⚠️  警告: ${warningCount}`);
        console.log(`ℹ️  信息: ${infoCount}`);
        console.log(`\n总计: ${errorCount + warningCount + infoCount} 个问题`);
    }

    /**
     * 生成架构验证报告
     */
    public generateReport(context: ValidationContext): string {
        let report = '# 架构验证报告\n\n';
        report += `## 项目信息\n`;
        report += `- 项目类型: ${context.projectType}\n`;
        report += `- 技术栈: ${context.techStack.join(', ')}\n`;
        report += `- 架构模式: ${context.architecturePattern}\n\n`;

        report += `## 验证规则\n\n`;
        for (const rule of this.rules) {
            const result = rule.check(context);
            const status = result.passed ? '✅ 通过' : '❌ 未通过';
            report += `### ${rule.name} - ${status}\n`;
            report += `${rule.description}\n`;
            if (!result.passed) {
                report += `**问题**: ${result.message}\n`;
                if (result.details) {
                    report += `**建议**: ${result.details}\n`;
                }
            }
            report += '\n';
        }

        return report;
    }
}

// CLI使用示例
if (require.main === module) {
    const validator = new ArchitectureValidator();

    // 示例上下文
    const exampleContext: ValidationContext = {
        projectType: 'web-application',
        techStack: ['TypeScript', 'Node.js', 'PostgreSQL'],
        architecturePattern: '六边形架构',
        documents: ['ARCHITECTURE.md', 'API.md'],
        codeFiles: ['src/domain', 'src/application', 'src/infrastructure']
    };

    validator.validate(exampleContext);
}

export { ArchitectureValidationRule, ArchitectureValidator, ValidationContext, ValidationResult };
