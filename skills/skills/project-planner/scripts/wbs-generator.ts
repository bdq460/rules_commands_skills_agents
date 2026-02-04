#!/usr/bin/env node

/**
 * Project Planner - WBS生成脚本
 *
 * 用途：生成工作分解结构（WBS）、项目计划、甘特图
 * 使用场景：项目启动时、需求变更时、项目规划阶段
 */

interface Task {
    id: string;
    name: string;
    description?: string;
    duration: number;
    unit: "days" | "hours";
    dependencies: string[];
    assignees: string[];
    priority: "critical" | "high" | "medium" | "low";
    status: "pending" | "in-progress" | "completed";
    deliverables: string[];
}

interface Phase {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    tasks: Task[];
    dependencies: string[];
}

interface WBS {
    project: string;
    version: string;
    startDate: string;
    endDate: string;
    totalDuration: number;
    phases: Phase[];
    milestones: Milestone[];
}

interface Milestone {
    id: string;
    name: string;
    date: string;
    description: string;
    dependencies: string[];
}

interface GanttChart {
    tasks: GanttTask[];
}

interface GanttTask {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    dependencies: string[];
}

export class WBSGenerator {
    /**
     * 生成完整WBS
     */
    generateWBS(projectInfo: {
        name: string;
        startDate: string;
        description: string;
        phases?: Phase[];
    }): WBS {
        const wbs: WBS = {
            project: projectInfo.name,
            version: "1.0",
            startDate: projectInfo.startDate,
            endDate: "",
            totalDuration: 0,
            phases:
                projectInfo.phases || this.getDefaultPhases(projectInfo.startDate),
            milestones: [],
        };

        // 计算项目总天数
        const totalDays = this.calculateTotalDays(wbs.phases);
        wbs.totalDuration = totalDays;

        // 设置结束日期
        wbs.endDate = this.addDays(wbs.startDate, totalDays);

        // 生成里程碑
        wbs.milestones = this.generateMilestones(wbs);

        return wbs;
    }

