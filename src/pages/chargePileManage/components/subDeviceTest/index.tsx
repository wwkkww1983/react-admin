import React from "react";
import "./index.less";

import NProgress from "nprogress";
import { Modal, Button, Tabs, Input, Form, message } from "antd";
const { TabPane } = Tabs;
import { input } from "../../../../utils/utils";
import axios from "axios";

export default class SubDeviceTest extends React.Component {
    constructor (props) {
        super(props);
    }

    static defaultProps = {
        deviceId: "",
        subDeviceId: "",
        onCancel: () => {}
    }

    state = {
        password: "tyiot2020",
        on: {
            port: "",
            t: "",
            v: "",
            res: []
        },
        off: {
            port: "",
            res: []
        },
        status_get: {
            res: []
        }
    }

    //请求
    async action (action, params = {}) {
        // 测试下发用的接口，可以直接浏览器打开测试
        // password-密码（tyiot2020）
        // deviceId-主设备ID
        // subDeviceId=子设备ID
        // 其它参数同文档定义
        // off:
        // https://api.app.teny.tech/chargingStation/dev/off?password=tyiot2020&deviceId=abc&subDeviceId=def&port=1
        // on:
        // https://api.app.teny.tech/chargingStation/dev/on?password=tyiot2020&deviceId=abc&subDeviceId=def&port=1&t=1&v=2
        // disable:
        // https://api.app.teny.tech/chargingStation/dev/disable?password=tyiot2020&deviceId=abc
        // enable:
        // https://api.app.teny.tech/chargingStation/dev/enable?password=tyiot2020&deviceId=abc
        // status_get:
        // https://api.app.teny.tech/chargingStation/dev/statusGet?password=tyiot2020&deviceId=abc
        // status:
        // https://api.app.teny.tech/chargingStation/dev/status?password=tyiot2020&deviceId=abc&subDeviceId=def
        // add:
        // https://api.app.teny.tech/chargingStation/dev/add?password=tyiot2020&deviceId=abc&subDeviceId=def
        // del:
        // https://api.app.teny.tech/chargingStation/dev/del?password=tyiot2020&deviceId=abc&subDeviceId=def
        const url = "https://api.app.teny.tech/chargingStation/dev/";
        const commData = {
            password: this.state.password,
            deviceId: (this as any).props.deviceId
        }
        params = Object.assign(commData, params);
        let res = null;
        NProgress.start();
        try {
            res = await axios.get(url + action, {params});
        } catch(err) {
            NProgress.done();
            message.error(err);
            return;
        }
        NProgress.done();
        return res.data;
    }

    //on（打开）
    async onAction () {
        const $ = this.state.on;
        const params = {
            port: $.port,
            t: $.t,
            v: $.v,
            subDeviceId: (this as any).props.subDeviceId
        }
        const data = await this.action("on", params);
        $.res.push(JSON.stringify(data));
        this.setState({});
    }
    onClear () {
        this.state.on.res = [];
        this.setState({});
    }

    //off（关闭）
    async offAction () {
        const $ = this.state.off;
        const params = {
            port: $.port,
            subDeviceId: (this as any).props.subDeviceId
        }
        const data = await this.action("off", params);
        $.res.push(JSON.stringify(data));
        this.setState({});
    }
    offClear () {
        this.state.off.res = [];
        this.setState({});
    }

    //status_get(状态获取)
    async status_getAction () {
        const $ = this.state.status_get;
        const data = await this.action("statusGet", {});
        $.res.push(JSON.stringify(data));
        this.setState({});
    }
    status_getClear () {
        this.state.status_get.res = [];
        this.setState({});
    }

    render () {
        const state = this.state, props = (this as any).props;
        return (
            <Modal
            width="80%"
            visible={true}
            title={`测试 (主设备id:${props.deviceId}) (子设备id:${props.subDeviceId})`}
            onCancel={props.onCancel}
            footer={null}
            >
                <div>
                    <Form layout="inline">
                        <Form.Item label="password">
                            <Input placeholder="密码，后端给的" value={state.password} onChange={input.bind(this, "password")}></Input>
                        </Form.Item>
                    </Form>
                    <Tabs defaultActiveKey="1" className="subdevicetest-component">
                        <TabPane tab="on" key="1">
                            <div className="wrap">
                                <div className="child">
                                    <Form>
                                        <Form.Item label="端口">
                                            <Input value={state.on.port} onChange={input.bind(this, "on.port")}></Input>
                                        </Form.Item>
                                        <Form.Item label="t">
                                            <Input value={state.on.t} onChange={input.bind(this, "on.t")}></Input>
                                        </Form.Item>
                                        <Form.Item label="v">
                                            <Input value={state.on.v} onChange={input.bind(this, "on.v")}></Input>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button onClick={this.onAction.bind(this)}>执行</Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                                <div className="child child_right">
                                    <div className="top">
                                        <Button onClick={this.onClear.bind(this)}>清空</Button>
                                    </div>
                                    <div className="bottom-content">
                                        {state.on.res.map(item => <p>{item}</p>)}
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="off" key="2">
                            <div className="wrap">
                                <div className="child">
                                    <Form>
                                        <Form.Item label="端口">
                                            <Input value={state.off.port} onChange={input.bind(this, "off.port")}></Input>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button onClick={this.offAction.bind(this)}>执行</Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                                <div className="child child_right">
                                    <div className="top">
                                        <Button onClick={this.offClear.bind(this)}>清空</Button>
                                    </div>
                                    <div className="bottom-content">
                                        {state.off.res.map(item => <p>{item}</p>)}
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="status_get" key="3">
                            <div className="wrap">
                                <div className="child">
                                    <Form>
                                        <Form.Item>
                                            <Button onClick={this.status_getAction.bind(this)}>执行</Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                                <div className="child child_right">
                                    <div className="top">
                                        <Button onClick={this.status_getClear.bind(this)}>清空</Button>
                                    </div>
                                    <div className="bottom-content">
                                        {state.status_get.res.map(item => <p>{item}</p>)}
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        )
    }
}