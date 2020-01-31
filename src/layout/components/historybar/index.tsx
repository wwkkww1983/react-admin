import React from "react";
import "./less/index.less";
import { Button, Dropdown, Icon, Menu } from "antd";
import store from "../../../store";

export default class HistoryBar extends React.Component {

    state = {
        asideMenusFold: false,
        childs: ["首页", "电池管理", "用户管理", "运维人员管理", "首页", "电池管理", "用户管理", "运维人员管理", "首页", "电池管理", "用户管理", "运维人员管理", "首页", "电池管理", "用户管理", "运维人员管理", "首页", "电池管理", "用户管理", "运维人员管理"]
    }

    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.init();
    }

    init () {
        this.initUseStore();
    }

    initUseStore () {
        const { layout } = store.getState();
        this.state.asideMenusFold = layout.asideMenus.fold;
        this.setState({});
        store.subscribe(() => {
            const { layout } = store.getState();
            this.state.asideMenusFold = layout.asideMenus.fold;
            this.setState({});
        });
    }

    //侧边菜单折叠按钮
    asideSetBtn () {
         const asideMenusFold: boolean = this.state.asideMenusFold;       
         store.dispatch({type: "layout/SET_ASIDE_MENUS", playload: !asideMenusFold});
    }

    render (): any {

        const state: any = this.state;

        const tagMenu: any = (
            <Menu>
                <Menu.Item key="1"><span className="iconfont icon-guanbi"/> 关闭全部</Menu.Item>
                <Menu.Item key="2"><span className="iconfont icon-other"/> 关闭其他</Menu.Item>
            </Menu>
        );

        return (
            <div className="history-bar">
                <div className="end-wrap">
                    <Button type="primary" onClick={this.asideSetBtn.bind(this)} shape="circle" icon={state.asideMenusFold ? "menu-unfold" : "menu-fold"}/>
                </div>
                <div className="history">
                    <div className="child-inwrap">
                    {state.childs.map(item => {
                        return (
                            <div className="child-btn">
                                {item}
                                <div className="close-btn iconfont icon-guanbi"></div>
                            </div>
                        );
                    })}
                    </div>
                </div>
                <div className="end-wrap end-wrap_right">
                    <Dropdown overlay={tagMenu}>
                        <Button type="primary">
                            标签选项 <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
            </div>
        );
    }
}