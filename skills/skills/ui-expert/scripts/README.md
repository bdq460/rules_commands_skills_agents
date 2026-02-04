# UI Design Generator

UI设计生成器用于生成UI设计规范、组件设计稿和交互原型。

## 功能

1. **设计规范**：生成UI设计规范和设计系统
2. **组件设计**：生成组件设计稿和规范
3. **原型设计**：生成交互原型和线框图
4. **设计导出**：导出设计资源和代码
5. **设计文档**：生成设计文档

## 使用方法

```typescript
import { UIDesignGenerator } from "./ui-design-generator";

// 创建UI设计生成器实例
const generator = new UIDesignGenerator();

// 生成设计规范
const designSystem = generator.generateDesignSystem({
  colors: {
    primary: '#0066cc',
    secondary: '#666666',
    success: '#00cc66',
    warning: '#ffcc00',
    danger: '#ff3300',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: {
      small: '12px',
      normal: '14px',
      large: '16px',
      heading: '24px',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
});

// 生成组件设计
const componentDesign = generator.generateComponentDesign({
  name: 'Button',
  variants: ['primary', 'secondary', 'danger'],
  states: ['normal', 'hover', 'active', 'disabled'],
});

// 生成原型
const prototype = generator.generatePrototype({
  name: 'LoginPage',
  screens: [
    {
      name: 'Login',
      components: ['EmailInput', 'PasswordInput', 'LoginButton'],
    },
  ],
});
```

## API

### generateDesignSystem(config: DesignSystemConfig)

生成设计系统。

```typescript
const designSystem = generator.generateDesignSystem({
  colors: {...},
  typography: {...},
  spacing: {...},
});
```

### generateComponentDesign(config: ComponentDesignConfig)

生成组件设计。

```typescript
const componentDesign = generator.generateComponentDesign({
  name: 'Button',
  variants: ['primary', 'secondary'],
  states: ['normal', 'hover', 'active'],
});
```

### generatePrototype(config: PrototypeConfig)

生成原型设计。

```typescript
const prototype = generator.generatePrototype({
  name: 'LoginPage',
  screens: [...],
});
```

### exportDesignAssets(config: ExportConfig)

导出设计资源。

```typescript
const assets = generator.exportDesignAssets({
  format: 'svg',
  components: ['Button', 'Input'],
});
```

### generateDesignDoc(config: DocConfig)

生成设计文档。

```typescript
const doc = generator.generateDesignDoc({
  designSystem,
  components,
  prototypes,
});
```

## 数据类型

### DesignSystemConfig

设计系统配置。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| colors | object | 颜色配置 |
| typography | object | 字体配置 |
| spacing | object | 间距配置 |
| components | object[] | 组件列表 |
