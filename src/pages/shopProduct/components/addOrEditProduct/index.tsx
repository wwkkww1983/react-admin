import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P } from "../../../../utils/utils";
import { Form, Input, Button, Select, Table, Switch, Modal, Row, Col, Icon, Tag, message } from "antd";
const { Option } = Select;
import { productDetail, addProduct, editProduct, } from "../../../../api/shop";
import Upload from "../../../../components/upload";
import SelectProduct from "../selectProducrt";
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
    properyDetails: [], //属性分类价格、信息集合
    combinationProducts: [] //组合商品集合（区别对待，有我无上面两者）
}

export default class AddOrEditProduct extends React.Component {
    constructor (props) {
        super(props);
    }

    static defaultProps = {
        id: "",
        onCancel: () => {},
        onFinishe: () => {}
    }

    public state = {
        title: "新增商品",
        types: [
            {name: "全部", value: 0},
            {name: "普通商品", value: 1},
            {name: "组合商品", value: 2}
        ],
        data: null,
        form: JSON.parse(JSON.stringify(productToastDataStruct)),
        filelist: [], //上传图片的集合，用于上传组件显示，内部是对象
        buildSKUTimer: null, // SKU计算防抖计时器
        selectProductShow: false, //选择子产品弹窗
        editor: null, //富文本编辑器
    }

    componentDidMount () {
        this.init();
    }

