import { FileManager } from '#/scripts/utils/file-manager';

describe('FileManager', () => {
    it('exposes async APIs', async () => {
        const manager = new FileManager();
        await expect(manager.createDirectory('/tmp/non-existent')).resolves.toBeUndefined();
        await expect(manager.writeFile('/tmp/non-existent/file', 'content')).resolves.toBeUndefined();
    });
});
