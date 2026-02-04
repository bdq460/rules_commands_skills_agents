/**
 * UI设计生成器
 *
 * 用于帮助UI专家生成设计规范、组件模板和设计文档
 */

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 颜色类型
 */
export type ColorType = "primary" | "secondary" | "neutral" | "success" | "warning" | "error";

/**
 * 颜色色阶
 */
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * 字体大小
 */
export type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

/**
 * 间距大小
 */
export type SpacingSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

/**
 * 组件属性
 */
export interface ComponentProps {
  name: string;
  description: string;
  variants?: string[];
  props: ComponentProp[];
}

/**
 * 组件属性定义
 */
export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

/**
 * 设计规范
 */
export interface DesignSystem {
  colors: Record<ColorType, Record<ColorShade, string>>;
  typography: Record<FontSize, TypographyToken>;
  spacing: Record<SpacingSize, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  components: ComponentTemplate[];
}

/**
 * 字体标记
 */
export interface TypographyToken {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
}

/**
 * UI设计文档
 */
export interface UIDesignDocument {
  title: string;
  description: string;
  designSystem: DesignSystem;
  components: ComponentTemplate[];
  pages: PageTemplate[];
}

/**
 * 组件模板
 */
export interface ComponentTemplate {
  name: string;
  category: string;
  description: string;
  props: ComponentProp[];
  variants: ComponentVariant[];
  examples: ComponentExample[];
}

/**
 * 组件变体
 */
export interface ComponentVariant {
  name: string;
  description: string;
  props: Record<string, any>;
}

/**
 * 组件示例
 */
export interface ComponentExample {
  name: string;
  description: string;
  code: string;
  preview?: string;
}

/**
 * 页面模板
 */
export interface PageTemplate {
  name: string;
  description: string;
  components: string[];
  layout: string;
  example: string;
}

// ============================================================================
// 颜色系统生成
// ============================================================================

/**
 * 生成颜色系统
 */
export function generateColorSystem(baseColor: string): Record<ColorType, Record<ColorShade, string>> {
  const primary = generateColorScale(baseColor);

  return {
    primary,
    secondary: generateColorScale("#722ed1"),
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e8e8e8",
      300: "#d9d9d9",
      400: "#bfbfbf",
      500: "#8c8c8c",
      600: "#595959",
      700: "#434343",
      800: "#262626",
      900: "#1f1f1f",
    },
    success: {
      50: "#f6ffed",
      100: "#d9f7be",
      200: "#b7eb8f",
      300: "#95de64",
      400: "#73d13d",
      500: "#52c41a",
      600: "#389e0d",
      700: "#237804",
      800: "#135200",
      900: "#092b00",
    },
    warning: {
      50: "#fffbe6",
      100: "#fff1b8",
      200: "#ffe58f",
      300: "#ffd666",
      400: "#ffc53d",
      500: "#faad14",
      600: "#d48806",
      700: "#ad6800",
      800: "#874d00",
      900: "#613400",
    },
    error: {
      50: "#fff1f0",
      100: "#ffccc7",
      200: "#ffa39e",
      300: "#ff7875",
      400: "#ff4d4f",
      500: "#f5222d",
      600: "#cf1322",
      700: "#a8071a",
      800: "#820014",
      900: "#5c0011",
    },
  };
}

/**
 * 生成颜色色阶
 */
function generateColorScale(baseColor: string): Record<ColorShade, string> {
  // 这里简化处理，实际应该使用颜色转换库
  return {
    50: "#e6f7ff",
    100: "#bae7ff",
    200: "#91d5ff",
    300: "#69c0ff",
    400: "#40a9ff",
    500: baseColor,
    600: "#096dd9",
    700: "#0050b3",
    800: "#003a8c",
    900: "#002766",
  };
}

// ============================================================================
// 字体系统生成
// ============================================================================

/**
 * 生成字体系统
 */
export function generateTypography(): Record<FontSize, TypographyToken> {
  return {
    xs: {
      fontSize: "0.75rem",
      fontWeight: "400",
      lineHeight: "1.25",
    },
    sm: {
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.5",
    },
    base: {
      fontSize: "1rem",
      fontWeight: "400",
      lineHeight: "1.5",
    },
    lg: {
      fontSize: "1.125rem",
      fontWeight: "400",
      lineHeight: "1.5",
    },
    xl: {
      fontSize: "1.25rem",
      fontWeight: "500",
      lineHeight: "1.5",
    },
    "2xl": {
      fontSize: "1.5rem",
      fontWeight: "600",
      lineHeight: "1.5",
    },
    "3xl": {
      fontSize: "1.875rem",
      fontWeight: "700",
      lineHeight: "1.25",
    },
    "4xl": {
      fontSize: "2.25rem",
      fontWeight: "700",
      lineHeight: "1.25",
    },
  };
}

