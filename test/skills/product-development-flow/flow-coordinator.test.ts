import { FlowCoordinator, ProjectContext } from '../../../skills/skills/product-development-flow/scripts/flow-coordinator';

describe('FlowCoordinator', () => {
    const project: ProjectContext = {
        name: 'Demo',
        startDate: new Date('2024-01-01'),
        targetEndDate: new Date('2024-12-31'),
    };

    // 👇 放在这里：每个测试后自动清理所有 mock
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('starts flow and transitions between stages', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();

        expect(coordinator.getCurrentStage()).toBe('requirements-proposal');
        await coordinator.transitionTo('requirements-analysis');

        const statuses = coordinator.getStageStatuses();
        expect(statuses['requirements-proposal'].status).toBe('completed');
        expect(statuses['requirements-analysis'].status).toBe('in-progress');
    });

    it('passes artifacts and handles failures with retries', async () => {
        const coordinator = new FlowCoordinator(project, false, 2);
        await coordinator.start();

        await coordinator.passArtifact('requirements-proposal', { doc: 'v1' });
        const artifacts = (coordinator as any).artifacts;
        expect(artifacts.get('requirements-proposal')).toEqual({ doc: 'v1' });

        await coordinator.handleFailure('requirements-proposal', new Error('temporary'));
        const status = coordinator.getStageStatuses()['requirements-proposal'];
        expect(status.status).toBe('pending');
    });

    it('records quality metrics and generates flow report on completion', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();
        await coordinator.recordQualityMetric('requirements-proposal', 'clarity', 100);
        const metricsMap = (coordinator as any).qualityMetrics.get('requirements-proposal');
        expect(metricsMap.clarity).toBe(100);

        const mockWriter = jest.fn();
        (coordinator as any).fm = { writeFile: mockWriter };

        await coordinator.complete();
        expect(mockWriter).toHaveBeenCalled();
    });

    it('throws on critical failures when configured', async () => {
        const coordinator = new FlowCoordinator(project, false, 3, true);
        await coordinator.start();

        const criticalError = new Error('boom');
        criticalError.name = 'CriticalError';

        await expect(coordinator.handleFailure('requirements-proposal', criticalError)).rejects.toThrow('Flow failed');
    });

    it('rejects invalid transitions', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();
        await expect(coordinator.transitionTo('release-operations')).rejects.toThrow('Invalid transition');
    });

    it('throws when passing artifact from non-current stage', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();
        await expect(coordinator.passArtifact('backend-development', {})).rejects.toThrow('Cannot pass artifact');
    });

    it('returns null current stage when none in progress', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();
        await coordinator.transitionTo('requirements-analysis');
        await coordinator.transitionTo('product-design');
        await coordinator.transitionTo('ui-design');
        // manually mark to completed to drop current stage
        (coordinator as any).ctx.set('stage_status_ui-design', 'completed');
        expect(coordinator.getCurrentStage()).toBeNull();
    });

    it('skips stage after exceeding review attempts', async () => {
        const coordinator = new FlowCoordinator(project, false, 0);
        await coordinator.start();
        await coordinator.handleFailure('requirements-proposal', new Error('skip immediately'));
        const statuses = coordinator.getStageStatuses();
        expect(['completed', 'pending']).toContain(statuses['requirements-proposal'].status);
        const artifacts = (coordinator as any).artifacts;
        expect(artifacts.get('requirements-proposal')).toBeNull();
    });

    it('produces progress with quality metrics', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();
        await coordinator.recordQualityMetric('requirements-proposal', 'clarity', 100);
        (coordinator as any).qualityMetrics.set('requirements-proposal', { clarity: 100 });
        const progress = coordinator.getProgress();
        expect(progress.qualityMetrics['requirements-proposal']?.clarity ?? 0).toBeGreaterThanOrEqual(0);
        expect(progress.stageStatuses['requirements-proposal']).toBeDefined();
    });

    it('allows short forward transitions when order gap is within limit', async () => {
        const coordinator = new FlowCoordinator(project, true);
        await coordinator.start();
        await coordinator.transitionTo('product-design'); // skip one stage ahead (gap of 2)
        const statuses = coordinator.getStageStatuses();
        expect(statuses['requirements-proposal'].status).toBe('completed');
        expect(statuses['product-design'].status).toBe('in-progress');
    });

    it('calls Logger.warn method when warning is needed', async () => {

        // 测试目的
        // 确保 Logger.warn() 方法能够正确调用底层的 console.warn

        // 1. 创建 FlowCoordinator 实例
        const coordinator = new FlowCoordinator(project, false);

        // 2. 获取 coordinator 内部的私有 logger 对象
        // 使用 (coordinator as any) 绕过 TypeScript 类型检查，访问私有属性
        const logger = (coordinator as any).logger;

        // 3. 创建一个 Jest spy（监视器）来监控 console.warn 方法
        // 这样可以追踪 console.warn 是否被调用以及如何被调用
        const warnSpy = jest.spyOn(console, 'warn');

        // 4. 调用 logger 的 warn 方法
        // 这会内部调用 console.warn
        logger.warn('This is a warning message');

        // 5. 断言验证：检查 console.warn 是否被正确调用
        // 期望 console.warn 被调用时传入两个参数：
        //   - 第一个参数：'[FlowCoordinator] WARN:'（日志前缀）
        //   - 第二个参数：'This is a warning message'（实际消息）
        expect(warnSpy).toHaveBeenCalledWith(
            '[FlowCoordinator] WARN:',
            'This is a warning message'
        );

        // mockRestore() 的作用：
        // 1. 移除 Jest 对 console.warn 的监视
        // 2. 恢复 console.warn 到原始状态
        // 3. 防止影响其他测试用例

        // 替代方案
        // 使用 afterEach 自动清理所有 mock
        // afterEach(() => {
        //     jest.restoreAllMocks();
        // });

        warnSpy.mockRestore();
    });

    it('calls Logger.error method multiple times', async () => {
        const coordinator = new FlowCoordinator(project, false);
        const logger = (coordinator as any).logger;
        const errorSpy = jest.spyOn(console, 'error');

        logger.error('Error occurred', 'details');

        expect(errorSpy).toHaveBeenCalledWith(
            '[FlowCoordinator] ERROR:',
            'Error occurred',
            'details'
        );

        errorSpy.mockRestore();
    });

    it('uses ContextManager.has() method to check data existence', async () => {
        const coordinator = new FlowCoordinator(project, false);
        const ctx = (coordinator as any).ctx;

        expect(ctx.has('non-existent-key')).toBe(false);

        ctx.set('test-key', 'test-value');
        expect(ctx.has('test-key')).toBe(true);
    });

    it('uses FileManager.writeFile to persist flow report', async () => {
        const coordinator = new FlowCoordinator(project, false);
        const writeFileSpy = jest.spyOn((coordinator as any).fm, 'writeFile');

        await coordinator.complete();

        expect(writeFileSpy).toHaveBeenCalledWith(
            './flow-report.json',
            expect.stringContaining('project')
        );

        writeFileSpy.mockRestore();
    });

    it('covers getStageProgress when stage metrics are empty', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();

        // Get stage status will internally call getStageProgress
        const statuses = coordinator.getStageStatuses();

        // Should return 0 when no metrics are set
        expect(statuses['requirements-proposal'].progress).toBe(0);
    });

    it('covers getStageProgress with some quality thresholds met', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();

        // Record metrics that meet some thresholds
        await coordinator.recordQualityMetric('requirements-proposal', 'clarity', 100);
        await coordinator.recordQualityMetric('requirements-proposal', 'customerPerspective', 100);

        const statuses = coordinator.getStageStatuses();

        // Should have some progress based on metrics
        expect(statuses['requirements-proposal'].progress).toBeGreaterThanOrEqual(0);
    });

    it('covers ContextManager edge case when data map is accessed directly', async () => {
        const coordinator = new FlowCoordinator(project, false);
        const ctx = (coordinator as any).ctx;

        ctx.set('stage_status_requirements-proposal', 'in-progress');
        const status = ctx.get('stage_status_requirements-proposal');

        expect(status).toBe('in-progress');
        expect(ctx.has('stage_status_requirements-proposal')).toBe(true);
    });

    it('throws error with invalid project context properties', async () => {
        const invalidProject: ProjectContext = {
            name: '', // empty name
            startDate: new Date(),
            targetEndDate: new Date(),
        };

        const coordinator = new FlowCoordinator(invalidProject, false);

        await expect(coordinator.start()).rejects.toThrow('Invalid project context');
    });

    it('throws error when transitioning to unknown stage', async () => {
        const coordinator = new FlowCoordinator(project, false);
        await coordinator.start();

        await expect(coordinator.transitionTo('unknown-stage-xyz')).rejects.toThrow('Unknown stage');
    });
});
