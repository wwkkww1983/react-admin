import React from "react";
import "./less/index.less";
import NProgress from "nprogress";
import { 
    requestOPSList,
    enableOPS,
    disableOPS
} from "../../api/OPSManage";
import { input, timeToDateStr, initLife } from "../../utils/utils";
import { 
    Table,
    Button,
    Modal,
    Form,
    Input
} from "antd";
import UserList from "./components/userList";

const columns: any[] = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id"
    }, 
    {
        title: "手机号",
        dataIndex: "phone",
        key: "phone"
    },
    {
        title: "名字",
        dataIndex: "name",
        key: "name"
    }, 
    {
        title: "注册时间",
        dataIndex: "registerTime",
        key: "registerTime",
        render: item => item > 0 ? timeToDateStr((item * 1000)) : "-"
    }, 
    {
        title: "首次登录",
        dataIndex:"firstLoginTime",
        key: "firstLoginTime",
        render: item => item > 0 ? timeToDateStr((item * 1000)) : "-"
    }, 
    {
        title: "最后登录",
        dataIndex: "lastLoginTime",
        key: "lastLoginTime",
        render: item => item > 0 ? timeToDateStr((item * 1000)) : "-"
    },
    {
        title: "操作",
        render: (item, rm, index) => (
            <Form layout="inline">
                <Form.Item>
                    <Button type="danger" >删除</Button>
                </Form.Item>
            </Form>
        )
    }
];

export default class Home extends React.Component {

    state = {
        userListShow: false, //用户选择弹窗是否显示
        listLoadings: [], //列表每个行禁用启用开关的加载动画控制变量集合，由loadList函数来初始化
        list: [],
        limit: 10,
        total: 0,
        page: 1,
    }

    componentDidMount () {
        initLife(this, this.init, this.$onShow);
    }

    init () {
        // this.loadList();
    }

    $onShow () {
        this.loadList();
    }

    //加载列表
    async loadList () {
        NProgress.start();
        const page: number = this.state.page, limit: number = this.state.limit;
        let res: any = null;
        try {
            res = await requestOPSList({page, limit});
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        res.list&& res.list.forEach(item => this.state.listLoadings.push(false)); //初始化列表行禁用、启用人员开关加载动画控制变量集合
        this.setState({list: res.list || []});
    }

    //禁用运维人员
    async disable (index) {
        this.state.listLoadings[index] = true;
        this.setState({});
        const id = "";
        try {
            await disableOPS({memberId: id});
        } catch(err) {
            this.state.listLoadings[index] = false;
            this.setState({});
            return;
        }
        this.state.listLoadings[index] = false;
        this.loadList();
    }

    //启用运维人员
    async enable (index) {
        this.state.listLoadings[index] = true;
        this.setState({});
        const id = "";
        try {
            await enableOPS({memberId: id});
        } catch(err) {
            this.state.listLoadings[index] = false;
            this.setState({});
            return;
        }
        this.state.listLoadings[index] = false;
        this.setState({});
        this.loadList();
    }

    //绑定用户为运维人员
    async bindUserToOPS (item) {
        this.openOrOffUserList(false);
        const id = item.id;
        NProgress.start();
        try {
            await enableOPS({memberId: id});
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.state.page = 1;
        this.setState({});
        this.loadList();
    }

    //打开或关闭用户选择弹窗
    openOrOffUserList (state) {
        this.setState({userListShow: state});
    }

    render (): any {
        const state = this.state;
        return (
            <div className="opsmamage-page-wrap">

                {/* 上部表单 因api原因，暂时只提供新增，查询等等等待api完善后再改*/}
                <Form layout="inline">
                    <Form.Item>
                        <Button icon="plus" onClick={this.openOrOffUserList.bind(this, true)}>新增</Button>
                    </Form.Item>
                </Form>

                {/* 运维人员显示表格 */}
                <Table
                style={{marginTop: "16px"}}
                dataSource={state.list}
                columns={columns}
                pagination={{
                    pageSize: state.limit,
                    total: state.total,
                    current: state.page
                }}
                onChange={current => {
                    (this as any).state.page = current;
                    this.setState({});
                    this.loadList();
                }}
                />

                {/* 选择用户弹窗 */}
                <Modal
                width="80%"
                keyboard={false}
                maskClosable={false}
                title="选择用户"
                visible={state.userListShow}
                onOk={this.openOrOffUserList.bind(this, false)}
                onCancel={this.openOrOffUserList.bind(this, false)}
                footer={null}
                >
                    <UserList onChange={this.bindUserToOPS.bind(this)}/>
                </Modal>

            </div>
        );
    }
}