/**
 * Architecture Validator 单元测试
 */

import { ArchitectureValidator, ValidationContext } from '../../../skills/skills/technical-architect/scripts/architecture-validator';

describe('ArchitectureValidator', () => {
    let validator: ArchitectureValidator;

    beforeEach(() => {
        validator = new ArchitectureValidator();
    });

    describe('validate', () => {
        it('should validate correct architecture', () => {
            const context: ValidationContext = {
                projectType: 'web-application',
                techStack: ['TypeScript', 'React'],
                architecturePattern: 'layered',
                documents: ['README.md'],
                codeFiles: ['src/domain', 'src/application']
            };

            expect(() => validator.validate(context)).not.toThrow();
        });

        it('should validate hexagonal architecture', () => {
            const context: ValidationContext = {
                projectType: 'web-application',
                techStack: ['TypeScript'],
                architecturePattern: 'hexagonal',
                documents: [],
                codeFiles: []
            };

            expect(() => validator.validate(context)).not.toThrow();
        });
    });

    describe('generateReport', () => {
        it('should generate architecture report', () => {
            const context: ValidationContext = {
                projectType: 'web-application',
                techStack: ['TypeScript', 'Node.js'],
                architecturePattern: 'layered',
                documents: ['ARCHITECTURE.md'],
                codeFiles: ['src/presentation', 'src/domain']
            };

            const report = validator.generateReport(context);

            expect(report).toBeDefined();
            expect(report).toContain('# 架构验证报告');
            expect(report).toContain('## 项目信息');
        });

        it('should include project information', () => {
            const context: ValidationContext = {
                projectType: 'web-application',
                techStack: ['TypeScript', 'React', 'Node.js'],
                architecturePattern: 'hexagonal',
                documents: [],
                codeFiles: []
            };

            const report = validator.generateReport(context);

            expect(report).toContain('web-application');
            expect(report).toContain('TypeScript');
            expect(report).toContain('React');
        });
    });
});
