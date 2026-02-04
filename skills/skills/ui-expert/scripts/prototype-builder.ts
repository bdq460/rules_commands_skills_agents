#!/usr/bin/env node

/**
 * UI Expert - 原型构建器脚本
 *
 * 用途：根据设计规范生成UI原型HTML/CSS代码
 * 使用场景：设计阶段快速生成原型代码
 */

interface ComponentSpec {
    name: string;
    type: 'button' | 'input' | 'card' | 'modal' | 'navigation' | 'form' | 'table' | 'dropdown' | 'interactive' | 'display';
    props?: Record<string, any>;
    styles?: Record<string, string>;
    content?: string;
}

interface PageSpec {
    name: string;
    path: string;
    layout: 'default' | 'sidebar' | 'topbar' | 'fullscreen';
    components: ComponentSpec[];
    styles?: string;
}

interface DesignSystem {
    colors: Record<string, string>;
    typography: {
        fontFamily: string;
        fontSize: Record<string, string>;
        lineHeight: Record<string, string>;
    };
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    shadows: Record<string, string>;
}

export class PrototypeBuilder {
    private _designSystem: DesignSystem;

    constructor(designSystem?: DesignSystem) {
        this._designSystem = designSystem || this.getDefaultDesignSystem();
    }

    /**
     * 生成完整页面原型
     */
    generatePagePrototype(page: PageSpec): string {
        let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name}</title>
  <style>
${this.generateDesignSystemCSS()}
${this.generatePageCSS(page)}
  </style>
</head>
<body>
${this.generateLayout(page)}
</body>
</html>`;

        return html;
    }

    /**
     * 生成设计系统CSS
     */
    private generateDesignSystemCSS(): string {
        let css = `/* Design System Variables */
:root {
  /* Colors */
`;

        for (const [name, value] of Object.entries(this._designSystem.colors)) {
            css += `  --color-${name}: ${value};\n`;
        }

        css += `
  /* Typography */
  --font-family: ${this._designSystem.typography.fontFamily};
`;

        for (const [name, value] of Object.entries(this._designSystem.typography.fontSize)) {
            css += `  --font-size-${name}: ${value};\n`;
        }

        css += `
  /* Spacing */
`;

        for (const [name, value] of Object.entries(this._designSystem.spacing)) {
            css += `  --spacing-${name}: ${value};\n`;
        }

        css += `
  /* Border Radius */
`;

        for (const [name, value] of Object.entries(this._designSystem.borderRadius)) {
            css += `  --border-radius-${name}: ${value};\n`;
        }

        css += `
  /* Shadows */
`;

        for (const [name, value] of Object.entries(this._designSystem.shadows)) {
            css += `  --shadow-${name}: ${value};\n`;
        }

        css += `}

/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text-primary);
  background-color: var(--color-background);
}
`;

        return css;
    }

    /**
     * 生成页面特定CSS
     */
    private generatePageCSS(page: PageSpec): string {
        let css = `/* Page: ${page.name} */

`;

        for (const component of page.components) {
            css += this.generateComponentCSS(component);
        }

        return css;
    }

    /**
     * 生成组件CSS
     */
    private generateComponentCSS(component: ComponentSpec): string {
        let css = `/* Component: ${component.name} */

.${component.name.toLowerCase()} {
`;

        if (component.styles) {
            for (const [property, value] of Object.entries(component.styles)) {
                css += `  ${this.kebabCase(property)}: ${value};\n`;
            }
        }

        css += `}\n\n`;

        return css;
    }

    /**
     * 生成布局HTML
     */
    private generateLayout(page: PageSpec): string {
        let html = '';

        if (page.layout === 'sidebar') {
            html = this.generateSidebarLayout(page);
        } else if (page.layout === 'topbar') {
            html = this.generateTopbarLayout(page);
        } else if (page.layout === 'fullscreen') {
            html = this.generateFullscreenLayout(page);
        } else {
            html = this.generateDefaultLayout(page);
        }

        return html;
    }

    /**
     * 生成默认布局
     */
    private generateDefaultLayout(page: PageSpec): string {
        let html = `<header class="header">
  <div class="container">
    <h1>${page.name}</h1>
    <nav class="navigation">
      <a href="#">首页</a>
      <a href="#">关于</a>
      <a href="#">联系</a>
    </nav>
  </div>
