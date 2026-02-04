/**
 * 前端组件生成器
 *
 * 用于生成React或Vue组件代码
 */

export interface ComponentGeneratorOptions {
    name: string;
    framework: 'react' | 'vue';
    type?: 'functional' | 'class' | 'composition';
    library?: 'antd' | 'element-plus' | 'material-ui' | 'none';
    typescript?: boolean;
    styling?: 'css' | 'scss' | 'styled-components' | 'tailwind';
    features?: {
        hooks?: boolean;
        async?: boolean;
        form?: boolean;
        table?: boolean;
    };
}

export class ComponentGenerator {
    private options: ComponentGeneratorOptions;

    constructor(options: ComponentGeneratorOptions) {
        this.options = {
            typescript: true,
            styling: 'css',
            features: {},
            ...options
        };
    }

    /**
     * 生成React组件代码
     */
    generateReactComponent(): string {
        const { name, library, typescript, styling, features } = this.options;
        const componentName = this.toPascalCase(name);
        const className = this.resolveClassName(name);
        const imports = this.generateReactImports(library, features);
        const propsInterface = typescript ? this.generatePropsInterface(name, features) : '';
        const hooks = features?.hooks ? this.generateReactHooks() : '';
        const asyncLogic = features?.async ? this.generateAsyncLogic() : '';
        const formLogic = features?.form ? this.generateFormLogic(library || 'none') : '';
        const tableLogic = features?.table ? this.generateTableLogic(library || 'none') : '';

        let component = '';

        // Imports
        component += `${imports}\n\n`;

        // Props Interface
        if (propsInterface) {
            component += `${propsInterface}\n\n`;
        }

        // Component definition
        if (typescript) {
            component += `export const ${componentName}: React.FC<${componentName}Props> = ({}) => {\n`;
        } else {
            component += `export const ${componentName} = ({}) => {\n`;
        }

        // Hooks
        component += `  ${hooks}`;

        // Async logic
        component += `  ${asyncLogic}`;

        // Form logic
        component += `  ${formLogic}`;

        // Table logic
        component += `  ${tableLogic}`;

        // Return statement
        component += `  return (\n`;
        component += `    <div className="${className}">\n`;
        component += `      {/* Component content */}\n`;
        component += `    </div>\n`;
        component += `  );\n`;

        component += `};\n\n`;

        if (styling === 'css' || styling === 'scss') {
            component += `// CSS class: .${className}\n`;
        }

        component += `export default ${componentName};`;

        return component;
    }

    /**
     * 生成Vue组件代码
     */
    generateVueComponent(): string {
        const { name, library, features, styling } = this.options;
        const componentName = this.toPascalCase(name);
        const className = this.resolveClassName(name);
        const imports = this.generateVueImports(library, features);
        const propsDefinition = this.generateVuePropsDefinition(features);
        const emitsDefinition = this.generateVueEmitsDefinition(features);
        const hooks = this.generateVueComposables(features);
        const asyncLogic = features?.async ? this.generateVueAsyncLogic() : '';
        const formLogic = features?.form ? this.generateVueFormLogic(library || 'none') : '';
        const tableLogic = features?.table ? this.generateVueTableLogic(library || 'none') : '';

        let component = '';

        // Template
        component += `<template>\n`;
        component += `  <div class="${className}">\n`;
        component += `    <!-- Component content -->\n`;
        component += `  </div>\n`;
        component += `</template>\n\n`;

        // Script setup
        component += `<script setup lang="ts">\n`;
        component += `import { ref, onMounted } from 'vue';\n`;
        component += `${imports}\n\n`;
        component += `defineOptions({ name: '${componentName}' });\n\n`;
        component += `interface Props {\n`;
        component += `  // Define props here\n`;
        component += `}\n\n`;
        component += `const props = defineProps<Props>();\n\n`;
        component += `${emitsDefinition}\n\n`;
        component += `${hooks}\n`;
        component += `${asyncLogic}\n`;
        component += `${formLogic}\n`;
        component += `${tableLogic}\n`;
        component += `</script>\n\n`;

        // Styles
        const styleLang = styling === 'scss' ? ' lang="scss"' : '';
        component += `<style scoped${styleLang}>\n`;
        component += `.${className} {\n`;
        component += `  /* Styles here */\n`;
        component += `}\n`;
        component += `</style>`;

        return component;
    }

    /**
     * 生成组件
     */
    generate(): string {
        if (this.options.framework === 'react') {
            return this.generateReactComponent();
        } else {
            return this.generateVueComponent();
        }
    }

    /**
     * 生成样式文件
     */
    generateStyles(): string {
        const { name, styling } = this.options;
        const componentName = this.toPascalCase(name);

        switch (styling) {
            case 'css':
                return this.generateCSSStyles(name);
            case 'scss':
                return this.generateSCSSStyles(name);
            case 'styled-components':
                return this.generateStyledComponents(componentName);
            case 'tailwind':
                return this.generateTailwindStyles();
            default:
                return this.generateCSSStyles(name);
        }
    }

