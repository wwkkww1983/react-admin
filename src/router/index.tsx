/**
 * 路由配置
 * 
 * 因懒得找同时实现了keepAlive和路由动画的react路由器；所以这里使用自己实现的react路由器；路由配置与标准的react-router-dom是不一样的。
 * 具体请参考：https://github.com/lilindog/react-router-test/blob/master/src/components/my-router/README.md
 */

import { History } from "../components/my-router";
import NProgress from "nprogress";
import store from "../store";

import Error404 from "../pages/404";
import Error401 from "../pages/401";
import Login from "../pages/login";
import Layout from "../layout";

import Home from "../pages/home";
import batteryManage from "../pages/batteryManage";
import boxManage from "../pages/boxManage";
import OPSManage from "../pages/OPSManage";
import userManage from "../pages/userManage";
import baseSetting from "../pages/baseSetting";
import chargePileManage from "../pages/chargePileManage";
import projectManage from "../pages/projectManage";
import UpdateSetting from "../pages/updateSetting";
import BatterySetting from "../pages/batterySetting";
import WalletSetting from "../pages/walletSetting";
import PlatformSetting from "../pages/platformSetting";
import Nfc from "../pages/nfc";
import batteryManageJT808 from "../pages/batteryManageJT808";
import OrderManage from "../pages/orderMamage";

export const inRoutes = [
    {
        title: "首页",
        path: "/",
        component: Home,
        keepAlive: true
    },
    {
        title: "用户管理",
        path: "/userManage",
        component: userManage,
        keepAlive: true
    },
    {
        title: "运维人员管理",
        path: "/OPSManage",
        component: OPSManage,
        keepAlive: true
    },
    {
        title: "电池管理",
        path: "/batteryManage",
        component: batteryManage,
        keepAlive: true
    },
    {
        title: "电池管理JT808",
        path: "/batteryManage-jt808",
        component: batteryManageJT808,
        keepAlive: true
    },
    {
        title: "换电柜管理",
        path: "/boxManage",
        component: boxManage,
        keepAlive: true
    },
    {
        title: "充电站管理",
        path: "/chargePileManage",
        component: chargePileManage,
        keepAlive: true
    },
    {
        title: "基础设置",
        path: "/baseSetting",
        component: baseSetting,
        keepAlive: true
    },
    {
        title: "项目管理",
        path: "/projectManage",
        component: projectManage,
        keepAlive: true
    },
    {
        title: "升级设置",
        path: "/updateSetting",
        component: UpdateSetting,
        keepAlive: true
    },
    {
        title: "虚拟电池设置",
        path: "/batterySetting",
        component: BatterySetting,
        keepAlive: true
    },
    {
        title: "钱包设置",
        path: "/walletSetting",
        component: WalletSetting,
        keepAlive: true
    },
    {
        title: "物联网平台设置",
        path: "/platformSetting",
        component: PlatformSetting,
        keepAlive: true
    },
    {
        title: "NFC管理",
        path: "/nfc",
        component: Nfc,
        keepAlive: true
    },
    {
        title: "订单管理",
        path: "/orderManage",
        component: OrderManage,
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
        component: Login
    },
    {
        title: "首页",
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

//路由拦截器
//路由权限可以在这里进行处理
History.intercept = (page, next) => {
    document.title = "请稍等...";
    NProgress.start();

    //未登录， 跳转到登录页面
    if (!store.getState().token && page.path !== "/login") {
        History.replace({path: "/login"});
        NProgress.done();
        return;
    }

    //已经登录状态，跳回主页
    if (page.path === "/login" && store.getState().token) {
        NProgress.done();
        History.replace({path: "/"});
        return;
    }
    
    document.title = page.title;
    NProgress.done();
    next();
}