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
    Switch,
    Input,
    message
} from "antd";
import UserList from "./components/userList";

function buildColumns () {
    return [
        {
            title: "ID",
            dataIndex: "memberId",
            key: "memberId"
        },
        {
            title: "名字",
            dataIndex: "name",
            key: "name",
            render: item => item ? item : "-"
        },  
        {
            title: "手机号",
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: "性别",
            dataIndex: "genderText",
            key: "genderText",
            render: item => item ? item : "-"
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
                        <Button icon="stop" onClick={this.disable.bind(this, item.memberId)}>禁用</Button>
                    </Form.Item>
                </Form>
            )
        }
    ];
}

export default class Home extends React.Component {

    state = {
        columns: buildColumns.call(this),
        userListShow: false, //用户选择弹窗是否显示
        q: "", //搜索手机号
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
        const page: number = this.state.page, limit: number = this.state.limit, q: string = this.state.q;
        let res: any = null;
        try {
            res = await requestOPSList({page, limit, q});
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.setState({list: res.list || []});
    }

    //禁用运维人员
    //根据后端口述，目前的禁用就是删除，启用时再去弹出用户列表里边选择即可。
    async disable (id: string|number) {
        NProgress.start();
        try {
            await disableOPS({memberId: id});
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
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

    //搜索
    search () {
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
                    <Form.Item>
                        <Input value={state.q} onChange={input.bind(this, "q")} placeholder="输入手机号"></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="search" onClick={this.search.bind(this)}>查找</Button>
                    </Form.Item>
                </Form>

                {/* 运维人员显示表格 */}
                <Table
                rowKey={item => item.memberId}
                style={{marginTop: "16px"}}
                dataSource={state.list}
                columns={state.columns}
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