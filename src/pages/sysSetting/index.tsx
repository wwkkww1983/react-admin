import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button,
    Tabs,
    Upload,
    Icon
} from "antd";
const { TabPane } = Tabs;
import { input, initLife } from "../../utils/utils";

export default class Home extends React.Component {

    state = {
        uploadLoading: false,
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
    }

    save () {

    }

    render (): any {
        const state: any = this.state;
        return (
            <div className="sysSetting-page-wrap">

                <Tabs defaultActiveKey="1" onChange={() => {}}>
                    <TabPane tab="标题配置" key="1">

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
                    <TabPane tab="详细配置" key="2">

                        <Form className="form">
                            <Form.Item className="Item" label="运营商logo" style={{marginBottom: "0"}}>
                                <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={() => Promise.resolve()}
                                onChange={() => {}}
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
                            <Form.Item className="Item" label="运营商微信公众号二维码" >
                                <Input value={state.data.software_upgrade_url} onChange={input.bind(this, "data.software_upgrade_url")}
                                className="long-input"></Input>
                            </Form.Item>
                            <Form.Item className="Item" label="最多拥有电池数量">
                                <Input value={state.data.hardware_upgrade_url} onChange={input.bind(this, "data.hardware_upgrade_url")}
                                className="long-input"></Input>
                            </Form.Item>
                            <Form.Item className="Item" label="虚拟电池售价" >
                                <Input value={state.data.software_upgrade_url} onChange={input.bind(this, "data.software_upgrade_url")}
                                className="long-input"></Input>
                            </Form.Item>
                        
                            <Form.Item className="Item">
                                <Button onClick={this.save.bind(this)}>保存</Button>
                            </Form.Item>
                        </Form>

                    </TabPane>
                </Tabs>
            </div>
        );
    }
}