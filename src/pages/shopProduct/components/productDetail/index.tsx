import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P } from "../../../../utils/utils";
import { Form, Input, Button, Select, Table, Switch, Modal, Row, Col, Icon, Tag, message } from "antd";
const { Option } = Select;
import { productDetail } from "../../../../api/shop";
import Upload from "../../../../components/upload";

//增加、编辑商品表单数据一维结构
const productToastDataStruct = {
    title: "",
    type: 1,
    canSold: false,
    imageList: [],
    content: "",
    properties: [], //属性集合
    properyDetails: [], //属性分类价格、信息集合
    combinationProducts: [] //组合商品集合（区别对待，有我无上面两者）
}

export default class AddOrEditProduct extends React.Component {
    constructor (props) {
        super(props);
    }

    static defaultProps = {
        id: "",
        onClose: () => {}
    }

    public state = {
        title: "商品详情",
        types: [
            {name: "全部", value: 0},
            {name: "普通商品", value: 1},
            {name: "组合商品", value: 2}
        ],
        data: {},
        form: JSON.parse(JSON.stringify(productToastDataStruct))
    }

    componentDidMount () {
        this.init();
    }

    async init () {
        const props = (this as any).props;
        await this.loadList();
        this.state.data && (this.state.title = `商品详情 "${P(this, "state.data.title", "-")}"`);  
        Object.keys(productToastDataStruct).forEach(k => {
            if (this.state.data[k] !== undefined) {
                this.state.form[k] = this.state.data[k];
            }
        });
        this.setState({});
    }

    async loadList () {
        NProgress.start();
        try {
            var res: any = await productDetail({ id: (this as any).props.id });
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.state.data = res.data;
        this.setState({});
    }

    render (): React.ReactNode {
        const state = this.state, props = (this as any).props;
        return <div className="addereditproduct-component">
            <Modal
            width="80%"
            title={state.title}
            visible={true}
            onCancel={props.onClose}
            closable={true}
            maskClosable={false}
            footer={null}
            >
                <div style={{height: "600px", overflow: "auto"}}>
                    <Form>
                        <Row>
                            <Col span={7}>
                                <Form.Item label="商品名称">{state.form.title}</Form.Item>
                            </Col> 
                            <Col span={7} offset={1}>
                                <Form.Item label="商品类型">
                                <Select 
                                placeholder="选择商品类型"
                                value={state.form.type}
                                onChange={input.bind(this, "form.type")}
                                disabled={true}
                                >
                                    {state.types.filter(i => i.value).map(item => <Option value={item.value}>{item.name}</Option>)}
                                </Select>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label="是否上架">
                                    <Switch checked={state.form.canSold} disabled={true}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="商品图片">
                            <Upload urls={state.form.imageList} disabled={true}/>
                        </Form.Item>

                        {/* SKU属性 */}
                        {state.form.type !== 2 && <Form.Item label="商品属性">
                            <Table
                            columns={[
                                {
                                    title: "属性名",
                                    render: (item, record, index) => {
                                        return item.name;
                                    }
                                },
                                {
                                    title: "属性值",
                                    render: (item, record, index) => {
                                        return item.values;
                                    }
                                }
                            ]}
                            dataSource={state.form.properties}
                            pagination={false}
                            />
                        </Form.Item>}

                        {/* 属性分类组合数据表单 */}
                        {state.form.type !== 2 && <Form.Item label="商品属性组合配置">
                            <Table
                            rowKey="sku"
                            columns={[
                                {
                                    title: "SKU",
                                    dataIndex: "sku"
                                },
                                {
                                    title: "库存",
                                    render: (item, record, index) => {
                                        return item.leftStock;
                                    }
                                },
                                {
                                    title: "已售",
                                    render: (item, record, index) => {
                                        return item.sales;
                                    }
                                },
                                {
                                    title: "售价",
                                    render: (item, record, index) => {
                                        return item.price;
                                    }
                                },
                                {
                                    title: "图片",
                                    render: (item, record, index) => {
                                        return <Upload urls={item.imageList} disabled={true}/>
                                    }
                                }
                            ]}
                            dataSource={state.form.properyDetails}
                            pagination={false}
                            />
                        </Form.Item>}

                        {/* 组合商品 */}
                        {state.form.type === 2 && <Form.Item label="子商品组合">
                            <div style={{display: "flex"}}>
                                {state.form.combinationProducts.map((item, index) => <Tag style={{height: "30px", lineHeight: "30px"}} color="#f50" closable={false}>id: {item.subProductId}</Tag>)}
                            </div>
                        </Form.Item>}
                    </Form>
                </div>
            </Modal>
        </div>
    }
}