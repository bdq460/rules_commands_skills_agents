/**
 * Review Orchestrator - 校对编排器
 *
 * 负责管理各阶段的校对流程，包括自审、交叉审查和最终确认。
 */

class Logger {
    constructor(private name: string) { }
    info(msg: string) { console.log(`[${this.name}] ${msg}`); }
    warn(msg: string) { console.log(`[${this.name}] WARNING: ${msg}`); }
}

class ContextManager {
    private data: Map<string, any> = new Map();
    set(key: string, value: any) { this.data.set(key, value); }
    get(key: string) { return this.data.get(key); }
}

class FileManager { }

export interface ReviewConfig {
    stageName: string;
    reviewer?: string;
    maxAttempts: number;
    autoTransition: boolean;
}

export interface ReviewComment {
    author: string;
    content: string;
    timestamp: Date;
}

export interface ReviewDecision {
    reviewer: string;
    decision: 'pass' | 'fail' | 'needs-revision';
    comments?: string[];
    timestamp: Date;
}

export interface ReviewStatus {
    stage: string;
    attempt: number;
    maxAttempts: number;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    comments: ReviewComment[];
    decision?: ReviewDecision;
}

export class ReviewOrchestrator {
    private logger: Logger;
    private ctx: ContextManager;
    private fm: FileManager;
    private enableAutoTransition: boolean;

    constructor(
        private maxReviewAttempts: number = 3,
        enableAutoTransition: boolean = true,
    ) {
        this.logger = new Logger("ReviewOrchestrator");
        this.ctx = new ContextManager();
        this.fm = new FileManager();
        this.enableAutoTransition = enableAutoTransition;
    }

    /**
     * 触发阶段自审
     */
    async triggerSelfReview(stageName: string): Promise<void> {
        this.logger.info(`Triggering self-review for stage: ${stageName}`);

        const status = this.getReviewStatus(stageName);

        if (status && status.attempt >= status.maxAttempts) {
            this.logger.warn(`Stage ${stageName} has reached max review attempts`);
            return;
        }

        const nextAttempt = status ? status.attempt + 1 : 1;
        // 创建新的审查记录
        const reviewKey = `review_${stageName}_${nextAttempt}`;
        this.ctx.set(reviewKey, {
            status: 'pending',
            attempt: nextAttempt,
            maxAttempts: this.maxReviewAttempts,
            startTime: new Date(),
        });

        // 通知审查者
        this.logger.info(`Self-review initiated for stage: ${stageName}, attempt: ${nextAttempt}`);
    }

    /**
     * 获取审查状态
     */
    getReviewStatus(stageName: string): ReviewStatus | null {
        const reviewKey = `review_status_${stageName}`;
        const status = this.ctx.get(reviewKey);

        if (!status) {
            return null;
        }

        return {
            stage: stageName,
            attempt: status.attempt,
            maxAttempts: status.maxAttempts,
            status: status.status,
            comments: status.comments || [],
            decision: status.decision,
        };
    }

    /**
     * 添加审查评论
     */
    async addComment(stageName: string, comment: string): Promise<void> {
        const reviewKey = `review_status_${stageName}`;
        const status = this.ctx.get(reviewKey);

        if (!status) {
            this.logger.warn(`No active review for stage: ${stageName}`);
            return;
        }

        const newComment: ReviewComment = {
            author: 'system',
            content: comment,
            timestamp: new Date(),
        };

        status.comments.push(newComment);
        this.ctx.set(reviewKey, status);

        this.logger.info(`Comment added to review for stage: ${stageName}`);
    }

    /**
     * 记录审查决策
     */
    async recordDecision(
        stageName: string,
        decision: 'pass' | 'fail' | 'needs-revision',
        reviewer: string,
        comments?: string[]
    ): Promise<void> {
        const reviewKey = `review_status_${stageName}`;
        const status = this.ctx.get(reviewKey);

        if (!status) {
            this.logger.warn(`No active review for stage: ${stageName}`);
            return;
        }

        const newDecision: ReviewDecision = {
            reviewer,
            decision,
            comments,
            timestamp: new Date(),
        };

        status.decision = newDecision;
        status.status = decision === 'pass' ? 'completed' : 'failed';
        this.ctx.set(reviewKey, status);

        this.logger.info(`Review decision recorded for stage: ${stageName}: ${decision} by ${reviewer}`);

        // 如果自动转换且决策通过，自动进入下一阶段
        if (this.enableAutoTransition && decision === 'pass') {
            await this.transitionToNextStage(stageName);
        }
    }

    /**
     * 自动转换到下一阶段
     */
    private async transitionToNextStage(currentStage: string): Promise<void> {
        const stageOrder = [
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

        const currentIndex = stageOrder.indexOf(currentStage);
        if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
            this.logger.warn(`Cannot auto-transition from last stage: ${currentStage}`);
            return;
        }

        const nextStage = stageOrder[currentIndex + 1];
        this.logger.info(`Auto-transitioning from ${currentStage} to ${nextStage}`);

        // 通知下一阶段
        this.ctx.set(`transition_trigger_${nextStage}`, {
            fromStage: currentStage,
            timestamp: new Date(),
        });
    }

    /**
     * 获取所有审查状态
     */
    getAllReviewStatuses(): { [stageName: string]: ReviewStatus } {
        const stages = [
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

        const statuses: any = {};

        for (const stageName of stages) {
            const status = this.getReviewStatus(stageName);
            if (status) {
                statuses[stageName] = status;
            }
        }

        return statuses;
    }
}
