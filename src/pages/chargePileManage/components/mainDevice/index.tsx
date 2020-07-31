import React from "react";
import "./index.less";

import { Table, Form, Button, Input, Select, Tag, Switch, message, Radio, Pagination, Modal, Popover, Row, Col } from "antd";
import NProgress from "nprogress";
import { getDeviceList, enableDevice, disableDevice, addPileSubDevice, delPileSubDevice } from "../../../../api/deviceManager";
import { input, initLife, property as P } from "../../../../utils/utils";
import store from "../../../../store";
import DeviceInMap from "../../../../components/deviceInMap";
import DevicePosition from "../../../../components/devicePosition";

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
            { 
                title: "设备id",
                dataIndex: "deviceId",
                key: "deviceId"
            },
            { 
                title: "项目id",
                dataIndex: "projectId",
                key: "projectId"
            },
            { 
                title: "项目名",
                dataIndex: "name",
                key: "name",
                render: item => item ? item : "-"
            },
            { 
                title: "型号",
                dataIndex: "model",
                key: "model",
                render: item => item ? item : "-"
            },
            { 
                title: "IMSI",
                dataIndex: "imsi",
                key: "imsi",
                render: item => item ? item : "-"
            },
            { 
                title: "是否在线",
                dataIndex: "online",
                key: "online",
                render: (item, rm, index) => <Tag color={item == "1" ? "green" : "red"}>{item == "1" ? "在线" : "离线"}</Tag>
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
                    <Form layout="inline">
                        <Form.Item>
                            <Button disabled={item.longitude <= 0 || item.latitude <= 0} icon="monitor" onClick={this.openOrOffPositionToast.bind(this, item.latitude, item.longitude)}>查看GPS位置</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="ordered-list" onClick={this.openOrOffSubDeviceListToast.bind(this, item)}>子设备</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="plus" onClick={this.openOrOffAddSubDeviceToast.bind(this, item.id)}>绑定子设备</Button>
                        </Form.Item>
                    </Form>
                )
            },
        ],
        //子设备列表columns
        subDeviceListColumns: [
            { 
                title: "id",
                dataIndex: "id",
                key: "id"
            },
            { 
                title: "设备id",
                dataIndex: "deviceId",
                key: "deviceId"
            },
            { 
                title: "通讯主机id",
                dataIndex: "mainDeviceId",
                key: "mainDeviceId"
            },
            {
                title: "项目名/型号",
                render: (item, record, index) => {
                    const content = (
                        <div>
                            <p>项目名：{item.name || "-"}</p>
                            <p>项目ID：{item.projectId || "-"}</p>
                            <p>型号：{item.model || "-"}</p>
                            <p>IMSI：{item.imsi || "-"}</p>
                        </div>
                    );
                    return <Popover content={content} title="项目名/IMSI">
                        <Button type="link">详情></Button>
                    </Popover>
                }
            },
            { 
                title: "是否在线",
                dataIndex: "online",
                key: "online",
                render: (item, rm, index) => <Tag color={item == "1" ? "green" : "red"}>{item == "1" ? "在线" : "离线"}</Tag>
            },
            { 
                title: "状态",
                key: "enable",
                render: (item, rm, index) => (
                    <Form layout="inline">
                        <Form.Item>
                            <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={item.enable} disabled={true}/>
                        </Form.Item>
                    </Form>
                )
            },
            {
                title: "设备工况",
                render: (item, record, index) => {
                    const _ = P(item, "charger.latestStatus",{});
                    const content = (
                        <Row style={{width: "400px"}}>
                            <Col span={12}>
                                <p>端口种类：{_.portType == 1 ? "交流" : "直流"}</p>
                                <p>交流端口状态：{_.acPortStatus == 1 ? "充电" : "空闲"}</p>
                                <p>充电器状态：{_.chargerInBoxStatus == 1 ? "就位" : "空闲" }</p>
                                <p>充电器插入端口状态：{_.chargerPlugPortStatus == 1 ? "插入" : "空闲"}</p>
                                <p>NFC读卡器状态：{_.nfcReaderStatus == 1 ? "有" : "无"}</p>
                                <p>直流分路箱状态：{_.dcBranchBoxStatus == 1 ? "打开" : "关闭"}</p>
                                <p>直流充电模块状态：{_.dcChargingModuleStatus == 1 ? "充电" : "空闲"}</p>
                                <p>插口电压：{_.portVoltageError == 1 ? "异常" : "正常"}</p>
                            </Col>
                            <Col span={10} offset={2}>
                                <p>插口电流：{_.portCurrentError == 1 ? "异常" : "正常"}</p>
                                <p>插口温度：{_.portTemperatureError == 1 ? "异常" : "正常"}</p>
                                <p>插口充电器/电池：{_.portChargerError == 1 ? "异常" : "正常"}</p>
                                <p>插口继电器：{_.portRelayError == 1 ? "异常" : "正产"}</p>
                                <p>插口插座：{_.portSocketError == 1 ? "异常" : "正常"}</p>
                                <p>插口放置盒：{_.portBoxError == 1 ? "异常" : "正常"}</p>
                            </Col>
                        </Row>
                    );
                    return <Popover content={content} title="设备工况">
                        <Button type="link">详情></Button>
                    </Popover>
                }
            },
            {
                title: "操作",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Button icon="delete" type="danger" onClick={this.delSubDevice.bind(this, item.id)}>解绑</Button>
                        </Form.Item>
                    </Form>
                )
            }
        ],
        //视图类型0表格，1地图
        viewIndex: 0, 
        //content高度，数据来自store
        wrapHeight: 0,
        //用于地图显示的对象
        latlngs: [],
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
        //位置弹窗状态
        positionToast: {
            show: false,
            lat: "",
            lng: ""
        },
        subDeviceListToast: {
            show: false,
            id: "",
            title: "",
            list: []
        },
        //增加子设备弹窗状态
        addSubDeviceToast: {
            show: false,
            mainDeviceId: "",
            deviceId: ""
        }
    }

    componentDidMount () {
        this.loadList();
        this.initUseStore();
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

    //新增子设备提交
    async addSubDevice () {
        NProgress.start();
        const { mainDeviceId, deviceId } = this.state.addSubDeviceToast;
        if (!mainDeviceId) {
            message.warning("主设备id不能为空");
            return;
        }
        if (!deviceId) {
            message.warning("子设备id不能为空");
            return;
        }
        try {
            await addPileSubDevice({mainDeviceId, deviceId});
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        message.success("新增子设备成功");
        this.openOrOffAddSubDeviceToast(null);
    }

    //加载列表
    async loadList () {
        const data = {
            type: "4",
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
        let latlngs = [];
        res.list && res.list.forEach(item => {
            //初始化switch加载状态
            this.state.switchLoading.push(false);
            //生成latlngs数据给地图视图使用
            latlngs.push({lat: item.latitude, lng: item.longitude});
        });
        this.setState({list: res.list || [], total: res.total, latlngs});
    }

    //加载指定设备id的子设备列表
    async loadingSubDeviceListByDeviceId (deviceId: string|number) {
        NProgress.start();
        const data = {
            type: "7",
            mainDeviceId: deviceId,
            page: 1,
            limit: 10
        }
        let res = null;
        try {
            res = await getDeviceList(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.state.subDeviceListToast.list = res.list || [];
        this.setState({});
    }

    //关闭或者打开位置弹窗
    openOrOffPositionToast (lat, lng) {
        const _ = this.state.positionToast;
        if (lat && lng) {
            _.lat = lat, _.lng = lng;
            _.show = true;
        } else {
            _.show =  false;
            _.lat = "", _.lng = "";
        }
        this.setState({});
    }

    //打开关闭子设备弹窗
    openOrOffSubDeviceListToast (item) {
        const _ = this.state.subDeviceListToast;
        if (item) {
            _.show = true;
            _.id = item.id,
            _.title = "\"" + item.name + "\" 子设备列表";
            this.loadingSubDeviceListByDeviceId(item.id);
        } else {
            _.show = false;
            _.id = "";
            _.title = "";
            _.list = [];
        }
        this.setState({});
    }

    //打开、关闭增加子设备弹窗
    openOrOffAddSubDeviceToast (mainDeviceId: string|number): void {
        const _: any = this.state.addSubDeviceToast;
        if (mainDeviceId) {
            _.show = true;
            _.mainDeviceId = mainDeviceId;
            _.deviceId = "";
        }
        else {
            _.show = false;
        }
        this.setState({});
    }

    //删除充电模块（子设备，充电模块属于通讯主机的子设备）
    delSubDevice (id: number|string) {
        Modal.confirm({
            title: `确定解绑子设备："${id}" 吗?`,
            content: "",
            okText: "确定",
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                NProgress.start();
                try {
                    await delPileSubDevice({id: id});
                } catch(err) {
                    NProgress.done();
                    return;
                }
                NProgress.done();
                this.loadingSubDeviceListByDeviceId(this.state.subDeviceListToast.id);
            },
            onCancel() {}
        });
    }

    render (): any {
        const state = this.state;
        //其他元素高度，用于地图组件显示的时候去除
        const otherElesHeight = (43.8 + 16);
        return (
            <div className="chargepile-page-wrap"
            style={{height: state.viewIndex === 1 ? state.wrapHeight - otherElesHeight + "px" : ""}} /*切换到地图视图的时候才使页面撑满，好显示地图组件*/
            >

                {/* 头部表单 */}
                <div className="page-top">
                    <Form layout="inline" style={{marginBottom: "16px"}}>
                        <Form.Item>
                            <Radio.Group onChange={({target: {value: index}}) => this.setState({viewIndex: index})} value={state.viewIndex}>
                                <Radio.Button value={0}>表格视图</Radio.Button>
                                <Radio.Button value={1}>地图视图</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="设备id">
                            <Input value={state.deviceId} onChange={input.bind(this, "deviceId")} placeholder="输入设备IMEI"/>
                        </Form.Item>
                        <Form.Item label="项目id">
                            <Input value={state.projectId} onChange={input.bind(this, "projectId")} placeholder="输入项目id"/>
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
                    </Form>
                </div>
                            
                {/* 表格视图 */}
                {state.viewIndex === 0 && <div className="page-content">
                <Table
                rowKey="id"
                dataSource={state.list} 
                columns={state.columns}
                pagination={false}
                />
                </div>}

                {/* 地图视图 */}
                {state.viewIndex === 1 && <div className="page-content">
                    <DeviceInMap latlngs={state.latlngs} pointIconUrl="public/img/充电站.png"/>
                </div>}

                {/* 底部翻页器 */}
                <div className="page-bottom">
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

                {/* 子设备列表弹窗，一般子设备就几个，不需要翻页 */}
                <Modal
                title={state.subDeviceListToast.title}
                visible={state.subDeviceListToast.show}
                footer={null}
                width="80%"
                maskClosable={false}
                onCancel={this.openOrOffSubDeviceListToast.bind(this, null)}
                >
                    <Table
                    rowKey="id"
                    scroll={{y: 500}}
                    columns={state.subDeviceListColumns}
                    dataSource={state.subDeviceListToast.list}
                    />
                </Modal>

                {/* 单个设备位置地图显示组件 */}
                {state.positionToast.show && <DevicePosition title="充电站位置" lng="" lat="" close={this.openOrOffPositionToast.bind(this, null, null)}/>}

                {/* 新增子设备弹窗 */}
                <Modal
                visible={state.addSubDeviceToast.show}
                title="绑定子设备"
                maskClosable={false}
                onOk={this.addSubDevice.bind(this)}
                onCancel={this.openOrOffAddSubDeviceToast.bind(this, false)}
                >
                    <Form>
                        <Form.Item label="主设备id">
                            <Input disabled={true} value={state.addSubDeviceToast.mainDeviceId} onChange={input.bind(this, "addSubDeviceToast.mainDeviceId")} placeholder="主设备id"></Input>
                        </Form.Item>
                        <Form.Item label="子设备id">
                            <Input value={state.addSubDeviceToast.deviceId} onChange={input.bind(this, "addSubDeviceToast.deviceId")} placeholder="子设备id"></Input>
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        );
    }
}