</header>

<main class="main">
  <div class="container">
`;

        for (const component of page.components) {
            html += this.generateComponent(component);
        }

        html += `  </div>
</main>

<footer class="footer">
  <div class="container">
    <p>&copy; 2024 ${page.name}. All rights reserved.</p>
  </div>
</footer>`;

        return html;
    }

    /**
     * 生成侧边栏布局
     */
    private generateSidebarLayout(page: PageSpec): string {
        let html = `<div class="layout-sidebar">
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>${page.name}</h2>
    </div>
    <nav class="sidebar-nav">
      <a href="#" class="active">仪表盘</a>
      <a href="#">用户管理</a>
      <a href="#">设置</a>
    </nav>
  </aside>

  <main class="main-content">
`;

        for (const component of page.components) {
            html += `    ${this.generateComponent(component)}\n`;
        }

        html += `  </main>
</div>`;

        return html;
    }

    /**
     * 生成顶部栏布局
     */
    private generateTopbarLayout(page: PageSpec): string {
        let html = `<nav class="topbar">
  <div class="container">
    <h1>${page.name}</h1>
    <div class="topbar-menu">
      <a href="#">首页</a>
      <a href="#">产品</a>
      <a href="#">定价</a>
    </div>
  </div>
</nav>

<main class="main">
  <div class="container">
`;

        for (const component of page.components) {
            html += this.generateComponent(component);
        }

        html += `  </div>
</main>`;

        return html;
    }

    /**
     * 生成全屏布局
     */
    private generateFullscreenLayout(page: PageSpec): string {
        let html = `<div class="fullscreen">
`;

        for (const component of page.components) {
            html += `  ${this.generateComponent(component)}\n`;
        }

        html += `</div>`;

        return html;
    }

    /**
     * 生成组件HTML
     */
    private generateComponent(component: ComponentSpec): string {
        switch (component.type) {
            case 'button':
                return this.generateButton(component);
            case 'input':
                return this.generateInput(component);
            case 'card':
                return this.generateCard(component);
            case 'modal':
                return this.generateModal(component);
            case 'navigation':
                return this.generateNavigation(component);
            case 'form':
                return this.generateForm(component);
            case 'table':
                return this.generateTable(component);
            case 'dropdown':
                return this.generateDropdown(component);
            default:
                return `<div class="${component.name.toLowerCase()}">${component.content || ''}</div>`;
        }
    }

    /**
     * 生成按钮组件
     */
    private generateButton(component: ComponentSpec): string {
        const primary = component.props?.primary ? 'primary' : '';
        const size = component.props?.size || 'medium';

        return `<button class="btn btn-${size} ${primary}">
  ${component.props?.label || '按钮'}
</button>`;
    }

    /**
     * 生成输入框组件
     */
    private generateInput(component: ComponentSpec): string {
        const placeholder = component.props?.placeholder || '请输入...';
        const label = component.props?.label || '';
        const required = component.props?.required ? 'required' : '';

        let html = `<div class="form-group">
`;
        if (label) {
            html += `  <label for="${component.name}">${label}</label>\n`;
        }
        html += `  <input type="text" id="${component.name}" placeholder="${placeholder}" ${required} />
</div>`;

        return html;
    }

    /**
     * 生成卡片组件
     */
    private generateCard(component: ComponentSpec): string {
        const title = component.props?.title || '卡片标题';
        const content = component.content || '卡片内容';

        return `<div class="card">
  <div class="card-header">
    <h3>${title}</h3>
  </div>
  <div class="card-body">
    ${content}
  </div>
  ${component.props?.footer ? `<div class="card-footer">${component.props.footer}</div>` : ''}
</div>`;
    }

    /**
     * 生成模态框组件
     */
    private generateModal(component: ComponentSpec): string {
        const title = component.props?.title || '模态框标题';

        return `<div class="modal" id="${component.name}">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h2>${title}</h2>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      ${component.content || '模态框内容'}
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">取消</button>
      <button class="btn btn-primary">确认</button>
    </div>
  </div>
