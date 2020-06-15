import request from '../utils/request';
import request2 from "../utils/request2";

/**
 * 加载项目列表
 */
export function getProjectList (data: {status: string, page: number, limit: number}) {
    return request({
        url: "/project/admin/query",
        method: "GET",
        params: data
    });
}

/**
 * 新增项目 
 */
export function createProject (data: any) {
    return request({
        url: "/project/admin/create",
        method: "POST",
        data
    });
}

/**
 * 更新项目
 */
export function updateProject (data: any) {
    return request({
        url: "/project/admin/update",
        method: "POST",
        data
    });
}

/**
 * 删除项目 
 */
export function deleteProject (data: {id: string|number}) {
    return request({
        url: "/project/admin/delete",
        method: "POST",
        data
    });
}

/**
 * 启用项目 
 */
export function enableProject (data: {id: string|number}) {
    return request({
        url: "/project/admin/enable",
        method: "POST",
        data
    });
}

/**
 * 禁用项目 
 */
export function disableProject (data: {id: string|number}) {
    return request({
        url: "/project/admin/disable",
        method: "POST",
        data
    });
}

/**
 * 获取项目关联运维人员 
 */
export function getProjectOPS (data: {projectId: string|number}) {
    return request({
        url: "/project/admin/selectStaffRelation",
        method: "POST",
        data
    }); 
}

/**
 * 保存、新增项目关联运维人员 
 */
export function saveProjectOPS (data: {
    "projectId": number|string,
    "memberId": number|string,
    "authDevice": boolean, // 设备权限
    "authOperation": boolean, // 运营权限
    "authStaff": boolean, // 人员权限
    "authData": boolean // 数据权限
}) {
    return request({
        url: "/project/admin/saveStaffRelation",
        method: "POST",
        data
    }); 
}

/**
 * 移除项目关联运维人员 
 */
export function delProjectOPS (data: {
    "projectId": string|number,
    "memberId": string|number
}) {
    return request({
        url: "/project/admin/removeStaffRelation",
        method: "POST",
        data
    });
}

/**
 *  获取项目计费规则
 *  使用了request2封装，业务逻辑错误得在调用处处理。
 */
export function getSaleSetting (data: {
    "projectId": string|number
}) {
    return request2({
        url: "/project/admin/getBillingRule",
        method: "GET",
        params: data
    });
}

/**
 * 保存换电柜计费规则 
 */
export function saveBoxSaleSetting (data: {
    "projectId": number|string,
    "everyTimePrice": number|string, // 按次计费价格
    "everyTimeDepositCheck": boolean, // 按次计费押金检测开关
    "hourlyPrice": number|string, // 按时计费每小时费用
    "hourlyPriceMaxDaily": number|string, // 按时计费每小时费用，每天封顶价格
    "hourlyDepositCheck": boolean, // 按时计费押金检测开关
    "monthlyPrice": number|string, // 包月计费，每月费用
    "monthlyPriceMaxTimes": number|string, // 包月计费，每月最多次数
    "monthlyDepositCheck": boolean // 包月计费押金检测开关
}) {
    return request({
        url: "/project/admin/saveChargingBoxBillingRule",
        method: "POST",
        data
    });
}

/**
 * 保存充电站计费规则 
 */
interface SavePileSaleSetting_PrepaidRules_Item {
    price: string|number, //单价
    maxTime: number|string, //世间单位秒
    maxKwh: number|string //最多Kwh
}
export function savePileSaleSetting (data: {
    // 以下所有价格费用，单位都为分
    "projectId": number|string,
    "postpaidPriceHour": number|string,// 分/小时
    "postpaidPriceKwh": number|string,// 分/KWH
    "postpaidMaxTime": string|number,// 最长充电时间，单位：秒// 后付费规则列表，按数组里成员顺序决定index
    "prepaidRules": SavePileSaleSetting_PrepaidRules_Item[]
}) {
    return request({
        url: "/project/admin/saveChargingStationBillingRule",
        method: "POST",
        data
    });
}

/**
 * 项目审核 
 */
export function aduit (data: {id: string|number, pass: boolean}) {
    return request({
        url: "/project/admin/review",
        method: "POST",
        data
    });
}