/**
 * API代码生成器
 *
 * 根据数据模型生成RESTful API代码
 */

interface Field {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
  description?: string;
}

interface Model {
  name: string;
  tableName: string;
  fields: Field[];
  timestamps?: boolean;
}

interface GenerateOptions {
  language: 'typescript' | 'javascript';
  framework: 'express' | 'fastify' | 'nest';
  outputDir: string;
  generateTests: boolean;
}

export class ApiGenerator {
  private _options: GenerateOptions;

  constructor(options: GenerateOptions) {
    this._options = options;
  }

  /**
   * 生成控制器代码
   */
  generateController(model: Model): string {
    const modelName = model.name;
    const modelNameLower = modelName.toLowerCase();
    const route = `/${model.tableName}`;

    let code = `
import { Request, Response, NextFunction } from 'express';
import { ${modelName}Service } from '../services/${modelName}Service';

export class ${modelName}Controller {
  private ${modelNameLower}Service: ${modelName}Service;

  constructor(${modelNameLower}Service: ${modelName}Service) {
    this.${modelNameLower}Service = ${modelNameLower}Service;
  }

  /**
   * 获取所有${model.name}
   * @route GET ${route}
   */
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = 1, pageSize = 10, ...filters } = req.query;
      
      const result = await this.${modelNameLower}Service.findAll({
        page: Number(page),
        pageSize: Number(pageSize),
        filters: filters as Record<string, any>
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据ID获取${model.name}
   * @route GET ${route}/:id
   */
  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await this.${modelNameLower}Service.findById(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: '${model.name} not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建${model.name}
   * @route POST ${route}
   */
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      
      const result = await this.${modelNameLower}Service.create(data);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新${model.name}
   * @route PUT ${route}/:id
   */
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      
      const result = await this.${modelNameLower}Service.update(id, data);

      if (!result) {
        res.status(404).json({
          success: false,
          error: '${model.name} not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除${model.name}
   * @route DELETE ${route}/:id
   */
  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      
      const deleted = await this.${modelNameLower}Service.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: '${model.name} not found'
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
`;

    return code.trim();
  }

  /**
   * 生成服务代码
   */
  generateService(model: Model): string {
    const modelName = model.name;
    const modelNameLower = modelName.toLowerCase();

    let code = `
import { ${modelName}Repository } from '../repositories/${modelName}Repository';
import { ${modelName} } from '../models/${modelName}';

interface FindAllOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export class ${modelName}Service {
  private ${modelNameLower}Repository: ${modelName}Repository;

  constructor(${modelNameLower}Repository: ${modelName}Repository) {
    this.${modelNameLower}Repository = ${modelNameLower}Repository;
  }

  /**
   * 查找所有${model.name}
   */
  async findAll(options: FindAllOptions = {}): Promise<PaginationResult<${modelName}>> {
    const { page = 1, pageSize = 10, filters = {} } = options;
    
    const result = await this.${modelNameLower}Repository.findAll({
      page,
      pageSize,
      filters
    });

    return {
      data: result.data,
      pagination: {
        page,
        pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / pageSize)
      }
    };
  }

  /**
   * 根据ID查找${model.name}
   */
  async findById(id: string): Promise<${modelName} | null> {
    return this.${modelNameLower}Repository.findById(id);
  }

  /**
   * 创建${model.name}
   */
  async create(data: Partial<${modelName}>): Promise<${modelName}> {
    return this.${modelNameLower}Repository.create(data);
  }

  /**
   * 更新${model.name}
   */
  async update(id: string, data: Partial<${modelName}>): Promise<${modelName} | null> {
    return this.${modelNameLower}Repository.update(id, data);
  }

  /**
   * 删除${model.name}
   */
  async delete(id: string): Promise<boolean> {
    return this.${modelNameLower}Repository.delete(id);
  }

  /**
   * 检查${model.name}是否存在
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.${modelNameLower}Repository.count({ id });
    return count > 0;
  }
}
`;

    return code.trim();
  }

