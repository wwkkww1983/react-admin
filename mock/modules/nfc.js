const Mock = require("mockjs");

module.exports = {

    //nfc列表
    "GET /wallet/admin/nfc/query": () => (
        Mock.mock({
            "list|10":[
                {
                    "nfc_id|1000001-1000020": 0,
                    "hash_id":"二维码",
                    "amount":"金额",
                    "bonuses":"赠送余额",
                    "create_time": new Date().getTime() / 1000,
                    "status|0-2": 0,
                    "name":"用户",
                    "phone":"电话",
                    "remark":"备注"
                }
            ],
            "limit": 10,
            "total": 20,
            "page_count":1,
            "message":"",
            "code":0
        })
    )
}