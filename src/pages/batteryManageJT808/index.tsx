import React from "react";
import "./less/index.less";

import { Table, Form, Button, Input, Select, Switch, Popover, Radio, Pagination, Row, Col, Modal, message } from "antd";
import NProgress from "nprogress";
import { getDeviceList, enableDevice, disableDevice, importJT808Battery } from "../../api/deviceManager";
import { input, initLife, property as P } from "../../utils/utils";
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
            {
                title: "项目id",
                dataIndex: "projectId",
                key: "projectId"
            },
            {
                title: "设备id",
                render: item => {
                    return P(item, "batteryJT808.clientId");
                }
            },
            {
                title: "电池id",
                render: item => {
                    return P(item, "batteryJT808.latestStatus.batteryId");
                }
            },
            {
                title: "剩余电量",
                render: item => {
                    const current = P(item, "batteryJT808.latestStatus.residualCapacity", 0);
                    const total = P(item, "batteryJT808.latestStatus.currentCapacity", 0);
                    return (current / total * 100).toFixed(2) + "%";
                }
                // render: item => P(item, "batteryJT808.latestStatus.currentCapacity", 0) + "%"
            },
            {
                title: "电池基本信息",
                render: item => {
                    function PP (k) {
                        return P(item, "batteryJT808.latestStatus." + k);
                    }
                    const content: React.ReactNode = (
                        <div>
                            {/* <p>设备id： {PP("deviceId")}</p>
                            <p>电池id： {PP("batteryId")}</p> */}
                            <p>总电流： {PP("totalCurrent")}</p>
                            <p>电芯数量： {PP("cellQuantity")}</p>
                            <p>电池温度： {PP("tempQuantity")}</p>
                            <p>海拔： {PP("altitude")}</p>
                            <p>速度： {PP("speed")}</p>
                            <p>方向： {PP("direction")}</p>
                            <p>里程： {PP("mileage")}</p>
                        </div>
                    );
                    return <Popover 
                    title="电池基本信息"
                    content={content}
                    trigger="hover"
                    >
                        <Button type="link">详情></Button>
                    </Popover>
                }
            },
            { 
                title: "电芯电压",
                render: item => (
                    <Popover 
                    title="各个电芯电压" 
                    content={
                        <p>
                            {P(item, "batteryJT808.latestStatus.cellVoltageDetail", []).join(", ") || "-"}
                        </p>
                    }
                    trigger="hover">
                        <Button type="link">详情></Button>
                    </Popover>
                )
            },
            { 
                title: "电芯温度",
                render: item => (
                    <Popover 
                    title="各个电芯温度" 
                    content={
                        <p>
                            {P(item, "batteryJT808.latestStatus.tempDetailInfo", []).join(", ") || "-"}
                        </p>
                    }
                    trigger="hover">
                        <Button type="link">详情></Button>
                    </Popover>
                )
            },
            {
                title: "电池实时状态",
                render: item => {
                    function PP (k) {
                        return P(item, "batteryJT808.latestStatus." + k);
                    }
                    return <Popover 
                    title="各个电芯电压" 
                    content={
                        <div style={{width: "600px"}}>
                            <Row>
                                <Col span={8}>
                                    <p>剩余容量：{PP("residualCapacity")}AH</p>
                                    <p>当前满容量：{PP("currentCapacity")}AH</p>
                                    <p>循环次数：{PP("loopTimes")}</p>
                                    <p>最大电压：{PP("sMaxVol")}</p>
                                    <p>最小电压：{PP("sMinVol")}</p>
                                    <p>最大序列号：{PP("sMaxSeriesNum")}</p>
                                    <p>最小序列号：{PP("sMinSeriesNum")}</p>
                                    <p>电池健康值：{PP("soh")}</p>
                                    <p>生命信号：{PP("lifeSignal")}</p>
                                    <p>总电压：{PP("totalVoltage")}</p>
                                    <p>充电状态：{PP("statusCharge") == 1 ? "是" : "否"}</p>
                                </Col>
                                <Col span={8}>
                                    <p>温感侦测线开路：{PP("statusTempDetectOpenCircuit") == 1 ? "是" : "否"}</p>
                                    <p>电芯温度过高：{PP("statusECoreTempOver") == 1 ? "是" : "否"}</p>
                                    <p>充电饱和：{PP("statusFillUp") == 1 ? "是" : "否"}</p>
                                    <p>充电过流：{PP("statusChargeOverCurrent") == 1 ? "是" : "否"}</p>
                                    <p>电芯过压：{PP("statusECoreOverVol") == 1 ? "是" : "否"}</p>
                                    <p>放电：{PP("statusDischarge") == 1 ? "是" : "否"}</p>
                                    <p>短路：{PP("statusShortCut") == 1 ? "是" : "否"}</p>
                                    <p>放电过流：{PP("statusDischargeOverCurrent") == 1 ? "是" : "否"}</p>
                                    <p>电芯欠压：{PP("statusECoreUnderVol") == 1 ? "是" : "否"}</p>
                                    <p>电芯温度针测线开路：{PP("statuseDetectOpenCircuit") == 1 ? "是" : "否"}</p>
                                </Col>
                                <Col span={8}>
                                    <p>电芯温度过低：{PP("statusECoreTempUnder") == 1 ? "是" : "否"}</p>
                                    <p>BMS温度过高：{PP("statusBMSTempOver") == 1 ? "是" : "否"}</p>
                                    <p>租赁状态：{PP("statusRent") == 1 ? "是" : "否"}</p>
                                    <p>禁止充电：{PP("statusForbidCharge") == 1 ? "是" : "否"}</p>
                                    <p>禁止放电：{PP("statusForbidDischarge") == 1 ? "是" : "否"}</p>
                                    <p>充电mos：{PP("statusChargeMOSStatus") == 1 ? "闭合" : "断开"}</p>
                                    <p>放电mos：{PP("statusDisChargeMOSStatus") == 1 ? "闭合" : "断开"}</p>
                                    <p>BMS故障状态：{PP("statusBMSFailureStatus") == 1 ? "故障" : "正常"}</p>
                                    <p>BMS标准模式：{PP("statusBMSStandMode") == 1 ? "是" : "否"}</p>
                                    <p>BMS断电模式：{PP("statusBMSPowerDownMode") == 1 ? "是" : "否"}</p>
                                </Col>
                            </Row>
                        </div>
                    }
                    trigger="hover">
                        <Button type="link">详情></Button>
                    </Popover>
                }
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
                render: item => Number(P(item, "longitude", 0)) && Number(P(item, "latitude", 0)) ? P(item, "address") : "暂无位置信息"
            },
            { 
                title: "操作",
                render: (item, rm, index) => {
                    const lat = Number(P(item, "latitude", 0)), lng = Number(P(item, "longitude", 0));
                    return <Button icon="compass" onClick={this.openBatteryPositionToast.bind(this, lat, lng)} disabled={!lng || !lat}>查看位置</Button>
                }
            },
        ],
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
        //导入电池弹窗
        importBatteryToast: {
            show: false,
            clientIds: "",
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

    //打开、关闭导入电池弹窗
    openOrOffImportBatteryToast (is: boolean) {
        const _ = this.state.importBatteryToast;
        if (is) {
            _.show = true;
        } else {
            _.show = false;
            _.clientIds = "";
        }
        this.setState({});
    }

    //保存导入电池
    async saveImportBattery () {
        let clienIds: any = this.state.importBatteryToast.clientIds;
        if (!clienIds) return message.warning("clientIds不能为空");
        if (clienIds.indexOf("\n") > -1) {
            clienIds = clienIds.split("\n").filter(item => item);
        } else {
            clienIds = [clienIds];
        }
        NProgress.start();
        try {
            await importJT808Battery({clientIds: clienIds});
        } catch(err) {
            NProgress.done();
            return;
        }
        this.openOrOffImportBatteryToast(false);
        NProgress.done();
        message.success("导入电池成功");
        this.loadList();
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
                            <Button icon="login" onClick={this.openOrOffImportBatteryToast.bind(this, true)}>导入电池</Button>
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

                {/* 导入电池弹窗 */}
                <Modal
                title="导入电池"
                visible={state.importBatteryToast.show}
                onCancel={this.openOrOffImportBatteryToast.bind(this, false)}
                onOk={this.saveImportBattery.bind(this)}
                maskClosable={false}
                closable={false}
                >
                    <Form>
                        <Form.Item label="clientIds">
                            <Input.TextArea rows={10} placeholder="每行一个回车分隔" value={state.importBatteryToast.clientIds} onChange={input.bind(this, "importBatteryToast.clientIds")}/>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 单个电池位置弹窗 */}
                {state.batteryPositionToastState.show && <BatteryPosition title="电池位置" close={this.offBatteryPositionToast.bind(this)} lat={state.batteryPositionToastState.lat} lng={state.batteryPositionToastState.lng}/>}
                
            </div>
        );
    }
}