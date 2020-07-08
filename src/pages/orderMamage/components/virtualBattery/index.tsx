import React from "react";
import "./index.less";
import { Form, Table, Button, DatePicker, Input, Popover } from "antd";
const { RangePicker } = DatePicker;
import { input, timeToDateStr } from "../../../../utils/utils";
import { getVirtualBatteryOrders } from "../../../../api/orderManage";
import Nprogress from "nprogress";

export default class PileOrder extends React.Component {
    constructor (props) {
        super(props);
    }

    state = {
        columns: [
            {
                title: "id",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "状态",
                dataIndex: "statusText",
                key: "statusText"
            },
            {
                title: "当前租借电池id",
                render: item => item.batteryId || "-"
            },
            {
                title: "购买电池时价格",
                render: item => Math.ceil((item.price / 1000 * 100)) / 100 + "元"
            },
            {
                title: "购买实际支付",
                render: item => Math.ceil((item.payAmount / 1000 * 100)) / 100 + "元"
            },
            {
                title: "支付渠道",
                dataIndex: "payChannel",
                key: "payChannel"
            },
            {
                title: "购买/租借时间",
                render: item => {
                    const content = <div>
                        <p>购买时间：{item.buyTime ? timeToDateStr(item.buyTime * 1000, "datetime") : "-"}</p>
                        <p>最后租借：{item.borrowTime ? timeToDateStr(item.borrowTime * 1000, "datetime") : "-"}</p>
                        <p>最后归还：{item.returnTime ? timeToDateStr(item.returnTime * 1000, "datetime") : "-"}</p>
                        <p>退款申请：{item.refundApplyTime ? timeToDateStr(item.refundApplyTime * 1000, "datetime") : "-"}</p>
                    </div>
                    return <Popover content={content} title="购买/租借时间" trigger="hover">
                            <Button type="link">详情>></Button>
                    </Popover>
                }
            }    
        ],
        limit: 10,
        total: 1,
        page: 1,
        list: [],
        headForm: {
            orderNumber: "",
            beginTime: null,
            endTime: null
        }
    }

    componentDidMount () {
        this.loadList();
    }

    async loadList () {
        const _: any = this.state.headForm;
        Nprogress.start();
        let res = null;
        try {
            res = await getVirtualBatteryOrders({
                orderNumber: _.orderNumber,
                beginTime: _.beginTime ? Math.floor(_.beginTime.toDate().getTime() / 1000) : 0,
                endTime: _.endTime ? Math.floor(_.endTime.toDate().getTime() / 1000) : 0,
                page: this.state.page,
                limit: this.state.limit
            });
        } catch(err) {
            Nprogress.done();
            return;
        }
        Nprogress.done();
        this.setState({
            list: res.list || [],
            total: res.total,
        });
    }

    render (): React.ReactNode {
        const state = this.state;
        return <div className="">
            <Form layout="inline">
                <Form.Item label="订单号">
                    <Input type="text" placeholder="订单号" value={state.headForm.orderNumber} onChange={input.bind(this, "headForm.orderNumber")}/>
                </Form.Item>
                <Form.Item label="日期">
                    <RangePicker onChange={([beginTime, endTime]) => {
                        this.state.headForm.beginTime = beginTime;
                        this.state.headForm.endTime = endTime;
                        this.setState({});
                    }}/>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                </Form.Item>
            </Form>
            <Table
                style={{marginTop: "16px"}}
                columns={state.columns}
                dataSource={state.list}
                pagination={{
                    total: state.total,
                    pageSize: state.limit,
                    current: state.page,
                    onChange: page => {
                        this.state.page = page;
                        this.setState({});
                        this.loadList();
                    }
                }}
            ></Table>
        </div>
    }
}