import React from "react";
import "./index.less";
import { Form, Input, Button, Table, Popover, message, Modal, Row, Col } from "antd";
import { getStoreList } from "../../../../api/agent";
import { getCityDeepList } from "../../../../api/city";
import store from "../../../../store";
import NProgress from "nprogress";
import { input, property as P} from "../../../../utils/utils";

interface Props {
    title: string,
    onCancel():void,
    onOk(any):void
}

export default class StoreSelect extends React.Component {
    constructor (props) {
        super(props);
    }

    static defaultProps: Props = {
        title: "选择门店",
        onCancel () {},
        onOk () {}
    }

    state = {
        columns: [
            {
                title: "id",
                dataIndex: "id",
            },
            {
                title: "门店",
                dataIndex: "name",
            },
            {
                title: "地区",
                render: item => `${this.getCityNameById(item.province)}/${this.getCityNameById(item.city)}/${this.getCityNameById(item.district)}`
            },
            {
                title: "地址",
                dataIndex: "address"
            },
            {
                title: "操作",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Button icon="check" onClick={(this as any).props.onOk.bind(this, item)}>选择</Button>
                        </Form.Item>
                    </Form>
                )
            },
        ],
        province: [],
        searchText: "",
        list: [],
        page: 1,
        limit: 10,
        total: 0,
    }
    
    async componentDidMount () {
        NProgress.start();
        await this.loadCityData();
        await this.loadList(false);
        NProgress.done();
    }

    //城市id换取城市名
    getCityNameById (id) {
        const _ = f(this.state.province, id);
        return _;
        function f (arr, id) {
            for (let item of arr) {
                if (item.id == id) return item.name;
                if (item.children) {
                    let name = f(item.children, id);
                    if (name) return name;
                }
            }
        }
    }

    //加载城市数据
    async loadCityData () {
        let city = store.getState().city;
        if (city.length > 0) {
            this.state.province = city;
        } else {
            try {
                city = await getCityDeepList();
            } catch(err) {
                return;
            }
            this.state.province = city.data;
        }
    }

    //加载代理商列表
    async loadList (loading = true) {
        loading && NProgress.start();
        let res = null;
        try {
            res = await getStoreList({
                q: this.state.searchText,
                p: this.state.page,
                limit: this.state.limit
            });
        } catch(err) {
            loading && NProgress.done();
            return;
        }
        loading && NProgress.done();
        res.list.forEach(item => {
            item.province && (item.province = Number(item.province));
            item.city && (item.city = Number(item.city));
            item.district &&  (item.district = Number(item.district));
        });
        this.setState({
            list: res.list,
            total: res.total
        });
    }

    render (): React.ReactNode {
        const state = this.state, props = (this as any).props;
        return <Modal
        width="80%"
        visible={true}
        title={props.title}
        footer={null}
        maskClosable={false}
        onCancel={props.onCancel}
        zIndex={2000}
        >
            <Form layout="inline">
                <Form.Item>
                    <Input placeholder="门店名称" onChange={input.bind(this, "searchText")} value={state.searchText}></Input>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                </Form.Item>
            </Form>
            <Table
            scroll={{y: 400}}
            style={{marginTop: "16px"}}
            columns={state.columns}
            dataSource={state.list}
            pagination={{
                current: state.page,
                pageSize: state.limit,
                total: state.total,
                onChange: page => {
                    state.page = page;
                    this.loadList();
                }
            }}
            />
        </Modal>
    }
}