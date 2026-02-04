#!/usr/bin/env node

/**
 * Project Coordinator - 协调工具脚本
 *
 * 用途：协调多个skill的调用顺序、上下文传递、状态管理和错误处理
 * 使用场景：启动完整产品开发流程、阶段转换、异常处理、里程碑管理
 */

interface SkillTask {
    name: string;
    order: number;
    input: any;
    dependencies?: string[];
}

interface ProjectPhase {
    name: string;
    order: number;
    skills: SkillTask[];
}

interface ProjectState {
    currentPhase: string;
    completedPhases: string[];
    context: Map<string, any>;
    errors: Error[];
}

interface CoordinatorOptions {
    projectType: 'web' | 'mobile' | 'desktop' | 'backend';
    phases: ProjectPhase[];
    debugMode: boolean;
}

export class ProjectCoordinator {
    private _options: CoordinatorOptions;
    private _state: ProjectState;

    constructor(options: CoordinatorOptions) {
        this._options = options;
        this._state = {
            currentPhase: '',
            completedPhases: [],
            context: new Map(),
            errors: []
        };
    }

    /**
     * 启动完整产品开发流程
     */
    async startProject(requirements: any): Promise<void> {
        this.log('🚀 启动产品开发流程');
        this._state.context.set('requirements', requirements);

        for (const phase of this._options.phases) {
            await this.executePhase(phase);
        }

        this.log('✅ 产品开发流程完成');
    }

    /**
     * 执行单个阶段
     */
    private async executePhase(phase: ProjectPhase): Promise<void> {
        this._state.currentPhase = phase.name;
        this.log(`\n📍 阶段: ${phase.name}`);

        // 按顺序执行该阶段的所有skill任务
        for (const task of phase.skills) {
            await this.executeSkill(task);
        }

        // 将阶段名加入已完成阶段列表
        this._state.completedPhases.push(phase.name);
        this.log(`✅ 阶段完成: ${phase.name}`);
    }

    /**
     * 执行单个skill任务
     */
    private async executeSkill(task: SkillTask): Promise<void> {
        this.log(`  ↳ 执行: ${task.name}`);

        // 检查依赖是否完成
        if (task.dependencies) {
            for (const dep of task.dependencies) {
                if (!this._state.completedPhases.includes(dep)) {
                    throw new Error(`依赖未完成: ${dep}`);
                }
            }
        }

        try {
            // 执行skill（这里需要实际的skill调用逻辑）
            const result = await this.invokeSkill(task.name, task.input);

            // 将结果存入上下文
            this._state.context.set(task.name, result);

            // 将技能标记为已完成
            if (!this._state.completedPhases.includes(task.name)) {
                this._state.completedPhases.push(task.name);
            }

            this.log(`  ✅ 完成: ${task.name}`);
        } catch (error) {
            this._state.errors.push(error as Error);
            this.log(`  ❌ 失败: ${task.name} - ${error}`);

            // 根据错误严重程度决定是否继续
            if (this.isFatalError(error)) {
                throw error;
            }
        }
    }

