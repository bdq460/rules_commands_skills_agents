import { Milestone, ProgressTracker } from '../../../skills/skills/product-development-flow/scripts/progress-tracker';

describe('ProgressTracker', () => {
    const milestones: Milestone[] = [
        { name: 'kickoff', targetDate: new Date('2024-01-10'), stages: ['requirements-proposal'], completed: false },
    ];

    it('calculates risk and recommendations for slow stages', async () => {
        const tracker = new ProgressTracker(milestones, 80, 60);
        await tracker.updateStageProgress('requirements-proposal', { stage: 'requirements-proposal', status: 'in-progress', progress: 50 });

        const progress = tracker.getProgress();
        expect(progress.riskLevel).toBe('critical');
        expect(progress.recommendations.length).toBeGreaterThan(0);
    });

    it('marks milestones as completed when stages finish', async () => {
        const tracker = new ProgressTracker(milestones);
        await tracker.updateStageProgress('requirements-proposal', { stage: 'requirements-proposal', status: 'completed', progress: 100 });

        const progress = tracker.getProgress();
        expect(progress.completedStages).toContain('requirements-proposal');
        expect(progress.milestonesStatus['kickoff']).toBe('completed');
    });

    it('returns medium/high risk levels and renders markdown report', async () => {
        const tracker = new ProgressTracker(milestones, 80, 60);
        await tracker.updateStageProgress('requirements-proposal', { stage: 'requirements-proposal', status: 'in-progress', progress: 70 });
        const progressHigh = tracker.getProgress();
        expect(progressHigh.riskLevel).toBe('high');

        // raise progress to move into medium bucket
        await tracker.updateStageProgress('requirements-proposal', { stage: 'requirements-proposal', status: 'in-progress', progress: 90 });
        const progressMedium = tracker.getProgress();
        expect(progressMedium.riskLevel).toBe('medium');

        // set basic project context for report
        (tracker as any).ctx.set('project_name', 'Demo');
        (tracker as any).ctx.set('project_start_date', '2024-01-01');
        (tracker as any).ctx.set('project_target_end_date', '2024-12-31');
        const markdown = await tracker.generateReport('markdown');
        expect(markdown).toContain('# 项目进度报告');
        expect(markdown).toContain('Demo');
    });

    it('generates JSON format report', async () => {
        const tracker = new ProgressTracker(milestones);
        await tracker.updateStageProgress('requirements-proposal', { stage: 'requirements-proposal', status: 'completed', progress: 100 });

        (tracker as any).ctx.set('project_name', 'TestProject');
        (tracker as any).ctx.set('project_start_date', '2024-01-01');
        (tracker as any).ctx.set('project_target_end_date', '2024-12-31');

        const jsonReport = await tracker.generateReport('json');
        expect(jsonReport).toBeDefined();

        const parsed = JSON.parse(jsonReport);
        expect(parsed.project.name).toBe('TestProject');
        expect(parsed.progress).toBeDefined();
        expect(parsed.milestones).toBeDefined();
    });

    it('generates report without recommendations when all stages are on track', async () => {
        const tracker = new ProgressTracker(milestones, 80, 60);
        // All stages completed or not started - no in-progress stages
        await tracker.updateStageProgress('requirements-proposal', { stage: 'requirements-proposal', status: 'completed', progress: 100 });

        (tracker as any).ctx.set('project_name', 'CleanProject');
        (tracker as any).ctx.set('project_start_date', '2024-01-01');
        (tracker as any).ctx.set('project_target_end_date', '2024-12-31');

        const markdown = await tracker.generateReport('markdown');
        expect(markdown).toContain('# 项目进度报告');
        // Should not contain recommendations section when there are no recommendations
        const progress = tracker.getProgress();
        expect(progress.recommendations.length).toBe(0);

        if (progress.recommendations.length === 0) {
            expect(markdown).not.toContain('## 建议');
        }
    });

    it('uses Logger warn and error methods', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Access internal Logger class through tracker instance
        const tracker = new ProgressTracker(milestones);
        const internalLogger = (tracker as any).logger;

        internalLogger.warn('Test warning message');
        expect(consoleWarnSpy).toHaveBeenCalledWith('[ProgressTracker] WARN:', 'Test warning message');

        internalLogger.error('Test error message');
        expect(consoleErrorSpy).toHaveBeenCalledWith('[ProgressTracker] ERROR:', 'Test error message');

        consoleWarnSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('uses ContextManager has method', () => {
        const tracker = new ProgressTracker(milestones);
        const ctx = (tracker as any).ctx;

        // Test has method when key doesn't exist
        expect(ctx.has('nonexistent_key')).toBe(false);

        // Set a value and test has method
        ctx.set('test_key', 'test_value');
        expect(ctx.has('test_key')).toBe(true);

        // Verify get returns the value
        expect(ctx.get('test_key')).toBe('test_value');
    });
});
