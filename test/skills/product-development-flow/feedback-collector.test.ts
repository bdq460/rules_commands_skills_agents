import fs from 'fs';
import os from 'os';
import path from 'path';
import { FeedbackCollector } from '../../../skills/skills/product-development-flow/scripts/feedback-collector';

describe('FeedbackCollector', () => {
    let storageDir: string;

    beforeEach(() => {
        storageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'feedback-'));
    });

    it('collects, classifies, processes and exports feedback', async () => {
        const collector = new FeedbackCollector(storageDir, true);
        const id = await collector.collect('design', { content: '功能需要增强', priority: 'high', source: 'customer' });

        const stageFeedback = collector.getFeedbackByStage('design');
        expect(stageFeedback[0].category).toBe('feature');

        await collector.processFeedback(id, 'resolve');
        const pending = collector.getPendingFeedback();
        expect(pending.length).toBe(0);

        const summary = collector.getSummary();
        expect(summary.total).toBe(1);
        expect(summary.byCategory.feature).toBe(1);

        await collector.exportData('json');
        expect(fs.existsSync(path.join(storageDir, 'feedback-summary.json'))).toBe(true);
    });

    it('handles other categories and CSV export', async () => {
        const collector = new FeedbackCollector(storageDir, true);
        await collector.collect('test', { content: '出现错误，性能很慢', priority: 'critical', source: 'internal' });
        const summary = collector.getSummary();
        expect(summary.byCategory.bug + summary.byCategory.performance).toBeGreaterThan(0);

        await collector.exportData('csv');
        expect(fs.existsSync(path.join(storageDir, 'feedback-summary.csv'))).toBe(true);
    });

    it('supports reject/defer actions and pending queries', async () => {
        const collector = new FeedbackCollector(storageDir, false);
        const id = await collector.collect('backend', { content: '文档不直观', source: 'internal' });

        // no auto classify branch
        const pendingBefore = collector.getPendingFeedback();
        expect(pendingBefore.length).toBe(1);

        await collector.processFeedback(id, 'reject');
        await collector.processFeedback(id, 'defer');
        const pendingAfter = collector.getPendingFeedback();
        expect(Array.isArray(pendingAfter)).toBe(true);

        await expect(collector.processFeedback('missing', 'reject')).rejects.toThrow('Feedback not found');
    });

    it('classifies default other category', async () => {
        const collector = new FeedbackCollector(storageDir, true);
        const id = await collector.collect('ops', { content: 'miscellaneous note' });
        const data = collector.getFeedbackByStage('ops')[0];
        expect(data.category).toBe('other');
        await collector.processFeedback(id, 'resolve');
    });
});
