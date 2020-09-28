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
    regions: {
        cityCode: number|string,
        adCode:   number|string,
        province: number|string,
        city:     number|string,
        district: number|string,
        address:  string
    }[]
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
    regions: {
        cityCode: number|string,
        adCode:   number|string,
        province: number|string,
        city:     number|string,
        district: number|string,
        address:  string
    }[]
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

/**
 * 获取员工列表 
 */
export function getStaffList (data: {
    q?: string, //	搜索：姓名模糊搜索/手机号精确搜索		[string]		
    agentId?: string|number, //	代理商ID，传了该字段就查询该代理商下的员工		[int]		
    storeId?: number|string, //	门店ID，传了该字段就查询该门店下的员工		[int]		
    page: number, //	页码		[int]	1	查看
    limit: number, //	每页数量		[int]	15
}) {
    return request({
        url: "/storeStaff/admin/manager/query",
        method: "GET",
        params: data
    });
}

/**
 * 新增员工 
 */
export function addStaff (data: {
    name: string,// 姓名
    phone: string// 手机号
    agentId: string|number //代理商id
}) {    
    return request({
        url: "/storeStaff/admin/manager/create",
        method: "POST",
        data
    });
}

/**
 * 编辑员工 
 */
export function editStaff (data: {
    id: string|number,
    name: string,// 姓名
    phone: string// 手机号
}) {    
    return request({
        url: "/storeStaff/admin/manager/update",
        method: "POST",
        data
    });
}

/**
 * 删除员工 
 */
export function delStaff (data: {
    id: string|number
}) {
    return request({
        url: "/storeStaff/admin/manager/delete",
        method: "POST",
        data
    });
}

/**
 * 绑员工到代理商 
 */
export function bindAgent (data: {
    "staffId": number|string,// 员工ID
    "agentId": number|string// 代理商ID
}) {
    return request({
        url: "/storeStaff/admin/manager/bindAgent",
        method: "POST",
        data
    });
}

/**
 * 解绑员工从代理商 
 */
export function unbindAgent (data: {
    "staffId": number|string,// 员工ID
    "agentId": number|string// 代理商ID
}) {
    return request({
        url: "/storeStaff/admin/manager/unbindAgent",
        method: "POST",
        data
    });
}

/**
 * 绑员工到门店
 */
export function bindStore (data: {
    "staffId": number|string,// 员工ID
    "storeId": number|string// 代理商ID
}) {
    return request({
        url: "/storeStaff/admin/manager/bindStore",
        method: "POST",
        data
    });
}

/**
 * 绑员工到门店
 */
export function unbindStore (data: {
    "staffId": number|string,// 员工ID
    "storeId": number|string// 代理商ID
}) {
    return request({
        url: "/storeStaff/admin/manager/unbindStore",
        method: "POST",
        data
    });
}