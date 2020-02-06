import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button
} from "antd";

export default class Home extends React.Component {

    state = {

    }

    render (): any {
        const state = this.state;
        return (
            <div className="sysSetting-page-wrap">
                <Form className="form" layout="inline">
                    <Form.Item className="Item" label="换电柜title">
                        <Input></Input>
                    </Form.Item>
                    <Form.Item className="Item">
                        <Button>保存</Button>
                    </Form.Item>
                </Form>

                <Form className="form" layout="inline">
                    <Form.Item className="Item" label="充电站title">
                        <Input></Input>
                    </Form.Item>
                    <Form.Item className="Item">
                        <Button>保存</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}