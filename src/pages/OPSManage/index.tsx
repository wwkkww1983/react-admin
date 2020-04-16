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
        list: [],
        limit: 10,
        total: 0,
        page: 1,
    }

    componentDidMount () {
        initLife(this, this.init, this.$onShow);
    }

    init () {
        this.loadList();
    }

    $onShow () {
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
        this.setState({list: res.list || []});
    }


    render (): any {
        const state = this.state;
        return (
            <div className="opsmamage-page-wrap">
                <Table
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
            </div>
        );
    }
}