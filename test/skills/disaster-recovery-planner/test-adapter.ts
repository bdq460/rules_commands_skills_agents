/**
 * Disaster Recovery Planner 测试适配器
 *
 * 将灾备规划师技能的函数包装为测试期望的接口
 */

// ============================================================================
// 类型定义 (测试期望的接口)
// ============================================================================

export interface BackupStrategyOptions {
    system?: string;
    dataSize?: string;
    rto?: string;
    rpo?: string;
}

export interface BackupStrategyResult {
    strategy: string;
    frequency: string;
    retention: {
        daily?: number;
        weekly?: number;
        monthly?: number;
    };
    storage: {
        type: string;
        location: string;
        encryption: boolean;
    };
}

export interface RestoreProcedureInput {
    type: string;
    location: string;
    timestamp: string;
    size: string;
}

export interface RestoreProcedureResult {
    steps: string[];
    verification: string[];
    rollback: {
        steps: string[];
    };
    estimatedTime: string;
}

export interface BackupScheduleConfig {
    fullBackup?: string;
    incrementalBackup?: string;
    retentionDays?: number;
    retentionWeeks?: number;
    retentionMonths?: number;
    dataSize?: string;
}

export interface BackupScheduleResult {
    schedule: {
        full?: string;
        incremental?: string;
    };
    calendar: string[];
    estimates: {
        storage?: string;
        time?: string;
    };
}

export interface BackupConfiguration {
    backupLocation?: string;
    schedule?: {
        full?: string;
        incremental?: string;
    };
    retention?: {
        daily?: number;
        weekly?: number;
        monthly?: number;
    };
    storage?: {
        type?: string;
        encryption?: boolean;
    };
    rto?: string;
    rpo?: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

// ============================================================================
// 适配器函数
// ============================================================================

/**
 * 生成备份策略
 * 适配器：根据系统需求生成备份策略
 */
export function generateBackupStrategy(options: BackupStrategyOptions = {}): BackupStrategyResult {
    const system = options.system || 'Database';
    const dataSize = options.dataSize || '100GB';
    const rto = options.rto || '1 hour';
    const rpo = options.rpo || '15 minutes';

    let strategy: string;
    let frequency: string;
    let retention: { daily?: number; weekly?: number; monthly?: number };
    let storage: { type: string; location: string; encryption: boolean };

    // 根据数据大小和RTO/RPO确定策略
    const dataSizeNum = parseInt(dataSize) || 100;
    const rtoMinutes = parseInt(rto) || 60;
    const rpoMinutes = parseInt(rpo) || 15;

    if (rtoMinutes <= 30 && rpoMinutes <= 10) {
        // 高频备份策略
        strategy = '高频备份策略';
        frequency = 'hourly';
        retention = { daily: 7, weekly: 4, monthly: 12 };
        storage = { type: 'cloud', location: 'S3 + 本地存储', encryption: true };
    } else if (rtoMinutes <= 120 && rpoMinutes <= 60) {
        // 每日备份策略
        strategy = '每日备份策略';
        frequency = 'daily';
        retention = { daily: 30, weekly: 12, monthly: 12 };
        storage = { type: 'hybrid', location: '本地 + 云存储', encryption: true };
    } else {
        // 标准备份策略
        strategy = '标准备份策略';
        if (dataSizeNum < 20) {
            frequency = 'daily';
        } else {
            frequency = 'weekly';
        }
        retention = { daily: 30, weekly: 8, monthly: 6 };
        storage = { type: 'local', location: '本地存储', encryption: false };
    }

    return { strategy, frequency, retention, storage };
}

/**
 * 生成恢复流程
 * 适配器：根据备份信息生成恢复流程
 */
export function generateRestoreProcedure(backupInfo: RestoreProcedureInput): RestoreProcedureResult {
    const steps: string[] = [];
    const verification: string[] = [];

    steps.push(`1. 确认备份文件：${backupInfo.location}`);
    steps.push('2. 停止相关服务');
    steps.push(`3. 下载备份文件 (${backupInfo.size})`);
    steps.push('4. 解压备份文件');
    steps.push('5. 恢复数据到目标位置');
    steps.push('6. 启动相关服务');

    verification.push('1. 检查服务状态是否正常');
    verification.push('2. 验证数据完整性');
    verification.push('3. 测试关键功能是否可用');
    verification.push('4. 检查日志是否正常');

    const rollback: { steps: string[] } = {
        steps: [
            '1. 停止服务',
            '2. 恢复到恢复前的状态',
            '3. 记录失败原因',
            '4. 联系技术支持',
        ],
    };

    // 估算恢复时间（基于数据大小）
    const sizeNum = parseInt(backupInfo.size) || 100;
    const estimatedMinutes = Math.ceil(sizeNum / 10) + 10;
    const estimatedTime = `${estimatedMinutes} 分钟`;

    return { steps, verification, rollback, estimatedTime };
}

/**
 * 生成备份计划
 * 适配器：生成备份时间表和估算
 */
export function generateBackupSchedule(config: BackupScheduleConfig = {}): BackupScheduleResult {
    const fullBackup = config.fullBackup || 'daily';
    const incrementalBackup = config.incrementalBackup || 'hourly';
    const dataSize = config.dataSize || '100GB';
    const retentionDays = config.retentionDays || 30;
    const retentionWeeks = config.retentionWeeks || 12;
    const retentionMonths = config.retentionMonths || 12;

    const schedule = {
        full: fullBackup,
        incremental: incrementalBackup,
    };

    // 生成日历视图
    const calendar: string[] = [];
    calendar.push('周一: 全量备份 + 每小时增量');
    calendar.push('周二: 全量备份 + 每小时增量');
    calendar.push('周三: 全量备份 + 每小时增量');
    calendar.push('周四: 全量备份 + 每小时增量');
    calendar.push('周五: 全量备份 + 每小时增量');
    calendar.push('周六: 全量备份 + 每小时增量');
    calendar.push('周日: 全量备份 + 每小时增量');

    // 估算存储需求
    const sizeNum = parseInt(dataSize) || 100;
    const dailyStorage = sizeNum * 1.5; // 考虑增量备份
    const estimatedStorage = `${Math.ceil(dailyStorage * retentionDays + dailyStorage * 7 * retentionWeeks)}GB`;

    // 估算备份时间
    const backupTime = `${Math.ceil(sizeNum / 10)} 分钟/次`;

    const estimates = {
        storage: estimatedStorage,
        time: backupTime,
    };

    return { schedule, calendar, estimates };
}

/**
 * 验证备份配置
 * 适配器：验证备份配置的有效性
 */
export function validateBackupConfiguration(config: BackupConfiguration = {}): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let valid = true;

