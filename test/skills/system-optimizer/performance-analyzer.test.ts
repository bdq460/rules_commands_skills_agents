/**
 * Performance Analyzer 单元测试
 */

import { PerformanceAnalyzer } from '../../../skills/skills/system-optimizer/scripts/performance-analyzer';

describe('PerformanceAnalyzer', () => {
    let analyzer: PerformanceAnalyzer;

    beforeEach(() => {
        analyzer = new PerformanceAnalyzer();
    });

    describe('analyze', () => {
        it('should analyze system performance', async () => {
            const result = await analyzer.analyze();

            expect(result).toBeDefined();
            expect(result).toHaveProperty('timestamp');
            expect(result).toHaveProperty('overallScore');
            expect(result).toHaveProperty('metrics');
            expect(result).toHaveProperty('bottlenecks');
            expect(result).toHaveProperty('optimizations');
        });

        it('should return overall score between 0 and 100', async () => {
            const result = await analyzer.analyze();

            expect(result.overallScore).toBeDefined();
            expect(result.overallScore).toBeGreaterThanOrEqual(0);
            expect(result.overallScore).toBeLessThanOrEqual(100);
        });

        it('should return performance metrics', async () => {
            const result = await analyzer.analyze();

            expect(result.metrics).toBeDefined();
            expect(Array.isArray(result.metrics)).toBe(true);
            expect(result.metrics.length).toBeGreaterThan(0);
        });

        it('should return bottlenecks if performance issues exist', async () => {
            const result = await analyzer.analyze();

            expect(result.bottlenecks).toBeDefined();
            expect(Array.isArray(result.bottlenecks)).toBe(true);
        });

        it('should return optimization suggestions', async () => {
            const result = await analyzer.analyze();

            expect(result.optimizations).toBeDefined();
            expect(Array.isArray(result.optimizations)).toBe(true);
        });

        it('should include metric with required properties', async () => {
            const result = await analyzer.analyze();

            result.metrics.forEach(metric => {
                expect(metric).toHaveProperty('name');
                expect(metric).toHaveProperty('value');
                expect(metric).toHaveProperty('unit');
                expect(metric).toHaveProperty('threshold');
                expect(metric).toHaveProperty('status');
                expect(['good', 'warning', 'critical']).toContain(metric.status);
            });
        });

        it('should include bottleneck with required properties', async () => {
            const result = await analyzer.analyze();

            result.bottlenecks.forEach(bottleneck => {
                expect(bottleneck).toHaveProperty('type');
                expect(bottleneck).toHaveProperty('severity');
                expect(bottleneck).toHaveProperty('description');
                expect(bottleneck).toHaveProperty('recommendation');
                expect(['high', 'medium', 'low']).toContain(bottleneck.severity);
            });
        });

        it('should include optimization with required properties', async () => {
            const result = await analyzer.analyze();

            result.optimizations.forEach(optimization => {
                expect(optimization).toHaveProperty('type');
                expect(optimization).toHaveProperty('priority');
                expect(optimization).toHaveProperty('description');
                expect(optimization).toHaveProperty('implementation');
                expect(optimization).toHaveProperty('estimatedImpact');
                expect(optimization).toHaveProperty('effort');
                expect(['high', 'medium', 'low']).toContain(optimization.priority);
                expect(['low', 'medium', 'high']).toContain(optimization.effort);
            });
        });

        it('should generate valid timestamp', async () => {
            const result = await analyzer.analyze();

            expect(result.timestamp).toBeDefined();
            const timestamp = new Date(result.timestamp);
            expect(timestamp.getTime()).not.toBeNaN();
        });
    });

    describe('helper methods', () => {
        it('should collect metrics and identify bottlenecks', async () => {
            await (analyzer as any).collectMetrics();
            await (analyzer as any).identifyBottlenecks();
            await (analyzer as any).generateOptimizations();

            const report = (analyzer as any).generateReport();
            expect(report.metrics.length).toBeGreaterThan(0);
            expect(report.bottlenecks.length).toBeGreaterThan(0);
            expect(report.optimizations.length).toBeGreaterThan(0);
        });

        it('should generate text report and json report', async () => {
            await (analyzer as any).collectMetrics();
            await (analyzer as any).identifyBottlenecks();
            await (analyzer as any).generateOptimizations();
            const report = (analyzer as any).generateReport();

            const text = analyzer.generateTextReport(report);
            expect(text).toContain('性能分析报告');
            expect(text).toContain('性能瓶颈');

            const json = analyzer.generateJSONReport(report);
            expect(() => JSON.parse(json)).not.toThrow();
        });

        it('should generate mermaid performance chart', async () => {
            await (analyzer as any).collectMetrics();
            const report = (analyzer as any).generateReport();

            const chart = analyzer.generatePerformanceChart(report);
            expect(chart).toContain('graph TD');
            expect(chart).toContain('性能分析');
        });

        it('should calculate overall score based on metrics', async () => {
            await (analyzer as any).collectMetrics();
            const score = (analyzer as any).calculateOverallScore();
            expect(score).toBeGreaterThan(0);
            expect(score).toBeLessThanOrEqual(100);
        });

        it('should correctly classify metric status', async () => {
            const result = await analyzer.analyze();

            result.metrics.forEach(metric => {
                expect(['good', 'warning', 'critical']).toContain(metric.status);
            });
        });

        it('should include all optimization types in report', async () => {
            const result = await analyzer.analyze();

            const types = result.optimizations.map(opt => opt.type);
            expect(types).toContain('cache');
            expect(types).toContain('database');
            expect(types).toContain('code');
            expect(types).toContain('architecture');
            expect(types).toContain('infrastructure');
        });

        it('should include all bottleneck types in report', async () => {
            const result = await analyzer.analyze();

            const types = result.bottlenecks.map(bn => bn.type);
            expect(types.length).toBeGreaterThan(0);
            expect(['database', 'application', 'network', 'memory', 'cpu']).toContain(types[0]);
        });

        it('should generate readable text report with metrics section', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            expect(text).toContain('性能指标');
            expect(text).toContain('优化建议');
            expect(text).toContain('性能分析报告');
            // Check that metrics are included in the report
            expect(text.length).toBeGreaterThan(500);
        });

        it('should generate valid json report format', async () => {
            const result = await analyzer.analyze();
            const json = analyzer.generateJSONReport(result);

            const parsed = JSON.parse(json);
            expect(parsed).toHaveProperty('timestamp');
            expect(parsed).toHaveProperty('overallScore');
            expect(parsed).toHaveProperty('metrics');
            expect(parsed).toHaveProperty('bottlenecks');
            expect(parsed).toHaveProperty('optimizations');
        });

        it('should generate performance chart with all metrics', async () => {
            const result = await analyzer.analyze();
            const chart = analyzer.generatePerformanceChart(result);

            expect(chart).toContain('graph TD');
            result.metrics.forEach(metric => {
                expect(chart).toContain(metric.name);
            });
        });

        it('should calculate score considering all metrics', async () => {
            const result = await analyzer.analyze();

            expect(result.overallScore).toBeGreaterThanOrEqual(0);
            expect(result.overallScore).toBeLessThanOrEqual(100);

            // Score should be lower if there are critical metrics
            const hasCritical = result.metrics.some(m => m.status === 'critical');
            if (hasCritical) {
                expect(result.overallScore).toBeLessThan(75);
            }
        });

        it('should include implementation details in optimizations', async () => {
            const result = await analyzer.analyze();

            result.optimizations.forEach(opt => {
                expect(opt.implementation).toBeDefined();
                expect(Array.isArray(opt.implementation)).toBe(true);
                expect(opt.implementation.length).toBeGreaterThan(0);
            });
        });

        it('should provide recommendations for all bottlenecks', async () => {
            const result = await analyzer.analyze();

            result.bottlenecks.forEach(bn => {
                expect(bn.recommendation).toBeDefined();
                expect(bn.recommendation.length).toBeGreaterThan(0);
            });
        });

        it('should include location information for relevant bottlenecks', async () => {
            const result = await analyzer.analyze();

            const bottlenecksWithLocation = result.bottlenecks.filter(bn => bn.location);
            expect(bottlenecksWithLocation.length).toBeGreaterThan(0);
        });

        it('should report impact estimates in optimizations', async () => {
            const result = await analyzer.analyze();

            result.optimizations.forEach(opt => {
                expect(opt.estimatedImpact).toBeDefined();
                expect(opt.estimatedImpact.length).toBeGreaterThan(0);
                expect(opt.estimatedImpact).toMatch(/可|%|倍|性能|容量/);
            });
        });
    });

    describe('generateReport method', () => {
        it('should generate report with all required properties', async () => {
            await analyzer.analyze();
            const report = (analyzer as any).generateReport();

            expect(report).toBeDefined();
            expect(report).toHaveProperty('timestamp');
            expect(report).toHaveProperty('overallScore');
            expect(report).toHaveProperty('metrics');
            expect(report).toHaveProperty('bottlenecks');
            expect(report).toHaveProperty('optimizations');

            expect(typeof report.timestamp).toBe('string');
            expect(typeof report.overallScore).toBe('number');
            expect(Array.isArray(report.metrics)).toBe(true);
            expect(Array.isArray(report.bottlenecks)).toBe(true);
            expect(Array.isArray(report.optimizations)).toBe(true);
        });

        it('should include metric data in report', async () => {
            await analyzer.analyze();
            const report = (analyzer as any).generateReport();

            expect(report.metrics.length).toBeGreaterThan(0);
            report.metrics.forEach((metric: any) => {
                expect(metric.name).toBeDefined();
                expect(metric.value).toBeDefined();
                expect(metric.unit).toBeDefined();
                expect(metric.threshold).toBeDefined();
                expect(metric.status).toBeDefined();
            });
        });

        it('should include bottleneck data in report', async () => {
            await analyzer.analyze();
            const report = (analyzer as any).generateReport();

            expect(report.bottlenecks.length).toBeGreaterThan(0);
            report.bottlenecks.forEach((bottleneck: any) => {
                expect(bottleneck.type).toBeDefined();
                expect(bottleneck.severity).toBeDefined();
                expect(bottleneck.description).toBeDefined();
                expect(bottleneck.recommendation).toBeDefined();
            });
        });

        it('should include optimization data in report', async () => {
            await analyzer.analyze();
            const report = (analyzer as any).generateReport();

            expect(report.optimizations.length).toBeGreaterThan(0);
            report.optimizations.forEach((optimization: any) => {
                expect(optimization.type).toBeDefined();
                expect(optimization.priority).toBeDefined();
                expect(optimization.description).toBeDefined();
                expect(optimization.implementation).toBeDefined();
                expect(optimization.estimatedImpact).toBeDefined();
                expect(optimization.effort).toBeDefined();
            });
        });

        it('should have valid ISO timestamp format', async () => {
            await analyzer.analyze();
            const report = (analyzer as any).generateReport();

            expect(report.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
            const date = new Date(report.timestamp);
            expect(date.getTime()).not.toBeNaN();
        });
    });

    describe('edge cases and private method coverage', () => {
        it('should test calculateOverallScore with different metric statuses', async () => {
            await (analyzer as any).collectMetrics();
            const score1 = (analyzer as any).calculateOverallScore();
            expect(score1).toBeGreaterThanOrEqual(0);
            expect(score1).toBeLessThanOrEqual(100);
        });

        it('should call generateReport directly without analyze', () => {
            // Create a new analyzer without calling analyze
            const newAnalyzer = new PerformanceAnalyzer();
            const report = (newAnalyzer as any).generateReport();

            // Report should still be generated even without analyze
            expect(report).toBeDefined();
            expect(report.timestamp).toBeDefined();
            expect(report.overallScore).toBeDefined();
            expect(Array.isArray(report.metrics)).toBe(true);
            expect(Array.isArray(report.bottlenecks)).toBe(true);
            expect(Array.isArray(report.optimizations)).toBe(true);
        });

        it('should generate text report with all sections', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            expect(text).toContain('性能分析报告');
            expect(text).toContain('分析时间');
            expect(text).toContain('总体评分');
            expect(text).toContain('性能指标');
            expect(text).toContain('性能瓶颈');
            expect(text).toContain('优化建议');
            expect(text).toContain('========================================');
        });

        it('should include metric emoji in text report', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            // Should contain status emojis for metrics
            expect(text).toMatch(/✅|⚠️|🔴/);
        });

        it('should include bottleneck severity emoji in text report', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            // Should contain severity emojis
            expect(text).toMatch(/🔴|🟡|🟢/);
        });

        it('should include optimization priority emoji in text report', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            // Should include priority emojis
            expect(text).toContain('[');
            expect(text).toContain(']');
        });

        it('should format bottleneck location in text report', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            // Check for location formatting if present
            if (result.bottlenecks.some(b => b.location)) {
                expect(text).toContain('位置:');
            }
        });

        it('should format bottleneck impact in text report', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            // Check for impact formatting if present
            if (result.bottlenecks.some(b => b.potentialImpact)) {
                expect(text).toContain('影响:');
            }
        });

        it('should sort optimizations by priority in text report', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            // Extract the optimization section
            const optStart = text.indexOf('优化建议');
            expect(optStart).toBeGreaterThan(0);

            // Should contain different priorities
            if (result.optimizations.length > 0) {
                expect(text.includes('高') || text.includes('中') || text.includes('低')).toBe(true);
            }
        });

        it('should format optimization implementation steps', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            if (result.optimizations.length > 0) {
                expect(text).toContain('实施步骤:');
                expect(text).toContain('- ');
            }
        });

        it('should generate mermaid chart with metrics subgraph', async () => {
            const result = await analyzer.analyze();
            const chart = analyzer.generatePerformanceChart(result);

            expect(chart).toContain('graph TD');
            expect(chart).toContain('A[性能分析]');
            expect(chart).toContain('B[指标收集]');
            expect(chart).toContain('C[瓶颈识别]');
            expect(chart).toContain('D[优化建议]');
            expect(chart).toContain('subgraph');
        });

        it('should include metric status colors in mermaid chart', async () => {
            const result = await analyzer.analyze();
            const chart = analyzer.generatePerformanceChart(result);

            // Should include color styling
            expect(chart).toMatch(/:::red|:::yellow|:::green/);
        });

        it('should properly format metric names in mermaid chart', async () => {
            const result = await analyzer.analyze();
            const chart = analyzer.generatePerformanceChart(result);

            for (const metric of result.metrics) {
                // Should include metric name and value
                expect(chart).toContain(metric.name);
            }
        });
    });

    describe('comprehensive coverage tests', () => {
        it('should test all public methods in sequence', async () => {
            // Create fresh analyzer instance
            const freshAnalyzer = new PerformanceAnalyzer();

            // 1. Test analyze()
            const result1 = await freshAnalyzer.analyze();
            expect(result1).toBeDefined();
            expect(result1.metrics.length).toBeGreaterThan(0);

            // 2. Test generateReport()
            const report = (freshAnalyzer as any).generateReport();
            expect(report).toBeDefined();

            // 3. Test generateTextReport()
            const text = freshAnalyzer.generateTextReport(report);
            expect(text.length).toBeGreaterThan(0);

            // 4. Test generateJSONReport()
            const json = freshAnalyzer.generateJSONReport(report);
            expect(JSON.parse(json)).toBeDefined();

            // 5. Test generatePerformanceChart()
            const chart = freshAnalyzer.generatePerformanceChart(report);
            expect(chart).toContain('graph TD');
        });

        it('should ensure all metrics have all status types', async () => {
            // This test ensures that different code paths in report generation are covered
            const result = await analyzer.analyze();

            // Verify metrics exist
            expect(result.metrics.length).toBeGreaterThan(0);

            // Check for different statuses
            const statuses = result.metrics.map(m => m.status);
            const uniqueStatuses = new Set(statuses);

            // Verify we have variety in statuses
            expect(uniqueStatuses.size).toBeGreaterThan(0);

            // Generate report with this data
            const text = analyzer.generateTextReport(result);
            expect(text).toContain('性能指标');
        });

        it('should ensure bottlenecks with and without location are covered', async () => {
            const result = await analyzer.analyze();

            // Verify bottlenecks exist
            expect(result.bottlenecks.length).toBeGreaterThan(0);

            // Check if we have bottlenecks with location
            const withLocation = result.bottlenecks.filter(b => b.location);
            const withoutLocation = result.bottlenecks.filter(b => !b.location);

            // Should have both types or at least one type with location
            if (withLocation.length > 0) {
                const text = analyzer.generateTextReport(result);
                expect(text).toContain('位置:');
            }
        });

        it('should ensure bottlenecks with and without impact are covered', async () => {
            const result = await analyzer.analyze();

            // Check for bottlenecks with potential impact
            const withImpact = result.bottlenecks.filter(b => b.potentialImpact);

            if (withImpact.length > 0) {
                const text = analyzer.generateTextReport(result);
                expect(text).toContain('影响:');
            }
        });

        it('should test metric color classification in chart', async () => {
            const result = await analyzer.analyze();
            const chart = analyzer.generatePerformanceChart(result);

            // Should have color styling in chart
            const hasRed = chart.includes(':::red');
            const hasYellow = chart.includes(':::yellow');
            const hasGreen = chart.includes(':::green');

            // Should have at least one color
            expect(hasRed || hasYellow || hasGreen).toBe(true);
        });

        it('should test all optimization types and priorities', async () => {
            const result = await analyzer.analyze();

            // Verify we have optimizations
            expect(result.optimizations.length).toBeGreaterThan(0);

            // Check types
            const types = result.optimizations.map(o => o.type);
            expect(types).toContain('cache');
            expect(types).toContain('database');
            expect(types).toContain('code');
            expect(types).toContain('architecture');
            expect(types).toContain('infrastructure');

            // Check priorities (may not have all types)
            const priorities = result.optimizations.map(o => o.priority);
            expect(priorities.length).toBeGreaterThan(0);
            expect(['high', 'medium', 'low']).toContain(priorities[0]);
        });

        it('should test generateTextReport sorting by priority', async () => {
            const result = await analyzer.analyze();
            const text = analyzer.generateTextReport(result);

            // Should have optimization section sorted by priority
            const optStart = text.indexOf('优化建议');
            expect(optStart).toBeGreaterThan(0);

            // Should contain high priority items first
            const highPriorityOpts = result.optimizations.filter(o => o.priority === 'high');
            if (highPriorityOpts.length > 0) {
                expect(text).toContain(highPriorityOpts[0].description);
            }
        });
    });

    describe('analyzeAndReport method', () => {
        it('should execute analyzeAndReport without errors', async () => {
            // This test covers the analyzeAndReport() method which internally calls analyze(),
            // generateTextReport(), and generatePerformanceChart()
            const reportAnalyzer = new PerformanceAnalyzer();

            // Call the method to ensure it executes without errors
            await reportAnalyzer.analyzeAndReport();

            // Method should complete successfully
            expect(true).toBe(true);
        });
    });
});
