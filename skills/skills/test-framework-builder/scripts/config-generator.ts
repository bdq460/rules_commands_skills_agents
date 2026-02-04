#!/usr/bin/env node

/**
 * Test Framework Builder - 测试配置生成脚本
 *
 * 用途：生成测试框架配置文件、测试运行脚本
 * 使用场景：项目初始化、配置测试框架
 */

interface TestFramework {
  name: 'jest' | 'mocha' | 'vitest' | 'jasmine';
  version?: string;
}

interface TestConfig {
  framework: TestFramework;
  coverage: boolean;
  coverageThreshold: number;
  testMatch: string[];
  setupFiles: string[];
  environment: 'node' | 'jsdom' | 'happy-dom';
  reporters: string[];
}

interface ESLintTestConfig {
  env: string[];
  extends: string[];
  plugins: string[];
  rules: Record<string, string>;
}

export class ConfigGenerator {
  /**
   * 生成Jest配置
   */
  generateJestConfig(config: TestConfig): string {
    let jestConfig = `module.exports = {
  preset: 'ts-jest',
  testEnvironment: '${config.environment}',
  roots: ['<rootDir>/src'],
  testMatch: [${config.testMatch.map(p => `'${p}'`).join(', ')}],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: ${config.coverageThreshold},
      functions: ${config.coverageThreshold},
      lines: ${config.coverageThreshold},
      statements: ${config.coverageThreshold}
    }
  },
`;

    if (config.setupFiles && config.setupFiles.length > 0) {
      jestConfig += `  setupFilesAfterEnv: [${config.setupFiles.map(f => `'${f}'`).join(', ')}],\n`;
    }

    jestConfig += `  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  collectCoverage: ${config.coverage},
  verbose: true
};
`;

    return jestConfig;
  }

  /**
   * 生成Vitest配置
   */
  generateVitestConfig(config: TestConfig): string {
    return `import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: '${config.environment}',
    globals: true,
    setupFiles: ${JSON.stringify(config.setupFiles)},
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        'src/**/*.stories.{js,jsx,ts,tsx}',
        'src/**/__tests__/**'
      ],
      all: true,
      lines: ${config.coverageThreshold},
      functions: ${config.coverageThreshold},
      branches: ${config.coverageThreshold},
      statements: ${config.coverageThreshold}
    },
    include: ${JSON.stringify(config.testMatch)},
    alias: {
      '@': './src'
    }
  }
});
`;
  }

  /**
   * 生成Mocha配置
   */
  generateMochaConfig(config: TestConfig): string {
    return `module.exports = {
  require: [${config.setupFiles.map(f => `'${f}'`).join(', ')}],
  spec: ${JSON.stringify(config.testMatch)},
  timeout: 10000,
  reporter: ${JSON.stringify(config.reporters)},
  coverage: ${config.coverage},
  coverageProvider: 'v8',
  reporterOptions: {
    html: {
      outputDir: './coverage/html'
    },
    json: {
      outputDir: './coverage/json'
    }
  },
  coverageThreshold: {
    global: {
      lines: ${config.coverageThreshold},
      functions: ${config.coverageThreshold},
      branches: ${config.coverageThreshold},
      statements: ${config.coverageThreshold}
    }
  }
};
`;
  }

  /**
   * 生成Jasmine配置
   */
  generateJasmineConfig(config: TestConfig): string {
    return `module.exports = {
  spec_dir: 'src',
  spec_files: ${JSON.stringify(config.testMatch)},
  helpers: ${JSON.stringify(config.setupFiles)},
  stopSpecOnExpectationFailure: false,
  random: true
};
`;
  }

  /**
   * 生成ESLint测试配置
   */
  generateESLintTestConfig(config: ESLintTestConfig): string {
    let eslint = `module.exports = {
  env: {
    ${config.env.join(',\n    ')},
    es2021: true
  },
  extends: [
${config.extends.map(e => `    '${e}'`).join(',\n')}
  ],
  plugins: [
${config.plugins.map(p => `    '${p}'`).join(',\n')}
  ],
  rules: {
`;

    for (const [rule, value] of Object.entries(config.rules)) {
      eslint += `    '${rule}': ${value},\n`;
    }

    eslint += `  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
};
`;

    return eslint;
  }