    // Private helper methods

    private toPascalCase(str: string): string {
        return str
            .split('-')
            .map(word => {
                if (word.length === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
    }

    private toKebabCase(str: string): string {
        return str
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replace(/[_\s]+/g, '-')
            .toLowerCase();
    }

    private resolveClassName(name: string): string {
        const pascalName = this.toPascalCase(name);
        return name.includes('-') ? pascalName : this.toKebabCase(pascalName);
    }

    private generateReactImports(library: string = 'none', features: any = {}): string {
        let imports = `import React from 'react';`;

        if (library === 'antd') {
            imports += `\nimport { Button, message } from 'antd';`;
        } else if (library === 'material-ui') {
            imports += `\nimport { Button } from '@mui/material';`;
        }

        if (features?.async) {
            imports += `\nimport { useState, useEffect } from 'react';`;
        }

        return imports;
    }

    private generateVueImports(library: string = 'none', features: any = {}): string {
        let imports = '';

        if (library === 'element-plus') {
            imports = `import { ElButton, ElMessage } from 'element-plus';`;
        }

        return imports;
    }

    private generatePropsInterface(name: string, features: any = {}): string {
        const componentName = this.toPascalCase(name);
        let interfaceDef = `interface ${componentName}Props {\n`;
        interfaceDef += `  // Define props here\n`;

        if (features?.async) {
            interfaceDef += `  data?: any[];\n`;
        }

        interfaceDef += `}`;

        return interfaceDef;
    }

    private generateVuePropsDefinition(features: any = {}): string {
        let propsDef = 'interface Props {\n';
        propsDef += '  // Define props here\n';
        propsDef += '}\n\n';
        propsDef += 'const props = defineProps<Props>();';
        return propsDef;
    }

    private generateVueEmitsDefinition(features: any = {}): string {
        let emitsDef = 'const emit = defineEmits<{\n';
        emitsDef += '  (e: "update:modelValue", value: any): void;\n';
        emitsDef += '}>();';
        return emitsDef;
    }

    private generateReactHooks(): string {
        return `const [loading, setLoading] = useState(false);\n  const [data, setData] = useState<any[]>([]);\n\n`;
    }

    private generateVueComposables(features: any = {}): string {
        let code = `const loading = ref(false);\n  const data = ref<any[]>([]);\n\n`;

        if (features?.hooks) {
            code = `const loading = ref(false);\n  const data = ref<any[]>([]);\n  const computedValue = computed(() => {\n    return data.value;\n  });\n\n`;
        }

        return code;
    }

    private generateAsyncLogic(): string {
        return `const fetchData = async () => {\n    try {\n      setLoading(true);\n      const response = await fetch('/api/data');\n      const result = await response.json();\n      setData(result);\n    } catch (error) {\n      message.error('获取数据失败');\n    } finally {\n      setLoading(false);\n    }\n  };\n\n`;
    }

    private generateVueAsyncLogic(): string {
        return `const fetchData = async () => {\n    try {\n      loading.value = true;\n      const response = await fetch('/api/data');\n      const result = await response.json();\n      data.value = result;\n    } catch (error) {\n      ElMessage.error('获取数据失败');\n    } finally {\n      loading.value = false;\n    }\n  };\n\n`;
    }

    private generateFormLogic(library: string): string {
        return `const [form] = Form.useForm();\n\n  const handleSubmit = async (values: any) => {\n    console.log('Form values:', values);\n  };\n\n`;
    }

    private generateVueFormLogic(library: string): string {
        return `// Form logic here\n\n`;
    }

    private generateTableLogic(library: string): string {
        return `// Table logic here\n\n`;
    }

    private generateVueTableLogic(library: string): string {
        return `// Table logic here\n\n`;
    }

    private generateCSSStyles(name: string): string {
        return `.${name} {\n  padding: 20px;\n}\n\n`;
    }

    private generateSCSSStyles(name: string): string {
        return `.${name} {\n  padding: 20px;\n\n  &__header {\n    font-size: 16px;\n    font-weight: bold;\n  }\n}\n\n`;
    }

    private generateStyledComponents(componentName: string): string {
        return `import styled from 'styled-components';\n\n`;
    }

    private generateTailwindStyles(): string {
        return `// Tailwind CSS classes are used directly in the template\n// Example: className="flex items-center justify-between"\n\n`;
    }
}

// Export convenience function
export function generateComponent(options: ComponentGeneratorOptions): string {
    const generator = new ComponentGenerator(options);
    return generator.generate();
}

export function generateStyles(options: ComponentGeneratorOptions): string {
    const generator = new ComponentGenerator(options);
    return generator.generateStyles();
}
