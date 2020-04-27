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