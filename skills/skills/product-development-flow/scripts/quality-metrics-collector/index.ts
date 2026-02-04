/**
 * Quality Metrics Collector - 质量指标收集器
 *
 * 负责收集和统计各阶段的质量指标，用于评估项目质量。
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

export interface MetricConfig {
  stage: string;
  metric: string;
  threshold: number;
}

export interface MetricValue {
  stage: string;
  metric: string;
  value: number;
  threshold: number;
  passed: boolean;
  timestamp: Date;
}

export interface StageMetrics {
  stage: string;
  metrics: { [metric: string]: MetricValue };
  overallScore: number;
}

export class QualityMetricsCollector {
  private logger: Logger;
  private metrics: Map<string, StageMetrics>;
  private thresholdMap: Map<string, { [key: string]: number }>;

  constructor(
    private thresholds: { [stage: string]: { [key: string]: number } },
    private enableAlerts: boolean = true
  ) {
    this.logger = new Logger("QualityMetricsCollector");
    this.metrics = new Map();
    this.thresholdMap = new Map();

    this.initializeThresholds();
    this.logger.info("QualityMetricsCollector initialized");
  }

  /**
   * 初始化阈值
   */
  private initializeThresholds(): void {
    if (this.thresholds && Object.keys(this.thresholds).length > 0) {
      for (const [stage, stageThresholds] of Object.entries(this.thresholds)) {
        this.thresholdMap.set(stage, stageThresholds);
      }
    }

    this.logger.info("Thresholds initialized");
  }

  /**
   * 记录质量指标
   */
  async recordMetric(stage: string, metric: string, value: number): Promise<void> {
    const thresholds = this.thresholdMap.get(stage);

    if (!thresholds || !thresholds[metric]) {
      this.logger.warn(`No threshold defined for ${stage}.${metric}`);
      return;
    }

    const threshold = thresholds[metric];
    const passed = value >= threshold;
    const metricValue: MetricValue = {
      stage,
      metric,
      value,
      threshold,
      passed,
      timestamp: new Date(),
    };

    const stageMetrics = this.metrics.get(stage) || {
      stage,
      metrics: {},
      overallScore: 0,
    };

    stageMetrics.metrics[metric] = metricValue;
    stageMetrics.overallScore = this.calculateOverallScore(stageMetrics);

    this.metrics.set(stage, stageMetrics);

    // 检查是否需要告警
    if (this.enableAlerts && !passed) {
      this.logger.warn(`Quality alert: ${stage}.${metric} = ${value} < ${threshold}`);
    }

    this.logger.info(`Metric recorded: ${stage}.${metric} = ${value}`);
    this.logger.skillComplete("Quality Metrics Collector", 500);
  }

  /**
   * 获取阶段指标
   */
  getStageMetrics(stage: string): StageMetrics | null {
    return this.metrics.get(stage) || null;
  }

  /**
   * 获取整体指标
   */
  getOverallMetrics(): { overallScore: number; stageScores: { [stage: string]: number } } {
    const stageScores: { [stage: string]: number } = {};
    let totalScore = 0;
    let stageCount = 0;

    for (const [stage, metrics] of this.metrics.entries()) {
      stageScores[stage] = metrics.overallScore;
      totalScore += metrics.overallScore;
      stageCount++;
    }

    const overallScore = stageCount > 0 ? totalScore / stageCount : 0;

    return { overallScore, stageScores };
  }

  /**
   * 计算阶段整体得分
   */
  private calculateOverallScore(stageMetrics: StageMetrics): number {
    if (!stageMetrics || Object.keys(stageMetrics.metrics).length === 0) {
      return 0;
    }

    const thresholds = this.thresholdMap.get(stageMetrics.stage);
    if (!thresholds) {
      return 0;
    }

    let totalScore = 0;
    let totalThreshold = 0;

    for (const metric of Object.values(stageMetrics.metrics)) {
      const threshold = thresholds[metric.metric] || 100;
      totalScore += metric.value;
      totalThreshold += threshold;
    }

    return totalThreshold > 0 ? (totalScore / totalThreshold) * 100 : 0;
  }

  /**
   * 检查阈值
   */
  async checkThresholds(): Promise<{ hasAlerts: boolean; alerts: any[] }> {
    const alerts: any[] = [];
    let hasAlerts = false;

    for (const [stage, metrics] of this.metrics.entries()) {
      const thresholds = this.thresholdMap.get(stage);
      if (!thresholds) {
        continue;
      }

      for (const metric of Object.values(metrics.metrics)) {
        if (!thresholds[metric.metric]) {
          continue;
        }

        if (!metric.passed) {
          hasAlerts = true;
          alerts.push({
            stage,
            metric: metric.metric,
            value: metric.value,
            threshold: thresholds[metric.metric],
          });
        }
      }
    }

    return { hasAlerts, alerts };
  }

  /**
   * 生成报告
   */
  async getReport(format: 'json' | 'markdown' | 'html' = 'markdown'): Promise<string> {
    const overallMetrics = this.getOverallMetrics();

    if (format === 'json') {
      const report = {
        overallScore: overallMetrics.overallScore,
        stageScores: overallMetrics.stageScores,
        generatedAt: new Date(),
      };
      return JSON.stringify(report, null, 2);
    }

    let markdown = `# 质量指标报告\n\n`;
    markdown += `**生成时间**: ${new Date().toISOString()}\n\n`;
    markdown += `## 整体质量评分\n\n`;
    markdown += `**整体得分**: ${overallMetrics.overallScore.toFixed(2)}/100\n\n`;
    markdown += `**评级**: ${this.getGrade(overallMetrics.overallScore)}\n\n`;
    markdown += `## 各阶段得分\n\n`;

    for (const [stage, score] of Object.entries(overallMetrics.stageScores)) {
      markdown += `### ${stage}\n\n`;
      markdown += `- **得分**: ${score.toFixed(2)}/100\n`;
      markdown += `- **评级**: ${this.getGrade(score)}\n\n`;
    }

    const { alerts } = await this.checkThresholds();
    if (alerts && alerts.length > 0) {
      markdown += `\n## 告警\n\n`;
      for (const alert of alerts) {
        markdown += `### ${alert.stage}.${alert.metric}\n\n`;
        markdown += `- **当前值**: ${alert.value}\n`;
        markdown += `- **阈值**: ${alert.threshold}\n`;
        markdown += `- **状态**: ${alert.passed ? '✅ 达标' : '❌ 未达标'}\n\n`;
      }
    }

    return markdown;
  }

  /**
   * 获取等级
   */
  private getGrade(score: number): string {
    if (score >= 95) {
      return '优秀 (A)';
    } else if (score >= 85) {
      return '良好 (B)';
    } else if (score >= 70) {
      return '中等 (C)';
    } else if (score >= 60) {
      return '及格 (D)';
    } else {
      return '不及格 (E)';
    }
  }
}
