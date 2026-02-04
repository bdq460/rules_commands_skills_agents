/**
 * Feedback Collector - 反馈收集器
 *
 * 负责收集来自各阶段的反馈，包括客户反馈、内部评审反馈和用户反馈。
 */

import * as fs from 'fs';
import * as path from 'path';

class Logger {
    constructor(private name: string) { }
    info(msg: string) { console.log(`[${this.name}] ${msg}`); }
    skillComplete(skill: string, duration: number) { console.log(`[${this.name}] ${skill} completed in ${duration}ms`); }
}

class ContextManager { }

class FileManager {
    async writeFile(filePath: string, content: string): Promise<void> {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, content);
    }
}

export interface Feedback {
    id: string;
    stage: string;
    source: 'customer' | 'internal' | 'user';
    category?: 'feature' | 'bug' | 'performance' | 'ux' | 'doc' | 'other';
    priority?: 'critical' | 'high' | 'medium' | 'low';
    content: string;
    author?: string;
    createdAt: Date;
    resolvedAt?: Date;
    rejectedAt?: Date;
    deferredAt?: Date;
}

export interface FeedbackSummary {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    byCategory: { [key: string]: number };
    byPriority: { [key: string]: number };
    byStage: { [key: string]: number };
}

export class FeedbackCollector {
    private logger: Logger;
    private ctx: ContextManager;
    private fm: FileManager;
    private feedback: Map<string, Feedback[]>;

    constructor(
        private storagePath: string = "./feedback",
        private autoClassify: boolean = true,
    ) {
        this.logger = new Logger("FeedbackCollector");
        this.ctx = new ContextManager();
        this.fm = new FileManager();
        this.feedback = new Map();

        this.initializeStorage();
    }

    /**
     * 初始化存储
     */
    private initializeStorage(): void {
        if (!fs.existsSync(this.storagePath)) {
            fs.mkdirSync(this.storagePath, { recursive: true });
        }

        this.logger.info(`Feedback storage initialized: ${this.storagePath}`);
    }

