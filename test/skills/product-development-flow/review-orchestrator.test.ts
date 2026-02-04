import { ReviewOrchestrator } from '../../../skills/skills/product-development-flow/scripts/review-orchestrator';

describe('ReviewOrchestrator', () => {
    it('adds comments and records decisions', async () => {
        const orchestrator = new ReviewOrchestrator(2, true);
        await orchestrator.triggerSelfReview('requirements-proposal');

        // Seed review status for comment/decision flows
        (orchestrator as any).ctx.set('review_status_requirements-proposal', {
            attempt: 1,
            maxAttempts: 2,
            status: 'in-progress',
            comments: [],
        });

        await orchestrator.addComment('requirements-proposal', 'looks good');
        const statusWithComment = orchestrator.getReviewStatus('requirements-proposal');
        expect(statusWithComment?.comments.length).toBe(1);

        await orchestrator.recordDecision('requirements-proposal', 'pass', 'reviewer', ['ok']);
        const status = orchestrator.getReviewStatus('requirements-proposal');
        expect(status?.decision?.decision).toBe('pass');

        const nextTrigger = (orchestrator as any).ctx.get('transition_trigger_requirements-analysis');
        expect(nextTrigger?.fromStage).toBe('requirements-proposal');
    });

    it('stops triggering when max attempts reached', async () => {
        const orchestrator = new ReviewOrchestrator(1, true);
        (orchestrator as any).ctx.set('review_status_ui-design', {
            attempt: 1,
            maxAttempts: 1,
            status: 'failed',
            comments: [],
        });

        const warnSpy = jest.spyOn(console, 'log').mockImplementation();
        await orchestrator.triggerSelfReview('ui-design');
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('logs warnings when adding comments or decisions without active review', async () => {
        const orchestrator = new ReviewOrchestrator(2, false);
        const warnSpy = jest.spyOn(console, 'log').mockImplementation();
        await orchestrator.addComment('missing-stage', 'no review yet');
        await orchestrator.recordDecision('missing-stage', 'fail', 'nobody');
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('warns when auto-transitioning from last stage', async () => {
        const orchestrator = new ReviewOrchestrator(2, true);
        await orchestrator.triggerSelfReview('project-coordination');
        (orchestrator as any).ctx.set('review_status_project-coordination', {
            attempt: 1,
            maxAttempts: 2,
            status: 'in-progress',
            comments: [],
        });
        const warnSpy = jest.spyOn(console, 'log').mockImplementation();
        await orchestrator.recordDecision('project-coordination', 'pass', 'final');
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('returns aggregated review statuses map', async () => {
        const orchestrator = new ReviewOrchestrator(2, false);
        await orchestrator.triggerSelfReview('requirements-proposal');
        (orchestrator as any).ctx.set('review_status_requirements-proposal', {
            attempt: 1,
            maxAttempts: 2,
            status: 'in-progress',
            comments: [],
        });
        const statuses = orchestrator.getAllReviewStatuses();
        expect(statuses['requirements-proposal']).toBeDefined();
    });
});
