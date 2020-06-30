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
            ),

            //jt808电池
            "6": () => (
                Mock.mock({
                    "list|10":[
                        {// JT808电池专属信息，字段参考文档
                            "batteryJT808":{// 最新状态
                                "latestStatus":{// 设备ID
                                    "deviceId":"85",// 电池ID
                                    "batteryId":"BT106001500LWSH200613002",// 纬度
                                    "latitude":"1",// 经度
                                    "longitude":"1",// 海拔
                                    "altitude":"0",// 速度
                                    "speed":"0",// 方向
                                    "direction":"0",// 里程
                                    "mileage":"",// 总电流
                                    "totalCurrent":"0.00",// 单体电池总数
                                    "cellQuantity":"20",// 单体电池电压详细
                                    "cellVoltageDetail":[
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28",
                                        "3.28"
                                    ],// 温度
                                    "tempQuantity":"2",// 温度采集详细
                                    "tempDetailInfo":[
                                        "30.00",
                                        "30.00"
                                    ],// BMS 温度
                                    "bmsTemp":"33",// 剩余电池容量 Ah
                                    "residualCapacity":"10.3",// 当前满容量 Ah
                                    "currentCapacity":"24",// 循环次数
                                    "loopTimes":"0",// 最大电压
                                    "sMaxVol":"0",// 最小电压
                                    "sMinVol":"0",// 最大序列号
                                    "sMaxSeriesNum":"0",// 最小序列号
                                    "sMinSeriesNum":"0",// 电池健康值
                                    "soh":"0",// 生命信号
                                    "lifeSignal":"43",// 总电压
                                    "totalVoltage":"65.7",// 状态-充电状态；0 关闭 1 开启 
                                    "statusCharge":"",// 状态-充电饱和；0 关闭 1 开启 
                                    "statusFillUp":"",// 状态-充电过流；0 关闭 1 开启 
                                    "statusChargeOverCurrent":"",// 状态-电芯过压；0 关闭 1 开启 
                                    "statusECoreOverVol":"",// 状态-放电；0 关闭 1 开启 
                                    "statusDischarge":"",// 状态-短路；0 关闭 1 开启 
                                    "statusShortCut":"",// 状态-放电过流；0 关闭 1 开启 
                                    "statusDischargeOverCurrent":"",// 状态-电芯欠压；0 关闭 1 开启 
                                    "statusECoreUnderVol":"",// 状态-电芯温度针测线开路；0 关闭 1 开启 
                                    "statuseDetectOpenCircuit":"",// 状态-温感侦测线开路；0 关闭 1 开启 
                                    "statusTempDetectOpenCircuit":"",// 状态-电芯温度过高；0 关闭 1 开启 
                                    "statusECoreTempOver":"",// 状态-电芯温度过低；0 关闭 1 开启 
                                    "statusECoreTempUnder":"",// 状态-BMS 温度过高；0 关闭 1 开启 
                                    "statusBMSTempOver":"",// 状态-租赁状态；0 关闭 1 开启 
                                    "statusRent":"",// 状态-禁止充电；0 关闭 1 开启 
                                    "statusForbidCharge":"",// 状态-禁止放电；0 关闭 1 开启 
                                    "statusForbidDischarge":"",// 状态-充电 mos 状态；0 断开 1 闭合 
                                    "statusChargeMOSStatus":"",// 状态-放电 mos 状态；0 断开 1 闭合 
                                    "statusDisChargeMOSStatus":"",// 状态-BMS 故障状态；0 关闭 1 开启 
                                    "statusBMSFailureStatus":"",// 状态-BMS 标准模式；0 关闭 1 开启 
                                    "statusBMSStandMode":"",// 状态-BMS 断电模式；0 关闭 1 开启 
                                    "statusBMSPowerDownMode":"", // 时间戳
                                    "time":"1593327782"
                                },
                                "clientId":"103370201831"
                            },
                            "updateTime":1584515903,// 记录更新时间
                            "id":3,
                            "projectId":0,// 项目ID
                            "mainDeviceId":0,
                            "type":1,// 类型
                            "model":"",// 型号
                            "imsi":"",// 卡号
                            "deviceId":"123456789012301",// 设备编号，如：imei
                            "authCode":"000001",// 授权码
                            "name":"",// 设备名称
                            "online":0,// 在线状态
                            "enable":0,// 是否启用
                            "longitude":"0.0000000",// 经度
                            "latitude":"0.0000000",// 纬度
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