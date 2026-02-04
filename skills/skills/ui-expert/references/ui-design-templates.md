# UI设计模板

本文档提供UI设计相关的模板、规范和最佳实践。

## 🎨 设计系统

### 1. 色彩系统

```css
/**
 *色彩变量定义*/

:root {
  /*主色*/
  --color-primary-50: #e6f7ff;
  --color-primary-100: #bae7ff;
  --color-primary-200: #91d5ff;
  --color-primary-300: #69c0ff;
  --color-primary-400: #40a9ff;
  --color-primary-500: #1890ff; /*主色*/
  --color-primary-600: #096dd9;
  --color-primary-700: #0050b3;
  --color-primary-800: #003a8c;
  --color-primary-900: #002766;

  /*辅助色*/
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #ff4d4f;
  --color-info: #1890ff;

  /*中性色*/
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e8e8e8;
  --color-gray-300: #d9d9d9;
  --color-gray-400: #bfbfbf;
  --color-gray-500: #8c8c8c;
  --color-gray-600: #595959;
  --color-gray-700: #434343;
  --color-gray-800: #262626;
  --color-gray-900: #1f1f1f;

  /*文字颜色*/
  --color-text-primary: rgba(0, 0, 0, 0.85);
  --color-text-secondary: rgba(0, 0, 0, 0.65);
  --color-text-tertiary: rgba(0, 0, 0, 0.45);
  --color-text-disabled: rgba(0, 0, 0, 0.25);
  
  /*背景颜色*/
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #fafafa;
  --color-bg-tertiary: #f5f5f5;

  /*边框颜色*/
  --color-border-base: #d9d9d9;
  --color-border-light: #f0f0f0;
  --color-border-dark: #bfbfbf;
}

```

### 2. 字体系统

```css
/**
 *字体变量定义*/

:root {
  /*字体族*/
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  --font-family-code: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  --font-family-number: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', 'Droid Sans Mono', 'Source Code Pro', monospace;

  /*字号*/
  --font-size-xs: 12px;   /*小字*/
  --font-size-sm: 14px;   /*正文小*/
  --font-size-base: 16px; /*正文*/
  --font-size-lg: 18px;   /*大字*/
  --font-size-xl: 20px;   /*标题小*/
  --font-size-2xl: 24px;  /*标题中*/
  --font-size-3xl: 30px;  /*标题大*/
  --font-size-4xl: 36px;  /*特大标题*/

  /*字重*/
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /*行高*/
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /*字母间距*/
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
}

```

### 3. 间距系统

```css
/**
 *间距变量定义*使用4px基准网格系统*/

:root {
  /*间距单位*/
  --space-0: 0;
  --space-1: 4px;   /`0.25rem`/
  --space-2: 8px;   /`0.5rem`/
  --space-3: 12px;  /`0.75rem`/
  --space-4: 16px;  /*1rem*/
  --space-5: 20px;  /`1.25rem`/
  --space-6: 24px;  /`1.5rem`/
  --space-8: 32px;  /*2rem*/
  --space-10: 40px; /`2.5rem`/
  --space-12: 48px; /*3rem*/
  --space-16: 64px; /*4rem*/
  --space-20: 80px; /*5rem*/
  --space-24: 96px; /*6rem*/
}

```

### 4. 圆角系统

```css
/**
 *圆角变量定义*/

:root {
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-base: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}

```

### 5. 阴影系统

```css
/**
 *阴影变量定义*/

:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --shadow-none: 0 0 #0000;
}

```

## 📐 布局模板

### 1. 响应式断点

