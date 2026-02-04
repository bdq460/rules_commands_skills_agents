/**
 * Logger - 统一日志工具
 *
 * 提供统一的日志接口，支持多种日志级别和格式化输出。
 * 同时支持写入日志文件和发送到远程日志服务。
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface LoggerConfig {
  level: LogLevel;
  format: 'json' | 'text';
  console: boolean;
  file?: boolean;
  filePath?: string;
  remote?: boolean;
  remoteUrl?: string;
}

export class Logger {
  private context: string;
  private config: LoggerConfig;

  private fileReady: Promise<void> = Promise.resolve();

  constructor(context: string, config?: Partial<LoggerConfig>) {
    this.context = context;
    this.config = {
      level: LogLevel.INFO,
      format: 'text',
      console: true,
      file: false,
      remote: false,
      ...config
    };

    // 确保日志目录存在
    if (this.config.file && this.config.filePath) {
      this.fileReady = this.ensureLogFileExists();
    }
  }

  /**
   * 输出DEBUG级别日志
   */
  debug(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.log(LogLevel.DEBUG, message, metadata);
    }
  }

  /**
   * 输出INFO级别日志
   */
  info(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.log(LogLevel.INFO, message, metadata);
    }
  }

  /**
   * 输出WARN级别日志
   */
  warn(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.log(LogLevel.WARN, message, metadata);
    }
  }

  /**
   * 输出ERROR级别日志
   */
  error(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.log(LogLevel.ERROR, message, metadata);
    }
  }

  /**
   * 记录skill开始执行
   */
  skillStart(skillName: string, metadata?: Record<string, any>): void {
    this.info(`Skill execution started: ${skillName}`, {
      skillName,
      action: 'start',
      ...metadata
    });
  }

  /**
   * 记录skill执行完成
   */
  skillComplete(skillName: string, duration: number, metadata?: Record<string, any>): void {
    this.info(`Skill execution completed: ${skillName}`, {
      skillName,
      action: 'complete',
      duration,
      ...metadata
    });
  }

  /**
   * 记录skill执行失败
   */
  skillError(skillName: string, error: Error, metadata?: Record<string, any>): void {
    this.error(`Skill execution failed: ${skillName}`, {
      skillName,
      action: 'error',
      error: error.message,
      stack: error.stack,
      ...metadata
    });
  }

  /**
   * 记录阶段开始
   */
  stageStart(stageName: string, metadata?: Record<string, any>): void {
    this.info(`Stage started: ${stageName}`, {
      stageName,
      action: 'stage_start',
      ...metadata
    });
  }

  /**
   * 记录阶段完成
   */
  stageComplete(stageName: string, duration: number, metadata?: Record<string, any>): void {
    this.info(`Stage completed: ${stageName}`, {
      stageName,
      action: 'stage_complete',
      duration,
      ...metadata
    });
  }

  /**
   * 判断是否应该记录该级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.config.level);
  }

  /**
   * 执行日志记录
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      context: this.context,
      message,
      metadata
    };

    // 控制台输出
    if (this.config.console) {
      this.logToConsole(entry);
    }

    // 文件输出
    if (this.config.file) {
      this.logToFile(entry);
    }

    // 远程日志
    if (this.config.remote) {
      this.logToRemote(entry);
    }
  }

  /**
   * 输出到控制台
   */
  private logToConsole(entry: LogEntry): void {
    const formatted = this.formatEntry(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }
  }

  /**
   * 输出到文件
   */
  private async logToFile(entry: LogEntry): Promise<void> {
    if (!this.config.filePath) return;

    // 确保文件目录已创建
    await this.fileReady;

    try {
      const fs = await import('fs/promises');
      const formatted = this.formatEntry(entry) + '\n';
      await fs.appendFile(this.config.filePath, formatted);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * 发送到远程日志服务
   */
  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.remoteUrl) return;

    try {
      // Node.js 18+ has built-in fetch
      if (typeof fetch !== 'undefined') {
        await fetch(this.config.remoteUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(entry)
        });
      } else {
        // Fallback for older Node.js versions
        console.warn('Remote logging requires Node.js 18+ or node-fetch package');
      }
    } catch (error) {
      console.error('Failed to send log to remote service:', error);
    }
  }

  /**
   * 格式化日志条目
   */
  private formatEntry(entry: LogEntry): string {
    if (this.config.format === 'json') {
      return JSON.stringify(entry);
    }

    // 文本格式
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.padEnd(5);
    const context = entry.context.padEnd(20);
    const message = entry.message;

    let formatted = `[${timestamp}] [${level}] [${context}] ${message}`;

    // 添加metadata
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      const metadataStr = JSON.stringify(entry.metadata);
      formatted += ` | ${metadataStr}`;
    }

    return formatted;
  }

  /**
   * 确保日志文件存在
   */
  private async ensureLogFileExists(): Promise<void> {
    if (!this.config.filePath) return;

    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      const dir = path.dirname(this.config.filePath);
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error('Failed to create log file:', error);
    }
  }

  /**
   * 创建子logger
   */
  child(childContext: string): Logger {
    const fullContext = `${this.context}/${childContext}`;
    return new Logger(fullContext, this.config);
  }

  /**
   * 更新日志配置
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * 默认logger实例
 */
export const logger = new Logger('codebuddy', {
  level: LogLevel.INFO,
  format: 'text',
  console: true
});

/**
 * 创建logger工厂函数
 */
export function createLogger(context: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger(context, config);
}
