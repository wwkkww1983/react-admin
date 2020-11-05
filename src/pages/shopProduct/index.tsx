import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../utils/utils";
import { Form, Input, Button, Select, Table, Switch, Modal, Tabs, Row, Col, Icon, Upload } from "antd";
const { Option } = Select;
const { TabPane } = Tabs;
import { productList, addProduct, editProduct, delProduct, setSold } from "../../api/shop";

//增加、编辑商品表单数据一维结构
const productToastDataStruct = {
    title: "",
    type: 1,
    canSold: null,
    imageList: [],
    content: "",
    properties: [], //属性集合
    properyDetail: [], //属性分类价格、信息集合
    combinationProducts: [] //组合商品集合（区别对待，有我无上面两者）
}

//构造上传图片组件filelist的元素的函数
const createFilelistElement = (function () {
    let uid = 0;
    return function (url) {
        if (uid === Number.MAX_SAFE_INTEGER) uid = 0;
        return {
            uid: uid++,
            name: url,
            status: "done",
            url
        }
    }
})();

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
            {name: "普通商品", value: 1},
            {name: "组合商品", value: 2}
        ],
        switchLoading: [],
        headForm: {
            type: 0, //产品类型；0-全部；1-商品；2-组合
            q: "",
            canSold: "null", //是否上架；null-不限制；true-查上架
        },
        list: [],
        productToast: {
            show: false,
            id: "",
            title: "新增商品",
            tabIndex: "0",
            data: JSON.parse(JSON.stringify(productToastDataStruct))
        },
        filelist: [], //上传图片的集合，用于上传组件显示，内部是对象
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

    //上下架切换
    async onSoldSwitch (item, index) {
        switchLoading.call(this, true);
        try {
            await setSold({
                id: item.id,
                canSold: !item.canSold
            });
        } catch(err) {
            switchLoading.call(this, false);
            return;
        }
        switchLoading.call(this, false);
        this.loadList();
        function switchLoading (is) {
            this.state.switchLoading[index] = is;     
            this.setState({});
        }
    }

    //打开、关闭新增、编辑弹窗
    openOfOffProductToast (item: boolean|any): void {
        const _ = this.state.productToast;
        if (item === true) {
            _.show = true;
            _.title = "新增商品";
            _.data = JSON.parse(JSON.stringify(productToastDataStruct));
        }
        else if (typeof item === "object") {
            _.show = true;
            _.title = `编辑商品 "${item.title}"`;
            Object.keys(productToastDataStruct).forEach(k => {
                if (item[k] === undefined) throw "oh shit!";
                _.data[k] = item[k];
            });
        }
        else if (!item) {
            _.show = false;
            _.data = JSON.parse(JSON.stringify(productToastDataStruct));
            this.state.filelist = [];
        }
        this.setState({});
    }

    // 新增、编辑弹窗表单保存
    onSave () {
        
    }

    render (): React.ReactNode {
        const state = this.state;
        return <div className="shopproduct-page">
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
                        return <Switch loading={state.switchLoading[index]} onChange={this.onSoldSwitch.bind(this, item, index)}/>
                    }
                },
                {
                    title: "操作",
                    render: item => {
                        return <Form layout="inline">
                            <Form.Item>
                                <Button>详情</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button icon="setting">编辑</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button icon="delete">删除</Button>
                            </Form.Item>
                        </Form>
                    }
                },
            ]}
            />


            {/* 新增、编辑商品表单弹窗 */}
            <Modal
            width="80%"
            title={state.productToast.title}
            visible={state.productToast.show}
            onOk={this.onSave.bind(this)}
            onCancel={this.openOfOffProductToast.bind(this, false)}
            closable={false}
            >
                <Form>
                    <Row>
                        <Col span={7}>
                            <Form.Item label="商品名称">
                                <Input placeholder="商品名称"
                                onChange={input.bind(this, "productToast.data.title")}
                                />
                            </Form.Item>
                        </Col> 
                        <Col span={7} offset={1}>
                            <Form.Item label="商品类型">
                            <Select 
                            placeholder="选择商品类型"
                            value={state.productToast.data.type}
                            onChange={input.bind(this, "productToast.data.type")}
                            >
                                {state.types.filter(i => i.value).map(item => <Option value={item.value}>{item.name}</Option>)}
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={7} offset={1}>
                            <Form.Item label="是否上架">
                                <Switch checked={state.productToast.data.canSold} onChange={input.bind(this, "productToast.data.canSold")}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="商品图片">
                        <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        // fileList={fileList}
                        // onPreview={this.handlePreview}
                        // onChange={this.handleChange}
                        >
                            <div>
                                <Icon type="plus" />
                                <div className="ant-upload-text">Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    }
}