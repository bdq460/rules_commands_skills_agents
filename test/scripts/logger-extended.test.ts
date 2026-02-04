import { createLogger, Logger, LogLevel } from '../../skills/scripts/utils/logger';

describe('Logger Extended Coverage', () => {
    describe('skillStart/skillComplete/skillError', () => {
        it('should log skill start event', () => {
            const logger = new Logger('test');
            const consoleSpy = jest.spyOn(console, 'info').mockImplementation();

            logger.skillStart('mySkill', { customData: 'value' });

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Skill execution started')
            );
            consoleSpy.mockRestore();
        });

        it('should log skill completion', () => {
            const logger = new Logger('test');
            const consoleSpy = jest.spyOn(console, 'info').mockImplementation();

            logger.skillComplete('mySkill', 1500, { status: 'success' });

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Skill execution completed')
            );
            consoleSpy.mockRestore();
        });

        it('should log skill error', () => {
            const logger = new Logger('test');
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const error = new Error('Test error');

            logger.skillError('mySkill', error, { context: 'testing' });

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Skill execution failed')
            );
            consoleSpy.mockRestore();
        });
    });

    describe('stageStart/stageComplete', () => {
        it('should log stage start event', () => {
            const logger = new Logger('test');
            const consoleSpy = jest.spyOn(console, 'info').mockImplementation();

            logger.stageStart('Phase 1', { order: 1 });

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Stage started')
            );
            consoleSpy.mockRestore();
        });

        it('should log stage completion', () => {
            const logger = new Logger('test');
            const consoleSpy = jest.spyOn(console, 'info').mockImplementation();

            logger.stageComplete('Phase 1', 5000, { result: 'passed' });

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Stage completed')
            );
            consoleSpy.mockRestore();
        });
    });

    describe('child logger', () => {
        it('should create child logger with combined context', () => {
            const logger = new Logger('parent');
            const child = logger.child('child');

            const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
            child.info('test message');

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('parent/child')
            );
            consoleSpy.mockRestore();
        });

        it('should inherit configuration from parent', () => {
            const logger = new Logger('parent', { level: LogLevel.WARN });
            const child = logger.child('child');

            const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
            child.info('should not log'); // INFO level < WARN

            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('should log debug in child logger', () => {
            const logger = new Logger('parent', { level: LogLevel.DEBUG });
            const child = logger.child('debugchild');

            const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
            child.debug('debug message');

            expect(debugSpy).toHaveBeenCalled();
            debugSpy.mockRestore();
        });
    });

    describe('updateConfig', () => {
        it('should update logger configuration', () => {
            const logger = new Logger('test', { level: LogLevel.ERROR });
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

            // Before update: WARN should not log
            logger.warn('before');
            expect(warnSpy).not.toHaveBeenCalled();

            // Update config
            logger.updateConfig({ level: LogLevel.WARN });

            // After update: WARN should log
            logger.warn('after');
            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining('after')
            );

            warnSpy.mockRestore();
        });
    });

    describe('createLogger factory', () => {
        it('should create logger with factory function', () => {
            const logger = createLogger('factory-context', { level: LogLevel.DEBUG });

            const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
            logger.debug('factory debug');

            expect(debugSpy).toHaveBeenCalled();
            debugSpy.mockRestore();
        });

        it('should support custom format', () => {
            const logger = createLogger('json-logger', { format: 'json' });
            const infoSpy = jest.spyOn(console, 'info').mockImplementation();

            logger.info('json message');

            const callArg = infoSpy.mock.calls[0][0];
            expect(() => JSON.parse(callArg)).not.toThrow();

            infoSpy.mockRestore();
        });
    });

    describe('format variations', () => {
        it('should format log entry as text', () => {
            const logger = new Logger('formatter', { format: 'text', level: LogLevel.INFO });
            const infoSpy = jest.spyOn(console, 'info').mockImplementation();

            logger.info('text format', { key: 'value' });

            const callArg = infoSpy.mock.calls[0][0];
            expect(callArg).toContain('formatter');
            expect(callArg).toContain('text format');

            infoSpy.mockRestore();
        });

        it('should format log entry as json', () => {
            const logger = new Logger('json-formatter', { format: 'json', level: LogLevel.INFO });
            const infoSpy = jest.spyOn(console, 'info').mockImplementation();

            logger.info('json format', { data: 'test' });

            const callArg = infoSpy.mock.calls[0][0];
            const parsed = JSON.parse(callArg);

            expect(parsed).toHaveProperty('message', 'json format');
            expect(parsed).toHaveProperty('context', 'json-formatter');
            expect(parsed).toHaveProperty('level');

            infoSpy.mockRestore();
        });
    });

    describe('log level filtering', () => {
        it('should not log below minimum level', () => {
            const logger = new Logger('filter', { level: LogLevel.WARN });
            const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
            const infoSpy = jest.spyOn(console, 'info').mockImplementation();

            logger.debug('debug message');
            logger.info('info message');

            expect(debugSpy).not.toHaveBeenCalled();
            expect(infoSpy).not.toHaveBeenCalled();

            debugSpy.mockRestore();
            infoSpy.mockRestore();
        });

        it('should log at and above minimum level', () => {
            const logger = new Logger('filter', { level: LogLevel.WARN });
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
            const errorSpy = jest.spyOn(console, 'error').mockImplementation();

            logger.warn('warn message');
            logger.error('error message');

            expect(warnSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalled();

            warnSpy.mockRestore();
            errorSpy.mockRestore();
        });
    });
});
