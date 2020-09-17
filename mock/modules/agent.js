const Mock = require("mockjs");

module.exports = {
    "GET /agent/admin/manager/query": () => Mock.mock({
        "list|10":[
            {// 乐刷信息
                "leshua":{
                    "config":{
                        "merchantId":"123",// 乐刷商户号
                        "key":"456"// 乐刷 key
                    }
                },
                "id":1,
                "name":"test",// 代理商名称
                "phone":"12345678901",// 代理商手机号
                "cityCode":"1",// 城市编码
                "adCode":"1",// 区域编码
                "province":"1",// 省
                "city":"1",// 市
                "district":"1",// 区
                "address":"1",// 详细地址
                "payAgentId":1,// 支付服务的用户ID
                "payAgentKey":"dfc5d3c1d229da306c538e1f7fd2e5a5",// 支付服务的key
                "createTime":1599884424,// 创建时间
                "updateTime":1599884424,// 记录更新时间
                "deleteTime":0// 删除时间，非0代表删除
            }
        ],
        "limit":15,
        "total":24,
        "page_count":1,
        "message":"",
        "code":0
    })
}