    // 检查备份位置
    if (!config.backupLocation || config.backupLocation.trim() === '') {
        errors.push('缺少备份位置');
        valid = false;
    }

    // 检查备份计划
    if (!config.schedule || (!config.schedule.full && !config.schedule.incremental)) {
        errors.push('缺少备份计划');
        valid = false;
    }

    // 检查保留策略
    if (!config.retention || (config.retention.daily === 0 && config.retention.weekly === 0 && config.retention.monthly === 0)) {
        errors.push('保留策略无效');
        valid = false;
    } else if (config.retention) {
        // 检查保留策略是否过短
        if (config.retention.daily === 0) {
            errors.push('保留策略过短（daily保留天数不能为0）');
            valid = false;
        }
    }

    // 检查存储配置
    if (!config.storage || !config.storage.type) {
        warnings.push('缺少存储类型配置');
    }

    // 检查加密设置
    if (config.storage && !config.storage.encryption) {
        warnings.push('建议启用数据加密');
    }

    // 检查 RTO 和 RPO
    if (!config.rto || !config.rpo) {
        warnings.push('缺少 RTO/RPO 配置');
    } else if (config.rto && config.rpo) {
        // 检查 RTO 是否大于 RPO（RTO >= RPO 才合理）
        const rtoValue = parseInt(config.rto) || 0;
        const rpoValue = parseInt(config.rpo) || 0;
        if (rtoValue < rpoValue) {
            errors.push('RTO 不能小于 RPO');
            valid = false;
        }
    }

    return { valid, errors, warnings };
}
