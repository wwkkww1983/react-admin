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

export default class NfcSetting extends React.Component {

    state = {
        uploadUrl: _ENV_.HOST + "/upload/adminUpload",
        uploadLoading: false,
        saveLoading: false,
        data: {
            nfc_sectors: "", //NFC扇区读写ID，1-15	
            nfc_key_a: "", //	NFC的A密钥，6字节	
            nfc_key_b: "" //	NFC的B密钥，6字节	
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
            nfc_sectors: res.data.nfc_sectors, //NFC扇区读写ID，1-15	
            nfc_key_a: res.data.nfc_key_a, //	NFC的A密钥，6字节	
            nfc_key_b: res.data.nfc_key_b //	NFC的B密钥，6字节	
        }
        this.setState({data});
    }

    //用于上传前检测表单参数
    checkData () {
        const hexReg = /^[0-9A-F]+$/i;
        const _ = this.state.data;
        let msg = "";
        if (!_.nfc_sectors || !(((_ as any).nfc_sectors < 16) && ((_ as any).nfc_sectors > 0)) ) msg = "扇区读写ID只允许1-15";
        else if (!_.nfc_key_a || !hexReg.test(_.nfc_key_a)) msg = "NFC的A密钥必须为16进制";
        else if (!_.nfc_key_b || !hexReg.test(_.nfc_key_b)) msg = "NFC的B密钥必须为16进制";
        if (msg) {
            message.warning(msg);
            return true;
        }
        return false;
    }

    //保存配置
    async save () {
        if (this.checkData()) return;
        const data = {
            nfc_sectors: this.state.data.nfc_sectors, //NFC扇区读写ID，1-15	
            nfc_key_a: this.state.data.nfc_key_a.toLocaleUpperCase(), //	NFC的A密钥，6字节	
            nfc_key_b: this.state.data.nfc_key_b.toLocaleUpperCase() //	NFC的B密钥，6字节	
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
            <div className="nfcsetting-page-wrap">

                <Form className="form">
                    <Form.Item className="Item" label="扇区读写ID(只允许1-15)">
                        <Input value={state.data.nfc_sectors} onChange={input.bind(this, "data.nfc_sectors")}
                        placeholder="请设置扇区读写ID"
                        className="long-input"/>
                    </Form.Item>
                    <Form.Item className="Item" label="NFC的A秘钥(16进制，6byte)">
                        <Input value={state.data.nfc_key_a} onChange={input.bind(this, "data.nfc_key_a")}
                        placeholder="请设置NFC的A秘钥"
                        className="long-input"/>
                    </Form.Item>
                    <Form.Item className="Item" label="NFC的B秘钥(16进制，6byte)" >
                        <Input value={state.data.nfc_key_b} onChange={input.bind(this, "data.nfc_key_b")}
                        placeholder="请设置NFC的B秘钥"
                        className="long-input"/>
                    </Form.Item>
                
                    <Form.Item className="Item">
                        <Button icon="cloud-upload" onClick={this.save.bind(this)} loading={state.saveLoading}>保存</Button>
                    </Form.Item>
                </Form>

            </div>
        );
    }
}