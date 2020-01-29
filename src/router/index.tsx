/**
 * 路由配置
 * 
 * 因懒得找同时实现了keepAlive和路由动画的react路由器；所以这里使用自己实现的react路由器；路由配置与标准的react-router-dom是不一样的。
 * 具体请参考：https://github.com/lilindog/react-router-test/blob/master/src/components/my-router/README.md
 */

import Error404 from "../pages/404";
import Login from "../pages/login";
import Layout from "../layout";

import Home from "../pages/home";

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
        children: [
            {
                title: "首页",
                path: "/",
                component: Home
            },
            {
                title: "404",
                path: "*",
                component: Error404
            }
        ]
    },
    {
        title: "404",
        path: "*",
        component: Error404
    }
]