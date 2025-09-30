/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VikaApi = void 0;
class VikaApi {
    constructor() {
        this.name = 'vikaApi';
        this.displayName = '维格表格 API';
        this.documentationUrl = 'https://developers.vika.cn/api/introduction';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{ $credentials.apiToken }}',
                },
            },
        };
        this.test = {
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
}
exports.VikaApi = VikaApi;

})();

module.exports = __webpack_exports__;
/******/ })()
;