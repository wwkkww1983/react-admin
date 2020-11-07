import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P } from "../../../../utils/utils";
import { Form, Input, Button, Select, Table, Switch, Modal, Row, Col, Icon, Tag, message } from "antd";
const { Option } = Select;
import { productDetail } from "../../../../api/shop";
import Upload from "../../../../components/upload";
import Editor from "../../../../components/editor";

//增加、编辑商品表单数据一维结构
const productToastDataStruct = {
    title: "",
    type: 1,
    canSold: false,
    leftStock: 0,// 剩余库存
    sales: 0,// 已售数量
    price: 0,// 价格，（单位：分）
    imageList: [],
    content: "",
    properties: [], //属性集合
    propertyDetails: [], //属性分类价格、信息集合
    subProductDetails: [] //组合商品集合（区别对待，有我无上面两者）
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
            if (this.state.data && this.state.data[k] !== undefined) {
                if (k === "properties") {
                    this.state.data[k].forEach(i => i.values = i.values.join(","));
                }
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
                                <Form.Item label="商品类型">{state.types.find(i => i.value === state.form.type).name}</Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label="是否上架">{state.form.canSold ? "是" : "否"}</Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Form.Item label="库存">{state.form.leftStock}</Form.Item>
                            </Col> 
                            <Col span={7} offset={1}>
                                <Form.Item label="已售">{state.form.sales}</Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label="价格">{state.form.price / 100}</Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="商品图片">
                            <Upload urls={state.form.imageList} disabled={true}/>
                        </Form.Item>

                        <Form.Item label="商品介绍">
                            <div dangerouslySetInnerHTML={{__html: state.form.content}}></div>
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
                                        return item.price / 100;
                                    }
                                },
                                {
                                    title: "图片",
                                    render: (item, record, index) => {
                                        return <Upload urls={item.imageList} disabled={true}/>
                                    }
                                }
                            ]}
                            dataSource={state.form.propertyDetails}
                            pagination={false}
                            />
                        </Form.Item>}

                        {/* 组合商品 */}
                        {state.form.type === 2 && <Form.Item label="子商品组合">
                            <div style={{display: "flex"}}>
                                {state.form.subProductDetails.map((item, index) => <Tag style={{height: "30px", lineHeight: "30px"}} color="#f50" closable={false}>id: {item.subProductId}</Tag>)}
                            </div>
                        </Form.Item>}
                    </Form>
                </div>
            </Modal>
        </div>
    }
}