    /**
     * 调用具体的skill
     */
    private async invokeSkill(skillName: string, input: any): Promise<any> {
        // 这里需要实现实际的skill调用逻辑
        // 可以通过CLI命令调用其他skill，或者直接导入skill模块

        this.log(`    输入: ${JSON.stringify(input, null, 2)}`);

        // 模拟skill执行
        return {
            success: true,
            output: `${skillName}的输出结果`,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 处理异常
     */
    async handleError(error: Error): Promise<void> {
        this.log(`\n❌ 错误: ${error.message}`);
        this._state.errors.push(error);

        // 根据错误类型决定处理策略
        if (this.isFatalError(error)) {
            await this.handleFatalError(error);
        } else {
            await this.handleNonFatalError(error);
        }
    }

    /**
     * 处理致命错误
     */
    private async handleFatalError(error: Error): Promise<void> {
        this.log('🛑 致命错误，停止执行');

        // 生成错误报告
        const errorReport = this.generateErrorReport(error);
        this._state.context.set('errorReport', errorReport);

        // 通知相关人员
        await this.notifyTeam(error);
    }

    /**
     * 处理非致命错误
     */
    private async handleNonFatalError(error: Error): Promise<void> {
        this.log('⚠️ 非致命错误，继续执行');

        // 记录错误，但继续执行
        // 可以尝试回滚或修复
    }

    /**
     * 判断是否为致命错误
     */
    private isFatalError(error: any): boolean {
        return error.fatal === true || error.code === 'FATAL';
    }

    /**
     * 生成错误报告
     */
    private generateErrorReport(error: Error): string {
        return `
错误报告
-------
时间: ${new Date().toISOString()}
错误: ${error.message}
堆栈: ${error.stack}
阶段: ${this._state.currentPhase}
已完成的阶段: ${this._state.completedPhases.join(', ')}
    `.trim();
    }

    /**
     * 通知团队
     */
    private async notifyTeam(error: Error): Promise<void> {
        // 实现通知逻辑（邮件、Slack等）
        this.log('📧 通知团队处理错误');
    }

    /**
     * 查询项目状态
     */
    getProjectState(): ProjectState {
        return { ...this._state };
    }

    /**
     * 获取进度报告
     */
    getProgressReport(): string {
        const totalPhases = this._options.phases.length;
        const completedPhases = this._state.completedPhases.length;
        const progress = ((completedPhases / totalPhases) * 100).toFixed(1);

        return `
项目进度报告
---------
总阶段数: ${totalPhases}
已完成: ${completedPhases}
进度: ${progress}%
当前阶段: ${this._state.currentPhase}
错误数: ${this._state.errors.length}
    `.trim();
    }

    /**
     * 暂停项目
     */
    async pauseProject(): Promise<void> {
        this.log('\n⏸️ 项目已暂停');
        // 保存当前状态
    }

    /**
     * 恢复项目
     */
    async resumeProject(): Promise<void> {
        this.log('\n▶️ 项目已恢复');
        // 从保存的状态继续
    }

    /**
     * 生成最终报告
     */
    generateFinalReport(): string {
        const report = `
项目最终报告
------------
完成时间: ${new Date().toISOString()}
项目类型: ${this._options.projectType}
总阶段数: ${this._options.phases.length}
已完成阶段: ${this._state.completedPhases.length}
总错误数: ${this._state.errors.length}

完成的阶段:
${this._state.completedPhases.map(phase => `  ✅ ${phase}`).join('\n')}

错误日志:
${this._state.errors.map((err, idx) => `  ${idx + 1}. ${err.message}`).join('\n')}
    `.trim();

        return report;
    }

    /**
     * 日志输出
     */
    private log(message: string): void {
        if (this._options.debugMode) {
            console.log(message);
        }
    }

    /**
     * 获取默认阶段配置
     */
    static getDefaultPhases(): ProjectPhase[] {
        return [
            {
                name: '需求分析',
                order: 1,
                skills: [
                    { name: 'customer-representative', order: 1, input: {} },
                    { name: 'requirements-analyst', order: 2, input: {}, dependencies: ['customer-representative'] }
                ]
            },
            {
                name: '产品设计',
                order: 2,
                skills: [
                    { name: 'product-expert', order: 1, input: {}, dependencies: ['需求分析'] },
                    { name: 'ui-expert', order: 2, input: {}, dependencies: ['product-expert'] }
                ]
            },
            {
                name: '架构设计',
                order: 3,
                skills: [
                    { name: 'technical-architect', order: 1, input: {}, dependencies: ['产品设计'] }
                ]
            },
            {
                name: '开发实现',
                order: 4,
                skills: [
                    { name: 'backend-engineer', order: 1, input: {}, dependencies: ['架构设计'] },
                    { name: 'frontend-engineer', order: 2, input: {}, dependencies: ['架构设计'] },
                    { name: 'test-framework-builder', order: 3, input: {}, dependencies: ['backend-engineer'] }
                ]
            },
            {
                name: '测试验证',
                order: 5,
                skills: [
                    { name: 'tester', order: 1, input: {}, dependencies: ['开发实现'] }
                ]
            },
            {
                name: '部署上线',
                order: 6,
                skills: [
                    { name: 'devops-generator', order: 1, input: {}, dependencies: ['测试验证'] }
                ]
            }
        ];
    }
}

function handleProjectSuccess(coordinator: ProjectCoordinator): void {
    console.log('\n' + coordinator.getProgressReport());
    console.log('\n' + coordinator.generateFinalReport());
}

function handleProjectError(error: any): void {
    console.error('项目失败:', error);
}

function runCliExample(): void {
    const coordinator = new ProjectCoordinator({
        projectType: 'web',
        phases: ProjectCoordinator.getDefaultPhases(),
        debugMode: true
    });

    coordinator.startProject({ description: '测试项目' })
        .then(() => {
            handleProjectSuccess(coordinator);
        })
        .catch((error) => {
            handleProjectError(error);
        });
}

// CLI使用示例
if (require.main === module) {
    runCliExample();
}

export { handleProjectError, handleProjectSuccess, runCliExample };