  /**
   * 生成测试设置文件
   */
  generateSetupFile(framework: 'jest' | 'vitest' | 'mocha' | 'jasmine'): string {
    const setups: Record<string, string> = {
      jest: `// Jest Setup File

import '@testing-library/jest-dom';

// Mock global objects
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
`,
      vitest: `// Vitest Setup File

import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock global objects
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
`,
      mocha: `// Mocha Setup File

import { expect } from 'chai';
import { JSDOM } from 'jsdom';

// Setup JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window as any;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Setup chai expectations
global.expect = expect;

// Mock fetch
global.fetch = () => Promise.resolve({
  json: () => Promise.resolve({})
});
`,
      jasmine: `// Jasmine Setup File

// Setup testing helpers
beforeEach(() => {
  jasmine.addMatchers({
    toBeInTheDocument: () => {
      return {
        compare: (actual: any) => {
          const pass = actual !== null && actual !== undefined;
          return {
            pass,
            message: () => pass ? 'Element exists in document' : 'Element does not exist in document'
          };
        }
      };
    }
  });
});
`
    };

    return setups[framework];
  }

  /**
   * 生成package.json脚本
   */
  generatePackageJsonScripts(framework: string): string {
    const scripts: Record<string, string> = {
      'test': `${framework} test`,
      'test:watch': `${framework} test --watch`,
      'test:coverage': `${framework} test --coverage`,
      'test:ci': `${framework} test --ci --coverage --maxWorkers=2`
    };

    return JSON.stringify(scripts, null, 2);
  }

  /**
   * 生成测试示例
   */
  generateTestExample(framework: string, type: 'unit' | 'integration' | 'e2e'): string {
    const examples: Record<string, Record<string, string>> = {
      jest: {
        unit: `// Unit Test Example (Jest)

import { sum, multiply } from './math';

describe('Math Utils', () => {
  describe('sum', () => {
    it('should add two numbers correctly', () => {
      expect(sum(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(sum(-1, -2)).toBe(-3);
    });

    it('should handle zero', () => {
      expect(sum(0, 0)).toBe(0);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(2, 3)).toBe(6);
    });
  });
});
`,
        integration: `// Integration Test Example (Jest)

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('should render initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('should increment count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: 'Increment' });
    await user.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('should decrement count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);
    
    const button = screen.getByRole('button', { name: 'Decrement' });
    await user.click(button);
    
    expect(screen.getByText('Count: 4')).toBeInTheDocument();
  });
});
`,
        e2e: `// E2E Test Example (Playwright)

import { test, expect } from '@playwright/test';

test.describe('User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[name="username"]', 'invalid');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText('Invalid credentials');
  });
});
`
      },
      vitest: {
        unit: `// Unit Test Example (Vitest)

import { describe, it, expect } from 'vitest';
import { sum, multiply } from './math';

describe('Math Utils', () => {
  describe('sum', () => {
    it('should add two numbers correctly', () => {
      expect(sum(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(sum(-1, -2)).toBe(-3);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(2, 3)).toBe(6);
    });
  });
});
`,
        integration: `// Integration Test Example (Vitest)

import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter.vue';

describe('Counter Component', () => {
  it('should render initial count', () => {
    render(Counter);
    expect(screen.getByText('Count: 0')).toBeTruthy();
  });

  it('should increment count when button is clicked', async () => {
    const user = userEvent.setup();
    render(Counter);
    
    const button = screen.getByRole('button', { name: 'Increment' });
    await user.click(button);
    
    expect(screen.getByText('Count: 1')).toBeTruthy();
  });
});
`,
        e2e: `// E2E Test Example (Cypress)

describe('User Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('h1', 'Welcome').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[name="username"]').type('invalid');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button[type="submit"]').click();

    cy.get('.error').should('be.visible');
    cy.get('.error').should('contain', 'Invalid credentials');
  });
});
`
      },
      mocha: {
        unit: `// Unit Test Example (Mocha)

import { expect } from 'chai';
import { sum, multiply } from './math';

describe('Math Utils', () => {
  describe('sum', () => {
    it('should add two numbers correctly', () => {
      expect(sum(2, 3)).to.equal(5);
    });

    it('should handle negative numbers', () => {
      expect(sum(-1, -2)).to.equal(-3);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(2, 3)).to.equal(6);
    });
  });
});
`,
        integration: `// Integration Test Example (Mocha)

import { expect } from 'chai';
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter.vue';

describe('Counter Component', () => {
  it('should render initial count', () => {
    const { getByText } = render(Counter);
    expect(getByText('Count: 0')).to.exist;
  });

  it('should increment count when button is clicked', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(Counter);
    
    const button = getByRole('button', { name: 'Increment' });
    await user.click(button);
    
    expect(getByText('Count: 1')).to.exist;
  });
});
`,
        e2e: `// E2E Test Example (Cypress)

describe('User Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('h1', 'Welcome').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[name="username"]').type('invalid');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button[type="submit"]').click();

    cy.get('.error').should('be.visible');
    cy.get('.error').should('contain', 'Invalid credentials');
  });
});
`
      },
      jasmine: {
        unit: `// Unit Test Example (Jasmine)

import { sum, multiply } from './math';

describe('Math Utils', () => {
  describe('sum', () => {
    it('should add two numbers correctly', () => {
      expect(sum(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(sum(-1, -2)).toBe(-3);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(2, 3)).toBe(6);
    });
  });
});
`,
        integration: `// Integration Test Example (Jasmine)

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CounterComponent } from './counter.component';

describe('Counter Component', () => {
  it('should render initial count', () => {
    render(CounterComponent);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('should increment count when button is clicked', async () => {
    const user = userEvent.setup();
    render(CounterComponent);
    
    const button = screen.getByRole('button', { name: 'Increment' });
    await user.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
`,
        e2e: `// E2E Test Example (Protractor)

describe('User Login Flow', () => {
  beforeEach(() => {
    browser.get('/login');
  });

  it('should login with valid credentials', () => {
    element(by.name('username')).sendKeys('testuser');
    element(by.name('password')).sendKeys('password123');
    element(by.css('button[type="submit"]')).click();

    expect(browser.getCurrentUrl()).toContain('/dashboard');
    expect(element(by.tagName('h1')).getText()).toContain('Welcome');
  });

  it('should show error with invalid credentials', () => {
    element(by.name('username')).sendKeys('invalid');
    element(by.name('password')).sendKeys('wrong');
    element(by.css('button[type="submit"]')).click();

    expect(element(by.css('.error')).isDisplayed()).toBe(true);
    expect(element(by.css('.error')).getText()).toContain('Invalid credentials');
  });
});
`
      }
    };

    return examples[framework]?.[type] || '// No example available';
  }

