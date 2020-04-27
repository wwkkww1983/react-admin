import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { requestOPSList } from "../../../../../../api/OPSManage";
import { input, timeToDateStr } from "../../../../../../utils/utils";
import { 
    Table,
    Button,
    Modal,
    Form,
    Switch,
    Input,
    message
} from "antd";

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
                        <Button icon="check" onClick={this.confirm.bind(this, item)}>选择</Button>
                    </Form.Item>
                </Form>
            )
        }
    ];
}

export default class Home extends React.Component {

    props = {
        confirm: () => {},
        close: () => {}
    }

    state = {
        columns: buildColumns.call(this),
        q: "", //搜索手机号
        list: [],
        limit: 10,
        total: 0,
        page: 1,
    }

    componentDidMount () {
        this.init();
    }

    init () {
        this.loadList();
    }

    confirm (item: any) {
        (this as any).props.confirm.call(null, item);
    }

    close () {
        (this as any).props.close.call(null);
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

    //搜索
    search () {
        this.state.page = 1;
        this.setState({});
        this.loadList();
    }

    render (): any {
        const state = this.state;
        return (
            <div className="opslist-component-wrap">

                <Modal
                // maskStyle={{background: "none"}}
                width="80%"
                keyboard={false}
                maskClosable={false}
                title="增加运维人员"
                visible={true}
                // onOk={this.openOrOffUserList.bind(this, false)}
                onCancel={this.close.bind(this)}
                footer={null}
                >

                    <Form layout="inline">
                        <Form.Item>
                            <Input value={state.q} onChange={input.bind(this, "q")} placeholder="输入手机号"></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="search" onClick={this.search.bind(this)}>查找</Button>
                        </Form.Item>
                    </Form>

                    {/* 运维人员显示表格 */}
                    <Table
                    scroll={{y: 400}}
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

                </Modal>

            </div>
        );
    }
}