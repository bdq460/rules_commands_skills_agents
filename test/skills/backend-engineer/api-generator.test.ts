/**
 * API Generator 单元测试
 */

import { ApiGenerator } from '../../../skills/skills/backend-engineer/scripts/api-generator';

describe('ApiGenerator', () => {
    let generator: ApiGenerator;

    beforeEach(() => {
        generator = new ApiGenerator({
            language: 'typescript',
            framework: 'express',
            outputDir: './test-output',
            generateTests: false,
        });
    });

    afterEach(() => {
        // 清理测试环境，确保测试隔离
        generator = null as any;
    });

    describe('constructor', () => {
        it('should create an instance with default options', () => {
            expect(generator).toBeInstanceOf(ApiGenerator);
            expect(generator['_options']).toBeDefined();
            expect(generator['_options'].language).toBe('typescript');
            expect(generator['_options'].framework).toBe('express');
            expect(generator['_options'].outputDir).toBe('./test-output');
            expect(generator['_options'].generateTests).toBe(false);
        });

        it('should set language option', () => {
            const gen = new ApiGenerator({
                language: 'javascript',
                framework: 'express',
                outputDir: './output',
                generateTests: true,
            });
            expect(gen['_options'].language).toBe('javascript');
        });
    });

    describe('generateController', () => {
        it('should generate controller code for a valid model', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [
                    { name: 'id', type: 'number', required: true, unique: true },
                    { name: 'name', type: 'string', required: true },
                    { name: 'email', type: 'string', required: true, unique: true },
                ],
                timestamps: true,
            };

            const controller = generator.generateController(model);

            expect(controller).toContain('export class UserController');
            expect(controller).toContain('UserService');
            expect(controller).toContain('Request, Response, NextFunction');
        });

        it('should generate correct route path', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const controller = generator.generateController(model);
            expect(controller).toContain('/users');
        });

        it('should include CRUD methods', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const controller = generator.generateController(model);
            expect(controller).toContain('async getAll');
            expect(controller).toContain('async getById');
            expect(controller).toContain('async create');
            expect(controller).toContain('async update');
            expect(controller).toContain('async delete');
        });
    });

    describe('generateService', () => {
        it('should generate service code for a valid model', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const service = generator.generateService(model);

            expect(service).toContain('export class UserService');
            expect(service).toContain('class');
        });

        it('should include service CRUD methods', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const service = generator.generateService(model);
            expect(service).toContain('async findAll');
            expect(service).toContain('async findById');
            expect(service).toContain('async create');
            expect(service).toContain('async update');
            expect(service).toContain('async delete');
            expect(service).toContain('async exists');
        });

        it('should include pagination support', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const service = generator.generateService(model);
            expect(service).toContain('FindAllOptions');
            expect(service).toContain('PaginationResult');
            expect(service).toContain('pagination');
        });
    });

    describe('generateRepository', () => {
        it('should generate repository code for a valid model', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const repo = generator.generateRepository(model);

            expect(repo).toContain('export class UserRepository');
            expect(repo).toContain('Pool');
            expect(repo).toContain('pg');
        });

        it('should include repository CRUD methods', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const repo = generator.generateRepository(model);
            expect(repo).toContain('async findAll');
            expect(repo).toContain('async findById');
            expect(repo).toContain('async create');
            expect(repo).toContain('async update');
            expect(repo).toContain('async delete');
            expect(repo).toContain('async count');
        });

        it('should generate SQL with WHERE clauses', () => {
            const model = {
                name: 'Product',
                tableName: 'products',
                fields: [],
            };

            const repo = generator.generateRepository(model);
            expect(repo).toContain('whereClause');
            expect(repo).toContain('WHERE');
            expect(repo).toContain('filterValues');
        });

        it('should handle pagination in findAll', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const repo = generator.generateRepository(model);
            expect(repo).toContain('LIMIT');
            expect(repo).toContain('OFFSET');
            expect(repo).toContain('offset = (page - 1) * pageSize');
        });
    });

    describe('generateRoutes', () => {
        it('should generate route configuration', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const routes = generator.generateRoutes(model);

            expect(routes).toContain('router.');
            expect(routes).toContain('GET');
            expect(routes).toContain('POST');
        });

        it('should generate all CRUD routes', () => {
            const model = {
                name: 'User',
                tableName: 'users',
                fields: [],
            };

            const routes = generator.generateRoutes(model);
            expect(routes).toContain('router.get(\'/\', controller.getAll)');
            expect(routes).toContain('router.get(\'/:id\', controller.getById)');
            expect(routes).toContain('router.post(\'/\', controller.create)');
            expect(routes).toContain('router.put(\'/:id\', controller.update)');
            expect(routes).toContain('router.delete(\'/:id\', controller.delete)');
        });

        it('should use lowercase model name for route path', () => {
            const model = {
                name: 'Product',
                tableName: 'products',
                fields: [],
            };

            const routes = generator.generateRoutes(model);
            expect(routes).toContain('/product');
            expect(routes).toContain('createProductRoutes');
        });

        it('should return Router type', () => {
            const model = {
                name: 'Order',
                tableName: 'orders',
                fields: [],
            };

            const routes = generator.generateRoutes(model);
            expect(routes).toContain('Router');
            expect(routes).toContain('router');
            expect(routes).toContain('return router');
        });
    });
});