  /**
   * 生成默认测试配置
   */
  static getDefaultConfig(framework: 'jest' | 'vitest' | 'mocha' | 'jasmine' = 'jest'): TestConfig {
    return {
      framework: {
        name: framework,
        version: 'latest'
      },
      coverage: true,
      coverageThreshold: 80,
      testMatch: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.{test,spec}.{js,jsx,ts,tsx}'],
      setupFiles: ['<rootDir>/src/setupTests.ts'],
      environment: 'jsdom',
      reporters: ['default', 'jest-junit']
    };
  }

  /**
   * 生成默认ESLint测试配置
   */
  static getDefaultESLintConfig(): ESLintTestConfig {
    return {
      env: ['jest', 'node'],
      extends: [
        'eslint:recommended',
        'plugin:jest/recommended',
        'plugin:jest/style'
      ],
      plugins: ['jest'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
      }
    };
  }
}

// ============================================================================
// 导出的便捷函数
// ============================================================================

const defaultGenerator = new ConfigGenerator();

/**
 * 生成Jest配置
 */
export function generateJestConfig(config?: any): string {
  const finalConfig = {
    ...ConfigGenerator.getDefaultConfig('jest'),
    ...config
  };
  return defaultGenerator.generateJestConfig(finalConfig);
}

/**
 * 生成Mocha配置
 */
export function generateMochaConfig(config?: any): string {
  const finalConfig = {
    ...ConfigGenerator.getDefaultConfig('mocha'),
    ...config
  };
  return defaultGenerator.generateMochaConfig(finalConfig);
}

/**
 * 生成Cypress配置
 */
