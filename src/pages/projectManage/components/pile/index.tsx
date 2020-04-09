import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button,
    Icon,
    message,
    Switch,
    Table,
    Select
} from "antd";
const { Option } = Select;
import { input } from "../../../../utils/utils";
import NProgress from "nprogress";
import { getProjectList } from "../../../../api/projectManage";

export default class Home extends React.Component {

    state = {
        headerForm: {
            projectTitle: "",
            status: "0"
        },
        columns: [
            //ID、项目名、地址、联系人、创建人、备注、GPS、维护人（折叠）、创建时间、最后修改时间
            {
                title: "id",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "项目名",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "地址",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "联系人",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "创建人",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "备注",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "GPS",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "维护人",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "创建时间",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "最后修改时间",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "状态",
                render: item => (
                    <Switch></Switch>
                )
            },
            {
                title: "操作",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Button icon="setting">运维人员设置</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="setting">价格设置</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="danger" icon="delete">删除</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button>审核</Button>
                        </Form.Item>
                    </Form>
                )
            },
        ],
        list: [],
        limit: 10,
        page: 1,
        total: 0
    }

    componentDidMount () {
    }

    init () {
    }

    //加载列表数据
    async loadList () {
        NProgress.start();
        const data = {
            status: this.state.headerForm.status,
            page: this.state.page,
            limit: this.state.limit
        }
        let res = null;
        try {
            await getProjectList(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.setState({list: res.list, total: res.total});
    }

    render (): any {
        const state: any = this.state;
        return (
            <div className="projectmanage-page-wrap">
                {/* 换电柜头部表单 */}
                <Form layout="inline">
                    <Form.Item label="项目名">
                        <Input placeholder="输入项目名称" value={state.headerForm.projectTitle} onChange={input.bind(this, "headerForm.projectTitle")}/>
                    </Form.Item>
                    <Form.Item label="状态">
                        <Select value={state.headerForm.status} onChange={input.bind(this, "headerForm.status")}>
                            <Option value="0">全部</Option>
                            <Option value="1">等待审核</Option>
                            <Option value="2">正常</Option>
                            <Option value="3">审核失败</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="search" onClick={() => {
                            this.state.page = 1;
                            this.setState({});
                            this.loadList();
                        }}>查找</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="plus" onClick={() => {}}>新建</Button>
                    </Form.Item>
                </Form>
                
                {/* 换电柜表格 */}
                <Table
                style={{marginTop: "16px"}}
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