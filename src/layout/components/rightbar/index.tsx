import React from "react";
import "./less/index.less";

import { Dropdown, Menu } from "antd";

export default class RightBar extends React.Component {
    
    render (): any {

        //头像下拉菜单
        const memberMenu: any = (
            <Menu>
                <Menu.Item>
                    <div className="iconfont icon-mima"> 修改密码</div>
                </Menu.Item>
                <Menu.Item>
                    <div className="iconfont icon-tuichu"> 退出登录</div>
                </Menu.Item>
            </Menu>
        );

        return (
            <div className="rightbar-wrap">
                <Dropdown overlay={memberMenu}>
                    <div className="child">
                        <div className="label">管理员</div>
                        <div className="member-img"></div>
                    </div>
                </Dropdown>
            </div>
        );
    }
}