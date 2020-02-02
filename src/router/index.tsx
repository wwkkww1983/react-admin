/**
 * 路由配置
 * 
 * 因懒得找同时实现了keepAlive和路由动画的react路由器；所以这里使用自己实现的react路由器；路由配置与标准的react-router-dom是不一样的。
 * 具体请参考：https://github.com/lilindog/react-router-test/blob/master/src/components/my-router/README.md
 */

import { History } from "../components/my-router";

import Error404 from "../pages/404";
import Error401 from "../pages/401";
import Login from "../pages/login";
import Layout from "../layout";

import Home from "../pages/home";
import batteryManage from "../pages/batteryManage";
import boxManage from "../pages/boxManage";
import OPSManage from "../pages/OPSManage";
import userManage from "../pages/userManage";

export const inRoutes = [
    {
        title: "首页",
        path: "/",
        component: Home
    },
    {
        title: "用户管理",
        path: "/userManage",
        component: userManage
    },
    {
        title: "运维人员管理",
        path: "/OPSManage",
        component: OPSManage
    },
    {
        title: "电池管理",
        path: "/batteryManage",
        component: batteryManage,
        keepAlive: true
    },
    {
        title: "充电柜管理",
        path: "/boxManage",
        component: boxManage,
        keepAlive: true
    },
    {
        title: "401",
        path: "/401",
        component: Error401
    },
    {
        title: "404",
        path: "*",
        component: Error404
    }
]

export default [
    {
        title: "登录",
        path: "/login",
        component: Login,
        keepAlive: true
    },
    {
        path: /^(?!login)/,
        component: Layout,
        keepAlive: true,
        children: inRoutes
    },
    {
        title: "404",
        path: "*",
        component: Error404
    }
]

History.intercept = (page, next) => {
    console.log("路由拦截");
    console.log(page);
    document.title = page.title;
    next();
}