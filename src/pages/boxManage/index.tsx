import React from "react";
import "./less/index.less";

import { Table, Form, Button, Input, Select } from "antd";
import NProgress from "nprogress";
import { getDeviceList } from "../../api/deviceManager";
import { input, initLife } from "../../utils/utils";
import { History } from "../../components/my-router/index";

export default class Home extends React.Component {

    constructor (props) {
        super(props);
    }

    state = {
        //表格标题
        columus: [
            { 
                title: "当前状态",
                dataIndex: "latestStatus",
                key: "latestStatus"
            },
            { 
                title: "设备id",
                dataIndex: "deviceId",
                key: "deviceId"
            },
        ],
        //表格数据
        list: [],
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
        // this.loadList();
    }

    $onShow () {
        // this.loadList();
        console.error("显示了-----");
    }

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
        this.setState({list: res.list || [], total: res.total});
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