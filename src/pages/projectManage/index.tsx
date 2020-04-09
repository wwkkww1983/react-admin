import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button,
    Tabs,
    Upload,
    Icon,
    message
} from "antd";
const { TabPane } = Tabs;
import { input, initLife } from "../../utils/utils";
import store from "../../store";
import NProgress from "nprogress";

export default class Home extends React.Component {

    state = {
    }

    componentDidMount () {
        initLife(this, this.init);
    }

    init () {
    }


    render (): any {
        const state: any = this.state;
        return (
            <div className="projectmanage-page-wrap">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="换电柜" key="1">
                    Content of Tab Pane 1
                    </TabPane>
                    <TabPane tab="充电站" key="2">
                    Content of Tab Pane 2
                    </TabPane>
                </Tabs>,
            </div>
        );
    }
}