/**
 * Schema Generator 单元测试
 */

import { SchemaGenerator } from '../../../skills/skills/data-engineer/scripts/schema-generator';

describe('SchemaGenerator', () => {
    let generator: SchemaGenerator;

    beforeEach(() => {
        generator = new SchemaGenerator({
            database: 'postgresql',
            outputDir: './migrations',
            generateMigration: true,
            generateERDiagram: true
        });
    });

    describe('generateSchema', () => {
        it('should generate database schema', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'name', type: 'string' as const, required: true },
                        { name: 'email', type: 'string' as const, required: true, unique: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toBeDefined();
            expect(result).toContain('CREATE TABLE user');
            expect(result).toContain('id');
            expect(result).toContain('name');
            expect(result).toContain('email');
        });

        it('should include primary key', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('PRIMARY KEY');
        });

        it('should include unique constraints', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'email', type: 'string' as const, required: true, unique: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('UNIQUE');
        });

        it('should include foreign key constraints', () => {
            const models = [
                {
                    name: 'Post',
                    tableName: 'post',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        {
                            name: 'userId',
                            type: 'number' as const,
                            required: true,
                            foreignKey: {
                                table: 'user',
                                field: 'id',
                                onDelete: 'CASCADE' as const
                            }
                        }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('FOREIGN KEY');
            expect(result).toContain('REFERENCES user(id)');
        });

        it('should handle different data types', () => {
            const models = [
                {
                    name: 'Product',
                    tableName: 'product',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'name', type: 'string' as const, required: true },
                        { name: 'price', type: 'number' as const, required: true },
                        { name: 'description', type: 'text' as const, required: false },
                        { name: 'active', type: 'boolean' as const, required: true },
                        { name: 'metadata', type: 'json' as const, required: false }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('CREATE TABLE product');
            expect(result).toContain('id');
            expect(result).toContain('name');
            expect(result).toContain('price');
        });

        it('should handle optional fields', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'phone', type: 'string' as const, required: false },
                        { name: 'address', type: 'text' as const, required: false }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('user');
            expect(result).toContain('phone');
        });

        it('should handle indexes', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'email', type: 'string' as const, required: true, unique: true, indexed: true },
                        { name: 'username', type: 'string' as const, required: true, indexed: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('user');
        });

        it('should handle multiple models with relationships', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                },
                {
                    name: 'Post',
                    tableName: 'post',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        {
                            name: 'userId',
                            type: 'number' as const,
                            required: true,
                            foreignKey: {
                                table: 'user',
                                field: 'id',
                                onDelete: 'CASCADE' as const
                            }
                        }
                    ]
                },
                {
                    name: 'Comment',
                    tableName: 'comment',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        {
                            name: 'postId',
                            type: 'number' as const,
                            required: true,
                            foreignKey: {
                                table: 'post',
                                field: 'id',
                                onDelete: 'CASCADE' as const
                            }
                        }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('CREATE TABLE');
        });

        it('should handle different constraint types', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'email', type: 'string' as const, required: true, unique: true },
                        { name: 'status', type: 'string' as const, required: true },
                        { name: 'role', type: 'string' as const, required: false, defaultValue: 'user' }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('user');
        });
    });

    describe('generateMigration', () => {
        it('should generate migration script with BEGIN and COMMIT', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                }
            ];

            const result = generator.generateMigration(models);

            expect(result).toContain('BEGIN');
            expect(result).toContain('COMMIT');
        });

        it('should include timestamp in migration', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                }
            ];

            const result = generator.generateMigration(models);

            expect(result).toMatch(/Migration: \d+/);
        });

        it('should handle rollback in migration', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                }
            ];

            const result = generator.generateMigration(models);

            expect(result).toContain('--');
        });

        it('should handle indexes in migration', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'email', type: 'string' as const, required: true, indexed: true }
                    ]
                }
            ];

            const result = generator.generateMigration(models);

            expect(result).toBeDefined();
        });
    });

    describe('generateERDiagram', () => {
        it('should generate ER diagram in mermaid format', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'name', type: 'string' as const, required: true }
                    ]
                },
                {
                    name: 'Post',
                    tableName: 'post',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'title', type: 'string' as const, required: true }
                    ]
                }
            ];

            const result = generator.generateERDiagram(models);

            expect(result).toContain('erDiagram');
            expect(result).toContain('user {');
            expect(result).toContain('post {');
        });

        it('should include all entities', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                },
                {
                    name: 'Post',
                    tableName: 'post',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                }
            ];

            const result = generator.generateERDiagram(models);

            expect(result).toContain('user');
            expect(result).toContain('post');
        });

        it('should include one-to-many relationships', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ],
                    relations: [
                        {
                            type: 'one-to-many' as const,
                            model: 'Post'
                        }
                    ]
                },
                {
                    name: 'Post',
                    tableName: 'post',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                }
            ];

            const result = generator.generateERDiagram(models);

            expect(result).toContain('||--o{');
            expect(result).toContain('user');
            expect(result).toContain('post');
        });

        it('should include one-to-one relationships', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ],
                    relations: [
                        {
                            type: 'one-to-one' as const,
                            model: 'Profile'
                        }
                    ]
                },
                {
                    name: 'Profile',
                    tableName: 'profile',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                }
            ];

            const result = generator.generateERDiagram(models);

            expect(result).toContain('||--||');
        });

        it('should include many-to-many relationships', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ],
                    relations: [
                        {
                            type: 'many-to-many' as const,
                            model: 'Role'
                        }
                    ]
                },
                {
                    name: 'Role',
                    tableName: 'role',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ]
                }
            ];

            const result = generator.generateERDiagram(models);

            expect(result).toContain('}o--o{');
        });
    });

    describe('generateDataDictionary', () => {
        it('should generate data dictionary with field information', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true },
                        { name: 'name', type: 'string' as const, required: true, unique: true },
                        { name: 'email', type: 'string' as const, required: false }
                    ]
                }
            ];

            const result = generator.generateDataDictionary(models);

            expect(result).toContain('# 数据字典');
            expect(result).toContain('User (user)');
            expect(result).toContain('| 字段名 |');
            expect(result).toContain('| id |');
            expect(result).toContain('| name |');
        });
    });

    describe('generateORMModel', () => {
        it('should generate Prisma model', () => {
            const model = {
                name: 'User',
                tableName: 'user',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'name', type: 'string' as const, required: true }
                ]
            };

            const result = generator.generateORMModel(model, 'prisma');

            expect(result).toContain('model User');
            expect(result).toContain('id Int');
            expect(result).toContain('name String');
        });

        it('should generate Sequelize model', () => {
            const model = {
                name: 'User',
                tableName: 'user',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'name', type: 'string' as const, required: true }
                ]
            };

            const result = generator.generateORMModel(model, 'sequelize');

            expect(result).toContain("define('User'");
            expect(result).toContain('DataTypes.INTEGER');
            expect(result).toContain('DataTypes.STRING');
        });

        it('should generate TypeORM model', () => {
            const model = {
                name: 'User',
                tableName: 'user',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'name', type: 'string' as const, required: true }
                ]
            };

            const result = generator.generateORMModel(model, 'typeorm');

            expect(result).toContain("export class User");
            expect(result).toContain('@PrimaryGeneratedColumn()');
            expect(result).toContain('@Column');
        });
    });

    describe('database type variations', () => {
        it('should generate schema for MySQL database', () => {
            const mysqlGenerator = new SchemaGenerator({
                database: 'mysql',
                outputDir: './migrations',
                generateMigration: true,
                generateERDiagram: true
            });

            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'name', type: 'string' as const, required: true },
                        { name: 'email', type: 'string' as const, required: true, unique: true }
                    ]
                }
            ];

            const result = mysqlGenerator.generateSchema(models);

            expect(result).toContain('CREATE TABLE user');
            expect(result).toContain('INT');
        });

        it('should generate schema for SQLite database', () => {
            const sqliteGenerator = new SchemaGenerator({
                database: 'sqlite',
                outputDir: './migrations',
                generateMigration: true,
                generateERDiagram: true
            });

            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'active', type: 'boolean' as const, required: true }
                    ]
                }
            ];

            const result = sqliteGenerator.generateSchema(models);

            expect(result).toContain('CREATE TABLE');
        });

        it('should generate schema for MongoDB database', () => {
            const mongoGenerator = new SchemaGenerator({
                database: 'mongodb',
                outputDir: './migrations',
                generateMigration: true,
                generateERDiagram: true
            });

            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'name', type: 'string' as const, required: true }
                    ]
                }
            ];

            const result = mongoGenerator.generateSchema(models);

            expect(result).toBeDefined();
        });
    });

    describe('field type handling', () => {
        it('should handle boolean type fields', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'active', type: 'boolean' as const, required: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('active');
            expect(result).toContain('BOOLEAN');
        });

        it('should handle date type fields', () => {
            const models = [
                {
                    name: 'Event',
                    tableName: 'event',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'eventDate', type: 'date' as const, required: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('eventDate');
            expect(result).toContain('TIMESTAMP');
        });

        it('should handle text type fields', () => {
            const models = [
                {
                    name: 'Article',
                    tableName: 'article',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'content', type: 'text' as const, required: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('content');
            expect(result).toContain('TEXT');
        });

        it('should handle json type fields', () => {
            const models = [
                {
                    name: 'Config',
                    tableName: 'config',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'settings', type: 'json' as const, required: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('settings');
            expect(result).toContain('JSONB');
        });
    });

    describe('field constraints', () => {
        it('should handle fields with default values (string)', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'status', type: 'string' as const, required: true, defaultValue: 'active' }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('DEFAULT');
            expect(result).toContain('active');
        });

        it('should handle fields with default values (number)', () => {
            const models = [
                {
                    name: 'Product',
                    tableName: 'product',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'quantity', type: 'number' as const, required: true, defaultValue: 0 }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('DEFAULT');
        });

        it('should handle field descriptions', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true, description: 'User identifier' },
                        { name: 'email', type: 'string' as const, required: true, description: 'User email address' }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('--');
            expect(result).toContain('User identifier');
        });

        it('should handle required/optional fields in migration', () => {
            const models = [
                {
                    name: 'Post',
                    tableName: 'post',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'title', type: 'string' as const, required: true },
                        { name: 'subtitle', type: 'string' as const, required: false }
                    ]
                }
            ];

            const result = generator.generateMigration(models);

            expect(result).toContain('post');
        });
    });

    describe('foreign key handling', () => {
        it('should handle CASCADE delete on foreign keys', () => {
            const models = [
                {
                    name: 'Post',
                    tableName: 'post',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        {
                            name: 'userId',
                            type: 'number' as const,
                            required: true,
                            foreignKey: {
                                table: 'user',
                                field: 'id',
                                onDelete: 'CASCADE' as const
                            }
                        }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('CASCADE');
        });

        it('should handle SET NULL on foreign keys', () => {
            const models = [
                {
                    name: 'Post',
                    tableName: 'post',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        {
                            name: 'authorId',
                            type: 'number' as const,
                            required: false,
                            foreignKey: {
                                table: 'user',
                                field: 'id',
                                onDelete: 'SET NULL' as const
                            }
                        }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('SET NULL');
        });

        it('should handle RESTRICT on foreign keys', () => {
            const models = [
                {
                    name: 'OrderItem',
                    tableName: 'order_item',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        {
                            name: 'productId',
                            type: 'number' as const,
                            required: true,
                            foreignKey: {
                                table: 'product',
                                field: 'id',
                                onDelete: 'RESTRICT' as const
                            }
                        }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('RESTRICT');
        });
    });

    describe('ORM type variations', () => {
        it('should generate Prisma model with optional fields', () => {
            const model = {
                name: 'User',
                tableName: 'user',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'phone', type: 'string' as const, required: false }
                ]
            };

            const result = generator.generateORMModel(model, 'prisma');

            expect(result).toContain('model User');
        });

        it('should generate Sequelize model with constraints', () => {
            const model = {
                name: 'User',
                tableName: 'user',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'email', type: 'string' as const, required: true, unique: true },
                    { name: 'status', type: 'string' as const, required: true, defaultValue: 'active' }
                ]
            };

            const result = generator.generateORMModel(model, 'sequelize');

            expect(result).toContain('sequelize');
        });

        it('should generate TypeORM model with all field types', () => {
            const model = {
                name: 'Post',
                tableName: 'post',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'title', type: 'string' as const, required: true },
                    { name: 'published', type: 'boolean' as const, required: true },
                    { name: 'createdAt', type: 'date' as const, required: true },
                    { name: 'content', type: 'text' as const, required: false },
                    { name: 'metadata', type: 'json' as const, required: false }
                ]
            };

            const result = generator.generateORMModel(model, 'typeorm');

            expect(result).toContain('export class Post');
        });
    });

    describe('edge cases and fallbacks', () => {
        it('should fall back to TEXT for unknown field type', () => {
            const models = [
                {
                    name: 'BlobStore',
                    tableName: 'blob_store',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'payload', type: 'blob' as any, required: false }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('payload TEXT');
        });

        it('should return empty SQL when indexes are not provided', () => {
            const model = {
                name: 'NoIndex',
                tableName: 'no_index',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                ]
            };

            const result = (generator as any).generateIndexesSQL(model);

            expect(result).toBe('');
        });

        it('should generate unique indexes when configured', () => {
            const models = [
                {
                    name: 'Account',
                    tableName: 'account',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'code', type: 'string' as const, required: true }
                    ],
                    indexes: [
                        { name: 'idx_account_code', fields: ['code'], unique: true }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('CREATE UNIQUE INDEX idx_account_code');
        });

        it('should generate non-unique indexes when unique is not specified', () => {
            const models = [
                {
                    name: 'Log',
                    tableName: 'log',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        { name: 'timestamp', type: 'date' as const, required: true }
                    ],
                    indexes: [
                        { name: 'idx_log_timestamp', fields: ['timestamp'] }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('CREATE INDEX idx_log_timestamp');
            expect(result).not.toContain('CREATE UNIQUE INDEX idx_log_timestamp');
        });

        it('should default foreign key onDelete to RESTRICT when omitted', () => {
            const models = [
                {
                    name: 'Invoice',
                    tableName: 'invoice',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        {
                            name: 'customerId',
                            type: 'number' as const,
                            required: true,
                            foreignKey: { table: 'customer', field: 'id' }
                        }
                    ]
                }
            ];

            const result = generator.generateSchema(models);

            expect(result).toContain('ON DELETE RESTRICT');
        });

        it('should include field type symbols in ER diagram', () => {
            const models = [
                {
                    name: 'Profile',
                    tableName: 'profile',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                        {
                            name: 'userId',
                            type: 'number' as const,
                            required: true,
                            foreignKey: { table: 'user', field: 'id', onDelete: 'CASCADE' as const }
                        },
                        { name: 'nickname', type: 'string' as const, required: true, unique: true },
                        { name: 'bio', type: 'text' as const, required: false }
                    ]
                }
            ];

            const result = generator.generateERDiagram(models);

            expect(result).toContain('PK id number');
            expect(result).toContain('FK userId number');
            expect(result).toContain('UK nickname string');
            expect(result).toContain('? bio text');
        });

        it('should fall back relation symbol and table name when model is missing', () => {
            const models = [
                {
                    name: 'User',
                    tableName: 'user',
                    fields: [
                        { name: 'id', type: 'number' as const, required: true, primaryKey: true }
                    ],
                    relations: [
                        { type: 'unknown' as any, model: 'AuditLog' }
                    ]
                }
            ];

            const result = generator.generateERDiagram(models);

            expect(result).toContain('user -- auditlog');
        });

        it('should handle prisma modifiers for NOW() and optional fields', () => {
            const model = {
                name: 'Audit',
                tableName: 'audit',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'createdAt', type: 'date' as const, required: true, defaultValue: 'NOW()' },
                    { name: 'label', type: 'string' as const, required: false, defaultValue: 'draft' }
                ]
            };

            const result = generator.generateORMModel(model, 'prisma');

            expect(result).toContain('@default(now())');
            expect(result).toContain('label String? @default("draft")');
        });

        it('should fallback to String in prisma for unknown types', () => {
            const model = {
                name: 'Mystery',
                tableName: 'mystery',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'value', type: 'unknown' as any, required: true, defaultValue: 1 }
                ]
            };

            const result = generator.generateORMModel(model, 'prisma');

            expect(result).toContain('value String @default(1)');
        });

        it('should include sequelize attributes for defaults and uniqueness', () => {
            const model = {
                name: 'Tag',
                tableName: 'tag',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'code', type: 'string' as const, required: true, unique: true, defaultValue: 'x' },
                    { name: 'rank', type: 'number' as const, required: true, defaultValue: 1 }
                ]
            };

            const result = generator.generateORMModel(model, 'sequelize');

            expect(result).toContain('unique: true');
            expect(result).toContain("defaultValue: 'x'");
            expect(result).toContain('defaultValue: 1');
            expect(result).toContain('allowNull: false');
        });

        it('should fallback to DataTypes.STRING for unknown types in sequelize', () => {
            const model = {
                name: 'Mystery',
                tableName: 'mystery',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'data', type: 'exotic' as any, required: true }
                ]
            };

            const result = generator.generateORMModel(model, 'sequelize');

            expect(result).toContain('DataTypes.STRING');
        });

        it('should omit allowNull when sequelize field is optional', () => {
            const model = {
                name: 'OptionalField',
                tableName: 'optional_field',
                fields: [
                    { name: 'note', type: 'string' as const, required: false }
                ]
            };

            const result = generator.generateORMModel(model, 'sequelize');

            expect(result).toContain('note: {');
            expect(result).not.toContain('allowNull: false');
        });

        it('should generate typeorm decorators with nullable and default options', () => {
            const model = {
                name: 'Session',
                tableName: 'session',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'expiresAt', type: 'date' as const, required: false, defaultValue: '2099-01-01' },
                    { name: 'payload', type: 'blob' as any, required: false }
                ]
            };

            const result = generator.generateORMModel(model, 'typeorm');

            expect(result).toContain('@PrimaryGeneratedColumn()');
            expect(result).toContain('nullable: true');
            expect(result).toContain("default: '2099-01-01'");
            expect(result).toContain('payload: any');
        });

        it('should include unique option in typeorm when configured', () => {
            const model = {
                name: 'UniqueField',
                tableName: 'unique_field',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'code', type: 'string' as const, required: true, unique: true }
                ]
            };

            const result = generator.generateORMModel(model, 'typeorm');

            expect(result).toContain('unique: true');
        });

        it('should include prisma unique modifier when configured', () => {
            const model = {
                name: 'Account',
                tableName: 'account',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'email', type: 'string' as const, required: true, unique: true }
                ]
            };

            const result = generator.generateORMModel(model, 'prisma');

            expect(result).toContain('@unique');
        });

        it('should omit unique and nullable options in typeorm when not configured', () => {
            const model = {
                name: 'Basic',
                tableName: 'basic',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'name', type: 'string' as const, required: true }
                ]
            };

            const result = generator.generateORMModel(model, 'typeorm');

            expect(result).toContain('@Column');
            expect(result).not.toContain('nullable');
            expect(result).not.toContain('unique');
            expect(result).not.toContain('default');
        });

        it('should handle typeorm non-primary field with number default', () => {
            const model = {
                name: 'Counter',
                tableName: 'counter',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'value', type: 'number' as const, required: true, defaultValue: 10 }
                ]
            };

            const result = generator.generateORMModel(model, 'typeorm');

            expect(result).toContain('default: 10');
        });

        it('should fallback to any for unknown type in typeorm', () => {
            const model = {
                name: 'Exotic',
                tableName: 'exotic',
                fields: [
                    { name: 'id', type: 'number' as const, required: true, primaryKey: true },
                    { name: 'data', type: 'exotic' as any, required: true }
                ]
            };

            const result = generator.generateORMModel(model, 'typeorm');

            expect(result).toContain('data: any');
        });
    });

    describe('CLI main module execution', () => {
        it('should run CLI example and output schema and ER diagram', () => {
            const originalLog = console.log;
            const logs: string[] = [];

            console.log = (...args: any[]) => {
                logs.push(args.join(' '));
            };

            try {
                generator.runCLI();

                expect(logs.some(log => log.includes('SQL Schema:'))).toBe(true);
                expect(logs.some(log => log.includes('ER Diagram:'))).toBe(true);
                expect(logs.some(log => log.includes('CREATE TABLE users'))).toBe(true);
                expect(logs.some(log => log.includes('erDiagram'))).toBe(true);
            } finally {
                console.log = originalLog;
            }
        });

        it('should create generator with options when run as main module', () => {
            // Test that SchemaGenerator can be instantiated with CLI-like options
            const cliGenerator = new SchemaGenerator({
                database: "postgresql",
                outputDir: "./migrations",
                generateMigration: true,
                generateERDiagram: true,
            });

            expect(cliGenerator).toBeInstanceOf(SchemaGenerator);
            expect((cliGenerator as any)._options.database).toBe('postgresql');
            expect((cliGenerator as any)._options.outputDir).toBe('./migrations');
        });
    });
});
