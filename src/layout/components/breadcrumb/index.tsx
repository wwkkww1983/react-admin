import React from "react";
import "./less/index.less";
import { Breadcrumb } from "antd";
import { inRoutes } from "../../../router/index";
import { History } from "../../../components/my-router";

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
        History.on("change", () => {
            this.state.childs = ["首页"];
            const 
            routes = this.state.routes,
            pathname = location.pathname,
            pathArr = pathname.split("\/").filter(item => item);
            pathArr.forEach(path => {
                const route = routes.find(item => {
                    return item.path.replace("\/", "") === path;
                });
                console.log(route);
                if (route) {
                    this.state.childs.push(route.title);
                }
            });
            this.setState({});
        });
    }

    render (): any {
        const childs = this.state.childs;
        return (
            <Breadcrumb>
                {childs.map(item => {
                    return (
                        <Breadcrumb.Item>{item}</Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        );
    }
}