```typescript
/**
 *断点定义*/
export enum Breakpoint {
  Mobile = 'mobile',     // < 640px
  Tablet = 'tablet',     // >= 640px && < 1024px
  Desktop = 'desktop',   // >= 1024px && < 1440px
  Wide = 'wide',         // >= 1440px
}

export const breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  wide: 1440
};

/**
 *媒体查询工具*/
export const mediaQuery = {
  mobile: `@media (max-width: ${breakpoints.tablet - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px) and (max-width: ${breakpoints.wide - 1}px)`,
  wide: `@media (min-width: ${breakpoints.wide}px)`,
  
  // 组合查询
  mobileAndTablet: `@media (max-width: ${breakpoints.desktop - 1}px)`,
  tabletAndUp: `@media (min-width: ${breakpoints.tablet}px)`,
  desktopAndUp: `@media (min-width: ${breakpoints.desktop}px)`
};

```

### 2. 网格系统

```scss
/**
 *12列网格系统*/
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;
}

// 生成列
@for $i from 1 through 12 {
  .col-#{$i} {
    flex: 0 0 calc((100% / 12) * #{$i});
    max-width: calc((100% / 12) * #{$i});
    padding: 0 8px;
  }
}

// 响应式列
@each $breakpoint in (mobile, tablet, desktop) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @for $i from 1 through 12 {
      .col-#{$breakpoint}-#{$i} {
        flex: 0 0 calc((100% / 12) * #{$i});
        max-width: calc((100% / 12) * #{$i});
      }
    }
  }
}

```

### 3. Flexbox布局类

```css
/**
 *Flexbox工具类*/

/*容器*/
.flex { display: flex; }
.flex-inline { display: inline-flex; }
.flex-row { flex-direction: row; }
.flex-row-reverse { flex-direction: row-reverse; }
.flex-col { flex-direction: column; }
.flex-col-reverse { flex-direction: column-reverse; }

/*换行*/
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.flex-wrap-reverse { flex-wrap: wrap-reverse; }

/*主轴对齐*/
.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }

/*交叉轴对齐*/
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.items-center { align-items: center; }
.items-baseline { align-items: baseline; }
.items-stretch { align-items: stretch; }

/*弹性*/
.flex-1 { flex: 1 1 0%; }
.flex-auto { flex: 1 1 auto; }
.flex-initial { flex: 0 1 auto; }
.flex-none { flex: none; }

```

## 🎯 组件模板

### 1. 按钮组件

```tsx
import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<AntButtonProps, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  block?: boolean;
  danger?: boolean;
}

/**
 *按钮组件* 
 *@example`<Button variant="primary" size="medium" onClick={handleClick}>`点击我`</Button>`/
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  loading = false,
  icon,
  block = false,
  danger = false,
  ...props
}) => {
  const antSize: SizeType = size === 'medium' ? 'middle' : size;
  
  const getButtonType = (): AntButtonProps['type'] => {
    if (danger) return 'primary';
    
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'default';
      case 'outline':
        return 'default';
      case 'text':
        return 'text';
      case 'link':
        return 'link';
      default:
        return 'primary';
    }
  };

  return (
    <AntButton
      type={getButtonType()}
      size={antSize}
      loading={loading}
      icon={icon}
      block={block}
      danger={danger && variant === 'primary'}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;

```

### 2. 卡片组件

```tsx
import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';

export interface CardProps extends AntCardProps {
  hoverable?: boolean;
  bordered?: boolean;
  loading?: boolean;
  shadow?: 'none' | 'sm' | 'base' | 'md' | 'lg';
}

/**
 *卡片组件* 
 *@example`<Card title="标题" hoverable>`内容`</Card>`/
export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  bordered = true,
  loading = false,
  shadow = 'base',
  className,
  ...props
}) => {
  const getShadowClass = () => {
    return `shadow-${shadow}`;
  };

  return (
    <AntCard
      hoverable={hoverable}
      bordered={bordered}
      loading={loading}
      className={`${getShadowClass()} ${className || ''}`}
      {...props}
    >
      {children}
    </AntCard>
  );
};

export default Card;

```

### 3. 表单组件

```tsx
import React from 'react';
import { Form as AntForm, FormProps as AntFormProps, FormItemProps as AntFormItemProps } from 'antd';
import { Input, InputProps } from 'antd';
import { Select, SelectProps } from 'antd';
import { DatePicker, DatePickerProps } from 'antd';
import { Checkbox, CheckboxProps } from 'antd';

export interface FormItemProps extends AntFormItemProps {
  label?: string;
  required?: boolean;
  tooltip?: string;
}

export interface FormFieldProps<T = any> {
  name: string;
  label?: string;
  required?: boolean;
  tooltip?: string;
  rules?: any[];
}

/**
 *表单组件*/
export const Form: React.FC<AntFormProps> = ({ children, ...props }) => {
  return (
    <AntForm layout="vertical" {...props}>
      {children}
    </AntForm>
  );
};

/**
 *表单项组件*/
export const FormItem: React.FC<FormItemProps> = ({
  label,
  required = false,
  tooltip,
  children,
  ...props
}) => {
  return (
    <AntFormItem
      label={
        <>
          {label}
          {tooltip && <span title={tooltip} className="ml-1">ℹ️</span>}
        </>
      }
      required={required}
      {...props}
    >
      {children}
    </AntFormItem>
  );
};

/**
 *文本输入组件*/
export const TextField: React.FC<FormFieldProps & InputProps> = ({
  name,
  label,
  required = false,
  tooltip,
  rules = [],
  ...props
}) => {
  return (
    <FormItem
      name={name}
      label={label}
      required={required}
      tooltip={tooltip}
      rules={[
        { required, message: `请输入${label}` },
        ...rules
      ]}
    >
      <Input {...props} />
    </FormItem>
  );
};

/**
 *选择器组件*/
export const SelectField: React.FC<FormFieldProps & SelectProps> = ({
  name,
  label,
  required = false,
  tooltip,
  rules = [],
  children,
  ...props
}) => {
  return (
    <FormItem
      name={name}
      label={label}
      required={required}
      tooltip={tooltip}
      rules={[
        { required, message: `请选择${label}` },
        ...rules
      ]}
    >
      <Select {...props}>{children}</Select>
    </FormItem>
  );
};

/**
 *日期选择器组件*/
export const DateField: React.FC<FormFieldProps & DatePickerProps> = ({
  name,
  label,
  required = false,
  tooltip,
  rules = [],
  ...props
}) => {
  return (
    <FormItem
      name={name}
      label={label}
      required={required}
      tooltip={tooltip}
      rules={[
        { required, message: `请选择${label}` },
        ...rules
      ]}
    >
      <DatePicker {...props} />
    </FormItem>
  );
};

export default Form;

```

## 📱 页面模板

### 1. 登录页面

```tsx
import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import './LoginPage.css';

/**
 *登录页面*/
export const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { login, loading } = useAuth();

  const handleSubmit = async (values: any) => {
    try {
      await login(values.username, values.password);
      message.success('登录成功');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card" hoverable={false}>
        <div className="login-header">
          <h1 className="login-title">欢迎回来</h1>
          <p className="login-subtitle">请登录您的账户</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <a href="/forgot-password">忘记密码？</a>
          <a href="/register">注册新账户</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

```

```css
/**
 *登录页面样式*/
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 32px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 16px;
  color: #8c8c8c;
  margin: 0;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  font-size: 14px;
}

.login-footer a {
  color: #1890ff;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

```

### 2. 列表页面

```tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Card } from '@/components/ui/Card';
import { Button as CustomButton } from '@/components/ui/Button';

interface TableParams {
  pagination: TablePaginationConfig;
  filters: Record<string, any>;
  sorter: Record<string, any>;
}

/**
 *列表页面模板*/
export const ListPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
    sorter: {},
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      // 替换为实际的API调用
      const response = await fetch(
        `/api/data?page=${tableParams.pagination.current}&pageSize=${tableParams.pagination.pageSize}`
      );
      const result = await response.json();
      
      setData(result.data);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: result.total,
        },
      });
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span>{status === 'active' ? '启用' : '禁用'}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <CustomButton variant="text" size="small">
            编辑
          </CustomButton>
          <CustomButton variant="text" size="small" danger>
            删除
          </CustomButton>
        </Space>
      ),
    },
  ];

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination: newPagination,
    });
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    // 执行搜索逻辑
  };

  return (
    <div className="list-page">
      <Card>
        <div className="page-header">
          <h2 className="page-title">数据列表</h2>
          <Space>
            <Input
              placeholder="搜索..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <CustomButton variant="primary" icon={<PlusOutlined />}>
              新增
            </CustomButton>
          </Space>
        </div>

        <Table
          columns={columns}
          rowKey="id"
          dataSource={data}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default ListPage;

```

## 📚 参考资料

- 《写给大家看的设计书》- Robin Williams
- 《设计心理学》- Donald A. Norman
- 《用户体验要素》- Jesse James Garrett
- Ant Design文档
- Material Design指南