// ============================================================================
// 间距系统生成
// ============================================================================

/**
 * 生成间距系统
 */
export function generateSpacing(): Record<SpacingSize, string> {
  const base = 4; // 基础单位 4px

  const sizes: Partial<Record<SpacingSize, string>> = {};
  const shadeValues: SpacingSize[] = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    8,
    10,
    12,
    16,
    20,
    24,
  ];

  for (const value of shadeValues) {
    sizes[value] = `${value * base}px`;
  }

  return sizes as Record<SpacingSize, string>;
}

// ============================================================================
// 组件模板生成
// ============================================================================

/**
 * 生成组件模板
 */
export function generateComponentTemplate(
  name: string,
  description: string,
  props: ComponentProp[],
  variants: ComponentVariant[] = [],
  examples: ComponentExample[] = [],
  category: string = "general",
): ComponentTemplate {
  return {
    name,
    category,
    description,
    props,
    variants,
    examples,
  };
}

/**
 * 生成React组件代码
 */
export function generateReactComponentCode(template: ComponentTemplate): string {
  const { name, props, variants } = template;

  const propsInterface = props
    .map(
      (prop) =>
        `  ${prop.name}${prop.required ? "" : "?"}: ${prop.type}; // ${prop.description}`,
    )
    .join("\n");

  const variantInterfaces = variants
    .map(
      (variant) =>
        `  ${variant.name}: {\n${Object.entries(variant.props)
          .map(([key, value]) => `    ${key}: ${JSON.stringify(value)};`)
      .join("\n")}\n  };`,
    )
    .join("\n");

  return `import React from 'react';

interface ${name}Props {
${propsInterface}
}

export const ${name}: React.FC<${name}Props> = ({ ${props.map(p => p.name).join(', ')} }) => {
  return (
    <div className="${name.toLowerCase()}">
      {/* ${name}组件内容 */}
    </div>
  );
};

export const ${name}Variants = {
${variantInterfaces}
};
`;
}

/**
 * 生成Vue组件代码
 */
export function generateVueComponentCode(template: ComponentTemplate): string {
  const { name, props, variants } = template;

  const propsDefinition = props
    .map(
      (prop) =>
        `  ${prop.name}: { type: ${prop.type}, required: ${prop.required}, default: ${prop.default || "undefined"} } // ${prop.description}`,
    )
    .join("\n");

  return `<template>
  <div class="${name.toLowerCase()}">
    <!-- ${name}组件内容 -->
  </div>
</template>

<script setup lang="ts">
interface Props {
${propsDefinition}
}

const props = defineProps<Props>();
</script>

<style scoped>
.${name.toLowerCase()} {
  /* 组件样式 */
}
</style>
`;
}

// ============================================================================
// 页面模板生成
// ============================================================================

/**
 * 生成页面模板
 */
export function generatePageTemplate(
  name: string,
  description: string,
  components: string[],
  layout: string,
): PageTemplate {
  const example = `<div class="page page-${name.toLowerCase()}">
  <!-- 页面头部 -->
  <header class="page-header">
    <h1>${name}</h1>
  </header>

  <!-- 页面内容 -->
  <main class="page-content">
${components.map((component) => `    <!-- ${component} -->`).join("\n")}
  </main>

  <!-- 页面底部 -->
  <footer class="page-footer">
    <!-- 页面底部内容 -->
  </footer>
</div>`;

  return {
    name,
    description,
    components,
    layout,
    example,
  };
}

// ============================================================================
// 设计文档生成
// ============================================================================

/**
 * 生成设计规范文档
 */
export function generateDesignSystemDoc(designSystem: DesignSystem): string {
  const { colors, typography, spacing, borderRadius, shadows, components } = designSystem;

  const colorTable = Object.entries(colors)
    .map(([type, shades]) => {
      const shadesStr = Object.entries(shades)
        .map(([shade, hex]) => `${shade}: ${hex}`)
        .join(", ");
      return `| ${type} | ${shadesStr} |`;
    })
    .join("\n");

  const typographyTable = Object.entries(typography)
    .map(([size, token]) => {
      return `| ${size} | ${token.fontSize} | ${token.fontWeight} | ${token.lineHeight} |`;
    })
    .join("\n");

  const spacingTable = Object.entries(spacing)
    .map(([size, value]) => {
      return `| ${size} | ${value} |`;
    })
    .join("\n");

  return `# 设计规范

## 颜色系统

| 类型 | 色阶 |
|------|------|
${colorTable}

## 字体系统

| 尺寸 | 大小 | 字重 | 行高 |
|------|------|------|------|
${typographyTable}

## 间距系统

| 尺寸 | 值 |
|------|-----|
${spacingTable}

## 圆角

${Object.entries(borderRadius)
  .map(([name, value]) => `### ${name}\n\`${value}\``)
  .join("\n\n")}

