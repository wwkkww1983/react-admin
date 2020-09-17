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