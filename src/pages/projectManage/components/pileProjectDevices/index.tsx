import React from "react";
import "./index.less";

import { Modal, Form, Button, Table, Switch, Tag} from "antd";
import { bindDeviceToProject, unbindDeviceFromProject } from "../../../../api/projectManage";
import { getDeviceList } from "../../../../api/deviceManager";
import NProgress from "nprogress";

export default class PileProjectDevices extends React.Component {
    static defaultProps = {
        visable: false,
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
        list: [],
        page: 1,
        limit: 10,
        total: 0
    }

    componentDidMount () {
        this.loadList();
    }

    //加载列表
    async loadList () {
        // const data = {
        //     projectId: (this as any).props.projectId,
        //     type: "4",
        //     page: this.state.page,
        //     limit: this.state.limit
        // }
        // NProgress.start();
        // let res = null;
        // try {
        //     res = await getDeviceList(data);
        // } catch(err) {
        //     NProgress.done();
        //     return;
        // }
        // NProgress.done();
        // this.setState({list: res.list || [], total: res.total});
    }

    //解除项目设备绑定
    unbindDevice (id) {
        console.log(id);
    }

    //打开选择绑定到项目充电桩主机弹窗
    openSelectPile () {

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
                            <Button icon="plus" onClick={this.openSelectPile.bind(this)>添加</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}