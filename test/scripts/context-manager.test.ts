import { ContextManager } from '#/scripts/utils/context-manager';

describe('ContextManager', () => {
    it('stores and retrieves values', () => {
        const manager = new ContextManager();
        manager.set('key', 123);
        expect(manager.get('key')).toBe(123);
    });
});
