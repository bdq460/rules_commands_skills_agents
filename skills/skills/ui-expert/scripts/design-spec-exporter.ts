#!/usr/bin/env node

/**
 * UI Expert - 设计规范导出器脚本
 *
 * 用途：导出设计规范为CSS、SASS、JavaScript变量等格式
 * 使用场景：设计完成后、开发开始前
 */

interface ColorToken {
  name: string;
  value: string;
  category: string;
}

interface TypographyToken {
  name: string;
  value: string;
  category: 'fontSize' | 'fontFamily' | 'lineHeight' | 'fontWeight';
}

interface SpacingToken {
  name: string;
  value: string;
}

interface DesignTokens {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
}

export class DesignSpecExporter {
  private _tokens: DesignTokens;

  constructor(tokens?: DesignTokens) {
    this._tokens = tokens || this.getDefaultTokens();
  }

  /**
   * 导出CSS变量
   */
  exportCSSVariables(): string {
    let css = `:root {\n`;

    // Colors
    css += `  /* Colors */\n`;
    for (const color of this._tokens.colors) {
      css += `  --color-${this.kebabCase(color.name)}: ${color.value};\n`;
    }
    css += '\n';

    // Typography
    css += `  /* Typography */\n`;
    for (const type of this._tokens.typography) {
      const prefix = type.category === 'fontSize' ? 'font-size' :
                   type.category === 'fontFamily' ? 'font-family' :
                   type.category === 'lineHeight' ? 'line-height' : 'font-weight';
      css += `  --${prefix}-${this.kebabCase(type.name)}: ${type.value};\n`;
    }
    css += '\n';

    // Spacing
    css += `  /* Spacing */\n`;
    for (const space of this._tokens.spacing) {
      css += `  --spacing-${this.kebabCase(space.name)}: ${space.value};\n`;
    }
    css += '\n';

    // Border Radius
    css += `  /* Border Radius */\n`;
    for (const [name, value] of Object.entries(this._tokens.borderRadius)) {
      css += `  --border-radius-${name}: ${value};\n`;
    }
    css += '\n';

    // Shadows
    css += `  /* Shadows */\n`;
    for (const [name, value] of Object.entries(this._tokens.shadows)) {
      css += `  --shadow-${name}: ${value};\n`;
    }
    css += '\n';

    // Breakpoints
    css += `  /* Breakpoints */\n`;
    for (const [name, value] of Object.entries(this._tokens.breakpoints)) {
      css += `  --breakpoint-${name}: ${value};\n`;
    }

    css += '}\n';

    return css;
  }

  /**
   * 导出SASS变量
   */
  exportSASSVariables(): string {
    let scss = `// Design Tokens\n\n`;

    // Colors
    scss += `// Colors\n`;
    for (const color of this._tokens.colors) {
      scss += `$${this.camelCase(color.name)}: ${color.value};\n`;
    }
    scss += '\n';

    // Typography
    scss += `// Typography\n`;
    for (const type of this._tokens.typography) {
      scss += `$${this.camelCase(type.name)}: ${type.value};\n`;
    }
    scss += '\n';

    // Spacing
    scss += `// Spacing\n`;
    for (const space of this._tokens.spacing) {
      scss += `$${this.camelCase(space.name)}: ${space.value};\n`;
    }
    scss += '\n';

    // Border Radius
    scss += `// Border Radius\n`;
    for (const [name, value] of Object.entries(this._tokens.borderRadius)) {
      scss += `$${this.camelCase(name)}: ${value};\n`;
    }
    scss += '\n';

    // Shadows
    scss += `// Shadows\n`;
    for (const [name, value] of Object.entries(this._tokens.shadows)) {
      scss += `$${this.camelCase(name)}: ${value};\n`;
    }
    scss += '\n';

    // Breakpoints
    scss += `// Breakpoints\n`;
    for (const [name, value] of Object.entries(this._tokens.breakpoints)) {
      scss += `$${this.camelCase(name)}: ${value};\n`;
    }

    return scss;
  }

  /**
   * 导出JavaScript对象
   */
  exportJavaScriptObject(): string {
    const obj = {
      colors: this.tokensToObject(this._tokens.colors),
      typography: this.tokensToObject(this._tokens.typography),
      spacing: this.tokensToObject(this._tokens.spacing),
      borderRadius: this._tokens.borderRadius,
      shadows: this._tokens.shadows,
      breakpoints: this._tokens.breakpoints
    };

    return `export const designTokens = ${JSON.stringify(obj, null, 2)};\n`;
  }

