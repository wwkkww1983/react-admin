import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../../../utils/utils";
import { Form, Input, Button, Select, Table, Switch, Modal } from "antd";
const { Option } = Select;
import { productList } from "../../../../api/shop";

export default class ShopProduct extends React.Component {
    constructor (props) {
        super(props);
    }

    static defaultProps = {
        title: "选择子产品",
        onSelect: () => {},
        onCancel: () => {}
    }

    public state = {
        page: 1, 
        limit: 10,
        total: 1,
        types: [
            {name: "全部", value: 0},
            {name: "普通商品", value: 1},
            {name: "组合商品", value: 2}
        ],
        headForm: {
            type: 0, //产品类型；0-全部；1-商品；2-组合
            q: "",
            canSold: "null", //是否上架；null-不限制；true-查上架
        },
        list: []
    }

    componentDidMount () {
        this.init();
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
        const data = {
            limit: this.state.limit,
            page: this.state.page,
            canSold: _.canSold,
            type: _.type
        }
        if (_.q) data["q"] = _.q;
        try {
            var res: any = await productList(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.setState({ 
            list: res.list,  
            total: res.total === 0 ? 1 : res.total, 
            switchLoading: new Array(res.list.length).fill(false) 
        });
    }

    render (): React.ReactNode {
        const state = this.state, props = (this as any).props;
        return (
        <Modal
        width="80%"
        title={props.title}
        visible={true}
        onCancel={() => {
            (this as any).props.onCancel();
        }}
        closable={true}
        maskClosable={false}
        footer={null}
        >
            <Form layout="inline">
                <Form.Item label="关键字">
                    <Input placeholder="搜索关键字" onChange={input.bind(this, "headForm.q")}></Input>
                </Form.Item>
                <Form.Item label="分类">
                    <Select defaultValue={state.headForm.type} style={{ width: 120 }} onChange={input.bind(this, "headForm.type")}>
                        {state.types.map(item => <Option value={item.value}>{item.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="是否上架">
                    <Select defaultValue={state.headForm.canSold} style={{ width: 120 }} onChange={input.bind(this, "headForm.canSold")}>
                        <Option value="null">不限</Option>
                        <Option value="true">已上架</Option>
                        <Option value="false">已下架</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.onSearch.bind(this)}>查找</Button>
                </Form.Item>
            </Form>

            <Table
            scroll={{y: 400}}
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
                    title: "商品类型",
                    dataIndex: "typeText"
                },
                {
                    title: "商品名",
                    dataIndex: "title"
                },
                {
                    title: "是否上架",
                    render: (item, record, index) => {
                        return <Switch checked={item.canSold} disabled={true}/>
                    }
                },
                {
                    title: "操作",
                    render: item => {
                        return <Form layout="inline">
                            <Form.Item>
                                <Button icon="check" onClick={() => {
                                    (this as any).props.onSelect(item);
                                }}>选择</Button>
                            </Form.Item>
                        </Form>
                    }
                },
            ]}
            />
        </Modal>);
    }
}