/**
 * Prototype Builder 单元测试
 */

import {
    buildPrototype,
    exportPrototype,
    generateComponent,
    generateWireframe
} from '../../../skills/skills/ui-expert/scripts/prototype-builder';

describe('PrototypeBuilder', () => {
    describe('buildPrototype', () => {
        it('should build UI prototype', () => {
            const config = {
                pages: [
                    {
                        name: 'Home',
                        components: ['Header', 'Hero', 'Footer']
                    },
                    {
                        name: 'About',
                        components: ['Header', 'Content', 'Footer']
                    }
                ],
                theme: 'modern'
            };

            const result = buildPrototype(config);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('pages');
            expect(result).toHaveProperty('components');
            expect(result).toHaveProperty('structure');
        });

        it('should include all pages', () => {
            const config = {
                pages: [
                    { name: 'Home', components: [] },
                    { name: 'About', components: [] }
                ]
            };

            const result = buildPrototype(config);

            expect(result.pages.length).toBe(2);
            expect(result.pages[0].name).toBe('Home');
            expect(result.pages[1].name).toBe('About');
        });

        it('should build component tree', () => {
            const config = {
                pages: [
                    {
                        name: 'Home',
                        components: [
                            { name: 'Header', children: ['Logo', 'Navigation'] },
                            { name: 'Hero', children: [] }
                        ]
                    }
                ]
            };

            const result = buildPrototype(config);

            expect(result.components).toBeDefined();
            expect(result.components.length).toBeGreaterThan(0);
        });

        it('should apply theme', () => {
            const config = {
                pages: [],
                theme: 'modern'
            };

            const result = buildPrototype(config);

            expect(result.theme).toBeDefined();
            expect(result.theme).toBe('modern');
        });
    });

    describe('generateComponent', () => {
        it('should generate component', () => {
            const definition = {
                name: 'Button',
                type: 'button' as const,
                props: {
                    label: '提交',
                    primary: true
                },
                content: '按钮文本'
            };

            const result = generateComponent(definition);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('html');
            expect(result).toHaveProperty('css');
            expect(result).toHaveProperty('js');
        });

        it('should generate HTML structure for button', () => {
            const definition = {
                name: 'SubmitButton',
                type: 'button' as const,
                props: {
                    label: '提交',
                    primary: true
                }
            };

            const result = generateComponent(definition);

            expect(result.html).toBeDefined();
            expect(result.html).toContain('<button');
            expect(result.html).toContain('提交');
        });

        it('should generate CSS styles', () => {
            const definition = {
                name: 'Card',
                type: 'card' as const,
                props: {
                    title: '卡片标题'
                },
                content: '卡片内容'
            };

            const result = generateComponent(definition);

            expect(result.css).toBeDefined();
            expect(result.css).toContain('card');
        });

        it('should generate component with proper types', () => {
            const types: Array<'button' | 'input' | 'card' | 'modal' | 'navigation' | 'form' | 'table' | 'dropdown'> = ['button', 'input', 'card', 'modal'];

            types.forEach(type => {
                const definition = {
                    name: 'TestComponent',
                    type: type,
                    props: {}
                };

                const result = generateComponent(definition);
                expect(result).toBeDefined();
                expect(result.html).toBeDefined();
            });
        });
    });

    describe('generateWireframe', () => {
        it('should generate wireframe', () => {
            const page = {
                name: 'Home',
                path: '/home',
                layout: 'default' as const,
                components: [
                    {
                        name: 'Card',
                        type: 'card' as const,
                        props: { title: 'Test Card' },
                        content: 'Content'
                    }
                ]
            };

            const result = generateWireframe(page);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('html');
            expect(result).toHaveProperty('css');
            expect(result).toHaveProperty('js');
        });

        it('should include layout structure', () => {
            const page = {
                name: 'Dashboard',
                path: '/dashboard',
                layout: 'sidebar' as const,
                components: [
                    {
                        name: 'Stat',
                        type: 'card' as const,
                        props: { title: 'Stats' },
                        content: '100'
                    }
                ]
            };

            const result = generateWireframe(page);

            expect(result.html).toContain('<aside');
            expect(result.html).toContain('<main');
        });

        it('should include component placeholders', () => {
            const page = {
                name: 'Page',
                path: '/page',
                layout: 'fullscreen' as const,
                components: [
                    {
                        name: 'Hero',
                        type: 'card' as const,
                        content: 'Hero Content'
                    }
                ]
            };

            const result = generateWireframe(page);

            expect(result.html).toContain('Hero Content');
        });
    });

    describe('exportPrototype', () => {
        it('should export single page prototype', () => {
            const prototype = {
                name: 'Home',
                path: '/home',
                layout: 'default' as const,
                components: [
                    {
                        name: 'Card',
                        type: 'card' as const,
                        props: { title: 'Card' },
                        content: 'Content'
                    }
                ]
            };

            const result = exportPrototype(prototype, 'html');

            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.format).toBe('html');
            expect(result.files).toBeDefined();
        });

        it('should export multi-page prototype', () => {
            const prototype = {
                pages: [
                    {
                        name: 'Home',
                        path: '/home',
                        layout: 'default' as const,
                        components: [
                            {
                                name: 'Card',
                                type: 'card' as const,
                                props: { title: 'Home Card' },
                                content: 'Home Content'
                            }
                        ]
                    },
                    {
                        name: 'About',
                        path: '/about',
                        layout: 'default' as const,
                        components: [
                            {
                                name: 'Card',
                                type: 'card' as const,
                                props: { title: 'About Card' },
                                content: 'About Content'
                            }
                        ]
                    }
                ]
            };

            const result = exportPrototype(prototype, 'html');

            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.files?.length).toBeGreaterThan(0);
        });

        it('should generate multiple files for single page', () => {
            const prototype = {
                name: 'Page',
                path: '/page',
                layout: 'default' as const,
                components: []
            };

            const result = exportPrototype(prototype, 'html');

            expect(result.files).toBeDefined();
            expect(result.files?.some((f: { type: string }) => f.type === 'html')).toBe(true);
            expect(result.files?.some((f: { type: string }) => f.type === 'css')).toBe(true);
            expect(result.files?.some((f: { type: string }) => f.type === 'js')).toBe(true);
        });

        it('should export prototype in JSON format', () => {
            const prototype = {
                name: 'Page',
                path: '/page',
                layout: 'default' as const,
                components: []
            };

            const result = exportPrototype(prototype, 'json');

            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.format).toBe('json');
        });

        it('should export multi-page prototype in JSON format', () => {
            const prototype = {
                pages: [
                    {
                        name: 'Home',
                        path: '/home',
                        layout: 'default' as const,
                        components: []
                    }
                ]
            };

            const result = exportPrototype(prototype, 'json');

            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.format).toBe('json');
        });
    });

    describe('Additional Coverage Tests', () => {
        describe('Different Layouts', () => {
            it('should generate sidebar layout', () => {
                const page = {
                    name: 'Dashboard',
                    path: '/dashboard',
                    layout: 'sidebar' as const,
                    components: [
                        {
                            name: 'Card',
                            type: 'card' as const,
                            props: { title: 'Stats' },
                            content: '100'
                        }
                    ]
                };

                const result = generateWireframe(page);

                expect(result.html).toContain('<aside');
                expect(result.html).toContain('sidebar');
            });

            it('should generate topbar layout', () => {
                const page = {
                    name: 'Marketing',
                    path: '/marketing',
                    layout: 'topbar' as const,
                    components: [
                        {
                            name: 'Hero',
                            type: 'card' as const,
                            props: { title: 'Welcome' },
                            content: 'Hero section'
                        }
                    ]
                };

                const result = generateWireframe(page);

                expect(result.html).toContain('<nav');
                expect(result.html).toContain('topbar');
            });

            it('should generate fullscreen layout', () => {
                const page = {
                    name: 'Presentation',
                    path: '/presentation',
                    layout: 'fullscreen' as const,
                    components: [
                        {
                            name: 'Content',
                            type: 'card' as const,
                            content: 'Fullscreen content'
                        }
                    ]
                };

                const result = generateWireframe(page);

                expect(result.html).toContain('fullscreen');
            });
        });

        describe('Component Types', () => {
            it('should generate navigation component', () => {
                const component = {
                    name: 'MainNav',
                    type: 'navigation' as const,
                    props: {
                        items: [
                            { label: 'Home', href: '/', active: true },
                            { label: 'About', href: '/about', active: false }
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('navigation');
                expect(result.html).toContain('Home');
                expect(result.html).toContain('About');
                expect(result.html).toContain('active');
            });

            it('should generate form component', () => {
                const component = {
                    name: 'ContactForm',
                    type: 'form' as const,
                    props: {
                        fields: [
                            { name: 'name', label: 'Name', placeholder: 'Enter name', required: true },
                            { name: 'email', label: 'Email', placeholder: 'Enter email', required: true }
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('<form');
                expect(result.html).toContain('Name');
                expect(result.html).toContain('Email');
                expect(result.html).toContain('required');
            });

            it('should generate table component', () => {
                const component = {
                    name: 'DataTable',
                    type: 'table' as const,
                    props: {
                        columns: ['ID', 'Name', 'Email'],
                        rows: [
                            ['1', 'John', 'john@example.com'],
                            ['2', 'Jane', 'jane@example.com']
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('<table');
                expect(result.html).toContain('<thead');
                expect(result.html).toContain('<tbody');
                expect(result.html).toContain('ID');
                expect(result.html).toContain('Name');
                expect(result.html).toContain('John');
                expect(result.html).toContain('Jane');
            });

            it('should generate dropdown component', () => {
                const component = {
                    name: 'Menu',
                    type: 'dropdown' as const,
                    props: {
                        placeholder: 'Select option',
                        options: ['Option 1', 'Option 2', 'Option 3']
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('dropdown');
                expect(result.html).toContain('Select option');
                expect(result.html).toContain('Option 1');
                expect(result.html).toContain('Option 2');
            });

            it('should generate modal component', () => {
                const component = {
                    name: 'ConfirmModal',
                    type: 'modal' as const,
                    props: {
                        title: 'Confirm Action'
                    },
                    content: 'Are you sure?'
                };

                const result = generateComponent(component);

                expect(result.html).toContain('modal');
                expect(result.html).toContain('Confirm Action');
                expect(result.html).toContain('Are you sure?');
            });

            it('should generate input component with label', () => {
                const component = {
                    name: 'UsernameInput',
                    type: 'input' as const,
                    props: {
                        label: 'Username',
                        placeholder: 'Enter username',
                        required: true
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('<input');
                expect(result.html).toContain('Username');
                expect(result.html).toContain('Enter username');
                expect(result.html).toContain('required');
            });

            it('should generate button with different sizes', () => {
                const sizes = ['sm', 'medium', 'lg'];

                sizes.forEach(size => {
                    const component = {
                        name: 'TestButton',
                        type: 'button' as const,
                        props: {
                            label: 'Click me',
                            size: size
                        }
                    };

                    const result = generateComponent(component);
                    expect(result.html).toContain(`btn-${size}`);
                });
            });

            it('should generate card with title and footer', () => {
                const component = {
                    name: 'InfoCard',
                    type: 'card' as const,
                    props: {
                        title: 'Card Title',
                        footer: 'Card Footer'
                    },
                    content: 'Card Body'
                };

                const result = generateComponent(component);

                expect(result.html).toContain('Card Title');
                expect(result.html).toContain('Card Body');
                expect(result.html).toContain('Card Footer');
            });
        });

        describe('Component Properties', () => {
            it('should handle button without primary prop', () => {
                const component = {
                    name: 'SecondaryButton',
                    type: 'button' as const,
                    props: {
                        label: 'Secondary',
                        primary: false
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('Secondary');
            });

            it('should handle input without label', () => {
                const component = {
                    name: 'SimpleInput',
                    type: 'input' as const,
                    props: {
                        placeholder: 'Type here'
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('Type here');
            });

            it('should handle navigation without active items', () => {
                const component = {
                    name: 'Nav',
                    type: 'navigation' as const,
                    props: {
                        items: [
                            { label: 'Link1', href: '/link1' },
                            { label: 'Link2', href: '/link2' }
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('Link1');
                expect(result.html).toContain('Link2');
            });

            it('should handle empty table', () => {
                const component = {
                    name: 'EmptyTable',
                    type: 'table' as const,
                    props: {
                        columns: [],
                        rows: []
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('<table');
            });

            it('should handle empty dropdown', () => {
                const component = {
                    name: 'EmptyDropdown',
                    type: 'dropdown' as const,
                    props: {
                        options: []
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('dropdown');
            });

            it('should handle default component type', () => {
                const component = {
                    name: 'CustomComponent',
                    type: 'unknown' as any,
                    content: 'Custom content'
                };

                const result = generateComponent(component);

                expect(result.html).toContain('Custom content');
            });
        });

        describe('Multi-page Prototypes', () => {
            it('should build prototype with multiple pages and different layouts', () => {
                const config = {
                    pages: [
                        {
                            name: 'Home',
                            path: '/',
                            layout: 'topbar' as const,
                            components: [
                                { name: 'Hero', type: 'card' as const, content: 'Welcome' }
                            ]
                        },
                        {
                            name: 'Dashboard',
                            path: '/dashboard',
                            layout: 'sidebar' as const,
                            components: [
                                { name: 'Stats', type: 'card' as const, content: '100' }
                            ]
                        }
                    ],
                    theme: 'modern'
                };

                const result = buildPrototype(config);

                expect(result.pages.length).toBe(2);
                expect(result.pages[0].name).toBe('Home');
                expect(result.pages[1].name).toBe('Dashboard');
                expect(result.theme).toBe('modern');
            });
        });

        describe('Edge Cases', () => {
            it('should handle prototype with no components', () => {
                const prototype = {
                    name: 'EmptyPage',
                    path: '/empty',
                    layout: 'default' as const,
                    components: []
                };

                const result = exportPrototype(prototype, 'html');

                expect(result.success).toBe(true);
            });

            it('should handle component without props', () => {
                const component = {
                    name: 'SimpleCard',
                    type: 'card' as const
                };

                const result = generateComponent(component);

                expect(result.html).toBeDefined();
            });

            it('should handle empty navigation items', () => {
                const component = {
                    name: 'EmptyNav',
                    type: 'navigation' as const,
                    props: {
                        items: []
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('navigation');
            });

            it('should handle form with empty fields', () => {
                const component = {
                    name: 'EmptyForm',
                    type: 'form' as const,
                    props: {
                        fields: []
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('<form');
            });
        });

        describe('Component Styles', () => {
            it('should generate component with custom styles', () => {
                const component = {
                    name: 'StyledCard',
                    type: 'card' as const,
                    props: { title: 'Styled' },
                    content: 'Content',
                    styles: {
                        backgroundColor: '#f0f0f0',
                        borderWidth: '2px',
                        marginTop: '1rem'
                    }
                };

                const result = generateComponent(component);

                expect(result.css).toContain('styledcard');
                expect(result.css).toContain('background-color');
                expect(result.css).toContain('border-width');
                expect(result.css).toContain('margin-top');
            });

            it('should handle component without styles', () => {
                const component = {
                    name: 'NoStyle',
                    type: 'button' as const,
                    props: { label: 'Test' }
                };

                const result = generateComponent(component);

                expect(result.css).toBeDefined();
            });
        });

        describe('CLI Functionality', () => {
            it('should support PrototypeBuilder class instantiation', () => {
                const { PrototypeBuilder } = require('../../../skills/skills/ui-expert/scripts/prototype-builder');
                const builder = new PrototypeBuilder();

                const page = {
                    name: 'Test Page',
                    path: '/test',
                    layout: 'default' as const,
                    components: [
                        {
                            name: 'TestCard',
                            type: 'card' as const,
                            props: { title: 'Test' },
                            content: 'Content'
                        }
                    ]
                };

                const result = builder.generatePagePrototype(page);

                expect(result).toContain('<!DOCTYPE html>');
                expect(result).toContain('Test Page');
            });

            it('should support custom design system', () => {
                const { PrototypeBuilder } = require('../../../skills/skills/ui-expert/scripts/prototype-builder');
                const customDesignSystem = {
                    colors: {
                        primary: '#ff0000',
                        secondary: '#00ff00'
                    },
                    typography: {
                        fontFamily: 'Arial',
                        fontSize: { base: '16px' },
                        lineHeight: { normal: '1.5' }
                    },
                    spacing: { md: '1rem' },
                    borderRadius: { md: '4px' },
                    shadows: { sm: '0 1px 2px rgba(0,0,0,0.1)' }
                };

                const builder = new PrototypeBuilder(customDesignSystem);
                const page = {
                    name: 'Custom Page',
                    path: '/custom',
                    layout: 'default' as const,
                    components: []
                };

                const result = builder.generatePagePrototype(page);

                expect(result).toContain('#ff0000');
                expect(result).toContain('Arial');
            });
        });

        describe('Interactive Component Types', () => {
            it('should generate interactive component type', () => {
                const component = {
                    name: 'Interactive',
                    type: 'interactive' as const,
                    content: 'Interactive content'
                };

                const result = generateComponent(component);

                expect(result.html).toContain('interactive');
                expect(result.html).toContain('Interactive content');
            });

            it('should generate display component type', () => {
                const component = {
                    name: 'Display',
                    type: 'display' as const,
                    content: 'Display content'
                };

                const result = generateComponent(component);

                expect(result.html).toContain('display');
                expect(result.html).toContain('Display content');
            });

            it('should handle default component without content', () => {
                const component = {
                    name: 'Unknown',
                    type: 'interactive' as const
                };

                const result = generateComponent(component);

                expect(result.html).toContain('unknown');
            });
        });

        describe('Navigation with Active Items', () => {
            it('should handle navigation with active items', () => {
                const component = {
                    name: 'ActiveNav',
                    type: 'navigation' as const,
                    props: {
                        items: [
                            { href: '/home', label: 'Home', active: true },
                            { href: '/about', label: 'About', active: false }
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('active');
                expect(result.html).toContain('/home');
            });
        });

        describe('Table with Data', () => {
            it('should generate table with columns and rows', () => {
                const component = {
                    name: 'DataTable',
                    type: 'table' as const,
                    props: {
                        columns: ['Name', 'Age', 'City'],
                        rows: [
                            ['Alice', '25', 'NYC'],
                            ['Bob', '30', 'LA']
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('<table');
                expect(result.html).toContain('Name');
                expect(result.html).toContain('Alice');
                expect(result.html).toContain('Bob');
            });
        });

        describe('Form with Multiple Fields', () => {
            it('should generate form with multiple fields', () => {
                const component = {
                    name: 'ContactForm',
                    type: 'form' as const,
                    props: {
                        fields: [
                            { name: 'name', label: 'Name', placeholder: 'Your name', required: true },
                            { name: 'email', label: 'Email', placeholder: 'Your email', required: true },
                            { name: 'message', label: 'Message', placeholder: 'Your message', required: false }
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('name');
                expect(result.html).toContain('email');
                expect(result.html).toContain('message');
            });
        });

        describe('Dropdown with Options', () => {
            it('should generate dropdown with multiple options', () => {
                const component = {
                    name: 'CountrySelect',
                    type: 'dropdown' as const,
                    props: {
                        options: ['USA', 'Canada', 'UK'],
                        placeholder: 'Select a country'
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('USA');
                expect(result.html).toContain('Canada');
                expect(result.html).toContain('UK');
            });
        });

        describe('CSS/JS Extraction Edge Cases', () => {
            it('should handle missing CSS in HTML', () => {
                const { PrototypeBuilder } = require('../../../skills/skills/ui-expert/scripts/prototype-builder');

                // Mock a scenario where HTML has no style tag
                const builder = new PrototypeBuilder();
                const page = {
                    name: 'Test',
                    path: '/test',
                    layout: 'fullscreen' as const,
                    components: []
                };

                const html = builder.generatePagePrototype(page);
                expect(html).toBeDefined();
            });

            it('should use custom design system in generateComponent', () => {
                const customDesign = {
                    colors: { primary: '#123456' },
                    typography: { fontFamily: 'Custom', fontSize: { base: '14px' }, lineHeight: { normal: '1.4' } },
                    spacing: { md: '8px' },
                    borderRadius: { md: '3px' },
                    shadows: { sm: '0 1px 1px' }
                };

                const component = {
                    name: 'Custom',
                    type: 'button' as const,
                    props: { label: 'Click' }
                };

                const result = generateComponent(component, customDesign);

                expect(result.css).toContain('#123456');
            });

            it('should use custom design system in generateWireframe', () => {
                const customDesign = {
                    colors: { primary: '#654321' },
                    typography: { fontFamily: 'Wire', fontSize: { base: '12px' }, lineHeight: { normal: '1.2' } },
                    spacing: { md: '6px' },
                    borderRadius: { md: '2px' },
                    shadows: { sm: '0 0 1px' }
                };

                const page = {
                    name: 'Wireframe',
                    path: '/wire',
                    layout: 'default' as const,
                    components: [
                        {
                            name: 'Wire',
                            type: 'card' as const,
                            content: 'Wire'
                        }
                    ]
                };

                const result = generateWireframe(page, customDesign);

                expect(result.css).toContain('#654321');
            });
        });

        describe('Navigation Item Active State', () => {
            it('should handle navigation items without active property', () => {
                const component = {
                    name: 'Nav',
                    type: 'navigation' as const,
                    props: {
                        items: [
                            { href: '/home', label: 'Home' },
                            { href: '/about', label: 'About' }
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('/home');
                expect(result.html).toContain('/about');
            });

            it('should handle navigation items with explicit false active', () => {
                const component = {
                    name: 'Nav',
                    type: 'navigation' as const,
                    props: {
                        items: [
                            { href: '/home', label: 'Home', active: false },
                            { href: '/about', label: 'About', active: false }
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('/home');
                expect(result.html).not.toContain('class="active"');
            });
        });

        describe('Form Field Loop Coverage', () => {
            it('should handle form with single field', () => {
                const component = {
                    name: 'SingleField',
                    type: 'form' as const,
                    props: {
                        fields: [
                            { name: 'only', label: 'Only', placeholder: 'Only field', required: true }
                        ]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('only');
            });
        });

        describe('Table Loop Coverage', () => {
            it('should handle table with single column and row', () => {
                const component = {
                    name: 'Single',
                    type: 'table' as const,
                    props: {
                        columns: ['Name'],
                        rows: [['Alice']]
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('Name');
                expect(result.html).toContain('Alice');
            });
        });

        describe('Dropdown Option Loop Coverage', () => {
            it('should handle dropdown with single option', () => {
                const component = {
                    name: 'Single',
                    type: 'dropdown' as const,
                    props: {
                        options: ['Option1']
                    }
                };

                const result = generateComponent(component);

                expect(result.html).toContain('Option1');
            });
        });
    });
});