export function generateCypressConfig(options?: any): string {
  const baseUrl = options?.baseUrl || 'http://localhost:3000';
  const supportFile = options?.supportFile || 'cypress/support/e2e.ts';
  const pluginsFile = options?.pluginsFile || 'cypress/plugins/index.ts';
  const viewportWidth = options?.viewportWidth || 1280;
  const viewportHeight = options?.viewportHeight || 720;
  const video = options?.video !== undefined ? options.video : false;
  const screenshotOnRunFailure = options?.screenshotOnRunFailure !== undefined ? options.screenshotOnRunFailure : true;

  return `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: '${baseUrl}',
    supportFile: '${supportFile}',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: ${viewportWidth},
    viewportHeight: ${viewportHeight},
    video: ${video},
    screenshotOnRunFailure: ${screenshotOnRunFailure},
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});
`;
}

/**
 * 生成测试设置
 */
export function generateTestingSetup(framework: 'jest' | 'vitest' | 'mocha' | 'jasmine' = 'jest', language: 'typescript' | 'javascript' = 'typescript'): { markdown: string } {
  let markdown = `# 测试框架设置指南 - ${framework.toUpperCase()}\n\n`;
  markdown += `## 语言\n\n${language === 'typescript' ? 'TypeScript' : 'JavaScript'}\n\n`;
  markdown += `## 框架\n\n${framework}\n\n`;

  if (framework === 'jest') {
    markdown += `## 安装依赖\n\n`;
    if (language === 'typescript') {
      markdown += `\`\`\`bash\nnpm install --save-dev jest @types/jest ts-jest\n\`\`\`\n\n`;
    } else {
      markdown += `\`\`\`bash\nnpm install --save-dev jest\n\`\`\`\n\n`;
    }
    markdown += `## 配置文件\n\n`;
    markdown += `### jest.config.js\n\n`;
    markdown += `\`\`\`javascript\nmodule.exports = {\n  testEnvironment: 'node',\n  collectCoverageFrom: ['src/**/*.{js,ts}'],\n  testMatch: ['**/*.test.{js,ts}']\n};\n\`\`\`\n\n`;
  } else if (framework === 'mocha') {
    markdown += `## 安装依赖\n\n`;
    if (language === 'typescript') {
      markdown += `\`\`\`bash\nnpm install --save-dev mocha @types/mocha ts-node\n\`\`\`\n\n`;
    } else {
      markdown += `\`\`\`bash\nnpm install --save-dev mocha\n\`\`\`\n\n`;
    }
    markdown += `## 配置文件\n\n`;
    markdown += `### .mocharc.js\n\n`;
    markdown += `\`\`\`javascript\nmodule.exports = {\n  timeout: 5000,\n  require: ['ts-node/register'],\n  spec: ['test/**/*.test.{js,ts}']\n};\n\`\`\`\n\n`;
  }

  markdown += `## 测试示例\n\n`;
  markdown += `\`\`\`${language}\ndescribe('示例测试', () => {\n  it('应该通过', () => {\n    expect(true).toBe(true);\n  });\n});\n\`\`\`\n\n`;

  markdown += `## 最佳实践\n\n`;
  markdown += `- 保持测试简单\n- 每个测试只测试一个功能\n- 使用描述性的测试名称\n- 避免过度使用 mock\n\n`;

  markdown += `## 常见问题\n\n`;
  markdown += `### 如何运行测试？\n\n使用 npm test 命令运行测试。\n\n### 如何调试测试？\n\n使用 --inspect 标志进行调试。\n\n`;

  return { markdown };
}

// CLI使用示例
if (require.main === module) {
  const generator = new ConfigGenerator();

  // 生成Jest配置
  const jestConfig = ConfigGenerator.getDefaultConfig('jest');
  console.log('=== Jest Config ===');
  console.log(generator.generateJestConfig(jestConfig));

  // 生成ESLint测试配置
  const eslintConfig = ConfigGenerator.getDefaultESLintConfig();
  console.log('\n=== ESLint Test Config ===');
  console.log(generator.generateESLintTestConfig(eslintConfig));

  // 生成测试示例
  console.log('\n=== Unit Test Example (Jest) ===');
  console.log(generator.generateTestExample('jest', 'unit'));

  console.log('\n=== Integration Test Example (Jest) ===');
  console.log(generator.generateTestExample('jest', 'integration'));

  console.log('\n=== E2E Test Example (Jest) ===');
  console.log(generator.generateTestExample('jest', 'e2e'));
}
