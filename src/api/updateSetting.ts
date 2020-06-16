import request from "../utils/request";

//获取软件升级列表
export function softUpdateList (data: {
    model?: string, //型号
    page?: number|string,
    limit?: number|string
}) {
    return request({
        url: "/softwareVersion/admin/query",
        method: "GET",
        params: data
    });
}

//创建软件升级记录
export function createSoftUpdate (data: {
    id: string|number, //记录id，好像是手动填写
    model: string, //型号
    ver_code: string|number, //软件版本号
    ver_name: string, //版本名
    remark: string, //版本描述
    url: string, //下载地址
}) {
    return request({
        url: "/softwareVersion/admin/create",
        method: "POST",
        data
    });
}

//编辑更新软件升级记录
export function editSoftUpdate (data: {
    id: string|number, //记录id，好像是手动填写
    model: string, //型号
    ver_code: string|number, //软件版本号
    ver_name: string, //版本名
    remark: string, //版本描述
    url: string, //下载地址
}) {
    return request({
        url: "/softwareVersion/admin/update",
        method: "POST",
        data
    });
}

//删除软件升级记录
export function delSoftUpdate (data: {
    id: string|number, //记录id，好像是手动填写
}) {
    return request({
        url: "/softwareVersion/admin/delete",
        method: "POST",
        data
    });
}




//获取硬件升级列表
export function hardwareUpdateList (data: {
    type: number|string,	//类型；0-全部；1-柜板；2-仓板；	是	[int]	0	查看
    hardware_ver?: number| string,	// 硬件版本号		[int]		
    page?: number,	// 页码，默认为1		[int]	1	查看
    limit?: number,	 // 返回记录数量，默认15		[int]	15
}) {
    return request({
        url: "/hardwareVersion/admin/query",
        method: "GET",
        params: data
    });
}

//创建硬件升级记录
export function createHardwareUpdate (data: {
    id: number|string	//记录ID	是	[int]	0	查看
    type: number|string, //	类型；1-柜板；2-仓板；	是	[int]		
    hardware_ver: number|string, //	硬件版本号	是	[int]		
    ver_code: number|string, //	软件版本号	是	[int]		
    ver_name: string, //	版本名	是	[string]		
    remark: string, //	版本描述	是	[string]		
    url: string, //	下载地址	是	[string]		
    time: string, //	日期	是	[date]	2020-02-02	查看
    md5: string, //	md5	是	[string]	
}) {
    return request({
        url: "/hardwareVersion/admin/create",
        method: "POST",
        data
    });
}

//编辑更新硬件升级记录
export function editHardwareUpdate (data: {
    id: number|string	//记录ID	是	[int]	0	查看
    type: number|string, //	类型；1-柜板；2-仓板；	是	[int]		
    hardware_ver: number|string, //	硬件版本号	是	[int]		
    ver_code: number|string, //	软件版本号	是	[int]		
    ver_name: string, //	版本名	是	[string]		
    remark: string, //	版本描述	是	[string]		
    url: string, //	下载地址	是	[string]		
    time: string, //	日期	是	[date]	2020-02-02	查看
    md5: string, //	md5	是	[string]
}) {
    return request({
        url: "/hardwareVersion/admin/update",
        method: "POST",
        data
    });
}

//删除软件升级记录
export function delHardwareUpdate (data: {
    id: string|number, //记录id，好像是手动填写
}) {
    return request({
        url: "/hardwareVersion/admin/delete",
        method: "POST",
        data
    });
}