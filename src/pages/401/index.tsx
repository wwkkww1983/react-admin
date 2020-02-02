import React from "react";
import "./less/index.less";
import { Button } from "antd";

export default class NotFound extends React.Component {
    
    render (): any {
        return (
            <div className="notfound">
                <h1>404</h1>
                <div className="content-wrap">
                    <Button onClick={() => {(this as any).props.history.push({path: "/"})}}>返回首页</Button>
                </div>
            </div>
        );
    }
}