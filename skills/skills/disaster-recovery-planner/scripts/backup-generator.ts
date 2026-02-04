#!/usr/bin/env node

/**
 * Disaster Recovery Planner - 备份计划生成脚本
 *
 * 用途：生成数据库备份计划、容灾策略、备份恢复脚本
 * 使用场景：项目启动时、数据变更时、定期审查备份策略
 */

interface BackupSchedule {
  type: 'daily' | 'weekly' | 'monthly';
  time: string;
  retentionDays: number;
  backupType: 'full' | 'incremental' | 'differential';
}

interface BackupPlan {
  database: {
    type: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
    name: string;
    schedules: BackupSchedule[];
  };
  storage: {
    type: 'local' | 's3' | 'gcs' | 'azure';
    location: string;
    encryption: boolean;
    compression: boolean;
  };
  monitoring: {
    enabled: boolean;
    alertThreshold: number;
    notificationMethods: string[];
  };
  testing: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recoveryTimeObjective: string;
    recoveryPointObjective: string;
  };
}

interface DisasterRecoveryStrategy {
  rto: number;
  rpo: number;
  failoverPlan: string[];
  rollbackPlan: string[];
}

export class BackupGenerator {
  /**
   * 生成完整的备份计划
   */
  generateBackupPlan(config: BackupPlan): string {
    let plan = `# 数据库备份计划
# 生成时间: ${new Date().toISOString()}

## 数据库配置
- 类型: ${config.database.type}
- 名称: ${config.database.name}

## 备份调度
`;

    for (const schedule of config.database.schedules) {
      plan += `- ${schedule.type}备份: ${schedule.time}\n`;
      plan += `  - 类型: ${schedule.backupType}\n`;
      plan += `  - 保留期: ${schedule.retentionDays}天\n\n`;
    }

    plan += `## 存储配置
- 类型: ${config.storage.type}
- 位置: ${config.storage.location}
- 加密: ${config.storage.encryption ? '是' : '否'}
- 压缩: ${config.storage.compression ? '是' : '否'}
`;

    if (config.monitoring.enabled) {
      plan += `
## 监控配置
- 告警阈值: ${config.monitoring.alertThreshold}小时未成功备份
- 通知方式: ${config.monitoring.notificationMethods.join(', ')}
`;
    }

    plan += `
## 测试配置
- 测试频率: ${config.testing.frequency}
- RTO (恢复时间目标): ${config.testing.recoveryTimeObjective}
- RPO (恢复点目标): ${config.testing.recoveryPointObjective}
`;

    return plan;
  }

  /**
   * 生成PostgreSQL备份脚本
   */
  generatePostgreSQLBackupScript(plan: BackupPlan): string {
    return `#!/bin/bash

# PostgreSQL Backup Script
# 自动生成的备份脚本

# 配置
DB_HOST="\${DB_HOST:-localhost}"
DB_PORT="\${DB_PORT:-5432}"
DB_NAME="${plan.database.name}"
DB_USER="\${DB_USER:-postgres}"
BACKUP_DIR="${plan.storage.location}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\${BACKUP_DIR}/\${DB_NAME}_\${TIMESTAMP}.sql"

# 创建备份目录
mkdir -p \${BACKUP_DIR}

# 执行备份
echo "开始备份数据库: \${DB_NAME}"
pg_dump -h \${DB_HOST} -p \${DB_PORT} -U \${DB_USER} -d \${DB_NAME} > \${BACKUP_FILE}

# 检查备份是否成功
if [ $? -eq 0 ]; then
  echo "备份成功: \${BACKUP_FILE}"
  
  # 压缩备份文件
  if [ "${plan.storage.compression}" = "true" ]; then
    gzip \${BACKUP_FILE}
    BACKUP_FILE="\${BACKUP_FILE}.gz"
    echo "备份文件已压缩"
  fi
  
  # 清理过期备份
  find \${BACKUP_DIR} -name "\${DB_NAME}_*.sql*" -mtime +30 -delete
  echo "已清理30天前的备份"
  
  exit 0
else
  echo "备份失败"
  # 发送告警通知
  echo "数据库备份失败: \${DB_NAME}" | mail -s "Backup Failed" admin@example.com
  exit 1
fi
`;
  }

