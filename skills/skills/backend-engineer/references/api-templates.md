# 后端API模板

本文档包含常用的后端API设计模板和实现示例。

## 📋 RESTful API模板

### 1. 控制器模板（Express + TypeScript）

```typescript
import { Request, Response, NextFunction } from 'express';
import { Container } from 'inversify';
import { validate } from 'class-validator';

/**
 *用户控制器*/
export class UserController {
  private userService: UserService;

  constructor(container: Container) {
    this.userService = container.get<UserService>(TYPES.UserService);
  }

  /** * 获取用户列表
   `@route GET /api/users`/
  public getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      
      const result = await this.userService.getUsers({
        page: Number(page),
        pageSize: Number(pageSize)
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  /** * 获取用户详情
   `@route GET /api/users/:id`/
  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /** * 创建用户
   `@route POST /api/users`/
  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = new CreateUserDto(req.body);
      const errors = await validate(userData);

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          errors: errors.map(e => e.constraints)
        });
        return;
      }

      const user = await this.userService.createUser(userData);

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /** * 更新用户
   `@route PUT /api/users/:id`/
  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = new UpdateUserDto(req.body);
      const errors = await validate(userData);

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          errors: errors.map(e => e.constraints)
        });
        return;
      }

      const user = await this.userService.updateUser(id, userData);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /** * 删除用户
   `@route DELETE /api/users/:id`/
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      
      await this.userService.deleteUser(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

```

### 2. 服务层模板

```typescript
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { IUserRepository } from '../interfaces/IUserRepository';
import { CreateUserDto, UpdateUserDto, User } from '../entities/User';

/**
 *用户服务*/
@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  /** *获取用户列表*/
  public async getUsers(options: {
    page: number;
    pageSize: number;
  }): Promise<{ data: User[]; pagination: any }> {
    const { page, pageSize } = options;
    const offset = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.userRepository.findAll({ limit: pageSize, offset }),
      this.userRepository.count()
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  /** *获取用户详情*/
  public async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  /** *创建用户*/
  public async createUser(dto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, dto);
    
    // 密码加密
    if (dto.password) {
      user.password = await this.hashPassword(dto.password);
    }

    return await this.userRepository.save(user);
  }

  /** *更新用户*/
  public async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, dto);
    
    // 如果更新密码，重新加密
    if (dto.password) {
      user.password = await this.hashPassword(dto.password);
    }

    return await this.userRepository.save(user);
  }

  /** *删除用户*/
  public async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  /** *密码加密*/
  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}

```

### 3. DTO模板

```typescript
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

/**
 *创建用户DTO*/
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

/**
 *更新用户DTO*/
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

```

## 📋 GraphQL API模板

### 1. Resolver模板

```typescript
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';
import { CreateUserInput, UpdateUserInput } from '../inputs/UserInput';

/**
 *User Resolver*/
@Resolver(User)
export class UserResolver {
  constructor(private userService: UserService) {}

  /** *获取用户列表*/
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  /** *获取用户详情*/
  @Query(() => User, { nullable: true })
  async user(@Arg('id') id: string): Promise<User | null> {
    return await this.userService.getUserById(id);
  }

  /** *创建用户*/
  @Mutation(() => User)
  async createUser(@Arg('input') input: CreateUserInput): Promise<User> {
    return await this.userService.createUser(input);
  }

  /** *更新用户*/
  @Mutation(() => User)
  async updateUser(
    @Arg('id') id: string,
    @Arg('input') input: UpdateUserInput
  ): Promise<User> {
    return await this.userService.updateUser(id, input);
  }

  /** *删除用户*/
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string): Promise<boolean> {
    await this.userService.deleteUser(id);
    return true;
  }
}

```

## 📋 中间件模板

### 1. 认证中间件

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 *认证中间件*/
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req['user'] = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

```

### 2. 错误处理中间件

```typescript
import { Request, Response, NextFunction } from 'express';

/**
 *错误处理中间件*/
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

```

### 3. 日志中间件

```typescript
import { Request, Response, NextFunction } from 'express';

/**
 *日志中间件*/
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

```

## 📋 数据库模型模板

### 1. TypeORM模型

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 *用户实体*/
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}

```

## 🎯 API设计最佳实践

### 1. RESTful API规范

- 使用HTTP方法：GET（查询）、POST（创建）、PUT（更新）、DELETE（删除）
- 使用名词复数作为资源名称：`/api/users`、`/api/products`
- 使用HTTP状态码：200（成功）、201（创建）、400（错误）、404（未找到）、500（服务器错误）
- 使用分页：`?page=1&pageSize=10`
- 使用过滤：`?status=active&category=electronics`
- 使用排序：`?sort=createdAt&order=desc`

### 2. 响应格式

```json
// 成功响应
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}

// 错误响应
{
  "success": false,
  "error": "User not found",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

```

### 3. 安全性

- 使用HTTPS
- 使用JWT或OAuth进行认证
- 输入验证和消毒
- SQL注入防护（使用参数化查询）
- XSS防护（转义输出）
- CORS配置

## 📚 参考资源

- [Express官方文档](https://expressjs.com/)
- [TypeORM官方文档](https://typeorm.io/)
- [RESTful API设计指南](https://restfulapi.net/)
- [GraphQL官方文档](https://graphql.org/)