  /**
   * 生成Repository代码
   */
  generateRepository(model: Model): string {
    const modelName = model.name;
    const tableName = model.tableName;

    let code = `
import { Pool } from 'pg';
import { ${modelName} } from '../models/${modelName}';

interface FindAllOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
}

export class ${modelName}Repository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * 查找所有${model.name}
   */
  async findAll(options: FindAllOptions = {}): Promise<{ data: ${modelName}[]; total: number }> {
    const { page = 1, pageSize = 10, filters = {} } = options;
    const offset = (page - 1) * pageSize;

    // 构建WHERE条件
    const whereConditions = Object.keys(filters)
      .map((key, index) => \`\${key} = $\${index + 1}\`)
      .join(' AND ');

    const whereClause = whereConditions ? \`WHERE \${whereConditions}\` : '';
    const filterValues = Object.values(filters);

    // 查询总数
    const countQuery = \`SELECT COUNT(*) FROM \${tableName} \${whereClause}\`;
    const countResult = await this.pool.query(countQuery, filterValues);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = \`
      SELECT * FROM \${tableName}
      \${whereClause}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    \`;
    const dataResult = await this.pool.query(dataQuery, [...filterValues, pageSize, offset]);

    return {
      data: dataResult.rows,
      total
    };
  }

  /**
   * 根据ID查找${model.name}
   */
  async findById(id: string): Promise<${modelName} | null> {
    const query = \`SELECT * FROM \${tableName} WHERE id = $1\`;
    const result = await this.pool.query(query, [id]);

    return result.rows[0] || null;
  }

  /**
   * 创建${model.name}
   */
  async create(data: Partial<${modelName}>): Promise<${modelName}> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i: number) => \`\$\${i + 1}\`);

    const query = \`
      INSERT INTO \${tableName} (\${columns.join(', ')})
      VALUES (\${placeholders.join(', ')})
      RETURNING *
    \`;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * 更新${model.name}
   */
  async update(id: string, data: Partial<${modelName}>): Promise<${modelName} | null> {
    const setClause = Object.keys(data)
      .map((key, i: number) => \`\${key} = $\${i + 1}\`)
      .join(', ');
    const values = [...Object.values(data), id];

    const query = \`
      UPDATE \${tableName}
      SET \${setClause}
      WHERE id = $\${values.length}
      RETURNING *
    \`;

    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * 删除${model.name}
   */
  async delete(id: string): Promise<boolean> {
    const query = \`DELETE FROM \${tableName} WHERE id = $1\`;
    const result = await this.pool.query(query, [id]);

    return result.rowCount > 0;
  }

  /**
   * 计数
   */
  async count(filters: Record<string, any> = {}): Promise<number> {
    const whereConditions = Object.keys(filters)
      .map((key, index) => \`\${key} = $\${index + 1}\`)
      .join(' AND ');

    const whereClause = whereConditions ? \`WHERE \${whereConditions}\` : '';
    const filterValues = Object.values(filters);

    const query = \`SELECT COUNT(*) FROM \${tableName} \${whereClause}\`;
    const result = await this.pool.query(query, filterValues);

    return parseInt(result.rows[0].count);
  }
}
`;

    return code.trim();
  }

  /**
   * 生成路由配置代码
   */
  generateRoutes(model: Model): string {
    const modelName = model.name;
    const modelNameLower = modelName.toLowerCase();
    const routePath = `/${modelNameLower}`;

    let code = `
import { Router, Request, Response, NextFunction } from 'express';
import { ${modelName}Controller } from '../controllers/${modelName}Controller';

/**
 * ${modelName} 路由配置
 */
export function create${modelName}Routes(controller: ${modelName}Controller): Router {
  const router = Router();

  // GET ${routePath} - 获取所有${modelName}
  router.get('/', controller.getAll);

  // GET ${routePath}/:id - 根据ID获取${modelName}
  router.get('/:id', controller.getById);

  // POST ${routePath} - 创建${modelName}
  router.post('/', controller.create);

  // PUT ${routePath}/:id - 更新${modelName}
  router.put('/:id', controller.update);

  // DELETE ${routePath}/:id - 删除${modelName}
  router.delete('/:id', controller.delete);

  return router;
}
`;

    return code.trim();
  }
}