  /**
   * 生成MySQL备份脚本
   */
  generateMySQLBackupScript(plan: BackupPlan): string {
    return `#!/bin/bash

# MySQL Backup Script
# 自动生成的备份脚本

# 配置
DB_HOST="\${DB_HOST:-localhost}"
DB_PORT="\${DB_PORT:-3306}"
DB_NAME="${plan.database.name}"
DB_USER="\${DB_USER:-root}"
BACKUP_DIR="${plan.storage.location}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\${BACKUP_DIR}/\${DB_NAME}_\${TIMESTAMP}.sql"

# 创建备份目录
mkdir -p \${BACKUP_DIR}

# 执行备份
echo "开始备份数据库: \${DB_NAME}"
mysqldump -h \${DB_HOST} -P \${DB_PORT} -u \${DB_USER} -p\${DB_PASSWORD} \${DB_NAME} > \${BACKUP_FILE}

# 检查备份是否成功
if [ $? -eq 0 ]; then
  echo "备份成功: \${BACKUP_FILE}"
  
  # 压缩备份文件
  if [ "${plan.storage.compression}" = "true" ]; then
    gzip \${BACKUP_FILE}
    BACKUP_FILE="\${BACKUP_FILE}.gz"
    echo "备份文件已压缩"
  fi
  
  # 清理过期备份
  find \${BACKUP_DIR} -name "\${DB_NAME}_*.sql*" -mtime +30 -delete
  echo "已清理30天前的备份"
  
  exit 0
else
  echo "备份失败"
  # 发送告警通知
  echo "数据库备份失败: \${DB_NAME}" | mail -s "Backup Failed" admin@example.com
  exit 1
fi
`;
  }

  /**
   * 生成MongoDB备份脚本
   */
  generateMongoDBBackupScript(plan: BackupPlan): string {
    return `#!/bin/bash

# MongoDB Backup Script
# 自动生成的备份脚本

# 配置
DB_HOST="\${DB_HOST:-localhost}"
DB_PORT="\${DB_PORT:-27017}"
DB_NAME="${plan.database.name}"
BACKUP_DIR="${plan.storage.location}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\${BACKUP_DIR}/\${DB_NAME}_\${TIMESTAMP}"

# 创建备份目录
mkdir -p \${BACKUP_DIR}

# 执行备份
echo "开始备份数据库: \${DB_NAME}"
mongodump --host \${DB_HOST} --port \${DB_PORT} --db \${DB_NAME} --out \${BACKUP_FILE}

# 检查备份是否成功
if [ $? -eq 0 ]; then
  echo "备份成功: \${BACKUP_FILE}"
  
  # 压缩备份文件
  if [ "${plan.storage.compression}" = "true" ]; then
    tar -czf \${BACKUP_FILE}.tar.gz \${BACKUP_FILE}
    rm -rf \${BACKUP_FILE}
    BACKUP_FILE="\${BACKUP_FILE}.tar.gz"
    echo "备份文件已压缩"
  fi
  
  # 清理过期备份
  find \${BACKUP_DIR} -name "\${DB_NAME}_*.tar.gz" -mtime +30 -delete
  echo "已清理30天前的备份"
  
  exit 0
else
  echo "备份失败"
  # 发送告警通知
  echo "数据库备份失败: \${DB_NAME}" | mail -s "Backup Failed" admin@example.com
  exit 1
fi
`;
  }

