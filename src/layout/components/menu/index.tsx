import React from "react";
import "./less/index.less";

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

//每层左侧间隔
const PADDING_LEFT: number= 10;

export default class Menus extends React.Component {

    static defaultProps = {
        menus: [],
        collapse: false
    }

    state = {
        menus: [], //菜单集合
        opens: {}, //是否打开
        children: {}// item集合
    }

    componentDidMount () {
        this.init();

        setTimeout(() => {
            // alert(123)
            // this.foldAll();
            this.active("/test3");
        }, 5000);
    }

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
                    f.call(this, menu.children);
                    deep --;
                    parent = null;
                } else {
                    this.state.children[menu.$ID] = menu;
                    menu.$ACTIVE = false;
                }   
            });
        }).call(this, menus);
        
        console.log("debug1");
        console.log(menus);
        console.log(this.state.opens);
        console.log(this.state.children);
        this.setState({menus});
    }

    //展开与收起
    onclick (key: string): void {
        const opens: any = this.state.opens;
        if (opens[key] !== undefined) {
            opens[key] = !opens[key];
            this.setState({});
        }
    }

    //收起所有的展开
    foldAll (): void {
        const opens: any = this.state.opens;
        Object.keys(opens).forEach(key => {
            opens[key] = false;
        });
        this.setState({opens});
    }

    //展开所有
    unfoldAll (): void {
        const opens: any = this.state.opens;
        Object.keys(opens).forEach(key => {
            opens[key] = true;
        });
        this.setState({opens});
    }

    //选中制定path的菜单；如果在展开项中则展开
    active (path: string): void {
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
        if (_) {
            let parent: any = _.$PARENT;
            while (parent) {
                console.log(parent);
                this.state.opens[parent.$ID] = true;
                parent = parent.$PARENT;
            }
            this.setState({});
        }
    }


    render (): any {

        const opens: any = this.state.opens;

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
                                            transform : opens[menu.$ID] ? "rotate(180deg)" : "rotate(0deg)"
                                        }}></div>
                                    </div>
                                    <div className="menus-group" style={{
                                        height: opens[menu.$ID] ? "auto" : "0px"
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
                                }}>
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
            <Children menus={this.state.menus}/>
        );
    }
}