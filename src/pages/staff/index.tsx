import React from "react";
import "./index.less";
import { Form, Input, Button, Table, Popover, message, Modal, Row, Col, Select } from "antd";
const { Option } = Select;
import { getStaffList, addStaff, editStaff, delStaff } from "../../api/agent";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../utils/utils";

/**
 * 新增代理商所需数据结构 
 */
const staffStruct = {
    "name":"",// 姓名
    "phone":""// 手机号
}

export default class Staff extends React.Component {
    constructor (props) {
        super(props);
    }

    state = {
        columns: [
            {
                title: "id",
                dataIndex: "id",
            },
            {
                title: "姓名",
                dataIndex: "name",
            },
            {
                title: "手机号",
                dataIndex: "phone"
            },
            {
                title: "代理商id",
                render: item => {
                    const content: React.ReactNode = <p>{P(item, "leshua.config.key")}</p>;
                    return <div>
                        -
                    </div>
                }
            },
            {
                title: "门店id",
                render: item => {
                    const content: React.ReactNode = <p>{P(item, "leshua.config.key")}</p>;
                    return <div>
                        -
                    </div>
                }
            },
            {
                title: "操作",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Button icon="setting" onClick={this.openOrOffStaffForm.bind(this, item)}>编辑</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="danger" icon="delete" onClick={this.deleteStaff.bind(this, item)}>删除</Button>
                        </Form.Item>
                    </Form>
                )
            },
        ],
        headForm: {
            q: "",
            agentId: "",
            storeId: ""
        },
        staffForm: {
            show: false,
            data: JSON.parse(JSON.stringify(staffStruct))
        },
        list: [],
        page: 1,
        limit: 10,
        total: 0,
    }
    
    componentDidMount () {
        initLife(this, this.init);
    }

    async init () {
        NProgress.start();
        await this.loadList(false);
        NProgress.done();
    }

    //打开、关闭新增、编辑员工弹窗
    openOrOffStaffForm (data) {
        const _ = this.state.staffForm;
        if (data) {
            _.show = true;
            if (data === true) {
                _.data = JSON.parse(JSON.stringify(staffStruct));
            } else {
                _.data = {};
                data = JSON.parse(JSON.stringify(data));
                Object.keys(staffStruct).forEach(k => _.data[k] = data[k]);
                _.data.id = data["id"];
            }
        } else {
            _.show = false;
            _.data = JSON.parse(JSON.stringify(staffStruct));
        }
        this.setState({});
    }

    //加载员工列表
    async loadList (loading = true) {
        loading && NProgress.start();
        let res = null;
        try {
            res = await getStaffList({
                ...this.state.headForm,
                limit: this.state.limit,
                page: this.state.page
            });
        } catch(err) {
            loading && NProgress.done();
            return;
        }
        loading && NProgress.done();
        this.setState({
            list: res.list,
            total: res.total
        });
    }

    //编辑、新增保存员工
    async saveStaff () {
        const data = this.checkStaffData();
        if (!data) return;
        NProgress.start();
        try {
            if (data.id) {
                await editStaff(data);
            } else {
                await addStaff(data);
            }
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.openOrOffStaffForm(false);
        message.success(P(data, "id", null) ? `编辑已保存` : `新增成功`);
        this.loadList();
    }

    //删除员工
    deleteStaff (item) {
        Modal.confirm({
            title: `确定删除员工 "${item.name}" 吗？`,
            okType: "danger",
            onOk: async () => {
                NProgress.start();
                try {
                    await delStaff({id: item.id});
                } catch(err) {
                    NProgress.done();
                    return;
                }
                NProgress.done();
                message.success(`已删除员工 "${item.name}"`);
                this.loadList();
            },
            onCancel: () => {}
        });
    }
    
    //检测新增、编辑员工字段填写
    checkStaffData (): any {
        const _ = this.state.staffForm.data;
        const checkMap = {
            "name":"请输入姓名",// 姓名
            "phone":"请输入手机号"// 手机号
        }
        function check (data: object, target: string[]): void {
            Object.keys(data).forEach(k => {
                if (typeof data[k] === "object") {
                    check(data[k], [...target, k]);
                } else {
                    if (!P(_, target.join(".") + "." + k, null)) throw P(checkMap, target.join(".") + "." + k);
                }
            });
        }
        try {
            check(checkMap, []);
        } catch(text) {
            message.warning(text);
            return false;
        }
        return _;
    }

    render (): React.ReactNode {
        const state = this.state;
        return <div className="agent-page">
            <Form layout="inline">
                <Form.Item label="员工名">
                    <Input placeholder="员工名字" value={state.headForm.q} onChange={input.bind(this, "headForm.q")}></Input>
                </Form.Item>
                <Form.Item label="供应商id">
                    <Input placeholder="供应商id" value={state.headForm.agentId} onChange={input.bind(this, "headForm.agentId")}></Input>
                </Form.Item>
                <Form.Item label="门店id">
                    <Input placeholder="门店id" value={state.headForm.storeId} onChange={input.bind(this, "headForm.storeId")}></Input>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                </Form.Item>
                <Form.Item>
                    <Button icon="plus" onClick={this.openOrOffStaffForm.bind(this, true)}>新增</Button>
                </Form.Item>
            </Form>
            <Table
            style={{marginTop: "16px"}}
            columns={state.columns}
            dataSource={state.list}
            pagination={{
                pageSize: state.limit,
                current: state.page,
                total: state.total,
                onChange: page => {
                    state.page = page;
                    this.setState({});
                    this.loadList();
                }
            }}
            />

            {/* 新增、编辑员工弹窗 */}
            <Modal
            title={P(state, "staffForm.data.id", null) ? `编辑员工 "${state.staffForm.data.name}"` : `新增员工`}
            visible={state.staffForm.show}
            onCancel={this.openOrOffStaffForm.bind(this, null)}
            onOk={this.saveStaff.bind(this)}
            >
                <Form>
                    <Form.Item label="姓名">
                        <Input 
                        placeholder="请输入员工姓名" 
                        value={state.staffForm.data.name} 
                        onChange={input.bind(this, "staffForm.data.name")}
                        ></Input>
                    </Form.Item>
                    <Form.Item label="电话">
                        <Input 
                        value={state.staffForm.data.phone}
                        onChange={input.bind(this, "staffForm.data.phone")}
                        placeholder="请输入员工电话"
                        ></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    }
}