import React from "react";
import "./index.less";

import {
    Form,
    Button,
    Table,
    Input,
    Popover,
    message,
    Modal,
    Switch,
    Tag
} from "antd";
const { TextArea } = Input;
import { input, initLife, timeToDateStr } from "../../utils/utils";
import Nprogress from "nprogress";
import { getNfcList, enable, disable, importNfcCard } from "../../api/nfc";

export default class Nfc extends React.Component {
    constructor (props) {
        super(props);
    }

    state = {
        columns: [
            {
                title: "NFC卡号",
                dataIndex: "nfc_id",
                key: "nfc_id"
            },
            {
                title: "二维码",
                dataIndex: "hash_id",
                key: "hash_id"
            },
            {
                title: "金额",
                dataIndex: "amount",
                key: "amount"
            },
            {
                title: "赠送余额",
                dataIndex: "bonuses",
                key: "bonuses"
            },
            {
                title: "创建时间",
                render: item => item.createTime ? timeToDateStr(item.createTime * 1000) : "-"
            },
            {
                title: "状态码",
                render: (item, record, index) => {
                    return (
                        <div>
                            <Switch 
                            checkedChildren="开" 
                            unCheckedChildren="关" 
                            loading={this.state.switchLoadings[index]}
                            checked={Number(item.status) === 0 || Number(item.status) === 1} 
                            onChange={() => {
                                if (Number(item.status) === 0 || Number(item.status) === 1) {
                                    this.disableNfc(item, index);
                                }
                                if (Number(item.status === 2)) {
                                    this.openOrOffToast(item);
                                }
                            }}
                            />
                            {Number(item.status) === 0 ?  <Tag style={{marginLeft: "16px"}} color="orange">未销售</Tag> :
                            Number(item.status) === 1 ? <Tag style={{marginLeft: "16px"}} color="green">正常</Tag> :
                            Number(item.status) === 2 ? <Tag style={{marginLeft: "16px"}} color="grey">DISABLED</Tag> : null}
                        </div>
                    )
                }
            },
            {
                title: "用户信息",
                render: (item, record, index) => {
                    const content = (
                        <div>
                            <p>用户名：{item.name || "-"}</p>
                            <p>电话：{item.phone || "-"}</p>
                            <p>备注：{item.remark || "-"}</p>
                        </div>
                    )
                    return (<Popover content={content} title="用户信息">
                        <Button type="link">详情></Button>
                    </Popover>)
                }
            },
        ],
        form: {
            q: ""
        },
        toast: {
            show: false,
            data: {
                id: "",
                name: "",
                phone: "",
                remark: ""
            }
        },
        //批量导入nfc弹窗
        importNfcToast: {
            show: false,
            cardIds: ""
        },
        switchLoadings: [],
        list: [],
        page: 1,
        limit: 10,
        total: 1,
    }

    componentDidMount () {
        initLife(this, this.init);
    }

    init () {
        this.loadList();
    }

    //加载列表
    async loadList () {
        Nprogress.start();
        let res = null;
        try {
            res = await getNfcList({
                q: this.state.form.q,
                page: this.state.page,
                limit: this.state.limit
            });
        } catch(err) {
            Nprogress.done();
            return;
        }
        Nprogress.done();
        const switchLoadings = res.list.map(item => false);
        this.setState({list: res.list, total: res.total, switchLoadings});
    }

    //禁用NFC
    async disableNfc (item, index) {
        const loading = () => {
            this.state.switchLoadings[index] = !this.state.switchLoadings[index];
            this.setState({});
        }
        loading();
        try {
            await disable({id: item.id});
        } catch(err) {
            loading();
            return;
        }
        loading();
        this.loadList();
    }

    //打开关闭nfc启用表单弹窗
    openOrOffToast (item): void {
        const _ = this.state.toast, __ = _.data;
        if (item) {
            _.show = true;
            __["id"] = item.nfc_id;
        } else {
            _.show = false;
            Object.keys(__).forEach(key => __[key] = "");
        }
        this.setState({});
    }

