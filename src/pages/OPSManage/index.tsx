import React from "react";
import "./less/index.less";
import NProgress from "nprogress";
import { 
    getOPSList,
    addOPS
} from "../../api/OPSManage";
import { input } from "../../utils/utils";
import { 
    Table,
    Pagination,
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
        limit: 15,
        totalPage: 1,
        page_count: 1,
        clomus: [
            {
                title: "ID",
                key: "id"
            }, 
            {
                title: "手机号",
                key: "phone"
            },
            {
                title: "名字",
                key: "name"
            }, 
            {
                title: "注册时间",
                key: "registerTime"
            }, 
            {
                title: "首次登录",
                key: "firstLoginTime"
            }, 
            {
                title: "最后登录",
                key: "lastLoginTime"
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

    //加载列表
    loadList () {
        NProgress.start();
        const page: number = this.state.page_count, limit: number = this.state.limit;
        getOPSList({page, limit})
        .then((res: any): void => {
            NProgress.done();
            const 
            limit: number = Number(res.limit),
            totalPage: number = res.total,
            page_count: number = res.page_count;
            this.setState({
                limit,
                totalPage,
                page_count,
                list: res.list || []
            });
        })
        .catch(err => {
            NProgress.done();
        });
    }

    //打开模态窗户
    openModal (title: string, type: string): void {
        const modal: any = this.state.modal;
        modal.type =  type, // add|edit
        modal.title = title;
        modal.show = true;
        this.setState({});
    }

    //关闭模态创
    offModal () {
        const modal: any = this.state.modal;
        modal.title = "";
        modal.type = "";
        modal.show = false;
        modal.loading = false;
        modal.name = "";
        modal.pass = "";
        modal.phone = "";
        this.setState({});
    }

    //新增\编辑请求
    addOrEditRequest () {
        const 
        modal: any = this.state.modal,
        name: string = modal.name,
        phone: string = modal.phone,
        password: string = modal.pass;
        if (modal.type === "add") {
            modal.loading = true;
            this.setState({});
            addOPS({name, phone, password})
            .then((res: any): void => {
                console.log(res);
            })
            .catch(err => {
                modal.loading = false;
                this.setState({});
            });
        }   
        if (modal.type === "edit") {

        }
    }

    render (): any {
        const state = this.state;
        return (
            <div className="login-wrap">
                <Button icon="plus" onClick={this.openModal.bind(this, "新增", "add")}>新增</Button>
                <Table style={{marginTop: "16px"}} columns={state.clomus} dataSource={state.list}></Table>
                <Pagination style={{marginTop: "16px"}}  defaultCurrent={state.page_count} total={state.totalPage} />

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
                    onClick={this.addOrEditRequest.bind(this)}
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