  /**
   * 生成Redis备份脚本
   */
  generateRedisBackupScript(plan: BackupPlan): string {
    return `#!/bin/bash

# Redis Backup Script
# 自动生成的备份脚本

# 配置
REDIS_HOST="\${REDIS_HOST:-localhost}"
REDIS_PORT="\${REDIS_PORT:-6379}"
BACKUP_DIR="${plan.storage.location}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\${BACKUP_DIR}/redis_\${TIMESTAMP}.rdb"

# 创建备份目录
mkdir -p \${BACKUP_DIR}

# 执行备份
echo "开始备份Redis数据"

# 触发BGSAVE
redis-cli -h \${REDIS_HOST} -p \${REDIS_PORT} BGSAVE

# 等待备份完成
while [ $(redis-cli -h \${REDIS_HOST} -p \${REDIS_PORT} LASTSAVE) -eq $(redis-cli -h \${REDIS_HOST} -p \${REDIS_PORT} LASTSAVE) ]; do
  echo "等待备份完成..."
  sleep 1
done

# 复制RDB文件
cp /var/lib/redis/dump.rdb \${BACKUP_FILE}

# 检查备份是否成功
if [ $? -eq 0 ]; then
  echo "备份成功: \${BACKUP_FILE}"
  
  # 压缩备份文件
  if [ "${plan.storage.compression}" = "true" ]; then
    gzip \${BACKUP_FILE}
    BACKUP_FILE="\${BACKUP_FILE}.gz"
    echo "备份文件已压缩"
  fi
  
  # 清理过期备份
  find \${BACKUP_DIR} -name "redis_*.rdb*" -mtime +7 -delete
  echo "已清理7天前的备份"
  
  exit 0
else
  echo "备份失败"
  # 发送告警通知
  echo "Redis备份失败" | mail -s "Redis Backup Failed" admin@example.com
  exit 1
fi
`;
  }

  /**
   * 生成容灾策略
   */
  generateDisasterRecoveryStrategy(strategy: DisasterRecoveryStrategy): string {
    let doc = `# 容灾策略文档

## RTO (Recovery Time Objectives)
恢复时间目标: ${strategy.rto}小时

## RPO (Recovery Point Objectives)
恢复点目标: ${strategy.rpo}小时

## 故障转移计划
`;

    for (const plan of strategy.failoverPlan) {
      doc += `${plan}\n`;
    }

    doc += `
## 回滚计划
`;

    for (const plan of strategy.rollbackPlan) {
      doc += `${plan}\n`;
    }

    return doc;
  }

  /**
   * 生成恢复脚本
   */
  generateRestoreScript(dbType: string, backupFile: string): string {
    const scripts: Record<string, string> = {
      postgresql: `#!/bin/bash

# PostgreSQL Restore Script
# 自动生成的恢复脚本

DB_HOST="\${DB_HOST:-localhost}"
DB_PORT="\${DB_PORT:-5432}"
DB_NAME="\${DB_NAME:-mydb}"
DB_USER="\${DB_USER:-postgres}"

echo "开始恢复数据库: \${DB_NAME}"
psql -h \${DB_HOST} -p \${DB_PORT} -U \${DB_USER} -d \${DB_NAME} < ${backupFile}

if [ $? -eq 0 ]; then
  echo "恢复成功"
  exit 0
else
  echo "恢复失败"
  exit 1
fi
`,
      mysql: `#!/bin/bash

# MySQL Restore Script
# 自动生成的恢复脚本

DB_HOST="\${DB_HOST:-localhost}"
DB_PORT="\${DB_PORT:-3306}"
DB_NAME="\${DB_NAME:-mydb}"
DB_USER="\${DB_USER:-root}"

echo "开始恢复数据库: \${DB_NAME}"
mysql -h \${DB_HOST} -P \${DB_PORT} -u \${DB_USER} -p\${DB_PASSWORD} \${DB_NAME} < ${backupFile}

if [ $? -eq 0 ]; then
  echo "恢复成功"
  exit 0
else
  echo "恢复失败"
  exit 1
fi
`,
      mongodb: `#!/bin/bash

# MongoDB Restore Script
# 自动生成的恢复脚本

DB_HOST="\${DB_HOST:-localhost}"
DB_PORT="\${DB_PORT:-27017}"
DB_NAME="\${DB_NAME:-mydb}"

echo "开始恢复数据库: \${DB_NAME}"
mongorestore --host \${DB_HOST} --port \${DB_PORT} --db \${DB_NAME} ${backupFile}

if [ $? -eq 0 ]; then
  echo "恢复成功"
  exit 0
else
  echo "恢复失败"
  exit 1
fi
`,
      redis: `#!/bin/bash

# Redis Restore Script
# 自动生成的恢复脚本

REDIS_HOST="\${REDIS_HOST:-localhost}"
REDIS_PORT="\${REDIS_PORT:-6379}"

echo "开始恢复Redis数据"

# 停止Redis
redis-cli -h \${REDIS_HOST} -p \${REDIS_PORT} SHUTDOWN

# 复制备份文件
cp ${backupFile} /var/lib/redis/dump.rdb

# 启动Redis
redis-server /etc/redis/redis.conf

echo "恢复成功"
`
    };

    return scripts[dbType] || `# Unknown database type: ${dbType}`;
  }

