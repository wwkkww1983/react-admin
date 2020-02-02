import React from "react";
import "./less/index.less";
import { Button, Dropdown, Icon, Menu } from "antd";
import store from "../../../store";
import { History } from "../../../components/my-router";

interface Child {
    title: string,
    path: string,
    $ACTIVE?: boolean
}

const DEBUG: boolean = _WEBPACK_MODE_ === "development";

export default class HistoryBar extends React.Component {

    state = {
        asideMenusFold: false,
        childs: []
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
        this.initListenRoute();
    }

    initListenRoute () {
        //浏览器缩放时， 当in大于out时候，重置in的left为0px
        window.addEventListener("resize", () => {
            const $inwidth: number = (this as any).refs["in"].offsetWidth, $outwidth: number = (this as any).refs["out"].offsetWidth;
            if ($inwidth <= $outwidth) {
                (this as any).refs["in"].style.left = "0px";
            }
        });
        History.on("routeChange", ({ data: {title, path}, routerName }): void => {
            if (routerName === "内页路由") {
                DEBUG && console.log("history监控到了路由变化");
                handlerRouteChange.call(this, title, path);
            }
        });
        function handlerRouteChange (title: string, path: string): void {
            const 
            childs: Child[] = this.state.childs,
            hasChild: Child = childs.find((child: Child): boolean => child.title === title && child.path === path),
            pathname: string = location.pathname;
            if (childs.length > 0) {
                childs.forEach((item: Child): void => {
                    item.$ACTIVE = false;
                });
            }
            if (hasChild) {
                hasChild.$ACTIVE = true;
            }
            else {  
                childs.push({
                    title,
                    path: pathname,
                    $ACTIVE: true
                });
            }
            this.setState({childs}, () => this.focus(`ref-${pathname}`));
        }
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
                DEBUG && console.log("上滚动");
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
                DEBUG && console.log("下滚动");                  
                const 
                scrollRange: number = $in.offsetWidth - $out.offsetWidth,
                oldLeft: number = parseFloat(getComputedStyle($in).left);
                let offset: number = step;
                if (Math.abs(oldLeft) >= scrollRange) return;
                if (Math.abs(oldLeft) + offset > scrollRange) {
                    offset = scrollRange - Math.abs(oldLeft);
                } else {
                    offset = step;
                }
                $in.style.left = (oldLeft - offset) + "px";
            }
        }
    }

    //获取焦点
    focus (refstr: string): void {
        const 
        $out: any = this.refs["out"],
        $in: any = this.refs["in"],
        $child: any = this.refs[refstr];

        const 
        $outwidth: number = $out.offsetWidth,
        $childleft: number = $child.offsetLeft,
        $childwidth: number = $child.offsetWidth,
        $left: number = Math.abs(parseFloat(getComputedStyle($in).left));

        //判断位置
        if (
            $childleft + $childwidth - $left < $outwidth &&
            $childleft - $left > 0
        ) {
            DEBUG && console.error("位于视窗中");
            return;
        }
        if ($childleft - $left < 0 ) {
            DEBUG && console.error("位于视窗左侧");
            leftToCenter.call(this);
        }
        if ($childleft + $childwidth - $left > $outwidth) {
            DEBUG && console.error("位于视窗右侧");
            rightToCenter.call(this);
        }
        //左移中
        function leftToCenter () {
            let offset: number = $left - $childleft;
            const left: number = (-$left) + offset;
            $in.style.left = left + "px";
        }   
        //右移中
        function rightToCenter () {
            let offset: number = $childleft - ($left + $out.offsetWidth);
            offset += $childwidth;
            const left: number = (-$left) - offset;
            $in.style.left = left + "px";
        }
    }

    //侧边菜单折叠按钮
    asideSetBtn () {
         const asideMenusFold: boolean = this.state.asideMenusFold;       
         store.dispatch({type: "layout/SET_ASIDE_MENUS", playload: !asideMenusFold});
    }

    //关闭全部
    closeAll (): void {
        this.state.childs = [];
        History.push({path: "/"});
    }

    //关闭标签
    close (item: Child): void {
        const { title, path } = item, childs: Child[] = this.state.childs;
        for (let i = 0; i < childs.length; i ++) {
            const child: Child = childs[i];
            if (child.title === title && child.path === path) {
                childs.splice(i, 1);
                break;
            }
        }
        this.setState({});
    }

    //关闭其他(关闭后，跳转到首页)
    closeOther (): void {
        const childs: Child[] = this.state.childs;
        const currentChild: Child = childs.find(item => item.$ACTIVE);
        if (currentChild) {
            this.setState({childs: [currentChild]});
        }
    }

    render (): any {

        const state: any = this.state;

        const tagMenu: any = (
            <Menu>
                <Menu.Item>
                    <div onClick={this.closeAll.bind(this)}>
                        <span className="iconfont icon-guanbi"/> 关闭全部
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={this.closeOther.bind(this)}>
                        <span className="iconfont icon-other"/> 关闭其他
                    </div>
                </Menu.Item>
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
                                <div className={"child-btn" + (item.$ACTIVE ? " child-btn_active" : "")} ref={`ref-${item.path}`} id={`id-${item.path}`} onClick={() => History.push({path: item.path})}>
                                    {item.title}
                                    <div className="close-btn iconfont icon-guanbi" onClick={e => {
                                        console.log(e);
                                        e.stopPropagation();
                                        this.close.call(this, item);
                                    }}></div>
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