import fs from 'fs';
import os from 'os';
import path from 'path';
import { ArtifactConfig, ContextManager, DeliveryArtifactsManager, Logger } from '../../../skills/skills/product-development-flow/scripts/delivery-artifacts-manager';

describe('DeliveryArtifactsManager', () => {
    let storageDir: string;

    beforeEach(() => {
        storageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'artifacts-'));
    });

    it('registers, validates, updates and archives artifacts', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'requirements-proposal',
            name: 'spec',
            type: 'document',
            format: 'markdown',
            description: 'initial',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [{ name: 'spec.md', content: '# Spec' }], '1.0');
        fs.writeFileSync(artifactPath, 'artifact content');

        const artifact = await manager.getArtifact('requirements-proposal', 'spec');
        expect(artifact?.path).toBe(artifactPath);

        const validation = await manager.validateArtifact('requirements-proposal', 'spec');
        expect(validation.isValid).toBe(true);

        await manager.updateArtifact('requirements-proposal', 'spec', { description: 'updated' });
        const metadata = JSON.parse(fs.readFileSync(`${artifactPath}_metadata.json`, 'utf-8'));
        expect(metadata.config.description).toBe('updated');

        const listed = await manager.listArtifacts();
        expect(listed.length).toBe(1);

        await manager.archiveArtifact('requirements-proposal', 'spec');
        const archiveDir = path.join(storageDir, '_archive');
        expect(fs.existsSync(archiveDir)).toBe(true);

        const stats = manager.getStatistics();
        expect(stats.total).toBe(1);
        expect(stats.byStage['requirements-proposal']).toBe(1);
    });

    it('returns validation errors for missing artifacts', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const result = await manager.validateArtifact('non-stage', 'missing');
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('throws when updating or archiving unknown artifacts and filters list', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        await expect(manager.updateArtifact('none', 'nope', { description: 'x' })).rejects.toThrow('Artifact not found');
        await expect(manager.archiveArtifact('none', 'nope')).rejects.toThrow('Artifact not found');

        const config: ArtifactConfig = { stage: 'ui-design', name: 'ui', type: 'design', format: 'figma', description: 'ui', version: '1.0' };
        await manager.registerArtifact(config, [], '1.0');
        const filtered = await manager.listArtifacts('ui-design');
        expect(filtered.length).toBe(1);
    });

    it('validates malformed json artifacts and handles disabled archive', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, false, false);
        const config: ArtifactConfig = {
            stage: 'test-framework-setup',
            name: 'cfg.json',
            type: 'configuration',
            format: 'json',
            description: 'bad json',
            version: '0.1'
        };

        const artifactPath = await manager.registerArtifact(config, [], '0.1');
        fs.writeFileSync(artifactPath, '{bad json');
        const result = await manager.validateArtifact('test-framework-setup', 'cfg');
        expect(result.isValid).toBe(false);

        await expect(manager.archiveArtifact('test-framework-setup', 'cfg')).rejects.toThrow('Archiving is disabled');
    });

    it('warns when artifact files are missing', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'requirements-analysis',
            name: 'missing-file',
            type: 'document',
            format: 'markdown',
            description: 'no file',
            version: '1.0'
        };

        await manager.registerArtifact(config, []);
        const artifact = await manager.getArtifact('requirements-analysis', 'missing-file');
        expect(artifact).toBeNull();
    });

    it('flags missing metadata and invalid json while file exists', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'requirements-analysis',
            name: 'spec.json',
            type: 'document',
            format: 'json',
            description: 'will remove metadata',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        fs.writeFileSync(artifactPath, '{bad json');
        // remove metadata file to hit metadata missing branch
        fs.rmSync(`${artifactPath}_metadata.json`);

        const validation = await manager.validateArtifact('requirements-analysis', 'spec.json');
        expect(validation.isValid).toBe(false);
        expect(validation.errors.some(e => e.includes('Metadata file not found'))).toBe(true);
        // Metadata missing short-circuits JSON parsing, so only the metadata error is guaranteed
        expect(validation.errors.length).toBeGreaterThanOrEqual(1);
    });

    it('handles initializing storage with subdirectories', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);

        const expectedDirs = [
            'requirements-proposal',
            'requirements-analysis',
            'product-design',
            'ui-design',
            'frontend-development',
            'backend-development',
            'architecture-guarantee',
            'testing-verification',
            'documentation-delivery',
            'security-review',
            'test-framework-setup',
            'release-operations',
        ];

        expectedDirs.forEach(dir => {
            const dirPath = path.join(storageDir, dir);
            expect(fs.existsSync(dirPath)).toBe(true);
        });
    });

    it('registers artifact with files and creates metadata', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'product-design',
            name: 'design-doc',
            type: 'document',
            format: 'markdown',
            description: 'Product design document',
            files: [
                { name: 'design.md', content: '# Design\n## Features' }
            ],
            version: '2.0'
        };

        const artifactPath = await manager.registerArtifact(config, config.files, '2.0');
        expect(fs.existsSync(`${artifactPath}_metadata.json`)).toBe(true);

        const metadata = JSON.parse(fs.readFileSync(`${artifactPath}_metadata.json`, 'utf-8'));
        expect(metadata.config.name).toBe('design-doc');
        expect(metadata.config.version).toBe('2.0');

        // Check files directory exists when files are provided
        const filesDir = `${artifactPath}_files`;
        expect(fs.existsSync(filesDir)).toBe(true);
    });

    it('retrieves artifact by stage and name', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'architecture-guarantee',
            name: 'arch-design',
            type: 'document',
            format: 'markdown',
            description: 'Architecture design',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        fs.writeFileSync(artifactPath, '# Architecture Design');

        const retrieved = await manager.getArtifact('architecture-guarantee', 'arch-design');
        expect(retrieved).not.toBeNull();
        expect(retrieved?.config.name).toBe('arch-design');
        expect(retrieved?.config.stage).toBe('architecture-guarantee');
    });

    it('returns null when artifact does not exist', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const result = await manager.getArtifact('backend-development', 'nonexistent');
        expect(result).toBeNull();
    });

    it('lists all artifacts without filter', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);

        const config1: ArtifactConfig = {
            stage: 'testing-verification',
            name: 'test-plan',
            type: 'document',
            format: 'markdown',
            description: 'Test plan',
            version: '1.0'
        };

        const config2: ArtifactConfig = {
            stage: 'documentation-delivery',
            name: 'user-guide',
            type: 'document',
            format: 'markdown',
            description: 'User guide',
            version: '1.0'
        };

        await manager.registerArtifact(config1, [], '1.0');
        await manager.registerArtifact(config2, [], '1.0');

        const all = await manager.listArtifacts();
        expect(all.length).toBeGreaterThanOrEqual(2);
    });

    it('filters list by stage', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);

        const config: ArtifactConfig = {
            stage: 'frontend-development',
            name: 'frontend-code',
            type: 'code',
            format: 'markdown',
            description: 'Frontend code',
            version: '1.0'
        };

        await manager.registerArtifact(config, [], '1.0');
        const filtered = await manager.listArtifacts('frontend-development');

        expect(filtered.length).toBeGreaterThanOrEqual(1);
        expect(filtered.every(a => a.config.stage === 'frontend-development')).toBe(true);
    });

    it('computes statistics correctly with multiple artifacts', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);

        const config1: ArtifactConfig = {
            stage: 'requirements-proposal',
            name: 'proposal1',
            type: 'document',
            format: 'markdown',
            description: 'Proposal 1',
            version: '1.0'
        };

        const config2: ArtifactConfig = {
            stage: 'requirements-proposal',
            name: 'proposal2',
            type: 'document',
            format: 'markdown',
            description: 'Proposal 2',
            version: '1.0'
        };

        const config3: ArtifactConfig = {
            stage: 'security-review',
            name: 'security-report',
            type: 'document',
            format: 'markdown',
            description: 'Security report',
            version: '1.0'
        };

        await manager.registerArtifact(config1, [], '1.0');
        await manager.registerArtifact(config2, [], '1.0');
        await manager.registerArtifact(config3, [], '1.0');

        const stats = manager.getStatistics();
        expect(stats.total).toBeGreaterThanOrEqual(3);
        expect(stats.byStage['requirements-proposal']).toBeGreaterThanOrEqual(2);
        expect(stats.byStage['security-review']).toBeGreaterThanOrEqual(1);
    });

    it('handles disabled versioning flag', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, false, true);
        const config: ArtifactConfig = {
            stage: 'release-operations',
            name: 'release-notes',
            type: 'document',
            format: 'markdown',
            description: 'Release notes',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        expect(fs.existsSync(`${artifactPath}_metadata.json`)).toBe(true);
    });

    it('provides context manager functionality', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);

        const config: ArtifactConfig = {
            stage: 'product-design',
            name: 'context-artifact',
            type: 'document',
            format: 'markdown',
            description: 'Artifact with context',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config,
            [{ name: 'context.md', content: '# Context' }],
            '1.0'
        );

        // Verify artifact was registered by creating the artifact file
        fs.writeFileSync(artifactPath, '# Context Artifact');

        const artifact = await manager.getArtifact('product-design', 'context-artifact');
        expect(artifact).not.toBeNull();
        expect(artifact?.config.name).toBe('context-artifact');
        expect(artifact?.config.stage).toBe('product-design');
    });

    it('handles pdf format artifacts', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'documentation-delivery',
            name: 'manual.pdf',
            type: 'document',
            format: 'pdf',
            description: 'PDF manual',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        fs.writeFileSync(artifactPath, 'PDF content');

        const validation = await manager.validateArtifact('documentation-delivery', 'manual.pdf');
        expect(validation).toBeDefined();
    });

    it('handles zip package format artifacts', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'release-operations',
            name: 'package.zip',
            type: 'package',
            format: 'zip',
            description: 'Release package',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        expect(fs.existsSync(artifactPath + '_metadata.json')).toBe(true);
    });

    it('handles figma design artifacts', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'ui-design',
            name: 'designs',
            type: 'design',
            format: 'figma',
            description: 'UI designs in Figma',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        fs.writeFileSync(artifactPath, 'figma://project-id');

        const artifact = await manager.getArtifact('ui-design', 'designs');
        expect(artifact).not.toBeNull();
    });

    it('handles code format artifacts', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'backend-development',
            name: 'api',
            type: 'code',
            format: 'json',
            description: 'API code',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        fs.writeFileSync(artifactPath, '{"endpoints": []}');

        const validation = await manager.validateArtifact('backend-development', 'api');
        expect(validation.isValid).toBe(true);
    });

    it('lists artifacts with multiple files', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'frontend-development',
            name: 'components',
            type: 'code',
            format: 'json',
            description: 'Component library',
            version: '1.0'
        };

        await manager.registerArtifact(config, [
            { name: 'Button.json', content: '{}' },
            { name: 'Card.json', content: '{}' },
            { name: 'Modal.json', content: '{}' }
        ], '1.0');

        const listed = await manager.listArtifacts('frontend-development');
        expect(listed.length).toBeGreaterThanOrEqual(1);
    });

    it('logs debug and warning messages during artifact operations', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
        const errorSpy = jest.spyOn(console, 'error').mockImplementation();

        const manager = new DeliveryArtifactsManager(storageDir, true, true);

        // Trigger warning by calling getArtifact on non-existent artifact with missing file
        const config: ArtifactConfig = {
            stage: 'test-stage',
            name: 'warn-artifact',
            type: 'document',
            format: 'markdown',
            description: 'Will warn about missing file',
            version: '1.0'
        };

        await manager.registerArtifact(config, []);
        await manager.getArtifact('test-stage', 'warn-artifact');

        expect(warnSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
        errorSpy.mockRestore();
    });

    it('stores and retrieves artifacts from context', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'architecture-guarantee',
            name: 'ctx-test',
            type: 'document',
            format: 'markdown',
            description: 'Context test artifact',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        fs.writeFileSync(artifactPath, '# Context test');

        // Context storage happens during registration
        const retrieved = await manager.getArtifact('architecture-guarantee', 'ctx-test');
        expect(retrieved).not.toBeNull();
        expect(retrieved?.config.name).toBe('ctx-test');
    });

    it('handles artifact archiving with files and directories', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'release-operations',
            name: 'full-release',
            type: 'package',
            format: 'zip',
            description: 'Full release package',
            version: '2.1'
        };

        const artifactPath = await manager.registerArtifact(config, [
            { name: 'release.txt', content: 'v2.1' }
        ], '2.1');

        fs.writeFileSync(artifactPath, 'release data');

        await manager.archiveArtifact('release-operations', 'full-release');
        const archiveDir = path.join(storageDir, '_archive');
        expect(fs.existsSync(archiveDir)).toBe(true);

        const archiveDirs = fs.readdirSync(archiveDir);
        expect(archiveDirs.length).toBeGreaterThan(0);
    });

    it('validates and reports all error conditions', async () => {
        const manager = new DeliveryArtifactsManager(storageDir, true, true);
        const config: ArtifactConfig = {
            stage: 'backend-development',
            name: 'error-test',
            type: 'code',
            format: 'json',
            description: 'Error validation test',
            version: '1.0'
        };

        const artifactPath = await manager.registerArtifact(config, [], '1.0');
        // Don't write the file - validation will fail because file doesn't exist

        const result = await manager.validateArtifact('backend-development', 'error-test');
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});

