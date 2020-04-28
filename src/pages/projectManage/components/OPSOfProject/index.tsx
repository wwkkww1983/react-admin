import React from "react";
import "./index.less";
import { message, Form, Select, Modal,Button, Table, Switch } from "antd";
import NProgress from "nprogress";
import { getProjectOPS, saveProjectOPS, delProjectOPS } from "../../../../api/projectManage";
import OPSList from "./components/OPSList";
const { Option } = Select;

interface Props {
    id: string|number,
    title: string,
    close(): any
}

export default class Home extends React.Component {

    static defaultProps: Props = {
        id: "",
        title: "",
        close: () => {}
    }

    constructor (props) {
        super(props);
    }

    columns: any[] = [
        {
            title: "id",
            dataIndex: "memberId",
            key: "memberId"
        },
        // { 无数据，暂不显示
        //     title: "姓名",
        //     dataIndex: "name",
        //     key: "name",
        // },
        {
            title: "设备权限",
            render: (item, record, index) => (
                <Switch checkedChildren="开" unCheckedChildren="关" checked={item.authDevice} onChange={this.OPSauthChange.bind(this, index, 0)} loading={this.state.switchLoadings[index][0]}/>
            )
        },
        {
            title: "运营权限",
            render: (item, record, index) => (
                <Switch checkedChildren="开" unCheckedChildren="关" checked={item.authOperation} onChange={this.OPSauthChange.bind(this, index, 1)} loading={this.state.switchLoadings[index][1]}/>
            )
        },
        {
            title: "人员权限",
            render: (item, record, index) => (
                <Switch checkedChildren="开" unCheckedChildren="关" checked={item.authStaff} onChange={this.OPSauthChange.bind(this, index, 2)} loading={this.state.switchLoadings[index][2]}/>
            )
        },
        {
            title: "数据权限",
            render: (item, record, index) => (
                <Switch checkedChildren="开" unCheckedChildren="关" checked={item.authData} onChange={this.OPSauthChange.bind(this, index, 3)} loading={this.state.switchLoadings[index][3]}/>
            )
        },
        {
            title: "操作",
            render: (item, record, index) => (
                <div>
                    <Form layout="inline">
                        <Form.Item>
                            <Button type="danger" icon="delete" onClick={this.removeOPS.bind(this, item)}>移除</Button>
                        </Form.Item>
                    </Form>
                </div>
            )
        }
    ]

    state = {
        OPSListShow: false,
        switchLoadings: [
            //结构如注释
            // [false, false, false, false]
            //, ...
        ],
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

    //移除运维人员回调
    async removeOPS (item: any) {
        const memberId: string|number = item.memberId, projectId: string|number = (this as any).props.id;
        NProgress.start();
        try {
            await delProjectOPS({projectId, memberId});
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.loadOPSList();
    }

    //运维人员权限开关切换回调
    async OPSauthChange (index: number, column: number) {
        const columnKeys = [
            "authDevice",
            "authOperation",
            "authStaff",
            "authData"
        ]
        const item = this.state.list[index];
        const data: any = {};
        Object.keys(item).forEach(key => data[key] = item[key]);
        data[columnKeys[column]] =  !data[columnKeys[column]];
        loading.call(this);
        try {
            await saveProjectOPS(data);
        } catch(err) {
            loading.call(this);
            return;
        }
        loading.call(this);
        this.loadOPSList();
        function loading () {
            const arr = this.state.switchLoadings[index], state = arr[column];
            arr[column] = !state;
            this.setState({});
        }
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
        res.list = res.list.filter(item => item);
        const switchLoadings: boolean[][] = [];
        res.list.forEach(() => switchLoadings.push([false, false, false, false]));
        this.setState({list: res.list || [], switchLoadings});
    }

    render (): any {
        const state = this.state, props: any = (this as any).props;
        return (
            <div className="opsofproject-component-wrap">

                <Modal
                width={"80%"}
                visible={true}
                // closable={false}
                maskClosable={false}
                title={props.title ? "\"" + props.title + "\" 运维人员管理" : "运维人员管理"}
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
                        rowKey={item => item.memberId}
                        scroll={{y: 400}}
                        columns={(this as any).columns}
                        dataSource={state.list}
                        pagination={false}
                        />

                        {/* 选择运维人员列表 */}
                        {state.OPSListShow && <OPSList 
                        disabledIds={this.state.list.map(item => Number(item.memberId))}
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