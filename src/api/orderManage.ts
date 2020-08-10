import request from "../utils/request";

//获取充电桩订单
export function getPileOrders (data: {
    orderNumber: string, //	订单号精准查询		[string]		
    endTime: number, //;	结束时间戳，不限制则为0		[int]		
    beginTime: number, //	开始时间戳，不限制则为0		[int]		
    page: number, //	页码，默认1		[int]		
    limit: number, //	每页返回数量，默认15		[int]
}) {
    return request({
        url: "/chargingStation/admin/order/query",
        method: "GET",
        params: data
    });
}

//租借电池订单
export function getBatteryOrders (data: {
    batteryId: string|number,
    status: number|string,
    orderNumber: string, //	订单号精准查询		[string]		
    endTime: number, //;	结束时间戳，不限制则为0		[int]		
    beginTime: number, //	开始时间戳，不限制则为0		[int]		
    page: number, //	页码，默认1		[int]		
    limit: number, //	每页返回数量，默认15		[int]
}) {
    return request({
        url: "/battery/admin/order/query",
        method: "GET",
        params: data
    });
}

//虚拟电池订单
export function getVirtualBatteryOrders (data: {
    orderNumber: string, //	订单号精准查询		[string]		
    endTime: number, //;	结束时间戳，不限制则为0		[int]		
    beginTime: number, //	开始时间戳，不限制则为0		[int]		
    page: number, //	页码，默认1		[int]		
    limit: number, //	每页返回数量，默认15		[int]
}) {
    return request({
        url: "/battery/admin/virtualBatteryOrder/query",
        method: "GET",
        params: data
    });
}