</div>`;
    }

    /**
     * 生成导航组件
     */
    private generateNavigation(component: ComponentSpec): string {
        const items = component.props?.items || [];

        let html = `<nav class="navigation">\n`;
        for (const item of items) {
            const active = item.active ? 'active' : '';
            html += `  <a href="${item.href}" class="${active}">${item.label}</a>\n`;
        }
        html += `</nav>`;

        return html;
    }

    /**
     * 生成表单组件
     */
    private generateForm(component: ComponentSpec): string {
        const fields = component.props?.fields || [];

        let html = `<form class="form">\n`;
        for (const field of fields) {
            html += this.generateInput({
                name: field.name,
                type: 'input',
                props: {
                    label: field.label,
                    placeholder: field.placeholder,
                    required: field.required
                }
            });
            html += '\n';
        }
        html += `  <button type="submit" class="btn btn-primary">提交</button>
</form>`;

        return html;
    }

    /**
     * 生成表格组件
     */
    private generateTable(component: ComponentSpec): string {
        const columns = component.props?.columns || [];
        const rows = component.props?.rows || [];

        let html = `<table class="table">
  <thead>
    <tr>
`;

        for (const col of columns) {
            html += `      <th>${col}</th>\n`;
        }

        html += `    </tr>
  </thead>
  <tbody>
`;

        for (const row of rows) {
            html += `    <tr>\n`;
            for (const cell of row) {
                html += `      <td>${cell}</td>\n`;
            }
            html += `    </tr>\n`;
        }

        html += `  </tbody>
</table>`;

        return html;
    }

    /**
     * 生成下拉菜单组件
     */
    private generateDropdown(component: ComponentSpec): string {
        const options = component.props?.options || [];
        const placeholder = component.props?.placeholder || '请选择...';

        let html = `<div class="dropdown">
  <button class="dropdown-trigger">
    ${placeholder}
    <span class="dropdown-arrow">▼</span>
  </button>
  <ul class="dropdown-menu">
`;

        for (const option of options) {
            html += `    <li><a href="#">${option}</a></li>\n`;
        }

        html += `  </ul>