  /**
   * 生成默认备份计划配置
   */
  static getDefaultBackupPlan(dbName: string, dbType: 'postgresql' | 'mysql' | 'mongodb' | 'redis'): BackupPlan {
    return {
      database: {
        type: dbType,
        name: dbName,
        schedules: [
          { type: 'daily', time: '02:00', retentionDays: 7, backupType: 'full' },
          { type: 'weekly', time: '03:00', retentionDays: 30, backupType: 'full' },
          { type: 'monthly', time: '04:00', retentionDays: 90, backupType: 'full' }
        ]
      },
      storage: {
        type: 'local',
        location: '/backups',
        encryption: true,
        compression: true
      },
      monitoring: {
        enabled: true,
        alertThreshold: 24,
        notificationMethods: ['email', 'slack']
      },
      testing: {
        frequency: 'monthly',
        recoveryTimeObjective: '4小时',
        recoveryPointObjective: '1小时'
      }
    };
  }
}

// CLI使用示例
if (require.main === module) {
  const generator = new BackupGenerator();
  const backupPlan = BackupGenerator.getDefaultBackupPlan('myapp', 'postgresql');

  console.log('=== 备份计划 ===');
  console.log(generator.generateBackupPlan(backupPlan));

  console.log('\n=== PostgreSQL备份脚本 ===');
  console.log(generator.generatePostgreSQLBackupScript(backupPlan));

  console.log('\n=== 恢复脚本 ===');
  console.log(generator.generateRestoreScript('postgresql', '/backups/myapp_20240123_020000.sql.gz'));
}

// Export functions for unit tests
export interface BackupStrategyOptions {
  system: string;
  dataSize: string;
  rto: string;
  rpo: string;
}

export interface BackupStrategy {
  strategy: string;
  frequency: string;
  retention: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  storage: {
    type: string;
    location: string;
    encryption: boolean;
  };
}

export function generateBackupStrategy(options: BackupStrategyOptions): BackupStrategy {
  const dataSize = parseInt(options.dataSize) || 100;
  const rtoMinutes = parseTimeToMinutes(options.rto);
  const rpoMinutes = parseTimeToMinutes(options.rpo);

  let frequency = 'daily';
  if (rtoMinutes < 60 || rpoMinutes < 15) {
    frequency = 'hourly';
  } else if (rtoMinutes <= 240 && rpoMinutes <= 1440) {
    frequency = 'daily';
  } else {
    frequency = 'weekly';
  }

  return {
    strategy: determineStrategy(dataSize, rtoMinutes),
    frequency,
    retention: {
      daily: 7,
      weekly: 4,
      monthly: 12
    },
    storage: {
      type: 'local',
      location: '/backups',
      encryption: true
    }
  };
}

export interface BackupInfo {
  type: string;
  location: string;
  timestamp: string;
  size: string;
}

export interface RestoreProcedure {
  steps: string[];
  verification: string[];
  rollback: {
    steps: string[];
  };
  estimatedTime: string;
}

