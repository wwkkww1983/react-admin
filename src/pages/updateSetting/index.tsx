import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button,
    Upload,
    Icon,
    message,
    Tabs
} from "antd";
const { TabPane } = Tabs;
import { input, initLife } from "../../utils/utils";
import Soft from "./components/soft";
import Hardware from "./components/hardware";

export default class UpdateSetting extends React.Component {

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
            <div className="updatesetting-page-wrap">
                
                <Tabs defaultActiveKey="1" onChange={() => {}}>
                    <TabPane tab="软件" key="1">
                        <Soft></Soft>
                    </TabPane>
                    <TabPane tab="硬件" key="2">
                        <Hardware></Hardware>
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}