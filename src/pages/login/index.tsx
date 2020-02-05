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

/**
 * 静态资源 
 */
import logo from "../../assets/img/logo.jpg";

export default class NotFound extends React.Component {

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

    input (target, {target: {value}}) {
        if (target.indexOf(".") > -1) {
            const arr = target.split(".");
            let _ = this.state;
            for (let i = 0; i < arr.length; i ++) {
                if (i === arr.length - 1) break;
                _ = _[arr[i]];
            }
            _[arr[arr.length - 1]] = value;
        } else {
            this.state[target] = value;
        }
        this.setState({});
    }

    actionLogin () {
        this.loading();
        setTimeout(async () => {
            this.loading();
            // login({username, password})
            // .then(res => {

            // });
            // message.error("登录失败");
            //模拟保存登陆后的token
            // store.dispatch({type: "token/SET_TOKEN", playload: "test-token"});
            // (this as any).props.history.push({path: "/"});
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