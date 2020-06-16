const Mock = require("mockjs");

module.exports = {

    // 获取软件升级列表
    "GET /softwareVersion/admin/query": () => (
        Mock.mock({
            "list|10":[
                {
                    "id|1-10":1,
                    "model": "TY-LL-12",
                    "ver_code": 1,
                    "ver_name":"1.0.0",
                    "remark":"test",
                    "url":"https://chargingbox.teny.tech/update/TYLL12_0.1.0.apk"
                }
            ],
            "limit":15,
            "total":1,
            "page_count":1,
            "message":"",
            "code":0
        })
    )

}