    //nfc启用, 由启用弹窗确定按钮来调用
    async enableNfc () {
        const checkMap = {
            id: {msg: "id缺失", type: Number},
            name: {msg: "请填写用户名", type: String},
            phone: {msg: "请填写电话", type: String},
            remark: {msg: "请填写备注", type: String}
        }
        for (let key of Object.keys(checkMap)) {
            if (!this.state.toast.data[key]) {
                message.warning(checkMap[key].msg);
                return;
            } else {
                this.state.toast.data[key] = checkMap[key].type(this.state.toast.data[key]);
            }
        }
        Nprogress.start();
        try {
            await enable(this.state.toast.data);
        } catch(err) {
            Nprogress.done();
            return;
        }
        Nprogress.done();
        this.openOrOffToast(null);
        this.loadList();
    }

    //导入nfc卡
    async importNfc () {
        Nprogress.start();
        if (this.state.importNfcToast.cardIds === "") {
            message.warning("请输入NFC卡卡号");
            return;
        }
        const cardIds = this.state.importNfcToast.cardIds.replace(/[^0-9a-z\n]/ig, "").split("\n");
        try {
            await importNfcCard({cardIds});
        } catch(err) {
            Nprogress.done();
            return;
        }
        Nprogress.done();
        this.openOrOffImportNfcToast(null);
        message.success("导入成功");
        this.loadList();
    }

    //打开关闭导入nfc弹窗
    openOrOffImportNfcToast (is: boolean) {
        const _: any = this.state.importNfcToast;
        if (is) {
            _.show = true;
            _.cardIds = "";
        } else {
            _.show = false;
        }
        this.setState({});
    }

    render () {
        const state = this.state;
        return (
            <div className="nfc-page-wrap">
                <Form layout="inline">
                    <Form.Item>
                        <Input value={state.form.q} onChange={input.bind(this, "form.q")} placeholder="NFC卡号ID"/>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="plus" onClick={this.openOrOffImportNfcToast.bind(this)}>导入</Button>
                    </Form.Item>
                </Form>
                <Table
                rowKey="nfc_id"
                style={{marginTop: "16px"}}
                columns={state.columns}
                dataSource={state.list}
                pagination={{
                    pageSize: this.state.limit,
                    total: this.state.total,
                    onChange: page => {
                        this.state.page = page;
                        this.loadList();
                    }
                }}
                />

                {/* 启用填写表单弹窗 */}
                <Modal
                title="启用NFC"
                visible={state.toast.show}
                maskClosable={false}
                closable={false}
                onCancel={this.openOrOffToast.bind(this, null)}
                onOk={this.enableNfc.bind(this)}
                >
                    <Form>
                        <Form.Item label="用户名">
                            <Input placeholder="用户名" value={state.toast.data.name} onChange={input.bind(this, "toast.data.name")}/>
                        </Form.Item>
                        <Form.Item label="电话">
                            <Input placeholder="电话" value={state.toast.data.phone} onChange={input.bind(this, "toast.data.phone")}/>
                        </Form.Item>
                        <Form.Item label="备注">
                            <Input.TextArea placeholder="备注" value={state.toast.data.remark} onChange={input.bind(this, "toast.data.remark")}></Input.TextArea>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 批量导入nfc弹窗 */}
                <Modal
                title="导入NFC卡"
                maskClosable={false}
                visible={state.importNfcToast.show}
                onCancel={this.openOrOffImportNfcToast.bind(this, null)}
                onOk={this.importNfc.bind(this)}
                >
                    <Form>
                        <Form.Item>
                            <TextArea autosize={{ minRows: 10}} onChange={input.bind(this, "importNfcToast.cardIds")} value={state.importNfcToast.cardIds} placeholder="每行一个NFC卡号"/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}