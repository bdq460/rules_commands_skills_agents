import { CodeGenerator } from '../../skills/scripts/generators/code-generator';
import { DocGenerator } from '../../skills/scripts/generators/doc-generator';
import { CodeValidator } from '../../skills/scripts/validators/code-validator';
import { ConfigValidator } from '../../skills/scripts/validators/config-validator';

describe('Script generators and validators', () => {
    it('generates component and docs', async () => {
        const codeGen = new CodeGenerator();
        const code = await codeGen.generateComponent({});
        expect(code).toContain('组件');

        const docGen = new DocGenerator();
        const doc = await docGen.generateComponentDoc({});
        expect(doc.startsWith('#')).toBe(true);
    });

    it('returns success from validators', async () => {
        const cfgValidator = new ConfigValidator();
        const codeValidator = new CodeValidator();

        const cfg = await cfgValidator.validate('path');
        const code = await codeValidator.validate('file', {});

        expect(cfg.success).toBe(true);
        expect(code.success).toBe(true);
    });
});
