/**
 * Progress Tracker - 进度跟踪器
 *
 * 负责跟踪产品开发流程的整体进度，提供可视化的进度报告和预警。
 */

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

  skillComplete(skillName: string, cost: number): void {
    this.info(`Skill complete: ${skillName} (cost: ${cost})`);
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

export interface Milestone {
  name: string;
  targetDate: Date;
  stages: string[];
  completed: boolean;
  completedDate?: Date;
}

export interface StageProgress {
  stage: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'on-hold';
  actualDuration?: number;
  estimatedDuration?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ProgressInfo {
  currentStage: string | null;
  overallProgress: number;
  completedStages: string[];
  inProgressStages: string[];
  milestonesStatus: { [name: string]: 'pending' | 'completed' };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export class ProgressTracker {
  private logger: Logger;
  private ctx: ContextManager;

  constructor(
    private milestones: Milestone[],
    private warningThreshold: number = 80,
    private criticalThreshold: number = 60,
  ) {
    this.logger = new Logger("ProgressTracker");
    this.ctx = new ContextManager();
  }

  /**
   * 获取当前进度
   */
  getProgress(): ProgressInfo {
    const stageProgresses = this.getStageProgresses();
    const completedStages: string[] = [];
    const inProgressStages: string[] = [];

    let overallProgress = 0;
    const totalStages = stageProgresses.length;

    for (const progress of stageProgresses) {
      if (progress.status === 'completed') {
        completedStages.push(progress.stage);
        overallProgress += 100;
      } else if (progress.status === 'in-progress') {
        inProgressStages.push(progress.stage);
        overallProgress += progress.progress;
      }
    }

    const milestonesStatus: { [name: string]: 'pending' | 'completed' } = {};
    for (const milestone of this.milestones) {
      const allCompleted = milestone.stages.every(stage => {
        const stageProgress = stageProgresses.find(p => p.stage === stage);
        return stageProgress?.status === 'completed';
      });
      milestonesStatus[milestone.name] = allCompleted ? 'completed' : 'pending';
    }

    // 计算风险等级
    const riskLevel = this.calculateRiskLevel(stageProgresses);

    // 生成建议
    const recommendations = this.generateRecommendations(stageProgresses);

    return {
      currentStage: this.getCurrentStage(stageProgresses),
      overallProgress: Math.round(overallProgress / totalStages),
      completedStages,
      inProgressStages,
      milestonesStatus,
      riskLevel,
      recommendations,
    };
  }

  /**
   * 获取当前阶段
   */
  private getCurrentStage(progresses: StageProgress[]): string | null {
    for (const progress of progresses) {
      if (progress.status === 'in-progress') {
        return progress.stage;
      }
    }
    return null;
  }

  /**
   * 获取所有阶段的进度
   */
  private getStageProgresses(): StageProgress[] {
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

    return stages.map(stage => this.getStageProgress(stage));
  }

  /**
   * 获取指定阶段的进度
   */
  private getStageProgress(stage: string): StageProgress {
    const progressKey = `stage_progress_${stage}`;
    const progress = this.ctx.get(progressKey);

    if (!progress) {
      return {
        stage,
        progress: 0,
        status: 'pending',
      };
    }

    return progress as StageProgress;
  }

  /**
   * 更新阶段进度
   */
  async updateStageProgress(
    stage: string,
    update: Partial<StageProgress>
  ): Promise<void> {
    this.logger.info(`Updating stage progress: ${stage}`);

    const currentProgress = this.getStageProgress(stage);
    const updatedProgress: StageProgress = {
      ...currentProgress,
      ...update,
    };

    const progressKey = `stage_progress_${stage}`;
    this.ctx.set(progressKey, updatedProgress);
    this.ctx.set(`stage_updated_${stage}`, new Date());

    this.logger.info(`Stage progress updated: ${stage} - ${updatedProgress.progress}%`);
    this.logger.skillComplete("Progress Tracker", 1000);
  }

  /**
   * 计算风险等级
   */
  private calculateRiskLevel(progresses: StageProgress[]): 'low' | 'medium' | 'high' | 'critical' {
    const inProgressStages = progresses.filter(p => p.status === 'in-progress');

    if (inProgressStages.length === 0) {
      return 'low';
    }

    // 检查是否有阶段进度低于临界值
    const lowProgressCount = inProgressStages.filter(
      p => p.progress < this.warningThreshold
    ).length;

    const criticalProgressCount = inProgressStages.filter(
      p => p.progress < this.criticalThreshold
    ).length;

    if (criticalProgressCount > 0) {
      return 'critical';
    } else if (lowProgressCount > 0) {
      return 'high';
    } else {
      return 'medium';
    }
  }

  /**
   * 生成建议
   */
  private generateRecommendations(progresses: StageProgress[]): string[] {
    const recommendations: string[] = [];

    const inProgressStages = progresses.filter(p => p.status === 'in-progress');

    for (const progress of inProgressStages) {
      if (progress.progress < this.criticalThreshold) {
        recommendations.push(`阶段 ${progress.stage} 进度严重滞后（${progress.progress}%），建议立即介入`);
      } else if (progress.progress < this.warningThreshold) {
        recommendations.push(`阶段 ${progress.stage} 进度偏低（${progress.progress}%），建议关注`);
      }
    }

    return recommendations;
  }

  /**
   * 生成进度报告
   */
  async generateReport(format: 'json' | 'markdown' | 'html' = 'markdown'): Promise<string> {
    const progress = this.getProgress();
    const report = {
      project: {
        name: this.ctx.get("project_name"),
        startDate: this.ctx.get("project_start_date"),
        targetEndDate: this.ctx.get("project_target_end_date"),
      },
      progress,
      milestones: this.milestones.map(m => ({
        ...m,
        status: progress.milestonesStatus[m.name],
      })),
      generatedAt: new Date(),
    };

    const reportContent = JSON.stringify(report, null, 2);

    if (format === 'json') {
      return reportContent;
    }

    // 生成Markdown格式
    let markdown = `# 项目进度报告\n\n`;
    markdown += `**项目名称**: ${report.project.name}\n\n`;
    markdown += `**整体进度**: ${progress.overallProgress}%\n\n`;
    markdown += `**当前阶段**: ${progress.currentStage}\n\n`;
    markdown += `**风险等级**: ${progress.riskLevel.toUpperCase()}\n\n`;
    markdown += `## 里程碑状态\n\n`;

    for (const milestone of this.milestones) {
      const status = progress.milestonesStatus[milestone.name];
      const emoji = status === 'completed' ? '✅' : '⏳';
      markdown += `${emoji} ${milestone.name} (${milestone.targetDate.toISOString().split('T')[0]})\n`;
    }

    if (progress.recommendations.length > 0) {
      markdown += `\n## 建议\n\n`;
      for (const rec of progress.recommendations) {
        markdown += `- ${rec}\n`;
      }
    }

    return markdown;
  }
}
