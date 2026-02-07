/**
 * LLM 配置管理模块
 * 支持从 JSON 配置文件加载和管理 LLM 提供商配置
 */

import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

// 获取当前文件的目录路径（ES Module 兼容）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 单个 LLM 提供商配置
 */
export interface ProviderConfig {
    /** 显示名称 */
    name: string;
    /** API Base URL */
    baseURL: string;
    /** 模型名称 */
    model: string;
    /** API Key（支持 ${ENV_VAR} 格式引用环境变量） */
    apiKey: string;
}

/**
 * LLM 全局设置
 */
export interface LLMSettings {
    /** 最大 Token 数 */
    maxTokens: number;
    /** 温度参数 */
    temperature: number;
    /** 输出目录 */
    outputDir: string;
}

/**
 * 完整配置结构
 */
export interface LLMConfig {
    /** 当前激活的提供商 */
    activeProvider: string;
    /** 所有提供商配置 */
    providers: Record<string, ProviderConfig>;
    /** 全局设置 */
    settings: LLMSettings;
}

/**
 * 配置管理器类
 */
export class ConfigManager {
    private config: LLMConfig | null = null;
    private configPath: string;

    constructor(configPath?: string) {
        // 默认配置文件路径
        this.configPath =
            configPath ||
            path.join(__dirname, "llm-config.json");
    }

    /**
     * 加载配置文件
     */
    async load(): Promise<LLMConfig> {
        try {
            const content = await fs.readFile(this.configPath, "utf-8");
            const rawConfig = JSON.parse(content);

            // 解析环境变量引用
            this.config = this.resolveEnvVariables(rawConfig);

            // 验证配置
            this.validateConfig();

            return this.config;
        } catch (error) {
            if ((error as { code?: string }).code === "ENOENT") {
                // 配置文件不存在，创建默认配置
                console.log(`⚠️ 配置文件不存在，创建默认配置: ${this.configPath}`);
                this.config = this.getDefaultConfig();
                await this.save();
                return this.config;
            }
            throw new Error(`加载配置文件失败: ${error}`);
        }
    }

