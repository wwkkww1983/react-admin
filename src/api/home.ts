import request from '../utils/request';

/**
 * 充电柜二维码扫描请求接口 
 */
export function qrcodeScan (data: any): any {
    return request({
        url: "/qrcode/chargingBox/scan",
        method: "POST",
        data
    });
}