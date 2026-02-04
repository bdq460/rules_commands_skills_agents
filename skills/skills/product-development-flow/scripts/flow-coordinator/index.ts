/**
 * Flow Coordinator - 产品开发流程协调器
 *
 * 负责协调12个阶段的开发流程，管理阶段间的数据传递、进度跟踪和质量控制。
 */

import { writeFileSync } from "fs";

/**
 * 简单的日志记录器
 */
class Logger {
    constructor(private prefix: string) {}

    info(...args: any[]): void {
        console.log(`[${this.prefix}] INFO:`, ...args);
    }

    warn(...args: any[]): void {
        console.warn(`[${this.prefix}] WARN:`, ...args);
    }

    error(...args: any[]): void {
        console.error(`[${this.prefix}] ERROR:`, ...args);
    }
}

/**
 * 上下文管理器
 */
class ContextManager {
    private data: Map<string, any> = new Map();

    set(key: string, value: any): void {
        this.data.set(key, value);
    }

    get(key: string): any {
        return this.data.get(key);
    }

    has(key: string): boolean {
        return this.data.has(key);
    }
}

/**
 * 文件管理器
 */
class FileManager {
    writeFile(path: string, content: string): void {
        writeFileSync(path, content, "utf-8");
    }
}

export interface StageConfig {
    name: string;
    skillName: string;
    requiredRoles: string[];
    qualityThresholds: {
        [key: string]: number;
    };
}

export interface ProjectContext {
    name: string;
    startDate: Date;
    targetEndDate: Date;
    description?: string;
}

export interface ProgressInfo {
    currentStage: string | null;
    overallProgress: number;
    stageStatuses: {
        [stageName: string]: {
            status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'on-hold';
            progress: number;
            reviewCount: number;
        };
    };
    qualityMetrics: {
        [stageName: string]: {
            [metric: string]: number;
        };
    };
}

export class FlowCoordinator {
    private logger: Logger;
    private ctx: ContextManager;
    private fm: FileManager;
    private stages: Map<string, StageConfig> = new Map();
    private artifacts: Map<string, any> = new Map();
    private qualityMetrics: Map<string, any> = new Map();

    constructor(
        private projectContext: ProjectContext,
        private enableAutoTransition: boolean = true,
        private maxReviewAttempts: number = 3,
        private failOnCritical: boolean = false
    ) {
        this.logger = new Logger("FlowCoordinator");
        this.ctx = new ContextManager();
        this.fm = new FileManager();

        this.initializeStages();

        this.ctx.set("project", projectContext);
        this.logger.info("FlowCoordinator initialized for project:", projectContext.name);
    }

    /**
     * 初始化所有阶段的配置
     */
    private initializeStages(): void {
        const stageNames = [
            "requirements-proposal",
            "requirements-analysis",
            "product-design",
            "ui-design",
            "frontend-development",
            "backend-development",
            "architecture-guarantee",
            "testing-verification",
            "documentation-delivery",
            "security-review",
            "test-framework-setup",
            "release-operations",
            "project-coordination",
        ];

        for (let index = 0; index < stageNames.length; index++) {
            const stageName = stageNames[index];
            this.stages.set(stageName, {
                name: stageName,
                skillName: this.getSkillName(stageName),
                requiredRoles: this.getRequiredRoles(stageName),
                qualityThresholds: this.getQualityThresholds(stageName),
            });
        }
    }

    /**
     * 根据阶段名称获取技能名称
     */
    private getSkillName(stage: string): string {
        const skillMap: { [key: string]: string } = {
            "requirements-proposal": "customer-representative",
            "requirements-analysis": "requirements-analyst",
            "product-design": "product-expert",
            "ui-design": "ui-expert",
            "frontend-development": "frontend-engineer",
            "backend-development": "backend-engineer",
            "architecture-guarantee": "technical-architect",
            "testing-verification": "tester",
            "documentation-delivery": "product-documentation-expert",
            "security-review": "security-engineer",
            "test-framework-setup": "test-framework-builder",
            "release-operations": "devops-generator",
            "project-coordination": "project-coordinator",
        };

        return skillMap[stage];
    }

    /**
     * 获取阶段所需的角色
     */
    private getRequiredRoles(stage: string): string[] {
        const rolesMap: { [key: string]: string[] } = {
            "requirements-proposal": ["customer-representative"],
            "requirements-analysis": ["requirements-analyst"],
            "product-design": ["product-expert"],
            "ui-design": ["ui-expert"],
            "frontend-development": ["frontend-engineer"],
            "backend-development": ["backend-engineer"],
            "architecture-guarantee": ["technical-architect"],
            "testing-verification": ["tester"],
            "documentation-delivery": ["product-documentation-expert"],
            "security-review": ["security-engineer"],
            "test-framework-setup": ["test-framework-builder"],
            "release-operations": ["devops-generator", "technical-architect"],
            "project-coordination": ["project-coordinator", "customer-representative"],
        };

        return rolesMap[stage] || [];
    }

