import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P, initLife, timeToDateStr } from "../../utils/utils";
import { Form, Button, Select, Table, Modal, DatePicker, Popover, message } from "antd";
const { Option } = Select;
const { RangePicker } = DatePicker;
import { shopOrderList, shopOrderDetail, shopOrderExpress } from "../../api/shop";

export default class ShopProduct extends React.Component {
    constructor (props) {
        super(props);
    }

    public state = {
        page: 1, 
        limit: 10,
        total: 1,
        status: [
            {name: "全部", value: 0},
            {name: "未支付", value: 1},
            {name: "已支付", value: 2},
            {name: "已发货", value: 3},
            {name: "已收货", value: 4},
            {name: "退货中", value: 5},
            {name: "已退货", value: 6},
            {name: "已关闭", value: 7},
        ],
        headForm: {
            status: 0,
            beginTime: null, //	开始时间戳		[int]		
            endTime: null, //	结束时间戳		[int]		
        },
        list: []
    }

    componentDidMount () {
        initLife(this, () => {}, this.init);
    }

    init () {
        this.loadList();
    }

    onSearch () {
        this.state.page = 1;
        this.setState({});
        this.loadList();
    }

    async loadList () {
        NProgress.start();
        const _ = this.state.headForm;
        const data: any = {
            limit: this.state.limit,
            page: this.state.page,
        }
        if (_.status !== undefined) data.status = _.status;
        if (_.beginTime && _.endTime) {
            data.beginTime = _.beginTime ? Math.floor(_.beginTime.toDate().getTime() / 1000) : 0;
            data.endTime = _.endTime ? Math.floor(_.endTime.toDate().getTime() / 1000) : 0;
        }
        try {
            var res: any = await shopOrderList(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.setState({ 
            list: res.list,  
            total: res.total === 0 ? 1 : res.total
        });
    }

    //发货
    onExpress (item) {
        Modal.confirm({
            title: `确定发货？`,
            onOk: async () => {
              NProgress.start();
              try {
                await shopOrderExpress({ orderId: item.id });
              } catch(err) {
                NProgress.done();
                return;
              }
              NProgress.done();
              message.success("发货成功");
              this.loadList();
            },
            onCancel() {}
        });
    }

    render (): React.ReactNode {
        const state = this.state;
        return <div className="shopproduct-page">
            <Form layout="inline">
                <Form.Item label="状态">
                    <Select defaultValue={state.headForm.status} style={{ width: 120 }} onChange={input.bind(this, "headForm.status")}>
                        {state.status.map(item => <Option value={item.value}>{item.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="日期">
                    <RangePicker onChange={([beginTime, endTime]) => {
                        this.state.headForm.beginTime = beginTime;
                        this.state.headForm.endTime = endTime;
                        this.setState({});
                    }}/>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.onSearch.bind(this)}>查找</Button>
                </Form.Item>
            </Form>

            <Table
            style={{marginTop: "16px"}}
            dataSource={state.list}
            pagination={{
                onChange: page => {
                    state.page = page;
                    this.setState({page: page});
                    this.loadList();
                },
                current: state.page,
                pageSize: state.limit,
                total: state.total
            }}
            columns={[
                {
                    title: "id",
                    dataIndex: "id"
                },
                {
                    title: "订单号",
                    render: item => {
                        return <div>
                            <span>订单号：{item.orderNumber}</span><br/>
                            <span>卖家id：{item.sellerMemberId}</span>
                        </div>
                    }
                },
                {
                    title: "状态",
                    dataIndex: "statusText"
                },
                {
                    title: "收货人信息",
                    render: item => {
                        const content = <div>
                            <p>姓名：{P(item, "name", "-")}</p>
                            <p>电话：{P(item, "phone", "-")}</p>
                            <p>电话：{P(item, "phone", "-")}</p>
                            <p>地区：{P(item, "province", "-")}/{P(item, "city", "-")}/{P(item, "district", "-")}</p>
                            <p>地址：{P(item, "address", "-")}</p>
                        </div>
                        return <Popover content={content} title="收货人信息" trigger="hover">
                                <Button type="link">查看>></Button>
                        </Popover>
                    }
                },
                {
                    title: "快递信息",
                    render: item => {
                        const content = <div>
                            <p>快递公司id：{P(item, "deliveryCompanyId", "-")}</p>
                            <p>电话：{P(item, "deliveryNumber", "-")}</p>
                            <p>发货时间：{timeToDateStr(item.deliveryTime * 1000, "datetime")}</p>
                            <p>完成时间：{timeToDateStr(item.completeTime * 1000, "datetime")}</p>
                        </div>
                        return <Popover content={content} title="快递信息" trigger="hover">
                            <Button type="link">查看>></Button>
                        </Popover>
                    }
                },
                {
                    title: "结算信息",
                    render: item => {
                        const content = <div>
                            <p>总金额：{P(item, "totalAmount", "-")}</p>
                            <p>实际支付：{P(item, "payAmount", "-")}</p>
                            <p>支付渠道：{P(item, "payChannel", "-")}</p>
                            <p>支付系统订单号：{P(item, "payTransferNumber", "-")}</p>
                            <p>支付最后退款时间：{P(item, "refundExpireTime", "-")}</p>
                            <p>创建时间：{timeToDateStr(item.createTime * 1000, "datetime")}</p>
                            <p>支付时间：{timeToDateStr(item.payTime * 1000, "datetime")}</p>
                        </div>
                        return <Popover content={content} title="结算信息" trigger="hover">
                            <Button type="link">查看>></Button>
                        </Popover>
                    }
                },
                {
                    title: "操作",
                    render: item => {
                        return <Form layout="inline">
                            <Form.Item>
                                <Button icon="check" onClick={this.onExpress.bind(this, item)}>发货</Button>
                            </Form.Item>
                        </Form>
                    }
                },
            ]}
            />
        </div>
    }
}