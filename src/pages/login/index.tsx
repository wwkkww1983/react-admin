import React from "react";
import "./less/index.less";
import store from "../../store";
import {
    Form,
    Input,
    Button,
    message
} from "antd";
import { login } from "../../api/user";
import { input } from "../../utils/utils";

/**
 * 静态资源 
 */
import logo from "../../assets/img/logo.jpg";

export default class NotFound extends React.Component {

    input = input;

    state = {
        form: {
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
        const username: string = this.state.form.user, password: string = this.state.form.pass;
        this.loading();
        login({username, password})
        .then((res: any): void => {
            this.loading();
            const token: string = res.token, member: any = res.member;
            store.dispatch({type: "token/SET_TOKEN", playload: token});
            store.dispatch({type: "user/SET_USER", playload: member});
            (this as any).props.history.push({path: "/"});
        })
        .catch(err => {
            this.loading();
        });
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
                        <Input placeholder="请输入用户名" disabled={state.disabledAll} value={state.form.user} onChange={this.input.bind(this, "form.user")}/>
                    </Form.Item>
                    <Form.Item className="Item">
                        <Input placeholder="请输入密码" type="password" disabled={state.disabledAll} value={state.form.pass} onChange={this.input.bind(this, "form.pass")}/>
                    </Form.Item>
                    <Form.Item>
                        <Button loading={state.disabledAll} style={{width: "100%"}} type="primary"  disabled={!state.form.pass || !state.form.user} onClick={this.actionLogin.bind(this)}>
                            {!state.form.user || !state.form.pass ? "请输入账密登陆" : state.disabledAll ? "正在登录..." : "登录"}
                        </Button>
                    </Form.Item>
                    <div className="copyright">&copy; {state.copyright}</div>
                </Form>
            </div>
        );
    }
}