    async init () {
        const props = (this as any).props;
        if (props.id) {
            await this.loadList();
            this.state.data && (this.state.title = `编辑商品 "${this.state.data.title}"`);  
            Object.keys(productToastDataStruct).forEach(k => {
                if (this.state.data[k] !== undefined) {
                    this.state.form[k] = this.state.data[k];
                }
            });
            this.setState({});
        } else {
            this.state.title = "新增商品";
        }
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

    test (html) {
        console.log(html);
    }

    // 新增、编辑弹窗表单保存
    async onSave () {
        const _ = JSON.parse(JSON.stringify(this.state.form));
        let msg = "";
        if (!_.title) msg = "请填写商品名称";
        else if (_.imageList.length === 0) msg = "请上传商品图片";
        if (msg) {
            message.warning(msg); 
            return;
        }
        if (_.type === 1) {
            if (!this.checkPropertiesInput()) return;
            delete _["combinationProducts"];
            _.properties = _.properties.map(i => {
                let str = i.values.replace(/\s/g, "").replace(/[,，]/g, ",");
                return {
                    name: i.name,
                    values: [...str.split(",")].filter(i => i)
                }
            });
        }
        if (_.type === 2) {
            if (_.combinationProducts.length === 0) {
                message.warning("子商品组合不能为空");
                return;
            }
            delete _["properties"];
            delete _["properyDetails"];
        }
        console.log("保存数据：");
        console.log(_);
        NProgress.start();
        try {
            await addProduct(_);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        message.success((this as any).props.id ? "编辑已保存" : "新增成功");
        (this as any).props.onFinishe();
    }

    //检查sku属性填写情况
    checkPropertiesInput () {
        const 
        _ = this.state.form.properties,
        msgMap = {
            name: "属性名",
            values: "属性值"
        };
        try {
            for (let i = 0; i < _.length; i++) {
                const item = _[i];
                Object.keys(msgMap).forEach(k => {
                    if (!item[k]) throw `请填写商品属性第${i + 1}行的${msgMap[k]}`;
                });
            }
        } catch(err) {
            message.warning(err);
            return false;
        }
        return true;
    }

    //上皮属性列表表单改动
    onPropertiesRowInput (target, e) {
        input.bind(this)(target, e);
        this.buildSKUgroup();
    }

    // 生成sku所有组合
    buildSKUgroup () {
        clearTimeout(this.state.buildSKUTimer);
        let result = [], cache = [];
        this.state.buildSKUTimer = setTimeout(() => {
            cache = this.state.form.properyDetails;
            const _ = this.state.form.properties.map(item => {
                let str = item.values.replace(/\s/g, "").replace(/[,，]/g, ",");
                return [...str.split(",")].filter(i => i);
            });
            (function f (_, pre) {
                _[0].forEach(item => {
                    if (_[1]) {
                        f.call(this, _.slice(1), [...pre, item]);
                    } else {
                        addResult.call(this, [...pre, item].join("|"));
                    }
                });
            }).call(this, _, []);
            this.state.form.properyDetails = result;
            this.setState({});
        }, 500);
        function addResult (sku = "") {
            const old = cache.find(i => i.sku === sku);
            if (old) {
                result.push(old);
            } else {
                result.push({
                    sku,
                    leftStock: 0,
                    sales: 0,
                    price: 0,
                    imageList: []
                });
            }
        }
    }

    //增加一行SKU
    onAddPropertiesRow () {
        if (this.checkPropertiesInput()) {
            this.state.form.properties.push({
                name: "",
                values: ""
            });
            this.setState({});
        }
    }

    //删除sku属性
    onDeleteProperties (index) {
        this.state.form.properties.splice(index, 1);
        this.setState({});
    }

    //子商品标签关闭点击
    onCloseSubProduct (index) {
        this.state.form.comninationProducts.splice(index, 1);
        this.setState({});
    }

    //选择子设备回调
    onSelectSubProduct (item) {
        const _ = this.state.form.comninationProducts;
        _.push(item.id);
        this.state.selectProductShow = false;
        this.setState({});
    }

    render (): React.ReactNode {
        const state = this.state, props = (this as any).props;
        return <div className="addereditproduct-component">
            <Modal
            width="80%"
            title={state.title}
            visible={true}
            onOk={this.onSave.bind(this)}
            onCancel={props.onCancel}
            closable={false}
            maskClosable={false}
            >
                <div style={{height: "600px", overflow: "auto"}}>
                    <Form>
                        <Row>
                            <Col span={7}>
                                <Form.Item label="商品名称">
                                    <Input placeholder="商品名称"
                                    onChange={input.bind(this, "form.title")}
                                    />
                                </Form.Item>
                            </Col> 
                            <Col span={7} offset={1}>
                                <Form.Item label="商品类型">
                                <Select 
                                placeholder="选择商品类型"
                                value={state.form.type}
                                onChange={input.bind(this, "form.type")}
                                >
                                    {state.types.filter(i => i.value).map(item => <Option value={item.value}>{item.name}</Option>)}
                                </Select>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label="是否上架">
                                    <Switch checked={state.form.canSold} onChange={(...args) => {
                                        console.log(args);
                                        input.call(this, "form.canSold", args[0])
                                    }}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Form.Item label="库存">
                                    <Input placeholder="库存"
                                    onChange={input.bind(this, "form.leftStock")}
                                    />
                                </Form.Item>
                            </Col> 
                            <Col span={7} offset={1}>
                                <Form.Item label="已售">
                                    <Input placeholder="已售数量"
                                    onChange={input.bind(this, "form.sales")}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label="价格">
                                    <Input placeholder="价格"
                                    onChange={input.bind(this, "form.price")}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="商品图片">
                            <Upload urls={state.form.imageList} onChange={input.bind(this, "form.imageList")}/>
                        </Form.Item>

                        {/* 富文本 */}
                        <div style={{marginBottom: "24px"}}>
                            <p style={{color: "rgba(0, 0, 0, 0.85)"}}>商品简介:</p>
                            <Editor onChange={input.bind(this, "form.content")}  content={state.form.content} placeholder="商品简介" disabled={false}/>
                        </div>

                        {/* SKU属性 */}
                        {state.form.type !== 2 && <Form.Item label="商品属性">
                            <Table
                            columns={[
                                {
                                    title: "属性名",
                                    render: (item, record, index) => {
                                        return <Input value={item.name} placeholder="属性名" onChange={this.onPropertiesRowInput.bind(this, `form.properties[${index}].name`)}/>
                                    }
                                },
                                {
                                    title: "属性值",
                                    render: (item, record, index) => {
                                        return <Input value={item.values} placeholder="属性值，多个用逗号分割" onChange={this.onPropertiesRowInput.bind(this, `form.properties[${index}].values`)}/>
                                    }
                                },
                                {
                                    title: "操作",
                                    render: (item, record, index) => {
                                        return <Form layout="inline">
                                            <Form.Item>
                                                <Button icon="delete" type="danger" onClick={this.onDeleteProperties.bind(this, index)}>删除</Button>
                                            </Form.Item>
                                        </Form>
                                    }
                                }
                            ]}
                            dataSource={state.form.properties}
                            pagination={false}
                            />
                            <Button style={{marginLeft: "-15px"}} type="link" icon="plus" onClick={this.onAddPropertiesRow.bind(this)}>增加一行</Button>
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
                                        return <Input placeholder="库存数量" value={item.leftStock} onChange={input.bind(this, `form.properyDetails[${index}].leftStock`)}/>
                                    }
                                },
                                {
                                    title: "已售",
                                    render: (item, record, index) => {
                                        return <Input placeholder="已售" value={item.sales} onChange={input.bind(this, `form.properyDetails[${index}].sales`)}/>
                                    }
                                },
                                {
                                    title: "售价",
                                    render: (item, record, index) => {
                                        return <Input placeholder="售价" value={item.price} onChange={input.bind(this, `form.properyDetails[${index}].price`)}/>
                                    }
                                },
                                {
                                    title: "图片",
                                    render: (item, record, index) => {
                                        return <Upload urls={item.imageList} onChange={input.bind(this, `form.properyDetails[${index}].imageList`)}/>
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
                            {state.form.combinationProducts.map((item, index) => <Tag style={{height: "30px", lineHeight: "30px"}} color="#f50" closable={true} onClose={this.onCloseSubProduct.bind(this, index)}>id: {item.subProductId}</Tag>)}
                                <Button style={{marginLeft: "-15px"}} icon="plus" type="link" onClick={() => {
                                    this.setState({ selectProductShow: true });
                                }}>增加子商品</Button>
                            </div>
                        </Form.Item>}
                    </Form>

                    {/* 选择产品子产品id */}
                    {state.selectProductShow && <SelectProduct onCancel={() => {
                        this.setState({ selectProductShow: false });
                    }} onSelect={this.onSelectSubProduct.bind(this)}/>}

                </div>
            </Modal>
        </div>
    }
}