## 阴影

${Object.entries(shadows)
  .map(([name, value]) => `### ${name}\n\`${value}\``)
  .join("\n\n")}

## 组件库

${components
  .map((component) => `### ${component.name}\n\n${component.description}\n\n**属性**：\n${component.props.map(p => `- \`${p.name}\`: ${p.type} - ${p.description}`).join("\n")}`)
  .join("\n\n---\n\n")}
`;
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成设计规范变量（CSS Variables）
 */
export function generateCSSVariables(designSystem: DesignSystem): string {
  const { colors, typography, spacing } = designSystem;

  const colorVars = Object.entries(colors)
    .flatMap(([type, shades]) =>
      Object.entries(shades).map(([shade, hex]) => `  --color-${type}-${shade}: ${hex};`)
    )
    .join("\n");

  const typographyVars = Object.entries(typography)
    .map(
      ([size, token]) =>
        `  --font-size-${size}: ${token.fontSize};\n  --font-weight-${size}: ${token.fontWeight};\n  --line-height-${size}: ${token.lineHeight};`
    )
    .join("\n\n");

  const spacingVars = Object.entries(spacing)
    .map(([size, value]) => `  --spacing-${size}: ${value};`)
    .join("\n");

  return `:root {
  /* 颜色系统 */
${colorVars}

  /* 字体系统 */
${typographyVars}

  /* 间距系统 */
${spacingVars}
}
`;
}

/**
 * 验证设计系统
 */
export function validateDesignSystem(designSystem: DesignSystem): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查颜色系统
  const colorTypes = Object.keys(designSystem.colors) as ColorType[];
  const expectedColorTypes: ColorType[] = [
    "primary",
    "secondary",
    "neutral",
    "success",
    "warning",
    "error",
  ];

  for (const expectedType of expectedColorTypes) {
    if (!colorTypes.includes(expectedType)) {
      errors.push(`缺少颜色类型：${expectedType}`);
    }
  }

  // 检查字体系统
  const fontSizes = Object.keys(designSystem.typography) as FontSize[];
  if (fontSizes.length === 0) {
    errors.push("字体系统为空");
  }

  // 检查间距系统
  const spacingSizes = Object.keys(designSystem.spacing) as unknown as SpacingSize[];
  if (spacingSizes.length === 0) {
    errors.push("间距系统为空");
  }

  // 检查组件
  if (designSystem.components.length === 0) {
    warnings.push("设计规范中没有组件");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// UI设计规范生成
// ============================================================================

/**
 * UI设计规范接口
 */
export interface UIDesign {
  colorScheme: ColorScheme;
  typography: TypographySystem;
  layout: LayoutSystem;
  components?: any[];
}

/**
 * 颜色方案接口
 */
export interface ColorScheme {
  primary: ColorVariant;
  secondary: ColorVariant;
  accent: ColorVariant;
  neutral: ColorVariant;
  semantic?: SemanticColors;
  modes?: {
    light: any;
    dark: any;
  };
  accessibility?: {
    contrastRatios: any;
  };
}

/**
 * 颜色变体
 */
export interface ColorVariant {
  light: string;
  main: string;
  dark: string;
}

/**
 * 语义颜色
 */
export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

/**
 * 字体系统接口
 */
export interface TypographySystem {
  fontFamily: string[];
  sizes: Record<string, string>;
  weights: Record<string, number>;
  lineHeights: string[];
}

/**
 * 布局系统接口
 */
export interface LayoutSystem {
  grid: {
    columns: number;
    gap: string;
    maxWidth: string;
  };
  spacing: {
    unit: string;
    scale: Record<string, string>;
  };
  breakpoints: Record<string, number>;
  containers: Record<string, string>;
}

/**
 * UI设计输入接口
 */
export interface UIDesignInput {
  productName: string;
  theme?: string;
  platform?: string;
  targetUsers?: string[];
  baseFontSize?: number;
}

/**
 * 颜色方案选项
 */
export interface ColorSchemeOptions {
  style?: string;
  brandColor?: string;
  modes?: string[];
  accessibility?: boolean;
}

/**
 * 字体系统选项
 */
export interface TypographyOptions {
  style?: string;
  baseFontSize?: number;
  fontFamily?: string[];
}

/**
 * 布局系统选项
 */
export interface LayoutSystemOptions {
  type?: string;
  columns?: number;
}

/**
 * 生成UI设计规范
 */
export function generateUIDesign(input: UIDesignInput): UIDesign {
  const baseColor = input.theme === 'modern' ? '#1890ff' : '#722ed1';
  const colors = generateColorSchemeInternal(baseColor);
  const typography = generateTypographyInternal(input.baseFontSize);
  const layout = generateLayoutSystemInternal({});

  return {
    colorScheme: colors,
    typography,
    layout,
    components: []
  };
}

/**
 * 生成颜色方案
 */
export function generateColorScheme(options: ColorSchemeOptions = {}): ColorScheme {
  const baseColor = options.brandColor || '#1890ff';
  return generateColorSchemeInternal(baseColor, options.accessibility);
}

/**
 * 内部：生成颜色方案
 */
function generateColorSchemeInternal(baseColor: string, accessibility?: boolean): ColorScheme {
  return {
    primary: {
      light: lightenColor(baseColor, 20),
      main: baseColor,
      dark: darkenColor(baseColor, 20)
    },
    secondary: {
      light: '#9254de',
      main: '#722ed1',
      dark: '#531dab'
    },
    accent: {
      light: '#ffc53d',
      main: '#faad14',
      dark: '#d48806'
    },
    neutral: {
      light: '#fafafa',
      main: '#8c8c8c',
      dark: '#262626'
    },
    semantic: {
      success: '#52c41a',
      warning: '#faad14',
      error: '#f5222d',
      info: '#1890ff'
    },
    modes: {
      light: {},
      dark: {}
    },
    accessibility: accessibility ? {
      contrastRatios: {
        normal: '4.5:1',
        large: '3:1'
      }
    } : undefined
  };
}


/**
 * 内部：生成字体系统
 */
function generateTypographyInternal(baseFontSize: number = 16): TypographySystem {
  return {
    fontFamily: ['Inter', 'system-ui', 'sans-serif'],
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    },
    lineHeights: ['1.25', '1.5', '1.75', '2']
  };
}

