import React from "react";
import "./index.less";
import { Tabs } from "antd";
const { TabPane } = Tabs;

import PileOrder from "./components/pile";
import BatteryOrder from "./components/battery";
import VirtualBatteryOrder from "./components/virtualBattery";

export default class OrderManage extends React.Component {
    constructor (props) {
        super(props);
    }

    render (): React.ReactNode {
        return <div className="">
            <Tabs defaultActiveKey="1" onChange={() => {}}>
                <TabPane tab="充电桩" key="1">
                    <PileOrder></PileOrder>
                </TabPane>
                <TabPane tab="虚拟电池" key="2">
                    <VirtualBatteryOrder></VirtualBatteryOrder>
                </TabPane>
                <TabPane tab="租借电池" key="3">
                    <BatteryOrder></BatteryOrder>
                </TabPane>
            </Tabs>
        </div>
    }
}