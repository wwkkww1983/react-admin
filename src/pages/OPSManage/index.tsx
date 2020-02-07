import React from "react";
import "./less/index.less";
import NProgress from "nprogress";
import { 
    getOPSList,
    addOPS,
    editOPS,
    delOPS
} from "../../api/OPSManage";
import { input, timeToDateStr } from "../../utils/utils";
import { 
    Table,
    Button,
    Modal,
    Form,
    Input
} from "antd";

interface ListItem {
    id: string,
    phone?: string,
    name: string,
    registerTime?: string,
    firstLoginTime?: string,
    lastLoginTime?: string
}

export default class Home extends React.Component {

    input = input;

    state = {
        list: [],
        limit: 10,
        total: 0,
        page: 1,
        clomus: [
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
                            <Button onClick={() => {
                                const item: any = this.state.list[index];
                                this.openModal("编辑", "edit", item.id, item.name, item.phone, item.pass);
                            }}>编辑</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="danger" onClick={() => this.del(item.id, item.name)}>删除</Button>
                        </Form.Item>
                    </Form>
                )
            }
        ],
        modal: {
            title: "",
            type: "", //add|edit
            show: false,
            loading: false,
            name: "",
            phone: "",
            pass: ""
        }
    }

    componentDidMount () {
        this.init();
    }

    init () {
        this.loadList();
    }

    //加载列表
    loadList () {
        NProgress.start();
        const page: number = this.state.page, limit: number = this.state.limit;
        getOPSList({page, limit})
        .then((res: any): void => {
            NProgress.done();
            const 
            limit: number = Number(res.limit),
            total: number = res.total;
            //增加key， 不然antd的table会报rowKey警告，超烦
            res.list.forEach((item: any): void => {
                item.key = item.id
            });
            this.setState({
                limit,
                total,
                list: res.list || []
            });
        })
        .catch(err => {
            NProgress.done();
        });
    }

    //打开模态窗户
    openModal (title: string, type: string, id?: string|number, name?: string, phone?: string, pass?: string): void {
        const modal: any = this.state.modal;
        modal.type =  type, // add|edit
        modal.title = title;
        modal.show = true;
        modal.id = id || ""
        modal.name = name || "",
        modal.phone = phone || "";
        modal.pass = pass || "";
        this.setState({});
    }

    //关闭模态创
    offModal () {
        const modal: any = this.state.modal;
        modal.title = "";
        modal.type = "";
        modal.show = false;
        modal.loading = false;
        modal.id = "";
        modal.name = "123";
        modal.pass = "";
        modal.phone = "";
        this.setState({});
    }

    //新增\编辑
    addOrEdit () {
        const 
        modal: any = this.state.modal,
        id: number = modal.id,
        name: string = modal.name,
        phone: string = modal.phone,
        password: string = modal.pass;
        if (modal.type === "add") {
            modal.loading = true;
            this.setState({});
            addOPS({name, phone, password})
            .then((res: any): void => {
                this.offModal();
                this.loadList();
            })
            .catch(err => {
                modal.loading = false;
                this.setState({});
            });
        }   
        if (modal.type === "edit") {
            modal.loading = true;
            this.setState({});
            editOPS({id, name, phone, password})
            .then(res => {
                this.offModal();
                this.loadList();
            })
            .catch(err => {
                modal.loading = false;
                this.setState({});
            })
        }
    }

    //删除
    del (id: number|string, name: string): void {
        Modal.confirm({
            title: `确定删除${name}吗？`,
            content: '',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => del(),
            onCancel() {}
        });
        const del = () => {
            NProgress.start();
            delOPS({id})
            .then(res => {
                NProgress.done();
                this.loadList();
            })
            .catch(err => {
                NProgress.done();
            })
        }
    }

    render (): any {
        const state = this.state;
        return (
            <div className="login-wrap">
                <Button icon="plus" onClick={() => this.openModal("新增", "add")}>新增</Button>
                <Table 
                style={{marginTop: "16px"}} 
                columns={state.clomus} 
                dataSource={state.list}
                pagination={{
                    pageSize: state.limit,
                    defaultCurrent: state.page,
                    total: state.total
                }}
                onChange={(obj) => {
                    this.state.page = obj.current;
                    this.loadList();
                }}
                ></Table>

                {/* 新增，编辑模态窗户 */}
                <Modal
                keyboard={false}
                maskClosable={false}
                closable={false}
                title={state.modal.title}
                visible={state.modal.show}
                footer={[
                    <Button onClick={this.offModal.bind(this)} disabled={state.modal.loading}>取消</Button>,
                    <Button type="primary" 
                    onClick={this.addOrEdit.bind(this)}
                    disabled={!state.modal.name || !state.modal.phone || !state.modal.pass}
                    loading={state.modal.loading}
                    >确定</Button>,
                ]}
                >
                    <Form>
                        <Form.Item>
                            <Input placeholder="用户名" value={state.modal.name} onChange={this.input.bind(this, "modal.name")}></Input>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="手机号" type="number" value={state.modal.phone} onChange={this.input.bind(this, "modal.phone")}></Input>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="密码" type="password" value={state.modal.pass} onChange={this.input.bind(this, "modal.pass")}></Input>
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        );
    }
}