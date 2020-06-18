import request from '../utils/request';

//主服务获取所有配置
export function getSetting () {
    return request({
        url: '/admin/config/query',
        method: 'GET'
    });
}

//主服务保存配置 
export function saveSetting (data: {configs: object}) {
    return request({
        url: '/admin/config/save',
        method: 'POST',
        data
    });
}

//钱包获取所有配置
export function getWalletSetting () {
    return request({
        url: "/wallet/admin/config/query",
        method: "GET"
    });
}

//钱包保存配置
export function saveWalletSetting (data: {
    configs: object
}) {
    return request({
        url: "/wallet/admin/config/save",
        method: "POST",
        data
    });
}
