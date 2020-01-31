import React from "react";
import "./less/index.less";
import MyRouter from "../components/my-router";
import Menus from "./components/menu";
import RightBar from "./components/rightbar";
import HistoryBar from "./components/historybar";
import { Breadcrumb } from "antd";
import menus from "../config/menus.config.js";
import store from "../store";

export default class Layout extends React.Component {

    componentDidMount () {
        this.init();
    }

    state = {
        title: "",
        asideFold: false,
    }

    init (): void {
        this.initUseStore();
    }

    initUseStore () {
        const 
        state = this.state,
        { layout } = store.getState();
        //初始化
        state.asideFold = layout.asideMenus.fold;
        state.title = layout.title;
        //监听变动
        store.subscribe(() => {
            const 
            state = this.state,
            { layout } = store.getState();
            state.asideFold = layout.asideMenus.fold;
            state.title = layout.title;
            this.setState({});
        });
    }
    
    render (): any {
        const props: any = this.props, state: any = this.state;
        return (
            <div className="layout-wrap">
                <div className="layout-header">
                    <div className="log-wrap">
                        <img className="log" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt=""/>
                        <h2 className="title">{state.title}</h2>
                    </div>
                    <div className="right-wrap">
                        <RightBar/>
                    </div>
                </div>
                <div className="layout-content">
                    <div className="layout-content-aside">
                        <Menus menus={menus} fold={state.asideFold}/>
                    </div>
                    <div className="layout-content-content">
                        <div className="history-bar-wrap">
                            <HistoryBar/>
                        </div>
                        <div className="content">
                            <div className="breadcrumb">
                            <Breadcrumb>
                                <Breadcrumb.Item>首页</Breadcrumb.Item>
                                <Breadcrumb.Item>
                                {/* <a href="">运维人员管理</a> */}
                                运维人员管理
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            </div>
                            <div className="content">
                                <MyRouter debugName="内页路由" routes={props.route.children} transition={true}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}