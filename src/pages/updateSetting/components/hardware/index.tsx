import React from "react";
import "./index.less";

import { input } from "../../../../utils/utils";
import Nprogress from "nprogress";
import {
    hardwareUpdateList,
    createHardwareUpdate,
    editHardwareUpdate,
    delHardwareUpdate
} from "../../../../api/updateSetting";
import { message, Table, Form, Modal, Input, Button, Row, Col, Select, DatePicker } from "antd";
const { Option } = Select;
import locale from 'antd/es/date-picker/locale/zh_CN'
import moment from "moment";

export default class Hardware extends React.Component {

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
            title: "hardware_ver",
            dataIndex: "hardware_ver",
            key: "hardware_ver"
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
                            <Button icon="setting" onClick={this.openOrOffToast.bind(this, item)}>编辑</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="danger" icon="delete" onClick={this.del.bind(this, item)}>删除</Button>
                        </Form.Item>
                    </Form>
                )
            }
        }
    ]

    state = {
        //硬件类型
        types: [
            {value: 0, text: "全部"},
            {value: 1, text: "柜板"},
            {value: 2, text: "仓板"}
        ],
        //头部表单
        form: {
            type: 0,
            hardware_ver: ""
        },
        //新增编辑弹窗表单状态
        toast: {
            show: false,
            title: "新增",
            type: "ADD", // ADD|EDIT
            data: {
                id: "",
                type: "",
                hardware_ver: "",
                ver_code: "",
                ver_name: "",
                remark: "",
                url: "",
                time: "",
                md5: ""
            }
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
        const type = this.state.form.type, limit = this.state.limit, page = this.state.page;
        let res = null;
        try {
            res = await hardwareUpdateList({type, page, limit});
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
    del (item: any): void {
        Modal.confirm({
            title: `确定要删除id为 "${item.id}" 的升级记录吗？`,
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () =>  f.call(this)
        });
        async function f () {
            Nprogress.start();
            try {
                await delHardwareUpdate({id: item.id});
            } catch(err) {
                Nprogress.done();
                return;
            }
            Nprogress.done();
            message.success("已删除");
            this.loadList();
        }
    }

    //检查并获取新增、编辑表单参数
    checkAndGetPrams (): object|boolean {
        const checkMap = {
            id: {msg: "请填写id", type: Number},
            type: {msg: "请选择type", type: Number},
            hardware_ver: {msg: "请填写hardware_ver", type: Number},
            ver_code: {msg: "请填写ver_code", type: Number},
            ver_name: {msg: "请填写ver_name", type: String},
            remark: {msg: "请填写remark", type: String},
            url: { msg: "请填写url", type: String},
            time: { msg: "请选择time", type: String},
            md5: {msg: "请填写md5", type: String}
        }
        const _ = this.state.toast.data;
        for (let key of Object.keys(checkMap)) {
            if (!_[key]) {
                message.warning(checkMap[key].msg);
                return false;
            } else {
                _[key] = checkMap[key].type(_[key]);
            }
        }
        return _;
    }

    //打开、关闭新增编辑表单
    openOrOffToast (item: object|boolean): void {
        const _ = this.state.toast, __ = _.data;
        if (typeof item === "object") {
            _.show = true;
            _.title = "编辑";
            _.type = "EDIT";
            Object.keys(__).forEach(key => {
                __[key] = item[key];
            });
        } 
        else if (item === true) {
            _.show = true;
            _.title = "新增";
            _.type = "ADD";
        } 
        else if (item === false) {
            _.show = false;
            _.title = "";
            _.type = "";
            Object.keys(__).forEach(key => __[key] = "");
        }
        this.setState({});
    }

    //创建、编辑保存
    async save () {
        const type = this.state.toast.type;
        const data: any = this.checkAndGetPrams();
        if (!data) return;
        Nprogress.start();
        try {
            if (type === "ADD") {
                await createHardwareUpdate(data);
            }
            if (type === "EDIT") {
                await editHardwareUpdate(data);
            }
        } catch(err) {
            Nprogress.done();
            return;
        }
        Nprogress.done();
        message.success(type === "EDIT" ? "编辑已保存" : "新增成功");
        this.openOrOffToast(false);
        this.loadList();
    }

    render () {
        const state: any = (this as any).state;
        return (
            <div className="hardware-component">
                <Form layout="inline">
                    <Form.Item>
                        <Select value={state.form.type} style={{ width: 120 }} onChange={input.bind(this, "form.type")}>
                            {state.types.map((item, index) => <Option value={item.value}>{item.text}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="plus" onClick={this.openOrOffToast.bind(this, true)}>新增</Button>
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

                {/* 新增编辑弹窗表单 */}
                <Modal 
                closable={false}
                maskClosable={false}
                title={state.toast.title}
                visible={state.toast.show}
                onOk={this.save.bind(this)}
                onCancel={this.openOrOffToast.bind(this, false)}
                >
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label="id">
                                <Input value={state.toast.data.id} onChange={input.bind(this, "toast.data.id")} placeholder="id"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="type">
                                <Select placeholder="type" value={state.toast.data.type} style={{width: "100%"}} onChange={input.bind(this, "toast.data.type")}>
                                    {state.types.slice(1).map((item, index) => <Option value={item.value}>{item.text}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label="hardware_ver">
                                <Input value={state.toast.data.hardware_ver} onChange={input.bind(this, "toast.data.hardware_ver")} placeholder="hardware_ver"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="ver_code">
                                <Input value={state.toast.data.ver_code} onChange={input.bind(this, "toast.data.ver_code")} placeholder="ver_code"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label="ver_name">
                                <Input value={state.toast.data.ver_name} onChange={input.bind(this, "toast.data.ver_name")} placeholder="ver_name"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="remark">
                                <Input value={state.toast.data.remark} onChange={input.bind(this, "toast.data.remark")} placeholder="remark"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{display: "flex", justifyContent: "space-between"}}>
                        <Col span={24}>
                            <Form.Item label="url">
                                <Input value={state.toast.data.url} onChange={input.bind(this, "toast.data.url")} placeholder="url"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label="time">
                                <DatePicker 
                                locale={locale} 
                                value={state.toast.data.time ? moment(state.toast.data.time, "YYYY-MM-DD") : null} 
                                onChange={(date, dateStr) => {
                                    input.call(this, "toast.data.time", dateStr);
                                }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="md5">
                                <Input value={state.toast.data.md5} onChange={input.bind(this, "toast.data.md5")} placeholder="md5"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                </Modal>

            </div>
        );
    }
}