    /**
     * 收集反馈
     */
    async collect(stage: string, feedbackData: Partial<Feedback>): Promise<string> {
        const feedbackId = `FB_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const feedback: Feedback = {
            id: feedbackId,
            stage,
            source: feedbackData.source || 'customer',
            content: feedbackData.content || '',
            createdAt: new Date(),
            ...feedbackData,
        };

        const stageFeedback = this.feedback.get(stage) || [];
        stageFeedback.push(feedback);
        this.feedback.set(stage, stageFeedback);

        // 保存到文件
        await this.saveFeedback(stage, feedback);

        // 自动分类
        if (this.autoClassify) {
            const category = this.classifyFeedback(feedback);
            feedback.category = category;
            this.logger.info(`Feedback auto-classified as: ${category}`);
        }

        this.logger.info(`Feedback collected: ${feedbackId} for stage: ${stage}`);
        this.logger.skillComplete("Feedback Collector", 500);

        return feedbackId;
    }

    /**
     * 分类反馈
     */
    private classifyFeedback(feedback: Feedback): Feedback['category'] {
        const content = feedback.content.toLowerCase();

        if (content.includes('功能') || content.includes('增加') || content.includes('添加')) {
            return 'feature';
        } else if (content.includes('错误') || content.includes('bug') || content.includes('失败')) {
            return 'bug';
        } else if (content.includes('慢') || content.includes('性能') || content.includes('响应')) {
            return 'performance';
        } else if (content.includes('难用') || content.includes('不直观') || content.includes('操作')) {
            return 'ux';
        } else if (content.includes('文档') || content.includes('说明') || content.includes('帮助')) {
            return 'doc';
        } else {
            return 'other';
        }
    }

    /**
     * 处理反馈
     */
    async processFeedback(feedbackId: string, action: 'resolve' | 'reject' | 'defer'): Promise<void> {
        this.logger.info(`Processing feedback: ${feedbackId} with action: ${action}`);

        // 查找反馈
        const feedback = this.findFeedback(feedbackId);
        if (!feedback) {
            throw new Error(`Feedback not found: ${feedbackId}`);
        }

        // 更新状态
        const stageFeedback = this.feedback.get(feedback.stage);
        if (!stageFeedback) {
            throw new Error(`No feedbacks found for stage: ${feedback.stage}`);
        }
        const feedbackIndex = stageFeedback.findIndex(f => f.id === feedbackId);

        if (feedbackIndex === -1) {
            throw new Error(`Feedback not found in stage: ${feedback.stage}`);
        }

        // 更新状态
        if (action === 'resolve') {
            stageFeedback[feedbackIndex].resolvedAt = new Date();
        } else if (action === 'reject') {
            stageFeedback[feedbackIndex].rejectedAt = new Date();
        } else if (action === 'defer') {
            stageFeedback[feedbackIndex].deferredAt = new Date();
        }

        this.logger.info(`Feedback ${feedbackId} processed: ${action}`);
        this.logger.skillComplete("Feedback Collector", 1000);
    }

    /**
     * 查找反馈
     */
    private findFeedback(feedbackId: string): Feedback | null {
        for (const [stage, feedbacks] of this.feedback.entries()) {
            const found = feedbacks.find(f => f.id === feedbackId);
            if (found) {
                return found;
            }
        }
        return null;
    }

    /**
     * 保存反馈
     */
    private async saveFeedback(stage: string, feedback: Feedback): Promise<void> {
        const stageDir = `${this.storagePath}/${stage}`;
        if (!fs.existsSync(stageDir)) {
            fs.mkdirSync(stageDir, { recursive: true });
        }

        const feedbackFile = `${stageDir}/${feedback.id}.json`;
        fs.writeFileSync(feedbackFile, JSON.stringify(feedback, null, 2));

        this.logger.info(`Feedback saved: ${feedbackFile}`);
    }

    /**
     * 获取反馈汇总
     */
    getSummary(): FeedbackSummary {
        let total = 0;
        let pending = 0;
        let processing = 0;
        let completed = 0;

        const byCategory: { [key: string]: number } = {
            feature: 0,
            bug: 0,
            performance: 0,
            ux: 0,
            doc: 0,
            other: 0,
        };

        const byPriority: { [key: string]: number } = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
        };

        const byStage: { [key: string]: number } = {};

        for (const [stage, feedbacks] of this.feedback.entries()) {
            for (const f of feedbacks) {
                total++;

                if (f.category) {
                    byCategory[f.category]++;
                }

                if (f.priority) {
                    byPriority[f.priority]++;
                }

                byStage[stage] = (byStage[stage] || 0) + 1;
            }
        }

        return {
            total,
            pending,
            processing,
            completed,
            byCategory,
            byPriority,
            byStage,
        };
    }

    /**
     * 获取指定阶段的反馈
     */
    getFeedbackByStage(stage: string): Feedback[] {
        return this.feedback.get(stage) || [];
    }

    /**
     * 获取未处理的反馈
     */
    getPendingFeedback(): Feedback[] {
        const pending: Feedback[] = [];

        for (const [stage, feedbacks] of this.feedback.entries()) {
            for (const f of feedbacks) {
                if (!f.resolvedAt && !f.rejectedAt && !f.deferredAt) {
                    pending.push(f);
                }
            }
        }

        return pending;
    }

    /**
     * 导出反馈数据
     */
    async exportData(format: 'json' | 'csv' = 'json'): Promise<void> {
        const summary = this.getSummary();

        if (format === 'json') {
            await this.fm.writeFile(
                `${this.storagePath}/feedback-summary.json`,
                JSON.stringify(summary, null, 2)
            );
        } else if (format === 'csv') {
            const header = 'id,stage,source,category,priority,content,author,createdAt,resolvedAt\n';
            const rows = [];
            for (const [stage, feedbacks] of this.feedback.entries()) {
                for (const f of feedbacks) {
                    const row = [
                        f.id,
                        f.stage,
                        f.source,
                        f.category || '',
                        f.priority || '',
                        f.content,
                        f.author || '',
                        f.createdAt.toISOString(),
                        f.resolvedAt?.toISOString() || '',
                    ].join(',');
                    rows.push(row);
                }
            }
            await this.fm.writeFile(
                `${this.storagePath}/feedback-summary.csv`,
                [header, ...rows].join('\n')
            );
        }

        this.logger.info(`Feedback data exported: ${format}`);
        this.logger.skillComplete("Feedback Collector", 2000);
    }
}
