import React from "react";
import "./less/index.less";

export default class Home extends React.Component {

    state = {

    }

    render (): any {
        const state = this.state;
        return (
            <div className="login-wrap">
                <h1>电池管理</h1>
                <input type="text"/>
            </div>
        );
    }
}