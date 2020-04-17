import React from "react";
import "./less/index.less";

import { getUserList } from "../../../../api/userManage";
import { input, initLife, timeToDateStr } from "../../../../utils/utils";
import { Form, Input, Button, Table, Switch, message } from "antd";
import NProgress from "nprogress";

function buildColumns () {
    return [
        {
            title: "id",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "昵称",
            render:  item =>  item.profile.nickname || "-"
        },
        {
            title: "绑定手机",
            dataIndex: "phone",
            key: "phone"
        },
        // { 无数据
        //     title: "备注",
        //     dataIndex: "id",
        //     key: "id"
        // },
        // {
        //     title: "个人信息",
        //     render: item => (
        //         <div>
        //             <p>姓名：{item.profile.name || "-"}</p>
        //             <p>身份证：{item.profile.idcard || "-"}</p>
        //             <p>性别：{item.profile.genderText || "-"}</p>
        //             <p>行政区域：{item.profile.province || "-"}</p>
        //         </div>
        //     )
        // },
        // {
        //     title: "物流信息",
        //     render: item => (
        //         // 物流信息—>默认收货信息包含姓名、联系方式、行政区域、详细地址（更多折叠）
        //         <div>
        //             <p>姓名：{item.profile.name || "-"}</p>
        //             <p>联系方式：{item.phone || "-"}</p>
        //             <p>个行政区域：{item.profile.province || "-"}</p>
        //             <p>详细地址：{item.profile.address || "-"}</p>
        //         </div>
        //     )
        // },
        // { 无数据
        //     title: "支付信息",
        //     render: item => (
        //         "more" // 支付信息—>微信openid、支付宝id、余额、赠送余额
        //     )
        // },
        {
            title: "创建时间",
            render: item => timeToDateStr(item.registerTime * 1000)
        },
        {
            title: "首次登陆时间",
            render: item => timeToDateStr(item.firstLoginTime * 1000)
        },
        {
            title: "最后登录时间",
            render: item => timeToDateStr(item.lastLoginTime * 1000)
        },
        {
            title: "操作",
            render: item => (
                <Form layout="inline">
                    <Form.Item>
                        <Button icon="check" onClick={this.props.onChange.bind(this, item)}>选择</Button>
                    </Form.Item>
                </Form>
            )
        },
    ];
}

interface Props {
    //用户点击
    onChange(item: any): any, 
}

export default class Home extends React.Component {

    static defaultProps = {
        onChange: null,
    }

    state = {
        q: "", //搜索使用的手机号
        list: [],
        limit: 10,
        total: 0,
        page: 1,
        columns: buildColumns.call(this)
    }

    componentDidMount () {
        this.loadList();
    }

    async loadList () {
        NProgress.start();
        let res = null;
        try {
            res = await getUserList({q: this.state.q, limit: this.state.limit, page: this.state.page});
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
            <div className="userlist-components-wrap">
                <Form layout="inline">
                    <Form.Item label="手机号">
                        <Input value={state.q} placeholder="输入手机号" onChange={input.bind(this, "q")}/>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="search" onClick={() => {
                            this.state.page = 1;
                            this.setState({});
                            this.loadList()
                        }}>查找</Button>
                    </Form.Item>
                </Form>

                <Table
                style={{marginTop: "16px"}}
                scroll={{y: 400}}
                columns={state.columns}
                dataSource={state.list}
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