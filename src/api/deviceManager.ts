import request from '../utils/request';

/**
 * 获取设备列表 
 */
export function getDeviceList (
    data: {
        mainDeviceId?: string|number, //主设备id，用于查询主设备下的子设备
        type:string|number,       //设备类型；充电柜：1	是	[string]		
        deviceId?: string|number, //projectId	项目ID		[int]	
        projectId?: string,        //项目id	
        enable?: string,          //enable	不传则为全部；0-禁用；1-启用	是	[string]		
        page: number,             //page	页码，默认1	是	[int]	
        limit: number             //limit  
    }
) {
    return request({
        url: "/device/admin/manager/query",
        method: "GET",
        params: data
    });
}


/**
 * 启用设备 
 */
export function enableDevice (data: {id: string|number}) {
    return request({
        url: "/device/admin/manager/enable",
        method: "POST",
        data
    });
}

/**
 * 禁用设备 
 */
export function disableDevice (data: {id: string|number}) {
    return request({
        url: "/device/admin/manager/disable",
        method: "POST",
        data
    });
}

/**
 * 导入JT808电池
 */
export function importJT808Battery (data: {
    clientIds: string|number[]
}) {
    return request({
        url: "/battery/admin/JT808/import",
        method: "POST",
        data
    });
}

/**
 * 添加充电头
 */
export function addPileSubDevice (data: {
    deviceId: string|number
}) {
    return request({
        url: "/chargingStation/admin/manager/addCharger",
        method: "POST",
        data
    });
}

/**
 * 删除充电头
 */
export function delPileSubDevice (data: {
    id: string|number
}) {
    return request({
        url: "/chargingStation/admin/manager/delCharger",
        method: "POST",
        data
    });
}

/**
 * 绑定充电桩子设备 
 */
export function bindPileSubDevice (data: {
    mainDeviceId: string|number,
    deviceId: string|number
}) {
    return request({
        url: "/chargingStation/admin/manager/bindCharger",
        method: "POST",
        data
    });
}

/**
 * 解绑充电桩子设备 
 */
export function unbindPileSubDevice (data: {
    id: string|number
}) {
    return request({
        url: "/chargingStation/admin/manager/unbindCharger",
        method: "POST",
        data
    });
}

/**
 * 删除设备
 * 后端说所有设备如果没有单独创建删除接口，则都用这个api来执行删除
 */
export function deleteDevice (data: {
    id: string|number
}): Promise<any> {
    return request({
        url: "device/admin/manager/delete",
        method: "POST",
        data
    });
}