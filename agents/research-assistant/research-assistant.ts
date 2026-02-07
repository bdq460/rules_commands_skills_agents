#!/usr/bin/env node
/**
 * Research Assistant Agent
 * 智能研究助手 - 协助进行技术调研、信息收集和知识整理
 *
 * 这是一个标准的 LLM Agent，可以：
 * 1. 执行多步骤研究任务
 * 2. 收集和整理信息
 * 3. 生成研究报告
 * 4. 提供决策建议
 *
 * 支持多种大模型：OpenAI、GLM、Claude、Qwen、DeepSeek 等
 * 使用 JSON 配置文件管理 LLM 设置
 */

import * as fs from "fs/promises";
import { OpenAI } from "openai";
import * as path from "path";
import {
    ConfigManager,
    type LLMConfig,
    type ProviderConfig,
    configManager,
} from "./config/llm-config";

// ============================================================================
// 类型定义
// ============================================================================

interface ResearchTask {
    id: string;
    topic: string;
    questions: string[];
    depth: "overview" | "detailed" | "comprehensive";
    outputFormat: "summary" | "report" | "comparison" | "decision-matrix";
}

interface ResearchFinding {
    question: string;
    answer: string;
    sources: string[];
    confidence: "high" | "medium" | "low";
}

interface ResearchReport {
    task: ResearchTask;
    findings: ResearchFinding[];
    summary: string;
    recommendations?: string[];
    createdAt: Date;
    executionStats?: ExecutionStats;
}

/**
 * 执行统计信息
 */
interface ExecutionStats {
    /** 总执行时间（毫秒） */
    totalTimeMs: number;
    /** 各问题执行时间（毫秒） */
    questionTimesMs: number[];
    /** 总结生成时间（毫秒） */
    summaryTimeMs: number;
    /** 总消耗 token 数 */
    totalTokens: number;
    /** 总请求次数 */
    totalRequests: number;
    /** 开始时间 */
    startedAt: Date;
    /** 结束时间 */
    completedAt: Date;
}

// ============================================================================
// 核心类
// ============================================================================

export class ResearchAssistant {
    private client: OpenAI;
    private provider: ProviderConfig;
    private model: string;
    private maxTokens: number;
    private temperature: number;
    private totalTokens: number = 0; // 总消耗 token 数
    private totalRequests: number = 0; // 总请求次数

    constructor(
        apiKey?: string,
        providerName?: string,
        model?: string,
        baseURL?: string
    ) {
        // 获取当前激活的提供商配置
        this.provider = configManager.getActiveProvider();

        // 如果指定了特定提供商，切换到该提供商
        if (providerName) {
            const config = configManager.getConfig();
            if (config.providers[providerName]) {
                this.provider = config.providers[providerName];
            } else {
                throw new Error(`未知的提供商: ${providerName}`);
            }
        }

        // 确定模型
        this.model = model || this.provider.model;

        // 确定 API Key
        const key = apiKey || this.provider.apiKey;
        if (!key || key.startsWith("${")) {
            throw new Error(
                `未找到 API Key。请在配置文件中设置 ${this.provider.name} 的 apiKey，或设置对应的环境变量`
            );
        }

        // 确定 Base URL
        const url = baseURL || this.provider.baseURL;

        // 获取设置
        const settings = configManager.getConfig().settings;
        this.maxTokens = settings.maxTokens;
        this.temperature = settings.temperature;

        // 初始化客户端
        this.client = new OpenAI({
            apiKey: key,
            baseURL: url,
        });

        console.log(`🤖 使用模型: ${this.provider.name} (${this.model})`);
    }

