/**
 * 后台订单mock
 * 包含3个订单： 电池，虚拟电池，充电桩 
 */

const Mock = require("mockjs");

module.exports = {

    //充电桩订单
    "GET /chargingStation/business/queryOrder": () => (
        Mock.mock({
            "list|10":[
                {
                    "id|+1": 1000000,
                    "orderNumber":"订单号",
                    "type":1,
                    "typeText":"预付费",
                    "memberId":"用户 ID",
                    "nfcId":"NFC 卡号",
                    "subDeviceId|10000-20000": 0, //"子设备 ID",
                    "port|0-1": 0, //"端口号",
                    "status":"状态",
                    "amount|50-100": 50,
                    "power":"电量",
                    "chargingTime|5-60": 50, //"充电时长，单位：分钟",
                    "createTime": new Date().getTime() / 1000, //"创建时间",
                    "beginTime": new Date().getTime() / 1000, //"充电开始时间",
                    "endTime": new Date().getTime() / 1000, //"充电结束时间",
                    "prepaidPrice":"单价",
                    "prepaidMaxTime":"时间，单位：秒",
                    "prepaidMaxKwh":"最多KWH",
                    "postpaidPriceHour":"分/小时",
                    "postpaidPriceKwh":"分/KWH",
                    "postpaidMaxTime":"最长充电时间，单位：秒",
                    "payAmount": 100,
                    "payChannel":"支付渠道",
                    "payTransferNumber":"虚拟电池购买时的，支付系统的订单号",
                    "payTime": new Date().getTime() / 1000, //"支付时间"
                }
            ],
            "limit":15,
            "total":30,
            "page_count":1,
            code: 0,
            mesaage: ""
        })
    ),

    //租借电池订单
    "GET /battery/admin/order/query": () => (
        Mock.mock({
            "list|10":[
                {
                    "id|100-200": 0, //"",
                    "orderNumber|10000-20000": 0, //"订单号",
                    "memberId|10000-20000": 0, //"用户ID",
                    "virtualBatteryId":"虚拟电池位ID",
                    "status":"状态",
                    "statusText":"状态文本",
                    "batteryId":"租用的电池ID",
                    "price":"价格",
                    "payAmount|30-200": 100, //"实际支付金额",
                    "payChannel":"支付渠道",
                    "payTransferNumber":"虚拟电池购买时的，支付系统的订单号",
                    "createTime": new Date().getTime() / 1000, //"订单创建时间",
                    "borrowTime": new Date().getTime() / 1000, //"租借时间",
                    "returnTime": new Date().getTime() / 1000, //"归还时间",
                    "payTime": new Date().getTime() / 1000, //"支付时间",
                    "refundExpireTime": new Date().getTime() / 1000, //"最后退款时间"
                }
            ],
            "limit":15,
            "total":11,
            "page_count":1,
            code: 0,
            message: ""
        })
    ),

    //虚拟电池订单
    "GET /battery/admin/virtualBatteryOrder/query": () => (
        Mock.mock({
            "list|10":[
                {
                    "id":1,
                    "status":1,// 状态值
                    "statusText":"状态文本",
                    "batteryId":"当前租借的电池ID",
                    "price":100,// 购买电池时价格，单位：分
                    "payAmount":100,// 购买电池时实际支付金额，单位：分
                    "payChannel":1,// 支付渠道
                    "buyTime":1234567890,// 购买时间
                    "borrowTime":1234567890,// 最后租借时间
                    "returnTime":1234567890,// 最后归还时间
                    "refundApplyTime":1234567890// 退款申请时间
                }
            ],
            "limit":15,
            "total": 40,
            "page_count":1,
            code: 0,
            message: ""
        })
    )
}