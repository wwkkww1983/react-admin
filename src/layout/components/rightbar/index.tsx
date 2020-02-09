import React from "react";
import "./less/index.less";
import { History } from "../../../components/my-router";
import { Dropdown, Menu, Modal } from "antd";
import store from "../../../store";

export default class RightBar extends React.Component {

    componentDidMount () {
        this.init();
    }

    state = {
        username: "",
        headImg: ""
    }

    init () {
        this.initUseStore();
    }

    initUseStore () {
        const userinfo: any = store.getState().user;
        if (userinfo) {
            this.state.username = userinfo.username;
            this.state.headImg = ""; //api暂时没有这个数据
            this.setState({});
        }
        store.subscribe(() => {
            const userinfo: any = store.getState().user;
            if (userinfo) {
                this.state.username = userinfo.username;
                this.state.headImg = ""; //api暂时没有这个数据
                this.setState({});
            }
        });
    }

    //退出登录
    logout () {
        Modal.confirm({
            title: '确定退出吗?',
            content: "",
            okText: "确定",
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                confirm.call(this);
            },
            onCancel() {}
        });
        function confirm () {
            store.dispatch({type: "token/DEL_TOKEN"});
            History.replace({path: "/login"});
        }
    }
    
    render (): any {
        const state: any = this.state;

        //头像下拉菜单
        const memberMenu: any = (
            <Menu>
                <Menu.Item>
                    <div className="iconfont icon-mima"> 修改密码</div>
                </Menu.Item>
                <Menu.Item>
                    <div className="iconfont icon-tuichu" onClick={this.logout.bind(this)}> 退出登录</div>
                </Menu.Item>
            </Menu>
        );

        return (
            <div className="rightbar-wrap">
                <Dropdown overlay={memberMenu}>
                    <div className="child">
                        <div className="label">{state.username}</div>
                        {state.headImg ? <img src={state.headImg} className="member-img"/> : <div className="member-img iconfont icon-touxiang"></div>}
                    </div>
                </Dropdown>
            </div>
        );
    }
}