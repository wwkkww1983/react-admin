import React from "react";
import "./less/index.less";

import { Table } from "antd";

export default class Home extends React.Component {

    state = {
        columus: [
            { 
                title: "当前状态",
                dataIndex: "latestStatus",
                key: "latestStatus"
            },
            { 
                title: "设备id",
                dataIndex: "deviceId",
                key: "deviceId"
            },
        ],
        list: [],
    }

    render (): any {
        const state = this.state;
        return (
            <div className="login-wrap">
                <Table/>
            </div>
        );
    }
}