    /**
     * 执行研究任务
     */
    async conductResearch(task: ResearchTask): Promise<ResearchReport> {
        const startedAt = new Date();
        console.log(`🔍 开始研究: ${task.topic}`);
        console.log(`   深度: ${task.depth}, 格式: ${task.outputFormat}`);
        console.log(`   开始时间: ${startedAt.toLocaleString()}`);

        const findings: ResearchFinding[] = [];
        const questionTimesMs: number[] = [];

        // 并行回答所有问题（带并发控制）
        const concurrencyLimit = 5; // 最多同时3个请求
        console.log(`\n📝 开始并行研究 ${task.questions.length} 个问题 (并发限制: ${concurrencyLimit})`);

        const processQuestion = async (question: string, index: number): Promise<ResearchFinding> => {
            const questionStart = Date.now();
            console.log(`   [${index + 1}/${task.questions.length}] ${question.substring(0, 50)}...`);
            const finding = await this.researchQuestion(question, task);
            const questionTime = Date.now() - questionStart;
            questionTimesMs[index] = questionTime;
            console.log(`   ✅ [${index + 1}] 完成 (置信度: ${finding.confidence}, 耗时: ${this.formatDuration(questionTime)})`);
            return finding;
        };

        // 分批并行处理
        for (let i = 0; i < task.questions.length; i += concurrencyLimit) {
            const batch = task.questions.slice(i, i + concurrencyLimit);
            const batchFindings = await Promise.all(
                batch.map((q, idx) => processQuestion(q, i + idx))
            );
            findings.push(...batchFindings);
        }

        // 生成总结
        console.log(`\n📊 开始生成研究总结...`);
        const summaryStart = Date.now();
        const summary = await this.generateSummary(task, findings);
        const summaryTimeMs = Date.now() - summaryStart;
        console.log(`   ✅ 总结生成完成 (耗时: ${this.formatDuration(summaryTimeMs)})`);

        // 生成建议（如果需要）
        const recommendations = await this.generateRecommendations(task, findings);

        // 计算执行统计
        const completedAt = new Date();
        const totalTimeMs = completedAt.getTime() - startedAt.getTime();

        const executionStats: ExecutionStats = {
            totalTimeMs,
            questionTimesMs,
            summaryTimeMs,
            totalTokens: this.totalTokens,
            totalRequests: this.totalRequests,
            startedAt,
            completedAt,
        };

        const report: ResearchReport = {
            task,
            findings,
            summary,
            recommendations,
            createdAt: new Date(),
            executionStats,
        };

        return report;
    }

    /**
     * 格式化时长
     */
    private formatDuration(ms: number): string {
        if (ms < 1000) {
            return `${ms}ms`;
        }
        return `${(ms / 1000).toFixed(2)}s`;
    }

