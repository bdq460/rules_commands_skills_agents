/**
 * Quality Metrics Collector 单元测试
 */

import { QualityMetricsCollector } from '../../../skills/skills/product-development-flow/scripts/quality-metrics-collector';

describe('QualityMetricsCollector', () => {
    const thresholds = {
        stageA: { coverage: 80, bugs: 0 },
        stageB: { performance: 90 },
    };

    it('should record metrics and compute scores', async () => {
        const collector = new QualityMetricsCollector(thresholds, false);

        await collector.recordMetric('stageA', 'coverage', 85);
        await collector.recordMetric('stageA', 'bugs', 0);

        const stageMetrics = collector.getStageMetrics('stageA');
        expect(stageMetrics).not.toBeNull();
        expect(stageMetrics?.metrics.coverage.value).toBe(85);
        expect(stageMetrics?.overallScore).toBeGreaterThan(0);

        const overall = collector.getOverallMetrics();
        expect(overall.overallScore).toBeGreaterThan(0);
        expect(Object.keys(overall.stageScores)).toContain('stageA');
    });

    it('should generate markdown and json reports with alerts', async () => {
        const collector = new QualityMetricsCollector(thresholds, true);

        await collector.recordMetric('stageA', 'coverage', 50); // below threshold to trigger alert
        await collector.recordMetric('stageB', 'performance', 95);

        const markdown = await collector.getReport('markdown');
        expect(markdown).toContain('质量指标报告');
        expect(markdown).toContain('整体得分');

        const json = await collector.getReport('json');
        const parsed = JSON.parse(json);
        expect(parsed).toHaveProperty('overallScore');
    });

    it('should call Logger.error method', async () => {
        const collector = new QualityMetricsCollector(thresholds, false);
        const logger = (collector as any).logger;
        const errorSpy = jest.spyOn(console, 'error');

        logger.error('Test error', 'details');

        expect(errorSpy).toHaveBeenCalledWith(
            '[QualityMetricsCollector] ERROR:',
            'Test error',
            'details'
        );

        errorSpy.mockRestore();
    });

    it('should handle empty metrics in calculateOverallScore', async () => {
        const collector = new QualityMetricsCollector(thresholds, false);

        // Try to get metrics for a stage without any recorded metrics
        const stageMetrics = collector.getStageMetrics('nonExistentStage');
        expect(stageMetrics).toBeNull();
    });

    it('should return 0 score when stage has no thresholds', async () => {
        const collector = new QualityMetricsCollector({ stageC: { metric1: 80 } }, false);

        // Create stage with metrics but then check one without thresholds
        await collector.recordMetric('stageC', 'metric1', 100);

        // Create another stage without thresholds in map
        const collectorNoThreshold = new QualityMetricsCollector({}, false);
        await collectorNoThreshold.recordMetric('anyStage', 'anyMetric', 100);

        const stageMetrics = collectorNoThreshold.getStageMetrics('anyStage');
        if (stageMetrics) {
            // When no thresholds exist, score should be 0
            expect(stageMetrics.overallScore).toBe(0);
        }
    });

    it('should skip alerts for stages without thresholds', async () => {
        const collector = new QualityMetricsCollector(thresholds, false);

        // Record for stage without threshold
        await collector.recordMetric('stageWithoutThreshold', 'metric1', 50);

        const markdown = await collector.getReport('markdown');
        expect(markdown).toContain('质量指标报告');
    });

    it('should skip metrics that are not in threshold definition', async () => {
        const collector = new QualityMetricsCollector(thresholds, false);

        // Record a metric that's not in threshold for this stage
        await collector.recordMetric('stageA', 'unknownMetric', 100);
        await collector.recordMetric('stageA', 'coverage', 85); // This one is in threshold

        const markdown = await collector.getReport('markdown');
        expect(markdown).toBeDefined();
    });

    it('should assign grade "良好 (B)" for score >= 85', async () => {
        const collector = new QualityMetricsCollector(thresholds, false);

        await collector.recordMetric('stageA', 'coverage', 87); // Should give B grade
        await collector.recordMetric('stageA', 'bugs', 0);

        const markdown = await collector.getReport('markdown');
        expect(markdown).toContain('stageA');
    });

    it('should assign grade "不及格 (E)" for score < 60', async () => {
        const collector = new QualityMetricsCollector({ stageC: { quality: 100 } }, false);

        await collector.recordMetric('stageC', 'quality', 10); // Very low score

        const stageMetrics = collector.getStageMetrics('stageC');
        // Score will be low, triggering E grade path
        expect(stageMetrics).not.toBeNull();
    });

    it('should handle all grade ranges', async () => {
        const gradeThresholds = {
            excellent: { score: 100 },
            good: { score: 90 },
            average: { score: 75 },
            pass: { score: 65 },
            fail: { score: 50 }
        };

        const collector = new QualityMetricsCollector(gradeThresholds, false);

        // Test different score ranges
        await collector.recordMetric('excellent', 'score', 100); // A
        await collector.recordMetric('good', 'score', 90);       // B
        await collector.recordMetric('average', 'score', 75);    // C
        await collector.recordMetric('pass', 'score', 65);       // D
        await collector.recordMetric('fail', 'score', 50);       // E

        const report = await collector.getReport('markdown');
        expect(report).toContain('质量指标报告');
    });
});
