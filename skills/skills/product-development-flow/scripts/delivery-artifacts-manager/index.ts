/**
 * Delivery Artifacts Manager - 交付物管理器
 *
 * 负责管理各阶段的交付物，确保交付物的完整性和可追溯性。
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

/**
 * 简单的日志记录器
 */
export class Logger {
    constructor(private prefix: string) { }

    info(message: string): void {
        console.log(`[${this.prefix}] INFO: ${message}`);
    }

    warn(message: string): void {
        console.warn(`[${this.prefix}] WARN: ${message}`);
    }

    error(message: string): void {
        console.error(`[${this.prefix}] ERROR: ${message}`);
    }

    skillComplete(skillName: string, cost: number): void {
        this.info(`Skill complete: ${skillName} (cost: ${cost})`);
    }
}

/**
 * 上下文管理器
 */
export class ContextManager {
    private data: Map<string, any> = new Map();

    set(key: string, value: any): void {
        this.data.set(key, value);
    }

    get(key: string): any {
        return this.data.get(key);
    }

    has(key: string): boolean {
        return this.data.has(key);
    }
}

/**
 * 文件内容接口
 */
export interface FileContent {
    name: string;
    content: string;
}

export interface ArtifactConfig {
    stage: string;
    name: string;
    type: 'document' | 'design' | 'code' | 'configuration' | 'package';
    format: 'json' | 'markdown' | 'pdf' | 'figma' | 'zip';
    description: string;
    files?: FileContent[];
    version: string;
}

export interface ArtifactMetadata {
    config: ArtifactConfig;
    path: string;
    size: number;
    checksum: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArtifactValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export class DeliveryArtifactsManager {
    private logger: Logger;
    private ctx: ContextManager;
    private artifacts: Map<string, ArtifactMetadata>;

    constructor(
        private storageDir: string = "./artifacts",
        private enableVersioning: boolean = true,
        private enableArchive: boolean = true,
    ) {
        this.logger = new Logger("DeliveryArtifactsManager");
        this.ctx = new ContextManager();
        this.artifacts = new Map();

        this.initializeStorage();
    }

    /**
     * 初始化存储目录
     */
    private initializeStorage(): void {
        if (!existsSync(this.storageDir)) {
            mkdirSync(this.storageDir, { recursive: true });
        }

        // 创建子目录
        const subdirs = [
            "requirements-proposal",
            "requirements-analysis",
            "product-design",
            "ui-design",
            "frontend-development",
            "backend-development",
            "architecture-guarantee",
            "testing-verification",
            "documentation-delivery",
            "security-review",
            "test-framework-setup",
            "release-operations",
        ];

        for (const subdir of subdirs) {
            const dirPath = `${this.storageDir}/${subdir}`;
            if (!existsSync(dirPath)) {
                mkdirSync(dirPath, { recursive: true });
            }
        }

        this.logger.info(`Storage initialized: ${this.storageDir}`);
    }

    /**
     * 注册交付物
     */
    async registerArtifact(
        config: ArtifactConfig,
        files: FileContent[] = [],
        version: string = "1.0"
    ): Promise<string> {
        this.logger.info(`Registering artifact: ${config.stage}/${config.name}`);

        // 创建阶段目录
        const stageDir = `${this.storageDir}/${config.stage}`;
        if (!existsSync(stageDir)) {
            mkdirSync(stageDir, { recursive: true });
        }

        // 生成artifact路径
        const artifactKey = `${config.stage}_${config.name}`;
        let artifactPath = `${stageDir}/${config.name}`;

        // 如果启用版本管理，添加版本号
        if (this.enableVersioning) {
            artifactPath = `${artifactPath}_v${version}`;
        }

        // 写入metadata
        const metadata: ArtifactMetadata = {
            config,
            path: artifactPath,
            size: 0,
            checksum: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // 根据类型处理文件
        const filesDir = `${artifactPath}_files`;
        if (files.length > 0) {
            mkdirSync(filesDir, { recursive: true });

            for (const file of files) {
                const filePath = `${filesDir}/${file.name}`;
                writeFileSync(filePath, file.content);
                metadata.size += Buffer.byteLength(file.content);
            }
        }

        // 保存metadata
        const metadataPath = `${artifactPath}_metadata.json`;
        writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        this.artifacts.set(artifactKey, metadata);
        this.ctx.set(`artifact_${artifactKey}`, metadata);

        this.logger.info(`Artifact registered: ${artifactPath}`);
        this.logger.skillComplete("Delivery Artifacts Manager", 1000);

        return artifactPath;
    }

    /**
     * 获取交付物
     */
    async getArtifact(stage: string, name: string): Promise<ArtifactMetadata | null> {
        const artifactKey = `${stage}_${name}`;
        const artifact = this.artifacts.get(artifactKey);

        if (!artifact) {
            return null;
        }

        // 检查文件是否存在
        if (!existsSync(artifact.path)) {
            this.logger.warn(`Artifact file not found: ${artifact.path}`);
            return null;
        }

        return artifact;
    }

    /**
     * 更新交付物
     */
    async updateArtifact(
        stage: string,
        name: string,
        update: Partial<ArtifactConfig>
    ): Promise<void> {
        const artifactKey = `${stage}_${name}`;
        const artifact = this.artifacts.get(artifactKey);

        if (!artifact) {
            throw new Error(`Artifact not found: ${stage}/${name}`);
        }

        this.logger.info(`Updating artifact: ${stage}/${name}`);

        // 合并配置
        const updatedConfig: ArtifactConfig = {
            ...artifact.config,
            ...update,
        };

        // 更新metadata
        const updatedMetadata: ArtifactMetadata = {
            ...artifact,
            config: updatedConfig,
            updatedAt: new Date(),
        };

        this.artifacts.set(artifactKey, updatedMetadata);
        this.ctx.set(`artifact_${artifactKey}`, updatedMetadata);

        // 更新metadata文件
        const metadataPath = `${artifact.path}_metadata.json`;
        writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));

        this.logger.info(`Artifact updated: ${artifact.path}`);
        this.logger.skillComplete("Delivery Artifacts Manager", 1000);
    }