</div>`;

        return html;
    }

    /**
     * 转换为kebab-case
     */
    private kebabCase(str: string): string {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     * 获取默认设计系统
     */
    private getDefaultDesignSystem(): DesignSystem {
        return {
            colors: {
                primary: '#007bff',
                secondary: '#6c757d',
                success: '#28a745',
                danger: '#dc3545',
                warning: '#ffc107',
                info: '#17a2b8',
                light: '#f8f9fa',
                dark: '#343a40',
                white: '#ffffff',
                'text-primary': '#212529',
                'text-secondary': '#6c757d',
                background: '#ffffff',
                'background-secondary': '#f8f9fa',
                border: '#dee2e6'
            },
            typography: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem',
                    '4xl': '2.25rem'
                },
                lineHeight: {
                    tight: '1.25',
                    normal: '1.5',
                    relaxed: '1.75'
                }
            },
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem',
                '3xl': '4rem'
            },
            borderRadius: {
                none: '0',
                sm: '0.125rem',
                md: '0.375rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px'
            },
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
        };
    }
}

// ============================================================================
// 导出的便捷函数
// ============================================================================

const defaultBuilder = new PrototypeBuilder();

/**
 * 构建原型
 */
export function buildPrototype(config: { pages: any[]; theme?: string }): {
    pages: any[];
    components: any[];
    structure: any;
    theme?: string;
} {
    const builder = defaultBuilder;

    // 收集所有组件
    const components: any[] = [];
    const pages: any[] = [];

    for (const page of config.pages) {
        pages.push({
            name: page.name,
            path: `/${page.name.toLowerCase()}`
        });

        if (page.components) {
            for (const component of page.components) {
                if (typeof component === 'string') {
                    components.push({
                        name: component,
                        type: 'container'
                    });
                } else if (typeof component === 'object') {
                    components.push(component);

                    if (component.children && Array.isArray(component.children)) {
                        for (const child of component.children) {
                            components.push({
                                name: child,
                                type: 'element',
                                parent: component
                            });
                        }
                    }
                }
            }
        }
    }

    return {
        pages,
        components,
        structure: {
            type: 'multi-page',
            layout: 'responsive'
        },
        theme: config.theme
    };
}

/**
 * 生成组件
 */
export function generateComponent(componentSpec: ComponentSpec, designSystem?: DesignSystem): {
    html: string;
    css: string;
    js: string;
} {
    const builder = designSystem ? new PrototypeBuilder(designSystem) : defaultBuilder;

    // 创建一个临时页面来生成组件
    const tempPage: PageSpec = {
        name: 'Component Preview',
        path: '/preview',
        layout: 'fullscreen',
        components: [componentSpec]
    };

    const html = builder.generatePagePrototype(tempPage);

    // 提取CSS和JS（简化处理）
    const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    const css = /* istanbul ignore next */ cssMatch ? cssMatch[1] : '';

    const jsMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    const js = /* istanbul ignore next */ jsMatch ? jsMatch[1] : '// Component JavaScript';

    return {
        html,
        css,
        js
    };
}

/**
 * 生成线框图
 */
export function generateWireframe(pageSpec: PageSpec, designSystem?: DesignSystem): {
    html: string;
    css: string;
    js: string;
} {
    const builder = designSystem ? new PrototypeBuilder(designSystem) : defaultBuilder;

    // 创建线框图风格的页面
    const wireframeSpec: PageSpec = {
        ...pageSpec,
        components: pageSpec.components.map(comp => ({
            ...comp,
            props: {
                ...comp.props,
                wireframe: true
            }
        }))
    };

    const html = builder.generatePagePrototype(wireframeSpec);

    // 提取CSS和JS（简化处理）
    const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    const css = /* istanbul ignore next */ cssMatch ? cssMatch[1] : '';

    const jsMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    const js = /* istanbul ignore next */ jsMatch ? jsMatch[1] : '// Wireframe JavaScript';

    return {
        html,
        css,
        js
    };
}

/**
 * 导出原型
 */
export function exportPrototype(
    prototype: PageSpec | { pages: PageSpec[]; theme?: any },
    format: 'html' | 'json' | 'preview' = 'html'
): {
    html?: string;
    files?: Array<{ type: string; content: string; name: string }>;
    format?: string;
    success: boolean;
    message: string;
} {
    const builder = defaultBuilder;

    if ('pages' in prototype) {
        // 多页面原型
        const files: Array<{ type: string; content: string; name: string }> = [];

        for (const page of prototype.pages) {
            const html = builder.generatePagePrototype(page);
            files.push({
                type: 'html',
                name: `${page.name}.html`,
                content: html
            });
        }

        if (format === 'json') {
            return {
                success: true,
                message: '原型导出成功（JSON格式）',
                files,
                format: 'json'
            };
        }

        // 合并所有HTML文件（简化处理）
        return {
            success: true,
            message: '原型导出成功（多页面）',
            files,
            format: 'html'
        };
    } else {
        // 单页面原型
        const html = builder.generatePagePrototype(prototype);

        if (format === 'json') {
            return {
                success: true,
                message: '原型导出成功（JSON格式）',
                html,
                format: 'json'
            };
        }

        return {
            success: true,
            message: '原型导出成功（HTML格式）',
            html,
            files: [
                {
                    type: 'html',
                    name: 'index.html',
                    content: html
                },
                {
                    type: 'css',
                    name: 'styles.css',
                    content: '/* Design System CSS embedded in HTML */'
                },
                {
                    type: 'js',
                    name: 'script.js',
                    content: '// Prototype JavaScript'
                }
            ],
            format: 'html'
        };
    }
}

// CLI使用示例
/* istanbul ignore next: CLI entry point not testable in unit tests */
if (require.main === module) {
    const builder = new PrototypeBuilder();

    const pageSpec: PageSpec = {
        name: '仪表盘',
        path: '/dashboard',
        layout: 'sidebar',
        components: [
            {
                name: 'StatCard',
                type: 'card',
                props: {
                    title: '用户总数',
                    footer: '较上周增长 12%'
                },
                content: '<div class="stat-value">1,234</div>'
            },
            {
                name: 'ActionForm',
                type: 'form',
                props: {
                    fields: [
                        { name: 'username', label: '用户名', placeholder: '请输入用户名', required: true },
                        { name: 'email', label: '邮箱', placeholder: '请输入邮箱', required: true }
                    ]
                }
            },
            {
                name: 'DataButton',
                type: 'button',
                props: {
                    label: '导出数据',
                    primary: true,
                    size: 'lg'
                }
            }
        ]
    };

    console.log('=== 页面原型 ===');
    console.log(builder.generatePagePrototype(pageSpec));
}
