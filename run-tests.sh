#!/bin/bash

# 测试运行脚本
# 用于运行所有技能的测试并生成覆盖率报告

set -e

echo "========================================="
echo "运行技能测试"
echo "========================================="

# 进入项目根目录
cd "$(dirname "$0")"

# 运行Jest测试
echo ""
echo "运行测试..."
npx jest

echo ""
echo "========================================="
echo "测试完成"
echo "========================================="
echo ""
echo "覆盖率报告:"
echo "- HTML: test/coverage/index.html"
echo "- LCOV: test/coverage/lcov-report/index.html"
echo ""
