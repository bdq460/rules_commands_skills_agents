/**
 * Security Engineer 测试适配器
 *
 * 将安全工程师技能的函数包装为测试期望的接口
 */

// ============================================================================
// 类型定义 (测试期望的接口)
// ============================================================================

export interface SecurityCheckResult {
    vulnerable: boolean;
    vulnerabilities?: Array<{
        line: number;
        issue: string;
        severity: 'high' | 'medium' | 'low';
    }>;
    remediation?: string[];
}

export interface SecurityReport {
    summary: {
        totalVulnerabilities: number;
        criticalVulnerabilities: number;
        highVulnerabilities: number;
        mediumVulnerabilities: number;
        lowVulnerabilities: number;
    };
    vulnerabilities: Array<{
        type: string;
        severity: 'high' | 'medium' | 'low';
        line: number;
        description: string;
        code: string;
    }>;
    score: number;
    recommendations: string[];
}

// ============================================================================
// 适配器函数
// ============================================================================

/**
 * 检查 SQL 注入漏洞
 * 适配器：实现 SQL 注入检测逻辑
 */
export function checkSQLInjection(code: string): SecurityCheckResult {
    const vulnerabilities: Array<{ line: number; issue: string; severity: 'high' | 'medium' | 'low' }> = [];
    const lines = code.split('\n');

    // 检测字符串拼接
    const patterns = [
        /" \+ .* \+"/g,
        /' \+ .* \+'/g,
        /` \$\{.*} `/g,
        /" \+ /g,
        /' \+ /g,
    ];

    lines.forEach((line, index) => {
        patterns.forEach(pattern => {
            const match = line.match(pattern);
            if (match && line.toLowerCase().includes('select') || line.toLowerCase().includes('insert') ||
                line.toLowerCase().includes('update') || line.toLowerCase().includes('delete')) {
                vulnerabilities.push({
                    line: index + 1,
                    issue: 'Potential SQL injection via string concatenation',
                    severity: 'high',
                });
            }
        });
    });

    // 检测危险的拼接模式
    const dangerousPatterns = [
        /SELECT.*FROM.*WHERE.*\+/i,
        /INSERT INTO.*VALUES.*\+/i,
        /UPDATE.*SET.*\+/i,
        /DELETE FROM.*WHERE.*\+/i,
    ];

    lines.forEach((line, index) => {
        dangerousPatterns.forEach(pattern => {
            if (pattern.test(line)) {
                vulnerabilities.push({
                    line: index + 1,
                    issue: 'SQL query built with user input',
                    severity: 'high',
                });
            }
        });
    });

    const isVulnerable = vulnerabilities.length > 0;
    const remediation = isVulnerable ? [
        'Use parameterized queries or prepared statements',
        'Validate and sanitize all user input',
        'Use ORM frameworks that provide built-in protection',
        'Apply least privilege principle to database accounts',
    ] : [];

    return { vulnerable: isVulnerable, vulnerabilities, remediation };
}

/**
 * 检查 XSS 漏洞
 * 适配器：实现 XSS 检测逻辑
 */
