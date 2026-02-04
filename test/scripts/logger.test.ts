import fs from 'fs';
import os from 'os';
import path from 'path';
import { Logger, LogLevel } from '../../skills/scripts/utils/logger';

describe('Logger', () => {
    let tmpDir: string;
    let originalFetch: any;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-test-'));
        jest.restoreAllMocks();
        originalFetch = (global as any).fetch;
    });

    afterEach(() => {
        (global as any).fetch = originalFetch;
    });

    it('respects log level for console output', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
        const infoSpy = jest.spyOn(console, 'info').mockImplementation();

        const logger = new Logger('test', { level: LogLevel.WARN, console: true, remote: false, file: false });
        logger.info('should be skipped');
        logger.warn('should be logged');

        expect(infoSpy).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('writes logs to file in json format', async () => {
        const logFile = path.join(tmpDir, 'app.log');
        const logger = new Logger('file', { level: LogLevel.DEBUG, format: 'json', console: false, file: true, filePath: logFile, remote: false });

        logger.error('boom', { detail: 'test' });
        // give async append a moment to flush
        await new Promise((resolve) => setTimeout(resolve, 30));

        const content = fs.readFileSync(logFile, 'utf-8');
        expect(content).toContain('"message":"boom"');
        expect(JSON.parse(content.trim()).level).toBe(LogLevel.ERROR);
    });

    it('creates child logger with inherited config', () => {
        const infoSpy = jest.spyOn(console, 'info').mockImplementation();
        const base = new Logger('parent', { console: true, remote: false });
        const child = base.child('child');

        child.info('hello');
        expect(infoSpy).toHaveBeenCalled();
        const logged = infoSpy.mock.calls[0][0] as string;
        expect(logged.includes('parent/child')).toBe(true);
    });

    it('allows runtime config updates', () => {
        const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
        const logger = new Logger('runtime', { level: LogLevel.INFO, console: true, remote: false });
        logger.updateConfig({ level: LogLevel.DEBUG });
        logger.debug('now visible');
        expect(debugSpy).toHaveBeenCalled();
    });

    it('formats text logs with metadata when console enabled', () => {
        const infoSpy = jest.spyOn(console, 'info').mockImplementation();
        const logger = new Logger('text', { format: 'text', console: true, remote: false });
        logger.info('hello', { foo: 'bar' });
        const firstCall = infoSpy.mock.calls[0][0] as string;
        expect(firstCall).toContain('hello');
        expect(firstCall).toContain('foo');
    });

    it('logs warnings and errors when level allows', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
        const errorSpy = jest.spyOn(console, 'error').mockImplementation();
        const logger = new Logger('levels', { level: LogLevel.DEBUG, console: true, remote: false });
        logger.warn('warning');
        logger.error('failure');
        expect(warnSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
    });

    it('emits debug logs at debug level', () => {
        const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
        const logger = new Logger('dbg', { level: LogLevel.DEBUG, console: true, remote: false });
        logger.debug('trace');
        expect(debugSpy).toHaveBeenCalled();
    });

    it('sends remote logs when fetch is available', async () => {
        const fetchMock = jest.fn().mockResolvedValue({ ok: true });
        (global as any).fetch = fetchMock;

        const logger = new Logger('remote', { remote: true, remoteUrl: 'http://example.com', console: false });
        logger.info('to-remote');

        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(fetchMock).toHaveBeenCalled();
    });

    it('falls back when fetch is missing and reports file errors', async () => {
        (global as any).fetch = undefined;
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
        const errSpy = jest.spyOn(console, 'error').mockImplementation();

        const logger = new Logger('mixed', {
            remote: true,
            remoteUrl: 'http://example.com',
            console: false,
            file: true,
            filePath: path.join('/invalid-path', 'no', 'err.log'),
        });

        logger.warn('check');

        await new Promise((resolve) => setTimeout(resolve, 25));
        expect(warnSpy).toHaveBeenCalled();
        expect(errSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
        errSpy.mockRestore();
    });
});
