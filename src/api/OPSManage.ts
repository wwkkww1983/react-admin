import request from '../utils/request';

//获取运维人员列表
export function getOPSList ({page, limit}) {
    return request({
        url: "/account/admin/workerMember/query",
        method: 'GET',
        params: {page, limit}
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

//编辑运维人员
export function editOPS ({id, name, phone, password}) {
    return request({
        url: "/account/admin/workerMember/update",
        method: "POST",
        data: {id, name, phone, password}
    });
}

//删除运维人员
export function delOPS ({id}) {
    return request({
        url: "/account/admin/workerMember/delete",
        method: "POST",
        data: {id}
    });
}