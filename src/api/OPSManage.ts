import request from '../utils/request';

//获取运维人员列表
export function getOPSList ({page, limit}) {
    return request({
        url: "/account/admin/workerMember/query",
        method: 'GET',
        data: {page, limit}
    });
}

//新增运维人员
export function addOPS ({name, phone, password}) {
    return request({
        url: "/account/admin/workerMember/create",
        method: "POST",
        data: {name, phone, password}
    });
}