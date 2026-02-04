#!/usr/bin/env node

/**
 * CodeBuddy 发布脚本
 * 将项目的 skills、rules、commands 发布到 ~/.codebuddy/ 目录
 *
 * 发布规则:
 * - rules/* -> ~/.codebuddy/rules
 * - commands/* -> ~/.codebuddy/commands
 * - skills/skills/* -> ~/.codebuddy/skills
 *
 * 重复处理规则:
 * - 如果目标目录存在同名文件/目录，则删除后重新发布
 * - 不会删除目标目录中当前项目不存在的文件
 */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// 类型定义
interface PublishStats {
    published: number;
    skipped: number;
    deleted: number;
    errors: number;
}

// 颜色代码
const colors = {
    reset: '\x1b[0m',
    blue: '\x1b[34m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m'
};

// 获取项目根目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 目标目录
const codeBuddyDir = path.join(os.homedir(), '.codebuddy');

// 发布统计
const stats: PublishStats = {
    published: 0,
    skipped: 0,
    deleted: 0,
    errors: 0
};

/**
 * 打印带颜色的消息
 */
function printSuccess(message: string): void {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
}

function printWarning(message: string): void {
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

function printError(message: string): void {
    console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

function printSection(title: string): void {
    console.log('');
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.blue}${title}${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}`);
}

/**
 * 确保目标目录存在
 */
async function ensureTargetDir(targetDir: string): Promise<void> {
    try {
        await fs.mkdir(targetDir, { recursive: true });
    } catch (error) {
        // 目录可能已存在，忽略错误
        const err = error as { code?: string };
        if (err.code !== 'EEXIST') {
            throw error;
        }
    }
}

/**
 * 删除目标目录或文件
 */
async function deleteTarget(target: string): Promise<void> {
    try {
        const stat = await fs.stat(target);
        if (stat.isDirectory()) {
            await fs.rm(target, { recursive: true, force: true });
        } else {
            await fs.unlink(target);
        }
    } catch (error) {
        // 目标可能不存在，忽略错误
        const err = error as { code?: string };
        if (err.code !== 'ENOENT') {
            throw error;
        }
    }
}

/**
 * 复制文件或目录
 */
async function copyItem(source: string, target: string): Promise<void> {
    const stat = await fs.stat(source);
    if (stat.isDirectory()) {
        await fs.cp(source, target, { recursive: true });
    } else {
        await fs.copyFile(source, target);
    }
}

/**
 * 发布单个文件或目录
 */
async function publishItem(source: string, target: string): Promise<boolean> {
    const itemName = path.basename(source);

    // 检查源是否存在
    try {
        await fs.access(source);
    } catch {
        printError(`源文件/目录不存在: ${source}`);
        stats.errors++;
        return false;
    }

    // 检查目标是否已存在同名文件/目录
    try {
        await fs.access(target);
        printWarning(`目标已存在，删除旧版本: ${itemName}`);
        await deleteTarget(target);
        stats.deleted++;
    } catch {
        // 目标不存在，继续
    }

    // 复制文件或目录
    try {
        await copyItem(source, target);
        printSuccess(`已发布: ${itemName}`);
        stats.published++;
        return true;
    } catch (error) {
        printError(`发布失败: ${itemName} - ${(error as Error).message}`);
        stats.errors++;
        return false;
    }
}

/**
 * 发布目录中的所有内容
 */
async function publishDirectory(sourceDir: string, targetDir: string, dirName: string): Promise<void> {
    printSection(`发布 ${dirName}`);

    await ensureTargetDir(targetDir);

    // 检查源目录是否存在
    try {
        await fs.access(sourceDir);
    } catch {
        printWarning(`${dirName} 目录不存在，跳过`);
        return;
    }

    // 读取源目录中的所有项目
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const targetPath = path.join(targetDir, entry.name);

        await publishItem(sourcePath, targetPath);
    }
}

/**
 * 发布 rules
 */
async function publishRules(): Promise<void> {
    const sourceDir = path.join(projectRoot, 'rules');
    const targetDir = path.join(codeBuddyDir, 'rules');
    await publishDirectory(sourceDir, targetDir, 'Rules');
}

/**
 * 发布 commands
 */
async function publishCommands(): Promise<void> {
    const sourceDir = path.join(projectRoot, 'commands');
    const targetDir = path.join(codeBuddyDir, 'commands');
    await publishDirectory(sourceDir, targetDir, 'Commands');
}

/**
 * 发布 skills
 */
async function publishSkills(): Promise<void> {
    const sourceDir = path.join(projectRoot, 'skills', 'skills');
    const targetDir = path.join(codeBuddyDir, 'skills');
    await publishDirectory(sourceDir, targetDir, 'Skills');
}

/**
 * 打印发布统计
 */
function printSummary(): void {
    printSection('发布统计');
    console.log(`发布成功: ${stats.published}`);
    console.log(`跳过处理: ${stats.skipped}`);
    console.log(`删除旧版本: ${stats.deleted}`);
    console.log(`错误数量: ${stats.errors}`);
    console.log('');
    console.log(`目标目录: ${codeBuddyDir}`);
}

/**
 * 主函数
 */
async function main(): Promise<number> {
    printSection('CodeBuddy 发布工具');
    console.log(`项目根目录: ${projectRoot}`);
    console.log(`目标目录: ${codeBuddyDir}`);
    console.log('');

    // 检查是否在正确的目录中
    try {
        await fs.access(path.join(projectRoot, 'package.json'));
    } catch {
        printError('未找到 package.json，请确保在项目根目录中运行此脚本');
        return 1;
    }

    // 执行发布
    await publishRules();
    await publishCommands();
    await publishSkills();

    // 打印统计信息
    printSummary();

    // 检查是否有错误
    if (stats.errors > 0) {
        printWarning(`发布完成，但有 ${stats.errors} 个错误`);
        return 1;
    } else {
        printSuccess('发布成功！');
        return 0;
    }
}

// 执行主函数
main()
    .then((exitCode) => {
        process.exit(exitCode);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
