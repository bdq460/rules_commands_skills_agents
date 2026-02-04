/**
 * Config Generator 单元测试
 */

import {
    generateCypressConfig,
    generateJestConfig,
    generateMochaConfig,
    generateTestingSetup
} from '../../../skills/skills/test-framework-builder/scripts/config-generator';

describe('ConfigGenerator', () => {
    describe('generateJestConfig', () => {
        it('should generate Jest configuration with default config', () => {
            const result = generateJestConfig();

            expect(result).toBeDefined();
            expect(result).toContain('module.exports');
            expect(result).toContain('testEnvironment');
            expect(result).toContain('collectCoverageFrom');
        });

        it('should generate Jest configuration with custom config', () => {
            const config = {
                coverageThreshold: 75,
                environment: 'jsdom'
            };
            const result = generateJestConfig(config);

            expect(result).toBeDefined();
            expect(result).toContain('coverageThreshold');
            expect(result).toContain('75');
            expect(result).toContain('statements');
            expect(result).toContain('branches');
            expect(result).toContain('functions');
            expect(result).toContain('lines');
        });

        it('should include test match patterns', () => {
            const result = generateJestConfig();

            expect(result).toContain('testMatch');
            expect(result).toContain('**/__tests__/**/*.{js,jsx,ts,tsx}');
        });

        it('should support TypeScript configuration with ts-jest', () => {
            const result = generateJestConfig();

            expect(result).toContain('ts-jest');
        });

        it('should include coverage flag', () => {
            const config = { coverage: false };
            const result = generateJestConfig(config);

            expect(result).toContain('collectCoverage: false');
        });

        it('should include verbose flag', () => {
            const result = generateJestConfig();

            expect(result).toContain('verbose: true');
        });
    });

    describe('generateMochaConfig', () => {
        it('should generate Mocha configuration with default config', () => {
            const result = generateMochaConfig();

            expect(result).toBeDefined();
            expect(result).toContain('module.exports');
        });

        it('should include timeout configuration', () => {
            const result = generateMochaConfig();

            expect(result).toContain('timeout');
            expect(result).toContain('10000');
        });

        it('should include reporter configuration', () => {
            const result = generateMochaConfig();

            expect(result).toContain('reporter');
        });

        it('should include coverage configuration', () => {
            const result = generateMochaConfig();

            expect(result).toContain('coverage');
            expect(result).toContain('coverageThreshold');
        });
    });

    describe('generateCypressConfig', () => {
        it('should generate Cypress configuration with default options', () => {
            const result = generateCypressConfig();

            expect(result).toBeDefined();
            expect(result).toContain("baseUrl: 'http://localhost:3000'");
            expect(result).toContain('e2e:');
            expect(result).toContain('component:');
        });

        it('should include e2e and component testing configurations', () => {
            const result = generateCypressConfig();

            expect(result).toContain('e2e:');
            expect(result).toContain('component:');
        });

        it('should include viewport configuration', () => {
            const result = generateCypressConfig();

            expect(result).toContain('viewportWidth');
            expect(result).toContain('viewportHeight');
            expect(result).toContain('1280');
            expect(result).toContain('720');
        });

        it('should accept custom baseUrl', () => {
            const options = { baseUrl: 'http://localhost:8080' };
            const result = generateCypressConfig(options);

            expect(result).toContain("baseUrl: 'http://localhost:8080'");
        });

        it('should accept custom viewport dimensions', () => {
            const options = { viewportWidth: 1920, viewportHeight: 1080 };
            const result = generateCypressConfig(options);

            expect(result).toContain('viewportWidth: 1920');
            expect(result).toContain('viewportHeight: 1080');
        });
    });

    describe('generateTestingSetup', () => {
        it('should generate testing setup for Jest with TypeScript', () => {
            const result = generateTestingSetup('jest', 'typescript');

            expect(result).toBeDefined();
            expect(result.markdown).toContain('JEST');
            expect(result.markdown).toContain('TypeScript');
            expect(result.markdown).toContain('## 安装依赖');
        });

        it('should generate testing setup for Vitest', () => {
            const result = generateTestingSetup('vitest', 'typescript');

            expect(result).toBeDefined();
            expect(result.markdown).toContain('VITEST');
            expect(result.markdown).toContain('## 测试示例');
        });

        it('should generate testing setup for Mocha', () => {
            const result = generateTestingSetup('mocha', 'typescript');

            expect(result).toBeDefined();
            expect(result.markdown).toContain('MOCHA');
            expect(result.markdown).toContain('.mocharc.js');
        });

        it('should generate testing setup for Jasmine', () => {
            const result = generateTestingSetup('jasmine', 'typescript');

            expect(result).toBeDefined();
            expect(result.markdown).toContain('JASMINE');
        });

        it('should include best practices in setup', () => {
            const result = generateTestingSetup('jest', 'typescript');

            expect(result.markdown).toContain('## 最佳实践');
        });

        it('should include FAQ in setup', () => {
            const result = generateTestingSetup('jest', 'typescript');

            expect(result.markdown).toContain('## 常见问题');
        });
    });

    describe('ConfigGenerator Class Methods', () => {
        const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
        let generator: any;

        beforeEach(() => {
            generator = new ConfigGenerator();
        });

        test('generatePackageJsonScripts should return valid JSON', () => {
            const result = generator.generatePackageJsonScripts('jest');
            expect(result).toBeDefined();
            expect(() => JSON.parse(result)).not.toThrow();

            const scripts = JSON.parse(result);
            expect(scripts.test).toContain('jest');
            expect(scripts['test:watch']).toBeDefined();
            expect(scripts['test:coverage']).toBeDefined();
            expect(scripts['test:ci']).toBeDefined();
        });

        test('generateTestExample should generate unit test example for jest', () => {
            const result = generator.generateTestExample('jest', 'unit');
            expect(result).toBeDefined();
            expect(result).toContain('Unit Test');
            expect(result).toContain('describe');
            expect(result).toContain('expect');
        });

        test('generateTestExample should generate integration test example for jest', () => {
            const result = generator.generateTestExample('jest', 'integration');
            expect(result).toBeDefined();
            expect(result).toContain('Integration Test');
            expect(result).toContain('describe');
        });

        test('generateTestExample should generate e2e test example for jest', () => {
            const result = generator.generateTestExample('jest', 'e2e');
            expect(result).toBeDefined();
            expect(result).toContain('E2E Test');
            expect(result).toContain('describe');
        });

        test('generateTestExample should support mocha framework', () => {
            const result = generator.generateTestExample('mocha', 'unit');
            expect(result).toBeDefined();
            expect(result).toContain('describe');
            expect(result).toContain('expect');
        });

        test('generateTestExample should support vitest framework', () => {
            const result = generator.generateTestExample('vitest', 'unit');
            expect(result).toBeDefined();
            expect(result).toContain('describe');
            expect(result).toContain('expect');
        });

        test('generateESLintTestConfig should include jest environment and rules', () => {
            const defaultConfig = ConfigGenerator.getDefaultESLintConfig();
            const result = generator.generateESLintTestConfig(defaultConfig);

            expect(result).toBeDefined();
            expect(result).toContain('jest');
            expect(result).toContain('node');
            expect(result).toContain('eslint:recommended');
            expect(result).toContain('jest/no-disabled-tests');
        });

        test('getDefaultConfig should return different configs for different frameworks', () => {
            const jestConfig = ConfigGenerator.getDefaultConfig('jest');
            const mochaConfig = ConfigGenerator.getDefaultConfig('mocha');
            const vitestConfig = ConfigGenerator.getDefaultConfig('vitest');

            expect(jestConfig.framework.name).toBe('jest');
            expect(mochaConfig.framework.name).toBe('mocha');
            expect(vitestConfig.framework.name).toBe('vitest');
            expect(jestConfig.framework.version).toBeDefined();
        });

        test('getDefaultESLintConfig should return complete ESLint configuration', () => {
            const config = ConfigGenerator.getDefaultESLintConfig();

            expect(config).toBeDefined();
            expect(config.env).toContain('jest');
            expect(config.env).toContain('node');
            expect(config.extends).toContain('eslint:recommended');
            expect(config.plugins).toContain('jest');
            expect(config.rules['jest/no-disabled-tests']).toBe('warn');
            expect(config.rules['jest/no-focused-tests']).toBe('error');
        });
    });

    describe('generateTestingSetup for different frameworks and languages', () => {
        it('should generate setup for jest with javascript', () => {
            const result = generateTestingSetup('jest', 'javascript');

            expect(result.markdown).toContain('JEST');
            expect(result.markdown).toContain('JavaScript');
            expect(result.markdown).toContain('npm install --save-dev jest');
            expect(result.markdown).not.toContain('@types/jest');
        });

        it('should generate setup for vitest with typescript', () => {
            const result = generateTestingSetup('vitest', 'typescript');

            expect(result.markdown).toContain('VITEST');
            expect(result.markdown).toContain('TypeScript');
            expect(result.markdown).toContain('测试示例');
        });

        it('should generate setup for mocha with javascript', () => {
            const result = generateTestingSetup('mocha', 'javascript');

            expect(result.markdown).toContain('MOCHA');
            expect(result.markdown).toContain('JavaScript');
            expect(result.markdown).toContain('npm install --save-dev mocha');
            expect(result.markdown).not.toContain('@types/mocha');
        });

        it('should generate setup for jasmine with typescript', () => {
            const result = generateTestingSetup('jasmine', 'typescript');

            expect(result.markdown).toContain('JASMINE');
            expect(result.markdown).toContain('TypeScript');
            expect(result.markdown).toContain('最佳实践');
        });

        it('should include common sections in all framework setups', () => {
            const frameworks: Array<'jest' | 'vitest' | 'mocha' | 'jasmine'> = ['jest', 'vitest', 'mocha', 'jasmine'];

            frameworks.forEach(framework => {
                const result = generateTestingSetup(framework, 'typescript');
                expect(result.markdown).toContain('测试示例');
                expect(result.markdown).toContain('最佳实践');
                expect(result.markdown).toContain('常见问题');
            });
        });
    });

    describe('generateCypressConfig edge cases', () => {
        it('should handle video disabled explicitly', () => {
            const result = generateCypressConfig({ video: false });
            expect(result).toContain('video: false');
        });

        it('should handle video enabled explicitly', () => {
            const result = generateCypressConfig({ video: true });
            expect(result).toContain('video: true');
        });

        it('should handle screenshotOnRunFailure disabled', () => {
            const result = generateCypressConfig({ screenshotOnRunFailure: false });
            expect(result).toContain('screenshotOnRunFailure: false');
        });

        it('should use default values when no options provided', () => {
            const result = generateCypressConfig();
            expect(result).toContain("baseUrl: 'http://localhost:3000'");
            expect(result).toContain('video: false');
            expect(result).toContain('screenshotOnRunFailure: true');
        });

        it('should handle all custom options together', () => {
            const options = {
                baseUrl: 'http://example.com',
                supportFile: 'custom/support.ts',
                pluginsFile: 'custom/plugins.ts',
                viewportWidth: 1920,
                viewportHeight: 1080,
                video: true,
                screenshotOnRunFailure: false
            };
            const result = generateCypressConfig(options);

            expect(result).toContain("baseUrl: 'http://example.com'");
            expect(result).toContain("supportFile: 'custom/support.ts'");
            expect(result).toContain('viewportWidth: 1920');
            expect(result).toContain('viewportHeight: 1080');
            expect(result).toContain('video: true');
            expect(result).toContain('screenshotOnRunFailure: false');
        });
    });

    describe('generateVitestConfig', () => {
        it('should generate Vitest configuration', () => {
            const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
            const generator = new ConfigGenerator();
            const config = ConfigGenerator.getDefaultConfig('vitest');

            const result = generator.generateVitestConfig(config);

            expect(result).toBeDefined();
            expect(result).toContain('defineConfig');
            expect(result).toContain('vitest/config');
            expect(result).toContain('environment:');
        });

        it('should include coverage configuration', () => {
            const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
            const generator = new ConfigGenerator();
            const config = ConfigGenerator.getDefaultConfig('vitest');

            const result = generator.generateVitestConfig(config);

            expect(result).toContain('coverage:');
            expect(result).toContain('provider: \'v8\'');
            expect(result).toContain('lines:');
            expect(result).toContain('functions:');
            expect(result).toContain('branches:');
            expect(result).toContain('statements:');
        });

        it('should include test environment', () => {
            const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
            const generator = new ConfigGenerator();
            const config = { ...ConfigGenerator.getDefaultConfig('vitest'), environment: 'happy-dom' };

            const result = generator.generateVitestConfig(config);

            expect(result).toContain('environment: \'happy-dom\'');
        });
    });

    describe('generateJasmineConfig', () => {
        it('should generate Jasmine configuration', () => {
            const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
            const generator = new ConfigGenerator();
            const config = ConfigGenerator.getDefaultConfig('jasmine');

            const result = generator.generateJasmineConfig(config);

            expect(result).toBeDefined();
            expect(result).toContain('module.exports');
            expect(result).toContain('spec_dir:');
            expect(result).toContain('spec_files:');
        });

        it('should include helpers configuration', () => {
            const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
            const generator = new ConfigGenerator();
            const config = ConfigGenerator.getDefaultConfig('jasmine');

            const result = generator.generateJasmineConfig(config);

            expect(result).toContain('helpers:');
        });

        it('should include random test execution', () => {
            const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
            const generator = new ConfigGenerator();
            const config = ConfigGenerator.getDefaultConfig('jasmine');

            const result = generator.generateJasmineConfig(config);

            expect(result).toContain('random: true');
        });
    });

    describe('generateSetupFile', () => {
        const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
        let generator: any;

        beforeEach(() => {
            generator = new ConfigGenerator();
        });

        it('should generate Jest setup file', () => {
            const result = generator.generateSetupFile('jest');

            expect(result).toBeDefined();
            expect(result).toContain('Jest Setup File');
            expect(result).toContain('jest.clearAllMocks()');
            expect(result).toContain('@testing-library/jest-dom');
        });

        it('should generate Vitest setup file', () => {
            const result = generator.generateSetupFile('vitest');

            expect(result).toBeDefined();
            expect(result).toContain('Vitest Setup File');
            expect(result).toContain('vi.clearAllMocks()');
            expect(result).toContain('from \'vitest\'');
        });

        it('should generate Mocha setup file', () => {
            const result = generator.generateSetupFile('mocha');

            expect(result).toBeDefined();
            expect(result).toContain('Mocha Setup File');
            expect(result).toContain('JSDOM');
            expect(result).toContain('from \'chai\'');
        });

        it('should generate Jasmine setup file', () => {
            const result = generator.generateSetupFile('jasmine');

            expect(result).toBeDefined();
            expect(result).toContain('Jasmine Setup File');
            expect(result).toContain('jasmine.addMatchers');
        });

        it('should include localStorage mock in Jest setup', () => {
            const result = generator.generateSetupFile('jest');

            expect(result).toContain('localStorageMock');
            expect(result).toContain('getItem');
            expect(result).toContain('setItem');
            expect(result).toContain('removeItem');
            expect(result).toContain('clear');
        });

        it('should include fetch mock in Vitest setup', () => {
            const result = generator.generateSetupFile('vitest');

            expect(result).toContain('global.fetch = vi.fn()');
        });

        it('should include window mock in Mocha setup', () => {
            const result = generator.generateSetupFile('mocha');

            expect(result).toContain('global.window');
            expect(result).toContain('global.document');
            expect(result).toContain('global.navigator');
        });
    });

    describe('generateTestExample - Additional Frameworks', () => {
        const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
        let generator: any;

        beforeEach(() => {
            generator = new ConfigGenerator();
        });

        it('should generate Vitest unit test example', () => {
            const result = generator.generateTestExample('vitest', 'unit');

            expect(result).toBeDefined();
            expect(result).toContain('Vitest');
            expect(result).toContain('from \'vitest\'');
            expect(result).toContain('describe');
            expect(result).toContain('it');
        });

        it('should generate Vitest integration test example', () => {
            const result = generator.generateTestExample('vitest', 'integration');

            expect(result).toBeDefined();
            expect(result).toContain('Integration Test');
            expect(result).toContain('@testing-library/vue');
        });

        it('should generate Vitest e2e test example', () => {
            const result = generator.generateTestExample('vitest', 'e2e');

            expect(result).toBeDefined();
            expect(result).toContain('E2E Test');
            expect(result).toContain('Cypress');
        });

        it('should generate Mocha unit test example', () => {
            const result = generator.generateTestExample('mocha', 'unit');

            expect(result).toBeDefined();
            expect(result).toContain('Mocha');
            expect(result).toContain('from \'chai\'');
            expect(result).toContain('to.equal');
        });

        it('should generate Mocha integration test example', () => {
            const result = generator.generateTestExample('mocha', 'integration');

            expect(result).toBeDefined();
            expect(result).toContain('Integration Test');
            expect(result).toContain('@testing-library/vue');
        });

        it('should generate Mocha e2e test example', () => {
            const result = generator.generateTestExample('mocha', 'e2e');

            expect(result).toBeDefined();
            expect(result).toContain('E2E Test');
            expect(result).toContain('Cypress');
        });

        it('should generate Jasmine unit test example', () => {
            const result = generator.generateTestExample('jasmine', 'unit');

            expect(result).toBeDefined();
            expect(result).toContain('Jasmine');
            expect(result).toContain('describe');
            expect(result).toContain('it');
        });

        it('should generate Jasmine integration test example', () => {
            const result = generator.generateTestExample('jasmine', 'integration');

            expect(result).toBeDefined();
            expect(result).toContain('Integration Test');
            expect(result).toContain('@testing-library/angular');
        });

        it('should generate Jasmine e2e test example', () => {
            const result = generator.generateTestExample('jasmine', 'e2e');

            expect(result).toBeDefined();
            expect(result).toContain('E2E Test');
            expect(result).toContain('Protractor');
        });
    });

    describe('generatePackageJsonScripts - Additional Frameworks', () => {
        const ConfigGenerator = require('../../../skills/skills/test-framework-builder/scripts/config-generator').ConfigGenerator;
        let generator: any;

        beforeEach(() => {
            generator = new ConfigGenerator();
        });

        it('should generate scripts for Vitest', () => {
            const result = generator.generatePackageJsonScripts('vitest');
            const scripts = JSON.parse(result);

            expect(scripts.test).toContain('vitest');
            expect(scripts['test:watch']).toContain('vitest');
            expect(scripts['test:coverage']).toContain('vitest');
            expect(scripts['test:ci']).toContain('vitest');
        });

        it('should generate scripts for Mocha', () => {
            const result = generator.generatePackageJsonScripts('mocha');
            const scripts = JSON.parse(result);

            expect(scripts.test).toContain('mocha');
            expect(scripts['test:watch']).toContain('mocha');
            expect(scripts['test:coverage']).toContain('mocha');
            expect(scripts['test:ci']).toContain('mocha');
        });

        it('should generate scripts for Jasmine', () => {
            const result = generator.generatePackageJsonScripts('jasmine');
            const scripts = JSON.parse(result);

            expect(scripts.test).toContain('jasmine');
            expect(scripts['test:watch']).toContain('jasmine');
            expect(scripts['test:coverage']).toContain('jasmine');
            expect(scripts['test:ci']).toContain('jasmine');
        });

        it('should include standard script names for all frameworks', () => {
            const frameworks = ['jest', 'vitest', 'mocha', 'jasmine'];

            frameworks.forEach(framework => {
                const result = generator.generatePackageJsonScripts(framework);
                const scripts = JSON.parse(result);

                expect(scripts.test).toBeDefined();
                expect(scripts['test:watch']).toBeDefined();
                expect(scripts['test:coverage']).toBeDefined();
                expect(scripts['test:ci']).toBeDefined();
            });
        });
    });
});