    /**
     * 研究单个问题
     */
    private async researchQuestion(
        question: string,
        task: ResearchTask
    ): Promise<ResearchFinding> {
        const prompt = this.buildResearchPrompt(question, task);

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: this.getSystemPrompt(task.depth),
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: this.maxTokens,
            temperature: this.temperature,
        });

        // 统计 token 使用
        this.totalRequests++;
        if (response.usage) {
            this.totalTokens += response.usage.total_tokens || 0;
        }

        const content = response.choices[0]?.message?.content || "";
        return this.parseFinding(question, content);
    }

    /**
     * 构建研究提示词
     */
    private buildResearchPrompt(question: string, task: ResearchTask): string {
        const depthInstructions = {
            overview: "提供高层次的概览，涵盖主要观点和关键信息。",
            detailed: "提供详细的分析，包括具体数据、技术细节和实现方式。",
            comprehensive:
                "提供全面的深度研究，包括历史背景、技术细节、优缺点分析、最佳实践和案例研究。",
        };

        return `
研究主题: ${task.topic}
研究问题: ${question}

研究深度要求: ${depthInstructions[task.depth]}

请提供:
1. 直接回答问题的核心内容
2. 相关的技术细节或数据支持
3. 可能的来源或参考（如果有）
4. 对该答案置信度的自我评估

请以结构化格式回答，便于后续整理。
    `.trim();
    }

    /**
     * 获取系统提示词
     */
    private getSystemPrompt(depth: string): string {
        return `
你是一位专业的技术研究专家，擅长深入分析技术主题并提供准确、客观的研究结果。

你的特点:
- 回答准确、客观，基于事实
- 技术细节丰富，但表达清晰
- 承认不确定性，不编造信息
- 提供有见地的分析和观点

研究深度: ${depth}
    `.trim();
    }

    /**
     * 解析研究发现
     */
    private parseFinding(question: string, content: string): ResearchFinding {
        // 简单的置信度判断
        let confidence: "high" | "medium" | "low" = "medium";
        if (content.includes("确定") || content.includes("明确")) {
            confidence = "high";
        } else if (content.includes("可能") || content.includes("不确定")) {
            confidence = "low";
        }

        // 提取来源（简单的启发式方法）
        const sources: string[] = [];
        const sourceMatches = content.match(/来源[:：]\s*(.+)/g);
        if (sourceMatches) {
            sourceMatches.forEach((match) => {
                const source = match.replace(/来源[:：]\s*/, "").trim();
                if (source) sources.push(source);
            });
        }

        return {
            question,
            answer: content,
            sources,
            confidence,
        };
    }

    /**
     * 生成研究总结
     */
    private async generateSummary(
        task: ResearchTask,
        findings: ResearchFinding[]
    ): Promise<string> {
        const findingsText = findings
            .map((f) => `Q: ${f.question}\nA: ${f.answer.substring(0, 500)}...`)
            .join("\n\n");

        const prompt = `
基于以下研究发现，生成一份简洁的研究总结：

研究主题: ${task.topic}

研究发现:
${findingsText}

请生成:
1. 核心发现（3-5 点）
2. 关键洞察
3. 总体结论
    `.trim();

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1500,
            temperature: 0.3,
        });

        // 统计 token 使用
        this.totalRequests++;
        if (response.usage) {
            this.totalTokens += response.usage.total_tokens || 0;
        }

        return response.choices[0]?.message?.content || "无法生成总结";
    }

    /**
     * 生成建议
     */
    private async generateRecommendations(
        task: ResearchTask,
        findings: ResearchFinding[]
    ): Promise<string[] | undefined> {
        if (task.outputFormat !== "decision-matrix") {
            return undefined;
        }

        const prompt = `
基于以下研究发现，提供 3-5 条具体的行动建议或决策建议：

${findings.map((f) => `- ${f.question}: ${f.answer.substring(0, 300)}`).join("\n")}

建议应该:
- 具体可行
- 基于研究发现
- 考虑实际应用场景
    `.trim();

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.4,
        });

        // 统计 token 使用
        this.totalRequests++;
        if (response.usage) {
            this.totalTokens += response.usage.total_tokens || 0;
        }

        const content = response.choices[0]?.message?.content || "";
        return content
            .split("\n")
            .filter((line: string) => line.trim().match(/^\d+\.|^[-•]/))
            .map((line: string) => line.replace(/^\d+\.\s*|^[-•]\s*/, "").trim());
    }

    /**
     * 格式化报告为 Markdown
     */
    formatAsMarkdown(report: ResearchReport): string {
        const formatConfidence = (c: string) => {
            const icons = { high: "🟢", medium: "🟡", low: "🔴" };
            return `${icons[c as keyof typeof icons]} ${c}`;
        };

        let md = `# 研究报告: ${report.task.topic}\n\n`;
        md += `**生成时间**: ${report.createdAt.toLocaleString()}\n`;
        md += `**研究深度**: ${report.task.depth}\n\n`;

        md += `## 执行摘要\n\n${report.summary}\n\n`;

        md += `## 详细发现\n\n`;
        report.findings.forEach((finding, index) => {
            md += `### ${index + 1}. ${finding.question}\n\n`;
            md += `${finding.answer}\n\n`;
            md += `**置信度**: ${formatConfidence(finding.confidence)}\n`;
            if (finding.sources.length > 0) {
                md += `**参考来源**: ${finding.sources.join(", ")}\n`;
            }
            md += `\n---\n\n`;
        });

        if (report.recommendations && report.recommendations.length > 0) {
            md += `## 建议\n\n`;
            report.recommendations.forEach((rec, index) => {
                md += `${index + 1}. ${rec}\n`;
            });
            md += `\n`;
        }

        // 添加执行统计
        if (report.executionStats) {
            md += this.formatExecutionStats(report.executionStats);
        }

        return md;
    }

    /**
     * 格式化执行统计信息
     */
    private formatExecutionStats(stats: ExecutionStats): string {
        const avgQuestionTime = stats.questionTimesMs.length > 0
            ? stats.questionTimesMs.reduce((a, b) => a + b, 0) / stats.questionTimesMs.length
            : 0;

        let md = `## 执行总结\n\n`;
        md += `| 指标 | 数值 |\n`;
        md += `|------|------|\n`;
        md += `| **总执行时间** | ${this.formatDuration(stats.totalTimeMs)} |\n`;
        md += `| **开始时间** | ${stats.startedAt.toLocaleString()} |\n`;
        md += `| **完成时间** | ${stats.completedAt.toLocaleString()} |\n`;
        md += `| **总请求次数** | ${stats.totalRequests} 次 |\n`;
        md += `| **总 Token 消耗** | ${stats.totalTokens.toLocaleString()} |\n`;
        md += `| **平均问题处理时间** | ${this.formatDuration(avgQuestionTime)} |\n`;
        md += `| **总结生成时间** | ${this.formatDuration(stats.summaryTimeMs)} |\n`;

        // 各问题详细时间
        md += `\n### 各问题执行时间\n\n`;
        md += `| 序号 | 耗时 |\n`;
        md += `|------|------|\n`;
        stats.questionTimesMs.forEach((time, index) => {
            md += `| 问题 ${index + 1} | ${this.formatDuration(time)} |\n`;
        });

        md += `\n`;
        return md;
    }

    /**
     * 保存报告到文件
     */
    async saveReport(report: ResearchReport): Promise<string> {
        const outputDir = configManager.getConfig().settings.outputDir;
        await fs.mkdir(outputDir, { recursive: true });

        const filename = `${report.task.id}_${new Date()
            .toISOString()
            .slice(0, 10)}.md`;
        const filepath = path.join(outputDir, filename);

        const markdown = this.formatAsMarkdown(report);
        await fs.writeFile(filepath, markdown, "utf-8");

        return filepath;
    }
}

