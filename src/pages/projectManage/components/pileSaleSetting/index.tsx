import React from "react";
import "./index.less";
import { Alert, message, Form, Select, Modal, Input, Button, Table, Switch, TimePicker } from "antd";
import NProgress from "nprogress";
import { input } from "../../../../utils/utils";
import { getSaleSetting, savePileSaleSetting } from "../../../../api/projectManage";
import moment from "moment";

interface Props {
    title: string,
    id: string|number,
    confirm(): void,
    cancel(): void
}

class RulesItem {
    price = 0;
    maxTime = 0;
    maxKwh = 0;
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
            "postpaidPriceHour": 0,// 分/小时
            "postpaidPriceKwh": 0,// 分/KWH
            "postpaidMaxTime": 0, // 最长充电时间，单位：秒// 后付费规则列表，按数组里成员顺序决定index
            "prepaidRules":[
                // {
                //     "price":1,// 单价
                //     "maxTime":1,// 时间，单位：秒
                //     "maxKwh":1// 最多KWH
                // }
            ]
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
    
    //检验获取价格设置表单数据
    getFormData (): object|boolean {
        const _: any = this.state.form, __: any[] = _.prepaidRules;
        let msg = "";
        if (!_.postpaidPriceHour) msg = "每小时价格未设置";
        else if (!_.postpaidMaxTime) msg = "最长充电时间未设置";
        else if (!_.postpaidPriceKwh) msg = "最大KWH未设置";
        if (msg) {
            message.warning(msg);
            return false;
        }
        if (!this.checkBeforePriceItem()) {
            return false;
        }
        _.postpaidMaxTime = this.transTime(_.postpaidMaxTime);
        __.forEach(item => {
            let a = this.transTime(item["maxTime"]);
            console.log(a);
            item["maxTime"] = a;
        });
        return _;
    }

    //设置价格表单信息
    setFormData (data: any) {
        const _: any = this.state.form;
        Object.keys(_).forEach(key => {
            if (key === "postpaidMaxTime") {
                _[key] = this.transTime(data[key]);
            } else {
                _[key] = data[key];
            }
        });
        _["prepaidRules"] && _["prepaidRules"].forEach(item => {
            item["maxTime"] = this.transTime(item["maxTime"]);
        });
        this.setState({});
        console.log(this.state.form);
    }

    //增加一行价格设置
    addPriceItem () {
        if (this.checkBeforePriceItem()) {
            this.state.form.prepaidRules.push(new RulesItem);
            this.setState({});
        }
    }

    //删除一行价格设置 
    delPriceItem (index) {
        if (typeof index === "number") {
            this.state.form.prepaidRules.splice(index, 1);
            this.setState({});
        } else {
            this.state.form.prepaidRules = [];
            this.setState({});
        }
    }

