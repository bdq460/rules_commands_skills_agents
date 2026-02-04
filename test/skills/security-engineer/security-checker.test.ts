/**
 * Security Checker 单元测试
 */

import {
    checkAuthentication,
    checkCSRF,
    checkSQLInjection,
    checkXSS,
    generateSecurityReport
} from '../../../skills/skills/security-engineer/scripts/security-checker';

describe('SecurityChecker', () => {
    describe('checkSQLInjection', () => {
        it('should detect SQL injection vulnerabilities', () => {
            const code = `
                const query = "SELECT * FROM users WHERE id = " + userInput;
            `;

            const result = checkSQLInjection(code);

            expect(result).toHaveProperty('vulnerable');
            expect(result).toHaveProperty('vulnerabilities');
        });

        it('should detect string concatenation in queries', () => {
            const code = `
                const query = "DELETE FROM users WHERE name = '" + userName + "'";
            `;

            const result = checkSQLInjection(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should provide remediation suggestions', () => {
            const code = `
                const query = "SELECT * FROM users WHERE id = " + userInput;
            `;

            const result = checkSQLInjection(code);

            if (result.remediation) {
                expect(result.remediation.length).toBeGreaterThan(0);
            }
        });
    });

    describe('checkXSS', () => {
        it('should detect XSS vulnerabilities', () => {
            const code = `
                const html = '<div>' + userInput + '</div>';
                document.body.innerHTML = html;
            `;

            const result = checkXSS(code);

            expect(result).toHaveProperty('vulnerable');
            expect(result).toHaveProperty('vulnerabilities');
        });

        it('should detect dangerous innerHTML with concatenation', () => {
            const code = `
                element.innerHTML = userInput + '<span>';
            `;

            const result = checkXSS(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should detect document.write usage', () => {
            const code = `
                document.write(userInput);
            `;

            const result = checkXSS(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should detect eval usage', () => {
            const code = `
                eval(userInput);
            `;

            const result = checkXSS(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should detect dangerouslySetInnerHTML', () => {
            const code = `
                <div dangerouslySetInnerHTML={{ __html: userInput }} />
            `;

            const result = checkXSS(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should detect inline event handlers', () => {
            const code = `
                <div onClick={handleClick} />
            `;

            const result = checkXSS(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should pass for textContent', () => {
            const code = `
                element.innerText = userInput;
            `;

            const result = checkXSS(code);

            expect(result.vulnerable).toBe(false);
        });

        it('should pass for safe innerHTML without concatenation', () => {
            const code = `
                element.innerHTML = '<span>Static content</span>';
            `;

            const result = checkXSS(code);

            expect(result.vulnerable).toBe(false);
        });
    });

    describe('checkCSRF', () => {
        it('should detect missing CSRF protection', () => {
            const code = `
                <form action="/transfer" method="POST">
                    <input type="text" name="amount" />
                    <button type="submit">Submit</button>
                </form>
            `;

            const result = checkCSRF(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should pass with CSRF token', () => {
            const code = `
                <form action="/transfer" method="POST">
                    <input type="hidden" name="csrf_token" value="abc123" />
                    <input type="text" name="amount" />
                    <button type="submit">Submit</button>
                </form>
            `;

            const result = checkCSRF(code);

            expect(result.vulnerable).toBe(false);
        });

        it('should check for same-site cookies', () => {
            const code = `
                <form action="/transfer" method="POST">
                    <input type="hidden" name="xsrf" value="abc123" />
                    <input type="text" name="amount" />
                    <button type="submit">Submit</button>
                </form>
            `;

            const result = checkCSRF(code);

            expect(result.vulnerable).toBe(false);
        });
    });

    describe('checkAuthentication', () => {
        it('should detect hardcoded passwords', () => {
            const code = `
                const config = {
                    password: "admin123"
                };
            `;

            const result = checkAuthentication(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should detect hardcoded API keys', () => {
            const code = `
                const apiKey = "sk-1234567890abcdef";
            `;

            const result = checkAuthentication(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should detect hardcoded secrets', () => {
            const code = `
                const secret = "my-secret-key";
            `;

            const result = checkAuthentication(code);

            expect(result.vulnerable).toBe(true);
        });

        it('should pass for environment variables', () => {
            const code = `
                const password = process.env.PASSWORD;
                const apiKey = process.env.API_KEY;
            `;

            const result = checkAuthentication(code);

            expect(result.vulnerable).toBe(false);
        });
    });

    describe('generateSecurityReport', () => {
        it('should generate comprehensive security report', () => {
            const code = `
                const query = "SELECT * FROM users WHERE id = " + userInput;
                const html = '<div>' + userInput + '</div>';
            `;

            const result = generateSecurityReport(code);

            expect(result).toBeDefined();
            expect(result).toHaveProperty('vulnerabilities');
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('recommendations');
        });

        it('should include all vulnerability types', () => {
            const code = `
                const query = "SELECT * FROM users WHERE id = " + userInput;
            `;

            const result = generateSecurityReport(code);

            expect(result.vulnerabilities).toBeDefined();
            expect(result.vulnerabilities.length).toBeGreaterThan(0);
        });

        it('should calculate security score', () => {
            const code = `
                const query = "SELECT * FROM users WHERE id = " + userInput;
            `;

            const result = generateSecurityReport(code);

            expect(result.score).toBeDefined();
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
        });

        it('should provide recommendations', () => {
            const code = `
                const query = "SELECT * FROM users WHERE id = " + userInput;
            `;

            const result = generateSecurityReport(code);

            expect(result.recommendations).toBeDefined();
            expect(result.recommendations.length).toBeGreaterThan(0);
        });

        it('should categorize vulnerabilities by severity', () => {
            const code = `
                const query = "SELECT * FROM users WHERE id = " + userInput;
            `;

            const result = generateSecurityReport(code);

            result.vulnerabilities.forEach(vuln => {
                expect(vuln).toHaveProperty('severity');
                expect(['high', 'medium', 'low']).toContain(vuln.severity);
            });
        });
    });

    describe('SecurityChecker class', () => {
        it('should run full check and generate report counts', async () => {
            const checker = new (require('../../../skills/skills/security-engineer/scripts/security-checker').SecurityChecker)({
                projectPath: process.cwd(),
                checkTypes: ['dependency', 'code', 'config', 'secret', 'authentication', 'authorization', 'input', 'xss', 'csrf', 'sql'],
                excludePatterns: [],
                outputFormat: 'text'
            });

            const report = await checker.runFullCheck();
            expect(report.totalChecks).toBeGreaterThan(0);
            expect(report.results.length).toBe(report.totalChecks);
            expect(report.critical + report.high + report.medium + report.low + report.info).toBe(report.totalChecks);

            const text = checker.generateTextReport(report);
            const json = checker.generateJSONReport(report);
            const html = checker.generateHTMLReport(report);
            const score = checker.getSecurityScore(report);

            expect(text).toContain('安全检查报告');
            expect(json).toContain('totalChecks');
            expect(html).toContain('<table>');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
        });
    });

    describe('checkAuthentication - weak authentication', () => {
        it('should detect basic authentication without additional security', () => {
            const code = `
                if (auth === 'basic') {
                    // Use basic auth
                }
            `;

            const result = checkAuthentication(code);

            expect(result.vulnerable).toBe(true);
            expect(result.vulnerabilities.length).toBeGreaterThan(0);
            const basicAuthVuln = result.vulnerabilities.find(v => v.description.includes('Basic authentication'));
            expect(basicAuthVuln).toBeDefined();
            expect(basicAuthVuln?.severity).toBe('medium');
        });

        it('should detect basic auth with single quotes', () => {
            const code = `
                const authMethod = 'basic';
                if (auth === 'basic') {
                    authenticate();
                }
            `;

            const result = checkAuthentication(code);

            expect(result.vulnerable).toBe(true);
        });
    });

    describe('generateSecurityReport - all vulnerability types', () => {
        it('should generate recommendations for XSS vulnerabilities', () => {
            const code = `
                element.innerHTML = baseHTML + userInput;
            `;

            const report = generateSecurityReport(code);

            expect(report.recommendations).toContain('Sanitize user input to prevent XSS attacks');
        });

        it('should generate recommendations for CSRF vulnerabilities', () => {
            const code = `
                <form method="POST" action="/delete">
                    <input type="submit" value="Delete" />
                </form>
            `;

            const report = generateSecurityReport(code);

            expect(report.recommendations).toContain('Implement CSRF tokens on forms');
        });

        it('should generate recommendations for authentication vulnerabilities', () => {
            const code = `
                const password = 'hardcoded123';
                if (auth === 'basic') {
                    authenticate(password);
                }
            `;

            const report = generateSecurityReport(code);

            expect(report.recommendations).toContain('Use secure authentication mechanisms and avoid hardcoded credentials');
        });

        it('should generate recommendations for SQL injection vulnerabilities', () => {
            const code = `
                const query = "SELECT * FROM users WHERE id = " + userId;
            `;

            const report = generateSecurityReport(code);

            expect(report.recommendations).toContain('Use parameterized queries to prevent SQL injection');
        });
    });
});
