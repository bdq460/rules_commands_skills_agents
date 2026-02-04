/**
 * .codebuddy Scripts 测试
 *
 * 测试scripts目录下所有工具脚本的功能和文档完整性
 */

import { ContextManager } from "../../skills/scripts/utils/context-manager";
import { FileManager } from "../../skills/scripts/utils/file-manager";
import { Logger } from "../../skills/scripts/utils/logger";

describe('.codebuddy Scripts', () => {
    describe('Logger', () => {
        let logger: Logger;

        beforeEach(() => {
            logger = new Logger("Test", {
                console: false,
                file: false
            });
        });

        it('should create logger instance', () => {
            expect(logger).toBeDefined();
            expect(logger).toBeInstanceOf(Logger);
        });

        it('should log info messages', () => {
            expect(() => {
                logger.info("Test info message");
            }).not.toThrow();
        });

        it('should log error messages', () => {
            expect(() => {
                logger.error("Test error message");
            }).not.toThrow();
        });

        it('should support skillComplete method', () => {
            expect(() => {
                logger.skillComplete("TestSkill", 1000);
            }).not.toThrow();
        });
    });

    describe('FileManager', () => {
        let fileManager: FileManager;

        beforeEach(() => {
            fileManager = new FileManager();
        });

        it('should create file manager instance', () => {
            expect(fileManager).toBeDefined();
            expect(fileManager).toBeInstanceOf(FileManager);
        });

        it('should have createDirectory method', () => {
            expect(typeof fileManager.createDirectory).toBe('function');
        });

        it('should have writeFile method', () => {
            expect(typeof fileManager.writeFile).toBe('function');
        });
    });

    describe('ContextManager', () => {
        let contextManager: ContextManager;

        beforeEach(() => {
            contextManager = new ContextManager();
        });

        it('should create context manager instance', () => {
            expect(contextManager).toBeDefined();
            expect(contextManager).toBeInstanceOf(ContextManager);
        });

        it('should set and get values', () => {
            contextManager.set("testKey", "testValue");
            expect(contextManager.get("testKey")).toBe("testValue");
        });

        it('should store and retrieve complex objects', () => {
            const complexValue = { nested: { data: "value" } };
            contextManager.set("complexKey", complexValue);
            expect(contextManager.get("complexKey")).toEqual(complexValue);
        });

        it('should overwrite existing values', () => {
            contextManager.set("testKey", "value1");
            expect(contextManager.get("testKey")).toBe("value1");
            contextManager.set("testKey", "value2");
            expect(contextManager.get("testKey")).toBe("value2");
        });

        it('should return undefined for non-existent keys', () => {
            expect(contextManager.get("nonExistentKey")).toBeUndefined();
        });
    });
});
