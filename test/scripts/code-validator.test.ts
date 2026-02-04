/**
 * Code Validator 单元测试
 */

import { CodeValidator } from '../../skills/scripts/validators/code-validator';

describe('CodeValidator', () => {
    let validator: CodeValidator;

    beforeEach(() => {
        validator = new CodeValidator();
    });

    it('should create instance', () => {
        expect(validator).toBeInstanceOf(CodeValidator);
    });

    it('should validate code path and return success', async () => {
        const result = await validator.validate('./path/to/code', { strict: false });
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
    });
});
