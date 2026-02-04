/**
 * Design Spec Exporter 单元测试
 */

import {
    exportDesignSpec,
    exportToFigma,
    exportToSketch,
    generateStyleGuide
} from '../../../skills/skills/ui-expert/scripts/design-spec-exporter';

describe('DesignSpecExporter', () => {
    describe('exportDesignSpec', () => {
        it('should export design specification', () => {
            const result = exportDesignSpec(undefined, 'css');

            expect(result).toBeDefined();
            expect(result).toHaveProperty('content');
            expect(result).toHaveProperty('format');
            expect(result.format).toBe('css');
        });

        it('should export to CSS format', () => {
            const result = exportDesignSpec(undefined, 'css');

            expect(result.format).toBe('css');
            expect(result.content).toContain(':root');
            expect(result.content).toContain('--color-primary');
        });

        it('should export to Markdown format', () => {
            const result = exportDesignSpec(undefined, 'markdown');

            expect(result.format).toBe('markdown');
            expect(result.content).toContain('# 设计规范文档');
            expect(result.content).toContain('## 颜色');
        });

        it('should include all design sections in markdown', () => {
            const result = exportDesignSpec(undefined, 'markdown');

            expect(result.content).toContain('## 颜色');
            expect(result.content).toContain('## 排版');
            expect(result.content).toContain('## 间距');
            expect(result.content).toContain('## 圆角');
            expect(result.content).toContain('## 阴影');
        });

        it('should support multiple formats', () => {
            const formats = ['css', 'sass', 'js', 'ts', 'json', 'tailwind', 'markdown'];

            formats.forEach(format => {
                const result = exportDesignSpec(undefined, format as any);
                expect(result).toBeDefined();
                expect(result.format).toBe(format);
            });
        });
    });

    describe('generateStyleGuide', () => {
        it('should generate style guide', () => {
            const result = generateStyleGuide();

            expect(result).toBeDefined();
            expect(result).toContain('# 设计规范文档');
        });

        it('should include color palette', () => {
            const result = generateStyleGuide();

            expect(result).toContain('## 颜色');
            expect(result).toContain('primary');
            expect(result).toContain('secondary');
        });

        it('should include typography scale', () => {
            const result = generateStyleGuide();

            expect(result).toContain('## 排版');
            expect(result).toContain('xs');
            expect(result).toContain('sm');
            expect(result).toContain('base');
            expect(result).toContain('lg');
        });

        it('should include spacing scale', () => {
            const result = generateStyleGuide();

            expect(result).toContain('## 间距');
        });
    });

    describe('exportToFigma', () => {
        it('should export design to Figma format', () => {
            const result = exportToFigma();

            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.message).toContain('Figma');
        });

        it('should include success message', () => {
            const result = exportToFigma();

            expect(result.message).toBeDefined();
            expect(typeof result.message).toBe('string');
        });

        it('should return url property', () => {
            const result = exportToFigma();

            expect(result.url).toBeDefined();
            expect(typeof result.url).toBe('string');
        });
    });

    describe('exportToSketch', () => {
        it('should export design to Sketch format', () => {
            const result = exportToSketch();

            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.message).toContain('Sketch');
        });

        it('should include success message', () => {
            const result = exportToSketch();

            expect(result.message).toBeDefined();
            expect(typeof result.message).toBe('string');
        });

        it('should return filePath property', () => {
            const result = exportToSketch();

            expect(result.filePath).toBeDefined();
            expect(typeof result.filePath).toBe('string');
        });
    });
});
