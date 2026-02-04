#!/usr/bin/env node

/**
 * Code Reviewer Agent - 代码审查助手
 *
 * 用途：执行自动化代码审查，检查代码质量、安全、性能等问题
 * 使用场景：代码提交前、Code Review 流程、定期代码质量检查
 */

import fs from 'fs/promises';
import path from 'path';

// 审查结果类型
interface ReviewIssue {
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    category: 'quality' | 'security' | 'performance' | 'maintainability' | 'architecture';
    file: string;
    line: number;
    column?: number;
    title: string;
    description: string;
    code?: string;
    suggestion?: string;
    rule?: string;
}

interface ReviewReport {
    timestamp: string;
    targetPath: string;
    totalFiles: number;
    totalIssues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
    issues: ReviewIssue[];
    summary: string;
}

interface ReviewOptions {
    targetPath: string;
    checkQuality: boolean;
    checkSecurity: boolean;
    checkPerformance: boolean;
    checkMaintainability: boolean;
    checkArchitecture: boolean;
    excludePatterns: string[];
    outputFormat: 'json' | 'markdown' | 'console';
}

export class CodeReviewer {
    private options: ReviewOptions;
    private issues: ReviewIssue[] = [];

    constructor(options: ReviewOptions) {
        this.options = {
            checkQuality: options.checkQuality ?? true,
            checkSecurity: options.checkSecurity ?? true,
            checkPerformance: options.checkPerformance ?? true,
            checkMaintainability: options.checkMaintainability ?? true,
            checkArchitecture: options.checkArchitecture ?? true,
            excludePatterns: options.excludePatterns ?? ['node_modules', 'dist', 'build', '.git'],
            outputFormat: options.outputFormat ?? 'console',
            targetPath: options.targetPath
        };
    }

