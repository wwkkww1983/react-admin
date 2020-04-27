import React from "react";
import "./index.less";
import { Alert, message, Form, Select, Modal, Input, Button, Table, Switch } from "antd";
import store from "../../../../store";
import NProgress from "nprogress";
import { getProjectOPS, saveProjectOPS, deleteProject } from "../../../../api/projectManage";
import OPSList from "./components/OPSList";
const { Option } = Select;

interface Props {
    id: string|number,
    close(): any
}

export default class Home extends React.Component {

    static defaultProps: Props = {
        id: "",
        close: () => {}
    }

    constructor (props) {
        super(props);
    }

    columns: any[] = [
        {
            title: "id",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "姓名",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "设备权限",
            render: (item, record, index) => (
                <Switch checkedChildren="开" unCheckedChildren="关" checked={item.auth_device}/>
            )
        },
        {
            title: "运营权限",
            render: (item, record, index) => (
                <Switch checkedChildren="开" unCheckedChildren="关" checked={item.auth_operation}/>
            )
        },
        {
            title: "人员权限",
            render: (item, record, index) => (
                <Switch checkedChildren="开" unCheckedChildren="关" checked={item.auth_staff}/>
            )
        },
        {
            title: "数据权限",
            render: (item, record, index) => (
                <Switch checkedChildren="开" unCheckedChildren="关" checked={item.auth_data}/>
            )
        },
        {
            title: "操作",
            render: (item, record, index) => (
                <div>
                    <Form layout="inline">
                        <Form.Item>
                            <Button type="danger" icon="delete">移除</Button>
                        </Form.Item>
                    </Form>
                </div>
            )
        }
    ]

    state = {
        OPSListShow: false,
        list: []
    }

    componentWillReceiveProps (props) {
       
    }

    componentDidMount () {
        this.init();
    }

    async init () {
        this.loadOPSList();
    }

    //选择运维人员列表选择回掉，增加运维人员到当前id项目
    async OPSListConfirm (item: any) {
        this.setState({OPSListShow: false});
        console.log(item);
        const data = {
            "projectId": (this as any).props.id,
            "memberId": item.memberId,
            "authDevice": false, // 设备权限
            "authOperation": false, // 运营权限
            "authStaff": false, // 人员权限
            "authData": false // 数据权限
        }
        NProgress.start();
        try {
            await saveProjectOPS(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        // message.success(`已添加 "${item.name}" 为该项目运维人员`);
        message.success(`已添加`);
        this.loadOPSList();
    }

    //加载项目相关运维人员(目前没有分页)
    async loadOPSList () {
        NProgress.start();
        let res = null;
        try {
            res = await getProjectOPS({projectId: (this as any).props.id});
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.setState({list: res.list || []});
    }

    render (): any {
        const state = this.state;
        return (
            <div className="opsofproject-component-wrap">

                <Modal
                width={"80%"}
                visible={true}
                // closable={false}
                maskClosable={false}
                title="运维人员管理"
                // onOk={this.confirm.bind(this)}
                onCancel={() => (this as any).props.close.call(null)}
                footer={null}
                >
                    <div>

                        <Form>
                            <Form.Item>
                                <Button icon="plus" onClick={() => this.setState({OPSListShow: true})}>新增</Button>
                            </Form.Item>
                        </Form>

                        <Table
                        scroll={{y: 400}}
                        columns={(this as any).columns}
                        dataSource={state.list}
                        pagination={false}
                        />

                        {/* 选择运维人员列表 */}
                        {state.OPSListShow && <OPSList 
                        confirm={this.OPSListConfirm.bind(this)} 
                        close={() => {
                            this.setState({OPSListShow: false});
                        }}
                        />}

                    </div>

                </Modal>
            </div>
        );
    }
}