/**
 * Doc Generator 单元测试
 */

import { DocGenerator } from '../../skills//scripts/generators/doc-generator';

describe('DocGenerator', () => {
    let generator: DocGenerator;

    beforeEach(() => {
        generator = new DocGenerator();
    });

    it('should create instance', () => {
        expect(generator).toBeInstanceOf(DocGenerator);
    });

    it('should generate component doc string', async () => {
        const doc = await generator.generateComponentDoc({ name: 'Test' });
        expect(typeof doc).toBe('string');
        expect(doc).toContain('#');
    });
});