  /**
   * 导出TypeScript类型定义
   */
  exportTypeScriptTypes(): string {
    let ts = `// Design Token Type Definitions\n\n`;

    ts += `export type ColorToken = keyof typeof designTokens.colors;\n`;
    ts += `export type TypographyToken = keyof typeof designTokens.typography;\n`;
    ts += `export type SpacingToken = keyof typeof designTokens.spacing;\n\n`;

    ts += `export interface DesignTokens {\n`;
    ts += `  colors: Record<string, string>;\n`;
    ts += `  typography: Record<string, string>;\n`;
    ts += `  spacing: Record<string, string>;\n`;
    ts += `  borderRadius: Record<string, string>;\n`;
    ts += `  shadows: Record<string, string>;\n`;
    ts += `  breakpoints: Record<string, string>;\n`;
    ts += `}\n\n`;

    ts += `export const designTokens: DesignTokens = {\n`;
    ts += `  colors: {\n`;
    for (const color of this._tokens.colors) {
      ts += `    ${this.camelCase(color.name)}: '${color.value}',\n`;
    }
    ts += `  },\n`;
    ts += `  typography: {\n`;
    for (const type of this._tokens.typography) {
      ts += `    ${this.camelCase(type.name)}: '${type.value}',\n`;
    }
    ts += `  },\n`;
    ts += `  spacing: {\n`;
    for (const space of this._tokens.spacing) {
      ts += `    ${this.camelCase(space.name)}: '${space.value}',\n`;
    }
    ts += `  },\n`;
    ts += `  borderRadius: {\n`;
    for (const [name, value] of Object.entries(this._tokens.borderRadius)) {
      ts += `    ${name}: '${value}',\n`;
    }
    ts += `  },\n`;
    ts += `  shadows: {\n`;
    for (const [name, value] of Object.entries(this._tokens.shadows)) {
      ts += `    ${name}: '${value}',\n`;
    }
    ts += `  },\n`;
    ts += `  breakpoints: {\n`;
    for (const [name, value] of Object.entries(this._tokens.breakpoints)) {
      ts += `    ${name}: '${value}',\n`;
    }
    ts += `  }\n`;
    ts += `};\n`;

    return ts;
  }

  /**
   * 导出Tailwind配置
   */
  exportTailwindConfig(): string {
    let config = `// tailwind.config.js\n\n`;
    config += `module.exports = {\n`;
    config += `  theme: {\n`;
    config += `    extend: {\n`;

    // Colors
    config += `      colors: {\n`;
    for (const color of this._tokens.colors) {
      config += `        ${this.kebabCase(color.name)}: '${color.value}',\n`;
    }
    config += `      },\n`;

    // Typography
    config += `      fontFamily: {\n`;
    const fontFamilies = this._tokens.typography.filter(t => t.category === 'fontFamily');
    for (const font of fontFamilies) {
      config += `        ${this.kebabCase(font.name)}: [${font.value}],\n`;
    }
    config += `      },\n`;

    config += `      fontSize: {\n`;
    const fontSizes = this._tokens.typography.filter(t => t.category === 'fontSize');
    for (const size of fontSizes) {
      config += `        ${this.kebabCase(size.name)}: '${size.value}',\n`;
    }
    config += `      },\n`;

    config += `      lineHeight: {\n`;
    const lineHeights = this._tokens.typography.filter(t => t.category === 'lineHeight');
    for (const lh of lineHeights) {
      config += `        ${this.kebabCase(lh.name)}: '${lh.value}',\n`;
    }
    config += `      },\n`;

    // Spacing
    config += `      spacing: {\n`;
    for (const space of this._tokens.spacing) {
      config += `        ${this.kebabCase(space.name)}: '${space.value}',\n`;
    }
    config += `      },\n`;

    // Border Radius
    config += `      borderRadius: {\n`;
    for (const [name, value] of Object.entries(this._tokens.borderRadius)) {
      config += `        ${name}: '${value}',\n`;
    }
    config += `      },\n`;

    // Shadows
    config += `      boxShadow: {\n`;
    for (const [name, value] of Object.entries(this._tokens.shadows)) {
      config += `        ${name}: '${value}',\n`;
    }
    config += `      },\n`;

    // Breakpoints
    config += `      screens: {\n`;
    for (const [name, value] of Object.entries(this._tokens.breakpoints)) {
      config += `        ${name}: '${value}',\n`;
    }
    config += `      },\n`;

    config += `    },\n`;
    config += `  },\n`;
    config += `};\n`;

    return config;
  }

