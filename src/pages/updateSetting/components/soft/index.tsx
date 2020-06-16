import React from "react";
import "./index.less";

import { input } from "../../../../utils/utils";
import Nprogress from "nprogress";
import {
    softUpdateList,
    createSoftUpdate,
    editSoftUpdate,
    delSoftUpdate
} from "../../../../api/updateSetting";
import { message, Table, Form, Modal, Input, Button } from "antd";

export default class Soft extends React.Component {

    constructor (props) {
        super(props);
    }

    columns = [
        {
            title: "id",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "model",
            dataIndex: "model",
            key: "model"
        },
        {
            title: "ver_code",
            dataIndex: "ver_code",
            key: "ver_code"
        },
        {
            title: "ver_name",
            dataIndex: "ver_name",
            key: "ver_name"
        },
        {
            title: "remark",
            dataIndex: "remark",
            key: "remark"
        },
        {
            title: "url",
            dataIndex: "url",
            key: "url"
        },
        {
            title: "操作",
            render: (item, record, index) => {
                return (
                    <Form layout="inline">
                        <Form.Item>
                            <Button icon="setting">编辑</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="danger" icon="delete">删除</Button>
                        </Form.Item>
                    </Form>
                )
            }
        }
    ]

    state = {
        form: {
            model: ""
        },
        list: [],
        page: 1,
        limit: 10,
        total:1,
    }

    componentDidMount () {
        this.init();
    }

    init () {
        this.loadList();
    }

    //加载软件升级列表
    async loadList () {
        Nprogress.start();
        const model = this.state.form.model, limit = this.state.limit, page = this.state.limit;
        let res = null;
        try {
            res = await softUpdateList({model, page, limit});
        } catch(err) {
            Nprogress.done();
            return;
        }
        Nprogress.done();
        this.setState({
            list: res.list,
            total: res.total
        });
    }

    //删除软件升级
    del () {

    }

    //创建保存
    createSave () {

    }

    //更新保存
    editSave () {

    }

    render () {
        const state: any = (this as any).state;
        return (
            <div className="soft-component">
                <Form layout="inline">
                    <Form.Item>
                        <Input value={state.form.model} placeholder="型号" onChange={input.bind(this, "form.model")}></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="plus">新增</Button>
                    </Form.Item>
                </Form>
                <Table
                style={{marginTop: "16px"}}
                rowKey="id"
                columns={this.columns}
                dataSource={state.list}
                pagination={{
                    current: state.page,   
                    pageSize: state.limit,
                    total: state.total,
                    onChange: page => {
                        this.state.page = page;
                        this.setState({});
                        this.loadList();
                    }
                }}
                />
            </div>
        );
    }
}