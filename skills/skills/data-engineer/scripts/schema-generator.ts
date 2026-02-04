#!/usr/bin/env node

/**
 * Data Engineer - 数据库Schema生成脚本
 *
 * 用途：根据数据模型生成数据库Schema、ER图、迁移脚本等
 * 使用场景：设计阶段生成Schema，开发阶段生成迁移脚本
 */

interface Field {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "text" | "json";
    required: boolean;
    unique?: boolean;
    primaryKey?: boolean;
    indexed?: boolean;
    defaultValue?: any;
    foreignKey?: {
        table: string;
        field: string;
        onDelete?: "CASCADE" | "SET NULL" | "RESTRICT";
    };
    description?: string;
}

interface Model {
    name: string;
    tableName: string;
    fields: Field[];
    indexes?: Index[];
    relations?: Relation[];
}

interface Index {
    name: string;
    fields: string[];
    unique?: boolean;
}

interface Relation {
    type: "one-to-one" | "one-to-many" | "many-to-many";
    model: string;
    foreignKey?: string;
    joinTable?: string;
}

interface SchemaGeneratorOptions {
    database: "postgresql" | "mysql" | "mongodb" | "sqlite";
    outputDir: string;
    generateMigration: boolean;
    generateERDiagram: boolean;
}

export class SchemaGenerator {
    private _options: SchemaGeneratorOptions;

    constructor(options: SchemaGeneratorOptions) {
        this._options = options;
    }

    /**
     * 根据模型生成完整Schema
     */
    generateSchema(models: Model[]): string {
        let sql = "";

        // 生成建表语句
        for (const model of models) {
            sql += this.generateTableSQL(model);
            sql += "\n\n";
        }

        // 生成索引
        for (const model of models) {
            if (model.indexes && model.indexes.length > 0) {
                sql += this.generateIndexesSQL(model);
                sql += "\n";
            }
        }

        // 生成外键约束
        for (const model of models) {
            sql += this.generateForeignKeysSQL(model);
            sql += "\n";
        }

        return sql;
    }

    /**
     * 生成单个表的SQL
     */
    private generateTableSQL(model: Model): string {
        const tableName = model.tableName;
        let sql = `CREATE TABLE ${tableName} (\n`;

        // 生成字段
        const fieldSQLs = model.fields.map((field) => this.generateFieldSQL(field));
        sql += fieldSQLs.join(",\n");

        // 主键
        const primaryKey =
            model.fields.find((f) => f.name === "id") || model.fields[0];
        if (primaryKey) {
            sql += `,\n  PRIMARY KEY (${primaryKey.name})`;
        }

        sql += "\n);";

        return sql;
    }

    /**
     * 生成字段SQL
     */
    private generateFieldSQL(field: Field): string {
        const dbType = this.mapFieldType(field.type);
        const constraints = this.generateFieldConstraints(field);

        let sql = `  ${field.name} ${dbType}${constraints}`;

        if (field.description) {
            sql += ` -- ${field.description}`;
        }

        return sql;
    }

    /**
     * 映射字段类型到数据库类型
     */
    private mapFieldType(type: string): string {
        const typeMap: Record<string, Record<string, string>> = {
            postgresql: {
                string: "VARCHAR(255)",
                number: "INTEGER",
                boolean: "BOOLEAN",
                date: "TIMESTAMP",
                text: "TEXT",
                json: "JSONB",
            },
            mysql: {
                string: "VARCHAR(255)",
                number: "INT",
                boolean: "TINYINT(1)",
                date: "DATETIME",
                text: "TEXT",
                json: "JSON",
            },
            sqlite: {
                string: "TEXT",
                number: "INTEGER",
                boolean: "INTEGER",
                date: "DATETIME",
                text: "TEXT",
                json: "TEXT",
            },
            mongodb: {
                string: "String",
                number: "Number",
                boolean: "Boolean",
                date: "Date",
                text: "String",
                json: "Object",
            },
        };

        return typeMap[this._options.database][type] || "TEXT";
    }

    /**
     * 生成字段约束
     */
    private generateFieldConstraints(field: Field): string {
        const constraints: string[] = [];

        if (field.required) {
            constraints.push("NOT NULL");
        }

        if (field.unique) {
            constraints.push("UNIQUE");
        }

        if (field.defaultValue !== undefined) {
            if (typeof field.defaultValue === "string") {
                constraints.push(`DEFAULT '${field.defaultValue}'`);
            } else {
                constraints.push(`DEFAULT ${field.defaultValue}`);
            }
        }

        return constraints.length > 0 ? " " + constraints.join(" ") : "";
    }

    /**
     * 生成索引SQL
     */
    private generateIndexesSQL(model: Model): string {
        let sql = "";

        if (!model.indexes) return sql;

        for (const index of model.indexes) {
            const uniqueClause = index.unique ? "UNIQUE " : "";
            sql += `CREATE ${uniqueClause}INDEX ${index.name} ON ${model.tableName} (${index.fields.join(", ")});\n`;
        }

        return sql;
    }

