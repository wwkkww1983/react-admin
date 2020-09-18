import React from "react";
import "./index.less";
import { Form, Input, Button, Table, Popover, message, Modal, Row, Col, Select, List } from "antd";
const { Option } = Select;
import { getStoreList, addStore, delStore, editStore } from "../../api/agent";
import { getCityDeepList } from "../../api/city";
import store from "../../store";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../utils/utils";
import AgentSelect from "../../components/agentSelect";
import LatlngSelect from "../../components/latlngSelect";
import DevicePosition from "../../components/devicePosition";

/**
 * 新增代理商所需数据结构 
 */
const storeStruct = {
    "agentId": "",// 代理商ID
    "name": "",// 门店名称
    "longitude":"",// 纬度
    "latitude":"",// 经度
    "cityCode":"",// 城市编码
    "adCode":"",// 区域编码
    "province": undefined,// 省
    "city": undefined,// 市
    "district": undefined,// 区
    "address":""// 详细地址
}

export default class Store extends React.Component {
    constructor (props) {
        super(props);
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
                            <Button icon="environment" onClick={this.openOrOffPositionToast.bind(this, item)}>位置</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="setting" onClick={this.opendOrOffStoreToast.bind(this, item)}>编辑</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="danger" icon="delete" onClick={this.deleteStore.bind(this, item)}>删除</Button>
                        </Form.Item>
                    </Form>
                )
            },
        ],
        province: [],
        city: [],
        area: [],
        searchText: "",
        storeForm: {
            show: false,
            data: JSON.parse(JSON.stringify(storeStruct))
        },
        latlngForm: {
            show: false,
            data: {
                province: "",
                city: "",
                district: ""
            }
        },
        positionToast: {
            show: false,
            data: {
                title: "",
                lat: "",
                lng: ""
            }
        },
        list: [],
        page: 1,
        limit: 10,
        total: 0,
        agentSelectShow: false,
    }
    
    componentDidMount () {
        initLife(this, this.init);
    }

    async init () {
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
        if (city) {
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

    //打开、关闭新增、编辑供应商弹窗
    opendOrOffStoreToast (data: boolean|object) {
        const _ = this.state.storeForm;
        if (data && data !== undefined) {
            _.show = true;
            if (data === true) {
                _.data = JSON.parse(JSON.stringify(storeStruct));
            } else {
                _.data = JSON.parse(JSON.stringify(data));
                //处理省市区显示
                this.state.city = this.state.province.find(item => item.id == _.data.province).children;
                this.state.area = this.state.city.find(item => item.id == _.data.city).children;
            }
        } else {
            _.show = false;
            _.data = JSON.parse(JSON.stringify(storeStruct));
            this.state.city = [];
            this.state.area = [];
        }
        this.setState({});
    }

    //打开、关闭坐标选择弹窗
    openOrOfflatlngToast (is) {
        const _ = (this as any).state.latlngForm, storeData = this.state.storeForm.data;
        if (is) {
            _.show = true;
            _.data.province = this.getCityNameById(storeData.province);
            _.data.city = this.getCityNameById(storeData.city);
            _.data.district = this.getCityNameById(storeData.district);
        } else {
            _.show = false;
            Object.keys(_.data).forEach(k => _.data[k] = "");
        }
        this.setState({});
    }

    //打开、关闭位置显示弹窗
    openOrOffPositionToast (item) {
        const _ = this.state.positionToast;
        if (item) {
            _.show = true;
            _.data.title = `"${item.name}" 位置`;
            _.data.lat = item.latitude;
            _.data.lng = item.longitude;
        } else {
            _.show = false;
            Object.keys(_.data).forEach(k => _.data[k] = null);
        }
        this.setState({});
    }

    //新增、编辑供应商
    async saveStore () {
        const data = this.checkStoreData();
        if (data === false) return;
        NProgress.start();
        try {
            if (data.id !== undefined) {
                await editStore(data);
            } else {
                await addStore(data);
            }
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.opendOrOffStoreToast(null);
        message.success(data.id !== undefined ? "编辑已保存" : "已新增");
        this.loadList();
    }

    //删除供应商
    deleteStore (item) {
        Modal.confirm({
            title: `确定要删除门店 "${item.name}" 吗？`,
            okType: "danger",
            onOk: async () => {
                NProgress.start();
                try {
                    await delStore({id: item.id});
                } catch(err) {
                    NProgress.done();
                    return;
                }
                NProgress.done();
                message.success(`已删除门店 "${item.name}"`);
                this.loadList();
            },
            onCancel: () => {}
        });
    }

    //省市区选择
    citySelect (type, id) {
        const fromData = this.state.storeForm.data;
        fromData.adCode = "";
        fromData.cityCode = "";
        //去除经纬度，因为重要重选了地址就必须重选坐标，否则会影响坐标选择组件（传坐标又传地区或导致范围绘制失败）。
        fromData.latitude = "";
        fromData.longitude = "";
        ({
            province () {
                const _ = this.state.province.find(i => i.id === id);
                fromData.province = id;
                fromData.city = fromData.district = undefined;
                this.state.city = _.children;
                this.state.area = [];
            },
            city () {
                const _ = this.state.city.find(i => i.id === id);
                fromData.city = id;
                fromData.district = undefined;
                this.state.area = _.children;
            },
            area () {   
                const _ = this.state.area.find(i => i.id === id);
                fromData.district = id;
                fromData.adCode = _.ad_code;
                fromData.cityCode = _.city_code;
            }
        })[type].call(this);
        this.setState({});
    }

    //检测新增、编辑供应商字段填写
    checkStoreData (): any {
        const _ = this.state.storeForm.data;
        const checkMap = {
            "name": "请填写门店名称",
            "agentId": "请选择代理商",
            "longitude": "请选择位置",
            "latitude": "请选择位置",
            // "cityCode":"",// 城市编码
            // "adCode":"",// 区域编码
            "province": "请选择省份",
            "city": "请选择市",
            "district": "请选择区",
            "address":"请填写详细地址"
        }
        function check (data: object, target: string[]): void {
            Object.keys(data).forEach(k => {
                if (typeof data[k] === "object") {
                    check(data[k], [...target, k]);
                } else {
                    if (!P(_, target.join(".") + "." + k, null)) throw P(checkMap, target.join(".") + "." + k);
                }
            });
        }
        try {
            check(checkMap, []);
        } catch(text) {
            message.warning(text);
            return false;
        }
        return _;
    }

    render (): React.ReactNode {
        const state = this.state;
        return <div className="agent-page">
            <Form layout="inline">
                <Form.Item>
                    <Input placeholder="门店名称" onChange={input.bind(this, "searchText")} value={state.searchText}></Input>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                </Form.Item>
                <Form.Item>
                    <Button icon="plus" onClick={this.opendOrOffStoreToast.bind(this, true)}>新增</Button>
                </Form.Item>
            </Form>
            <Table
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

            {/* 新增、编辑供应商弹窗 */}
            <Modal
            closable={false}
            maskClosable={false}
            title={P(state, "storeForm.data.id", null) ? `编辑门店 "${P(state, "storeForm.data.name")}"` : `新增门店`}
            visible={state.storeForm.show}
            onCancel={this.opendOrOffStoreToast.bind(this, false)}
            onOk={this.saveStore.bind(this)}
            >
                <Form>
                    <Row>
                        <Col span={11}>
                            <Form.Item label="门店名称">
                                <Input 
                                placeholder="填写供应商姓名" 
                                value={state.storeForm.data.name}
                                onChange={input.bind(this, "storeForm.data.name")}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item label="代理商">
                                <Input 
                                placeholder="请选择代理商" 
                                value={state.storeForm.data.agentId}
                                onFocus={() => {
                                    this.state.agentSelectShow = true;
                                    this.setState({});
                                }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item label="省份">
                                <Select 
                                placeholder="请选择省份" 
                                onChange={this.citySelect.bind(this, "province")} 
                                value={state.storeForm.data.province}
                                >
                                    {state.province.map(item => <Option value={item.id}>{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item label="城市">
                                <Select 
                                onChange={this.citySelect.bind(this, "city")} 
                                value={state.storeForm.data.city}
                                placeholder="请选择城市"
                                >
                                    {state.city.map(item => <Option value={item.id}>{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item label="区">
                                <Select
                                    onChange={this.citySelect.bind(this, "area")} 
                                    value={state.storeForm.data.district}
                                    placeholder="请选择区"
                                    >
                                        {state.area.map(item => <Option value={item.id}>{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="经纬度">
                        <Input 
                        disabled={!state.storeForm.data.province || !state.storeForm.data.city || !state.storeForm.data.district}
                        placeholder="请选择经纬度" 
                        value={P(state, "storeForm.data.longitude", null) ? state.storeForm.data.longitude + "/" + state.storeForm.data.latitude : ""}
                        onFocus={this.openOrOfflatlngToast.bind(this, true)}
                        />
                    </Form.Item>
                    <Form.Item label="详细地址">
                        <Input.TextArea placeholder="请填写详细地址"
                        value={state.storeForm.data.address}
                        onChange={input.bind(this, "storeForm.data.address")}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 代理商选择弹窗 */}
            {state.agentSelectShow && 
            <AgentSelect 
            onOk={item => {
                state.storeForm.data.agentId = item.id;
                state.agentSelectShow = false;
                this.setState({});
            }}
            onCancel={() => {
                state.agentSelectShow = false;
                this.setState({});
            }} 
            />}

            {/* 经纬度选择弹窗 */}
            {state.latlngForm.show && <LatlngSelect 
            lat={state.storeForm.data.latitude}
            lng={state.storeForm.data.longitude}
            province={state.latlngForm.data.province}
            city={state.latlngForm.data.city}
            district={state.latlngForm.data.district}
            cancel={this.openOrOfflatlngToast.bind(this, false)}
            confirm={({lat, lng}) => {
                state.storeForm.data.latitude = lat;
                state.storeForm.data.longitude = lng;
                this.setState({});
                this.openOrOfflatlngToast(false);
            }}
            />}

            {/* 门店位置显示 */}
            {state.positionToast.show && <DevicePosition
            title={state.positionToast.data.title}
            lat={state.positionToast.data.lat}
            lng={state.positionToast.data.lng}
            close={this.openOrOffPositionToast.bind(this, null)}
            />}
        </div>
    }
}