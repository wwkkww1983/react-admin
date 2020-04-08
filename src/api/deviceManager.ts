import request from '../utils/request';
import { compose } from 'redux';

/**
 * 获取设备列表 
 */
export function getDeviceList (
    data: {
        type:string|number,       //设备类型；充电柜：1	是	[string]		
        deviceId?: string|number, //projectId	项目ID		[int]		
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