export function generateRestoreProcedure(backupInfo: BackupInfo): RestoreProcedure {
  const sizeGB = parseInt(backupInfo.size) || 100;
  const estimatedTime = Math.ceil(sizeGB * 2);

  return {
    steps: [
      'Stop application services',
      'Verify backup file integrity',
      'Restore backup from ' + backupInfo.location,
      'Restart database services',
      'Start application services'
    ],
    verification: [
      'Check database connection',
      'Verify data integrity',
      'Run health checks',
      'Test critical functionality'
    ],
    rollback: {
      steps: [
        'Stop application services',
        'Restore previous backup',
        'Restart services',
        'Verify system stability'
      ]
    },
    estimatedTime: estimatedTime + ' minutes'
  };
}

export interface BackupScheduleConfig {
  fullBackup: string;
  incrementalBackup: string;
  retentionDays: number;
  retentionWeeks?: number;
  retentionMonths?: number;
  dataSize?: string;
}

export interface BackupScheduleResult {
  schedule: {
    full: string;
    incremental: string;
  };
  calendar: string[];
  estimates: {
    storage: string;
  };
}

export function generateBackupSchedule(config: BackupScheduleConfig): BackupScheduleResult {
  const retentionDays = config.retentionDays || 30;
  const retentionWeeks = config.retentionWeeks || 12;
  const retentionMonths = config.retentionMonths || 12;
  const dataSizeGB = parseInt(config.dataSize || '100');

  const fullSizeGB = dataSizeGB;
  const dailyIncrementGB = Math.ceil(dataSizeGB * 0.05);
  const storageRequired = (fullSizeGB * retentionDays) + (dailyIncrementGB * retentionDays * retentionWeeks * 7);

  return {
    schedule: {
      full: config.fullBackup,
      incremental: config.incrementalBackup
    },
    calendar: generateBackupCalendar(config.fullBackup, config.incrementalBackup, 7),
    estimates: {
      storage: storageRequired + ' GB'
    }
  };
}

export interface BackupConfiguration {
  backupLocation: string;
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

export function validateBackupConfiguration(config: BackupConfiguration): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.backupLocation || config.backupLocation.trim() === '') {
    errors.push('Backup location is required');
  }

  if (config.schedule) {
    if (!config.schedule.full) {
      warnings.push('No full backup schedule defined');
    }
  }

  if (config.retention) {
    if (config.retention.daily === 0) {
      errors.push('Daily retention must be greater than 0');
    }
  }

  if (config.storage) {
    if (config.storage.encryption === false) {
      warnings.push('Encryption is not enabled for backup storage');
    }
  }

  if (config.rto && config.rpo) {
    const rtoMinutes = parseTimeToMinutes(config.rto);
    const rpoMinutes = parseTimeToMinutes(config.rpo);

    if (rpoMinutes > rtoMinutes) {
      warnings.push('RPO should not exceed RTO for optimal recovery');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Helper functions
function parseTimeToMinutes(timeStr: string): number {
  if (timeStr.includes('hour')) {
    return parseInt(timeStr) * 60;
  } else if (timeStr.includes('minute')) {
    return parseInt(timeStr);
  } else if (timeStr.includes('day')) {
    return parseInt(timeStr) * 1440;
  }
  return 60;
}

function determineStrategy(dataSizeGB: number, rtoMinutes: number): string {
  if (dataSizeGB > 1000) {
    return 'Incremental backup with weekly full';
  } else if (rtoMinutes < 60) {
    return 'Hourly incremental with daily full';
  } else {
    return 'Daily full backup with compression';
  }
}

function generateBackupCalendar(fullFreq: string, incFreq: string, days: number): string[] {
  const calendar: string[] = [];
  for (let i = 0; i < days; i++) {
    const day = new Date();
    day.setDate(day.getDate() + i);
    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
    calendar.push(`${dayName}: ${incFreq} backup`);
  }
  return calendar;
}
