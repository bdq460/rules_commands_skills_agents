# Product Flow and Roles Skills

产品开发流程和角色技能系统 - 自动化代码生成与项目管理工具集。

## 项目结构

```text
.
├── skills/                 # 各角色技能实现
│   ├── backend-engineer/   # 后端工程师
│   ├── frontend-engineer/  # 前端工程师
│   ├── data-engineer/      # 数据工程师
│   ├── product-expert/     # 产品专家
│   ├── project-coordinator/# 项目协调员
│   └── ...                 # 其他角色
├── scripts/                # 通用脚本工具
├── test/                   # 测试文件
├── references/             # 参考文档
├── templates/              # 模板文件
└── rules/                  # 规则定义

```

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch

# 详细输出模式
npm run test:verbose

# 使用 shell 脚本运行测试
npm run test:run
```

### 代码检查

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix
```

## 测试覆盖率

当前测试覆盖率：

- **测试套件**: 39 个测试套件全部通过
- **测试用例**: 993 个测试全部通过
- **整体覆盖率**:
  - Statements: 97%+
  - Branches: 85%+
  - Functions: 99%+
  - Lines: 97%+

查看详细覆盖率报告：

```bash
npm run test:coverage
# 然后打开 test/coverage/index.html
```

## 技术栈

- **语言**: TypeScript
- **测试框架**: Jest
- **代码检查**: ESLint
- **Node.js**: v20+

## 开发指南

### 添加新测试

测试文件应放置在 `test/skills/<role-name>/` 目录下，文件名格式：`*.test.ts`

示例：

```typescript
import { SomeGenerator } from '../../../skills/some-role/scripts/some-generator';

describe('SomeGenerator', () => {
    it('should work correctly', () => {
        // 测试实现
        expect(true).toBe(true);
    });
});
```

### 配置文件说明

- **package.json**: 项目依赖和脚本配置
- **tsconfig.json**: TypeScript 编译配置
- **test/jest.config.js**: Jest 测试配置
- **.eslintrc.json**: ESLint 代码检查规则
- **.gitignore**: Git 忽略文件配置

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！
