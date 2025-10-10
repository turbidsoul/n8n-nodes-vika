/* eslint-disable n8n-nodes-base/node-param-description-miscased-id */
/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items */
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { Vika } from '@vikadata/vika';

/**
 * 维格表格节点类
 * 提供维格表格数据表的CRUD操作功能
 */
export class VikaNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: '维格表格',
		name: 'vika',
		icon: 'file:vika.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: '与维格表格进行交互，支持数据表的增删改查操作',
		defaults: {
			name: '维格表格',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'vikaApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// 资源选择
			{
				displayName: '资源',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: '记录',
						value: 'record',
					},
				],
				default: 'record',
			},
			// 操作选择
			{
				displayName: '操作',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: '获取记录',
						value: 'get',
						description: '获取数据表中的记录',
						action: '获取记录',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: '获取数据表中的所有记录',
						action: '获取所有记录',
					},
					{
						name: '创建记录',
						value: 'create',
						description: '在数据表中创建新记录',
						action: '创建记录',
					},
					{
						name: '更新记录',
						value: 'update',
						description: '更新数据表中的记录',
						action: '更新记录',
					},
					{
						name: '删除记录',
						value: 'delete',
						description: '删除数据表中的记录',
						action: '删除记录',
					},
				],
				default: 'getAll',
			},
			// 数据表ID
			{
				displayName: '数据表ID',
				name: 'datasheetId',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'dst1234567890',
				description: '维格表格数据表的ID，可在数据表URL中找到',
			},
			// 记录ID（用于获取、更新、删除单个记录）
			{
				displayName: '记录ID',
				name: 'recordId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				placeholder: 'rec1234567890',
				description: '要操作的记录ID',
			},
			// 字段映射（用于创建和更新记录）
			{
				displayName: '字段',
				name: 'fields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				placeholder: '添加字段',
				options: [
					{
						name: 'field',
						displayName: '字段',
						values: [
							{
								displayName: '字段名',
								name: 'name',
								type: 'string',
								default: '',
								description: '字段的名称或ID',
							},
							{
								displayName: '字段值',
								name: 'value',
								type: 'string',
								default: '',
								description: '字段的值',
							},
						],
					},
				],
			},
			// 查询选项
			{
				displayName: '查询选项',
				name: 'options',
				type: 'collection',
				placeholder: '添加选项',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['getAll'],
					},
				},
				default: {},
				options: [
					{
						displayName: '视图ID',
						name: 'viewId',
						type: 'string',
						default: '',
						description: '指定视图ID来获取特定视图的记录',
					},
					{
						displayName: '字段',
						name: 'fields',
						type: 'string',
						default: '',
						description: '指定要返回的字段，多个字段用逗号分隔',
					},
					{
						displayName: '排序',
						name: 'sort',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'sortField',
								displayName: '排序字段',
								values: [
									{
										displayName: '字段名',
										name: 'field',
										type: 'string',
										default: '',
									},
									{
										displayName: '排序方向',
										name: 'order',
										type: 'options',
										options: [
											{
												name: '升序',
												value: 'asc',
											},
											{
												name: '降序',
												value: 'desc',
											},
										],
										default: 'asc',
									},
								],
							},
						],
					},
					{
						displayName: '最大记录数',
						name: 'maxRecords',
						type: 'number',
						default: '',
						description: '总共返回多少条记录。如果maxRecords与pageSize同时使用，且maxRecords的值小于总记录数，则只生效maxRecords的设置',
					},
					{
						displayName: '页面大小',
						name: 'pageSize',
						type: 'number',
						default: 100,
						description: '每页返回多少条记录。默认每页返回100条记录。取值范围为1~1000的整数',
					},
					{
						displayName: '页码',
						name: 'pageNum',
						type: 'number',
						default: 1,
						description: '指定分页的页码，与参数pageSize配合使用。例如pageSize=1000&pageNum=2，返回1001～2000之间的记录',
					},
					{
						displayName: '记录ID列表',
						name: 'recordIds',
						type: 'string',
						default: '',
						description: '返回指定的记录。多个记录ID用逗号分隔，例如：rec4zxfWB5uyM,reclNflLgtzjY。返回结果按照传入recordId的顺序排序。无分页，每次最多返回1000条记录',
					},
					{
						displayName: '筛选公式',
						name: 'filterByFormula',
						type: 'string',
						default: '',
						description: '使用智能公式来筛选记录。如果filterByFormula与viewId同时使用，则会返回指定视图中满足此公式的所有记录。例如：{标题}="标题1"',
					},
					{
						displayName: '单元格格式',
						name: 'cellFormat',
						type: 'options',
						options: [
							{
								name: 'JSON',
								value: 'json',
							},
							{
								name: '字符串',
								value: 'string',
							},
						],
						default: 'json',
						// eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-json
						description: '单元格中值的类型，默认为json类型。指定为string时，所有值都会自动转换为字符串格式',
					},
					{
						displayName: '字段键类型',
						name: 'fieldKey',
						type: 'options',
						options: [
							{
								name: '字段名称',
								value: 'name',
							},
							{
								name: '字段ID',
								value: 'id',
							},
						],
						default: 'name',
						description: '查询字段和返回字段时所用的key。默认使用name（字段名称）。指定为id时将以fieldId作为查询和返回方式（使用id可以避免因修改字段名称而导致的代码失效问题）',
					},
				],
			},
		],
	};

	/**
	 * 执行节点操作
	 * @param this 执行函数上下文
	 * @returns 执行结果数据
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// 获取凭据
		const credentials = await this.getCredentials('vikaApi');
		const vika = new Vika({ token: credentials.apiToken as string });

		// 获取操作参数
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		try {
			for (let i = 0; i < items.length; i++) {
				if (resource === 'record') {
					const datasheetId = this.getNodeParameter('datasheetId', i) as string;
					const datasheet = vika.datasheet(datasheetId);

					let responseData: any;

					switch (operation) {
						case 'get':
							// 获取单个记录
							const recordId = this.getNodeParameter('recordId', i) as string;
							const record = await datasheet.records.get(recordId);
							responseData = record.data;
							break;

						case 'getAll':
							// 获取所有记录
							const options = this.getNodeParameter('options', i) as any;
							const queryParams: any = {};

							// 构建查询参数
							if (options.viewId) {
								queryParams.viewId = options.viewId;
							}
							if (options.fields) {
								queryParams.fields = options.fields.split(',').map((f: string) => f.trim());
							}
							if (options.sort && options.sort.sortField) {
								queryParams.sort = options.sort.sortField.map((s: any) => ({
									field: s.field,
									order: s.order,
								}));
							}
							if (options.maxRecords) {
								queryParams.maxRecords = options.maxRecords;
							}
							if (options.pageSize) {
								queryParams.pageSize = options.pageSize;
							}
							if (options.pageNum) {
								queryParams.pageNum = options.pageNum;
							}
							if (options.recordIds) {
								queryParams.recordIds = options.recordIds.split(',').map((id: string) => id.trim());
							}
							if (options.filterByFormula) {
								queryParams.filterByFormula = options.filterByFormula;
							}
							if (options.cellFormat) {
								queryParams.cellFormat = options.cellFormat;
							}
							if (options.fieldKey) {
								queryParams.fieldKey = options.fieldKey;
							}

							const records = await datasheet.records.query(queryParams);
							responseData = records.data;
							break;

						case 'create':
							// 创建记录
							const createFields = this.getNodeParameter('fields', i) as any;
							const createData: any = {};

							// 构建字段数据
							if (createFields.field) {
								for (const field of createFields.field) {
									createData[field.name] = field.value;
								}
							}

							const createResult = await datasheet.records.create([{ fields: createData }]);
							responseData = createResult.data;
							break;

						case 'update':
							// 更新记录
							const updateRecordId = this.getNodeParameter('recordId', i) as string;
							const updateFields = this.getNodeParameter('fields', i) as any;
							const updateData: any = {};

							// 构建字段数据
							if (updateFields.field) {
								for (const field of updateFields.field) {
									updateData[field.name] = field.value;
								}
							}

							const updateResult = await datasheet.records.update([
								{
									recordId: updateRecordId,
									fields: updateData,
								},
							]);
							responseData = updateResult.data;
							break;

						case 'delete':
							// 删除记录
							const deleteRecordId = this.getNodeParameter('recordId', i) as string;
							const deleteResult = await datasheet.records.delete([deleteRecordId]);
							responseData = deleteResult.data;
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`不支持的操作: ${operation}`,
								{ itemIndex: i }
							);
					}

					// 处理返回数据
					if (Array.isArray(responseData)) {
						// 如果返回的是数组，为每个项目创建一个输出项
						for (const item of responseData) {
							returnData.push({
								json: item,
								pairedItem: { item: i },
							});
						}
					} else {
						// 如果返回的是单个对象
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}
				}
			}
		} catch (error) {
			// 错误处理
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: 0 },
				});
			} else {
				throw new NodeOperationError(this.getNode(), error as Error);
			}
		}

		return [returnData];
	}
}

// 为了兼容n8n的加载机制，导出为Vika
export { VikaNode as Vika };
