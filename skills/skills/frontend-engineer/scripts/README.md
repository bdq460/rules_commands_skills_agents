# Component Generator

前端组件生成器用于生成React/Vue组件、页面和样式。

## 功能

1. **组件生成**：生成React/Vue组件代码
2. **页面生成**：生成完整的页面结构
3. **样式生成**：生成CSS/SCSS样式文件
4. **类型定义**：生成TypeScript类型定义
5. **测试代码**：生成组件测试代码

## 使用方法

```typescript
import { ComponentGenerator } from "./component-generator";

// 创建组件生成器实例
const generator = new ComponentGenerator({
  framework: 'react',
  language: 'typescript',
  style: 'css',
});

// 生成组件
const component = generator.generateComponent({
  name: 'Button',
  type: 'functional',
  props: [
    { name: 'label', type: 'string', required: true },
    { name: 'onClick', type: 'function', required: false },
    { name: 'disabled', type: 'boolean', required: false, default: 'false' },
  ],
});

// 生成页面
const page = generator.generatePage({
  name: 'HomePage',
  path: '/',
  components: ['Header', 'Footer', 'Button'],
});

// 生成样式文件
const styles = generator.generateStyles({
  component: 'Button',
  styleType: 'css',
});
```

## API

### generateComponent(config: ComponentConfig)

生成组件代码。

```typescript
const component = generator.generateComponent({
  name: 'Button',
  type: 'functional',
  props: [
    { name: 'label', type: 'string', required: true },
    { name: 'onClick', type: 'function', required: false },
  ],
});
```

### generatePage(config: PageConfig)

生成页面代码。

```typescript
const page = generator.generatePage({
  name: 'HomePage',
  path: '/',
  components: ['Header', 'Footer', 'Button'],
});
```

### generateStyles(config: StyleConfig)

生成样式文件。

```typescript
const styles = generator.generateStyles({
  component: 'Button',
  styleType: 'css',
});
```

### generateTypes(config: TypeConfig)

生成TypeScript类型定义。

```typescript
const types = generator.generateTypes({
  component: 'Button',
  props: [...],
});
```

## 配置选项

### GeneratorOptions

生成器配置选项。

| 字段 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| framework | string | 'react' | 前端框架：react/vue |
| language | string | 'typescript' | 编程语言：typescript/javascript |
| style | string | 'css' | 样式类型：css/scss/sass |
| withTests | boolean | false | 是否生成测试代码 |

### ComponentConfig

组件配置选项。

| 字段 | 类型 | 默认值 | 说明 |
| ---- | ---- | -------- | ---- |
| name | string | - | 组件名称 |
| type | string | 'functional' | 组件类型：functional/class |
| props | Prop[] | [] | 组件属性列表 |
