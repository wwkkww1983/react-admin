import React from "react";
import "./less/index.less";

import { Table, Form, Button, Input, Select, Tag, Switch, message } from "antd";
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
                key: "online",
                render: (item, rm, index) => <Tag color={item === "1" ? "green" : "red"}>{item === "1" ? "在线" : "离线"}</Tag>
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
        res.list && res.list.forEach(item => {
            //不加key react会报错
            item.key = item.id;
            //初始化switch加载状态
            this.state.switchLoading.push(false);
        });
        this.setState({list: res.list || [], total: res.total});
        console.log(this.state.list);
    }

    render (): any {
        const state = this.state;
        return (
            <div className="boxmanager-wrap">
                <Form layout="inline" style={{marginBottom: "16px"}}>
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