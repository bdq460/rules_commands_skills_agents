import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 定义作业及其范围
jobs = [
    (358, 517, 'TypeScript Lint'),
    (518, 797, '单元测试'),
    (797, 1018, '集成检查'),
    (1018, 1186, '文档构建'),
    (1186, None, '通知'),
]

lines = content.split('\n')
for i, line in enumerate(lines):
    # 检查当前行是否在某个作业的范围内
    current_job = None
    for start, end, job_name in jobs:
        if i + 1 >= start and (end is None or i + 1 <= end):
            current_job = job_name
            break
    
    # 如果在作业范围内，修改重复的四级标题
    if current_job:
        if re.match(r'^#### (配置详解|步骤详解|使用方式|效果说明)$', line):
            print(f"Line {i+1}: {line} -> {line} - {current_job}")
            lines[i] = f"{line} - {current_job}"

content = '\n'.join(lines)
with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
