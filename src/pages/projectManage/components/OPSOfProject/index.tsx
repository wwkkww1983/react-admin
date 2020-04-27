import React from "react";
import "./index.less";
import { Alert, message, Form, Select, Modal, Input } from "antd";
import store from "../../../../store";
import NProgress from "nprogress";
import { getCityDeepList } from "../../../../api/city";

const { Option } = Select;

interface Props {
    id: string|number
}

export default class Home extends React.Component {

    static defaultProps: Props = {
        id: "",
    }

    constructor (props) {
        super(props);
    }

    state = {
       
    }

    componentWillReceiveProps (props) {
       
    }

    componentDidMount () {
        this.init();
    }

    async init () {
    }

    render (): any {
        const state = this.state;
        return (
            <div className="opsofproject-component-wrap">

                <Modal
                width={"80%"}
                visible={true}
                // closable={false}
                maskClosable={false}
                title="运维人员管理"
                // onOk={this.confirm.bind(this)}
                // onCancel={this.cancel.bind(this)}
                footer={null}
                >
            
                    <Form>
                        <Form.Item>
                            <Input type="text"/>
                        </Form.Item>
                    </Form>

                </Modal>
            </div>
        );
    }
}