export function checkXSS(code: string): SecurityCheckResult {
    const vulnerabilities: Array<{ line: number; issue: string; severity: 'high' | 'medium' | 'low' }> = [];
    const lines = code.split('\n');

    // 检测危险的 innerHTML 使用
    lines.forEach((line, index) => {
        if (/\binnerHTML\s*=/.test(line) && !/innerHTML\s*=\s*["']/.test(line)) {
            if (/\binnerHTML\s*=\s*\w+/.test(line) || /\binnerHTML\s*=\s*\+/.test(line)) {
                vulnerabilities.push({
                    line: index + 1,
                    issue: 'Potential XSS via innerHTML with unsanitized input',
                    severity: 'high',
                });
            }
        }
    });

    // 检测危险的方法调用
    const dangerousMethods = [
        /document\.write\s*\(/,
        /document\.writeln\s*\(/,
        /eval\s*\(/,
        /setTimeout\s*\(["'].*["']\s*\)/,
        /setInterval\s*\(["'].*["']\s*\)/,
    ];

    lines.forEach((line, index) => {
        dangerousMethods.forEach(pattern => {
            if (pattern.test(line) && /[+]/.test(line)) {
                vulnerabilities.push({
                    line: index + 1,
                    issue: 'Potential XSS via dangerous function call',
                    severity: 'high',
                });
            }
        });
    });

    // 检测是否使用了消毒函数
    const hasSanitization = /sanitize|escape|DOMPurify|xss/i.test(code);

    if (!hasSanitization && vulnerabilities.length > 0) {
        vulnerabilities.push({
            line: 0,
            issue: 'No input sanitization detected',
            severity: 'medium',
        });
    }

    const isVulnerable = vulnerabilities.length > 0;
    const remediation = isVulnerable ? [
        'Use textContent instead of innerHTML when possible',
        'Sanitize user input using libraries like DOMPurify',
        'Use Content Security Policy (CSP) headers',
        'Validate and encode all user input',
        'Use auto-escaping template engines',
    ] : [];

    return { vulnerable: isVulnerable, vulnerabilities, remediation };
}

/**
 * 检查 CSRF 漏洞
 * 适配器：实现 CSRF 检测逻辑
 */
export function checkCSRF(code: string): SecurityCheckResult {
    const vulnerabilities: Array<{ line: number; issue: string; severity: 'high' | 'medium' | 'low' }> = [];
    const lines = code.split('\n');

    // 检测 POST/PUT/DELETE 路由是否缺少 CSRF 保护
    let hasCsrfProtection = false;
    lines.forEach((line, index) => {
        if (/csrf|CSRF|csrfProtection|csrfToken|sameSite/i.test(line)) {
            hasCsrfProtection = true;
        }

        // 检测状态修改路由
        if (/\.(post|put|delete|patch)\s*\(/i.test(line)) {
            // 检查下一几行是否有 CSRF 保护
            const nextLines = lines.slice(index, index + 10).join('\n');
            if (!/csrf|CSRF|sameSite/i.test(nextLines) && !hasCsrfProtection) {
                vulnerabilities.push({
                    line: index + 1,
                    issue: 'State-changing endpoint lacks CSRF protection',
                    severity: 'high',
                });
            }
        }
    });

    // 检查 Cookie 配置
    const cookieLines = lines.filter(line => /cookie/i.test(line));
    cookieLines.forEach((line, index) => {
        if (!/sameSite|httpOnly|secure/i.test(line)) {
            vulnerabilities.push({
                line: lines.indexOf(line) + 1,
                issue: 'Cookie lacks security attributes (sameSite, httpOnly, secure)',
                severity: 'medium',
            });
        }
    });

    const isVulnerable = vulnerabilities.length > 0;
    const remediation = isVulnerable ? [
        'Implement CSRF tokens for all state-changing requests',
        'Use SameSite cookie attribute',
        'Verify CSRF tokens on the server side',
        'Use double-submit cookie pattern',
        'Consider using Same-Site cookie policy',
    ] : [];

    return { vulnerable: isVulnerable, vulnerabilities, remediation };
}

/**
 * 检查认证漏洞
 * 适配器：实现认证检测逻辑
 */
export function checkAuthentication(code: string): SecurityCheckResult {
    const vulnerabilities: Array<{ line: number; issue: string; severity: 'high' | 'medium' | 'low' }> = [];
    const lines = code.split('\n');

    // 检测需要认证的路由
    const protectedRoutes = ['/admin', '/api/', '/user/', '/dashboard'];
    let hasAuthentication = false;

    lines.forEach((line, index) => {
        protectedRoutes.forEach(route => {
            if (line.includes(route) && (line.includes('.get(') || line.includes('.post('))) {
                // 检查当前行是否包含认证中间件（如 authenticate）
                const hasAuthInLine = /auth|authenticate|jwt|token/i.test(line);
                
                // 检查前面是否有认证中间件
                const prevLines = lines.slice(Math.max(0, index - 5), index).join('\n');
                
                if (!hasAuthInLine && !/auth|authenticate|jwt|token/i.test(prevLines)) {
                    vulnerabilities.push({
                        line: index + 1,
                        issue: 'Protected endpoint lacks authentication middleware',
                        severity: 'high',
                    });
                } else {
                    hasAuthentication = true;
                }
            }
        });

        if (/auth|authenticate|jwt|token/i.test(line)) {
            hasAuthentication = true;
        }
    });

    // 检测弱密码模式
    if (/password\s*=\s*["']123456|password\s*=\s*["']password/i.test(code)) {
        vulnerabilities.push({
            line: 0,
            issue: 'Hardcoded or weak password detected',
            severity: 'high',
        });
    }

    // 检测 JWT 验证
    const hasJwtVerification = /jwt\.verify/i.test(code);
    if (hasJwtVerification && !/secret/i.test(code)) {
        vulnerabilities.push({
            line: 0,
            issue: 'JWT verification without secret key',
            severity: 'high',
        });
    }

    const isVulnerable = vulnerabilities.length > 0;
    const remediation = isVulnerable ? [
        'Implement authentication middleware for all protected routes',
        'Use strong, unique passwords',
        'Verify JWT tokens with proper secret keys',
        'Implement proper session management',
        'Use HTTPS for all authenticated requests',
        'Implement rate limiting for authentication endpoints',
    ] : [];

    return { vulnerable: isVulnerable, vulnerabilities, remediation };
}

/**
 * 生成安全报告
 * 适配器：生成综合安全报告
 */
export function generateSecurityReport(code: string): SecurityReport {
    // 运行所有安全检查
    const sqlResult = checkSQLInjection(code);
    const xssResult = checkXSS(code);
    const csrfResult = checkCSRF(code);
    const authResult = checkAuthentication(code);

    // 收集所有漏洞
    const allVulnerabilities: Array<{
        type: string;
        severity: 'high' | 'medium' | 'low';
        line: number;
        description: string;
        code: string;
    }> = [];

    if (sqlResult.vulnerabilities) {
        sqlResult.vulnerabilities.forEach(vuln => {
            allVulnerabilities.push({
                type: 'SQL Injection',
                severity: vuln.severity,
                line: vuln.line,
                description: vuln.issue,
                code: code.split('\n')[vuln.line - 1] || '',
            });
        });
    }

    if (xssResult.vulnerabilities) {
        xssResult.vulnerabilities.forEach(vuln => {
            allVulnerabilities.push({
                type: 'XSS',
                severity: vuln.severity,
                line: vuln.line,
                description: vuln.issue,
                code: code.split('\n')[vuln.line - 1] || '',
            });
        });
    }

    if (csrfResult.vulnerabilities) {
        csrfResult.vulnerabilities.forEach(vuln => {
            allVulnerabilities.push({
                type: 'CSRF',
                severity: vuln.severity,
                line: vuln.line,
                description: vuln.issue,
                code: code.split('\n')[vuln.line - 1] || '',
            });
        });
    }

    if (authResult.vulnerabilities) {
        authResult.vulnerabilities.forEach(vuln => {
            allVulnerabilities.push({
                type: 'Authentication',
                severity: vuln.severity,
                line: vuln.line,
                description: vuln.issue,
                code: code.split('\n')[vuln.line - 1] || '',
            });
        });
    }

    // 统计漏洞数量
    const summary = {
        totalVulnerabilities: allVulnerabilities.length,
        criticalVulnerabilities: allVulnerabilities.filter(v => v.severity === 'high').length,
        highVulnerabilities: allVulnerabilities.filter(v => v.severity === 'high').length,
        mediumVulnerabilities: allVulnerabilities.filter(v => v.severity === 'medium').length,
        lowVulnerabilities: allVulnerabilities.filter(v => v.severity === 'low').length,
    };

    // 计算安全分数 (0-100)
    const baseScore = 100;
    const severityWeights = { high: 20, medium: 10, low: 5 };
    let score = baseScore;
    allVulnerabilities.forEach(vuln => {
        score -= severityWeights[vuln.severity];
    });
    score = Math.max(0, Math.min(100, score));

    // 收集所有建议
    const recommendations: string[] = [];
    if (sqlResult.remediation) {
        recommendations.push(...sqlResult.remediation);
    }
    if (xssResult.remediation) {
        recommendations.push(...xssResult.remediation);
    }
    if (csrfResult.remediation) {
        recommendations.push(...csrfResult.remediation);
    }
    if (authResult.remediation) {
        recommendations.push(...authResult.remediation);
    }

    // 去重
    const uniqueRecommendations = [...new Set(recommendations)];

    return {
        summary,
        vulnerabilities: allVulnerabilities,
        score,
        recommendations: uniqueRecommendations,
    };
}
