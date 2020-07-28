import request from "../utils/request";

//获取nfc卡列表
export function getNfcList (data: {
    q: string, //	精准匹配NFC卡ID，可空		[string]		
    page: number|string, //	页码，默认1	是	[int]		
    limit: number|string //	每页显示数量，默认15	是	[int]
}) {
    return request({
        url: "/wallet/admin/nfc/query",
        method: "GET",
        params: data
    });
}

//启用nfc
export function enable (data: {
    id: number|string, //	nfc卡ID	是	[int]		
    name: string, //	姓名	是	[string]		
    phone: string, //	电话	是	[string]		
    remark: string //	备注	是	[string]
}) {
    return request({
        url: "/wallet/admin/nfc/enable",
        method: "POST",
        data
    });
}

//禁用nfc
export function disable (data: {
    id: string|number, //nfc卡id
}) {
    return request({
        url: "/wallet/admin/nfc/disable",
        method: "POST",
        data
    });
}

//导入nfc卡片
export function importNfcCard (data: {
    cardIds: string[]
}) {
    return request({
        url: "/wallet/admin/nfc/import",
        method: "POST",
        data
    });
}