  /**
   * 导出JSON格式
   */
  exportJSON(): string {
    return JSON.stringify(this._tokens, null, 2);
  }

  /**
   * 生成设计规范文档
   */
  generateDesignSpecDoc(): string {
    let md = `# 设计规范文档

## 颜色

### 品牌色

| 名称 | 值 | 变量名 |
|------|-----|--------|
`;

    const brandColors = this._tokens.colors.filter(c => c.category === 'brand');
    for (const color of brandColors) {
      md += `| ${color.name} | ![${color.value}](https://via.placeholder.com/20/${color.value.replace('#', '')}) | \`--color-${this.kebabCase(color.name)}\` |\n`;
    }

    md += `
### 语义色

| 名称 | 值 | 用途 |
|------|-----|------|
`;

    const semanticColors = this._tokens.colors.filter(c => c.category === 'semantic');
    for (const color of semanticColors) {
      md += `| ${color.name} | ![${color.value}](https://via.placeholder.com/20/${color.value.replace('#', '')}) | ${color.name} |\n`;
    }

    md += `
## 排版

### 字体大小

| 名称 | 值 |
|------|-----|
`;

    const fontSizes = this._tokens.typography.filter(t => t.category === 'fontSize');
    for (const size of fontSizes) {
      md += `| ${size.name} | ${size.value} |\n`;
    }

    md += `
### 字体族

| 名称 | 值 |
|------|-----|
`;

    const fontFamilies = this._tokens.typography.filter(t => t.category === 'fontFamily');
    for (const font of fontFamilies) {
      md += `| ${font.name} | ${font.value} |\n`;
    }

    md += `
## 间距

| 名称 | 值 |
|------|-----|
`;

    for (const space of this._tokens.spacing) {
      md += `| ${space.name} | ${space.value} |\n`;
    }

    md += `
## 圆角

| 名称 | 值 |
|------|-----|
`;

    for (const [name, value] of Object.entries(this._tokens.borderRadius)) {
      md += `| ${name} | ${value} |\n`;
    }

    md += `
## 阴影

| 名称 | 值 |
|------|-----|
`;

    for (const [name, value] of Object.entries(this._tokens.shadows)) {
      md += `| ${name} | ${value} |\n`;
    }

    return md;
  }

  /**
   * 转换token为对象
   */
  private tokensToObject(tokens: any[]): Record<string, string> {
    const obj: Record<string, string> = {};
    for (const token of tokens) {
      obj[this.camelCase(token.name)] = token.value;
    }
    return obj;
  }

