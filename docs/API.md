# 维格表格 n8n 节点 API 文档

## 概述

维格表格 n8n 节点提供了与维格表格(Vika)平台的完整集成，支持对数据表进行增删改查操作。

## 凭据配置

### VikaApi 凭据

在使用维格表格节点之前，需要配置API凭据：

| 字段名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| API Token | string | 是 | - | 维格表格的API Token，可在维格表格工作台的开发者配置中获取 |
| Base URL | string | 否 | https://api.vika.cn | 维格表格API的基础URL |

#### 获取 API Token

1. 登录维格表格工作台
2. 进入"开发者配置"页面
3. 创建或查看现有的API Token
4. 复制Token并粘贴到n8n凭据配置中

## 节点操作

### 资源类型

- **记录 (record)**: 对数据表中的记录进行操作

### 支持的操作

#### 1. 获取记录 (get)

获取数据表中的单个记录。

**参数:**
- `datasheetId` (string, 必填): 数据表ID
- `recordId` (string, 必填): 记录ID

**返回值:**
```json
{
  "recordId": "rec1234567890",
  "fields": {
    "字段名1": "字段值1",
    "字段名2": "字段值2"
  },
  "createdTime": "2023-01-01T00:00:00.000Z"
}
```

#### 2. 获取所有记录 (getAll)

获取数据表中的所有记录，支持筛选和排序。

**参数:**
- `datasheetId` (string, 必填): 数据表ID
- `options` (object, 可选): 查询选项
  - `viewId` (string): 视图ID
  - `fields` (string): 指定返回的字段，多个字段用逗号分隔
  - `sort` (array): 排序配置
    - `field` (string): 排序字段名
    - `order` (string): 排序方向 ('asc' | 'desc')
  - `maxRecords` (number): 最大记录数，默认100
  - `pageSize` (number): 每页记录数，默认100

**返回值:**
```json
[
  {
    "recordId": "rec1234567890",
    "fields": {
      "字段名1": "字段值1",
      "字段名2": "字段值2"
    },
    "createdTime": "2023-01-01T00:00:00.000Z"
  }
]
```

#### 3. 创建记录 (create)

在数据表中创建新记录。

**参数:**
- `datasheetId` (string, 必填): 数据表ID
- `fields` (array, 必填): 字段配置
  - `name` (string): 字段名称或ID
  - `value` (string): 字段值

**返回值:**
```json
[
  {
    "recordId": "rec1234567890",
    "fields": {
      "字段名1": "字段值1",
      "字段名2": "字段值2"
    },
    "createdTime": "2023-01-01T00:00:00.000Z"
  }
]
```

#### 4. 更新记录 (update)

更新数据表中的现有记录。

**参数:**
- `datasheetId` (string, 必填): 数据表ID
- `recordId` (string, 必填): 记录ID
- `fields` (array, 必填): 字段配置
  - `name` (string): 字段名称或ID
  - `value` (string): 字段值

**返回值:**
```json
[
  {
    "recordId": "rec1234567890",
    "fields": {
      "字段名1": "新字段值1",
      "字段名2": "新字段值2"
    },
    "updatedTime": "2023-01-01T00:00:00.000Z"
  }
]
```

#### 5. 删除记录 (delete)

删除数据表中的记录。

**参数:**
- `datasheetId` (string, 必填): 数据表ID
- `recordId` (string, 必填): 记录ID

**返回值:**
```json
{
  "deleted": true,
  "recordId": "rec1234567890"
}
```

## 错误处理

节点支持错误处理模式：

- **停止执行**: 遇到错误时停止工作流执行
- **继续执行**: 遇到错误时继续执行，错误信息会包含在输出中

错误输出格式：
```json
{
  "error": "错误描述信息"
}
```

## 使用示例

### 示例1: 获取所有记录

```json
{
  "resource": "record",
  "operation": "getAll",
  "datasheetId": "dst1234567890",
  "options": {
    "maxRecords": 50,
    "sort": [
      {
        "field": "创建时间",
        "order": "desc"
      }
    ]
  }
}
```

### 示例2: 创建记录

```json
{
  "resource": "record",
  "operation": "create",
  "datasheetId": "dst1234567890",
  "fields": [
    {
      "name": "姓名",
      "value": "张三"
    },
    {
      "name": "邮箱",
      "value": "zhangsan@example.com"
    }
  ]
}
```

### 示例3: 更新记录

```json
{
  "resource": "record",
  "operation": "update",
  "datasheetId": "dst1234567890",
  "recordId": "rec1234567890",
  "fields": [
    {
      "name": "状态",
      "value": "已完成"
    }
  ]
}
```

## 注意事项

1. **API限制**: 维格表格API有请求频率限制，请合理控制请求频率
2. **字段类型**: 不同字段类型需要传入相应格式的数据
3. **权限**: 确保API Token具有对应数据表的操作权限
4. **数据格式**: 日期、数字等特殊字段类型需要按照维格表格的格式要求传入

## 相关链接

- [维格表格官方文档](https://developers.vika.cn/)
- [维格表格API参考](https://developers.vika.cn/api/introduction)
- [n8n官方文档](https://docs.n8n.io/)