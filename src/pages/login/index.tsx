import React from "react";
import "./less/index.less";
import store from "../../store";
import {
    Form,
    Input,
    Button,
    message
} from "antd";

/**
 * 静态资源 
 */
import logo from "../../assets/img/logo.jpg";

export default class NotFound extends React.Component {

    state = {
        from: {
            user: "",
            pass: ""
        },
        disabledAll: false,
        copyright: "",
        title: ""
    }
    componentDidMount () {
        this.initUseStore();
    }

    initUseStore () {
        const { layout } = store.getState();
        this.setState({
            copyright: layout.copyright,
            title: layout.title
        });
        store.subscribe(() => {
            const { layout } = store.getState();
            this.setState({
                copyright: layout.copyright,
                title: layout.title
            });
        });
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
                        <div className="title-wrap">
                            <img src={logo} alt=""/>
                            <h2 className="title">{state.title}</h2>
                        </div>
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
                    <div className="copyright">&copy; {state.copyright}</div>
                </Form>
            </div>
        );
    }
}