import React from "react";
import "./less/index.less";

interface Menu {
    icon?: string,
    title: string,
    path?: string,
    children?: Menu[],
    $ID?: string,
    $OPEN?: boolean,
    $ACTIVE?: boolean
}

export default class Menus extends React.Component {

    static defaultProps = {
        menus: [],
        collapse: false
    }

    state = {
        menus: [], //菜单集合
        opens: {} //是否打开
    }

    componentDidMount () {
        this.init();
    }

    init (): void {
        const menus: Menu[] = (this as any).props.menus;
        let id: number = 0;

        (function f (menus: Menu[]) {
            menus.forEach((menu: Menu): void => {
                id ++;
                menu.$ID = `id-${id}`
                if (menu.children !== undefined) {
                    this.state.opens[menu.$ID] = false;
                    menu.$OPEN = false;
                    f.call(this, menu.children);
                } else {
                    menu.$ACTIVE = false;
                }
            });
        }).call(this, menus);
        
        console.log("debug1");
        console.log(menus);
        console.log(this.state.opens);
        this.setState({menus});
    }

    onclick (key: string): void {
        console.log(key);
        const opens: any = this.state.opens;
        if (opens[key] !== undefined) {
            opens[key] = !opens[key];
            this.setState({});
        }
    }

    render (): any {

        const opens: any = this.state.opens;

        const Children: any = ({menus}): any => {
            return (
                <div className="menus-wrap">
                    {menus.map((menu: Menu): any => {
                        if (menu.children) {
                            return (
                                <div className="menus-group">
                                    <div className="menus-item" onClick={this.onclick.bind(this, menu.$ID)}>
                                        {menu.icon ? <div className={"icon iconfont " + menu.icon}></div> : null}
                                        <div className="text">{menu.title}</div>
                                        <div className="right-icon iconfont icon-shouqi" style={{
                                            transform: opens[menu.$ID] ? "rotate(0deg)" : "rotate(180deg)"
                                        }}></div>
                                    </div>
                                    <div className="menus-group" style={{ height: opens[menu.$ID] ? "auto" : "0px"}}>
                                        <Children menus={menu.children}/>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div className="menus-item">
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
            <div className="menus-container">
                <Children menus={this.state.menus}/>
            </div>
        );
    }
}