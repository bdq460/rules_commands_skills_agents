# 前端组件模板

本文档包含常用的前端组件模板，供前端工程师使用。

## React组件模板

### 1. 函数式组件（TypeScript）

```tsx
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';

interface ComponentProps {
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 *组件说明* @param title - 组件标题
 `@param onConfirm - 确认回调` @param onCancel - 取消回调
 */
const Component: React.FC<ComponentProps> = ({ title, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // 组件挂载时执行
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm?.();
      message.success('操作成功');
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component">
      <h2>{title}</h2>
      <Button type="primary" onClick={handleConfirm} loading={loading}>
        确认
      </Button>
      <Button onClick={onCancel}>取消</Button>
    </div>
  );
};

export default Component;

```

### 2. 带Hooks的组件

```tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 *自定义Hook示例*/
const useData = (url: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

const ComponentWithHooks: React.FC = () => {
  const { data, loading, error, refetch } = useData('/api/data');

  const memoizedData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {memoizedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={refetch}>刷新</button>
    </div>
  );
};

export default ComponentWithHooks;

```

## Vue组件模板

### 1. Vue 3 组合式API（TypeScript）

```vue
<template>
  <div class="component">
    <h2>{{ title }}</h2>
    <a-button type="primary" :loading="loading" @click="handleConfirm">
      确认
    </a-button>
    <a-button @click="handleCancel">取消</a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';

interface Props {
  title: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const loading = ref(false);
const data = ref<any[]>([]);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await fetch('/api/data');
    const result = await response.json();
    data.value = result;
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

const handleConfirm = async () => {
  try {
    loading.value = true;
    emit('confirm');
    message.success('操作成功');
  } catch (error) {
    message.error('操作失败');
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.component {
  padding: 20px;
}
</style>

```

## 最佳实践

### 1. 组件命名

- 使用大驼峰命名法（PascalCase）
- 名称应清晰表达组件功能
- 避免使用缩写

### 2. Props定义

- 使用TypeScript定义Props类型
- 提供默认值
- 明确必需和可选的Props

### 3. 事件处理

- 使用语义化的事件名（onXxx）
- 事件名使用小驼峰命名法
- 提供清晰的参数类型

### 4. 状态管理

- 简单状态使用useState或ref
- 复杂状态使用状态管理库
- 避免不必要的状态

### 5. 性能优化

- 使用React.memo或computed进行优化
- 使用useCallback和useMemo缓存函数和计算结果
- 避免不必要的重渲染

## 常用组件库

### Ant Design (React)

```bash
npm install antd @ant-design/icons

```

```tsx
import { Button, Table, Form, Input } from 'antd';

```

### Element Plus (Vue)

```bash
npm install element-plus @element-plus/icons-vue

```

```vue
<template>
  <el-button type="primary">按钮</el-button>
  <el-table :data="tableData"></el-table>
</template>

```

## 参考资源

- [React官方文档](https://react.dev)
- [Vue官方文档](https://vuejs.org)
- [Ant Design](https://ant.design)
- [Element Plus](https://element-plus.org)
