/**
 * Config Validator 单元测试
 */

import { ConfigValidator } from '#/scripts/validators/config-validator';

describe('ConfigValidator', () => {
    let validator: ConfigValidator;

    beforeEach(() => {
        validator = new ConfigValidator();
    });

    it('should create instance', () => {
        expect(validator).toBeInstanceOf(ConfigValidator);
    });

    it('should validate config path and return success', async () => {
        const result = await validator.validate('./path/to/config');
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
    });
});