// ============================================================================
// CLI 接口
// ============================================================================

async function main() {
    const args = process.argv.slice(2);

    // 解析参数
    const getArg = (flag: string): string | undefined => {
        const index = args.indexOf(flag);
        return index !== -1 ? args[index + 1] : undefined;
    };

    // 加载配置文件
    const configPath = getArg("--config");
    const cm = configPath ? new ConfigManager(configPath) : configManager;

    try {
        await cm.load();
    } catch (error) {
        console.error("❌ 加载配置文件失败:", error);
        process.exit(1);
    }

    // 显示配置
    if (args.includes("--show-config")) {
        cm.displayConfig();
        process.exit(0);
    }

    if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
        console.log(`
🔍 Research Assistant Agent
智能研究助手 - 协助进行技术调研和信息收集

使用方法:
  npx tsx agents/research-assistant.ts [选项]

选项:
  --topic <主题>          研究主题（必需）
  --questions <问题文件>   包含研究问题的 JSON 文件路径
  --depth <深度>          研究深度: overview | detailed | comprehensive (默认: detailed)
  --format <格式>         输出格式: summary | report | comparison | decision-matrix (默认: report)
  --provider <提供商>     LLM 提供商 (覆盖配置文件)
  --model <模型>          模型名称 (覆盖配置文件)
  --config <文件>         配置文件路径 (默认: agents/config/llm-config.json)
  --show-config           显示当前配置
  --save                  保存报告到文件
  --help, -h              显示帮助信息

配置文件:
  配置文件路径: agents/config/llm-config.json

  配置示例:
  {
    "activeProvider": "glm",
    "providers": {
      "glm": {
        "name": "智谱 GLM",
        "baseURL": "https://open.bigmodel.cn/api/paas/v4",
        "model": "glm-4",
        "apiKey": "\${GLM_API_KEY}"
      }
    },
    "settings": {
      "maxTokens": 4000,
      "temperature": 0.3,
      "outputDir": "./research-output"
    }
  }

  支持的环境变量引用: \${ENV_VAR_NAME}

示例:
  # 使用配置文件中的默认提供商
  npx tsx agents/research-assistant.ts --topic "React 18 新特性"

  # 临时切换到其他提供商
  npx tsx agents/research-assistant.ts --topic "微前端架构" --provider claude

  # 使用特定模型
  npx tsx agents/research-assistant.ts --topic "AI 发展趋势" --provider glm --model glm-4-plus

  # 显示当前配置
  npx tsx agents/research-assistant.ts --show-config

  # 详细研究并保存
  npx tsx agents/research-assistant.ts --topic "Serverless 架构" --depth comprehensive --save

问题文件格式 (questions.json):
  [
    "GraphQL 的核心优势是什么？",
    "与 REST 相比有哪些性能差异？",
    "在什么场景下应该选择 GraphQL？"
  ]
    `);
        process.exit(0);
    }

    const topic = getArg("--topic");
    if (!topic) {
        console.error("❌ 错误: 请指定研究主题 (--topic)");
        process.exit(1);
    }

    const questionsFile = getArg("--questions");
    let questions: string[] = [];

    if (questionsFile) {
        try {
            const content = await fs.readFile(questionsFile, "utf-8");
            questions = JSON.parse(content);
        } catch (error) {
            console.error(`❌ 无法读取问题文件: ${questionsFile}`);
            process.exit(1);
        }
    } else {
        // 默认问题
        questions = [
            `${topic} 是什么？`,
            `${topic} 的核心概念和原理是什么？`,
            `${topic} 的主要使用场景有哪些？`,
            `使用 ${topic} 的最佳实践是什么？`,
            `${topic} 有哪些优缺点？`,
        ];
    }

    const depth = (getArg("--depth") || "detailed") as ResearchTask["depth"];
    const format = (getArg("--format") || "report") as ResearchTask["outputFormat"];
    const shouldSave = args.includes("--save");

    // 获取 LLM 配置
    const provider = getArg("--provider");
    const model = getArg("--model");

    // 创建任务
    const task: ResearchTask = {
        id: topic.toLowerCase().replace(/\s+/g, "-"),
        topic,
        questions,
        depth,
        outputFormat: format,
    };

    // 执行研究
    const assistant = new ResearchAssistant(undefined, provider, model);

    try {
        const report = await assistant.conductResearch(task);

        // 输出报告
        console.log("\n" + "=".repeat(60));
        console.log(assistant.formatAsMarkdown(report));

        // 输出执行总结到控制台
        if (report.executionStats) {
            const formatDuration = (ms: number): string => {
                if (ms < 1000) {
                    return `${ms}ms`;
                }
                return `${(ms / 1000).toFixed(2)}s`;
            };

            console.log("\n" + "=".repeat(60));
            console.log("📊 执行总结");
            console.log("=".repeat(60));
            console.log(`⏱️  总执行时间: ${formatDuration(report.executionStats.totalTimeMs)}`);
            console.log(`📝 总请求次数: ${report.executionStats.totalRequests} 次`);
            console.log(`🔤 总 Token 消耗: ${report.executionStats.totalTokens.toLocaleString()}`);
            console.log(`📅 开始时间: ${report.executionStats.startedAt.toLocaleString()}`);
            console.log(`✅ 完成时间: ${report.executionStats.completedAt.toLocaleString()}`);
            console.log("=".repeat(60));
        }

        // 保存报告
        if (shouldSave) {
            const filepath = await assistant.saveReport(report);
            console.log(`\n💾 报告已保存: ${filepath}`);
        }
    } catch (error) {
        console.error("❌ 研究过程中出现错误:", error);
        process.exit(1);
    }
}

// 如果直接运行此文件（ES Module 兼容写法）
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
    main();
}

// 导出供其他模块使用
export {
    ConfigManager, LLMConfig, ProviderConfig, ResearchFinding,
    ResearchReport, ResearchTask, configManager
};