  /**
   * 转换为camelCase
   */
  private camelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  /**
   * 转换为kebab-case
   */
  private kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * 获取默认tokens
   */
  private getDefaultTokens(): DesignTokens {
    return {
      colors: [
        { name: 'primary', value: '#3B82F6', category: 'brand' },
        { name: 'secondary', value: '#6366F1', category: 'brand' },
        { name: 'success', value: '#10B981', category: 'semantic' },
        { name: 'warning', value: '#F59E0B', category: 'semantic' },
        { name: 'error', value: '#EF4444', category: 'semantic' },
        { name: 'info', value: '#3B82F6', category: 'semantic' },
        { name: 'gray-50', value: '#F9FAFB', category: 'gray' },
        { name: 'gray-100', value: '#F3F4F6', category: 'gray' },
        { name: 'gray-200', value: '#E5E7EB', category: 'gray' },
        { name: 'gray-300', value: '#D1D5DB', category: 'gray' },
        { name: 'gray-400', value: '#9CA3AF', category: 'gray' },
        { name: 'gray-500', value: '#6B7280', category: 'gray' },
        { name: 'gray-600', value: '#4B5563', category: 'gray' },
        { name: 'gray-700', value: '#374151', category: 'gray' },
        { name: 'gray-800', value: '#1F2937', category: 'gray' },
        { name: 'gray-900', value: '#111827', category: 'gray' }
      ],
      typography: [
        { name: 'font-sans', value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', category: 'fontFamily' },
        { name: 'font-mono', value: '"Fira Code", monospace', category: 'fontFamily' },
        { name: 'xs', value: '0.75rem', category: 'fontSize' },
        { name: 'sm', value: '0.875rem', category: 'fontSize' },
        { name: 'base', value: '1rem', category: 'fontSize' },
        { name: 'lg', value: '1.125rem', category: 'fontSize' },
        { name: 'xl', value: '1.25rem', category: 'fontSize' },
        { name: '2xl', value: '1.5rem', category: 'fontSize' },
        { name: '3xl', value: '1.875rem', category: 'fontSize' },
        { name: '4xl', value: '2.25rem', category: 'fontSize' },
        { name: 'none', value: '1', category: 'lineHeight' },
        { name: 'tight', value: '1.25', category: 'lineHeight' },
        { name: 'normal', value: '1.5', category: 'lineHeight' },
        { name: 'relaxed', value: '1.75', category: 'lineHeight' }
      ],
      spacing: [
        { name: '0', value: '0' },
        { name: '1', value: '0.25rem' },
        { name: '2', value: '0.5rem' },
        { name: '3', value: '0.75rem' },
        { name: '4', value: '1rem' },
        { name: '5', value: '1.25rem' },
        { name: '6', value: '1.5rem' },
        { name: '8', value: '2rem' },
        { name: '10', value: '2.5rem' },
        { name: '12', value: '3rem' },
        { name: '16', value: '4rem' },
        { name: '20', value: '5rem' },
        { name: '24', value: '6rem' }
      ],
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      }
    };
  }
}

// ============================================================================
// 导出的便捷函数
// ============================================================================

const defaultExporter = new DesignSpecExporter();

/**
 * 导出设计规范
 */
export function exportDesignSpec(design?: any, format: 'css' | 'sass' | 'js' | 'ts' | 'json' | 'tailwind' | 'markdown' = 'css'): { content: string; format: string } {
  let content: string;
  switch (format) {
    case 'css':
      content = defaultExporter.exportCSSVariables();
      break;
    case 'sass':
      content = defaultExporter.exportSASSVariables();
      break;
    case 'js':
      content = defaultExporter.exportJavaScriptObject();
      break;
    case 'ts':
      content = defaultExporter.exportTypeScriptTypes();
      break;
    case 'json':
      content = defaultExporter.exportJSON();
      break;
    case 'tailwind':
      content = defaultExporter.exportTailwindConfig();
      break;
    case 'markdown':
      content = defaultExporter.generateDesignSpecDoc();
      break;
    default:
      content = defaultExporter.exportCSSVariables();
  }

  return { content, format };
}

/**
 * 生成样式指南
 */
export function generateStyleGuide(tokens?: DesignTokens): string {
  const exporter = tokens ? new DesignSpecExporter(tokens) : defaultExporter;
  return exporter.generateDesignSpecDoc();
}

/**
 * 导出到 Figma
 */
export function exportToFigma(tokens?: DesignTokens): { success: boolean; message: string; url?: string } {
  const exporter = tokens ? new DesignSpecExporter(tokens) : defaultExporter;
  const designDoc = exporter.generateDesignSpecDoc();

  // 这里是模拟的 Figma 导出功能
  // 在实际实现中，需要使用 Figma API
  return {
    success: true,
    message: '设计规范已准备导出到 Figma',
    url: 'https://figma.com/file/mock-url'
  };
}

/**
 * 导出到 Sketch
 */
export function exportToSketch(tokens?: DesignTokens): { success: boolean; message: string; filePath?: string } {
  const exporter = tokens ? new DesignSpecExporter(tokens) : defaultExporter;
  const designDoc = exporter.generateDesignSpecDoc();

  // 这里是模拟的 Sketch 导出功能
  // 在实际实现中，需要生成 Sketch 可识别的格式
  return {
    success: true,
    message: '设计规范已准备导出到 Sketch',
    filePath: '/path/to/design-spec.sketch'
  };
}

// CLI使用示例
if (require.main === module) {
  const exporter = new DesignSpecExporter();

  console.log('=== CSS Variables ===');
  console.log(exporter.exportCSSVariables());

  console.log('\n=== TypeScript Types ===');
  console.log(exporter.exportTypeScriptTypes());

  console.log('\n=== Design Spec Document ===');
  console.log(exporter.generateDesignSpecDoc());
}