/**
 * 生成布局系统
 */
export function generateLayoutSystem(options: LayoutSystemOptions = {}): LayoutSystem {
  return generateLayoutSystemInternal(options);
}

/**
 * 内部：生成布局系统
 */
function generateLayoutSystemInternal(options: LayoutSystemOptions = {}): LayoutSystem {
  return {
    grid: {
      columns: options.columns || 12,
      gap: '1rem',
      maxWidth: '1200px'
    },
    spacing: {
      unit: '4px',
      scale: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px'
      }
    },
    breakpoints: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    containers: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  };
}

/**
 * 简单的颜色变暗函数
 */
function darkenColor(color: string, percent: number): string {
  // 简化的颜色处理，实际应使用颜色库
  return color;
}

/**
 * 简单的颜色变亮函数
 */
function lightenColor(color: string, percent: number): string {
  // 简化的颜色处理，实际应使用颜色库
  return color;
}

// ============================================================================
// 使用示例
// ============================================================================

/**
 * 示例：创建一个完整的设计系统
 */
export function exampleUsage(): void {
  // 1. 生成颜色系统
  const colors = generateColorSystem("#1890ff");

  // 2. 生成字体系统
  const typography = generateTypography();

  // 3. 生成间距系统
  const spacing = generateSpacing();

  // 4. 定义圆角
  const borderRadius = {
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px",
  };

  // 5. 定义阴影
  const shadows = {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  };

  // 6. 创建组件
  const buttonProps: ComponentProp[] = [
    {
      name: "type",
      type: "'primary' | 'secondary' | 'tertiary'",
      required: false,
      default: "'primary'",
      description: "按钮类型",
    },
    {
      name: "size",
      type: "'sm' | 'md' | 'lg'",
      required: false,
      default: "'md'",
      description: "按钮大小",
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      default: "false",
      description: "是否禁用",
    },
  ];

  const buttonVariants: ComponentVariant[] = [
    {
      name: "primary",
      description: "主要按钮",
      props: { type: "primary" },
    },
    {
      name: "secondary",
      description: "次要按钮",
      props: { type: "secondary" },
    },
  ];

  const buttonExample: ComponentExample[] = [
    {
      name: "基础用法",
      description: "最简单的用法",
      code: '<Button type="primary">主要按钮</Button>',
    },
  ];

  const buttonComponent = generateComponentTemplate(
    "Button",
    "按钮组件",
    buttonProps,
    buttonVariants,
    buttonExample,
  );

  // 7. 组装设计系统
  const designSystem: DesignSystem = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    components: [buttonComponent],
  };

  // 8. 验证设计系统
  const validation = validateDesignSystem(designSystem);
  console.log("验证结果:", validation);

  // 9. 生成设计规范文档
  const designDoc = generateDesignSystemDoc(designSystem);
  console.log("设计规范文档:\n", designDoc);

  // 10. 生成CSS变量
  const cssVars = generateCSSVariables(designSystem);
  console.log("CSS变量:\n", cssVars);

  // 11. 生成React组件代码
  const reactCode = generateReactComponentCode(buttonComponent);
  console.log("React组件代码:\n", reactCode);

  // 12. 生成Vue组件代码
  const vueCode = generateVueComponentCode(buttonComponent);
  console.log("Vue组件代码:\n", vueCode);
}
