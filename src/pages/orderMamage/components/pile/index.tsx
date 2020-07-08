import React from "react";
import "./index.less";
import { Form, Table, Button, DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default class PileOrder extends React.Component {
    constructor (props) {
        super(props);
    }

    state = {
        limit: 10,
        total: 1,
        page: 1,
        list: [],
        headForm: {
            orderNumber: "",
            beginTime: "",
            endTime: ""
        }
    }

    loadList () {
        
    }

    render (): React.ReactNode {
        return <div className="">
            <Form layout="inline">
                <Form.Item>
                    <input type="text" placeholder="订单号"/>
                </Form.Item>
                <Form.Item label="日期">
                    <RangePicker onChange={() => {}} />
                </Form.Item>
                <Form.Item>
                    <Button icon="search">查找</Button>
                </Form.Item>
            </Form>
            <Table
                columns={[]}
                dataSource={[]}
                pagination={{
                    total: 1,
                    pageSize: 10,
                    current: 1,
                    onChange: page => {

                    }
                }}
            ></Table>
        </div>
    }
}