#!/bin/bash
#
# 查找未注册的 VSCode 扩展目录
# 查询 ~/.vscode/extensions 目录下哪些子目录不在 extensions.json 中
#

set -e

EXTENSIONS_DIR="${HOME}/.vscode/extensions"
EXTENSIONS_JSON="${EXTENSIONS_DIR}/extensions.json"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔍 查找未注册的 VSCode 扩展目录"
echo "================================"
echo ""

# 检查目录是否存在
if [ ! -d "$EXTENSIONS_DIR" ]; then
    echo -e "${RED}❌ 错误: 目录不存在: $EXTENSIONS_DIR${NC}"
    exit 1
fi

echo "📁 扩展目录: $EXTENSIONS_DIR"
echo ""

# 获取所有子目录（排除 extensions 目录本身和 .obsolete 等特殊文件）
echo "📋 扫描所有扩展目录..."
ALL_DIRS=$(find "$EXTENSIONS_DIR" -maxdepth 1 -type d ! -path "$EXTENSIONS_DIR" | sort)

# 统计总数
TOTAL_COUNT=$(echo "$ALL_DIRS" | grep -c -v "^$")
echo -e "${BLUE}找到 $TOTAL_COUNT 个扩展目录${NC}"
echo ""

# 检查 extensions.json 是否存在
if [ ! -f "$EXTENSIONS_JSON" ]; then
    echo -e "${YELLOW}⚠️ 警告: extensions.json 不存在${NC}"
    echo "所有扩展目录都可能是未注册的:"
    echo "$ALL_DIRS" | while read -r dir; do
        if [ -n "$dir" ] && [ "$dir" != "$EXTENSIONS_DIR" ]; then
            basename "$dir"
        fi
    done
    exit 0
fi

echo "📄 解析 extensions.json..."

# 检查 extensions.json 是否可读
if [ ! -r "$EXTENSIONS_JSON" ]; then
    echo -e "${RED}❌ 错误: 无法读取 extensions.json${NC}"
    exit 1
fi

# 从 extensions.json 中提取已安装的扩展 ID
# 格式: [{"identifier": {"id": "publisher.name"}, ...}]
REGISTERED_EXTENSIONS=$(cat "$EXTENSIONS_JSON" 2> /dev/null | tr -d '\n\r' | grep -o '"id":[[:space:]]*"[^"]*"' | sed 's/.*"id":[[:space:]]*"//g' | sed 's/"$//g' | sort -u)

REGISTERED_COUNT=$(echo "$REGISTERED_EXTENSIONS" | grep -c -v "^$")
echo -e "${GREEN}✓ 已注册扩展: $REGISTERED_COUNT 个${NC}"
echo ""

# 查找未注册的目录
echo "🔎 对比分析中..."
echo ""

UNREGISTERED_COUNT=0

echo "$ALL_DIRS" | while read -r dir; do
    if [ -z "$dir" ] || [ "$dir" = "$EXTENSIONS_DIR" ]; then
        continue
    fi

    DIR_NAME=$(basename "$dir")

    # 跳过隐藏目录和特殊文件
    if [[ "$DIR_NAME" == .* ]] || [[ "$DIR_NAME" == "extensions.json" ]]; then
        continue
    fi

    # 提取扩展 ID（格式: publisher.name-version）
    # 需要处理版本号，提取 publisher.name 部分
    EXT_ID=$(echo "$DIR_NAME" | sed -E 's/-[0-9]+\.[0-9]+\.[0-9]+.*$//' | sed -E 's/-[0-9]+\.[0-9]+.*$//')

    # 检查是否在已注册列表中
    if ! echo "$REGISTERED_EXTENSIONS" | grep -q "^${EXT_ID}$"; then
        echo -e "${YELLOW}⚠️ 未注册: $DIR_NAME${NC}"
        UNREGISTERED_COUNT=$((UNREGISTERED_COUNT + 1))
    fi
done

echo ""
echo "================================"
echo "📊 统计结果"
echo "================================"
echo -e "总扩展目录数: ${BLUE}$TOTAL_COUNT${NC}"
echo -e "已注册扩展数: ${GREEN}$REGISTERED_COUNT${NC}"

# 重新计算未注册数量（因为管道中变量作用域问题）
UNREGISTERED_COUNT=$(echo "$ALL_DIRS" | while read -r dir; do
    if [ -z "$dir" ] || [ "$dir" = "$EXTENSIONS_DIR" ]; then
        continue
    fi

    DIR_NAME=$(basename "$dir")

    if [[ "$DIR_NAME" == .* ]] || [[ "$DIR_NAME" == "extensions.json" ]]; then
        continue
    fi

    EXT_ID=$(echo "$DIR_NAME" | sed -E 's/-[0-9]+\.[0-9]+\.[0-9]+.*$//' | sed -E 's/-[0-9]+\.[0-9]+.*$//')

    if ! echo "$REGISTERED_EXTENSIONS" | grep -q "^${EXT_ID}$"; then
        echo "$DIR_NAME"
    fi
done | wc -l)

echo -e "未注册扩展数: ${RED}$UNREGISTERED_COUNT${NC}"
echo ""

if [ "$UNREGISTERED_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ 所有扩展目录都已注册!${NC}"
else
    echo -e "${YELLOW}💡 提示: 未注册的目录可能是:${NC}"
    echo "   - 手动复制安装的扩展"
    echo "   - 已卸载但未清理的残留目录"
    echo "   - 开发中的本地扩展"
    echo ""
    echo "${YELLOW}🧹 清理建议:${NC}"
    echo "   可以安全删除未注册的目录，或运行:"
    echo "   code --list-extensions | xargs -L1 code --uninstall-extension"
fi
