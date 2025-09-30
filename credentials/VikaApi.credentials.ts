import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * 维格表格API凭据配置类
 * 用于配置和验证维格表格API访问凭据
 */
export class VikaApi implements ICredentialType {
	name = 'vikaApi';
	displayName = '维格表格 API';

	// 维格表格API文档链接
	documentationUrl = 'https://developers.vika.cn/api/introduction';

	/**
	 * 凭据属性配置
	 * 定义用户需要输入的凭据信息
	 */
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: '维格表格的API Token，可在维格表格工作台的开发者配置中获取',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://vika.cn',
			description: '维格表格API的基础URL，通常使用默认值',
		},
	];

	/**
	 * 认证配置
	 * 定义如何使用凭据进行API认证
	 */
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{ $credentials.apiToken }}',
			},
		},
	};

	/**
	 * 凭据测试配置
	 * 用于验证凭据是否有效
	 */
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/fusion/v1/spaces',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: '凭据测试成功',
					key: 'success',
					value: true,
				},
			},
		],
	};
}
