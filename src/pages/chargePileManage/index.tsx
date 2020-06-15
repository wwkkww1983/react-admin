import React from "react";
import "./index.less";

import { Tabs } from "antd";
import NProgress from "nprogress";
import { input, initLife } from "../../utils/utils";
import MainDevice from "./components/mainDevice";
import SubDevice from "./components/subDevice";

const { TabPane } = Tabs;

export default class Home extends React.Component {

    constructor (props) {
        super(props);
    }

    state = {
        
    }

    componentDidMount () {
        initLife(this, this.$onLoad, this.$onShow);
    }

    $onLoad () {
    }

    $onShow () {
        // this.loadList();
    }

    render (): any {
        const state = this.state;
        return (
            <div className="chargepile-page-wrap">
                <Tabs defaultActiveKey="1" onChange={() => {}}>
                    <TabPane tab="通讯主机" key="1">
                        <MainDevice></MainDevice>
                    </TabPane>
                    <TabPane tab="充电头模块" key="2">
                        <SubDevice></SubDevice>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}