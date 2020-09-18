import request from '../utils/request';

/**
 * 获取代理商列表
 */
export function getAgentList (data: {
    q: string,
    page: number,
    limit: number
}) {
    return request({
        url: "/agent/admin/manager/query",
        method: "GET",
        params: data
    });
}

/**
 * 新增代理商
 */
export function addAgent (data: {
    leshua: {
        config: {
            merchantId: number|string,
            key: string|number
        }
    },
    name:     string,
    phone:    string,
    cityCode: number|string,
    adCode:   number|string,
    province: number|string,
    city:     number|string,
    district: number|string,
    address:  string
}) {
    return request({
        url: "/agent/admin/manager/create",
        method: "POST",
        data
    });
}

/**
 * 编辑代理商 
 */
export function editAgent (data: {
    id: string|number,
    leshua: {
        config: {
            merchantId: number|string,
            key: string|number
        }
    },
    name:     string,
    phone:    string,
    cityCode: number|string,
    adCode:   number|string,
    province: number|string,
    city:     number|string,
    district: number|string,
    address:  string
}) {
    return request({
        url: "/agent/admin/manager/update",
        method: "POST",
        data
    });
}

/**
 * 删除代理商 
 */
export function delAgent (data: {
    id: string|number
}) {
    return request({
        url: "/agent/admin/manager/delete",
        method: "POST",
        data
    });
}

/**
 * 获取门店列表 
 */
export function getStoreList (data: {
    q: string,
    p: number,
    limit: number
}) {
    return request({
        url: "/store/admin/manager/query",
        method: "GET",
        params: data
    });
}

/**
 * 新增门店
 */
export function addStore (data: {
    "agentId": string,// 代理商ID
    "name": string,// 门店名称
    "longitude": number|string,// 纬度
    "latitude": number|string,// 经度
    "cityCode": number|string,// 城市编码
    "adCode": number|string,// 区域编码
    "province": number|string,// 省
    "city": string|number,// 市
    "district": string|number,// 区
    "address": string|number// 详细地址
}) {
    return request({
        url: "/store/admin/manager/create",
        method: "POST",
        data
    });
}

/**
 * 编辑门店
 */
export function editStore (data: {
    "id": number|string,// 门店ID
    "agentId": string,// 代理商ID
    "name": string,// 门店名称
    "longitude": number|string,// 纬度
    "latitude": number|string,// 经度
    "cityCode": number|string,// 城市编码
    "adCode": number|string,// 区域编码
    "province": number|string,// 省
    "city": string|number,// 市
    "district": string|number,// 区
    "address": string|number// 详细地址
}) {
    return request({
        url: "/store/admin/manager/update",
        method: "POST",
        data
    });
}

/**
 * 删除门店
 */
export function delStore (data: {
    "id": number|string,// 门店ID
}) {
    return request({
        url: "/store/admin/manager/delete",
        method: "POST",
        data
    });
}