    /**
     * 生成外键约束SQL
     */
    private generateForeignKeysSQL(model: Model): string {
        let sql = "";

        for (const field of model.fields) {
            if (field.foreignKey) {
                const onDelete = field.foreignKey.onDelete || "RESTRICT";
                sql += `ALTER TABLE ${model.tableName}\n`;
                sql += `  ADD CONSTRAINT fk_${model.tableName}_${field.name}\n`;
                sql += `  FOREIGN KEY (${field.name})\n`;
                sql += `  REFERENCES ${field.foreignKey.table}(${field.foreignKey.field})\n`;
                sql += `  ON DELETE ${onDelete};\n`;
            }
        }

        return sql;
    }

    /**
     * 生成数据库迁移脚本
     */
    generateMigration(models: Model[]): string {
        const timestamp = Date.now();
        const migrationSQL = this.generateSchema(models);

        const migration = `
-- Migration: ${timestamp}
-- Description: Database schema migration

BEGIN;

${migrationSQL}

COMMIT;
    `.trim();

        return migration;
    }

    /**
     * 生成ER图（Mermaid格式）
     */
    generateERDiagram(models: Model[]): string {
        let mermaid = "erDiagram\n";

        // 生成实体
        for (const model of models) {
            mermaid += `  ${model.tableName} {\n`;

            for (const field of model.fields) {
                const typeSymbol = this.getFieldTypeSymbol(field);
                mermaid += `    ${typeSymbol} ${field.name} ${field.type}\n`;
            }

            mermaid += "  }\n";
        }

        // 生成关系
        for (const model of models) {
            if (model.relations) {
                for (const relation of model.relations) {
                    const relationSymbol = this.getRelationSymbol(relation.type);
                    const targetTable =
                        models.find((m) => m.name === relation.model)?.tableName ||
                        relation.model.toLowerCase();
                    mermaid += `  ${model.tableName} ${relationSymbol} ${targetTable} : "${relation.type}"\n`;
                }
            }
        }

        return mermaid;
    }

    /**
     * 获取字段类型符号
     */
    private getFieldTypeSymbol(field: Field): string {
        if (field.primaryKey) return "PK";
        if (field.foreignKey) return "FK";
        if (field.unique) return "UK";
        if (field.required) return "";
        return "?";
    }

    /**
     * 获取关系符号
     */
    private getRelationSymbol(type: string): string {
        const symbols: Record<string, string> = {
            "one-to-one": "||--||",
            "one-to-many": "||--o{",
            "many-to-many": "}o--o{",
        };

        return symbols[type] || "--";
    }

    /**
     * 生成数据字典
     */
    generateDataDictionary(models: Model[]): string {
        let dictionary = "# 数据字典\n\n";

        for (const model of models) {
            dictionary += `## ${model.name} (${model.tableName})\n\n`;
            dictionary += "| 字段名 | 类型 | 必填 | 唯一 | 默认值 | 描述 |\n";
            dictionary += "|--------|------|------|------|--------|------|\n";

            for (const field of model.fields) {
                dictionary += `| ${field.name} | ${field.type} | ${field.required ? "✅" : "❌"} | ${field.unique ? "✅" : "❌"} | ${field.defaultValue ?? "-"} | ${field.description ?? "-"} |\n`;
            }

            dictionary += "\n";
        }

        return dictionary;
    }

    /**
     * 生成ORM模型代码
     */
    generateORMModel(
        model: Model,
        orm: "prisma" | "sequelize" | "typeorm",
    ): string {
        if (orm === "prisma") {
            return this.generatePrismaModel(model);
        } else if (orm === "sequelize") {
            return this.generateSequelizeModel(model);
        } else {
            return this.generateTypeORMModel(model);
        }
    }

    /**
     * 生成Prisma模型
     */
    private generatePrismaModel(model: Model): string {
        let prisma = `model ${model.name} {\n`;

        for (const field of model.fields) {
            const prismaType = this.mapToPrismaType(field.type);
            const modifiers = this.generatePrismaModifiers(field);
            prisma += `  ${field.name} ${prismaType}${modifiers}\n`;
        }

        prisma += "}\n";

        return prisma;
    }

    /**
     * 映射到Prisma类型
     */
    private mapToPrismaType(type: string): string {
        const typeMap: Record<string, string> = {
            string: "String",
            number: "Int",
            boolean: "Boolean",
            date: "DateTime",
            text: "String",
            json: "Json",
        };

        return typeMap[type] || "String";
    }

    /**
     * 生成Prisma修饰符
     */
    private generatePrismaModifiers(field: Field): string {
        const modifiers: string[] = [];

        if (field.required) {
            modifiers.push("");
        } else {
            modifiers.push("?");
        }

        if (field.unique) {
            modifiers.push("@unique");
        }

        if (field.defaultValue !== undefined) {
            if (field.defaultValue === "NOW()") {
                modifiers.push("@default(now())");
            } else if (typeof field.defaultValue === "string") {
                modifiers.push(`@default("${field.defaultValue}")`);
            } else {
                modifiers.push(`@default(${field.defaultValue})`);
            }
        }

        return modifiers.join(" ");
    }

