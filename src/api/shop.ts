import request from '../utils/request';

/**
 * 查询商城产品列表 
 */
export function productList (data: {
    type: number, //	产品类型；0-全部；1-商品；2-组合商品		[int]		
    q?: string, //	标题模糊搜索词		[string]		
    canSold?: string|number, //	是否上架；null-不限制；true-查上架商品；false-查下架商品		[boolean]		
    page: number, //	页码，默认1		[int]		
    limit: number, //	每页数量，默认15		[int]	
}) {
    return request({
        url: "/shop/product/admin/query",
        method: 'GET',
        params: data
    });
}

/**
 * 查询商城产品详情 
 */
export function productDetail (data: {
    id: string
}) {
    return request({
        url: "/shop/product/admin/get",
        method: 'GET',
        params: data
    });
}

/**
 * 新增商城产品
 */
export function addProduct (data: {
    "type": number,// 类型；1-商品；2-组合商品
    "title": string,// 产品标题
    "imageList": string[],// 图片列表数组
    "content": string,// 富文本内容
    "canSold": boolean,// 是否上架
    "properties": { // 属性（仅普通商品）
        "name": string// 属性名称// 属性的值数组
        "values": string[]
    }[],
    "properyDetails": { // 属性对应的库存售价等信息（仅普通商品）
        "sku": string,  //"黑色|16G",
        "leftStock": number,
        "sales": number,
        "price": number,
        "imageList": string[]
    }[],
    "combinationProducts": {  // 组合商品数据（仅组合商品）
        "subProductId": number // 子产品ID
    }[]
}) {
    return request({
        url: "/shop/product/admin/create",
        method: "POST",
        data
    });
}

/**
 * 更新商城产品
 */
export function editProduct (data: {
    id: string|number,
    "type": number,// 类型；1-商品；2-组合商品
    "title": string,// 产品标题
    "imageList": string[],// 图片列表数组
    "content": string,// 富文本内容
    "canSold": boolean,// 是否上架
    "properties": { // 属性（仅普通商品）
        "name": string// 属性名称// 属性的值数组
        "values": string[]
    }[],
    "properyDetails": { // 属性对应的库存售价等信息（仅普通商品）
        "sku": string,  //"黑色|16G",
        "leftStock": number,
        "sales": number,
        "price": number,
        "imageList": string[]
    }[],
    "combinationProducts": {  // 组合商品数据（仅组合商品）
        "subProductId": number // 子产品ID
    }[]
}) {
    return request({
        url: "/shop/product/admin/update",
        method: "POST",
        data
    });
}

/**
 * 删除商城产品 
 */
export function delProduct (data: {
    id: string|number
}) {
    return request({
        url: "/shop/product/admin/delete",
        method: "POST",
        data
    });
}

/**
 * 上架，下架商城产品 
 */
export function setSold (data: {
    id: string|number,
    canSold: boolean
}) {
    return request({
        url: "/shop/product/admin/setSold",
        method: "POST",
        data
    });
}

/**
 * 获取用户订单列表 
 */
export function shopOrderList (data: {
    status?: number,//	状态，0为全部；详见：项目文档-订单状态		[int]		
    beginTime?: number, //	开始时间戳		[int]		
    endTime?: number, //	结束时间戳		[int]		
    page: number, //	页码，默认1		[int]		
    limit: number, //	每页数量，默认15		[int]
}) {
    return request({
        url: "/shop/order/admin/query",
        method: "GET",
        params: data
    });
}

/**
 * 获取用户订单详情
 */
export function shopOrderDetail (data: {
    orderId: string|number, //订单id
}) {
    return request({
        url: "/shop/order/admin/get",
        method: "GET",
        params: data
    });
}

/**
 * 用户订单发货
 */
export function shopOrderExpress (data: {
    orderId: string|number, //订单id
}) {
    return request({
        url: "/shop/order/admin/shipped",
        method: "POST",
        data
    });
}