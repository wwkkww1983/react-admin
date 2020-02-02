import React from "react";
import "./less/index.less";
import { Button } from "antd";

export default class NotFound extends React.Component {
    
    render (): any {
        return (
            <div className="notfound">
                <h1>401</h1>
                <p>没有权限</p>
                <div className="content-wrap">
                    <Button onClick={() => {(this as any).props.history.goBack()}}>返回上一页</Button>
                </div>
            </div>
        );
    }
}