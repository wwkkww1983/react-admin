/**
 * 商城订单mock
 */

const Mock = require("mockjs");

module.exports = {
    //虚拟电池订单
    "GET /shop/order/admin/query": () => (
        Mock.mock({
            "list|10":[
                {
                    "id":1,// ID
                    "orderNumber":"订单号",
                    "sellerMemberId":1,// 卖家ID
                    "status":1,// 状态
                    "statusText":"未付款",// 状态文本
                    "name":"姓名",
                    "phone":"电话号码",
                    "cityCode":"城市编码",
                    "adCode":"区域编码",
                    "province":"省",
                    "city":"市",
                    "district":"区",
                    "address":"联系地址",
                    "deliveryCompanyId":1,// 快递公司ID，其它则为0
                    "deliveryNumber":"123456",// 快递单号
                    "totalAmount":100,// 总金额，单位：分
                    "payAmount":100,// 实际支付金额
                    "payChannel":1,// 支付渠道
                    "payTransferNumber":"1232132121",// 支付系统的订单号
                    "refundExpireTime":1000000000,// 支付最后退款时间
                    "createTime":1000000000,// 创建时间
                    "payTime":1000000000,// 支付时间
                    "deliveryTime":1000000000,// 发货时间
                    "completeTime":1000000000// 完成时间
                }
            ],
            "limit":15,
            "total": 30,
            "page_count":1,
            "message":"",
            "code":0
        })
    ),

    //发货
    "POST /shop/order/admin/shipped": () => (
        Mock.mock({
            message: "",
            code: 0
        })
    )
}