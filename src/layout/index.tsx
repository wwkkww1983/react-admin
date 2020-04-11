import React from "react";
import "./less/index.less";
import MyRouter from "../components/my-router";
import Menus from "./components/menu";
import RightBar from "./components/rightbar";
import HistoryBar from "./components/historybar";
import BreadCrumb from "./components/breadcrumb";
import store from "../store";

/**
 * 静态资源
 */
import logo from "../assets/img/logo.jpg";

export default class Layout extends React.Component {

    componentDidMount () {
        this.init();
    }

    state = {
        title: "",
        copyright: "",
        asideFold: false,
        menus: []
    }

    init (): void {
        this.inintListenCOntentHeight();
        this.initUseStore();
    }

    /**
     * 监控content高度，并且在初始化和窗口发生缩放后实时更新到store layout模块里 
     */
    inintListenCOntentHeight () {
        const getInnerContentHieght = () => {
            const h: any = (this as any).refs["innerContent"].clientHeight;
            const height = h - 32/*自身上下内边距*/ - 53 /*底部版权栏占据高度*/ - 29 /*面包屑占用高度*/ - (64 + 2) /*内页路由外框上下内边距*/;
            store.dispatch({type: "layout/SET_CONTENT_HEIGHT", playload: height});
        }
        //异步执行初始化
        setTimeout(() => {
            getInnerContentHieght();
        });
        window.addEventListener("resize", getInnerContentHieght);
    }

    initUseStore () {
        const 
        state = this.state,
        { layout } = store.getState();
        //初始化
        state.asideFold = layout.asideMenus.fold;
        state.copyright = layout.copyright;
        state.title = layout.title;
        state.menus = layout.asideMenus.menus;
        this.setState({});
        //监听变动
        store.subscribe(() => {
            const 
            state = this.state,
            { layout } = store.getState();
            state.asideFold = layout.asideMenus.fold;
            state.copyright = layout.copyright;
            state.title = layout.title;
            state.menus = layout.asideMenus.menus;
            this.setState({});
        });
    }
    
    render (): any {
        const props: any = this.props, state: any = this.state;
        return (
            <div className="layout-wrap">
                <div className="layout-header">
                    <div className="log-wrap">
                        <img className="log" src={logo} alt=""/>
                        <h2 className="title">{state.title}</h2>
                    </div>
                    <div className="right-wrap">
                        <RightBar/>
                    </div>
                </div>
                <div className="layout-content">
                    <div className="layout-content-aside">
                        <Menus menus={state.menus} fold={state.asideFold}/>
                    </div>
                    <div className="layout-content-content">
                        <div className="history-bar-wrap">
                            <HistoryBar/>
                        </div>
                        <div className="content" ref="innerContent">
                            <div className="breadcrumb">
                                <BreadCrumb/>
                            </div>
                            <div className="content">
                                <MyRouter name="内页路由" routes={props.route.children} transition={true}/>
                            </div>
                            <div className="copyright">&copy; {state.copyright}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}