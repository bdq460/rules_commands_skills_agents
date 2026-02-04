/**
 * Code Generator 单元测试
 */

import { CodeGenerator } from '#/scripts/generators/code-generator';

describe('CodeGenerator', () => {
    let generator: CodeGenerator;

    beforeEach(() => {
        generator = new CodeGenerator();
    });

    it('should create instance', () => {
        expect(generator).toBeInstanceOf(CodeGenerator);
    });

    it('should generate component code string', async () => {
        const code = await generator.generateComponent({ name: 'Test' });
        expect(typeof code).toBe('string');
        expect(code).toContain('组件');
    });
});
