import request from '../utils/request';

//获取运维人员列表
export function requestOPSList (data: {page: number, limit: number}) {
    return request({
        url: "/staff/admin/query",
        method: 'GET',
        params: data
    });
}

//启用运维人员
export function enableOPS (data: {memberId: string|number}) {
    return request({
        url: "/staff/admin/enable",
        method: "POST",
        data
    });
}

//禁用运维人员
export function disableOPS (data: {memberId: string|number}) {
    return request({
        url: "/staff/admin/disable",
        method: "POST",
        data
    });
}
