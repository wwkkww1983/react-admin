import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../utils/utils";
import { Form, Input, Button, Select, Table } from "antd";
const { Option } = Select;

export default class ShopProduct extends React.Component {
    constructor (props) {
        super(props);
    }

    public state = {
        page: 1, 
        limit: 10,
        total: 1,
        types: [
            {name: "全部", value: 0},
            {name: "商品", value: 1},
            {name: "组合", value: 2}
        ],
        headForm: {
            type: 0, //产品类型；0-全部；1-商品；2-组合
            q: "",
            canSold: null, //是否上架；null-不限制；true-查上架
        },
        list: []
    }

    componentDidMount () {
        initLife(this, this.init);
    }

    init () {

    }

    loadList () {
        NProgress.start();
        
    }

    render (): React.ReactNode {
        const state = this.state;
        return <div className="shopproduct-page">
            <Form layout="inline">
                <Form.Item label="关键字">
                    <Input placeholder="搜索关键字"></Input>
                </Form.Item>
                <Form.Item label="分类">
                    <Select defaultValue={state.types[0].value} style={{ width: 120 }} onChange={(...args) => console.log(args)}>
                        {state.types.map(item => <Option value={item.value}>{item.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="是否上架">
                    <Select defaultValue={""} style={{ width: 120 }} onChange={(...args) => console.log(args)}>
                        <Option value="">不限</Option>
                        <Option value="true">已上架</Option>
                        <Option value="false">已下架</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button icon="search">查找</Button>
                </Form.Item>
                <Form.Item>
                    <Button icon="plus">新增</Button>
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
                
            ]}
            />

        </div>
    }
}