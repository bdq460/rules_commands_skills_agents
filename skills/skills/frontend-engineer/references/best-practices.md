# 前端工程最佳实践

本文档提供前端开发的最佳实践指南，涵盖组件设计、状态管理、性能优化、可访问性等方面。

## 目录

1. [组件设计](#组件设计)
2. [状态管理](#状态管理)
3. [样式管理](#样式管理)
4. [性能优化](#性能优化)
5. [可访问性](#可访问性)
6. [测试策略](#测试策略)
7. [代码组织](#代码组织)

---

## 组件设计

### 1. 组件设计原则

**单一职责原则**

```typescript
// ✅ 推荐：组件职责单一
// UserCard组件：只负责展示用户卡片
interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="user-card">
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo name={user.name} email={user.email} />
    </div>
  );
};

// Avatar组件：只负责头像
interface AvatarProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'medium' }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`avatar avatar-${size}`}
    />
  );
};

// ❌ 避免：组件职责过多
export const UserCard: React.FC<{ user: User }> = ({ user }) => {
  // 同时负责展示、验证、提交、网络请求...职责过多
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await updateUser(user);
    setLoading(false);
  };

  // ...
};
```

**组件复用**

```typescript
// ✅ 推荐：通过props配置实现复用
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  loading,
  disabled,
  children,
  onClick
}) => {
  return (
    <button
      className={`button button-${variant} button-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

// 使用
<Button variant="primary" size="medium" loading={isLoading}>
  提交
</Button>
```

### 2. Props设计

**使用TypeScript类型**

```typescript
// ✅ 推荐：明确的类型定义
interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onEdit?: () => void;
  onAvatarClick?: () => void;
  editable?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onEdit,
  onAvatarClick,
  editable = false
}) => {
  // ...
};

// ❌ 避免：使用any或过于宽松的类型
interface UserProfileProps {
  user: any; // 避免
  onEdit?: any; // 避免
}
```

**Props验证**

```typescript
// ✅ 推荐：使用PropTypes或Zod进行运行时验证
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(120).optional(),
});

type User = z.infer<typeof UserSchema>;

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // 使用
  const validatedUser = UserSchema.parse(user);
  // ...
};
```

### 3. 组件组合

```typescript
// ✅ 推荐：使用组合模式
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export const List = <T,>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) => {
  if (items.length === 0 && emptyMessage) {
    return <div className="list-empty">{emptyMessage}</div>;
  }

  return (
    <div className="list">
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

// 使用
<List
  items={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
  emptyMessage="暂无用户"
/>
```

---

## 状态管理

### 1. 本地状态

```typescript
// ✅ 推荐：使用useState管理组件内部状态
export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  return (
    <div className="counter">
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
};
```

### 2. 表单状态

```typescript
// ✅ 推荐：使用受控组件
interface FormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

export const UserForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 清除该字段的错误
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // 验证
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = '姓名不能为空';
    if (!formData.email) newErrors.email = '邮箱不能为空';
    if (!formData.email.includes('@')) newErrors.email = '邮箱格式不正确';
    if (!formData.password) newErrors.password = '密码不能为空';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="name">姓名</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      {/* 其他字段... */}

      <button type="submit">提交</button>
    </form>
  );
};
```

### 3. 全局状态

```typescript
// ✅ 推荐：使用Context API或状态管理库
// Context API示例
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// 使用
export const ThemedComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`themed-component ${theme}`}>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
};
```

---

## 样式管理

### 1. CSS Modules

```typescript
// ✅ 推荐：使用CSS Modules
import styles from './UserCard.module.css';

export const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={user.avatar} alt={user.name} className={styles.avatar} />
        <h3 className={styles.name}>{user.name}</h3>
      </div>
      <p className={styles.email}>{user.email}</p>
    </div>
  );
};
```

### 2. Styled Components

```typescript
// ✅ 推荐：使用styled-components
import styled from 'styled-components';

const Card = styled.div<{ $variant?: 'primary' | 'secondary' }>`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.$variant === 'primary' ? '#007bff' : '#6c757d'};
  background: ${props => props.$variant === 'primary' ? '#e7f3ff' : '#f8f9fa'};
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
`;

export const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <Card $variant="primary">
      <img src={user.avatar} alt={user.name} />
      <Title>{user.name}</Title>
      <p>{user.email}</p>
    </Card>
  );
};
```

### 3. 响应式设计

```typescript
// ✅ 推荐：使用媒体查询
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    padding: 5px;
  }
`;

export const ResponsiveComponent: React.FC = () => {
  return <Container>响应式内容</Container>;
};
```

---

## 性能优化

### 1. 组件记忆化

```typescript
// ✅ 推荐：使用React.memo、useMemo、useCallback
interface UserListProps {
  users: User[];
  onUserClick: (user: User) => void;
}

// 使用React.memo防止不必要的重渲染
export const UserList = React.memo<UserListProps>(({ users, onUserClick }) => {
  // 使用useMemo缓存计算结果
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // 使用useCallback缓存回调函数
  const handleClick = useCallback((user: User) => {
    onUserClick(user);
  }, [onUserClick]);

  return (
    <div className="user-list">
      {sortedUsers.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onClick={() => handleClick(user)}
        />
      ))}
    </div>
  );
});
```

### 2. 代码分割

