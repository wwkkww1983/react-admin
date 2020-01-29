import React from "react";
import "./less/index.less";

import { Button, Dropdown, Icon, Menu } from "antd";

export default class HistoryBar extends React.Component {

    state = {
        childs: ["首页", "电池管理", "用户管理", "运维人员管理", "首页", "电池管理", "用户管理", "运维人员管理", "首页", "电池管理", "用户管理", "运维人员管理", "首页", "电池管理", "用户管理", "运维人员管理", "首页", "电池管理", "用户管理", "运维人员管理"]
    }

    constructor (props) {
        super(props);
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
                    <Button type="primary" shape="circle" icon="menu-fold" />
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