    /**
     * 生成默认阶段
     */
    private getDefaultPhases(startDate: string): Phase[] {
        const phases: Phase[] = [
            {
                id: "P1",
                name: "需求分析",
                description: "收集和分析项目需求",
                startDate: startDate,
                endDate: this.addDays(startDate, 10),
                tasks: [
                    {
                        id: "T1.1",
                        name: "用户需求收集",
                        description: "通过访谈、问卷等方式收集用户需求",
                        duration: 5,
                        unit: "days",
                        dependencies: [],
                        assignees: ["Product Manager", "Requirements Analyst"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["用户需求文档", "用户访谈记录"],
                    },
                    {
                        id: "T1.2",
                        name: "需求分析和整理",
                        description: "分析收集的需求，整理成需求规格说明书",
                        duration: 5,
                        unit: "days",
                        dependencies: ["T1.1"],
                        assignees: ["Requirements Analyst"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["需求规格说明书", "用例图"],
                    },
                ],
                dependencies: [],
            },
            {
                id: "P2",
                name: "产品设计",
                description: "设计产品原型和功能规格",
                startDate: this.addDays(startDate, 11),
                endDate: this.addDays(startDate, 25),
                tasks: [
                    {
                        id: "T2.1",
                        name: "产品原型设计",
                        description: "使用Figma或Sketch设计产品原型",
                        duration: 7,
                        unit: "days",
                        dependencies: ["T1.2"],
                        assignees: ["UI Designer", "Product Manager"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["产品原型（低保真）", "产品原型（高保真）"],
                    },
                    {
                        id: "T2.2",
                        name: "功能规格说明",
                        description: "编写详细的功能规格说明",
                        duration: 7,
                        unit: "days",
                        dependencies: ["T2.1"],
                        assignees: ["Product Manager"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["功能规格说明书", "API文档初稿"],
                    },
                ],
                dependencies: ["P1"],
            },
            {
                id: "P3",
                name: "技术架构设计",
                description: "设计系统技术架构",
                startDate: this.addDays(startDate, 26),
                endDate: this.addDays(startDate, 40),
                tasks: [
                    {
                        id: "T3.1",
                        name: "系统架构设计",
                        description: "设计系统整体架构和技术选型",
                        duration: 7,
                        unit: "days",
                        dependencies: ["T2.2"],
                        assignees: ["Technical Architect", "Backend Lead"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["架构设计文档", "技术选型报告"],
                    },
                    {
                        id: "T3.2",
                        name: "数据库设计",
                        description: "设计数据库Schema和ER图",
                        duration: 7,
                        unit: "days",
                        dependencies: ["T3.1"],
                        assignees: ["Database Engineer"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["数据库设计文档", "ER图"],
                    },
                ],
                dependencies: ["P2"],
            },
            {
                id: "P4",
                name: "开发实现",
                description: "前后端开发和API实现",
                startDate: this.addDays(startDate, 41),
                endDate: this.addDays(startDate, 80),
                tasks: [
                    {
                        id: "T4.1",
                        name: "后端API开发",
                        description: "实现后端API接口",
                        duration: 20,
                        unit: "days",
                        dependencies: ["T3.2"],
                        assignees: ["Backend Developers"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["后端API代码", "API文档"],
                    },
                    {
                        id: "T4.2",
                        name: "前端页面开发",
                        description: "实现前端页面和交互",
                        duration: 20,
                        unit: "days",
                        dependencies: ["T3.1", "T4.1"],
                        assignees: ["Frontend Developers"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["前端代码", "页面样式"],
                    },
                ],
                dependencies: ["P3"],
            },
            {
                id: "P5",
                name: "测试验证",
                description: "功能测试、集成测试和性能测试",
                startDate: this.addDays(startDate, 81),
                endDate: this.addDays(startDate, 95),
                tasks: [
                    {
                        id: "T5.1",
                        name: "单元测试和集成测试",
                        description: "编写和执行单元测试、集成测试",
                        duration: 7,
                        unit: "days",
                        dependencies: ["T4.1", "T4.2"],
                        assignees: ["QA Engineers", "Developers"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["测试用例", "测试报告"],
                    },
                    {
                        id: "T5.2",
                        name: "性能测试和安全测试",
                        description: "执行性能测试和安全测试",
                        duration: 7,
                        unit: "days",
                        dependencies: ["T5.1"],
                        assignees: ["QA Engineers", "Security Engineer"],
                        priority: "medium",
                        status: "pending",
                        deliverables: ["性能测试报告", "安全测试报告"],
                    },
                ],
                dependencies: ["P4"],
            },
            {
                id: "P6",
                name: "部署上线",
                description: "部署到生产环境",
                startDate: this.addDays(startDate, 96),
                endDate: this.addDays(startDate, 100),
                tasks: [
                    {
                        id: "T6.1",
                        name: "部署准备",
                        description: "准备生产环境、配置CI/CD",
                        duration: 3,
                        unit: "days",
                        dependencies: ["T5.2"],
                        assignees: ["DevOps Engineer"],
                        priority: "high",
                        status: "pending",
                        deliverables: ["CI/CD配置", "部署文档"],
                    },
                    {
                        id: "T6.2",
                        name: "正式部署",
                        description: "将应用部署到生产环境",
                        duration: 2,
                        unit: "days",
                        dependencies: ["T6.1"],
                        assignees: ["DevOps Engineer"],
                        priority: "critical",
                        status: "pending",
                        deliverables: ["生产环境应用", "部署日志"],
                    },
                ],
                dependencies: ["P5"],
            },
        ];

        return phases;
    }

    /**
     * 生成里程碑
     */
    private generateMilestones(wbs: WBS): Milestone[] {
        const milestones: Milestone[] = [];

        for (const phase of wbs.phases) {
            milestones.push({
                id: `M${phase.id}`,
                name: `${phase.name}完成`,
                date: phase.endDate,
                description: `${phase.description}阶段完成`,
                dependencies: phase.tasks.map((t) => t.id),
            });
        }

        return milestones;
    }

    /**
     * 计算总天数
     */
    private calculateTotalDays(phases: Phase[]): number {
        return phases.length * 15; // 每个阶段约15天
    }

    /**
     * 日期加法
     */
    private addDays(date: string, days: number): string {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d.toISOString().split("T")[0];
    }

    /**
     * 生成Markdown格式WBS
     */
    generateMarkdownWBS(wbs: WBS): string {
        let markdown = `# ${wbs.project} 工作分解结构 (WBS)

**版本**: ${wbs.version}
**开始日期**: ${wbs.startDate}
**结束日期**: ${wbs.endDate}
**总工期**: ${wbs.totalDuration}天

---

## 项目里程碑

`;

        for (const milestone of wbs.milestones) {
            markdown += `- [ ] ${milestone.name} (${milestone.date})\n`;
            markdown += `  - ${milestone.description}\n\n`;
        }

        markdown += `---

## 项目阶段

`;

        for (const phase of wbs.phases) {
            markdown += `### ${phase.id} - ${phase.name}

**描述**: ${phase.description}
**开始日期**: ${phase.startDate}
**结束日期**: ${phase.endDate}

**任务列表**:
`;

            for (const task of phase.tasks) {
                const priorityEmoji = {
                    critical: "🔴",
                    high: "🟠",
                    medium: "🟡",
                    low: "🟢",
                };

                markdown += `- [ ] ${task.id}: ${task.name} ${priorityEmoji[task.priority]}\n`;
                markdown += `  - 工期: ${task.duration} ${task.unit === "days" ? "天" : "小时"}\n`;
                if (task.description) {
                    markdown += `  - 描述: ${task.description}\n`;
                }
                if (task.dependencies.length > 0) {
                    markdown += `  - 依赖: ${task.dependencies.join(", ")}\n`;
                }
                markdown += `  - 负责人: ${task.assignees.join(", ")}\n`;
                if (task.deliverables.length > 0) {
                    markdown += `  - 交付物: ${task.deliverables.join(", ")}\n`;
                }
                markdown += "\n";
            }

            markdown += "\n";
        }

        return markdown;
    }

    /**
     * 生成甘特图
     */
    generateGanttChart(wbs: WBS): GanttChart {
        const ganttTasks: GanttTask[] = [];

        for (const phase of wbs.phases) {
            for (const task of phase.tasks) {
                const taskStart =
                    task.dependencies.length > 0
                        ? this.getTaskEndDate(ganttTasks, task.dependencies[0])
                        : phase.startDate;

                const taskEnd = this.addDays(taskStart, task.duration);

                ganttTasks.push({
                    id: task.id,
                    name: `${task.id}: ${task.name}`,
                    start: taskStart,
                    end: taskEnd,
                    progress:
                        task.status === "completed"
                            ? 100
                            : task.status === "in-progress"
                                ? 50
                                : 0,
                    dependencies: task.dependencies,
                });
            }
        }

        return { tasks: ganttTasks };
    }

    /**
     * 获取任务结束日期
     */
    private getTaskEndDate(tasks: GanttTask[], taskId: string): string {
        const task = tasks.find((t) => t.id === taskId);
        return task ? task.end : "";
    }

    /**
     * 生成Mermaid甘特图
     */
    generateMermaidGantt(wbs: WBS): string {
        let mermaid = `gantt\n`;
        mermaid += `    title ${wbs.project}\n`;
        mermaid += `    dateFormat  YYYY-MM-DD\n`;
        mermaid += `    axisFormat  %m/%d\n\n`;

        for (const phase of wbs.phases) {
            mermaid += `    section ${phase.name}\n`;

            for (const task of phase.tasks) {
                const taskStart =
                    task.dependencies.length > 0
                        ? this.getDependencyStartDate(task.dependencies[0])
                        : phase.startDate;

                const taskEnd = this.addDays(taskStart, task.duration);
                const duration = this.calculateDuration(taskStart, taskEnd);

                mermaid += `    ${task.name} :${duration}d, ${taskStart}\n`;
            }
        }

        return mermaid;
    }

    /**
     * 获取依赖任务的开始日期
     */
    private getDependencyStartDate(taskId: string): string {
        // 简化实现，实际需要追踪任务时间线
        return "";
    }

    /**
     * 计算持续时间
     */
    private calculateDuration(start: string, end: string): number {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * 生成项目资源分配表
     */
    generateResourceAllocation(wbs: WBS): string {
        const resourceMap = new Map<
            string,
            { taskCount: number; totalHours: number }
        >();

        for (const phase of wbs.phases) {
            for (const task of phase.tasks) {
                for (const assignee of task.assignees) {
                    if (!resourceMap.has(assignee)) {
                        resourceMap.set(assignee, { taskCount: 0, totalHours: 0 });
                    }
                    const resource = resourceMap.get(assignee)!;
                    resource.taskCount++;
                    resource.totalHours += task.duration * 8; // 假设每天8小时
                }
            }
        }

        let table = `## 资源分配表

| 资源 | 任务数 | 总工时 |
|------|--------|--------|
`;

        for (const [resource, data] of resourceMap.entries()) {
            table += `| ${resource} | ${data.taskCount} | ${data.totalHours} |\n`;
        }

        return table;
    }
}

// CLI使用示例
if (require.main === module) {
    const generator = new WBSGenerator();

    const wbs = generator.generateWBS({
        name: "电商网站项目",
        startDate: "2024-01-15",
        description: "开发一个完整的电商平台",
    });

    console.log("=== WBS (Markdown) ===");
    console.log(generator.generateMarkdownWBS(wbs));

    console.log("\n=== Mermaid甘特图 ===");
    console.log(generator.generateMermaidGantt(wbs));

    console.log("\n=== 资源分配 ===");
    console.log(generator.generateResourceAllocation(wbs));
}