    /**
     * 执行代码审查
     */
    async review(): Promise<ReviewReport> {
        console.log('🔍 开始代码审查...\n');

        const startTime = Date.now();
        this.issues = [];

        // 获取所有需要审查的文件
        const files = await this.getTargetFiles();
        console.log(`📁 发现 ${files.length} 个文件需要审查\n`);

        // 逐个文件审查
        for (const file of files) {
            await this.reviewFile(file);
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n✅ 审查完成，耗时 ${duration}s`);

        return this.generateReport(files.length);
    }

    /**
     * 获取目标文件列表
     */
    private async getTargetFiles(): Promise<string[]> {
        const files: string[] = [];
        const stat = await fs.stat(this.options.targetPath);

        if (stat.isFile()) {
            return [this.options.targetPath];
        }

        await this.walkDirectory(this.options.targetPath, files);
        return files;
    }

    /**
     * 递归遍历目录
     */
    private async walkDirectory(dir: string, files: string[]): Promise<void> {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            // 检查排除模式
            if (this.shouldExclude(entry.name)) {
                continue;
            }

            if (entry.isDirectory()) {
                await this.walkDirectory(fullPath, files);
            } else if (this.isCodeFile(entry.name)) {
                files.push(fullPath);
            }
        }
    }

    /**
     * 检查是否应该排除
     */
    private shouldExclude(name: string): boolean {
        return this.options.excludePatterns.some(pattern =>
            name.includes(pattern) || name.startsWith('.')
        );
    }

    /**
     * 检查是否是代码文件
     */
    private isCodeFile(filename: string): boolean {
        const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.py', '.java', '.go', '.rs'];
        return codeExtensions.some(ext => filename.endsWith(ext));
    }

    /**
     * 审查单个文件
     */
    private async reviewFile(filePath: string): Promise<void> {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');

        // 代码质量检查
        if (this.options.checkQuality) {
            this.checkCodeQuality(filePath, content, lines);
        }

        // 安全检查
        if (this.options.checkSecurity) {
            this.checkSecurity(filePath, content, lines);
        }

        // 性能检查
        if (this.options.checkPerformance) {
            this.checkPerformance(filePath, content, lines);
        }

        // 可维护性检查
        if (this.options.checkMaintainability) {
            this.checkMaintainability(filePath, content, lines);
        }
    }

    /**
     * 检查代码质量
     */
    private checkCodeQuality(filePath: string, content: string, lines: string[]): void {
        // 检查过长的行
        lines.forEach((line, index) => {
            if (line.length > 120) {
                this.addIssue({
                    severity: 'low',
                    category: 'quality',
                    file: filePath,
                    line: index + 1,
                    title: '行长度超过 120 字符',
                    description: '代码行过长，影响可读性，建议换行或重构',
                    code: line.substring(0, 50) + '...',
                    suggestion: '将长行拆分为多行，或使用变量提取',
                    rule: 'max-line-length'
                });
            }
        });

        // 检查 console.log
        if (content.includes('console.log')) {
            const matches = content.match(/console\.log/g);
            if (matches && matches.length > 3) {
                this.addIssue({
                    severity: 'medium',
                    category: 'quality',
                    file: filePath,
                    line: 1,
                    title: '存在多个 console.log',
                    description: `发现 ${matches.length} 个 console.log，生产代码中应该使用专业的日志库`,
                    suggestion: '使用 winston、pino 等专业日志库替代 console.log'
                });
            }
        }
    }

    /**
     * 检查安全问题
     */
    private checkSecurity(filePath: string, content: string, lines: string[]): void {
        // 检查硬编码密钥
        const secretPatterns = [
            { pattern: /password\s*[=:]\s*['"][^'"]+['"]/i, name: 'password' },
            { pattern: /secret\s*[=:]\s*['"][^'"]+['"]/i, name: 'secret' },
            { pattern: /api[_-]?key\s*[=:]\s*['"][^'"]+['"]/i, name: 'api key' },
            { pattern: /token\s*[=:]\s*['"][^'"]+['"]/i, name: 'token' }
        ];

        secretPatterns.forEach(({ pattern, name }) => {
            lines.forEach((line, index) => {
                if (pattern.test(line) && !line.includes('process.env')) {
                    this.addIssue({
                        severity: 'critical',
                        category: 'security',
                        file: filePath,
                        line: index + 1,
                        title: `可能存在硬编码 ${name}`,
                        description: `发现疑似硬编码的 ${name}，这会导致敏感信息泄露`,
                        code: line.trim(),
                        suggestion: '使用环境变量（process.env）或密钥管理服务存储敏感信息',
                        rule: 'no-hardcoded-secrets'
                    });
                }
            });
        });

        // 检查 SQL 注入风险
        if (content.includes('${') && (content.includes('query') || content.includes('sql'))) {
            this.addIssue({
                severity: 'high',
                category: 'security',
                file: filePath,
                line: 1,
                title: '潜在的 SQL 注入风险',
                description: '发现字符串模板与 SQL 查询的组合，可能存在 SQL 注入风险',
                suggestion: '使用参数化查询或 ORM 框架，避免直接拼接 SQL'
            });
        }
    }

    /**
     * 检查性能问题
     */
    private checkPerformance(filePath: string, content: string, _lines: string[]): void {
        // 检查循环中的 await
        const asyncLoopPattern = /for\s*\([^)]*\)\s*\{[^}]*await/g;
        if (asyncLoopPattern.test(content)) {
            this.addIssue({
                severity: 'medium',
                category: 'performance',
                file: filePath,
                line: 1,
                title: '循环中使用 await',
                description: '在循环中使用 await 会导致串行执行，性能较差',
                suggestion: '使用 Promise.all() 或 Promise.allSettled() 并行执行'
            });
        }

        // 检查大数组操作
        if (content.includes('.filter') && content.includes('.map')) {
            this.addIssue({
                severity: 'low',
                category: 'performance',
                file: filePath,
                line: 1,
                title: '链式数组操作',
                description: '连续使用 filter 和 map 会遍历数组多次',
                suggestion: '考虑使用 reduce 一次遍历完成，或使用 lodash 的 chain'
            });
        }
    }

    /**
     * 检查可维护性
     */
    private checkMaintainability(filePath: string, content: string, lines: string[]): void {
        // 检查函数长度
        let functionStart = -1;
        let braceCount = 0;

        lines.forEach((line, index) => {
            if (line.includes('function') || line.match(/\)\s*=>\s*\{/)) {
                functionStart = index;
                braceCount = 1;
            } else if (functionStart >= 0) {
                braceCount += (line.match(/\{/g) || []).length;
                braceCount -= (line.match(/\}/g) || []).length;

                if (braceCount === 0) {
                    const functionLength = index - functionStart;
                    if (functionLength > 50) {
                        this.addIssue({
                            severity: 'medium',
                            category: 'maintainability',
                            file: filePath,
                            line: functionStart + 1,
                            title: '函数过长',
                            description: `函数长达 ${functionLength} 行，建议拆分为更小的函数`,
                            suggestion: '遵循单一职责原则，将长函数拆分为多个小函数'
                        });
                    }
                    functionStart = -1;
                }
            }
        });

        // 检查 TODO 注释
        const todoCount = (content.match(/TODO/gi) || []).length;
        if (todoCount > 5) {
            this.addIssue({
                severity: 'low',
                category: 'maintainability',
                file: filePath,
                line: 1,
                title: '存在多个 TODO',
                description: `发现 ${todoCount} 个 TODO，建议及时完成或创建 Issue 跟踪`,
                suggestion: '优先处理 TODO，或使用项目管理工具跟踪'
            });
        }
    }

    /**
     * 添加问题
     */
    private addIssue(issue: Omit<ReviewIssue, 'severity' | 'category'> & Partial<Pick<ReviewIssue, 'severity' | 'category'>>): void {
        this.issues.push({
            severity: issue.severity || 'medium',
            category: issue.category || 'quality',
            ...issue
        } as ReviewIssue);
    }

    /**
     * 生成审查报告
     */
    private generateReport(totalFiles: number): ReviewReport {
        const critical = this.issues.filter(i => i.severity === 'critical').length;
        const high = this.issues.filter(i => i.severity === 'high').length;
        const medium = this.issues.filter(i => i.severity === 'medium').length;
        const low = this.issues.filter(i => i.severity === 'low').length;
        const info = this.issues.filter(i => i.severity === 'info').length;

        // 按严重程度和文件排序
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        this.issues.sort((a, b) => {
            const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
            if (severityDiff !== 0) return severityDiff;
            return a.file.localeCompare(b.file);
        });

        // 生成总结
        let summary = '';
        if (critical > 0) {
            summary = `发现 ${critical} 个严重问题，必须立即修复`;
        } else if (high > 0) {
            summary = `发现 ${high} 个高风险问题，建议优先修复`;
        } else if (medium > 0) {
            summary = `发现 ${medium} 个中等问题，可以逐步改进`;
        } else if (low > 0) {
            summary = `发现 ${low} 个低优先级问题，代码质量良好`;
        } else {
            summary = '代码质量优秀，未发现明显问题';
        }

        return {
            timestamp: new Date().toISOString(),
            targetPath: this.options.targetPath,
            totalFiles,
            totalIssues: this.issues.length,
            critical,
            high,
            medium,
            low,
            info,
            issues: this.issues,
            summary
        };
    }

    /**
     * 输出报告
     */
    static outputReport(report: ReviewReport, format: 'json' | 'markdown' | 'console' = 'console'): void {
        switch (format) {
            case 'json':
                console.log(JSON.stringify(report, null, 2));
                break;
            case 'markdown':
                CodeReviewer.outputMarkdown(report);
                break;
            case 'console':
            default:
                CodeReviewer.outputConsole(report);
                break;
        }
    }

    /**
     * 控制台输出
     */
    private static outputConsole(report: ReviewReport): void {
        console.log('\n' + '='.repeat(60));
        console.log('📊 代码审查报告');
        console.log('='.repeat(60));
        console.log(`\n审查文件: ${report.totalFiles} 个`);
        console.log(`发现问题: ${report.totalIssues} 个`);
        console.log(`  🔴 严重: ${report.critical}`);
        console.log(`  🟠 高: ${report.high}`);
        console.log(`  🟡 中: ${report.medium}`);
        console.log(`  🟢 低: ${report.low}`);
        console.log(`  🔵 信息: ${report.info}`);
        console.log(`\n💡 ${report.summary}`);

        if (report.issues.length > 0) {
            console.log('\n' + '-'.repeat(60));
            console.log('📋 问题详情');
            console.log('-'.repeat(60));

            report.issues.forEach((issue, index) => {
                const severityEmoji = {
                    critical: '🔴',
                    high: '🟠',
                    medium: '🟡',
                    low: '🟢',
                    info: '🔵'
                }[issue.severity];

                console.log(`\n${index + 1}. ${severityEmoji} [${issue.severity.toUpperCase()}] ${issue.title}`);
                console.log(`   📁 ${issue.file}:${issue.line}`);
                console.log(`   📝 ${issue.description}`);
                if (issue.suggestion) {
                    console.log(`   💡 建议: ${issue.suggestion}`);
                }
            });
        }

        console.log('\n' + '='.repeat(60));
    }

    /**
     * Markdown 输出
     */
    private static outputMarkdown(report: ReviewReport): void {
        console.log(`# 代码审查报告

## 概览

- **审查时间**: ${report.timestamp}
- **审查路径**: ${report.targetPath}
- **审查文件**: ${report.totalFiles} 个
- **发现问题**: ${report.totalIssues} 个
  - 🔴 严重: ${report.critical}
  - 🟠 高: ${report.high}
  - 🟡 中: ${report.medium}
  - 🟢 低: ${report.low}
  - 🔵 信息: ${report.info}

## 总结

${report.summary}

## 问题详情

`);

        const severityOrder = ['critical', 'high', 'medium', 'low', 'info'] as const;
        severityOrder.forEach(severity => {
            const issues = report.issues.filter(i => i.severity === severity);
            if (issues.length > 0) {
                const severityTitle = severity.charAt(0).toUpperCase() + severity.slice(1);
                console.log(`### ${severityTitle} (${issues.length})\n`);

                issues.forEach(issue => {
                    console.log(`#### ${issue.title}

**位置**: \`${issue.file}:${issue.line}\`

**问题**: ${issue.description}

${issue.code ? `**代码**:
\`\`\`typescript
${issue.code}
\`\`\`

` : ''}${issue.suggestion ? `**建议**: ${issue.suggestion}

` : ''}---

`);
                });
            }
        });
    }
}

// 命令行入口
async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('用法: code-reviewer <path> [options]');
        console.log('');
        console.log('选项:');
        console.log('  --format=<format>    输出格式: console, json, markdown (默认: console)');
        console.log('  --no-quality         跳过代码质量检查');
        console.log('  --no-security        跳过安全检查');
        console.log('  --no-performance     跳过性能检查');
        console.log('  --no-maintainability 跳过可维护性检查');
        console.log('');
        console.log('示例:');
        console.log('  code-reviewer src/');
        console.log('  code-reviewer src/auth.ts --format=markdown');
        process.exit(1);
    }

    const targetPath = args[0];
    const format = (args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'console') as 'json' | 'markdown' | 'console';

    const options: ReviewOptions = {
        targetPath,
        checkQuality: !args.includes('--no-quality'),
        checkSecurity: !args.includes('--no-security'),
        checkPerformance: !args.includes('--no-performance'),
        checkMaintainability: !args.includes('--no-maintainability'),
        checkArchitecture: true,
        excludePatterns: ['node_modules', 'dist', 'build', '.git'],
        outputFormat: format
    };

    try {
        const reviewer = new CodeReviewer(options);
        const report = await reviewer.review();
        CodeReviewer.outputReport(report, format);

        // 如果有严重问题，返回非零退出码
        if (report.critical > 0) {
            process.exit(2);
        }
    } catch (error) {
        console.error('审查失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default CodeReviewer;
