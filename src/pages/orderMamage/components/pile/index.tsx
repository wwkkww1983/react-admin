import React from "react";
import "./index.less";
import { Form, Table, Button, DatePicker, Input, Popover, Modal, message } from "antd";
const { RangePicker } = DatePicker;
import { input, timeToDateStr } from "../../../../utils/utils";
import { getPileOrders, endPileOrder } from "../../../../api/orderManage";
import Nprogress from "nprogress";
import moment from "moment";

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
                title: "用户id",
                dataIndex: "memberId",
                key: "memberId"
            },
            {
                title: "订单号",
                dataIndex: "orderNumber",
                key: "orderNumber"
            },
            {
                title: "付费类型",
                dataIndex: "typeText",
                key: "typeText"
            },
            {
                title: "支付金额",
                render: item => {
                    const content = <div>
                        <p>子设备id：{item.subDeviceId}</p>
                        <p>端口号：{item.port}</p>
                        <p>创建时间：{timeToDateStr(item.createTime * 1000, "datetime")}</p>
                        <p>充电开始时间：{timeToDateStr(item.beginTime * 1000, "datetime")}</p>
                        <p>充电结束时间：{timeToDateStr(item.endTime * 1000, "datetime")}</p>
                        <p>金额：{item.amount / 100}元</p>
                        <p>实际支付金额：{item.payAmount / 100}元</p>
                        <p>支付渠道：{item.payChannel}</p>
                        <p>支付时间：{timeToDateStr(item.payTime * 1000, "datetime")}</p>
                    </div>
                    return <Popover content={content} title="详情" trigger="hover">
                            {item.payAmount || "0.00"}<Button type="link">详情>></Button>
                    </Popover>
                }
            },
            {
                title: "充电时长",
                render: item => item.chargingTime + "分钟"
            },
            {
                title: "订单状态",
                render: item => item["statusText"] || "-"
            },
            {
                title: "操作",
                render: item => {
                    //这些状态码参见充电桩订单状态文档
                    const ignoreStatus = [3, 4, 5, 6, 7];
                    return <Form layout="inline">
                        <Form.Item>
                            <Button  disabled={ignoreStatus.includes(Number(item.status))} onClick={this.endOrder.bind(this, item)} icon="check">手动完成订单</Button>
                        </Form.Item>
                    </Form>
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
            res = await getPileOrders({
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

    //手动完成订单
    endOrder ({ orderNumber, id }): void {
        Modal.confirm({
            title: `确定要结束 "${orderNumber}" 订单吗？`,
            // content: 'Some descriptions',
            onOk: async () => {
                Nprogress.start();
                try {
                    await endPileOrder({id});
                } catch(err) {
                    Nprogress.done();
                    return;
                }
                Nprogress.done();
                message.success(`已结束 "${orderNumber}" 订单`);
                this.loadList();
            },
            onCancel() {},
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
            rowKey="id"
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