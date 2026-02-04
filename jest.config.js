
/**
 * Jest配置文件
 * 用于skills脚本的单元测试
 * 使用ES module语法与package.json中的"type": "module"保持一致
 */
/** 下边这句是一个 JSDoc 类型注解，用于给编辑器提供类型提示和智能补全。 */
/** @type {import('jest').Config} */
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES module中替代__dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    // 根目录指向项目根目录
    rootDir: __dirname,

    // 测试环境
    testEnvironment: 'node',

    // 模块名映射（支持 TypeScript 路径别名）
    // 将 #/ 映射到 <rootDir>/skills
    moduleNameMapper: {
        '^#/(.*)$': '<rootDir>/skills/$1',
    },

    // 确保在测试前加载环境与探针
    // setupFilesAfterEnv 文件在 Jest 转换器运行之前就被加载了。
    // 使用.ts文件扩展名以确保文件可以被 ts-jest 处理。
    // 如使用.js文件扩展名, 则 jest 会尝试用自己的转换器去处理它, 导致无法识别 ES Module 语法。
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // 测试文件匹配模式
    testMatch: [
        '**/?(*.)+(spec|test).js',
        '**/?(*.)+(spec|test).ts'
    ],

    // 模块路径映射
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'mjs',
        'jsx',
        'json',
        'node'
    ],

    // 覆盖率收集
    collectCoverage: true,

    // 覆盖率收集文件
    collectCoverageFrom: [
        '<rootDir>/skills/**/*.ts',
        '<rootDir>/scripts/**/*.ts',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/__tests__/',
    ],
    coverageDirectory: '<rootDir>/test/coverage',

    // 覆盖率报告格式
    coverageReporters: [
        'text',
        'text-summary',
        'json',
        'json-summary',
        'lcov',
        'html',
    ],

    // 覆盖率阈值
    coverageThreshold: {
        global: {
            branches: 85,
            functions: 99,
            lines: 97,
            statements: 97,
        },
    },

    // TypeScript预处理器 - 使用 ts-jest ESM preset 以支持ES模块
    preset: 'ts-jest/presets/default-esm',

    // 转换配置 - 确保setup文件也能被正确转换
    // 所有 .ts、.tsx、.js 文件都经过 ts-jest 转换器转换，将 TypeScript/ES module 转换为 Jest 可执行的 JavaScript。
    // 为什么要使用test-jest转换器?
    // Jest 原生只支持 CommonJS 语法, 项目使用 ES Module, 所以要使用转换器.
    transform: {
        '^.+\.(ts|tsx|js)$': ['ts-jest', {
            useESM: true,
            tsconfig: '<rootDir>/test/tsconfig.json'
        }]
    },

    // 需要转换的文件
    transformIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],

    // 没有测试时通过
    passWithNoTests: true,

    // 详细输出
    verbose: true,
};