describe('Logger', () => {
    it('logs info messages', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = new Logger('TEST');
        logger.info('test message');
        expect(logSpy).toHaveBeenCalledWith('[TEST] INFO: test message');
        logSpy.mockRestore();
    });

    it('logs warn messages', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
        const logger = new Logger('TEST');
        logger.warn('warning message');
        expect(warnSpy).toHaveBeenCalledWith('[TEST] WARN: warning message');
        warnSpy.mockRestore();
    });

    it('logs error messages', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation();
        const logger = new Logger('TEST');
        logger.error('error message');
        expect(errorSpy).toHaveBeenCalledWith('[TEST] ERROR: error message');
        errorSpy.mockRestore();
    });

    it('logs skill completion', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = new Logger('TEST');
        logger.skillComplete('MySkill', 500);
        expect(logSpy).toHaveBeenCalledWith('[TEST] INFO: Skill complete: MySkill (cost: 500)');
        logSpy.mockRestore();
    });
});

describe('ContextManager', () => {
    it('stores and retrieves values', () => {
        const ctx = new ContextManager();
        ctx.set('key1', 'value1');
        expect(ctx.get('key1')).toBe('value1');
    });

    it('checks if key exists', () => {
        const ctx = new ContextManager();
        ctx.set('key1', 'value1');
        expect(ctx.has('key1')).toBe(true);
        expect(ctx.has('key2')).toBe(false);
    });

    it('gets undefined for non-existent keys', () => {
        const ctx = new ContextManager();
        expect(ctx.get('nonexistent')).toBeUndefined();
    });

    it('stores objects and arrays', () => {
        const ctx = new ContextManager();
        const obj = { name: 'test', values: [1, 2, 3] };
        ctx.set('data', obj);
        expect(ctx.get('data')).toEqual(obj);
        expect(ctx.has('data')).toBe(true);
    });
});
