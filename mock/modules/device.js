const Mock = require("mockjs");

module.exports = {

    /**
     * 查询设备列表 
     */
    "GET /device/admin/manager/query": (req, res) => {
        const type = req.query["type"];
        const _ = {

            //充电桩
            "4": () => (
                Mock.mock({
                    "list|10":[
                        {// 充电桩专属信息，字段参考文档
                            "chargingStation":{
                                "latestStatus":{// 如果设备是主设备，不为null
                                    "voltage":100// 电能
                                },
                                "subDevicelatestStatus":{ // 如果设备是子设备，不为null
                                    "portType":0,// 端口种类；0：直流 1：交流
                                    "acPortStatus":0,// 交流端口状态；0：空闲 1：充电
                                    "chargerInBoxStatus":0,// 充电器在放置盒状态；0：空闲 1：就位
                                    "chargerPlugPortStatus":0,// 充电器插入端口状态；0：空闲 1：插入
                                    "nfcReaderStatus":0,// NFC读卡器状态；0：无 1： 有
                                    "dcBranchBoxStatus":0,// 直流分路箱状态； 0：关闭 1：打开
                                    "dcChargingModuleStatus":0,// 直流充电模块状态；0：空闲 1：充电
                                    "portVoltageError":0,// 插口电压错误；0：正常 1：异常
                                    "portCurrentError":0,// 插口电流错误；0：正常 1：异常
                                    "portTemperatureError":0,// 插口温度错误；0：正常 1：异常
                                    "portChargerError":0,// 插口充电器/电池错误；0：正常 1：异常
                                    "portRelayError":0,// 插口继电器错误；0：正常 1：异常
                                    "portSocketError":0,// 插口插座错误；0：正常 1：异常
                                    "portBoxError":0// 插口放置盒错误；0：正常 1：异常
                                }
                            },
                            "updateTime":1584515903,// 记录更新时间
                            "id":3,
                            "projectId":0,// 项目ID
                            "mainDeviceId":0,
                            "type":1,// 类型
                            "model":"",// 型号
                            "imsi":"imsi",// 卡号
                            "deviceId":"123456789012301",// 设备编号，如：imei
                            "authCode":"000001",// 授权码
                            "name":"充电桩@cname",// 设备名称
                            "online|0-1": 0,// 在线状态
                            "enable|0-1": 0,// 是否启用
                            "longitude|0-1": 0.0000000,// 经度
                            "latitude|0-1": 0.0000000,// 纬度
                            "address":"@address",// 地址
                            "createTime":1584515903,// 记录创建时间
                            "deleteTime":0
                        }
                    ],
                    "limit":15,
                    "total":11,
                    "page_count":1,
                    code: 0,
                    message: ""
                })
            ),
            
            // 充电头类型
            "5": () => (
                Mock.mock({
                    "list|10":[
                        {// 充电头专属信息，字段参考文档
                            "charger":{// 最新状态
                                "latestStatus":{
                                    "portType":0,// 端口种类；0：直流 1：交流
                                    "acPortStatus":0,// 交流端口状态；0：空闲 1：充电
                                    "chargerInBoxStatus":0,// 充电器在放置盒状态；0：空闲 1：就位
                                    "chargerPlugPortStatus":0,// 充电器插入端口状态；0：空闲 1：插入
                                    "nfcReaderStatus":0,// NFC读卡器状态；0：无 1： 有
                                    "dcBranchBoxStatus":0,// 直流分路箱状态； 0：关闭 1：打开
                                    "dcChargingModuleStatus":0,// 直流充电模块状态；0：空闲 1：充电
                                    "portVoltageError":0,// 插口电压错误；0：正常 1：异常
                                    "portCurrentError":0,// 插口电流错误；0：正常 1：异常
                                    "portTemperatureError":0,// 插口温度错误；0：正常 1：异常
                                    "portChargerError":0,// 插口充电器/电池错误；0：正常 1：异常
                                    "portRelayError":0,// 插口继电器错误；0：正常 1：异常
                                    "portSocketError":0,// 插口插座错误；0：正常 1：异常
                                    "portBoxError":0// 插口放置盒错误；0：正常 1：异常
                                }
                            },
                            "updateTime":1584515903,// 记录更新时间
                            "id":3,
                            "projectId": 1,// 项目ID
                            "mainDeviceId": 1,
                            "type": 1,// 类型
                            "model":"model",// 型号
                            "imsi":"imsi",// 卡号
                            "deviceId":"123456789012301",// 设备编号，如：imei
                            "authCode":"000001",// 授权码
                            "name":"充电口@cname",// 设备名称
                            "online|0-1": 0,// 在线状态
                            "enable|0-1": 0,// 是否启用
                            "longitude|0-10": 0.0000000,// 经度
                            "latitude|0-10": 0.0000000,// 纬度
                            "address":"",// 地址
                            "createTime":1584515903,// 记录创建时间
                            "deleteTime":0
                        }
                    ],
                    "limit":15,
                    "total":11,
                    "page_count":1,
                    code: 0,
                    message: ""
                })
            )
        }
        return _[type]();
    }

}