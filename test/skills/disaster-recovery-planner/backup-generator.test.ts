/**
 * Backup Generator 单元测试
 */

import {
    BackupGenerator,
    generateBackupSchedule,
    generateBackupStrategy,
    generateRestoreProcedure,
    validateBackupConfiguration
} from '../../../skills/skills/disaster-recovery-planner/scripts/backup-generator';

describe('BackupGenerator', () => {
    let generator: BackupGenerator;

    beforeEach(() => {
        generator = new BackupGenerator();
    });

    describe('BackupGenerator Class Methods', () => {
        it('should generate a complete backup plan', () => {
            const config = {
                database: {
                    type: 'postgresql' as const,
                    name: 'myapp_db',
                    schedules: [
                        {
                            type: 'daily' as const,
                            time: '02:00',
                            retentionDays: 7,
                            backupType: 'full' as const
                        },
                        {
                            type: 'weekly' as const,
                            time: '00:00',
                            retentionDays: 30,
                            backupType: 'full' as const
                        }
                    ]
                },
                storage: {
                    type: 'local' as const,
                    location: '/var/backups',
                    encryption: true,
                    compression: true
                },
                monitoring: {
                    enabled: true,
                    alertThreshold: 24,
                    notificationMethods: ['email', 'slack']
                },
                testing: {
                    frequency: 'weekly' as const,
                    recoveryTimeObjective: '1 hour',
                    recoveryPointObjective: '15 minutes'
                }
            };

            const result = generator.generateBackupPlan(config);

            expect(result).toContain('数据库备份计划');
            expect(result).toContain('postgresql');
            expect(result).toContain('myapp_db');
            expect(result).toContain('daily备份');
            expect(result).toContain('weekly备份');
            expect(result).toContain('/var/backups');
            expect(result).toContain('加密: 是');
            expect(result).toContain('压缩: 是');
            expect(result).toContain('1 hour');
            expect(result).toContain('15 minutes');
        });

        it('should generate PostgreSQL backup script', () => {
            const plan = {
                database: {
                    type: 'postgresql' as const,
                    name: 'testdb',
                    schedules: []
                },
                storage: {
                    type: 's3' as const,
                    location: 's3://my-backups',
                    encryption: true,
                    compression: true
                },
                monitoring: {
                    enabled: false,
                    alertThreshold: 24,
                    notificationMethods: []
                },
                testing: {
                    frequency: 'daily' as const,
                    recoveryTimeObjective: '2 hours',
                    recoveryPointObjective: '30 minutes'
                }
            };

            const script = generator.generatePostgreSQLBackupScript(plan);

            expect(script).toContain('#!/bin/bash');
            expect(script).toContain('PostgreSQL Backup Script');
            expect(script).toContain('testdb');
            expect(script).toContain('pg_dump');
        });

        it('should generate MySQL backup script', () => {
            const plan = {
                database: {
                    type: 'mysql' as const,
                    name: 'mydb',
                    schedules: []
                },
                storage: {
                    type: 'local' as const,
                    location: '/backups',
                    encryption: false,
                    compression: true
                },
                monitoring: {
                    enabled: true,
                    alertThreshold: 12,
                    notificationMethods: ['email']
                },
                testing: {
                    frequency: 'daily' as const,
                    recoveryTimeObjective: '1 hour',
                    recoveryPointObjective: '10 minutes'
                }
            };

            const script = generator.generateMySQLBackupScript(plan);

            expect(script).toContain('#!/bin/bash');
            expect(script).toContain('MySQL Backup Script');
            expect(script).toContain('mydb');
            expect(script).toContain('mysqldump');
        });

        it('should generate MongoDB backup script', () => {
            const plan = {
                database: {
                    type: 'mongodb' as const,
                    name: 'mongodb_db',
                    schedules: []
                },
                storage: {
                    type: 'azure' as const,
                    location: 'azure://storage',
                    encryption: true,
                    compression: true
                },
                monitoring: {
                    enabled: true,
                    alertThreshold: 6,
                    notificationMethods: ['slack']
                },
                testing: {
                    frequency: 'weekly' as const,
                    recoveryTimeObjective: '30 minutes',
                    recoveryPointObjective: '5 minutes'
                }
            };

            const script = generator.generateMongoDBBackupScript(plan);

            expect(script).toContain('#!/bin/bash');
            expect(script).toContain('MongoDB Backup Script');
            expect(script).toContain('mongodb_db');
            expect(script).toContain('mongodump');
        });

        it('should generate Redis backup script', () => {
            const plan = {
                database: {
                    type: 'redis' as const,
                    name: 'redis_cache',
                    schedules: []
                },
                storage: {
                    type: 'gcs' as const,
                    location: 'gs://my-bucket',
                    encryption: true,
                    compression: false
                },
                monitoring: {
                    enabled: false,
                    alertThreshold: 24,
                    notificationMethods: []
                },
                testing: {
                    frequency: 'monthly' as const,
                    recoveryTimeObjective: '5 minutes',
                    recoveryPointObjective: '1 minute'
                }
            };

            const script = generator.generateRedisBackupScript(plan);

            expect(script).toContain('#!/bin/bash');
            expect(script).toContain('Redis Backup Script');
            expect(script).toContain('redis-cli');
            expect(script).toContain('BGSAVE');
        });

        it('should generate disaster recovery strategy', () => {
            const strategy = {
                rto: 60,
                rpo: 15,
                failoverPlan: ['Step 1', 'Step 2'],
                rollbackPlan: ['Rollback 1', 'Rollback 2']
            };

            const result = generator.generateDisasterRecoveryStrategy(strategy);

            expect(result).toContain('容灾策略文档');
            expect(result).toContain('恢复时间目标: 60');
            expect(result).toContain('恢复点目标: 15');
            expect(result).toContain('故障转移计划');
            expect(result).toContain('回滚计划');
            expect(result).toContain('Step 1');
            expect(result).toContain('Rollback 1');
        });

        it('should generate backup plan without monitoring', () => {
            const config = {
                database: {
                    type: 'mysql' as const,
                    name: 'app_db',
                    schedules: [
                        {
                            type: 'daily' as const,
                            time: '03:00',
                            retentionDays: 14,
                            backupType: 'incremental' as const
                        }
                    ]
                },
                storage: {
                    type: 's3' as const,
                    location: 's3://backups',
                    encryption: false,
                    compression: false
                },
                monitoring: {
                    enabled: false,
                    alertThreshold: 48,
                    notificationMethods: []
                },
                testing: {
                    frequency: 'monthly' as const,
                    recoveryTimeObjective: '4 hours',
                    recoveryPointObjective: '1 hour'
                }
            };

            const result = generator.generateBackupPlan(config);

            expect(result).toContain('数据库备份计划');
            expect(result).not.toContain('监控配置');
            expect(result).toContain('加密: 否');
            expect(result).toContain('压缩: 否');
        });
    });

    describe('generateBackupStrategy', () => {
        it('should generate backup strategy', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: '1 hour',
                rpo: '15 minutes'
            };

            const result = generateBackupStrategy(options);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('strategy');
            expect(result).toHaveProperty('frequency');
            expect(result).toHaveProperty('retention');
            expect(result).toHaveProperty('storage');
        });

        it('should recommend daily backups for small databases', () => {
            const options = {
                system: 'Database',
                dataSize: '10GB',
                rto: '4 hours',
                rpo: '24 hours'
            };

            const result = generateBackupStrategy(options);

            expect(result.frequency).toContain('daily');
        });

        it('should recommend hourly backups for critical systems', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: '15 minutes',
                rpo: '5 minutes'
            };

            const result = generateBackupStrategy(options);

            expect(result.frequency).toContain('hourly');
        });

        it('should handle very small RTO values', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: '5 minutes',
                rpo: '1 minute'
            };

            const result = generateBackupStrategy(options);
            expect(result.frequency).toContain('hourly');
        });

        it('should handle unrecognized time format strings', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: 'unknown_format',
                rpo: '15 minutes'
            };

            const result = generateBackupStrategy(options);
            expect(result).toBeDefined();
        });

        it('should handle time conversion with various formats', () => {
            const testCases = [
                { rto: '30 minutes', rpo: '10 minutes' },
                { rto: '2 hours', rpo: '30 minutes' },
                { rto: '1 day', rpo: '4 hours' }
            ];

            testCases.forEach(testCase => {
                const options = {
                    system: 'Database',
                    dataSize: '100GB',
                    ...testCase
                };

                const result = generateBackupStrategy(options);
                expect(result.frequency).toBeTruthy();
            });
        });

        it('should include retention policy', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: '1 hour',
                rpo: '15 minutes'
            };

            const result = generateBackupStrategy(options);

            expect(result.retention).toBeDefined();
            expect(result.retention).toHaveProperty('daily');
            expect(result.retention).toHaveProperty('weekly');
            expect(result.retention).toHaveProperty('monthly');
        });

        it('should include storage recommendations', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: '1 hour',
                rpo: '15 minutes'
            };

            const result = generateBackupStrategy(options);

            expect(result.storage).toBeDefined();
            expect(result.storage).toHaveProperty('type');
            expect(result.storage).toHaveProperty('location');
            expect(result.storage).toHaveProperty('encryption');
        });
    });

    describe('generateRestoreProcedure', () => {
        it('should generate restore procedure', () => {
            const backupInfo = {
                type: 'full',
                location: '/backups/full-20240101.bak',
                timestamp: '2024-01-01 00:00:00',
                size: '100GB'
            };

            const result = generateRestoreProcedure(backupInfo);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('steps');
            expect(result).toHaveProperty('verification');
            expect(result).toHaveProperty('estimatedTime');
        });

        it('should include verification steps', () => {
            const backupInfo = {
                type: 'full',
                location: '/backups/full-20240101.bak',
                timestamp: '2024-01-01 00:00:00',
                size: '100GB'
            };

            const result = generateRestoreProcedure(backupInfo);

            expect(result.verification).toBeDefined();
            expect(result.verification.length).toBeGreaterThan(0);
        });

        it('should include rollback steps', () => {
            const backupInfo = {
                type: 'full',
                location: '/backups/full-20240101.bak',
                timestamp: '2024-01-01 00:00:00',
                size: '100GB'
            };

            const result = generateRestoreProcedure(backupInfo);

            expect(result.rollback).toBeDefined();
            expect(result.rollback.steps).toBeDefined();
        });

        it('should estimate restore time', () => {
            const backupInfo = {
                type: 'full',
                location: '/backups/full-20240101.bak',
                timestamp: '2024-01-01 00:00:00',
                size: '100GB'
            };

            const result = generateRestoreProcedure(backupInfo);

            expect(result.estimatedTime).toBeDefined();
        });
    });

    describe('generateBackupSchedule', () => {
        it('should generate backup schedule', () => {
            const config = {
                fullBackup: 'daily',
                incrementalBackup: 'hourly',
                retentionDays: 30,
                retentionWeeks: 12,
                retentionMonths: 12
            };

            const result = generateBackupSchedule(config);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('schedule');
            expect(result).toHaveProperty('calendar');
            expect(result).toHaveProperty('estimates');
        });

        it('should include full backup schedule', () => {
            const config = {
                fullBackup: 'daily',
                incrementalBackup: 'hourly',
                retentionDays: 30
            };

            const result = generateBackupSchedule(config);

            expect(result.schedule.full).toBeDefined();
            expect(result.schedule.full).toContain('daily');
        });

        it('should include incremental backup schedule', () => {
            const config = {
                fullBackup: 'daily',
                incrementalBackup: 'hourly',
                retentionDays: 30
            };

            const result = generateBackupSchedule(config);

            expect(result.schedule.incremental).toBeDefined();
            expect(result.schedule.incremental).toContain('hourly');
        });

        it('should estimate storage requirements', () => {
            const config = {
                fullBackup: 'daily',
                incrementalBackup: 'hourly',
                dataSize: '100GB',
                retentionDays: 30
            };

            const result = generateBackupSchedule(config);

            expect(result.estimates).toBeDefined();
            expect(result.estimates.storage).toBeDefined();
        });

        it('should generate calendar view', () => {
            const config = {
                fullBackup: 'daily',
                incrementalBackup: 'hourly',
                retentionDays: 30
            };

            const result = generateBackupSchedule(config);

            expect(result.calendar).toBeDefined();
            expect(result.calendar.length).toBeGreaterThan(0);
        });
    });

    describe('validateBackupConfiguration', () => {
        it('should validate correct backup configuration', () => {
            const config = {
                backupLocation: '/backups',
                schedule: {
                    full: 'daily',
                    incremental: 'hourly'
                },
                retention: {
                    daily: 30,
                    weekly: 12,
                    monthly: 12
                },
                storage: {
                    type: 'local',
                    encryption: true
                }
            };

            const result = validateBackupConfiguration(config);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('errors');
            expect(result).toHaveProperty('warnings');
        });

        it('should detect missing backup location', () => {
            const config = {
                backupLocation: '',
                schedule: {
                    full: 'daily'
                }
            };

            const result = validateBackupConfiguration(config);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should detect insufficient retention policy', () => {
            const config = {
                backupLocation: '/backups',
                schedule: {
                    full: 'daily'
                },
                retention: {
                    daily: 0
                }
            };

            const result = validateBackupConfiguration(config);

            expect(result.valid).toBe(false);
        });

        it('should warn about no encryption', () => {
            const config = {
                backupLocation: '/backups',
                schedule: {
                    full: 'daily'
                },
                storage: {
                    type: 'local',
                    encryption: false
                }
            };

            const result = validateBackupConfiguration(config);

            expect(result.warnings.length).toBeGreaterThan(0);
        });

        it('should validate RTO and RPO', () => {
            const config = {
                backupLocation: '/backups',
                schedule: {
                    full: 'daily'
                },
                rto: '1 hour',
                rpo: '15 minutes'
            };

            const result = validateBackupConfiguration(config);

            expect(result.valid).toBe(true);
        });

        it('should handle very small RTO values', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: '5 minutes',
                rpo: '1 minute'
            };

            const result = generateBackupStrategy(options);
            expect(result.frequency).toContain('hourly');
        });

        it('should handle unrecognized time format strings', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: 'unknown_format',
                rpo: '15 minutes'
            };

            const result = generateBackupStrategy(options);
            expect(result).toBeDefined();
        });

        it('should handle time conversion with various formats', () => {
            const testCases = [
                { rto: '30 minutes', rpo: '10 minutes' },
                { rto: '2 hours', rpo: '30 minutes' },
                { rto: '1 day', rpo: '4 hours' }
            ];

            testCases.forEach(testCase => {
                const options = {
                    system: 'Database',
                    dataSize: '100GB',
                    ...testCase
                };

                const result = generateBackupStrategy(options);
                expect(result.frequency).toBeTruthy();
            });

            const sizes = ['10GB', '100GB', '500GB', '1TB'];
            sizes.forEach(dataSize => {
                const options = {
                    system: 'Database',
                    dataSize,
                    rto: '1 hour',
                    rpo: '30 minutes'
                };

                const result = generateBackupStrategy(options);
                expect(result).toBeDefined();
            });
        });

        it('should generate procedures for different restore scenarios', () => {
            const scenarios = [
                { type: 'full', location: '/backups/prod', timestamp: '2024-01-01', size: '100GB' },
                { type: 'incremental', location: '/backups/staging', timestamp: '2024-01-02', size: '20GB' },
                { type: 'differential', location: '/backups/dev', timestamp: '2024-01-03', size: '50GB' },
                { type: 'point-in-time', location: '/backups/prod', timestamp: '2024-01-04', size: '80GB' }
            ];

            scenarios.forEach(scenario => {
                const result = generateRestoreProcedure(scenario);
                expect(result).toBeDefined();
                expect(result.steps).toBeDefined();
            });
        });

        it('should create schedules with different patterns', () => {
            const patterns = [
                { fullBackup: 'hourly', incrementalBackup: 'hourly', retentionDays: 24 },
                { fullBackup: 'daily', incrementalBackup: 'hourly', retentionDays: 7 },
                { fullBackup: 'weekly', incrementalBackup: 'daily', retentionDays: 4 },
                { fullBackup: 'monthly', incrementalBackup: 'weekly', retentionDays: 12 }
            ];

            patterns.forEach(pattern => {
                const result = generateBackupSchedule(pattern);
                expect(result).toBeDefined();
            });
        });

        it('should validate configurations with different storage types', () => {
            const storageTypes = ['local', 's3', 'azure', 'gcs', 'nfs'];

            storageTypes.forEach(type => {
                const config = {
                    backupLocation: '/backups',
                    schedule: { full: 'daily' },
                    storage: { type }
                };

                const result = validateBackupConfiguration(config);
                expect(result).toBeDefined();
            });
        });

        it('should handle RTO and RPO combinations', () => {
            const combos = [
                { rto: '15 minutes', rpo: '5 minutes' },
                { rto: '1 hour', rpo: '15 minutes' },
                { rto: '4 hours', rpo: '1 hour' },
                { rto: '24 hours', rpo: '8 hours' }
            ];

            combos.forEach(combo => {
                const options = {
                    system: 'Database',
                    dataSize: '100GB',
                    ...combo
                };

                const result = generateBackupStrategy(options);
                expect(result).toBeDefined();
            });
        });

        it('should generate backup strategy with encryption requirements', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: '1 hour',
                rpo: '30 minutes',
                encryption: true
            };

            const result = generateBackupStrategy(options);
            expect(result).toBeDefined();
        });

        it('should generate backup strategy with compression settings', () => {
            const options = {
                system: 'FileSystem',
                dataSize: '500GB',
                rto: '2 hours',
                rpo: '1 hour',
                compression: 'high'
            };

            const result = generateBackupStrategy(options);
            expect(result).toBeDefined();
        });

        it('should validate backup configuration with notifications', () => {
            const config = {
                backupLocation: '/backups',
                schedule: { full: 'daily' },
                notifications: {
                    onSuccess: true,
                    onFailure: true,
                    email: 'admin@example.com'
                }
            };

            const result = validateBackupConfiguration(config);
            expect(result).toBeDefined();
        });

        it('should handle parallel backup jobs', () => {
            const config = {
                backupLocation: '/backups',
                schedule: { full: 'daily' },
                parallel: {
                    enabled: true,
                    maxJobs: 4
                }
            };

            const result = validateBackupConfiguration(config);
            expect(result).toBeDefined();
        });
    });

    describe('generateRestoreScript', () => {
        it('should generate PostgreSQL restore script', () => {
            const script = generator.generateRestoreScript('postgresql', '/backups/db.sql');
            expect(script).toContain('#!/bin/bash');
            expect(script).toContain('PostgreSQL');
            expect(script).toContain('psql');
            expect(script).toContain('DB_HOST');
            expect(script).toContain('/backups/db.sql');
        });

        it('should generate MySQL restore script', () => {
            const script = generator.generateRestoreScript('mysql', '/backups/mysql.sql');
            expect(script).toContain('#!/bin/bash');
            expect(script).toContain('MySQL');
            expect(script).toContain('mysql');
            expect(script).toContain('DB_USER');
            expect(script).toContain('/backups/mysql.sql');
        });

        it('should generate MongoDB restore script', () => {
            const script = generator.generateRestoreScript('mongodb', '/backups/mongo');
            expect(script).toContain('#!/bin/bash');
            expect(script).toContain('MongoDB');
            expect(script).toContain('mongorestore');
            expect(script).toContain('DB_PORT');
            expect(script).toContain('/backups/mongo');
        });

        it('should generate Redis restore script', () => {
            const script = generator.generateRestoreScript('redis', '/backups/dump.rdb');
            expect(script).toContain('#!/bin/bash');
            expect(script).toContain('Redis');
            expect(script).toContain('redis-cli');
            expect(script).toContain('SHUTDOWN');
            expect(script).toContain('/backups/dump.rdb');
        });

        it('should handle unknown database type', () => {
            const script = generator.generateRestoreScript('unknown', '/backups/file');
            expect(script).toContain('Unknown database type: unknown');
        });

        it('should generate restore script with environment variables', () => {
            const script = generator.generateRestoreScript('postgresql', '/backups/db.sql');
            expect(script).toContain('${');
            expect(script).toContain('}');
        });

        it('should generate restore script with error handling', () => {
            const script = generator.generateRestoreScript('mysql', '/backups/db.sql');
            expect(script).toContain('if [ $? -eq 0 ]');
            expect(script).toContain('exit 0');
            expect(script).toContain('exit 1');
        });
    });

    describe('getDefaultBackupPlan', () => {
        it('should generate default backup plan for PostgreSQL', () => {
            const plan = BackupGenerator.getDefaultBackupPlan('testdb', 'postgresql');
            expect(plan).toBeDefined();
            expect(plan.database.type).toBe('postgresql');
            expect(plan.database.name).toBe('testdb');
            expect(plan.database.schedules.length).toBeGreaterThan(0);
        });

        it('should generate default backup plan for MySQL', () => {
            const plan = BackupGenerator.getDefaultBackupPlan('mydb', 'mysql');
            expect(plan).toBeDefined();
            expect(plan.database.type).toBe('mysql');
            expect(plan.database.name).toBe('mydb');
            expect(plan.storage).toBeDefined();
        });

        it('should generate default backup plan for MongoDB', () => {
            const plan = BackupGenerator.getDefaultBackupPlan('mongodb', 'mongodb');
            expect(plan).toBeDefined();
            expect(plan.database.type).toBe('mongodb');
            expect(plan.monitoring).toBeDefined();
        });

        it('should generate default backup plan for Redis', () => {
            const plan = BackupGenerator.getDefaultBackupPlan('redis', 'redis');
            expect(plan).toBeDefined();
            expect(plan.database.type).toBe('redis');
            expect(plan.testing).toBeDefined();
        });

        it('should include all required backup schedules', () => {
            const plan = BackupGenerator.getDefaultBackupPlan('testdb', 'postgresql');
            expect(plan.database.schedules.length).toBe(3);
            expect(plan.database.schedules[0].type).toBe('daily');
            expect(plan.database.schedules[1].type).toBe('weekly');
            expect(plan.database.schedules[2].type).toBe('monthly');
        });

        it('should configure encryption by default', () => {
            const plan = BackupGenerator.getDefaultBackupPlan('testdb', 'postgresql');
            expect(plan.storage.encryption).toBe(true);
            expect(plan.storage.compression).toBe(true);
        });

        it('should enable monitoring by default', () => {
            const plan = BackupGenerator.getDefaultBackupPlan('testdb', 'postgresql');
            expect(plan.monitoring.enabled).toBe(true);
            expect(plan.monitoring.alertThreshold).toBe(24);
        });

        it('should include email and slack notification methods', () => {
            const plan = BackupGenerator.getDefaultBackupPlan('testdb', 'postgresql');
            expect(plan.monitoring.notificationMethods).toContain('email');
            expect(plan.monitoring.notificationMethods).toContain('slack');
        });
    });

    describe('Additional Coverage - Edge Cases', () => {
        it('should warn when full backup schedule is missing', () => {
            const config = {
                backupLocation: '/backups',
                schedule: {
                    // No full backup schedule
                }
            };

            const result = validateBackupConfiguration(config);
            expect(result.warnings.length).toBeGreaterThan(0);
        });

        it('should warn when RPO exceeds RTO', () => {
            const config = {
                backupLocation: '/backups',
                schedule: { full: 'daily' },
                rto: '1 hour',
                rpo: '24 hours'
            };

            const result = validateBackupConfiguration(config);
            expect(result.warnings.length).toBeGreaterThan(0);
        });

        it('should handle time string with days suffix', () => {
            const options = {
                system: 'Database',
                dataSize: '100GB',
                rto: '1 day',
                rpo: '12 hours'
            };

            const result = generateBackupStrategy(options);
            expect(result).toBeDefined();
            expect(result.frequency).toBeTruthy();
        });

        it('should generate strategies for very large databases', () => {
            const options = {
                system: 'Database',
                dataSize: '2000GB',
                rto: '2 hours',
                rpo: '1 hour'
            };

            const result = generateBackupStrategy(options);
            expect(result.strategy).toContain('Incremental');
        });

        it('should handle backup schedule with default retention values', () => {
            const config = {
                fullBackup: 'daily',
                incrementalBackup: 'hourly',
                retentionDays: 30
                // retentionWeeks and retentionMonths are optional with defaults
            };

            const result = generateBackupSchedule(config);
            expect(result.estimates.storage).toBeTruthy();
        });

        it('should generate calendar for backup planning', () => {
            const config = {
                fullBackup: 'weekly',
                incrementalBackup: 'daily',
                retentionDays: 7
            };

            const result = generateBackupSchedule(config);
            expect(result.calendar).toBeDefined();
            expect(result.calendar.length).toBeGreaterThan(0);
            expect(result.calendar[0]).toMatch(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/);
        });

        it('should validate retention with only daily value', () => {
            const config = {
                backupLocation: '/backups',
                schedule: { full: 'daily' },
                retention: { daily: 7 }
            };

            const result = validateBackupConfiguration(config);
            expect(result.valid).toBe(true);
        });

        it('should handle empty or whitespace backup location', () => {
            const configs = [
                { backupLocation: '', schedule: { full: 'daily' } },
                { backupLocation: '   ', schedule: { full: 'daily' } },
                { backupLocation: '\t', schedule: { full: 'daily' } }
            ];

            configs.forEach(config => {
                const result = validateBackupConfiguration(config);
                expect(result.valid).toBe(false);
                expect(result.errors.some(e => e.includes('Backup location'))).toBe(true);
            });
        });

        it('should validate with explicit daily retention of 0', () => {
            const config = {
                backupLocation: '/backups',
                schedule: { full: 'daily' },
                retention: { daily: 0 }
            };

            const result = validateBackupConfiguration(config);
            expect(result.valid).toBe(false);
        });

        it('should generate restore script that handles various backup file paths', () => {
            const backupPaths = [
                '/backups/db.sql',
                '/mnt/external/backup.bak',
                's3://bucket/backups/file.sql.gz',
                '/var/lib/backup-20240101.sql'
            ];

            backupPaths.forEach(path => {
                const script = generator.generateRestoreScript('postgresql', path);
                expect(script).toContain(path);
            });
        });

        it('should handle all database types in generateRestoreScript', () => {
            const dbTypes = ['postgresql', 'mysql', 'mongodb', 'redis'];
            const backupFile = '/backups/test.bak';

            dbTypes.forEach(dbType => {
                const script = generator.generateRestoreScript(dbType, backupFile);
                expect(script).toBeDefined();
                expect(script.length).toBeGreaterThan(0);
            });
        });

        it('should include proper error handling in restore scripts', () => {
            const dbTypesWithErrorHandling = ['postgresql', 'mysql', 'mongodb'];
            const backupFile = '/backups/test.bak';

            dbTypesWithErrorHandling.forEach(dbType => {
                const script = generator.generateRestoreScript(dbType, backupFile);
                expect(script).toContain('exit');
            });
        });

        it('should generate scripts for all database types', () => {
            const dbTypes = ['postgresql', 'mysql', 'mongodb', 'redis'];
            const backupFile = '/backups/test.bak';

            dbTypes.forEach(dbType => {
                const script = generator.generateRestoreScript(dbType, backupFile);
                expect(script.length).toBeGreaterThan(0);
                expect(script).toContain(backupFile);
            });
        });

        describe('GenerateBackupPlan method coverage', () => {
            it('should generate backup plan with disabled monitoring', () => {
                const config: any = {
                    database: {
                        type: 'postgresql',
                        name: 'testdb',
                        schedules: [
                            { type: 'daily', time: '02:00', retentionDays: 7, backupType: 'full' }
                        ]
                    },
                    storage: {
                        type: 'local',
                        location: '/backups',
                        encryption: false,
                        compression: false
                    },
                    monitoring: {
                        enabled: false,
                        alertThreshold: 0,
                        notificationMethods: []
                    },
                    testing: {
                        frequency: 'daily',
                        recoveryTimeObjective: '1 hour',
                        recoveryPointObjective: '15 minutes'
                    }
                };

                const result = generator.generateBackupPlan(config);

                expect(result).toContain('testdb');
                expect(result).toContain('daily');
                expect(result).toContain('postgresql');
                expect(result).not.toContain('监控配置');
            });

            it('should include compression and encryption settings', () => {
                const config: any = {
                    database: {
                        type: 'mysql',
                        name: 'appdb',
                        schedules: []
                    },
                    storage: {
                        type: 's3',
                        location: 's3://bucket/backups',
                        encryption: true,
                        compression: true
                    },
                    monitoring: {
                        enabled: true,
                        alertThreshold: 24,
                        notificationMethods: ['email']
                    },
                    testing: {
                        frequency: 'weekly',
                        recoveryTimeObjective: '2 hours',
                        recoveryPointObjective: '30 minutes'
                    }
                };

                const result = generator.generateBackupPlan(config);

                expect(result).toContain('是');
                expect(result).toContain('s3');
                expect(result).toContain('email');
            });
        });

        describe('AllGenerateScriptMethods coverage', () => {
            it('should generate MySQL backup script with compression', () => {
                const config: any = {
                    database: {
                        type: 'mysql',
                        name: 'wordpressdb',
                        schedules: []
                    },
                    storage: {
                        type: 'local',
                        location: '/backups/mysql',
                        compression: true
                    }
                };

                const result = generator.generateMySQLBackupScript(config);

                expect(result).toContain('mysqldump');
                expect(result).toContain('wordpressdb');
                expect(result).toContain('gzip');
            });

            it('should generate MongoDB backup script with compression', () => {
                const config: any = {
                    database: {
                        type: 'mongodb',
                        name: 'appdata',
                        schedules: []
                    },
                    storage: {
                        type: 'local',
                        location: '/backups/mongo',
                        compression: true
                    }
                };

                const result = generator.generateMongoDBBackupScript(config);

                expect(result).toContain('mongodump');
                expect(result).toContain('appdata');
                expect(result).toContain('tar -czf');
            });

            it('should generate Redis backup script without compression', () => {
                const config: any = {
                    database: {
                        type: 'redis',
                        name: 'cache',
                        schedules: []
                    },
                    storage: {
                        type: 'local',
                        location: '/backups/redis',
                        compression: false
                    }
                };

                const result = generator.generateRedisBackupScript(config);

                expect(result).toContain('redis-cli');
                expect(result).toContain('BGSAVE');
                expect(result).toContain('gzip');
            });
        });

        describe('DisasterRecoveryStrategy generation', () => {
            it('should generate comprehensive disaster recovery strategy', () => {
                const strategy = {
                    rto: 4,
                    rpo: 1,
                    failoverPlan: [
                        '1. 检测故障',
                        '2. 激活备用系统',
                        '3. 切换DNS'
                    ],
                    rollbackPlan: [
                        '1. 验证数据一致性',
                        '2. 逐步恢复流量',
                        '3. 监控关键指标'
                    ]
                };

                const result = generator.generateDisasterRecoveryStrategy(strategy);

                expect(result).toContain('RTO');
                expect(result).toContain('RPO');
                expect(result).toContain('故障转移计划');
                expect(result).toContain('回滚计划');
                expect(result).toContain('检测故障');
                expect(result).toContain('验证数据一致性');
            });

            it('should handle zero RTO and RPO values', () => {
                const strategy = {
                    rto: 0,
                    rpo: 0,
                    failoverPlan: [],
                    rollbackPlan: []
                };

                const result = generator.generateDisasterRecoveryStrategy(strategy);

                expect(result).toContain('0小时');
            });
        });

        describe('Backup script generation with special characters', () => {
            it('should handle database names with special characters', () => {
                const configWithSpecialName: any = {
                    database: {
                        type: 'postgresql',
                        name: 'db-app_prod.v2',
                        schedules: []
                    },
                    storage: {
                        type: 'local',
                        location: '/backups',
                        compression: false
                    }
                };

                const result = generator.generatePostgreSQLBackupScript(configWithSpecialName);

                expect(result).toContain('db-app_prod.v2');
            });

            it('should handle backup paths with spaces in directory names', () => {
                const configWithPath: any = {
                    database: {
                        type: 'mysql',
                        name: 'testdb',
                        schedules: []
                    },
                    storage: {
                        type: 'local',
                        location: '/backups/my database/backups',
                        compression: false
                    }
                };

                const result = generator.generateMySQLBackupScript(configWithPath);

                expect(result).toContain('/backups/my database/backups');
            });
        });

        describe('Helper functions and edge cases', () => {
            it('should handle large database backup strategies', () => {
                const largeDBOptions = {
                    system: 'Database',
                    dataSize: '5000GB',
                    rto: '4 hours',
                    rpo: '1 hour'
                };

                const result = generateBackupStrategy(largeDBOptions);

                expect(result.strategy).toContain('Incremental');
                expect(result).toBeDefined();
            });

            it('should handle very small RTO/RPO combinations', () => {
                const criticalOptions = {
                    system: 'CriticalDB',
                    dataSize: '50GB',
                    rto: '15 minutes',
                    rpo: '5 minutes'
                };

                const result = generateBackupStrategy(criticalOptions);

                expect(result.frequency).toBe('hourly');
                expect(result.retention.daily).toBeGreaterThan(0);
            });

            it('should generate backup calendar with proper formatting', () => {
                const scheduleConfig = {
                    fullBackup: 'daily',
                    incrementalBackup: 'hourly',
                    retentionDays: 30,
                    retentionWeeks: 12,
                    retentionMonths: 12,
                    dataSize: '100GB'
                };

                const result = generateBackupSchedule(scheduleConfig);

                expect(result.calendar).toBeDefined();
                expect(result.calendar.length).toBeGreaterThan(0);
                expect(result.estimates.storage).toContain('GB');
            });

            it('should handle backup schedule with custom retention periods', () => {
                const customScheduleConfig = {
                    fullBackup: 'weekly',
                    incrementalBackup: 'daily',
                    retentionDays: 60,
                    retentionWeeks: 24,
                    retentionMonths: 24,
                    dataSize: '500GB'
                };

                const result = generateBackupSchedule(customScheduleConfig);

                expect(result.schedule.full).toBe('weekly');
                expect(result.schedule.incremental).toBe('daily');
                expect(parseInt(result.estimates.storage)).toBeGreaterThan(1000);
            });

            it('should properly parse time formats in validation', () => {
                const configWithDayFormat = {
                    backupLocation: '/backups',
                    schedule: { full: 'daily' },
                    rto: '1 day',
                    rpo: '4 hours'
                };

                const result = validateBackupConfiguration(configWithDayFormat);

                expect(result.valid).toBe(true);
            });

            it('should validate multiple time format variations', () => {
                const configs = [
                    { rto: '2 hours', rpo: '30 minutes' },
                    { rto: '1 day', rpo: '4 hours' },
                    { rto: '30 minutes', rpo: '5 minutes' }
                ];

                configs.forEach(config => {
                    const fullConfig = {
                        backupLocation: '/backups',
                        schedule: { full: 'daily' },
                        ...config
                    };

                    const result = validateBackupConfiguration(fullConfig);
                    expect(result).toBeDefined();
                });
            });

            it('should handle restore procedure with various data sizes', () => {
                const sizes = ['10GB', '100GB', '500GB', '1000GB'];

                sizes.forEach(size => {
                    const backupInfo = {
                        type: 'full',
                        location: '/backups/backup.bak',
                        timestamp: '2024-01-01 00:00:00',
                        size
                    };

                    const result = generateRestoreProcedure(backupInfo);

                    expect(result.steps).toBeDefined();
                    expect(result.verification).toBeDefined();
                    expect(result.estimatedTime).toContain('minutes');
                });
            });

            it('should include all required backup schedule components', () => {
                const config = {
                    fullBackup: 'daily',
                    incrementalBackup: 'hourly',
                    retentionDays: 30
                };

                const result = generateBackupSchedule(config);

                expect(result.schedule).toBeDefined();
                expect(result.calendar).toBeDefined();
                expect(result.estimates).toBeDefined();
                expect(result.estimates.storage).toBeDefined();
            });

            it('should handle missing optional retention configuration', () => {
                const minimalConfig = {
                    fullBackup: 'daily',
                    incrementalBackup: 'daily',
                    retentionDays: 7
                };

                const result = generateBackupSchedule(minimalConfig);

                expect(result).toBeDefined();
                expect(result.estimates.storage).toBeDefined();
            });

            it('should execute all main class methods end-to-end', () => {
                const newGenerator = new BackupGenerator();
                const defaultPlan = BackupGenerator.getDefaultBackupPlan('testdb', 'postgresql');

                // Test backup plan generation
                const plan = newGenerator.generateBackupPlan(defaultPlan);
                expect(plan).toContain('testdb');
                expect(plan).toContain('备份计划');

                // Test PostgreSQL backup script
                const pgScript = newGenerator.generatePostgreSQLBackupScript(defaultPlan);
                expect(pgScript).toContain('pg_dump');
                expect(pgScript).toContain('testdb');

                // Test MySQL backup script
                const mysqlScript = newGenerator.generateMySQLBackupScript(defaultPlan);
                expect(mysqlScript).toContain('mysqldump');

                // Test MongoDB backup script
                const mongoScript = newGenerator.generateMongoDBBackupScript(defaultPlan);
                expect(mongoScript).toContain('mongodump');

                // Test Redis backup script
                const redisScript = newGenerator.generateRedisBackupScript(defaultPlan);
                expect(redisScript).toContain('redis-cli');

                // Test disaster recovery strategy
                const strategy = newGenerator.generateDisasterRecoveryStrategy({
                    rto: 2,
                    rpo: 1,
                    failoverPlan: ['激活备用'],
                    rollbackPlan: ['验证恢复']
                });
                expect(strategy).toContain('容灾');

                // Test restore script generation
                const restoreScript = newGenerator.generateRestoreScript('postgresql', '/backups/backup.sql');
                expect(restoreScript).toContain('psql');
                expect(restoreScript).toContain('/backups/backup.sql');
            });

            it('should handle unrecognized time format with default return value', () => {
                const unknownFormatConfig = {
                    backupLocation: '/backups',
                    schedule: { full: 'daily' },
                    rto: 'unknown format',
                    rpo: '1 hour'
                };

                const result = validateBackupConfiguration(unknownFormatConfig);
                expect(result).toBeDefined();
            });

            it('should handle backup strategy with unrecognized time string', () => {
                const unknownTimeOptions = {
                    system: 'Database',
                    dataSize: '100GB',
                    rto: 'invalid',
                    rpo: 'unknown'
                };

                const result = generateBackupStrategy(unknownTimeOptions);
                expect(result.frequency).toBe('daily'); // Default parseTimeToMinutes returns 60, which falls in daily range
            });

            it('should test determineStrategy for different database sizes', () => {
                // For databases > 1000GB, should recommend incremental
                const largeStrategy = generateBackupStrategy({
                    system: 'LargeDB',
                    dataSize: '2000GB',
                    rto: '4 hours',
                    rpo: '1 hour'
                });
                expect(largeStrategy.strategy).toContain('Incremental');

                // For RTO < 60 minutes, should recommend hourly incremental
                const fastRTOStrategy = generateBackupStrategy({
                    system: 'CriticalDB',
                    dataSize: '100GB',
                    rto: '30 minutes',
                    rpo: '5 minutes'
                });
                expect(fastRTOStrategy.strategy).toContain('Hourly');

                // For normal cases, should recommend daily full
                const normalStrategy = generateBackupStrategy({
                    system: 'NormalDB',
                    dataSize: '100GB',
                    rto: '4 hours',
                    rpo: '1 hour'
                });
                expect(normalStrategy.strategy).toContain('Daily');
            });

            it('should handle backup configuration with only daily retention', () => {
                const dailyOnlyConfig = {
                    backupLocation: '/backups',
                    schedule: { full: 'daily' },
                    retention: { daily: 7 }
                };

                const result = validateBackupConfiguration(dailyOnlyConfig);
                expect(result.valid).toBe(true);
            });

            it('should generate backup scripts with all supported database types', () => {
                const dbTypes: Array<'postgresql' | 'mysql' | 'mongodb' | 'redis'> = ['postgresql', 'mysql', 'mongodb', 'redis'];
                const generator = new BackupGenerator();
                const plans = dbTypes.map(type => BackupGenerator.getDefaultBackupPlan('testdb', type));

                dbTypes.forEach((dbType, index) => {
                    const plan = plans[index];
                    const script = generator.generatePostgreSQLBackupScript(plan);
                    expect(script).toBeDefined();
                    expect(script.length).toBeGreaterThan(0);
                });
            });

            it('should test all generateScript methods with different compression settings', () => {
                const configs = [
                    { compression: true },
                    { compression: false }
                ];

                configs.forEach(config => {
                    const pgPlan: any = {
                        database: { type: 'postgresql', name: 'db1', schedules: [] },
                        storage: { ...config }
                    };
                    const mysqlPlan: any = {
                        database: { type: 'mysql', name: 'db2', schedules: [] },
                        storage: { ...config }
                    };
                    const mongoPlan: any = {
                        database: { type: 'mongodb', name: 'db3', schedules: [] },
                        storage: { ...config }
                    };
                    const redisPlan: any = {
                        database: { type: 'redis', name: 'cache', schedules: [] },
                        storage: { ...config }
                    };

                    const generator = new BackupGenerator();
                    expect(generator.generatePostgreSQLBackupScript(pgPlan)).toBeDefined();
                    expect(generator.generateMySQLBackupScript(mysqlPlan)).toBeDefined();
                    expect(generator.generateMongoDBBackupScript(mongoPlan)).toBeDefined();
                    expect(generator.generateRedisBackupScript(redisPlan)).toBeDefined();
                });
            });
        });
    });
});
