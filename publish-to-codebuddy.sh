#!/bin/bash

# 发布脚本 - 将 skills、rules、commands 发布到 ~/.codebuddy/
# Author: CodeBuddy
# Date: 2026-02-03

set -e # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 目标目录
CODEBUDDY_DIR="$HOME/.codebuddy"

# 发布统计
PUBLISHED_COUNT=0
SKIPPED_COUNT=0
DELETED_COUNT=0
ERROR_COUNT=0

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_section() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# 确保目标目录存在
ensure_target_dir() {
    local target_dir="$1"
    if [ ! -d "$target_dir" ]; then
        mkdir -p "$target_dir"
        print_info "创建目录: $target_dir"
    fi
}

# 发布单个文件或目录
publish_item() {
    local source="$1"
    local target="$2"
    local item_name
    item_name=$(basename "$source")

    # 检查源是否存在
    if [ ! -e "$source" ]; then
        print_error "源文件/目录不存在: $source"
        ((ERROR_COUNT++))
        return 1
    fi

    # 检查目标是否已存在同名文件/目录
    if [ -e "$target" ]; then
        print_warning "目标已存在，删除旧版本: $item_name"
        rm -rf "$target"
        ((DELETED_COUNT++))
    fi

    # 复制文件或目录
    if [ -d "$source" ]; then
        cp -r "$source" "$target"
    else
        cp "$source" "$target"
    fi

    print_success "已发布: $item_name"
    ((PUBLISHED_COUNT++))
    return 0
}

# 发布 rules
publish_rules() {
    print_section "发布 Rules"

    local source_dir="$PROJECT_ROOT/rules"
    local target_dir="$CODEBUDDY_DIR/rules"

    ensure_target_dir "$target_dir"

    if [ ! -d "$source_dir" ]; then
        print_warning "rules 目录不存在，跳过"
        return
    fi

    for item in "$source_dir"/*; do
        if [ -e "$item" ]; then
            local item_name
            item_name=$(basename "$item")
            publish_item "$item" "$target_dir/$item_name"
        fi
    done
}

# 发布 commands
publish_commands() {
    print_section "发布 Commands"

    local source_dir="$PROJECT_ROOT/commands"
    local target_dir="$CODEBUDDY_DIR/commands"

    ensure_target_dir "$target_dir"

    if [ ! -d "$source_dir" ]; then
        print_warning "commands 目录不存在，跳过"
        return
    fi

    for item in "$source_dir"/*; do
        if [ -e "$item" ]; then
            local item_name
            item_name=$(basename "$item")
            publish_item "$item" "$target_dir/$item_name"
        fi
    done
}

# 发布 skills
publish_skills() {
    print_section "发布 Skills"

    local source_dir="$PROJECT_ROOT/skills/skills"
    local target_dir="$CODEBUDDY_DIR/skills"

    ensure_target_dir "$target_dir"

    if [ ! -d "$source_dir" ]; then
        print_warning "skills/skills 目录不存在，跳过"
        return
    fi

    for item in "$source_dir"/*; do
        if [ -e "$item" ]; then
            local item_name
            item_name=$(basename "$item")
            publish_item "$item" "$target_dir/$item_name"
        fi
    done
}

# 打印发布统计
print_summary() {
    print_section "发布统计"
    echo "发布成功: $PUBLISHED_COUNT"
    echo "跳过处理: $SKIPPED_COUNT"
    echo "删除旧版本: $DELETED_COUNT"
    echo "错误数量: $ERROR_COUNT"
    echo ""
    echo "目标目录: $CODEBUDDY_DIR"
}

# 主函数
main() {
    print_section "CodeBuddy 发布工具"
    echo "项目根目录: $PROJECT_ROOT"
    echo "目标目录: $CODEBUDDY_DIR"
    echo ""

    # 检查是否在正确的目录中
    if [ ! -f "$PROJECT_ROOT/package.json" ]; then
        print_error "未找到 package.json，请确保在项目根目录中运行此脚本"
        exit 1
    fi

    # 执行发布
    publish_rules
    publish_commands
    publish_skills

    # 打印统计信息
    print_summary

    # 检查是否有错误
    if [ $ERROR_COUNT -gt 0 ]; then
        print_warning "发布完成，但有 $ERROR_COUNT 个错误"
        exit 1
    else
        print_success "发布成功！"
        exit 0
    fi
}

# 执行主函数
main "$@"
