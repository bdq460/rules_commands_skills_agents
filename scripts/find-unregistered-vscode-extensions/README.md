# VSCode 扩展管理脚本

## find-unregistered-vscode-extensions

查找 `~/.vscode/extensions` 目录下哪些子目录不在 `extensions.json` 中，即非安装插件目录。

### 用途

- 发现手动安装的扩展
- 清理已卸载但未删除的残留目录
- 识别开发中的本地扩展

### 使用方法

#### Bash 版本

```bash
# 直接运行
./scripts/find-unregistered-vscode-extensions.sh

# 或使用 npx
npx tsx scripts/find-unregistered-vscode-extensions.sh
```

#### TypeScript 版本（推荐）

```bash
# 运行 TypeScript 版本
npx tsx scripts/find-unregistered-vscode-extensions.ts
```

### 输出示例

```text
🔍 查找未注册的 VSCode 扩展目录
================================

📁 扩展目录: /Users/username/.vscode/extensions

📋 扫描所有扩展目录...
找到 45 个扩展目录

📄 解析 extensions.json...
✓ 已注册扩展: 42 个

🔎 对比分析中...

⚠️ 未注册的扩展目录:

ms-vscode:
  ⚠️ ms-vscode.test-extension v0.1.0
     路径: /Users/username/.vscode/extensions/ms-vscode.test-extension-0.1.0

unknown:
  ⚠️ my-custom-extension vunknown
     路径: /Users/username/.vscode/extensions/my-custom-extension

================================
📊 统计结果
================================
总扩展目录数: 45
已注册扩展数: 42
未注册扩展数: 3

💡 提示: 未注册的目录可能是:
   • 手动复制安装的扩展
   • 已卸载但未清理的残留目录
   • 开发中的本地扩展

🧹 清理建议:
   可以安全删除未注册的目录
```

### 清理命令

脚本会输出可以直接执行的删除命令：

```bash
rm -rf "/Users/username/.vscode/extensions/ms-vscode.test-extension-0.1.0"
rm -rf "/Users/username/.vscode/extensions/my-custom-extension"
```

### 文件说明

| 文件 | 说明 |
|------|------|
| `find-unregistered-vscode-extensions.sh` | Bash 版本，无需依赖 |
| `find-unregistered-vscode-extensions.ts` | TypeScript 版本，功能更完善 |

### 注意事项

1. **谨慎删除**: 删除前请确认这些扩展确实不再需要
2. **备份重要**: 如果是开发中的本地扩展，请先备份
3. **VSCode 重启**: 清理后建议重启 VSCode
