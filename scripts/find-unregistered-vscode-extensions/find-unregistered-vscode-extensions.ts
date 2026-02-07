#!/usr/bin/env node
/**
 * 查找未注册的 VSCode 扩展目录
 *
 * 查询 ~/.vscode/extensions 目录下哪些子目录不在 extensions.json 中
 * 这些未注册的目录可能是手动安装的扩展或残留文件
 */

import * as fs from "fs/promises";
import * as path from "path";
import { existsSync } from "fs";

// 颜色代码
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[0;31m",
  green: "\x1b[0;32m",
  yellow: "\x1b[1;33m",
  blue: "\x1b[0;34m",
  cyan: "\x1b[0;36m",
  gray: "\x1b[0;90m",
};

interface ExtensionInfo {
  id: string;
  version: string;
  publisher: string;
  path: string;
  isRegistered: boolean;
}

interface ExtensionsJson {
  extensions?: Array<{
    identifier: {
      id: string;
    };
    version: string;
    location: {
      path: string;
    };
  }>;
}

/**
 * 解析扩展目录名称
 * 格式: publisher.name-version 或 publisher.name@version
 */
function parseExtensionDirName(dirName: string): {
  id: string;
  version: string;
} | null {
  // 匹配格式: publisher.name-1.2.3 或 publisher.name-1.2.3-insider
  const match = dirName.match(/^([a-z0-9-]+\.[a-z0-9-]+)-(\d+\.\d+\.\d+.*)$/i);
  if (match) {
    return {
      id: match[1],
      version: match[2],
    };
  }

  // 匹配格式: publisher.name@1.2.3 (旧格式)
  const matchOld = dirName.match(/^([a-z0-9-]+\.[a-z0-9-]+)@(\d+\.\d+\.\d+.*)$/i);
  if (matchOld) {
    return {
      id: matchOld[1],
      version: matchOld[2],
    };
  }

  return null;
}

/**
 * 加载 extensions.json
 * 注意：extensions.json 是一个数组，不是对象
 */
async function loadExtensionsJson(
  filePath: string
): Promise<ExtensionsJson | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    // 去除开头的空行和空白字符
    const trimmed = content.trim();
    // 如果直接是数组，包装成对象
    if (trimmed.startsWith("[")) {
      return { extensions: JSON.parse(trimmed) };
    }
    return JSON.parse(trimmed);
  } catch (error) {
    return null;
  }
}

/**
 * 扫描扩展目录
 */
async function scanExtensionsDir(dirPath: string): Promise<ExtensionInfo[]> {
  const extensions: ExtensionInfo[] = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      // 只处理目录，跳过文件和隐藏目录
      if (!entry.isDirectory() || entry.name.startsWith(".")) {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const parsed = parseExtensionDirName(entry.name);

      if (parsed) {
        extensions.push({
          id: parsed.id,
          version: parsed.version,
          publisher: parsed.id.split(".")[0],
          path: fullPath,
          isRegistered: false, // 稍后设置
        });
      } else {
        // 无法解析的目录，可能是非标准格式
        extensions.push({
          id: entry.name,
          version: "unknown",
          publisher: "unknown",
          path: fullPath,
          isRegistered: false,
        });
      }
    }
  } catch (error) {
    console.error(`${colors.red}❌ 读取目录失败: ${dirPath}${colors.reset}`);
    throw error;
  }

  return extensions;
}

/**
 * 主函数
 */
