import React from "react";
import "./index.less";

import { Modal, Form, Button, Table, Switch, Tag, Input, Select, message } from "antd";
import { bindDeviceToProject, unbindDeviceFromProject } from "../../../../api/projectManage";
import { getDeviceList } from "../../../../api/deviceManager";
import NProgress from "nprogress";
import { input, property as P } from "../../../../utils/utils";

export default class ProjectDevices extends React.Component {
    static useType = {
        PILE: "4",
        BOX: "1"
    }
    
    static defaultProps = {
        visable: false,
        useType: "BOX",
        title: "",
        projectId: "",
        onCancel: () => {}
    }

    constructor (props) {
        super(props);
    }

    state = {
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
                render: item => P(item, "projectName")
            },
            { 
                title: "型号",
                render: item => P(item, "model")
            },
            { 
                title: "IMSI",
                render: item => P(item, "item.imsi")
            },
            { 
                title: "是否在线",
                render: item => <Tag color={item == "1" ? "green" : "red"}>{item == "1" ? "在线" : "离线"}</Tag>
            },
            { 
                title: "状态",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Switch disabled={true} checkedChildren="启用" unCheckedChildren="禁用" checked={item.enable}/>
                        </Form.Item>
                    </Form>
                )
            },
            {
                title: "操作",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Button type="danger" icon="delete" onClick={this.unbindDevice.bind(this, item.id)}>删除</Button>
                        </Form.Item>
                    </Form>
                )
            }
        ],
        //类型id，参见static useType
        type: "",
        list: [],
        page: 1,
        limit: 10,
        total: 0,
        //选择绑定设备的列表弹窗状态
        select: {
            show: false,
            deviceId: "",
            enable: "", //1启用， 0禁用，”“全部
            list: [],
            page: 1,
            limit: 10,
            total: 0
        }
    }

    componentDidMount () {
        this.state.type = ProjectDevices.useType[(this as any).props.useType];
        this.loadList();
    }

    //加载列表
    async loadList () {
        const data = {
            projectId: (this as any).props.projectId,
            type: this.state.type,
            page: this.state.page,
            limit: this.state.limit
        }
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

    //解除项目设备绑定
    unbindDevice (id) {
        Modal.confirm({
            title: `确定要移除此设备：”${id}“ ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                NProgress.start();
                try {
                    await unbindDeviceFromProject({id});
                } catch(err) {
                    NProgress.done();
                    return;
                }
                NProgress.done();
                message.success("已移除");
                this.loadList();
            },
            onCancel () {}
        });
    }

    //打开选择绑定到项目充电桩主机弹窗
    openOrOffSelectPile (is: boolean): void {
        const $ = this.state.select;
        if (is) {
            $.show = true;
            this.loadSelectList();
        }
        else {
            $.show = false;
            $.limit = 10;
            $.page = 1;
            $.total = 0;
            $.list = [];
            $.deviceId = "";
            $.enable = "";
        }
        this.setState({});
    }

    //加载选择设备绑定列表
    async loadSelectList () {
        const $ = this.state.select;
        const data = {
            type: this.state.type,
            page: $.page,
            limit: $.limit
        }
        if ($.deviceId) data["deviceId"] = $.deviceId;
        if ($.enable !== "") data["enable"] = $.enable;
        NProgress.start();
        let res = null;
        try {
            res = await getDeviceList(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        $.list = res.list;
        $.total = res.total;
        this.setState({});
    }

    //绑定选择的设备
    async bindSelectDevice (item) {
        NProgress.start();
        const data = {
            projectId: (this as any).props.projectId,
            id: item.id
        }
        try {
            await bindDeviceToProject(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.openOrOffSelectPile(false);
        message.success("已添加");
        this.loadList();
    }
    
    render () {
        const state = this.state, props: any = this.props;
        return (
            <Modal
            width={"80%"}
            title={props.title}
            maskClosable={false}
            visible={props.visable}
            onCancel={props.onCancel}
            footer={null}
            >
                <div>
                    <Table
                    scroll={{y: 500}}
                    columns={state.columns}
                    dataSource={state.list}
                    pagination={{
                        current: state.page,
                        total: state.total, 
                        pageSize: state.limit,
                        onChange: current => {
                            this.state.page = current;
                            this.setState({});
                            this.loadList();
                        }
                    }}
                    ></Table>
                    <Form layout="inline" style={{marginTop: "16px"}}>
                        <Form.Item>
                            <Button icon="plus" onClick={this.openOrOffSelectPile.bind(this, true)}>添加</Button>
                        </Form.Item>
                    </Form> 

                    {/* 选择绑定设备的弹窗 */}
                    <Modal
                    maskClosable={false}
                    width="80%"
                    title="选择绑定设备"
                    visible={state.select.show}
                    onCancel={this.openOrOffSelectPile.bind(this, false)}
                    footer={null}
                    >
                        <div>
                            <Form layout="inline">
                                <Form.Item label="设备id">
                                    <Input placeholder="输入设备id" value={state.select.deviceId} onChange={input.bind(this, "select.deviceId")}></Input>
                                </Form.Item>
                                <Form.Item label="状态">
                                    <Select defaultValue={state.select.enable} placeholder="选择状态" style={{ width: 120 }} onChange={input.bind(this, "select.enable")}>
                                        <Select.Option value="1">启用的</Select.Option>
                                        <Select.Option value="0">禁用的</Select.Option>
                                        <Select.Option value="">全部</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button icon="search" onClick={this.loadSelectList.bind(this)}>查找</Button>
                                </Form.Item>
                            </Form>
                            <Table
                            scroll={{y: 500}}
                            columns={state.columns.slice(0, -1).concat([{
                                title: "操作",
                                render: item => (
                                    <Button icon="check" onClick={this.bindSelectDevice.bind(this, item)}>选择</Button>
                                )
                            }])}
                            dataSource={state.select.list}
                            pagination={{
                                current: state.select.page,
                                total: state.select.total, 
                                pageSize: state.select.limit,
                                onChange: current => {
                                    this.state.select.page = current;
                                    this.setState({});
                                    this.loadSelectList();
                                }
                            }}
                            />
                        </div>
                    </Modal>

                </div>
            </Modal>
        );
    }
}