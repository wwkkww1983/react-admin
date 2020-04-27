import React from "react";
import "./index.less";
import { Alert, message, Form, Select, Modal, Input, Button, Table, Switch, List } from "antd";
import NProgress from "nprogress";
import { input } from "../../../../utils/utils";
import { getSaleSetting, saveSaleSetting } from "../../../../api/projectManage";

interface Props {
    title: string,
    id: string|number,
    confirm(): void,
    cancel(): void
}

export default class Home extends React.Component {

    static defaultProps: Props = {
        title: "",
        id: "",
        confirm: () => {},
        cancel: () => {}
    }

    constructor (props) {
        super(props);
    }

    state = {
        form: {
            "projectId": "",
            "everyTimePrice": 0,// 按次计费价格
            "everyTimeDepositCheck": false,// 按次计费押金检测开关
            "hourlyPrice": 0,// 按时计费每小时费用
            "hourlyPriceMaxDaily": 0,// 按时计费每小时费用，每天封顶价格
            "hourlyDepositCheck": false,// 按时计费押金检测开关
            "monthlyPrice": 0,// 包月计费，每月费用
            "monthlyPriceMaxTimes": 0,// 包月计费，每月最多次数
            "monthlyDepositCheck": false// 包月计费押金检测开关
        }
    }

    componentWillReceiveProps (props) {
       
    }

    componentDidMount () {
        this.init();
    }

    async init () {
        this.loadSetting();
    }

    async loadSetting () {
        NProgress.start();
        let res = null;
        try {
            res = await getSaleSetting({projectId: (this as any).props.id});
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.setState({form: res.data});
    }

    async saveSetting () {
        if (checkParams.call(this)) {
            NProgress.start();
            try {
                await saveSaleSetting(buildParams.call(this));
            } catch(err) {
                NProgress.done();
                return;
            }
            NProgress.done();
            message.success("已保存");
            (this as any).props.confirm.call(null);
        }
        function buildParams (): any {
            const form: any = (this as any).state.form;
            const data: any = {};
            Object.keys(form).forEach(key => {
                if (/^\d+$/.test(form[key])) {
                    data[key] = Number(form[key]);
                } else {
                    data[key] = form[key];
                }
            });
            if (!data.projectId) data["projectId"] = (this as any).props.id;
            return data;
        }
        function checkParams (): boolean {
            const form: any = (this as any).state.form;
            let msg = "";
            if (empty(form.everyTimePrice)) msg = "请设置按次计费价格";
            else if (empty(form.hourlyPrice)) msg = "请设置按时计费每小时费用";
            else if (empty(form.hourlyPriceMaxDaily)) msg = "请设置按时计费每天封顶价格";
            else if (empty(form.monthlyPrice)) msg = "请设置包月每月费用";
            else if (empty(form.monthlyPriceMaxTimes)) msg = "请设置包月每月最多次数";
            if (msg) {
                message.warning(msg);
                return false;
            }
            return true;
            function empty (v) {
                return v === undefined || v === "";
            }
        }
    }

    confirm () {
        this.saveSetting();
    }

    cancel () {
        (this as any).props.cancel.call(this);
    }

    render (): any {
        const state = this.state, props: any = (this as any).props;
        return (
            <div className="salesetting-component-wrap">

                <Modal
                // width={"80%"}
                visible={true}
                closable={false}
                maskClosable={false}
                title={props.title ? "\"" + props.title + "\" 价格设置" : "价格设置"}
                onOk={this.confirm.bind(this)}
                onCancel={this.cancel.bind(this)}
                >
                    <div>
                        <Form className="salesetting-component-wrap-form">
                            <Form.Item label="按次计费价格">
                                <Input value={state.form.everyTimePrice} onInput={input.bind(this, "form.everyTimePrice")}/>
                            </Form.Item>
                            <Form.Item label="按次计费押金检测">
                                <Switch  checkedChildren="开" unCheckedChildren="关" checked={state.form.everyTimeDepositCheck} onChange={input.bind(this, "form.everyTimeDepositCheck")}/>
                            </Form.Item>
                            <Form.Item label="按时计费每小时价格">
                                <Input value={state.form.hourlyPrice} onChange={input.bind(this, "form.hourlyPrice")}/>
                            </Form.Item>
                            <Form.Item label="按时计费每天封顶价格">
                                <Input value={state.form.hourlyPriceMaxDaily} onChange={input.bind(this, "form.hourlyPriceMaxDaily")}/>
                            </Form.Item>
                            <Form.Item label="按时计费押金检测">
                                <Switch  checkedChildren="开" unCheckedChildren="关" checked={state.form.hourlyDepositCheck} onChange={input.bind(this, "form.hourlyDepositCheck")}/>
                            </Form.Item>
                            <Form.Item label="包月每月价格">
                                <Input value={state.form.monthlyPrice} onInput={input.bind(this, "form.monthlyPrice")}/>
                            </Form.Item>
                            <Form.Item label="包月每月最多次数">
                                <Input value={state.form.monthlyPriceMaxTimes} onInput={input.bind(this, "form.monthlyPriceMaxTimes")}/>
                            </Form.Item>
                            <Form.Item label="包月押金检测">
                                <Switch  checkedChildren="开" unCheckedChildren="关" checked={state.form.monthlyDepositCheck} onChange={input.bind(this, "form.monthlyDepositCheck")}/>
                            </Form.Item>
                        </Form>
                    </div>

                </Modal>

            </div>
        );
    }
}