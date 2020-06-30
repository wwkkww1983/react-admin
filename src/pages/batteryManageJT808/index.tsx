import React from "react";
import "./less/index.less";

import { Table, Form, Button, Input, Select, Switch, Popover, Radio, Pagination } from "antd";
import NProgress from "nprogress";
import { getDeviceList, enableDevice, disableDevice } from "../../api/deviceManager";
import { input, initLife } from "../../utils/utils";
import store from "../../store";
import DeviceInMap from "../../components/deviceInMap";
import BatteryPosition from "../../components/devicePosition";

export default class BatteryManagerJT808 extends React.Component {

    constructor (props) {
        super(props);
    }

    state = {
        //表格标题
        columns: [
            { 
                title: "id",
                dataIndex: "id",
                key: "id"
            },
            // { 
            //     title: "型号",
            //     dataIndex: "model",
            //     key: "model",
            //     render: item => item ? item : "-"
            // },
            { 
                title: "IMEI",
                render: item => item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryImei : "-"
            },
            { 
                title: "电池序列号",
                render: item => item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryNo : "-"
            },
            { 
                title: "软件版本号",
                render: item => item.batteryGoodTaxisys ? item.batteryGoodTaxisys.softwareVersion : "-"
            },
            { 
                title: "硬件版本号",
                render: item => item.batteryGoodTaxisys ? item.batteryGoodTaxisys.deviceVersion : "-"
            },
            { 
                title: "电池物理属性",
                render: item => (
                    <Popover 
                    title="电池物理属性详情" 
                    content={
                        <div>
                            <p>电芯数量： {item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryCellNum : "-"}</p>
                            <p>循环次数： {item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryLoopCount : "-"} 次</p>
                            <p>剩余容量： {item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryResidualCapacity / 100 : "-"} AH</p>
                        </div>
                    }
                    trigger="hover">
                        <Button type="link">详情></Button>
                    </Popover>
                )
            },
            { 
                title: "电池物理状态",
                render: item => (
                    <Popover 
                    title="电池物理状态详情" 
                    content={
                        <div>
                            <p>总电压: {item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryTotalVol / 100 : "-"} V</p>
                            <p>总电流: {item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryTotalVol / 100 : "-"} A</p>
                            <p>SOC: {item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batterySoc : "-"}</p>
                            {/* <p>SOH</p> 没有找到数据 */}
                            <p>最高单体电压：{item.batteryGoodTaxisys ? this.getMaxFromArr(item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(",")) / 100 : "-"} V</p>
                            {/* <p>最高单体电压序号</p> 没有数据 */}
                            <p>最低单体电压：{item.batteryGoodTaxisys ? this.getMinFromArr(item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(",")) / 100 : "-"} V</p>
                            {/* <p>最低单体电压序号</p> 没数据 */}
                            <p>最大压差：{item.batteryGoodTaxisys ? (this.getMaxFromArr(item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(",")) - this.getMinFromArr(item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(","))) / 100 : "-"} V</p>
                            {/* 无数据只有电芯温度 <p>最高温度</p>
                            <p>最高温度序号</p>
                            <p>最低温度</p>
                            <p>最低温度序号</p> */}
                            <p>电芯温度: {item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryCellTemperature : "-"} 摄氏度</p>
                        </div>
                    }
                    trigger="hover">
                        <Button type="link">详情></Button>
                    </Popover>
                )
            },
            {
                title: "故障/警告",
                render: (item, record, index) => (
                    <div>
                        <span>BMS警告：{item.batteryGoodTaxisys ? this.state.bmsWarningDict[item.batteryGoodTaxisys.latestStatus.batteryBmsWarn] : "-"}</span><br/>
                        <span>BMS故障：{item.batteryGoodTaxisys ? this.state.bmsFaultDict[item.batteryGoodTaxisys.latestStatus.batteryBmsTrouble] : "-"}</span><br/>
                        <span>DTU警告：{item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus.batteryDtuTrouble == 1 ? "GPS信号异常" : item.batteryGoodTaxisys.latestStatus.batteryDtuTrouble == 2 ? "GSM信号异常" : "无" : "-"}</span>
                    </div>
                )
            },

            // {  合并为一列了，见上面
            //     title: "BMS警告",
            //     render: (item, rm, index) => this.state.bmsWarningDict[item.batteryGoodTaxisys.latestStatus.batteryBmsWarn]
            // },
            // { 
            //     title: "BMS故障",
            //     render: (item, rm, index) => this.state.bmsFaultDict[item.batteryGoodTaxisys.latestStatus.batteryBmsTrouble]
            // },
            // { 
            //     title: "DTU警告",
            //     render: (item, rm, index) => (
            //         item.batteryGoodTaxisys.latestStatus.batteryDtuTrouble == 1 ? "GPS信号异常" :
            //         item.batteryGoodTaxisys.latestStatus.batteryDtuTrouble == 2 ? "GSM信号异常" : "无"
            //     )
            // },
            { 
                title: "电芯电压",
                render: item => (
                    <Popover 
                    title="各个电芯电压" 
                    content={
                        <p>
                            {item.batteryGoodTaxisys && item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(",").map(item => item / 100 + "V ") || "无电芯温度详情"}
                        </p>
                    }
                    trigger="hover">
                        <Button type="link">详情></Button>
                    </Popover>
                )
            },
            { 
                title: "状态",
                key: "enable",
                render: (item, rm, index) => (
                    <Form layout="inline">
                        <Form.Item>
                            <Switch loading={this.state.switchLoading[index]} checkedChildren="启用" unCheckedChildren="禁用" checked={item.enable} onChange={this.enableOrDisable.bind(this, item, index)}/>
                        </Form.Item>
                    </Form>
                )
            },
            {
                title: "位置",
                width: 200,
                render: item => item.batteryGoodTaxisys && item.batteryGoodTaxisys.latestStatus.gdLocation || "暂无位置信息"
            },
            { 
                title: "操作",
                render: (item, rm, index) => {
                    const latestStatus: any = item.batteryGoodTaxisys ? item.batteryGoodTaxisys.latestStatus : {};
                    const { gdLat, gdLng, gdLocation } = latestStatus;
                    return <Button icon="compass" onClick={this.openBatteryPositionToast.bind(this, gdLat, gdLng)} disabled={!gdLocation}>查看位置</Button>
                }
            },
        ],
        //bms故障状态字典
        bmsFaultDict: {
            "00": "短路保护",
            "01": "单芯欠压保护",
            "02": "单芯过压保护",
            "03": "放电过流保护",
            "04": "充电过流保护",
            "05": "低温保护",
            "06": "过温保护",
            "07": "状态异常保护",
            "08": "MOS异常",
            "09": "总电压过压保护",
            "10": "总电压欠压保护",
            "11": "单芯间压差过大",
            "000": "无"
        },
        //bms警告状态字典
        bmsWarningDict: {
            "00": "单芯电压低告警",
            "01": "单芯电压高告警",
            "02": "电芯低温告警",
            "03": "电芯高温告警",
            "04": "总电压高告警",
            "05": "总电压低告警",
            "06": "单芯压差过大告警",
            "07": "MOS高温告警",
            "08": "环境低温告警",
            "09": "环境高温告警",
            "000": "无"
        },
        //视图类型0表格，1地图
        viewIndex: 0, 
        //content高度，数据来自store
        wrapHeight: 0,
        //表格数据
        list: [],
        //用于地图显示的对象
        latlngs: [],
        //启用、禁用加载
        switchLoading: [],
        //电池详情弹窗状态
        batteryPositionToastState: {
            show: false,
            lat: "",
            lng: ""
        },
        projectId: "",
        deviceId: "",
        enable: "",
        mainDeviceId: "",
        page: 1,
        limit: 10,
        total: 0,
    }

