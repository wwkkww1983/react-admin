import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button,
    message
} from "antd";

export default class NotFound extends React.Component {

    state = {
        from: {
            user: "",
            pass: ""
        },
        disabledAll: false
    }

    loading () {
        this.state.disabledAll = !this.state.disabledAll;
        this.setState({});
    }

    actionLogin () {
        this.loading();
        setTimeout(() => {
            this.loading();
            // message.error("登录失败");
            (this as any).props.history.push({path: "/"});
        }, 1500);
    }

    render (): any {
        const state = this.state;
        return (
            <div className="login-wrap">
                <Form className="form">
                    <Form.Item>
                        <h2 className="title">腾跃物联后台管理系统</h2>
                    </Form.Item>
                    <Form.Item className="Item">
                        <Input placeholder="请输入用户名" disabled={state.disabledAll}/>
                    </Form.Item>
                    <Form.Item className="Item">
                        <Input placeholder="请输入密码" type="password" disabled={state.disabledAll}/>
                    </Form.Item>
                    <Form.Item>
                        <Button loading={state.disabledAll} style={{width: "100%"}} type="primary" onClick={this.actionLogin.bind(this)}>{state.disabledAll ? "正在登录..." : "登录"}</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}