    //检查前面的价格设置是否完成
    checkBeforePriceItem (): boolean {
        const summaryMap = {
            price: "单价",
            maxTime: "时间",
            maxKwh: "最多Kwh"
        }
        const arr = this.state.form.prepaidRules;
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            for (let key of Object.keys(item)) {
                if (!item[key] && summaryMap.hasOwnProperty(key)) {
                    message.warning("请完成后付费规则第" + (i + 1) + "行的" + summaryMap[key]);
                    return false;
                }
            }
        }
        return true;
    }

    async loadSetting () {
        NProgress.start();
        let res = null;
        try {
            res = await getSaleSetting({projectId: (this as any).props.id});
        } catch(err) {
            message.error(err);
            NProgress.done();
            return;
        }
        NProgress.done();
        if (Number(res.code) === 12002) return;
        if (Number(res.code) === 0) {
            this.setFormData(res.data);
        }
    }

    async saveSetting () {
        const data: any = this.getFormData();
        console.log(data);
        if (data) {
            NProgress.start();
            try {
                await savePileSaleSetting({projectId: (this as any).props.id, ...data});
            } catch(err) {
                NProgress.done();
                return;
            }
            NProgress.done();
            message.success("已保存");
            (this as any).props.confirm.call(null);
        }
    }

    //转换时间（用于时间选择器与秒之间转换）
    transTime (time: string|number): number|string {
        let res;
        if (typeof time === "string") {
            const match: any = time.match(/(\d+):(\d+):(\d+)/);
            res = (match[1] * 3600) + (match[2] * 60) + Number(match[3]);
        }
        if (typeof time === "number") { 
            let hour: number|string = Math.floor(time / 60 / 60);
            time -= hour * 60 * 60;
            let minute: number|string = Math.floor(time / 60);
            hour < 10 && (hour = "0" + hour);
            minute < 10 && (minute = "0" + minute);
            time < 10 && (time = "0" + time);
            res = `${hour}:${minute}:${time}`;
        }
        return res;
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
            <div className="pilesalesetting-component-wrap">

                <Modal
                width={"600px"}
                visible={true}
                closable={false}
                maskClosable={false}
                title={props.title ? "\"" + props.title + "\" 价格设置" : "价格设置"}
                onOk={this.confirm.bind(this)}
                onCancel={this.cancel.bind(this)}
                >
                    <div>
                        <Form className="salesetting-component-wrap-form">
                            <Form.Item label="元/小时">
                                <Input value={state.form.postpaidPriceHour} onInput={input.bind(this, "form.postpaidPriceHour")}/>
                            </Form.Item>
                            <Form.Item label="元/KWH">
                                <Input value={state.form.postpaidPriceKwh} onInput={input.bind(this, "form.postpaidPriceKwh")}/>
                            </Form.Item>
                            <Form.Item label="最长充电时间">
                                <TimePicker onChange={(time, timeStr) => {
                                    input.call(this, "form.postpaidMaxTime", timeStr);
                                }} 
                                value={moment(state.form.postpaidMaxTime, 'HH:mm:ss')}
                                />
                            </Form.Item>
                            <Form.Item label="预付费规则">
                                <Table 
                                scroll={{y: 200}}
                                size="small"
                                rowKey={() => null}
                                columns={[
                                    {title: "单价", render: (item, record, index) => (
                                        <Input 
                                        placeholder="单价"
                                        value={state.form.prepaidRules[index].price} 
                                        onChange={input.bind(this, `form.prepaidRules[${index}].price`)}
                                        />
                                    )},
                                    {title: "时间", render: (item, record, index) => (
                                        <TimePicker 
                                        placeholder="最长时间"
                                        onChange={(time, timeStr) => input.call(this, `form.prepaidRules[${index}].maxTime`, timeStr)} 
                                        value={state.form.prepaidRules[index].maxTime ? moment(state.form.prepaidRules[index].maxTime, 'HH:mm:ss'): null} 
                                        />
                                    )},
                                    {title: "最大KWH", render: (item, record, index) => (
                                        <Input
                                        placeholder="最大kwh"
                                        value={state.form.prepaidRules[index].maxKwh} 
                                        onChange={input.bind(this, `form.prepaidRules[${index}].maxKwh`)}/>
                                    )},
                                    {title: "操作", render: (item, record, index) => (
                                        <Form layout="inline">
                                            <Form.Item>
                                                <Button type="danger" icon="delete" onClick={this.delPriceItem.bind(this, index)}>删除</Button>
                                            </Form.Item>
                                        </Form>
                                    )},
                                ]}
                                dataSource={state.form.prepaidRules}
                                pagination={false}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button icon="plus" type="link" onClick={this.addPriceItem.bind(this)}>增加一行</Button>
                                <Button 
                                disabled={state.form.prepaidRules.length === 0} 
                                icon="delete" type="link" style={{color: state.form.prepaidRules.length === 0 ? "" : "red"}}
                                onClick={this.delPriceItem.bind(this, null)}
                                >清空</Button>
                            </Form.Item>
                        </Form>
                    </div>

                </Modal>

            </div>
        );
    }
}