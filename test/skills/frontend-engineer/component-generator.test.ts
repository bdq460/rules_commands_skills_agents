/**
 * Component Generator 单元测试
 */

import { ComponentGenerator } from '../../../skills/skills/frontend-engineer/scripts/component-generator';

describe('ComponentGenerator', () => {
    let generator: ComponentGenerator;

    beforeEach(() => {
        generator = new ComponentGenerator({
            name: 'TestComponent',
            framework: 'react',
            typescript: true,
            styling: 'css'
        });
    });

    afterEach(() => {
        generator = null as any;
    });

    describe('constructor', () => {
        it('should create instance with default options', () => {
            expect(generator).toBeInstanceOf(ComponentGenerator);
        });

        it('should set component name', () => {
            const gen = new ComponentGenerator({ name: 'MyComponent', framework: 'react' });
            expect(gen['options'].name).toBe('MyComponent');
        });

        it('should default to TypeScript', () => {
            const gen = new ComponentGenerator({ name: 'Test', framework: 'react' });
            expect(gen['options'].typescript).toBe(true);
        });

        it('should default to CSS styling', () => {
            const gen = new ComponentGenerator({ name: 'Test', framework: 'react' });
            expect(gen['options'].styling).toBe('css');
        });
    });

    describe('generateReactComponent', () => {
        it('should generate React component code', () => {
            const code = generator.generateReactComponent();

            expect(code).toContain('export const TestComponent');
            expect(code).toContain('React.FC');
            expect(code).toContain('return');
        });

        it('should include imports', () => {
            const code = generator.generateReactComponent();

            expect(code).toContain('import React');
        });

        it('should include props interface when TypeScript is enabled', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                typescript: true
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('interface TestComponentProps');
        });

        it('should not include props interface when TypeScript is disabled', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                typescript: false
            });

            const code = gen.generateReactComponent();

            expect(code).not.toContain('interface TestComponentProps');
        });

        it('should include hooks when feature is enabled', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                features: { hooks: true }
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('useState');
        });

        it('should include async logic when feature is enabled', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                features: { async: true }
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('async');
            expect(code).toContain('useEffect');
        });
    });

    describe('generateVueComponent', () => {
        it('should generate Vue component code', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue',
                typescript: true
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('<template>');
            expect(code).toContain('<script setup lang="ts">');
            expect(code).toContain('defineProps');
        });

        it('should include template section', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue'
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('<template>');
            expect(code).toContain('</template>');
        });

        it('should include script section', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue'
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('<script');
            expect(code).toContain('</script>');
        });

        it('should include style section', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue',
                styling: 'scss'
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('<style scoped lang="scss">');
            expect(code).toContain('</style>');
        });

        it('should support composition API', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue',
                features: { hooks: true }
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('ref');
            expect(code).toContain('computed');
        });
    });

    describe('component naming', () => {
        it('should convert kebab-case to PascalCase for React', () => {
            const gen = new ComponentGenerator({
                name: 'my-component',
                framework: 'react'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('MyComponent');
            expect(code).not.toContain('my-component');
        });

        it('should convert kebab-case to PascalCase for Vue', () => {
            const gen = new ComponentGenerator({
                name: 'my-component',
                framework: 'vue'
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('MyComponent');
            expect(code).not.toContain('my-component');
        });
    });

    describe('styling options', () => {
        it('should support CSS styling', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                styling: 'css'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('.test-component');
        });

        it('should support SCSS styling', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                styling: 'scss'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('.test-component');
        });

        it('should support styled-components', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                styling: 'styled-components'
            });

            const code = gen.generateStyles();

            expect(code).toContain('styled-components');
        });
    });

    describe('generateStyles', () => {
        it('should generate CSS styles', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                styling: 'css'
            });

            const styles = gen.generateStyles();

            expect(styles).toContain('.TestComponent');
            expect(styles).toContain('padding: 20px');
        });

        it('should generate SCSS styles', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                styling: 'scss'
            });

            const styles = gen.generateStyles();

            expect(styles).toContain('.TestComponent');
            expect(styles).toContain('&__header');
        });

        it('should generate styled-components', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                styling: 'styled-components'
            });

            const styles = gen.generateStyles();

            expect(styles).toContain('styled-components');
        });

        it('should generate Tailwind styles', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                styling: 'tailwind'
            });

            const styles = gen.generateStyles();

            expect(styles).toContain('Tailwind');
        });

        it('should default to CSS for invalid styling option', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                styling: 'invalid' as any
            });

            const styles = gen.generateStyles();

            expect(styles).toContain('.TestComponent');
        });
    });

    describe('library options', () => {
        it('should support Ant Design library for React', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                library: 'antd'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('antd');
            expect(code).toContain('Button');
        });

        it('should support Material-UI library for React', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                library: 'material-ui'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('@mui/material');
            expect(code).toContain('Button');
        });

        it('should support Element Plus library for Vue', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue',
                library: 'element-plus'
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('element-plus');
            expect(code).toContain('ElButton');
        });

        it('should support no library', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                library: 'none'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('import React');
        });
    });

    describe('feature combinations', () => {
        it('should support form feature', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                features: { form: true }
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('form');
            expect(code).toContain('handleSubmit');
        });

        it('should support table feature', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                features: { table: true }
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('Table');
        });

        it('should support all features together', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                features: {
                    hooks: true,
                    async: true,
                    form: true,
                    table: true
                }
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('useState');
            expect(code).toContain('async');
            expect(code).toContain('form');
            expect(code).toContain('Table');
        });

        it('should support Vue async logic', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue',
                features: { async: true }
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('async');
            expect(code).toContain('ElMessage');
        });

        it('should support Vue form logic', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue',
                features: { form: true }
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('Form');
        });

        it('should support Vue table logic', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue',
                features: { table: true }
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('Table');
        });
    });

    describe('generated code structure', () => {
        it('should have valid React component structure', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('export const TestComponent');
            expect(code).toContain('return');
            expect(code).toContain('export default TestComponent');
        });

        it('should have valid Vue component structure', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue'
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('<template>');
            expect(code).toContain('<script setup');
            expect(code).toContain('<style scoped>');
        });

        it('should include proper className in React', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react'
            });

            const code = gen.generateReactComponent();

            expect(code).toMatch(/className="[^"]*"/);
        });
    });

    describe('convenience functions', () => {
        it('should export generateComponent function', () => {
            const { generateComponent } = require('../../../skills/skills/frontend-engineer/scripts/component-generator');

            const code = generateComponent({
                name: 'TestComponent',
                framework: 'react'
            });

            expect(code).toContain('export const TestComponent');
        });

        it('should export generateStyles function', () => {
            const { generateStyles } = require('../../../skills/skills/frontend-engineer/scripts/component-generator');

            const styles = generateStyles({
                name: 'TestComponent',
                framework: 'react',
                styling: 'css'
            });

            expect(styles).toContain('.TestComponent');
        });
    });

    describe('edge cases', () => {
        it('should handle empty component name', () => {
            const gen = new ComponentGenerator({
                name: '',
                framework: 'react'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('export const');
        });

        it('should handle special characters in component name', () => {
            const gen = new ComponentGenerator({
                name: 'test-component',
                framework: 'react'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('TestComponent');
        });

        it('should handle hyphenated component names', () => {
            const gen = new ComponentGenerator({
                name: 'my-test-component',
                framework: 'react'
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('MyTestComponent');
        });

        it('should handle Vue with all features and Ant Design', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'vue',
                library: 'antd',
                styling: 'scss',
                features: { hooks: true, async: true }
            });

            const code = gen.generateVueComponent();

            expect(code).toContain('<script setup');
            expect(code).toContain('lang="scss"');
        });

        it('should handle React with Ant Design and form feature', () => {
            const gen = new ComponentGenerator({
                name: 'TestComponent',
                framework: 'react',
                library: 'antd',
                features: { form: true }
            });

            const code = gen.generateReactComponent();

            expect(code).toContain('antd');
            expect(code).toContain('Form.useForm');
        });

        it('should handle styles for hyphenated name', () => {
            const gen = new ComponentGenerator({
                name: 'test-component',
                framework: 'react',
                styling: 'css'
            });

            const styles = gen.generateStyles();

            expect(styles).toContain('.test-component');
        });

        it('should handle styles for PascalCase name', () => {
            const gen = new ComponentGenerator({
                name: 'MyComponent',
                framework: 'react',
                styling: 'css'
            });

            const styles = gen.generateStyles();

            expect(styles).toContain('.MyComponent');
        });
    });
});
