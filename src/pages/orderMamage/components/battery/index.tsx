import React from "react";
import "./index.less";
import { Form, Table, Button, DatePicker, Input, Popover } from "antd";
const { RangePicker } = DatePicker;
import { input, timeToDateStr } from "../../../../utils/utils";
import { getBatteryOrders } from "../../../../api/orderManage";
import Nprogress from "nprogress";

export default class BatteryOrder extends React.Component {
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
                title: "订单号",
                dataIndex: "orderNumber",
                key: "orderNumber"
            },
            {
                title: "状态",
                dataIndex: "statusText",
                key: "statusText"
            },
            {
                title: "电池id",
                render: item => item.batteryId || "-"
            },
            {
                title: "支付金额",
                render: item => Math.ceil((item.payAmount / 1000 * 100)) / 100 + "元"
            },
            {
                title: "支付渠道",
                dataIndex: "payChannel",
                key: "payChannel"
            },
            {
                title: "支付时间",
                render: item => item.payTime ? timeToDateStr(item.payTime, "datetime") : "-"
            },
            {
                title: "创建/租借时间",
                render: item => {
                    const content = <div>
                        <p>订单创建时间：{item.createTime ? timeToDateStr(item.createTime * 1000, "datetime") : "-"}</p>
                        <p>租借时间：{item.borrowTime ? timeToDateStr(item.borrowTime * 1000, "datetime") : "-"}</p>
                        <p>归还时间：{item.returnTime ? timeToDateStr(item.returnTime * 1000, "datetime") : "-"}</p>
                        <p>最后退款时间：{item.refundExpireTime ? timeToDateStr(item.refundExpireTime * 1000, "datetime") : "-"}</p>
                    </div>
                    return <Popover content={content} title="创建/租借时间" trigger="hover">
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
            res = await getBatteryOrders({
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