    /**
     * 解析环境变量引用
     * 支持 ${ENV_VAR} 格式
     */
    private resolveEnvVariables(obj: unknown): LLMConfig {
        const resolveString = (str: string): string => {
            return str.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
                const value = process.env[envVar];
                if (!value) {
                    console.warn(`⚠️ 环境变量未设置: ${envVar}`);
                    return match;
                }
                return value;
            });
        };

        const resolve = (item: unknown): unknown => {
            if (typeof item === "string") {
                return resolveString(item);
            }
            if (Array.isArray(item)) {
                return item.map(resolve);
            }
            if (typeof item === "object" && item !== null) {
                const result: Record<string, unknown> = {};
                for (const [key, value] of Object.entries(item)) {
                    result[key] = resolve(value);
                }
                return result;
            }
            return item;
        };

        return resolve(obj) as LLMConfig;
    }

    /**
     * 验证配置有效性
     */
    private validateConfig(): void {
        if (!this.config) {
            throw new Error("配置未加载");
        }

        // 验证 activeProvider
        if (!this.config.providers[this.config.activeProvider]) {
            throw new Error(
                `激活的提供商 "${this.config.activeProvider}" 未在配置中定义`
            );
        }

        // 验证每个提供商配置
        for (const [key, provider] of Object.entries(this.config.providers)) {
            if (!provider.baseURL) {
                throw new Error(`提供商 "${key}" 缺少 baseURL`);
            }
            if (!provider.model) {
                throw new Error(`提供商 "${key}" 缺少 model`);
            }
        }
    }

    /**
     * 保存配置到文件
     */
    async save(): Promise<void> {
        if (!this.config) {
            throw new Error("没有可保存的配置");
        }

        // 确保目录存在
        const dir = path.dirname(this.configPath);
        await fs.mkdir(dir, { recursive: true });

        // 保存时隐藏实际的 API Key（还原为环境变量引用）
        const configToSave = this.maskApiKeys(this.config);

        await fs.writeFile(
            this.configPath,
            JSON.stringify(configToSave, null, 2),
            "utf-8"
        );
    }

    /**
     * 隐藏 API Key，还原为环境变量引用
     */
    private maskApiKeys(config: LLMConfig): LLMConfig {
        const masked: LLMConfig = JSON.parse(JSON.stringify(config));

        const envVarMap: Record<string, string> = {
            openai: "${OPENAI_API_KEY}",
            glm: "${GLM_API_KEY}",
            claude: "${ANTHROPIC_API_KEY}",
            qwen: "${DASHSCOPE_API_KEY}",
            deepseek: "${DEEPSEEK_API_KEY}",
            moonshot: "${MOONSHOT_API_KEY}",
        };

        for (const [key, provider] of Object.entries(masked.providers)) {
            if (envVarMap[key]) {
                provider.apiKey = envVarMap[key];
            }
        }

        return masked;
    }

    /**
     * 获取当前配置
     */
    getConfig(): LLMConfig {
        if (!this.config) {
            throw new Error("配置未加载，请先调用 load()");
        }
        return this.config;
    }

    /**
     * 获取当前激活的提供商配置
     */
    getActiveProvider(): ProviderConfig {
        const config = this.getConfig();
        return config.providers[config.activeProvider];
    }

    /**
     * 切换提供商
     */
    async switchProvider(providerName: string): Promise<void> {
        const config = this.getConfig();

        if (!config.providers[providerName]) {
            throw new Error(`未知的提供商: ${providerName}`);
        }

        config.activeProvider = providerName;
        await this.save();

        console.log(`✅ 已切换到提供商: ${providerName}`);
    }

    /**
     * 添加自定义提供商
     */
    async addProvider(
        name: string,
        providerConfig: ProviderConfig
    ): Promise<void> {
        const config = this.getConfig();
        config.providers[name] = providerConfig;
        await this.save();
        console.log(`✅ 已添加提供商: ${name}`);
    }

    /**
     * 更新设置
     */
    async updateSettings(settings: Partial<LLMSettings>): Promise<void> {
        const config = this.getConfig();
        config.settings = { ...config.settings, ...settings };
        await this.save();
        console.log(`✅ 设置已更新`);
    }

    /**
     * 获取默认配置
     */
    private getDefaultConfig(): LLMConfig {
        return {
            activeProvider: "glm",
            providers: {
                openai: {
                    name: "OpenAI",
                    baseURL: "https://api.openai.com/v1",
                    model: "gpt-4",
                    apiKey: "${OPENAI_API_KEY}",
                },
                glm: {
                    name: "智谱 GLM",
                    baseURL: "https://open.bigmodel.cn/api/paas/v4",
                    model: "glm-4",
                    apiKey: "${GLM_API_KEY}",
                },
                claude: {
                    name: "Anthropic Claude",
                    baseURL: "https://api.anthropic.com/v1",
                    model: "claude-3-opus-20240229",
                    apiKey: "${ANTHROPIC_API_KEY}",
                },
                qwen: {
                    name: "通义千问",
                    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
                    model: "qwen-max",
                    apiKey: "${DASHSCOPE_API_KEY}",
                },
                deepseek: {
                    name: "DeepSeek",
                    baseURL: "https://api.deepseek.com/v1",
                    model: "deepseek-chat",
                    apiKey: "${DEEPSEEK_API_KEY}",
                },
                moonshot: {
                    name: "Moonshot",
                    baseURL: "https://api.moonshot.cn/v1",
                    model: "moonshot-v1-8k",
                    apiKey: "${MOONSHOT_API_KEY}",
                },
            },
            settings: {
                maxTokens: 4000,
                temperature: 0.3,
                outputDir: "./research-output",
            },
        };
    }

    /**
     * 列出所有可用的提供商
     */
    listProviders(): string[] {
        const config = this.getConfig();
        return Object.keys(config.providers);
    }

    /**
     * 显示当前配置信息
     */
    displayConfig(): void {
        const config = this.getConfig();
        const active = this.getActiveProvider();

        console.log("\n📋 当前 LLM 配置");
        console.log("=".repeat(50));
        console.log(`激活提供商: ${config.activeProvider}`);
        console.log(`模型: ${active.model}`);
        console.log(`Base URL: ${active.baseURL}`);
        console.log(`API Key: ${active.apiKey ? "已设置" : "未设置"}`);
        console.log("\n设置:");
        console.log(`  Max Tokens: ${config.settings.maxTokens}`);
        console.log(`  Temperature: ${config.settings.temperature}`);
        console.log(`  Output Dir: ${config.settings.outputDir}`);
        console.log("\n可用提供商:");
        this.listProviders().forEach((name) => {
            const marker = name === config.activeProvider ? "👉" : "  ";
            console.log(`${marker} ${name}: ${config.providers[name].model}`);
        });
        console.log("=".repeat(50));
    }
}

// 导出单例实例
export const configManager = new ConfigManager();
