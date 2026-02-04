/**
 * UI Design Generator 单元测试
 */

import {
    generateColorScheme,
    generateLayoutSystem,
    generateTypography,
    generateUIDesign
} from '../../../skills/skills/ui-expert/scripts/ui-design-generator';

describe('UIDesignGenerator', () => {
    describe('generateUIDesign', () => {
        it('should generate UI design specification', () => {
            const input = {
                productName: '测试产品',
                theme: 'modern',
                platform: 'web',
                targetUsers: ['general users']
            };

            const result = generateUIDesign(input);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('colorScheme');
            expect(result).toHaveProperty('typography');
            expect(result).toHaveProperty('layout');
            expect(result).toHaveProperty('components');
        });

        it('should include color scheme', () => {
            const input = {
                productName: '测试产品',
                theme: 'modern'
            };

            const result = generateUIDesign(input);

            expect(result.colorScheme).toBeDefined();
            expect(result.colorScheme).toHaveProperty('primary');
            expect(result.colorScheme).toHaveProperty('secondary');
            expect(result.colorScheme).toHaveProperty('neutral');
        });

        it('should include typography', () => {
            const input = {
                productName: '测试产品',
                theme: 'modern'
            };

            const result = generateUIDesign(input);

            expect(result.typography).toBeDefined();
            expect(result.typography).toHaveProperty('fontFamily');
            expect(result.typography).toHaveProperty('sizes');
        });

        it('should include layout system', () => {
            const input = {
                productName: '测试产品',
                theme: 'modern'
            };

            const result = generateUIDesign(input);

            expect(result.layout).toBeDefined();
            expect(result.layout).toHaveProperty('grid');
            expect(result.layout).toHaveProperty('spacing');
        });

        it('should support different themes', () => {
            const themes = ['modern', 'classic', 'minimal', 'bold'];

            themes.forEach(theme => {
                const input = {
                    productName: '测试产品',
                    theme: theme as any
                };

                const result = generateUIDesign(input);
                expect(result).toBeDefined();
            });
        });

        it('should support different platforms', () => {
            const platforms = ['web', 'mobile', 'desktop'];

            platforms.forEach(platform => {
                const input = {
                    productName: '测试产品',
                    platform: platform as any
                };

                const result = generateUIDesign(input);
                expect(result).toBeDefined();
            });
        });
    });

    describe('generateColorScheme', () => {
        it('should generate color scheme', () => {
            const options = {
                style: 'modern',
                brandColor: '#007AFF'
            };

            const result = generateColorScheme(options);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('primary');
            expect(result).toHaveProperty('secondary');
            expect(result).toHaveProperty('accent');
            expect(result).toHaveProperty('neutral');
        });

        it('should include color variants', () => {
            const options = {
                style: 'modern',
                brandColor: '#007AFF'
            };

            const result = generateColorScheme(options);

            expect(result.primary).toHaveProperty('light');
            expect(result.primary).toHaveProperty('main');
            expect(result.primary).toHaveProperty('dark');
        });

        it('should include semantic colors', () => {
            const options = {
                style: 'modern'
            };

            const result = generateColorScheme(options);

            expect(result.semantic).toBeDefined();
            expect(result.semantic).toHaveProperty('success');
            expect(result.semantic).toHaveProperty('warning');
            expect(result.semantic).toHaveProperty('error');
            expect(result.semantic).toHaveProperty('info');
        });

        it('should support light and dark modes', () => {
            const options = {
                style: 'modern',
                modes: ['light', 'dark']
            };

            const result = generateColorScheme(options);

            expect(result.modes).toBeDefined();
            expect(result.modes).toHaveProperty('light');
            expect(result.modes).toHaveProperty('dark');
        });

        it('should generate accessible colors', () => {
            const options = {
                style: 'modern',
                accessibility: true
            };

            const result = generateColorScheme(options);

            expect(result.accessibility).toBeDefined();
            expect(result.accessibility).toHaveProperty('contrastRatios');
        });
    });

    describe('generateTypography', () => {
        it('should generate typography system', () => {
            const result = generateTypography();

            expect(result).toBeDefined();
            expect(result).toHaveProperty('xs');
            expect(result).toHaveProperty('sm');
            expect(result).toHaveProperty('base');
            expect(result).toHaveProperty('lg');
            expect(result).toHaveProperty('xl');
        });

        it('should include font sizes', () => {
            const result = generateTypography();

            expect(result).toBeDefined();
            expect(result.xs).toHaveProperty('fontSize');
            expect(result.sm).toHaveProperty('fontSize');
            expect(result.base).toHaveProperty('fontSize');
            expect(result.lg).toHaveProperty('fontSize');
            expect(result.xl).toHaveProperty('fontSize');
        });

        it('should include font weights', () => {
            const result = generateTypography();

            expect(result).toBeDefined();
            expect(result.xs).toHaveProperty('fontWeight');
            expect(result.sm).toHaveProperty('fontWeight');
            expect(result.base).toHaveProperty('fontWeight');
            expect(result.lg).toHaveProperty('fontWeight');
            expect(result.xl).toHaveProperty('fontWeight');
        });

        it('should include line heights', () => {
            const result = generateTypography();

            expect(result).toBeDefined();
            expect(result.xs).toHaveProperty('lineHeight');
            expect(result.sm).toHaveProperty('lineHeight');
            expect(result.base).toHaveProperty('lineHeight');
            expect(result.lg).toHaveProperty('lineHeight');
            expect(result.xl).toHaveProperty('lineHeight');
        });
    });

    describe('generateLayoutSystem', () => {
        it('should generate layout system', () => {
            const options = {
                type: 'grid',
                columns: 12
            };

            const result = generateLayoutSystem(options);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('grid');
            expect(result).toHaveProperty('spacing');
            expect(result).toHaveProperty('breakpoints');
            expect(result).toHaveProperty('containers');
        });

        it('should include grid system', () => {
            const options = {
                type: 'grid',
                columns: 12
            };

            const result = generateLayoutSystem(options);

            expect(result.grid).toBeDefined();
            expect(result.grid).toHaveProperty('columns');
            expect(result.grid).toHaveProperty('gap');
            expect(result.grid).toHaveProperty('maxWidth');
        });

        it('should include spacing scale', () => {
            const options = {
                type: 'grid'
            };

            const result = generateLayoutSystem(options);

            expect(result.spacing).toBeDefined();
            expect(result.spacing).toHaveProperty('unit');
            expect(result.spacing).toHaveProperty('scale');
        });

        it('should include breakpoints', () => {
            const options = {
                type: 'grid'
            };

            const result = generateLayoutSystem(options);

            expect(result.breakpoints).toBeDefined();
            expect(result.breakpoints).toHaveProperty('xs');
            expect(result.breakpoints).toHaveProperty('sm');
            expect(result.breakpoints).toHaveProperty('md');
            expect(result.breakpoints).toHaveProperty('lg');
            expect(result.breakpoints).toHaveProperty('xl');
        });

        it('should include container sizes', () => {
            const options = {
                type: 'grid'
            };

            const result = generateLayoutSystem(options);

            expect(result.containers).toBeDefined();
            expect(result.containers).toHaveProperty('sm');
            expect(result.containers).toHaveProperty('md');
            expect(result.containers).toHaveProperty('lg');
            expect(result.containers).toHaveProperty('xl');
        });

        it('should support different layout types', () => {
            const types = ['grid', 'flexbox', 'absolute'];

            types.forEach(type => {
                const options = {
                    type: type as any
                };

                const result = generateLayoutSystem(options);
                expect(result).toBeDefined();
            });
        });
    });

    // ========================================================================
    // 额外的覆盖率测试
    // ========================================================================

    describe('Additional Coverage Tests', () => {
        describe('generateColorSystem', () => {
            const { generateColorSystem } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should generate complete color system with all color types', () => {
                const baseColor = '#1890ff';
                const result = generateColorSystem(baseColor);

                expect(result).toBeDefined();
                expect(result).toHaveProperty('primary');
                expect(result).toHaveProperty('secondary');
                expect(result).toHaveProperty('neutral');
                expect(result).toHaveProperty('success');
                expect(result).toHaveProperty('warning');
                expect(result).toHaveProperty('error');
            });

            it('should generate all shades for primary color', () => {
                const baseColor = '#1890ff';
                const result = generateColorSystem(baseColor);

                const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
                shades.forEach(shade => {
                    expect(result.primary).toHaveProperty(shade.toString());
                    expect(result.primary[shade]).toMatch(/^#[0-9a-fA-F]{6}$/);
                });
            });

            it('should generate neutral color shades', () => {
                const baseColor = '#1890ff';
                const result = generateColorSystem(baseColor);

                expect(result.neutral[50]).toBe('#fafafa');
                expect(result.neutral[500]).toBe('#8c8c8c');
                expect(result.neutral[900]).toBe('#1f1f1f');
            });

            it('should generate success color shades', () => {
                const baseColor = '#1890ff';
                const result = generateColorSystem(baseColor);

                expect(result.success[50]).toBe('#f6ffed');
                expect(result.success[500]).toBe('#52c41a');
                expect(result.success[900]).toBe('#092b00');
            });

            it('should generate warning color shades', () => {
                const baseColor = '#1890ff';
                const result = generateColorSystem(baseColor);

                expect(result.warning[50]).toBe('#fffbe6');
                expect(result.warning[500]).toBe('#faad14');
                expect(result.warning[900]).toBe('#613400');
            });

            it('should generate error color shades', () => {
                const baseColor = '#1890ff';
                const result = generateColorSystem(baseColor);

                expect(result.error[50]).toBe('#fff1f0');
                expect(result.error[500]).toBe('#f5222d');
                expect(result.error[900]).toBe('#5c0011');
            });
        });

        describe('generateSpacing', () => {
            const { generateSpacing } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should generate spacing system based on 4px unit', () => {
                const result = generateSpacing();

                expect(result).toBeDefined();
                expect(result[0]).toBe('0px');
                expect(result[1]).toBe('4px');
                expect(result[2]).toBe('8px');
                expect(result[4]).toBe('16px');
            });

            it('should generate all standard spacing sizes', () => {
                const result = generateSpacing();

                const sizes = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
                sizes.forEach(size => {
                    expect(result).toHaveProperty(size.toString());
                    expect(result[size]).toBe(`${size * 4}px`);
                });
            });
        });

        describe('generateComponentTemplate', () => {
            const { generateComponentTemplate } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should generate component template with basic props', () => {
                const props = [
                    { name: 'label', type: 'string', required: true, description: 'Button label' },
                    { name: 'onClick', type: 'function', required: false, description: 'Click handler' }
                ];

                const result = generateComponentTemplate(
                    'Button',
                    'A clickable button component',
                    props
                );

                expect(result).toBeDefined();
                expect(result.name).toBe('Button');
                expect(result.description).toBe('A clickable button component');
                expect(result.props).toEqual(props);
                expect(result.category).toBe('general');
            });

            it('should support custom category', () => {
                const result = generateComponentTemplate(
                    'DataTable',
                    'A data table component',
                    [],
                    [],
                    [],
                    'data'
                );

                expect(result.category).toBe('data');
            });

            it('should include variants', () => {
                const variants = [
                    { name: 'primary', description: 'Primary button', props: { type: 'primary' } },
                    { name: 'secondary', description: 'Secondary button', props: { type: 'secondary' } }
                ];

                const result = generateComponentTemplate(
                    'Button',
                    'A button',
                    [],
                    variants
                );

                expect(result.variants).toEqual(variants);
                expect(result.variants.length).toBe(2);
            });

            it('should include examples', () => {
                const examples = [
                    { name: 'Basic', description: 'Basic usage', code: '<Button>Click</Button>' },
                    { name: 'With Icon', description: 'With icon', code: '<Button icon="star">Star</Button>' }
                ];

                const result = generateComponentTemplate(
                    'Button',
                    'A button',
                    [],
                    [],
                    examples
                );

                expect(result.examples).toEqual(examples);
                expect(result.examples.length).toBe(2);
            });
        });

        describe('generateReactComponentCode', () => {
            const { generateReactComponentCode, generateComponentTemplate } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should generate React component code with props interface', () => {
                const template = generateComponentTemplate(
                    'Button',
                    'A button component',
                    [
                        { name: 'label', type: 'string', required: true, description: 'Button label' },
                        { name: 'disabled', type: 'boolean', required: false, description: 'Is disabled' }
                    ]
                );

                const code = generateReactComponentCode(template);

                expect(code).toContain('interface ButtonProps');
                expect(code).toContain('label: string;');
                expect(code).toContain('disabled?: boolean;');
                expect(code).toContain('export const Button: React.FC<ButtonProps>');
            });

            it('should include prop descriptions as comments', () => {
                const template = generateComponentTemplate(
                    'Input',
                    'An input component',
                    [
                        { name: 'value', type: 'string', required: true, description: 'Input value' },
                        { name: 'onChange', type: 'function', required: true, description: 'Change handler' }
                    ]
                );

                const code = generateReactComponentCode(template);

                expect(code).toContain('// Input value');
                expect(code).toContain('// Change handler');
            });

            it('should handle components with variants', () => {
                const template = generateComponentTemplate(
                    'Alert',
                    'An alert component',
                    [{ name: 'message', type: 'string', required: true, description: 'Alert message' }],
                    [
                        { name: 'success', description: 'Success alert', props: { type: 'success' } },
                        { name: 'error', description: 'Error alert', props: { type: 'error' } }
                    ]
                );

                const code = generateReactComponentCode(template);

                expect(code).toContain('success:');
                expect(code).toContain('error:');
            });
        });

        describe('generatePageTemplate', () => {
            const { generatePageTemplate } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should generate page template with components', () => {
                const result = generatePageTemplate(
                    'HomePage',
                    'Main home page',
                    ['Header', 'Hero', 'Footer'],
                    'flex'
                );

                expect(result).toBeDefined();
                expect(result.name).toBe('HomePage');
                expect(result.description).toBe('Main home page');
                expect(result.components).toEqual(['Header', 'Hero', 'Footer']);
                expect(result.layout).toBe('flex');
            });

            it('should generate HTML example with page structure', () => {
                const result = generatePageTemplate(
                    'Dashboard',
                    'Dashboard page',
                    ['Sidebar', 'MainContent'],
                    'grid'
                );

                expect(result.example).toContain('<div class="page page-dashboard">');
                expect(result.example).toContain('<header class="page-header">');
                expect(result.example).toContain('<main class="page-content">');
                expect(result.example).toContain('<!-- Sidebar -->');
                expect(result.example).toContain('<!-- MainContent -->');
                expect(result.example).toContain('<footer class="page-footer">');
            });

            it('should handle empty components list', () => {
                const result = generatePageTemplate(
                    'EmptyPage',
                    'Empty page',
                    [],
                    'default'
                );

                expect(result.components).toEqual([]);
                expect(result.example).toContain('<main class="page-content">');
            });
        });

        describe('generateDesignSystemDoc', () => {
            const { generateDesignSystemDoc, generateColorSystem, generateTypography, generateSpacing } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should generate design system documentation', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {
                        sm: '2px',
                        md: '4px',
                        lg: '8px'
                    },
                    shadows: {
                        sm: '0 1px 2px rgba(0,0,0,0.1)',
                        md: '0 2px 4px rgba(0,0,0,0.1)'
                    },
                    components: []
                };

                const doc = generateDesignSystemDoc(designSystem);

                expect(doc).toContain('# 设计规范');
                expect(doc).toContain('## 颜色系统');
                expect(doc).toContain('## 字体系统');
                expect(doc).toContain('## 间距系统');
            });

            it('should include color table', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const doc = generateDesignSystemDoc(designSystem);

                expect(doc).toContain('| 类型 | 色阶 |');
                expect(doc).toContain('| primary |');
                expect(doc).toContain('| neutral |');
            });

            it('should include typography table', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const doc = generateDesignSystemDoc(designSystem);

                expect(doc).toContain('| 尺寸 | 大小 | 字重 | 行高 |');
            });

            it('should include spacing table', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const doc = generateDesignSystemDoc(designSystem);

                expect(doc).toContain('| 尺寸 | 值 |');
            });

            it('should include border radius sections', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {
                        sm: '2px',
                        md: '4px',
                        lg: '8px'
                    },
                    shadows: {},
                    components: []
                };

                const doc = generateDesignSystemDoc(designSystem);

                expect(doc).toContain('## 圆角');
                expect(doc).toContain('### sm');
                expect(doc).toContain('`2px`');
            });

            it('should include shadow sections', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {
                        sm: '0 1px 2px rgba(0,0,0,0.1)',
                        lg: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    components: []
                };

                const doc = generateDesignSystemDoc(designSystem);

                expect(doc).toContain('## 阴影');
                expect(doc).toContain('### sm');
                expect(doc).toContain('`0 1px 2px rgba(0,0,0,0.1)`');
            });

            it('should include components section', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: [
                        {
                            name: 'Button',
                            category: 'basic',
                            description: 'A button component',
                            props: [
                                { name: 'label', type: 'string', required: true, description: 'Button label' }
                            ],
                            variants: [],
                            examples: []
                        }
                    ]
                };

                const doc = generateDesignSystemDoc(designSystem);

                expect(doc).toContain('## 组件库');
                expect(doc).toContain('### Button');
                expect(doc).toContain('A button component');
                expect(doc).toContain('**属性**：');
                expect(doc).toContain('- `label`: string - Button label');
            });
        });

        describe('generateCSSVariables', () => {
            const { generateCSSVariables, generateColorSystem, generateTypography, generateSpacing } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should generate CSS variables', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const css = generateCSSVariables(designSystem);

                expect(css).toContain(':root {');
                expect(css).toContain('/* 颜色系统 */');
                expect(css).toContain('/* 字体系统 */');
                expect(css).toContain('/* 间距系统 */');
                expect(css).toContain('}');
            });

            it('should generate color variables', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const css = generateCSSVariables(designSystem);

                expect(css).toContain('--color-primary-50:');
                expect(css).toContain('--color-primary-500:');
                expect(css).toContain('--color-neutral-500:');
                expect(css).toContain('--color-success-500:');
            });

            it('should generate typography variables', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const css = generateCSSVariables(designSystem);

                expect(css).toContain('--font-size-');
                expect(css).toContain('--font-weight-');
                expect(css).toContain('--line-height-');
            });

            it('should generate spacing variables', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const css = generateCSSVariables(designSystem);

                expect(css).toContain('--spacing-0: 0px;');
                expect(css).toContain('--spacing-4: 16px;');
                expect(css).toContain('--spacing-8: 32px;');
            });
        });

        describe('validateDesignSystem', () => {
            const { validateDesignSystem, generateColorSystem, generateTypography, generateSpacing } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should validate complete design system', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const result = validateDesignSystem(designSystem);

                expect(result.isValid).toBe(true);
                expect(result.errors).toEqual([]);
            });

            it('should detect missing color types', () => {
                const designSystem = {
                    colors: {
                        primary: {} as any
                        // Missing other color types
                    },
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const result = validateDesignSystem(designSystem);

                expect(result.isValid).toBe(false);
                expect(result.errors.length).toBeGreaterThan(0);
                expect(result.errors.some((e: string) => e.includes('secondary'))).toBe(true);
            });

            it('should detect empty typography', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: {} as any,
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const result = validateDesignSystem(designSystem);

                expect(result.isValid).toBe(false);
                expect(result.errors.some((e: string) => e.includes('字体系统'))).toBe(true);
            });

            it('should detect empty spacing', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: {} as any,
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const result = validateDesignSystem(designSystem);

                expect(result.isValid).toBe(false);
                expect(result.errors.some((e: string) => e.includes('间距系统'))).toBe(true);
            });

            it('should warn about empty components', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: []
                };

                const result = validateDesignSystem(designSystem);

                expect(result.warnings.length).toBeGreaterThan(0);
                expect(result.warnings.some((w: string) => w.includes('组件'))).toBe(true);
            });

            it('should return all validation results', () => {
                const designSystem = {
                    colors: generateColorSystem('#1890ff'),
                    typography: generateTypography(),
                    spacing: generateSpacing(),
                    borderRadius: {},
                    shadows: {},
                    components: [
                        {
                            name: 'Button',
                            category: 'basic',
                            description: 'A button',
                            props: [],
                            variants: [],
                            examples: []
                        }
                    ]
                };

                const result = validateDesignSystem(designSystem);

                expect(result).toHaveProperty('isValid');
                expect(result).toHaveProperty('errors');
                expect(result).toHaveProperty('warnings');
                expect(result.isValid).toBe(true);
            });
        });

        describe('generateVueComponentCode', () => {
            const { generateVueComponentCode, generateComponentTemplate } = require('../../../skills/skills/ui-expert/scripts/ui-design-generator');

            it('should generate Vue component code with props definition', () => {
                const template = generateComponentTemplate(
                    'Card',
                    'A card component',
                    [
                        { name: 'title', type: 'String', required: true, description: 'Card title' },
                        { name: 'description', type: 'String', required: false, description: 'Card description' }
                    ]
                );

                const code = generateVueComponentCode(template);

                expect(code).toContain('<template>');
                expect(code).toContain('<div class="card">');
                expect(code).toContain('<script setup lang="ts">');
                expect(code).toContain('title: { type: String, required: true');
                expect(code).toContain('description: { type: String, required: false');
            });

            it('should include prop descriptions as comments', () => {
                const template = generateComponentTemplate(
                    'Badge',
                    'A badge component',
                    [
                        { name: 'count', type: 'Number', required: true, description: 'Badge count' },
                        { name: 'maxCount', type: 'Number', required: false, default: '99', description: 'Max count to display' }
                    ]
                );

                const code = generateVueComponentCode(template);

                expect(code).toContain('// Badge count');
                expect(code).toContain('// Max count to display');
            });

            it('should include default values', () => {
                const template = generateComponentTemplate(
                    'Tooltip',
                    'A tooltip component',
                    [
                        { name: 'placement', type: 'String', required: false, default: "'top'", description: 'Tooltip placement' }
                    ]
                );

                const code = generateVueComponentCode(template);

                expect(code).toContain("default: 'top'");
            });

            it('should handle components without default values', () => {
                const template = generateComponentTemplate(
                    'Icon',
                    'An icon component',
                    [
                        { name: 'name', type: 'String', required: true, description: 'Icon name' }
                    ]
                );

                const code = generateVueComponentCode(template);

                expect(code).toContain('default: undefined');
            });
        });
    });
});
