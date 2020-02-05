import React from "react";
import "./less/index.less";
import { History } from "../../../components/my-router";

interface Menu {
    icon?: string,
    title: string,
    path?: string,
    children?: Menu[],
    $ID?: string,
    $OPEN?: boolean,
    $ACTIVE?: boolean,
    $DEEP?: number,
    $PARENT: object
}

const 
PADDING_LEFT: number= 10,
MAX_DEEP: number = 2,
WIDTH: number = 200;

export default class Menus extends React.Component {

    static defaultProps = {
        menus: [],
        fold: false
    }

    state = {
        fold: false, //是否折叠
        oldOpens: {}, // 旧的opens
        menus: [], //菜单集合
        opens: {}, //是否打开
        children: {}// item扁平处理后的集合， 不包含展开项
    }

    componentWillReceiveProps (props) {
        const fold: boolean = props.fold, menus: Menu[] = props.menus;
        if (fold !== this.state.fold) {
            this.setState({fold});
            if (fold) {
                this.state.oldOpens = JSON.parse(JSON.stringify(this.state.opens));
                this.foldAll();
            } else {
                this.state.opens = this.state.oldOpens;
                this.state.oldOpens = {};
                this.setState({});
                this.unfoldActiveParent();
            }
        } 
        if (menus !== (this as any).state.menus) {
            (this as any).props.menus = menus;
            this.init();
            this.active(location.pathname);
        } 
    }

    componentDidMount () {
        this.init();
        History.on("change", () => {
            this.active(location.pathname);
        });
    }

    //初始化menus属性以及相关数据结构
    init (): void {
        const menus: Menu[] = (this as any).props.menus;
        let id: number = 0, deep = 0, parent = null;

        (function f (menus: Menu[]) {
            menus.forEach((menu: Menu): void => {
                id ++;
                menu.$ID = `id-${id}`;
                menu.$DEEP = deep;
                menu.$PARENT = parent;
                if (menu.children !== undefined) {
                    this.state.opens[menu.$ID] = false;
                    parent = menu;
                    deep ++;
                    if (deep > MAX_DEEP) throw new Error(`[menu 组件] 菜单配置嵌套深度不能大于 ${MAX_DEEP} 层！`);
                    f.call(this, menu.children);
                    deep --;
                    parent = null;
                } else {
                    this.state.children[menu.$ID] = menu;
                    menu.$ACTIVE = false;
                }   
            });
        }).call(this, menus);
        
        if (_WEBPACK_MODE_ === "development") {
            console.log("menus初始化后的菜单数据");
            console.log(menus);
        }
        
        this.setState({menus});
    }

    //展开与收起
    onclick (key: string): void {
        if ((this as any).props.fold) return;
        const opens: any = this.state.opens;
        if (opens[key] !== undefined) {
            opens[key] = !opens[key];
            this.setState({});
        }
    }

    //菜单点击
    touch (menu: Menu): void {
        const { path, $ID } = menu;
        History.push({path: path});
        this.unActive();
        this.state.children[$ID].$ACTIVE = true;
        this.setState({});
    }

    //收起所有的展开
    foldAll (): void {
        const opens: any = this.state.opens;
        Object.keys(opens).forEach(key => {
            opens[key] = false;
        });
        this.setState({});
    }

    //展开所有
    unfoldAll (): void {
        const opens: any = this.state.opens;
        Object.keys(opens).forEach(key => {
            opens[key] = true;
        });
        this.setState({});
    }

    //取消激活
    unActive (): void {
        const chilren: any = this.state.children;
        for (let key of Object.keys(chilren)) {
            const menu = chilren[key];
            menu.$ACTIVE && (menu.$ACTIVE = false);
        }
        this.setState({});
    }

    //选中制定path的菜单；如果在展开项中则展开
    active (path: string): void {
        this.unActive();
        const children: any = this.state.children;
        let _: Menu = null;
        for (let key of Object.keys(children)) {
            const menu: Menu = children[key];
            if (menu.path === path) {
                _ = menu;
                menu.$ACTIVE = true;
                break;
            }
        }
        this.unfoldActiveParent();
    }

    //展开当前焦点项的所有父级选项卡（如果有）
    unfoldActiveParent (): void {
        let menu: Menu = null;
        for (let key of Object.keys(this.state.children)) {
            if (this.state.children[key].$ACTIVE === true) {
                menu = this.state.children[key];
                break;
            }
        }
        if (!menu) return;
        let parent: any = menu.$PARENT;
        while (parent) {
                this.state.opens[parent.$ID] = true;
                parent = parent.$PARENT;   
        }
        this.setState({});
    }


    render (): any {

        const 
        opens: any = this.state.opens,
        state: any = this.state,
        props: any = this.props;

        const Children: any = ({menus}): any => {
            return (
                <div className="menus-group">
                    {menus.map((menu: Menu): any => {
                        //展开项
                        if (menu.children) {
                            return (
                                <div className="menus-group">
                                    <div className="menus-item" style={{
                                        paddingLeft: menu.$DEEP * PADDING_LEFT + "px"
                                    }}
                                    onClick={this.onclick.bind(this, menu.$ID)}
                                    >
                                        {menu.icon ? <div className={"icon iconfont " + menu.icon}></div> : null}
                                        <div className="text">{menu.title}</div>
                                        <div className="right-icon iconfont icon-zhankai" style={{
                                            transform : opens[menu.$ID] && !state.fold ? "rotate(180deg)" : "rotate(-90deg)"
                                        }}></div>
                                    </div>
                                    <div className="menus-group" style={{
                                        height: opens[menu.$ID] && !state.fold ? "auto" : "0px"
                                    }}>
                                        <Children menus={menu.children}/>
                                    </div>
                                </div>
                            );
                        } 
                        //item
                        else {
                            return (
                                <div className={menu.$ACTIVE ? "menus-item menus-item_active" : "menus-item"} style={{
                                    paddingLeft: menu.$DEEP * PADDING_LEFT + "px"
                                }}
                                onClick={this.touch.bind(this, menu)}
                                >
                                    {menu.icon ? <div className={"icon iconfont " + menu.icon}></div> : null}
                                    <div className="text">{menu.title}</div>
                                </div>
                            );
                        }
                    })}
                </div>
            );
        }

        return (
            <div style={{width: state.fold ? "50px" : `${WIDTH}px`, overflow: "hidden"}}>
                <Children menus={this.state.menus}/>
            </div>
        );
    }
}