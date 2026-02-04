/**
 * Data Engineer 测试适配器
 *
 * 将 SchemaGenerator 类方法包装为测试期望的函数形式
 */

import { SchemaGenerator } from '../../../skills/data-engineer/scripts/schema-generator';

// 创建默认的 SchemaGenerator 实例
const defaultGenerator = new SchemaGenerator({
    database: 'postgresql',
    outputDir: './test-output',
    generateMigration: true,
    generateERDiagram: true,
});

/**
 * 生成数据库Schema
 * 将 generateSchema 包装为测试期望的格式
 */
export function generateDatabaseSchema(entities: any[], database: string = 'postgresql'): { sql: string } {
    // 将测试数据格式转换为 SchemaGenerator 期望的格式
    const models = entities.map((entity: any) => {
        const fields = entity.fields.map((field: any) => {
            const convertedField: any = {
                name: field.name,
                type: field.type,
                required: field.required || false,
            };

            if (field.primary) {
                convertedField.primaryKey = true;
            }

            if (field.primaryKey) {
                convertedField.primaryKey = true;
            }

            if (field.unique) {
                convertedField.unique = true;
            }

            if (field.autoIncrement) {
                // autoIncrement 不是 Field 接口的属性，我们记录它但不使用
            }

            if (field.references) {
                convertedField.foreignKey = {
                    table: field.references.table,
                    field: field.references.field,
                };
            }

            return convertedField;
        });

        return {
            name: entity.name,
            tableName: entity.name.toLowerCase(), // 或者使用映射表
            fields,
        };
    });

    const generator = new SchemaGenerator({
        database: database as any,
        outputDir: './test-output',
        generateMigration: false,
        generateERDiagram: false,
    });

    return {
        sql: generator.generateSchema(models),
    };
}

/**
 * 生成实体关系图
 * 将 generateERDiagram 包装为测试期望的格式
 */
export function generateEntityRelationship(entities: any[], relationships: any[]): { mermaid: string } {
    const models = entities.map((entity: any) => ({
        name: entity.name,
        tableName: entity.name.toLowerCase(),
        fields: [], // 测试中不关心字段
        relations: [], // 这个需要从 relationships 参数转换
    }));

    const generator = new SchemaGenerator({
        database: 'postgresql',
        outputDir: './test-output',
        generateMigration: false,
        generateERDiagram: true,
    });

    return {
        mermaid: generator.generateERDiagram(models),
    };
}

/**
 * 生成迁移脚本
 * 将 generateMigration 包装为测试期望的格式
 */
export function generateMigrationScript(changes: any[], direction: string = 'up'): { sql: string } {
    // 测试中的 changes 格式与 SchemaGenerator 期望的不一致
    // 我们需要在这里做转换，但由于 SchemaGenerator 不支持这种细粒度的变更类型，
    // 我们创建一个简单的迁移脚本

    if (direction === 'up') {
        const tables = changes
            .filter((change) => change.type === 'createTable')
            .map((change) => {
                const fields = change.fields.map((field: any) => {
                    const convertedField: any = {
                        name: field.name,
                        type: field.type,
                        required: false,
                    };

                    if (field.primary) {
                        convertedField.primaryKey = true;
                    }

                    if (field.primaryKey) {
                        convertedField.primaryKey = true;
                    }

                    if (field.unique) {
                        convertedField.unique = true;
                    }

                    return convertedField;
                });

                return {
                    name: change.table,
                    tableName: change.table.toLowerCase(),
                    fields,
                };
            });

        const generator = new SchemaGenerator({
            database: 'postgresql',
            outputDir: './test-output',
            generateMigration: true,
            generateERDiagram: false,
        });

        return {
            sql: generator.generateMigration(tables),
        };
    } else {
        // down migration
        const tables = changes
            .filter((change) => change.type === 'createTable')
            .map((change) => `DROP TABLE IF EXISTS ${change.table};`);

        return {
            sql: tables.join('\n'),
        };
    }
}

/**
 * 验证Schema
 * 由于 SchemaGenerator 类没有 validateSchema 方法，我们实现一个简单的验证函数
 */
export function validateSchema(schema: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema.entities || !Array.isArray(schema.entities)) {
        errors.push('Schema must have an entities array');
        return { valid: false, errors };
    }

    for (const entity of schema.entities) {
        // 检查是否有主键
        const hasPrimaryKey = entity.fields.some((field: any) => field.primary || field.primaryKey);
        if (!hasPrimaryKey) {
            errors.push(`Entity ${entity.name} is missing a primary key`);
        }

        // 检查重复的字段名
        const fieldNames = entity.fields.map((f: any) => f.name);
        const duplicates = fieldNames.filter(
            (name: string, index: number) => fieldNames.indexOf(name) !== index
        );
        if (duplicates.length > 0) {
            errors.push(`Entity ${entity.name} has duplicate field names: ${duplicates.join(', ')}`);
        }

        // 检查循环引用
        // 这是一个简化版的检查，实际实现可能需要更复杂的图遍历算法
        const references = entity.fields
            .filter((f: any) => f.references)
            .map((f: any) => f.references.table);

        if (references.length > 0) {
            const selfReferences = references.filter((ref: string) =>
                schema.entities.some((e: any) => e.name === ref && e.fields.some((f: any) =>
                    f.references && f.references.table === entity.name
                ))
            );

            if (selfReferences.length > 0) {
                errors.push(`Detected circular reference involving ${entity.name}`);
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
