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