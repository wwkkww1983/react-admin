import request from '../utils/request';

//获取运维人员列表
export function getOPSList ({page, limit}) {
    return request({
        url: "/account/admin/workerMember/query",
        method: 'GET',
        data: {page, limit}
    });
}