    /**
     * 生成Sequelize模型
     */
    private generateSequelizeModel(model: Model): string {
        let sequelize = `const { DataTypes } = require('sequelize');\n\n`;
        sequelize += `module.exports = (sequelize) => {\n`;
        sequelize += `  const ${model.name} = sequelize.define('${model.name}', {\n`;

        for (const field of model.fields) {
            const sequelizeType = this.mapToSequelizeType(field.type);
            const attributes = this.generateSequelizeAttributes(field);
            sequelize += `    ${field.name}: {\n`;
            sequelize += `      type: ${sequelizeType},\n`;
            sequelize += `${attributes}    },\n`;
        }

        sequelize += `  }, {\n`;
        sequelize += `    tableName: '${model.tableName}',\n`;
        sequelize += `    timestamps: ${model.fields.some((f) => f.name === "createdAt" || f.name === "updatedAt")},\n`;
        sequelize += `  });\n\n`;
        sequelize += `  return ${model.name};\n`;
        sequelize += `};\n`;

        return sequelize;
    }

    /**
     * 映射到Sequelize类型
     */
    private mapToSequelizeType(type: string): string {
        const typeMap: Record<string, string> = {
            string: "DataTypes.STRING(255)",
            number: "DataTypes.INTEGER",
            boolean: "DataTypes.BOOLEAN",
            date: "DataTypes.DATE",
            text: "DataTypes.TEXT",
            json: "DataTypes.JSON",
        };

        return typeMap[type] || "DataTypes.STRING";
    }

    /**
     * 生成Sequelize属性
     */
    private generateSequelizeAttributes(field: Field): string {
        const attributes: string[] = [];

        if (field.required) {
            attributes.push(`      allowNull: false,\n`);
        }

        if (field.unique) {
            attributes.push(`      unique: true,\n`);
        }

        if (field.defaultValue !== undefined) {
            if (typeof field.defaultValue === "string") {
                attributes.push(`      defaultValue: '${field.defaultValue}',\n`);
            } else {
                attributes.push(`      defaultValue: ${field.defaultValue},\n`);
            }
        }

        return attributes.join("");
    }

    /**
     * 生成TypeORM模型
     */
    private generateTypeORMModel(model: Model): string {
        let typeorm = `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';\n\n`;
        typeorm += `@Entity('${model.tableName}')\n`;
        typeorm += `export class ${model.name} {\n`;

        for (const field of model.fields) {
            const decorators = this.generateTypeORMDecorators(field);
            typeorm += `  ${decorators}\n`;
            typeorm += `  ${field.name}: ${this.mapToTypeORMType(field.type)};\n\n`;
        }

        typeorm += `}\n`;

        return typeorm;
    }

    /**
     * 生成TypeORM装饰器
     */
    private generateTypeORMDecorators(field: Field): string {
        const decorators: string[] = [];

        if (field.primaryKey) {
            decorators.push("@PrimaryGeneratedColumn()");
        } else {
            decorators.push(`@Column({`);

            const options: string[] = [];
            if (!field.required) options.push("nullable: true");
            if (field.unique) options.push("unique: true");
            if (field.defaultValue !== undefined) {
                if (typeof field.defaultValue === "string") {
                    options.push(`default: '${field.defaultValue}'`);
                } else {
                    options.push(`default: ${field.defaultValue}`);
                }
            }

            decorators.push(options.join(", "));
            decorators.push("})");
        }

        return decorators.join("\n  ");
    }

    /**
     * 映射到TypeScript类型
     */
    private mapToTypeORMType(type: string): string {
        const typeMap: Record<string, string> = {
            string: "string",
            number: "number",
            boolean: "boolean",
            date: "Date",
            text: "string",
            json: "any",
        };

        return typeMap[type] || "any";
    }

    /**
     * CLI主程序逻辑（提取以便测试）
     */
    runCLI(): void {
        const exampleModel: Model = {
            name: "User",
            tableName: "users",
            fields: [
                { name: "id", type: "number", required: true, primaryKey: true },
                { name: "username", type: "string", required: true, unique: true },
                { name: "email", type: "string", required: true, unique: true },
                { name: "password", type: "string", required: true },
                {
                    name: "createdAt",
                    type: "date",
                    required: true,
                    defaultValue: "NOW()",
                },
                {
                    name: "updatedAt",
                    type: "date",
                    required: true,
                    defaultValue: "NOW()",
                },
            ],
        };

        console.log("SQL Schema:");
        console.log(this.generateSchema([exampleModel]));
        console.log("\nER Diagram:");
        console.log(this.generateERDiagram([exampleModel]));
    }
}

// CLI使用示例
/* istanbul ignore next: CLI entry point not testable in unit tests */
if (require.main === module) {
    const generator = new SchemaGenerator({
        database: "postgresql",
        outputDir: "./migrations",
        generateMigration: true,
        generateERDiagram: true,
    });

    generator.runCLI();
}
