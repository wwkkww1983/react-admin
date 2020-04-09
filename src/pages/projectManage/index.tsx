import React from "react";
import "./less/index.less";
import { Tabs } from "antd";
import Box from "./components/box";
import Pile from "./components/pile";

const { TabPane } = Tabs;

export default class Home extends React.Component {
    render (): any {
        const state: any = this.state;
        return (
            <div className="projectmanage-page-wrap">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="换电柜" key="1">
                        <Box/>
                    </TabPane>
                    <TabPane tab="充电站" key="2">
                        <Pile/>
                    </TabPane>
                </Tabs>,
            </div>
        );
    }
}