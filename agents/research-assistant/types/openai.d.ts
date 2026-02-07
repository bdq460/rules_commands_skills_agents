/**
 * OpenAI 类型声明文件
 * 用于在没有安装 openai 包时提供类型支持
 */

declare module "openai" {
  export interface ChatCompletionMessageParam {
    role: "system" | "user" | "assistant";
    content: string;
  }

  export interface ChatCompletionCreateParams {
    model: string;
    messages: ChatCompletionMessageParam[];
    max_tokens?: number;
    temperature?: number;
  }

  export interface ChatCompletion {
    choices: Array<{
      message?: {
        content?: string;
      };
    }>;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  }

  export class OpenAI {
    constructor(config: {
      apiKey: string;
      baseURL?: string;
    });

    chat: {
      completions: {
        create(params: ChatCompletionCreateParams): Promise<ChatCompletion>;
      };
    };
  }
}
