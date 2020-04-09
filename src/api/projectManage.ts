import request from '../utils/request';

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
