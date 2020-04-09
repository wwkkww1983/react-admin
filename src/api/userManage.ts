import request from '../utils/request';

/**
 * 请求获取用户列表 
 */
export function getUserList (data: {q: string, limit: number, page: number}) {
    return request({
        url: "/account/manager/query",
        method: "GET",
        params: data
    });
}