    /**
     * 获取阶段的质量阈值
     */
    private getQualityThresholds(stage: string): { [key: string]: number } {
        const thresholds: { [key: string]: { [key: string]: number } } = {
            "requirements-proposal": {
                "clarity": 95,
                "customerPerspective": 95,
                "acceptanceCriteria": 100,
            },
            "requirements-analysis": {
                "completeness": 100,
                "consistency": 0,
                "technicalFeasibility": 100,
                "useCaseQuality": 80,
            },
            // ... 其他阶段类似
        };

        return thresholds[stage] || {};
    }

    /**
     * 启动产品开发流程
     */
    async start(): Promise<void> {
        this.logger.info("Starting product development flow");

        // 检查项目上下文
        if (!this.projectContext.name || !this.projectContext.startDate) {
            throw new Error("Invalid project context: name and startDate are required");
        }

        // 设置初始阶段状态
        for (const [stageName] of this.stages.keys()) {
            this.artifacts.set(stageName, null);
            this.qualityMetrics.set(stageName, {});
        }

        // 设置第一个阶段为进行中
        const firstStage = Array.from(this.stages.keys())[0];
        await this.updateStageStatus(firstStage, "in-progress");

        this.logger.info(`Flow started. First stage: ${firstStage}`);
    }

    /**
     * 转换到指定阶段
     */
    async transitionTo(stageName: string): Promise<void> {
        this.logger.info(`Transitioning to stage: ${stageName}`);

        // 验证阶段名称
        if (!this.stages.has(stageName)) {
            throw new Error(`Unknown stage: ${stageName}`);
        }

        // 获取当前阶段
        const currentStage = this.getCurrentStage();

        // 检查转换顺序
        if (currentStage && !this.isValidTransition(currentStage, stageName)) {
            throw new Error(`Invalid transition from ${currentStage} to ${stageName}`);
        }

        // 更新当前阶段状态为完成
        if (currentStage) {
            await this.updateStageStatus(currentStage, "completed");
        }

        // 设置新阶段为进行中
        await this.updateStageStatus(stageName, "in-progress");

        // 传递上一个阶段的artifact（如果存在）
        const previousArtifact = this.artifacts.get(stageName);
        this.ctx.set("previousArtifact", previousArtifact);
        this.ctx.set("currentStage", stageName);

        this.logger.info(`Transitioned to ${stageName}. Previous artifact passed.`);
    }

    /**
     * 验证阶段转换是否有效
     */
    private isValidTransition(from: string, to: string): boolean {
        const stageOrder = Array.from(this.stages.keys());
        const fromIndex = stageOrder.indexOf(from);
        const toIndex = stageOrder.indexOf(to);

        // 只能向前转换，不能跳过阶段
        return toIndex > fromIndex && (toIndex - fromIndex <= 2);
    }

    /**
     * 将artifact传递给下一阶段
     */
    async passArtifact(fromStage: string, artifact: any): Promise<void> {
        this.logger.info(`Passing artifact from ${fromStage}`);

        // 验证fromStage是当前阶段
        if (this.getCurrentStage() !== fromStage) {
            throw new Error(`Cannot pass artifact from ${fromStage}: not current stage`);
        }

        // 保存artifact
        this.artifacts.set(fromStage, artifact);
        this.ctx.set("latestArtifact", artifact);

        this.logger.info("Artifact saved and ready for next stage");
    }

    /**
     * 处理阶段失败
     */
    async handleFailure(stageName: string, error: Error): Promise<void> {
        this.logger.error(`Stage ${stageName} failed:`, error.message);

        // 更新阶段状态为失败
        await this.updateStageStatus(stageName, "failed");

        // 记录失败信息
        this.ctx.set(`failure_${stageName}`, {
            error: error.message,
            timestamp: new Date(),
        });

        // 评估失败严重程度
        if (this.failOnCritical && error.name === "CriticalError") {
            // 严重错误，失败整个流程
            this.logger.error("Critical error encountered, failing entire flow");
            throw new Error("Flow failed due to critical error");
        } else {
            // 非严重错误，根据配置决定是否重试或跳过
            const reviewCount = this.getStageReviewCount(stageName);

            if (reviewCount < this.maxReviewAttempts) {
                this.logger.info("Retrying stage after review");
                // 回到当前阶段重试
                await this.updateStageStatus(stageName, "pending");
            } else {
                this.logger.info("Max review attempts reached, skipping stage");
                // 跳过当前阶段，继续下一阶段
                await this.skipStage(stageName);
            }
        }
    }

    /**
     * 跳过当前阶段
     */
    private async skipStage(stageName: string): Promise<void> {
        this.logger.info(`Skipping stage: ${stageName}`);

        await this.updateStageStatus(stageName, "completed");

        // 标记artifact为null
        this.artifacts.set(stageName, null);
    }