    /**
     * 验证交付物
     */
    async validateArtifact(stage: string, name: string): Promise<ArtifactValidationResult> {
        const artifact = await this.getArtifact(stage, name);

        if (!artifact) {
            return {
                isValid: false,
                errors: [`Artifact not found: ${stage}/${name}`],
                warnings: [],
            };
        }

        const errors: string[] = [];
        const warnings: string[] = [];

        // 验证文件存在
        if (!existsSync(artifact.path)) {
            errors.push(`Artifact file not found: ${artifact.path}`);
        }

        // 验证metadata存在
        const metadataPath = `${artifact.path}_metadata.json`;
        if (!existsSync(metadataPath)) {
            errors.push(`Metadata file not found: ${metadataPath}`);
        }

        // 根据类型验证
        if (artifact.config.format === 'json' && artifact.path.endsWith('.json')) {
            try {
                JSON.parse(readFileSync(artifact.path, 'utf-8'));
            } catch (e) {
                errors.push(`Invalid JSON format: ${artifact.path}`);
            }
        }

        const result: ArtifactValidationResult = {
            isValid: errors.length === 0,
            errors,
            warnings,
        };

        this.logger.info(`Artifact validation result: ${result.isValid ? 'Valid' : 'Invalid'}`);

        return result;
    }

    /**
     * 列出交付物
     */
    async listArtifacts(stage?: string): Promise<ArtifactMetadata[]> {
        this.logger.info(`Listing artifacts${stage ? ` for stage: ${stage}` : ''}`);

        const artifacts: ArtifactMetadata[] = [];

        for (const artifact of this.artifacts.values()) {
            if (!stage || artifact.config.stage === stage) {
                artifacts.push(artifact);
            }
        }

        return artifacts;
    }

    /**
     * 归档交付物
     */
    async archiveArtifact(stage: string, name: string): Promise<void> {
        // 检查是否启用归档功能
        if (!this.enableArchive) {
            throw new Error(
                'Archiving is disabled. Enable it by setting enableArchive=true in the constructor.'
            );
        }

        const artifact = await this.getArtifact(stage, name);

        if (!artifact) {
            throw new Error(`Artifact not found: ${stage}/${name}`);
        }

        const archiveDir = `${this.storageDir}/_archive`;
        if (!existsSync(archiveDir)) {
            mkdirSync(archiveDir, { recursive: true });
        }

        const archivePath = `${archiveDir}/${new Date().toISOString().split('T')[0]}/${artifact.config.stage}/${name}`;
        mkdirSync(archivePath, { recursive: true });
        // 复制文件
        const sourceFiles = [
            artifact.path,
            `${artifact.path}_metadata.json`,
        ];

        for (const file of sourceFiles) {
            if (existsSync(file)) {
                const fileName = file.split('/').pop();
                const destPath = `${archivePath}/${fileName}`;
                copyFileSync(file, destPath);
            }
        }

        this.logger.info(`Artifact archived: ${archivePath}`);
    }

    /**
     * 获取所有交付物统计
     */
    getStatistics(): { total: number; byStage: { [stage: string]: number } } {
        const byStage: { [stage: string]: number } = {};
        let total = 0;

        for (const artifact of this.artifacts.values()) {
            const stage = artifact.config.stage;
            byStage[stage] = (byStage[stage] || 0) + 1;
            total++;
        }

        return { total, byStage };
    }
}