    componentDidMount () {
        initLife(this, this.$onLoad, this.$onShow);
    }

    initUseStore () {
        const get = () => {
            this.setState({
                wrapHeight: store.getState().layout.contentHieght
            });
        }
        store.subscribe(get);
        get();
    }

    $onLoad () {
        this.loadList();
        this.initUseStore();
    }

    $onShow () {
        // this.loadList();
    }

    //启用、禁用
    async enableOrDisable (item, index) {
        this.state.switchLoading[index] = true;
        this.setState({});
        try {
            if (Number(item.enable) === 1) await disableDevice({id: item.id});
            if (Number(item.enable) === 0) await enableDevice({id: item.id});
        } catch(err) {
            this.state.switchLoading[index] = false;
            this.setState({});
            return;
        }
        this.state.switchLoading[index] = false;
        this.setState({});
        this.loadList();
    }

    //记载列表
    async loadList () {
        const data = {
            type: "6", //JT808电池传6
            page: this.state.page,
            mainDeviceId: this.state.mainDeviceId || "0",
            limit: this.state.limit
        }
        if (this.state.enable) data["enable"] = this.state.enable;
        if (this.state.deviceId) data["deviceId"] = this.state.deviceId;
        if (this.state.projectId) data["projectId"] = this.state.projectId;
        NProgress.start();
        let res = null;
        try {
            res = await getDeviceList(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        const latlngs = [];
        res.list && res.list.forEach(item => {
            //不加key react会报错
            item.key = item.id;
            //初始化switch加载状态
            this.state.switchLoading.push(false);
            //生成地图显示需要的经纬度数据
            item.batteryGoodTaxisys && 
            item.batteryGoodTaxisys.latestStatus &&
            item.batteryGoodTaxisys.latestStatus.gdLat && 
            item.batteryGoodTaxisys.latestStatus.gdLng &&
            latlngs.push({
                lat: item.batteryGoodTaxisys.latestStatus.gdLat,
                lng: item.batteryGoodTaxisys.latestStatus.gdLng,
            });
        });
        this.setState({list: res.list || [], total: res.total, latlngs});
    }

    //获取数组中最大值
    getMaxFromArr (arr: any[]): number {
        let num = 0;
        for (let i of arr) {
            if (i > num) num = i;
        }
        return num;
    }

    //获取数组中最小值
    getMinFromArr (arr: any[]): number {
        let num = 0;
        for (let i of arr) {
            if (i < num) num = i;
        }
        return num;
    }

    //打开电池位置弹窗
    openBatteryPositionToast (lat: string|number, lng: string|number): void {
        const _: any = (this as any).state.batteryPositionToastState;
        _.show = true;
        _.lat = lat;
        _.lng = lng;
        this.setState({});
    }

    //关闭电池位置弹窗
    offBatteryPositionToast () {
        const _: any = (this as any).state.batteryPositionToastState;
        _.show = false;
        _.lat = "";
        _.lng = "";
        this.setState({});
    }

    render (): any {
        const state = this.state;
        return (
            <div className="batterymanager-wrap-jt808" 
            style={{height: state.viewIndex === 1 ? state.wrapHeight + "px" : "100%"}} /*切换到地图视图的时候才使页面撑满，好显示地图组件*/
            >

                {/* 头部表单 */}
                <div className="page-top">
                    <Form layout="inline" style={{marginBottom: "16px", float: "left"}}>
                        <Form.Item>
                            <Radio.Group onChange={({target: {value: index}}) => this.setState({viewIndex: index})} value={state.viewIndex}>
                                <Radio.Button value={0}>表格视图</Radio.Button>
                                <Radio.Button value={1}>地图视图</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="电池序列号">
                            <Input value={state.deviceId} onChange={input.bind(this, "deviceId")} placeholder="输入电池序列号"/>
                        </Form.Item>
                        {/* <Form.Item label="项目id">
                            <Input value={state.projectId} onChange={input.bind(this, "projectId")} placeholder="输入项目id"/>
                        </Form.Item> */}
                        <Form.Item label="主设备id">
                            <Input placeholder="主设备id" value={state.mainDeviceId} onChange={input.bind(this, "mainDeviceId")}/>
                        </Form.Item>
                        <Form.Item label="状态">
                            <Select defaultValue={state.enable} placeholder="选择状态" style={{ width: 120 }} onChange={input.bind(this, "enable")}>
                                <Select.Option value="1">启用的</Select.Option>
                                <Select.Option value="0">禁用的</Select.Option>
                                <Select.Option value="">全部</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="search" onClick={() => {
                                this.state.page = 1;
                                this.setState({});
                                this.loadList();
                            }}>查找</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="login" onClick={() => {
                                this.state.page = 1;
                                this.setState({});
                                this.loadList();
                            }}>导入电池</Button>
                        </Form.Item>
                    </Form>
                    <div style={{float: "right", marginBottom: "16px"}}>
                        电池总数: {state.total}
                    </div>
                    
                </div>
                
                {/* 表格视图 */}
                {state.viewIndex === 0 && <div className="page-content">
                    <Table
                    dataSource={state.list} 
                    columns={state.columns}
                    pagination={false}
                    />
                </div>}

                {/* 地图视图 */}
                {state.viewIndex === 1 && <div className="page-content">
                    <DeviceInMap latlngs={state.latlngs} pointIconUrl="public/img/电池.png"/>
                </div>}

                {/* 底部翻页器 */}
                <div  className="page-bottom">
                    <Pagination 
                    style={{margin: "16px 0", float: "right"}}
                    current={state.page} 
                    total={state.total} 
                    pageSize={state.limit} 
                    onChange={(current) => {
                        this.state.page = current;
                        this.setState({});
                        this.loadList();
                    }}/>
                </div>

                {/* 单个电池位置弹窗 */}
                {state.batteryPositionToastState.show && <BatteryPosition title="电池位置" close={this.offBatteryPositionToast.bind(this)} lat={state.batteryPositionToastState.lat} lng={state.batteryPositionToastState.lng}/>}
                
            </div>
        );
    }
}