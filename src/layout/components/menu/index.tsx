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

class SubMenu extends React.Component {
    static defaultProps = {
        menu: null
    }
    state = {
        show: false
    }
    componentDidMount () {
        this.setState({show: (this as any).props.show});
    }

    onclick () {
        this.setState({show: !this.state.show});
    }

    render (): any {
        const 
        menu: Menu = (this as any).props.menu,
        state: any = this.state;
        return (
            <div className="menus-group">
                <div className="menus-item" onClick={this.onclick.bind(this)}>
                    {menu.icon ? <div className={"icon iconfont " + menu.icon}></div> : null}
                    <div className="text">{menu.title}</div>
                    <div className="right-icon iconfont icon-shouqi" style={{
                        transform: state.show ? "rotate(0deg)" : "rotate(180deg)"
                    }}></div>
                </div>
                <div className="menus-group"
                style={{
                    height: state.show ? "auto" : "0px",
                    transition: "all .3s"
                }}
                >
                    {(this as any).props.children}
                </div>
            </div>
        );
    }
}

class Item extends React.Component {
    static defaultProps = {
        menu: null
    }
    render (): any {
        const menu: Menu = (this as any).props.menu;
        return (
            <div className="menus-item"
            // key={menus.$ID}
            >
                {menu.icon ? <div className={"icon iconfont " + menu.icon}></div> : null}
                <div className="text">{menu.title}</div>
            </div>
        );
    }
}

export default class Menus extends React.Component {

    static defaultProps = {
        menus: [],
        collapse: false
    }

    state = {
        menus: []
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
                    menu.$OPEN = false;
                    f.call(this, menu.children);
                } else {
                    menu.$ACTIVE = false;
                }
            });
        }).call(this, menus);
        
        console.log("debug1");
        console.log(menus);
        this.setState({menus});
    }

    render (): any {

        const Children: any = ({menus}): any => {
            return (
                <div className="menus-wrap">
                    {menus.map((menu: Menu): any => {
                        if (menu.children) {
                            return (
                                <SubMenu menu={menu}>
                                    <Children menus={menu.children}/>
                                </SubMenu>
                            );
                        } else {
                            return <Item menu={menu}/>
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