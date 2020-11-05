import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../utils/utils";
import { Form, Input, Button, Select, Table, Switch, Icon, message, DatePicker } from "antd";
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
        if (_.status !== undefined) "";
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
                    //...
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
                    title: "商品类型",
                    dataIndex: "typeText"
                },
                {
                    title: "商品名",
                    dataIndex: "title"
                },
                {
                    title: "操作",
                    render: item => {
                        return <Form layout="inline">
                            <Form.Item>
                                <Button>详情</Button>
                            </Form.Item>
                        </Form>
                    }
                },
            ]}
            />
        </div>
    }
}