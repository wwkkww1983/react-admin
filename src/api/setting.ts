import request from '../utils/request';

//获取所有配置
export function getSetting () {
    return request({
        url: '/admin/config/query',
        method: 'GET'
    });
}

//保存配置
export function saveSetting (data: {configs: object}) {
    return request({
        url: '/admin/config/save',
        method: 'POST',
        data
    });
}