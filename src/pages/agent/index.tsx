import React from "react";
import "./index.less";
import { Form, Input, Button, Table, Popover, message, Modal, Row, Col, Select } from "antd";
const { Option } = Select;
import { getAgentList, addAgent, editAgent, delAgent } from "../../api/agent";
import { getCityDeepList } from "../../api/city";
import store from "../../store";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../utils/utils";
import Item from "antd/lib/list/Item";

/**
 * 新增代理商所需数据结构 
 */
const agentStruct = {
    leshua: {
        config: {
            merchantId: "",
            key: ""
        }
    },                              
    name:     "",
    phone:    "",
    cityCode: "",
    adCode:   "",
    province: undefined,
    city:     undefined,
    district: undefined,
    address:  ""
}

export default class Agent extends React.Component {
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
                title: "姓名",
                dataIndex: "name",
            },
            {
                title: "手机号",
                dataIndex: "phone"
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
                title: "乐刷信息",
                render: item => {
                    const content: React.ReactNode = <p>{P(item, "leshua.config.key")}</p>;
                    return <div>
                        <span>乐刷商户号：{P(item, "leshua.config.merchantId")}</span>
                        <br/>
                        <span>
                            乐刷key：
                            <Popover content={content} title="乐刷key">
                                <Button type="link">查看</Button>
                            </Popover>
                        </span>
                    </div>
                }
            },
            {
                title: "操作",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Button icon="setting" onClick={this.opendOrOffAgentToast.bind(this, item)}>编辑</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="danger" icon="delete" onClick={this.deleteAgent.bind(this, item)}>删除</Button>
                        </Form.Item>
                    </Form>
                )
            },
        ],
        province: [],
        city: [],
        area: [],
        searchText: "",
        agentForm: {
            show: false,
            data: JSON.parse(JSON.stringify(agentStruct))
        },
        list: [],
        page: 1,
        limit: 10,
        total: 0,
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
            res = await getAgentList({
                q: this.state.searchText,
                page: this.state.page,
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
    opendOrOffAgentToast (data: boolean|object) {
        const _ = this.state.agentForm;
        if (data && data !== undefined) {
            _.show = true;
            if (data === true) {
                _.data = JSON.parse(JSON.stringify(agentStruct));
            } else {
                _.data = JSON.parse(JSON.stringify(data));
                //处理省市区显示
                this.state.city = this.state.province.find(item => item.id == _.data.province).children;
                this.state.area = this.state.city.find(item => item.id == _.data.city).children;
            }
        } else {
            _.show = false;
            _.data = JSON.parse(JSON.stringify(agentStruct));
            this.state.city = [];
            this.state.area = [];
        }
        this.setState({});
    }

    //新增、编辑供应商
    async saveAgent () {
        const data = this.checkAgentData();
        if (data === false) return;
        NProgress.start();
        try {
            if (data.id !== undefined) {
                await editAgent(data);
            } else {
                await addAgent(data);
            }
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.opendOrOffAgentToast(null);
        message.success(data.id !== undefined ? "编辑已保存" : "已新增");
        this.loadList();
    }

    //删除供应商
    deleteAgent (item) {
        Modal.confirm({
            title: `确定要删除供应商 "${item.name}" 吗？`,
            okType: "danger",
            onOk: async () => {
                NProgress.start();
                try {
                    await delAgent({id: item.id});
                } catch(err) {
                    NProgress.done();
                    return;
                }
                NProgress.done();
                message.success(`已删除供应商 "${item.name}"`);
                this.loadList();
            },
            onCancel: () => {}
        });
    }

    //省市区选择
    citySelect (type, id) {
        const fromData = this.state.agentForm.data;
        fromData.adCode = "";
        fromData.cityCode = "";
        ({
            province () {
                const _ = this.state.province.find(i => i.id === id);
                fromData.province = id;
                fromData.city = fromData.district = undefined;
                this.state.city = _.children;
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
    checkAgentData (): any {
        const _ = this.state.agentForm.data;
        const checkMap = {
            name:     "姓名没有填写",
            phone:    "手机没有填写",
            leshua: {
                config: {
                    merchantId: "乐刷id没有填写",
                    key: "乐刷key没有填写"
                }
            },
            // cityCode: "城市编码没有选择",
            // adCode:   "区域编码没有选择",
            province: "省没有选择",
            city:     "市没有选择",
            district: "区没有选择",
            address:  "地址没有填写"
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
                    <Input placeholder="搜索" onChange={input.bind(this, "searchText")} value={state.searchText}></Input>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                </Form.Item>
                <Form.Item>
                    <Button icon="plus" onClick={this.opendOrOffAgentToast.bind(this, true)}>新增</Button>
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
            title={P(state, "agentForm.data.id", null) ? `编辑供应商 "${P(state, "agentForm.data.name")}"` : `新增供应商`}
            visible={state.agentForm.show}
            onCancel={this.opendOrOffAgentToast.bind(this, false)}
            onOk={this.saveAgent.bind(this)}
            >
                <Form>
                    <Row>
                        <Col span={11}>
                            <Form.Item label="姓名">
                                <Input 
                                placeholder="填写供应商姓名" 
                                value={state.agentForm.data.name}
                                onChange={input.bind(this, "agentForm.data.name")}
                                />
                            </Form.Item>
                            <Form.Item label="乐刷商户号">
                                <Input 
                                placeholder="请输入乐刷商户号"
                                value={state.agentForm.data.leshua.config.merchantId}
                                onChange={input.bind(this, "agentForm.data.leshua.config.merchantId")}
                                />
                            </Form.Item>
                            <Form.Item label="省份">
                                <Select 
                                placeholder="请选择省份" 
                                onChange={this.citySelect.bind(this, "province")} 
                                value={state.agentForm.data.province}
                                >
                                    {state.province.map(item => <Option value={item.id}>{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={11} offset="2">
                            <Form.Item label="手机号">
                                <Input placeholder="填写供应商手机号"
                                value={state.agentForm.data.phone}
                                onChange={input.bind(this, "agentForm.data.phone")}
                                />
                            </Form.Item>
                            <Form.Item label="乐刷key">
                                <Input 
                                placeholder="请输入乐刷key"
                                value={state.agentForm.data.leshua.config.key}
                                onChange={input.bind(this, "agentForm.data.leshua.config.key")}
                                />
                            </Form.Item>
                            <Form.Item label="城市">
                                <Select 
                                onChange={this.citySelect.bind(this, "city")} 
                                value={state.agentForm.data.city}
                                placeholder="请选择城市"
                                >
                                    {state.city.map(item => <Option value={item.id}>{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="区">
                        <Select
                        onChange={this.citySelect.bind(this, "area")} 
                        value={state.agentForm.data.district}
                        placeholder="请选择区"
                        >
                            {state.area.map(item => <Option value={item.id}>{item.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="详细地址">
                        <Input.TextArea placeholder="请填写详细地址"
                        value={state.agentForm.data.address}
                        onChange={input.bind(this, "agentForm.data.address")}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    }
}