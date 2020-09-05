import React from "react";
import "./index.less";
import { Form, Table, Button, DatePicker, Input, Popover, Select } from "antd";
const { RangePicker } = DatePicker, { Option } = Select;
import { input, timeToDateStr, property as P } from "../../../../utils/utils";
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
                title: "电池id/序列号",
                render: item => {
                    return <div>
                        <p>id： {item.batteryImsi}</p>
                        <p>序列号：{item.batteryIdStr}</p>
                    </div>
                }
            },
            {
                title: "虚拟电池id",
                render: item => P(item, "virtualBatteryId")
            },
            {
                title: "用户id",
                render: item => P(item, "memberId")
            },
            {
                title: "用户手机号",
                render: item => P(item, "member.phone")
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
                title: "支付金额",
                render: item => (item.payAmount / 100) + "元"
            },
            {
                title: "支付渠道",
                dataIndex: "payChannel",
                key: "payChannel"
            },
            {
                title: "订单时间",
                render: item => {
                    return <div>
                        <p>开始：{timeToDateStr(item.borrowTime * 1000, "datetime")}</p>
                        <p>结束：{item.returnTime && item.returnTime > 0 ? timeToDateStr(item.returnTime * 1000, "datetime") : "-"}</p>
                    </div>
                }
            },
            {
                title: "创建/租借时间",
                render: item => {
                    const content = <div>
                        <p>订单创建时间：{item.createTime ? timeToDateStr(item.createTime * 1000, "datetime") : "-"}</p>
                        <p>租借时间：{item.borrowTime ? timeToDateStr(item.borrowTime * 1000, "datetime") : "-"}</p>
                        <p>归还时间：{item.returnTime ? timeToDateStr(item.returnTime * 1000, "datetime") : "-"}</p>
                        <p>支付时间：{item.payTime ? timeToDateStr(item.payTime, "datetime") : "-"}</p>
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
            batteryId: "",
            status: 0,
            orderNumber: "",
            beginTime: null,
            endTime: null
        },
        //租借电池状态
        batteryOrderStatus: [
            {name: "全部", value: 0},
            {name: "已租借，未归还", value: 1},
            {name: "已归还，待支付", value: 2},
            {name: "已完成", value: 3},
            {name: "正在出库", value: 4},
            {name: "已取消", value: 5}
        ]
    }

    componentDidMount () {
        this.loadList();
    }

    async loadList () {
        const _: any = this.state.headForm;
        const data: any = {
            status: _.status,
            beginTime: _.beginTime ? Math.floor(_.beginTime.toDate().getTime() / 1000) : 0,
            endTime: _.endTime ? Math.floor(_.endTime.toDate().getTime() / 1000) : 0,
            page: this.state.page,
            limit: this.state.limit
        }
        _.batteryId && (data.batteryId = _.batteryId);
        Nprogress.start();
        let res = null;
        try {
            res = await getBatteryOrders(data);
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
                    <RangePicker 
                    onChange={([beginTime, endTime]) => {
                        this.state.headForm.beginTime = beginTime;
                        this.state.headForm.endTime = endTime;
                        this.setState({});
                    }}/>
                </Form.Item>
                <Form.Item label="状态">
                    <Select style={{width: "150px"}} placeholder="状态"  value={state.headForm.status} onChange={input.bind(this, "headForm.status")}>
                        {state.batteryOrderStatus.map(item => <Option value={item.value}>{item.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="电池id">
                    <Input placeholder="电池id" value={state.headForm.batteryId} onChange={input.bind(this, "headForm.batteryId")}></Input>
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