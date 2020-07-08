import React from "react";
import "./index.less";
import { Tabs } from "antd";
const { TabPane } = Tabs;

import PileOrder from "./components/pile";
import BatteryOrder from "./components/battery";
import VirtualBatteryOrder from "./components/virtualBattery";
import { initLife } from "../../utils/utils";

export default class OrderManage extends React.Component {
    constructor (props) {
        super(props);
    }

    state = {
        inited: false
    }

    componentDidMount () {
        initLife(this, () => {
            this.setState({inited: true});
        });
    }

    render (): React.ReactNode {
        const state: any = this.state;
        return <div className="">
            <Tabs defaultActiveKey="1" onChange={() => {}}>
                <TabPane tab="充电桩" key="1">
                    {state.inited && <PileOrder></PileOrder>}
                </TabPane>
                <TabPane tab="虚拟电池" key="2">
                    {state.inited && <VirtualBatteryOrder></VirtualBatteryOrder>}
                </TabPane>
                <TabPane tab="租借电池" key="3">
                    {state.inited && <BatteryOrder></BatteryOrder>}
                </TabPane>
            </Tabs>
        </div>
    }
}