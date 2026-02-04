/**
 * Documentation Generator 单元测试
 */

import {
    DocumentationGenerator,
    formatMarkdown,
    generateAPIDocumentation,
    generateReleaseNotes,
    generateUserGuide
} from '../../../skills/skills/product-documentation-expert/scripts/documentation-generator';

describe('DocumentationGenerator', () => {
    let generator: DocumentationGenerator;

    beforeEach(() => {
        generator = new DocumentationGenerator();
    });

    describe('DocumentationGenerator Class Methods', () => {
        it('should generate product introduction', () => {
            const product = {
                name: 'TestProduct',
                version: '1.0.0',
                description: 'This is a test product',
                features: ['Feature 1', 'Feature 2', 'Feature 3']
            };

            const result = generator.generateProductIntroduction(product);

            expect(result).toContain('TestProduct');
            expect(result).toContain('1.0.0');
            expect(result).toContain('This is a test product');
            expect(result).toContain('Feature 1');
            expect(result).toContain('Feature 2');
            expect(result).toContain('Feature 3');
            expect(result).toContain('快速开始');
        });

        it('should generate product introduction with screenshots', () => {
            const product = {
                name: 'MyApp',
                version: '2.0.0',
                description: 'Amazing application',
                features: ['Cool feature'],
                screenshots: ['screenshot1.png', 'screenshot2.png']
            };

            const result = generator.generateProductIntroduction(product);

            expect(result).toContain('产品截图');
            expect(result).toContain('screenshot1.png');
            expect(result).toContain('screenshot2.png');
        });

        it('should generate user manual', () => {
            const product = {
                name: 'TestApp',
                version: '1.0.0',
                description: 'Test application',
                features: ['Login', 'Dashboard']
            };

            const result = generator.generateUserManual(product);

            expect(result).toContain('用户手册');
            expect(result).toContain('TestApp');
            expect(result).toContain('安装指南');
            expect(result).toContain('快速开始');
        });

        it('should generate API documentation with class method', () => {
            const endpoints = [
                {
                    method: 'GET' as const,
                    path: '/api/users',
                    description: 'Get users',
                    responses: [
                        { statusCode: 200, description: 'Success' }
                    ]
                },
                {
                    method: 'POST' as const,
                    path: '/api/users',
                    description: 'Create user',
                    responses: [
                        { statusCode: 201, description: 'Created' }
                    ]
                }
            ];

            const result = generator.generateAPIDocumentation(endpoints);

            expect(result).toContain('API 文档');
            expect(result).toContain('GET');
            expect(result).toContain('POST');
            expect(result).toContain('/api/users');
        });

        it('should generate FAQ document', () => {
            const faqs = [
                {
                    question: '如何安装？',
                    answer: '运行 npm install',
                    category: '安装'
                },
                {
                    question: '如何使用？',
                    answer: '参考用户手册',
                    category: '使用'
                }
            ];

            const result = generator.generateFAQ(faqs);

            expect(result).toContain('常见问题');
            expect(result).toContain('如何安装？');
            expect(result).toContain('运行 npm install');
            expect(result).toContain('如何使用？');
        });

        it('should generate changelog', () => {
            const versions = [
                {
                    version: '1.0.0',
                    date: '2024-01-01',
                    type: 'major' as const,
                    changes: {
                        added: ['Initial release']
                    }
                },
                {
                    version: '1.1.0',
                    date: '2024-02-01',
                    type: 'minor' as const,
                    changes: {
                        added: ['Added new feature'],
                        fixed: ['Fixed bug']
                    }
                }
            ];

            const result = generator.generateChangelog(versions);

            expect(result).toContain('1.0.0');
            expect(result).toContain('1.1.0');
        });

        it('should generate README', () => {
            const product = {
                name: 'MyProject',
                version: '1.0.0',
                description: 'A great project',
                features: ['Feature 1', 'Feature 2']
            };

            const result = generator.generateREADME(product);

            expect(result).toContain('MyProject');
            expect(result).toContain('A great project');
            expect(result).toContain('Feature 1');
        });

        it('should generate all documents', () => {
            const product = {
                name: 'CompleteApp',
                version: '2.0.0',
                description: 'Complete application',
                features: ['Auth', 'Dashboard', 'Reports']
            };

            const endpoints = [
                {
                    method: 'GET' as const,
                    path: '/api/health',
                    description: 'Health check',
                    responses: [{ statusCode: 200, description: 'OK' }]
                }
            ];

            const faqs = [
                {
                    question: 'How to start?',
                    answer: 'Run npm start',
                    category: 'Getting Started'
                }
            ];

            const result = generator.generateAllDocuments(product, endpoints, faqs);

            expect(result).toBeDefined();
            expect(result.get('README.md')).toBeDefined();
            expect(result.get('PRODUCT_INTRODUCTION.md')).toBeDefined();
            expect(result.get('USER_MANUAL.md')).toBeDefined();
            expect(result.get('API.md')).toBeDefined();
            expect(result.get('FAQ.md')).toBeDefined();
        });

        it('should generate API documentation with parameters and request body', () => {
            const endpoints = [
                {
                    method: 'POST' as const,
                    path: '/api/users',
                    description: 'Create a new user',
                    parameters: [
                        {
                            name: 'username',
                            type: 'string',
                            required: true,
                            description: 'User name',
                            example: 'john_doe'
                        }
                    ],
                    requestBody: {
                        email: 'john@example.com',
                        age: 30
                    },
                    responses: [
                        { statusCode: 201, description: 'User created' },
                        { statusCode: 400, description: 'Invalid input' }
                    ]
                }
            ];

            const result = generator.generateAPIDocumentation(endpoints);

            expect(result).toContain('POST');
            expect(result).toContain('/api/users');
            expect(result).toContain('username');
            expect(result).toContain('201');
            expect(result).toContain('400');
        });

        it('should generate user manual with screenshots', () => {
            const product = {
                name: 'VisualApp',
                version: '1.5.0',
                description: 'App with visuals',
                features: ['UI', 'UX'],
                screenshots: ['screen1.png', 'screen2.png']
            };

            const result = generator.generateUserManual(product);

            expect(result).toContain('VisualApp');
            expect(result).toContain('1.5.0');
        });

        it('should handle empty FAQ list', () => {
            const result = generator.generateFAQ([]);

            expect(result).toContain('常见问题');
        });

        it('should handle multiple FAQ categories', () => {
            const faqs = [
                { question: 'Q1', answer: 'A1', category: 'Category1' },
                { question: 'Q2', answer: 'A2', category: 'Category1' },
                { question: 'Q3', answer: 'A3', category: 'Category2' }
            ];

            const result = generator.generateFAQ(faqs);

            expect(result).toContain('Q1');
            expect(result).toContain('Q2');
            expect(result).toContain('Q3');
        });

        it('should generate changelog with different change types', () => {
            const versions = [
                {
                    version: '2.0.0',
                    date: '2024-03-01',
                    type: 'major' as const,
                    changes: {
                        added: ['New feature'],
                        fixed: ['Bug fix'],
                        changed: ['API change'],
                        deprecated: ['Old method'],
                        removed: ['Legacy code'],
                        security: ['Security patch']
                    }
                }
            ];

            const result = generator.generateChangelog(versions);

            expect(result).toContain('2.0.0');
        });

        it('should generate API documentation with different HTTP methods', () => {
            const endpoints = [
                {
                    method: 'GET' as const,
                    path: '/api/items',
                    description: 'Get items',
                    responses: [{ statusCode: 200, description: 'Success' }]
                },
                {
                    method: 'PUT' as const,
                    path: '/api/items/:id',
                    description: 'Update item',
                    responses: [{ statusCode: 200, description: 'Updated' }]
                },
                {
                    method: 'DELETE' as const,
                    path: '/api/items/:id',
                    description: 'Delete item',
                    responses: [{ statusCode: 204, description: 'Deleted' }]
                },
                {
                    method: 'PATCH' as const,
                    path: '/api/items/:id',
                    description: 'Patch item',
                    responses: [{ statusCode: 200, description: 'Patched' }]
                }
            ];

            const result = generator.generateAPIDocumentation(endpoints);

            expect(result).toContain('GET');
            expect(result).toContain('PUT');
            expect(result).toContain('DELETE');
            expect(result).toContain('PATCH');
        });
    });

    describe('generateUserGuide', () => {
        it('should generate user guide document', () => {
            const input = {
                productName: '测试产品',
                version: '1.0.0',
                features: ['功能1', '功能2', '功能3'],
                targetUsers: ['普通用户', '管理员']
            };

            const result = generateUserGuide(input);

            expect(result).toBeDefined();
            expect(result.markdown).toBeDefined();
            expect(result.markdown).toContain('测试产品');
            expect(result.markdown).toContain('1.0.0');
        });

        it('should include all features', () => {
            const input = {
                productName: '测试产品',
                version: '1.0.0',
                features: ['功能A', '功能B', '功能C'],
                targetUsers: []
            };

            const result = generateUserGuide(input);

            expect(result.markdown).toContain('功能A');
            expect(result.markdown).toContain('功能B');
            expect(result.markdown).toContain('功能C');
        });

        it('should include target users section', () => {
            const input = {
                productName: '测试产品',
                version: '1.0.0',
                features: [],
                targetUsers: ['普通用户', '管理员']
            };

            const result = generateUserGuide(input);

            expect(result.markdown).toContain('普通用户');
            expect(result.markdown).toContain('管理员');
        });

        it('should include quick start section', () => {
            const input = {
                productName: '测试产品',
                version: '1.0.0',
                features: [],
                targetUsers: []
            };

            const result = generateUserGuide(input);

            expect(result.markdown).toContain('快速开始');
        });
    });

    describe('generateAPIDocumentation', () => {
        it('should generate API documentation', () => {
            const endpoints = [
                {
                    method: 'GET',
                    path: '/api/users',
                    description: '获取用户列表',
                    parameters: [
                        { name: 'page', type: 'number', required: false },
                        { name: 'size', type: 'number', required: false }
                    ],
                    responses: [
                        { code: 200, description: '成功' },
                        { code: 400, description: '参数错误' }
                    ]
                }
            ];

            const result = generateAPIDocumentation(endpoints);

            expect(result).toBeDefined();
            expect(result.markdown).toBeDefined();
            expect(result.markdown).toContain('API 文档');
        });

        it('should include all endpoints', () => {
            const endpoints = [
                {
                    method: 'GET',
                    path: '/api/users',
                    description: '获取用户列表',
                    parameters: [],
                    responses: []
                },
                {
                    method: 'POST',
                    path: '/api/users',
                    description: '创建用户',
                    parameters: [],
                    responses: []
                }
            ];

            const result = generateAPIDocumentation(endpoints);

            expect(result.markdown).toContain('GET /api/users');
            expect(result.markdown).toContain('POST /api/users');
        });

        it('should include request parameters', () => {
            const endpoints = [
                {
                    method: 'GET',
                    path: '/api/users',
                    description: '获取用户列表',
                    parameters: [
                        { name: 'page', type: 'number', required: false },
                        { name: 'size', type: 'number', required: true }
                    ],
                    responses: []
                }
            ];

            const result = generateAPIDocumentation(endpoints);

            expect(result.markdown).toContain('page');
            expect(result.markdown).toContain('size');
        });

        it('should include response codes', () => {
            const endpoints = [
                {
                    method: 'GET',
                    path: '/api/users',
                    description: '获取用户列表',
                    parameters: [],
                    responses: [
                        { code: 200, description: '成功' },
                        { code: 404, description: '未找到' }
                    ]
                }
            ];

            const result = generateAPIDocumentation(endpoints);

            expect(result.markdown).toContain('200');
            expect(result.markdown).toContain('404');
        });
    });

    describe('generateReleaseNotes', () => {
        it('should generate release notes', () => {
            const input = {
                version: '1.0.0',
                releaseDate: '2024-01-01',
                newFeatures: ['新功能1', '新功能2'],
                bugFixes: ['修复bug1'],
                breakingChanges: []
            };

            const result = generateReleaseNotes(input);

            expect(result).toBeDefined();
            expect(result.markdown).toBeDefined();
            expect(result.markdown).toContain('1.0.0');
            expect(result.markdown).toContain('2024-01-01');
        });

        it('should include new features section', () => {
            const input = {
                version: '1.0.0',
                releaseDate: '2024-01-01',
                newFeatures: ['新增登录功能', '新增注册功能'],
                bugFixes: [],
                breakingChanges: []
            };

            const result = generateReleaseNotes(input);

            expect(result.markdown).toContain('新功能');
            expect(result.markdown).toContain('新增登录功能');
            expect(result.markdown).toContain('新增注册功能');
        });

        it('should include bug fixes section', () => {
            const input = {
                version: '1.0.0',
                releaseDate: '2024-01-01',
                newFeatures: [],
                bugFixes: ['修复登录失败问题', '修复显示错误'],
                breakingChanges: []
            };

            const result = generateReleaseNotes(input);

            expect(result.markdown).toContain('Bug 修复');
            expect(result.markdown).toContain('修复登录失败问题');
        });

        it('should include breaking changes section', () => {
            const input = {
                version: '2.0.0',
                releaseDate: '2024-01-01',
                newFeatures: [],
                bugFixes: [],
                breakingChanges: ['API v1 已废弃', '配置格式变更']
            };

            const result = generateReleaseNotes(input);

            expect(result.markdown).toContain('破坏性变更');
            expect(result.markdown).toContain('API v1 已废弃');
        });
    });

    describe('formatMarkdown', () => {
        it('should format markdown headers', () => {
            const markdown = formatMarkdown('## 标题');

            expect(markdown).toContain('## 标题');
        });

        it('should format code blocks', () => {
            const code = 'const x = 1;';
            const markdown = formatMarkdown(code, 'typescript');

            expect(markdown).toContain('```typescript');
            expect(markdown).toContain('const x = 1;');
            expect(markdown).toContain('```');
        });

        it('should format lists', () => {
            const markdown = formatMarkdown('- 项目1\n- 项目2\n- 项目3');

            expect(markdown).toContain('- 项目1');
            expect(markdown).toContain('- 项目2');
            expect(markdown).toContain('- 项目3');
        });

        it('should format tables', () => {
            const markdown = formatMarkdown('| 列1 | 列2 |\n|-----|-----|\n| 值1 | 值2 |');

            expect(markdown).toContain('| 列1 | 列2 |');
            expect(markdown).toContain('| 值1 | 值2 |');
        });
    });

    describe('Additional Coverage Tests', () => {
        it('should generate API docs with POST method and request body', () => {
            const endpoints: any[] = [
                {
                    path: '/users',
                    method: 'POST' as const,
                    description: 'Create a new user',
                    parameters: [
                        { name: 'name', type: 'string', required: true, description: 'User name', example: 'John' },
                        { name: 'email', type: 'string', required: true, description: 'User email', example: 'john@example.com' }
                    ],
                    responses: [
                        {
                            statusCode: 201,
                            description: 'User created successfully',
                            body: { id: 1, name: 'John', email: 'john@example.com' }
                        }
                    ]
                }
            ];

            const result = generator.generateAPIDocumentation(endpoints);

            expect(result).toContain('POST');
            expect(result).toContain('/users');
            expect(result).toContain('Create a new user');
            expect(result).toContain('name');
            expect(result).toContain('email');
            expect(result).toContain('201');
            expect(result).toContain('User created successfully');
        });

        it('should generate API docs with response body', () => {
            const endpoints: any[] = [
                {
                    path: '/products',
                    method: 'GET' as const,
                    description: 'Get products',
                    parameters: [],
                    responses: [
                        {
                            statusCode: 200,
                            description: 'Success',
                            body: {
                                products: [
                                    { id: 1, name: 'Product 1' },
                                    { id: 2, name: 'Product 2' }
                                ]
                            }
                        }
                    ]
                }
            ];

            const result = generator.generateAPIDocumentation(endpoints);

            expect(result).toContain('GET');
            expect(result).toContain('200');
            expect(result).toContain('Success');
            expect(result).toContain('products');
        });

        it('should generate API docs with GET parameters in table format', () => {
            const endpoints: any[] = [
                {
                    path: '/search',
                    method: 'GET' as const,
                    description: 'Search items',
                    parameters: [
                        { name: 'q', type: 'string', required: true, description: 'Search query', example: 'keyword' },
                        { name: 'page', type: 'number', required: false, description: 'Page number', example: 1 }
                    ],
                    responses: [
                        {
                            statusCode: 200,
                            description: 'Search results'
                        }
                    ]
                }
            ];

            const result = generator.generateAPIDocumentation(endpoints);

            expect(result).toContain('| 参数 | 类型 | 必填 | 说明 | 示例 |');
            expect(result).toContain('| q | string | 是 | Search query | keyword |');
            expect(result).toContain('| page | number | 否 | Page number | 1 |');
        });

        it('should test getExampleData static method', () => {
            const exampleData = DocumentationGenerator.getExampleData();

            expect(exampleData).toBeDefined();
            expect(exampleData.product).toBeDefined();
            expect(exampleData.product.name).toBe('Example App');
            expect(exampleData.product.version).toBe('1.0.0');
            expect(exampleData.endpoints).toBeDefined();
            expect(exampleData.endpoints.length).toBeGreaterThan(0);
            expect(exampleData.faqs).toBeDefined();
            expect(exampleData.releases).toBeDefined();
        });

        it('should generate all documents with all inputs', () => {
            const product = {
                name: 'Full App',
                version: '1.0.0',
                description: 'Complete application',
                features: ['Feature 1', 'Feature 2']
            };

            const endpoints = [
                {
                    path: '/api/test',
                    method: 'GET' as const,
                    description: 'Test endpoint',
                    parameters: [],
                    responses: [{ statusCode: 200, description: 'OK' }]
                }
            ];

            const faqs = [
                { question: 'What is this?', answer: 'It is a test', category: 'General' }
            ];

            const releases = [
                {
                    version: '1.0.0',
                    date: '2024-01-01',
                    changes: [
                        { type: 'feature' as const, description: 'Initial release' }
                    ]
                }
            ];

            const docs = generator.generateAllDocuments(product, endpoints, faqs, releases);

            expect(docs).toBeDefined();
            expect(docs.size).toBeGreaterThan(0);
            expect(docs.has('README.md')).toBe(true);
            expect(docs.has('API.md')).toBe(true);
            expect(docs.has('FAQ.md')).toBe(true);
            expect(docs.has('CHANGELOG.md')).toBe(true);
        });

        it('should generate all documents with only required inputs', () => {
            const product = {
                name: 'Minimal App',
                version: '1.0.0',
                description: 'Minimal application',
                features: ['Feature 1']
            };

            const docs = generator.generateAllDocuments(product);

            expect(docs).toBeDefined();
            expect(docs.has('README.md')).toBe(true);
            expect(docs.has('API.md')).toBe(false);
            expect(docs.has('FAQ.md')).toBe(false);
            expect(docs.has('CHANGELOG.md')).toBe(false);
        });

        it('should generate all documents with partial inputs', () => {
            const product = {
                name: 'Partial App',
                version: '1.0.0',
                description: 'Partial application',
                features: ['Feature 1']
            };

            const endpoints = [
                {
                    path: '/api/status',
                    method: 'GET' as const,
                    description: 'Status check',
                    parameters: [],
                    responses: [{ statusCode: 200, description: 'OK' }]
                }
            ];

            const docs = generator.generateAllDocuments(product, endpoints);

            expect(docs).toBeDefined();
            expect(docs.has('README.md')).toBe(true);
            expect(docs.has('API.md')).toBe(true);
            expect(docs.has('FAQ.md')).toBe(false);
            expect(docs.has('CHANGELOG.md')).toBe(false);
        });

        it('should handle API endpoints with PUT method', () => {
            const endpoints: any[] = [
                {
                    path: '/users/{id}',
                    method: 'PUT' as const,
                    description: 'Update user',
                    parameters: [
                        { name: 'name', type: 'string', required: false, description: 'New name', example: 'Jane' }
                    ],
                    responses: [
                        { statusCode: 200, description: 'Updated' }
                    ]
                }
            ];

            const result = generator.generateAPIDocumentation(endpoints);

            expect(result).toContain('PUT');
            expect(result).toContain('/users/{id}');
        });

        it('should handle API endpoints with DELETE method', () => {
            const endpoints: any[] = [
                {
                    path: '/users/{id}',
                    method: 'DELETE' as const,
                    description: 'Delete user',
                    parameters: [],
                    responses: [
                        { statusCode: 204, description: 'No content' }
                    ]
                }
            ];

            const result = generator.generateAPIDocumentation(endpoints);

            expect(result).toContain('DELETE');
            expect(result).toContain('204');
        });

        it('should execute complete workflow end-to-end', () => {
            const exampleData = DocumentationGenerator.getExampleData();
            const newGenerator = new DocumentationGenerator();

            const allDocs = newGenerator.generateAllDocuments(
                exampleData.product,
                exampleData.endpoints,
                exampleData.faqs,
                exampleData.releases
            );

            expect(allDocs.size).toBeGreaterThanOrEqual(4); // May include additional docs

            const readme = allDocs.get('README.md');
            expect(readme).toBeDefined();
            expect(readme).toContain(exampleData.product.name);

            const apiDoc = allDocs.get('API.md');
            expect(apiDoc).toBeDefined();

            const faqDoc = allDocs.get('FAQ.md');
            expect(faqDoc).toBeDefined();

            const changelog = allDocs.get('CHANGELOG.md');
            expect(changelog).toBeDefined();
        });
    });
});