async function main() {
  const extensionsDir = path.join(process.env.HOME || "~", ".vscode/extensions");
  const extensionsJsonPath = path.join(extensionsDir, "extensions.json");

  console.log(`${colors.cyan}🔍 查找未注册的 VSCode 扩展目录${colors.reset}`);
  console.log(`${colors.gray}================================${colors.reset}`);
  console.log();

  // 检查目录是否存在
  if (!existsSync(extensionsDir)) {
    console.error(
      `${colors.red}❌ 错误: 目录不存在: ${extensionsDir}${colors.reset}`
    );
    process.exit(1);
  }

  console.log(`${colors.blue}📁 扩展目录: ${extensionsDir}${colors.reset}`);
  console.log();

  // 扫描所有扩展目录
  console.log(`${colors.gray}📋 扫描所有扩展目录...${colors.reset}`);
  const allExtensions = await scanExtensionsDir(extensionsDir);
  console.log(`${colors.blue}找到 ${allExtensions.length} 个扩展目录${colors.reset}`);
  console.log();

  // 加载 extensions.json
  console.log(`${colors.gray}📄 解析 extensions.json...${colors.reset}`);
  const extensionsJson = await loadExtensionsJson(extensionsJsonPath);

  if (!extensionsJson) {
    console.log(`${colors.yellow}⚠️ 警告: extensions.json 不存在或无法解析${colors.reset}`);
    console.log();
    console.log(`${colors.yellow}所有扩展目录都可能是未注册的:${colors.reset}`);
    allExtensions.forEach((ext) => {
      console.log(`  ${colors.red}⚠️${colors.reset} ${ext.id} ${colors.gray}(${ext.version})${colors.reset}`);
    });
    process.exit(0);
  }

  // 提取已注册的扩展 ID
  const registeredIds = new Set<string>();
  if (extensionsJson.extensions) {
    extensionsJson.extensions.forEach((ext) => {
      registeredIds.add(ext.identifier.id.toLowerCase());
    });
  }

  console.log(`${colors.green}✓ 已注册扩展: ${registeredIds.size} 个${colors.reset}`);
  console.log();

  // 对比分析
  console.log(`${colors.gray}🔎 对比分析中...${colors.reset}`);
  console.log();

  const unregistered: ExtensionInfo[] = [];
  const registered: ExtensionInfo[] = [];

  for (const ext of allExtensions) {
    if (registeredIds.has(ext.id.toLowerCase())) {
      ext.isRegistered = true;
      registered.push(ext);
    } else {
      unregistered.push(ext);
    }
  }

  // 显示结果
  if (unregistered.length > 0) {
    console.log(`${colors.yellow}⚠️ 未注册的扩展目录:${colors.reset}`);
    console.log();

    // 按发布者分组
    const byPublisher: Record<string, ExtensionInfo[]> = {};
    for (const ext of unregistered) {
      if (!byPublisher[ext.publisher]) {
        byPublisher[ext.publisher] = [];
      }
      byPublisher[ext.publisher].push(ext);
    }

    for (const [publisher, exts] of Object.entries(byPublisher)) {
      console.log(`${colors.cyan}${publisher}:${colors.reset}`);
      for (const ext of exts) {
        console.log(
          `  ${colors.red}⚠️${colors.reset} ${ext.id} ${colors.gray}v${ext.version}${colors.reset}`
        );
        console.log(`     ${colors.gray}路径: ${ext.path}${colors.reset}`);
      }
      console.log();
    }
  }

  // 统计
  console.log(`${colors.gray}================================${colors.reset}`);
  console.log(`${colors.cyan}📊 统计结果${colors.reset}`);
  console.log(`${colors.gray}================================${colors.reset}`);
  console.log(`总扩展目录数: ${colors.blue}${allExtensions.length}${colors.reset}`);
  console.log(`已注册扩展数: ${colors.green}${registered.length}${colors.reset}`);
  console.log(`未注册扩展数: ${colors.red}${unregistered.length}${colors.reset}`);
  console.log();

  if (unregistered.length === 0) {
    console.log(`${colors.green}✅ 所有扩展目录都已注册!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}💡 提示: 未注册的目录可能是:${colors.reset}`);
    console.log("   • 手动复制安装的扩展");
    console.log("   • 已卸载但未清理的残留目录");
    console.log("   • 开发中的本地扩展");
    console.log("   • 测试或临时扩展");
    console.log();
    console.log(`${colors.yellow}🧹 清理建议:${colors.reset}`);
    console.log("   可以安全删除未注册的目录，或运行:");
    console.log(
      `   ${colors.cyan}code --list-extensions | xargs -L1 code --uninstall-extension${colors.reset}`
    );
    console.log();
    console.log(`${colors.yellow}⚠️  删除命令 (谨慎使用):${colors.reset}`);
    for (const ext of unregistered) {
      console.log(`   rm -rf "${ext.path}"`);
    }
  }
}

// 运行主函数
main().catch((error) => {
  console.error(`${colors.red}❌ 错误: ${error.message}${colors.reset}`);
  process.exit(1);
});
