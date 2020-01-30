import React from "react";
import "./less/index.less";

import MyRouter from "../components/my-router";

import Menus from "./components/menu";
import RightBar from "./components/rightbar";
import HistoryBar from "./components/historybar";

import { Breadcrumb } from "antd";

const menus: any[] = [
    {
        icon: "icon-guanbi",
        title: "首页",
        path: "/"
    },
    {
        icon: "icon-yonghu",
        title: "用户管理",
        path: "/userManage"
    },
    {
        icon: "icon-weixiu",
        title: "运维人员管理",
        path: "/OPSManage"
    },
    {
        icon: "icon-guanbi",
        title: "测试展开1",
        children: [
            {
                icon: "icon-dianchi",
                title: "电池管理",
                path: "/batteryManage"
            },
            {
                icon: "icon-iconset0499",
                title: "测试展开2",
                children: [
                    {
                        icon: "icon-dianchi",
                        title: "测试3",
                        path: "/test3"
                    },
                    {
                        icon: "icon-guanbi",
                        title: "充电柜管理",
                        path: "/icon-iconset0499"
                    }
                ]
            }
        ]
    },
    {
        icon: "icon-yonghu",
        title: "测试1",
        path: "/test1"
    },
    {
        icon: "icon-weixiu",
        title: "测试2",
        path: "/test2"
    }
]

export default class Layout extends React.Component {

    componentDidMount () {
        // console.log(this.props);
    }
    
    render (): any {
        const props: any = this.props;
        return (
            <div className="layout-wrap">
                <div className="layout-header">
                    <div className="log-wrap">
                        <img className="log" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt=""/>
                        <h2 className="title">腾跃物联后台管理系统</h2>
                    </div>
                    <div className="right-wrap">
                        <RightBar/>
                    </div>
                </div>
                <div className="layout-content">
                    <div className="layout-content-aside">
                        <Menus menus={menus}/>
                        {/* <div style={{width: "300px", height: "200px", background: "red"}}>123</div> */}
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