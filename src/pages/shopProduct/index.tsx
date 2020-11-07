import React from "react";
import "./index.less";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../utils/utils";
import { Form, Input, Button, Select, Table, Switch, Modal, Tabs, message, Carousel } from "antd";
const { Option } = Select;
const { TabPane } = Tabs;
import { productList, addProduct, editProduct, delProduct, setSold } from "../../api/shop";
import AddOrEditProduct from "./components/addOrEditProduct";
import ProductDetail from "./components/productDetail";

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
            canSold: null, //是否上架；null-不限制；true-查上架
        },
        list: [],
        productToast: {
            show: false,
            id: "",
        },
        detailToast: {
            id: "",
            show: false
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
        }
        else if (typeof item === "object") {
            _.show = true;
            _.id = item.id;
        }
        else if (!item) {
            _.show = false;
            _.id = "";
        }
        this.setState({});
    }

    //打开、关闭商品详情弹窗
    openOrOffDetailToast (item: boolean|any): void {
        const _ = this.state.detailToast;
        if (typeof item === "object") {
            _.show = true;
            _.id = item.id;
        } else {
            _.show = false;
            _.id = "";
        }
        this.setState({});
    }

    // 新增、编辑弹窗表单保存
    onAddOrEditFinishe () {
        this.openOfOffProductToast(false);
        this.loadList();
    }

    //删除商品
    onDeleteProduct (item) {
        Modal.confirm({
            title: `确定删除 "${item.title}" ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                NProgress.start();
                try {
                    await delProduct({id: item.id});
                } catch(err) {
                    NProgress.done();
                    return;
                }
                NProgress.done();
                message.success("已删除");
                this.loadList();
            },
            onCancel() {}
        });
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
                        <Option value={null}>不限</Option>
                        <Option value={1}>已上架</Option>
                        <Option value={0}>已下架</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.onSearch.bind(this)}>查找</Button>
                </Form.Item>
                <Form.Item>
                    <Button icon="plus" onClick={this.openOfOffProductToast.bind(this, true)}>新增</Button>
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
                    title: "商品名",
                    dataIndex: "title"
                },
                {
                    title: "商品类型",
                    dataIndex: "typeText"
                },
                {
                    title: "缩略图",
                    render: item => <div style={{width: "100px", background: "rgba(0,0,0,0.1)", overflow: "hidden"}}>
                        <Carousel autoplay={true}>
                            {item.imageList.map(url => <img src={url} alt=""/>)}
                        </Carousel>
                    </div>
                },
                {
                    title: "是否上架",
                    render: (item, record, index) => {
                        return <Switch loading={state.switchLoading[index]} onChange={this.onSoldSwitch.bind(this, item, index)} checked={item.canSold}/>
                    }
                },
                {
                    title: "操作",
                    render: item => {
                        return <Form layout="inline">
                            <Form.Item>
                                <Button onClick={this.openOrOffDetailToast.bind(this, item)}>详情</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button icon="setting" onClick={this.openOfOffProductToast.bind(this, item)}>编辑</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button icon="delete" onClick={this.onDeleteProduct.bind(this, item)}>删除</Button>
                            </Form.Item>
                        </Form>
                    }
                },
            ]}
            />


            {/* 新增、编辑商品表单弹窗 */}
            {state.productToast.show && <AddOrEditProduct id={state.productToast.id}
            onCancel={this.openOfOffProductToast.bind(this, false)}
            onFinishe={this.onAddOrEditFinishe.bind(this)}
            />}

            {/* 商品详情弹窗 */}
            {state.detailToast.show && <ProductDetail id={state.detailToast.id} onClose={this.openOrOffDetailToast.bind(this, false)}/>}

        </div>
    }
}