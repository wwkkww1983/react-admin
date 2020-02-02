import React from "react";
import "./less/index.less";

export default class Home extends React.Component {

    state = {

    }

    render (): any {
        const state = this.state;
        return (
            <div className="login-wrap">
                <h1>用户管理</h1>
            </div>
        );
    }
}