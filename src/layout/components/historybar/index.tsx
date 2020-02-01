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
        this.initMouseWheel();
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

    //初始化history鼠标滚动
    initMouseWheel () {
        const $out: any = this.refs["out"], $in: any = this.refs["in"];
        $out.addEventListener("mousewheel", ({ wheelDelta }): void => {
            if (wheelDelta > 0) action.call(this, 1);
            if (wheelDelta < 0) action.call(this, -1);
        });
        $out.addEventListener("DOMMouseScroll", ({ detail }): void => {
            if (detail < 0) action.call(this, 1);
            if (detail > 0) action.call(this, -1);
        });
        //state大于0滚轮上滚动，小于0滚轮下滚动
        function action(state: number): void {
            const step = 30;
            if ($in.offsetWidth <= $out.offsetWidth) return;
            if (state > 0) {
                console.log("上滚动");
                const oldLeft: number = parseFloat(getComputedStyle($in).left);
                let offset: number = step;
                if (oldLeft >= 0) return;
                if (oldLeft + offset > 0)  {
                    offset = Math.abs(oldLeft);
                } else {
                    offset = step;
                }
                $in.style.left = (oldLeft + offset) + "px";
            }
            if (state < 0) {
                console.log("下滚动");                  
                const 
                scrollRange: number = $in.offsetWidth - $out.offsetWidth,
                oldLeft: number = parseFloat(getComputedStyle($in).left);
                let offset: number = step;
                if (Math.abs(oldLeft) >= scrollRange) return;
                if (Math.abs(oldLeft) + offset > scrollRange) {
                    offset = scrollRange - Math.abs(oldLeft);
                    console.log("jjj");
                    console.log(offset);
                } else {
                    offset = step;
                }
                $in.style.left = (oldLeft - offset) + "px";
            }
        }
    }

    //获取焦点
    focus (): void {
        
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
                <div className="history" ref="out">
                    <div className="child-inwrap" ref="in">
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