    /**
     * 获取当前阶段
     */
    getCurrentStage(): string | null {
        for (const [stageName, status] of Object.entries(this.getStageStatuses())) {
            if (status.status === "in-progress") {
                return stageName;
            }
        }
        return null;
    }

    /**
     * 获取所有阶段状态
     */
    getStageStatuses(): ProgressInfo["stageStatuses"] {
        const statuses: any = {};

        for (const stageName of this.stages.keys()) {
            const status = this.ctx.get(`stage_status_${stageName}`);
            const reviewCount = this.getStageReviewCount(stageName);

            statuses[stageName] = {
                status: status || "pending",
                progress: this.getStageProgress(stageName),
                reviewCount: reviewCount,
            };
        }

        return statuses;
    }

    /**
     * 获取整体进度
     */
    getProgress(): ProgressInfo {
        const stageStatuses = this.getStageStatuses();
        const totalStages = this.stages.size;

        let completedStages = 0;
        for (const status of Object.values(stageStatuses)) {
            if (status.status === "completed") {
                completedStages++;
            }
        }

        const overallProgress = (completedStages / totalStages) * 100;

        return {
            currentStage: this.getCurrentStage(),
            overallProgress,
            stageStatuses,
            qualityMetrics: this.getQualityMetrics(),
        };
    }

    /**
     * 更新阶段状态
     */
    private async updateStageStatus(
        stageName: string,
        status: "pending" | "in-progress" | "completed" | "failed" | "on-hold"
    ): Promise<void> {
        this.ctx.set(`stage_status_${stageName}`, status);
        this.ctx.set(`stage_updated_${stageName}`, new Date());

        // 如果启用自动转换，检查是否应该转换到下一阶段
        if (this.enableAutoTransition && status === "completed") {
            await this.transitionToNextStage(stageName);
        }
    }

    /**
     * 自动转换到下一阶段
     */
    private async transitionToNextStage(currentStage: string): Promise<void> {
        const stageOrder = Array.from(this.stages.keys());
        const currentIndex = stageOrder.indexOf(currentStage);
        const nextIndex = currentIndex + 1;

        if (nextIndex < stageOrder.length) {
            const nextStage = stageOrder[nextIndex];
            this.logger.info(`Auto-transitioning from ${currentStage} to ${nextStage}`);
            await this.transitionTo(nextStage);
        }
    }

    /**
     * 获取阶段进度
     */
    private getStageProgress(stageName: string): number {
        const stageConfig = this.stages.get(stageName);
        if (!stageConfig) {
            return 0;
        }

        // 基于质量指标计算进度
        const metrics = this.qualityMetrics.get(stageName) || {};
        const thresholdKeys = Object.keys(stageConfig.qualityThresholds);

        if (thresholdKeys.length === 0) {
            return 0;
        }

        // 计算满足阈值的项目数
        let metThresholds = 0;
        for (const key of thresholdKeys) {
            const threshold = stageConfig.qualityThresholds[key];
            const actual = metrics[key] || 0;

            if (actual >= threshold) {
                metThresholds++;
            }
        }

        return (metThresholds / thresholdKeys.length) * 100;
    }

    /**
     * 获取阶段校对次数
     */
    private getStageReviewCount(stageName: string): number {
        const reviewCount = this.ctx.get(`review_count_${stageName}`);
        return typeof reviewCount === "number" ? reviewCount : 0;
    }

    /**
     * 获取所有质量指标
     */
    getQualityMetrics(): ProgressInfo["qualityMetrics"] {
        const metrics: any = {};

        for (const [stageName] of this.stages.keys()) {
            const stageMetrics = this.qualityMetrics.get(stageName);
            if (stageMetrics && Object.keys(stageMetrics).length > 0) {
                metrics[stageName] = stageMetrics;
            }
        }

        return metrics;
    }

    /**
     * 记录质量指标
     */
    async recordQualityMetric(stageName: string, metric: string, value: number): Promise<void> {
        if (!this.qualityMetrics.has(stageName)) {
            this.qualityMetrics.set(stageName, {});
        }

        const metrics = this.qualityMetrics.get(stageName);
        metrics[metric] = value;

        this.logger.info(`Quality metric recorded: ${stageName}.${metric} = ${value}`);
    }

    /**
     * 完成流程
     */
    async complete(): Promise<void> {
        const currentStage = this.getCurrentStage();

        if (currentStage) {
            await this.updateStageStatus(currentStage, "completed");
        }

        // 生成流程报告
        await this.generateFlowReport();

        this.logger.info("Product development flow completed successfully");
    }

    /**
     * 生成流程报告
     */
    private async generateFlowReport(): Promise<void> {
        const progress = this.getProgress();

        const report = {
            project: this.projectContext,
            progress: progress,
            stages: this.getStageStatuses(),
            qualityMetrics: progress.qualityMetrics,
            completedAt: new Date(),
        };

        this.fm.writeFile(
            "./flow-report.json",
            JSON.stringify(report, null, 2)
        );

        this.logger.info("Flow report generated: flow-report.json");
    }
}
