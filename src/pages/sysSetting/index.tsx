import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button,
    Tabs,
    Upload,
    Icon,
    message
} from "antd";
const { TabPane } = Tabs;
import { input, initLife } from "../../utils/utils";
import store from "../../store";
import { saveSetting, getSetting } from "../../api/setting";
import NProgress from "nprogress";

export default class Home extends React.Component {

    state = {
        uploadUrl: _ENV_.HOST + "/upload/adminUpload",
        uploadLoading: false,
        saveLoading: false,
        data: {
            "charging_pile_title": "",
            "charging_box_title": "",
            "software_upgrade_url": "", //"软件升级地址",
            "hardware_upgrade_url": "", //"硬件升级地址",
            "logo_url": "", //"运营商logo文件URL",
            "wx_official": "", //"运营商微信公众号二维码URL",
            "max_batteries": 0, // 最多拥有的电池数量
            "battery_price": 0, // 虚拟电池售价
        }
    }

    componentDidMount () {
        initLife(this, this.init);
    }

    init () {
        console.error("初始化33");
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

    //上传logo之前进行判断
    beforeUpload (file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.warning('仅支持JPG和PNG格式');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.warning('logo不能大于2MB');
        }
        return isJpgOrPng && isLt2M;
    }

    //图片上传过程处理
    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ uploadLoading : true });
          return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            if (!info.file.response.url) {
                message.error(info.file.response.message || "上传出错");
                return;
            }
            (this as any).state.data.logo_url = info.file.response.url;
            this.setState({});
        }
    };

    render (): any {
        const state: any = this.state;
        return (
            <div className="sysSetting-page-wrap">

                <Tabs defaultActiveKey="1" onChange={() => {}}>
                    <TabPane tab="公共配置" key="1">

                        <Form className="form">
                            <Form.Item className="Item" label="换电柜title">
                                <Input value={state.data.charging_box_title} onChange={input.bind(this, "data.charging_box_title")}></Input>
                            </Form.Item>
                            <Form.Item className="Item" label="充电站title">
                                <Input value={state.data.charging_pile_title} onChange={input.bind(this, "data.charging_pile_title")}></Input>
                            </Form.Item>
                            <Form.Item className="Item">
                                <Button onClick={this.save.bind(this)}>保存</Button>
                            </Form.Item>
                        </Form>

                    </TabPane>
                    <TabPane tab="所有配置" key="2">

                        <Form className="form">
                            <Form.Item className="Item" label="运营商logo" style={{marginBottom: "0"}}>
                                <Upload
                                name="file"
                                headers={{
                                    Authorization: "Bearer " + store.getState().token
                                }}
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={state.uploadUrl}
                                beforeUpload={this.beforeUpload.bind(this)}
                                onChange={this.handleChange.bind(this)}
                                >
                                    {
                                    state.data.logo_url ? 
                                    <img src={state.data.logo_url} alt="avatar" style={{ width: '100%' }} /> : 
                                    <div>
                                        <Icon type={state.uploadLoading ? 'loading' : 'plus'} />
                                        <div className="ant-upload-text">上传logo</div>
                                    </div>
                                    }
                                </Upload>
                            </Form.Item>
                            <Form.Item className="Item" label="软件升级地址" >
                                <Input value={state.data.software_upgrade_url} onChange={input.bind(this, "data.software_upgrade_url")}
                                className="long-input"></Input>
                            </Form.Item>
                            <Form.Item className="Item" label="硬件升级地址">
                                <Input value={state.data.hardware_upgrade_url} onChange={input.bind(this, "data.hardware_upgrade_url")}
                                className="long-input"></Input>
                            </Form.Item>
                            <Form.Item className="Item" label="运营商微信公众号二维码URL" >
                                <Input value={state.data.wx_official} onChange={input.bind(this, "data.wx_official")}
                                className="long-input"></Input>
                            </Form.Item>
                            <Form.Item className="Item" label="最多拥有电池数量">
                                <Input value={state.data.max_batteries} onChange={input.bind(this, "data.max_batteries")}
                                className="long-input"></Input>
                            </Form.Item>
                            <Form.Item className="Item" label="虚拟电池售价" >
                                <Input value={state.data.battery_price} onChange={input.bind(this, "data.battery_price")}
                                className="long-input"></Input>
                            </Form.Item>
                        
                            <Form.Item className="Item">
                                <Button onClick={this.save.bind(this)} loading={state.saveLoading}>保存</Button>
                            </Form.Item>
                        </Form>

                    </TabPane>
                </Tabs>
            </div>
        );
    }
}