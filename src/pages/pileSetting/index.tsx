import React from "react";
import "./index.less";
import {
    Form,
    Input,
    Button,
    message
} from "antd";
import { input, initLife } from "../../utils/utils";
import { saveSetting, getSetting } from "../../api/setting";
import NProgress from "nprogress";

export default class PileSetting extends React.Component {

    state = {
        saveLoading: false,
        data: {
            charging_station_min_balance: 0, //充电桩最高欠款额度（单位分）
        }
    }

    componentDidMount () {
        initLife(this, this.init);
    }

    init () {
        this.loadSetting();
    }

    //加载配置
    async loadSetting () {
        NProgress.start();
        let res = null;
        try {
            res = await getSetting();
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        const data = {
            charging_station_min_balance: res.data.charging_station_min_balance / 100
        }
        console.log(data);
        this.setState({data});
    }

    //保存配置
    async save () {
        const data = {
            charging_station_min_balance: this.state.data.charging_station_min_balance * 100
        }
        this.setState({saveLoading: true});
        try {
            await saveSetting({configs: data});
        } catch(err) {
            this.setState({saveLoading: false});
            return;
        }
        this.setState({saveLoading: false});
        message.success("保存成功");
        this.loadSetting();
    }

    render (): any {
        const state: any = this.state;
        return (
            <div className="pilesetting-page-wrap">

                <Form className="form">
                    <Form.Item className="Item" label="最高欠款额度">
                        <Input value={state.data.charging_station_min_balance} onChange={input.bind(this, "data.charging_station_min_balance")}
                        placeholder="设置充电桩最高欠款额度"
                        className="long-input"
                        addonAfter="元" 
                        />
                    </Form.Item>
                    <Form.Item className="Item">
                        <Button icon="cloud-upload" onClick={this.save.bind(this)} loading={state.saveLoading}>保存</Button>
                    </Form.Item>
                </Form>

            </div>
        );
    }
}