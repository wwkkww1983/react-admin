import React from "react";
import "./less/index.less";

import { Table, Form, Button, Input, Tag, Select, Switch, message, Popover} from "antd";
import NProgress from "nprogress";
import { getDeviceList, enableDevice, disableDevice } from "../../api/deviceManager";
import { input, initLife } from "../../utils/utils";

export default class Home extends React.Component {

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
                render: item => item.batteryGoodTaxisys.latestStatus.batteryImei
            },
            { 
                title: "电池序列号",
                render: item => item.batteryGoodTaxisys.latestStatus.batteryNo
            },
            { 
                title: "软件版本号",
                render: item => item.batteryGoodTaxisys.softwareVersion
            },
            { 
                title: "硬件版本号",
                render: item => item.batteryGoodTaxisys.deviceVersion
            },
            { 
                title: "电池物理属性",
                render: item => (
                    <Popover 
                    title="电池物理属性详情" 
                    content={
                        <div>
                            <p>电芯数量： {item.batteryGoodTaxisys.latestStatus.batteryCellNum}</p>
                            <p>循环次数： {item.batteryGoodTaxisys.latestStatus.batteryLoopCount} 次</p>
                            <p>剩余容量： {item.batteryGoodTaxisys.latestStatus.batteryResidualCapacity / 100} AH</p>
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
                            <p>总电压: {item.batteryGoodTaxisys.latestStatus.batteryTotalVol / 100} V</p>
                            <p>总电流: {item.batteryGoodTaxisys.latestStatus.batteryTotalVol / 100} A</p>
                            <p>SOC: {item.batteryGoodTaxisys.latestStatus.batterySoc}</p>
                            {/* <p>SOH</p> 没有找到数据 */}
                            <p>最高单体电压：{this.getMaxFromArr(item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(",")) / 100} V</p>
                            {/* <p>最高单体电压序号</p> 没有数据 */}
                            <p>最低单体电压：{this.getMinFromArr(item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(",")) / 100} V</p>
                            {/* <p>最低单体电压序号</p> 没数据 */}
                            <p>最大压差：{(this.getMaxFromArr(item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(",")) - this.getMinFromArr(item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(","))) / 100} V</p>
                            {/* 无数据只有电芯温度 <p>最高温度</p>
                            <p>最高温度序号</p>
                            <p>最低温度</p>
                            <p>最低温度序号</p> */}
                            <p>电芯温度: {item.batteryGoodTaxisys.latestStatus.batteryCellTemperature} 摄氏度</p>
                        </div>
                    }
                    trigger="hover">
                        <Button type="link">详情></Button>
                    </Popover>
                )
            },
            { 
                title: "BMS警告",
                render: (item, rm, index) => this.state.bmsWarningDict[item.batteryGoodTaxisys.latestStatus.batteryBmsWarn]
            },
            { 
                title: "BMS故障",
                render: (item, rm, index) => this.state.bmsFaultDict[item.batteryGoodTaxisys.latestStatus.batteryBmsTrouble]
            },
            { 
                title: "DTU警告",
                render: (item, rm, index) => (
                    item.batteryGoodTaxisys.latestStatus.batteryDtuTrouble == 1 ? "GPS信号异常" :
                    item.batteryGoodTaxisys.latestStatus.batteryDtuTrouble == 2 ? "GSM信号异常" : "无"
                )
            },
            { 
                title: "电芯电压",
                render: item => (
                    <Popover 
                    title="各个电芯电压" 
                    content={
                        <p>
                            {item.batteryGoodTaxisys.latestStatus.batteryCellVols.split(",").map(item => item / 100 + "V ") || "无电芯温度详情"}
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
                title: "操作",
                render: (item, rm, index) => (
                    <Button icon="monitor" onClick={() => message.warning("实现中")}>查看位置</Button>
                )
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
        //表格数据
        list: [],
        //启用、禁用加载
        switchLoading: [],
        projectId: "",
        deviceId: "",
        enable: "",
        page: 1,
        limit: 10,
        total: 0,
    }

    componentDidMount () {
        initLife(this, this.$onLoad, this.$onShow);
    }

    $onLoad () {
        console.error("初始化-----");
        this.loadList();
    }

    $onShow () {
        // this.loadList();
        console.error("显示了-----");
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
            type: "3", //电池临时传3
            page: this.state.page,
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
        res.list && res.list.forEach(item => {
            //不加key react会报错
            item.key = item.id;
            //初始化switch加载状态
            this.state.switchLoading.push(false);
        });
        this.setState({list: res.list || [], total: res.total});
        console.log(this.state.list);
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

    render (): any {
        const state = this.state;
        return (
            <div className="boxmanager-wrap">
                <Form layout="inline" style={{marginBottom: "16px"}}>
                    <Form.Item label="电池序列号">
                        <Input value={state.deviceId} onChange={input.bind(this, "deviceId")} placeholder="输入电池序列号"/>
                    </Form.Item>
                    {/* <Form.Item label="项目id">
                        <Input value={state.projectId} onChange={input.bind(this, "projectId")} placeholder="输入项目id"/>
                    </Form.Item> */}
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
                </Form>
                <Table
                dataSource={state.list} 
                columns={state.columns}
                onChange={({current}) => {
                    this.state.page = current;
                    this.setState({});
                    this.loadList();
                }}
                pagination={{
                    pageSize: state.limit,
                    total: state.total,
                    defaultCurrent: state.page
                }}
                />
                
            </div>
        );
    }
}