import React from "react";
import "./less/index.less";
import { Breadcrumb } from "antd";
import { inRoutes } from "../../../router/index";
import { History } from "../../../components/my-router";

interface Child {
    title: string,
    $LINK?: boolean,
    path: string
}

export default class BreadCrumb extends React.Component {

    state = {
        routes: [],
        childs: []
    }

    componentDidMount () {
        this.init();
    }

    init () {
        this.initRoutes();
        this.initListenRoute();
    }

    initRoutes () {
        const childs = [];
        (function f (routes) {
            routes.forEach(item => {
                if (item.children !== undefined) {
                    f.call(this, item.children);
                } else {
                    childs.push(item);
                }
            });
        }).call(this, inRoutes);
        this.state.routes = childs;
        this.setState({});
    }

    initListenRoute () {
        History.on("routeChange", () => {
            const 
            routes = this.state.routes,
            pathname = location.pathname,
            pathArr = pathname.split("\/").filter(item => item);

            //首页面包屑处理
            this.state.childs = [];
            if (pathArr.length === 0) {
                this.state.childs.push({
                    $LINK: false,
                    path: "/",
                    title: "首页"
                });
            }
            if (pathArr.length > 0) {
                this.state.childs.push({
                    $LINK: true,
                    path: "/",
                    title: "首页"
                });
            }

            //页面面包屑处理
            pathArr.forEach((path, index) => {
                const route = routes.find((item, index) => {
                    return item.path.replace("\/", "") === path;
                });
                if (route) {
                    const path: string = pathname.match(new RegExp(`.{0,}${route.path}`))[0]; //这里用正则获取path， 不用route的path， 是为了在多级path下能获取完整的path
                    this.state.childs.push({
                        title: route.title,
                        path,
                        $LINK: index < pathArr.length - 1 // 最后一级不带点击跳转
                    });
                }
            });
            this.setState({});
        });
    }

    navigate (path) {
        History.push({path});
    }

    render (): any {
        const childs = this.state.childs;
        return (
            <Breadcrumb>
                {childs.map((item: Child): any => {
                    if (item.$LINK) {
                        return <Breadcrumb.Item><a onClick={this.navigate.bind(this, item.path)}>{item.title}</a></Breadcrumb.Item>
                    } else {
                        return <Breadcrumb.Item>{item.title}</Breadcrumb.Item>
                    }
                })}
            </Breadcrumb>
        );
    }
}