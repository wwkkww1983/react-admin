import React, { ReactText } from "react";
import "./less/index.less";

import { Table, Form, Button, Input, Select, Tag, Switch, message, Pagination, Radio } from "antd";
import NProgress from "nprogress";
import { getDeviceList, enableDevice, disableDevice } from "../../api/deviceManager";
import { input, initLife, property as P } from "../../utils/utils";
import DeviceInMap from "../../components/deviceInMap";
import store from "../../store";
import BoxPosition from "../../components/devicePosition";

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
                dataIndex: "projectName",
                key: "projectName",
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
                key: "online",
                render: item => <Tag color={item.online == "1" ? "green" : "red"}>{item.online == "1" ? "在线" : "离线"}</Tag>
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
                render: item => {
                    const lat = Number(P(item, "longitude", 0)), lng = Number(P(item, "latitude", 0));
                    return <Button icon="monitor" disabled={lat == 0 && lng === 0} onClick={this.openOrOffPosition.bind(this, item)}>查看位置</Button>
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
        projectId: "",
        deviceId: "",
        enable: "",
        page: 1,
        limit: 10,
        total: 0,
        //电柜查看位置弹窗
        boxPosition: {
            show: false,
            lng: "",
            lat: "",
            title: "换电柜位置"
        }
    }

    componentDidMount () {
        initLife(this, this.$onLoad, this.$onShow);
    }

    $onLoad () {
        this.loadList();
        this.initUseStore();
    }

    $onShow () {
        // this.loadList();
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

    //记载列表
    async loadList () {
        const data = {
            type: "1",
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
        const latlngs = [];
        res.list && res.list.forEach(item => {
            //不加key react会报错
            item.key = item.id;
            //初始化switch加载状态
            this.state.switchLoading.push(false);
            //生成地图显示需要的经纬度数据
            if (!item.batteryGoodTaxisys || !item.batteryGoodTaxisys.latestStatus) {
                latlngs.push({
                    lat: null,
                    lng: null,
                });
            } else {
                latlngs.push({
                    lat: item.batteryGoodTaxisys.latestStatus.gdLat,
                    lng: item.batteryGoodTaxisys.latestStatus.gdLng,
                });
            }
        });
        this.setState({list: res.list || [], total: res.total, latlngs});
    }

    //打开、关闭查看位置弹窗
    openOrOffPosition (item): void {
        const $ = this.state.boxPosition;
        if (item) {
            $.show = true;
            $.title = `id:${item.id} 换电柜位置`;
            $.lng = Number(item.longitude) === 0 ? "" : item.longitude;
            $.lat = Number(item.latitude) === 0 ? "" : item.latitude;
        } else {
            $.show = false;
        }   
        this.setState({});
    }

    render (): any {
        const state = this.state;
        return (
            <div className="boxmanager-wrap"
            style={{height: state.viewIndex === 1 ? state.wrapHeight + "px" : "100%"}} /*切换到地图视图的时候才使页面撑满，好显示地图组件*/
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
                            <Input value={state.deviceId} onChange={input.bind(this, "deviceId")} placeholder="输入设备id"/>
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

                {/* 查看位置弹窗 */}
                {state.boxPosition.show &&
                <BoxPosition 
                title={state.boxPosition.title} 
                lng={state.boxPosition.lng} 
                lat={state.boxPosition.lat}
                close={this.openOrOffPosition.bind(this, null)}
                />}

            </div>
        );
    }
}