```typescript
// ✅ 推荐：使用React.lazy和Suspense
import React, { lazy, Suspense } from 'react';

// 延迟加载组件
const UserForm = lazy(() => import('./UserForm'));
const UserList = lazy(() => import('./UserList'));

export const App: React.FC = () => {
  return (
    <div className="app">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
        </Routes>
      </Suspense>
    </div>
  );
};
```

### 3. 虚拟化长列表

```typescript
// ✅ 推荐：使用react-window或react-virtualized
import { FixedSizeList as List } from 'react-window';

interface VirtualListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
}

export const VirtualList: React.FC<VirtualListProps> = ({ items, renderItem }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    return (
      <div style={style}>
        {renderItem(items[index], index)}
      </div>
    );
  };

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

---

## 可访问性

### 1. 语义化HTML

```typescript
// ✅ 推荐：使用语义化标签
export const Page: React.FC = () => {
  return (
    <div className="page">
      <header>
        <nav>
          <ul>
            <li><a href="/">首页</a></li>
            <li><a href="/about">关于</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section>
          <h1>欢迎</h1>
          <p>这是一个页面</p>
        </section>
      </main>

      <footer>
        <p>&copy; 2026</p>
      </footer>
    </div>
  );
};
```

### 2. ARIA属性

```typescript
// ✅ 推荐：使用ARIA属性增强可访问性
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <header>
          <h2 id="modal-title">{title}</h2>
          <button
            aria-label="关闭"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
```

### 3. 键盘导航

```typescript
// ✅ 推荐：支持键盘导航
export const Dropdown: React.FC = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (isOpen && focusedIndex >= 0) {
          onSelect(options[focusedIndex]);
        }
        setIsOpen(!isOpen);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, focusedIndex, options, onSelect]);

  return (
    <div className="dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        选择选项
      </button>
      {isOpen && (
        <ul role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={index === focusedIndex}
              onClick={() => onSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

---

## 测试策略

### 1. 组件测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCard from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'avatar.jpg'
  };

  it('应该渲染用户信息', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('点击时应该调用onClick回调', () => {
    const handleClick = jest.fn();
    render(<UserCard user={mockUser} onClick={handleClick} />);

    fireEvent.click(screen.getByText('John Doe'));
    expect(handleClick).toHaveBeenCalledWith(mockUser);
  });

  it('应该渲染用户头像', () => {
    render(<UserCard user={mockUser} />);

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'avatar.jpg');
  });
});
```

### 2. 集成测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserForm from './UserForm';

describe('UserForm集成测试', () => {
  it('应该成功提交表单', async () => {
    const handleSubmit = jest.fn().mockResolvedValue({});
    render(<UserForm onSubmit={handleSubmit} />);

    // 填写表单
    fireEvent.change(screen.getByLabelText('姓名'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' }
    });

    // 提交
    fireEvent.click(screen.getByRole('button', { name: /提交/i }));

    // 验证
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    });
  });

  it('应该显示验证错误', () => {
    const handleSubmit = jest.fn();
    render(<UserForm onSubmit={handleSubmit} />);

    // 提交空表单
    fireEvent.click(screen.getByRole('button', { name: /提交/i }));

    // 验证错误消息
    expect(screen.getByText('姓名不能为空')).toBeInTheDocument();
    expect(screen.getByText('邮箱不能为空')).toBeInTheDocument();
    expect(screen.getByText('密码不能为空')).toBeInTheDocument();

    // 不应该调用onSubmit
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
```

---

## 代码组织

### 1. 目录结构

```text
src/
├── components/          # 通用组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   ├── Input/
│   └── Modal/
├── features/            # 功能模块
│   ├── user/
│   │   ├── components/
│   │   │   ├── UserCard/
│   │   │   ├── UserForm/
│   │   │   └── UserList/
│   │   ├── hooks/
│   │   │   ├── useUser.ts
│   │   │   └── useUsers.ts
│   │   ├── services/
│   │   │   └── userService.ts
│   │   ├── types/
│   │   │   └── user.ts
│   │   └── index.ts
│   └── product/
├── hooks/               # 自定义Hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── utils/               # 工具函数
│   ├── format.ts
│   ├── validation.ts
│   └── date.ts
├── constants/           # 常量
│   └── api.ts
├── styles/              # 全局样式
│   ├── global.css
│   └── variables.css
├── types/               # 全局类型
│   └── index.ts
├── App.tsx
└── main.tsx
```

### 2. 命名规范

```typescript
// 组件文件：PascalCase
// UserCard.tsx, Button.tsx, Modal.tsx

// Hooks文件：use前缀，camelCase
// useAuth.ts, useUser.ts, useLocalStorage.ts

// 工具函数：camelCase
// format.ts, validation.ts, date.ts

// 常量：UPPER_SNAKE_CASE
// API_BASE_URL, MAX_RETRY_COUNT

// 类型/接口：PascalCase
// User, UserProps, ApiResponse

// 枚举：PascalCase，成员UPPER_SNAKE_CASE
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}
```

---

## 总结

遵循这些最佳实践，可以构建：

- ✅ **可维护的组件**: 单一职责、良好设计
- ✅ **高效的状态管理**: 合理的本地和全局状态
- ✅ **优美的样式**: 模块化、响应式
- ✅ **高性能的应用**: 记忆化、代码分割、虚拟化
- ✅ **可访问的界面**: ARIA、键盘导航、语义化
- ✅ **高质量的代码**: 完善的测试、良好的组织

持续学习和改进这些实践，可以不断提升前端开发的质量和效率。
