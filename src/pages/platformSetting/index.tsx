import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button,
    message
} from "antd";
import { input, initLife } from "../../utils/utils";
import store from "../../store";
import { saveSetting, getSetting } from "../../api/setting";
import NProgress from "nprogress";

export default class PlatformSetting extends React.Component {

    state = {
        uploadUrl: _ENV_.HOST + "/upload/adminUpload",
        uploadLoading: false,
        saveLoading: false,
        data: {
            iot_grpc_url: "", //	平台gRPC接口地址	
            iot_grpc_username: "", //	平台用户名	
            iot_grpc_password: "", //	平台密码
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
        this.setState({data: res.data || {}});
    }

    //保存配置
    async save () {
        this.setState({saveLoading: true});
        try {
            await saveSetting({configs: this.state.data});
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
            <div className="platform-page-wrap">

                <Form className="form">
                    <Form.Item className="Item" label="平台gRPC接口地址	">
                        <Input placeholder="平台gRPC接口地址" value={state.data.iot_grpc_url} onChange={input.bind(this, "data.iot_grpc_url")}/>
                    </Form.Item>
                    <Form.Item className="Item" label="平台用户名">
                        <Input placeholder="平台用户名" value={state.data.iot_grpc_username} onChange={input.bind(this, "data.iot_grpc_username")}/>
                    </Form.Item>
                    <Form.Item className="Item" label="平台密码">
                        <Input placeholder="平台密码" value={state.data.iot_grpc_password} onChange={input.bind(this, "data.iot_grpc_password")}/>
                    </Form.Item>
                    <Form.Item className="Item">
                        <Button icon="cloud-upload" onClick={this.save.bind(this)} loading={state.saveLoading}>保存</Button>
                    </Form.Item>
                </Form>

            </div>
        );
    }
}