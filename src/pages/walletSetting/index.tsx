import React from "react";
import "./index.less";
import {
    Form,
    Input,
    Button,
    message,
    Select
} from "antd";
const { Option } = Select;
import { input, initLife } from "../../utils/utils";
import { getWalletSetting, saveWalletSetting } from "../../api/setting";
import NProgress from "nprogress";

export default class WalletSetting extends React.Component {

    state = {
        uploadUrl: _ENV_.HOST + "/upload/adminUpload",
        uploadLoading: false,
        saveLoading: false,
        types: [
            {text: "转账", value: 1},
            {text: "退款优先", value: 2}
        ],
        data: {
            weixin_jsapi_pay_agent_id: "", //	支付服务微信ID	
            pay_service_key: "", //	支付服务key	
            weixin_oauth_agent_id: "", //	账户服务微信ID	
            refund_method: "", //退款方式 1-转账；2-退款优先
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
            res = await getWalletSetting()
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.setState({data: res.data});
    }

    //保存配置
    async save () {
        this.setState({saveLoading: true});
        try {
            await  saveWalletSetting({configs: this.state.data});
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
            <div className="wallet-page-wrap">

                <Form className="form">
                    <Form.Item className="Item" label="支付服务微信id">
                        <Input 
                        placeholder="支付服务微信id"
                        value={state.data.weixin_jsapi_pay_agent_id} 
                        onChange={input.bind(this, "data.weixin_jsapi_pay_agent_id")}
                        className="long-input"
                        />
                    </Form.Item>
                    <Form.Item className="Item" label="支付服务key" >
                        <Input 
                        placeholder="支付服务key"
                        value={state.data.pay_service_key} 
                        onChange={input.bind(this, "data.pay_service_key")}
                        className="long-input"
                        />
                    </Form.Item>
                    <Form.Item className="Item" label="账户服务微信ID" >
                        <Input 
                        placeholder="账户服务微信ID	"
                        value={state.data.weixin_oauth_agent_id} 
                        onChange={input.bind(this, "data.weixin_oauth_agent_id")}
                        className="long-input"
                        />
                    </Form.Item>
                    <Form.Item className="Item" label="退款方式" >
                        <Select placeholder="退款方式" value={Number(state.data.refund_method)} onChange={input.bind(this, "data.refund_method")}>
                            {state.types.map((item, index) => <Option value={item.value}>{item.text}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item className="Item">
                        <Button icon="cloud-upload" onClick={this.save.bind(this)} loading={state.saveLoading}>保存</Button>
                    </Form.Item>
                </Form>

            </div>
        );
    }
}