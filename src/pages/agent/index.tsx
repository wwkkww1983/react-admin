import React from "react";
import "./index.less";
import { Form, Input, Button, Table, Popover, message, Modal, Row, Col, Select } from "antd";
const { Option } = Select;
import { getAgentList, addAgent, editAgent, delAgent } from "../../api/agent";
import { getCityDeepList } from "../../api/city";
import store from "../../store";
import NProgress from "nprogress";
import { input, property as P, initLife } from "../../utils/utils";
import { AgentData, AreaDict, AreaRow } from "./class";

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
                title: "地区/地址",
                render: item => {
                    const content = <Table
                    style={{width: "500px"}}
                    scroll={{y: 200}}
                    pagination={false}
                    dataSource={item.regions}
                    columns={[
                        {
                            title: "地区",
                            render: item => item.province + "/" + item.city + "/" + item.district
                        },
                        {
                            title: "地址",
                            dataIndex: "address"
                        }
                    ]}
                    />
                    return <Popover content={content} title="地区/地址">
                        <Button type="link">详情>></Button>
                    </Popover>
                }
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
        searchText: "",
        agentForm: {
            show: false,
            data: new AgentData(null)
        },
        list: [],
        page: 1,
        limit: 10,
        total: 0,
        //供给创建、编辑多个地址行选择的省市区数据结构（仅仅提供选择，不存储数据）,里边的元素都是AreaDict的实例
        areas: []
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
        if (data) {
            _.show = true;
            if (data === true) {
                _.data = new AgentData(null);
            } else {
                _.data = new AgentData(data);
                //处理省市区显示，以及对应的地区选择字典
                const regions = [];
                (_ as any).data.regions.forEach(item => {
                    regions.push(new AreaRow(item));
                    const areaDict = new AreaDict({ provinces: this.state.province });
                    areaDict.setCitys(item.province);
                    areaDict.setDistricts(item.city);
                    this.state.areas.push(areaDict);
                });
                (_ as any).data.regions = regions;
            }
        } else {
            _.show = false;
            _.data = new AgentData(null);
            this.state.areas = [];
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
    citySelect (type, index, name) {
        const row = (this as any).state.agentForm.data.regions[index], rowDict = this.state.areas[index];
        row.adCode = row.cityCode = "";
        ({
            province () {
                rowDict.clearDistricts();
                rowDict.clearCitys();
                rowDict.setCitys(name);
                row.city = row.district = undefined;
                row.province = name;
            },
            city () {
                rowDict.clearDistricts();
                rowDict.setDistricts(name);
                row.district = undefined;
                row.city = name;
            },
            area () {   
                const _ = rowDict.getDistrict(name);
                row.district = name;
                row.adCode = _.ad_code;
                row.cityCode = _.city_code;
            }
        })[type].call(this);
        this.setState({});
    }

    //新增、编辑之地址填写
    addressInput (index, { target: { value } }) {
        (this as any).state.agentForm.data.regions[index].address = value;
        this.setState({});
    }

    //检查新增创建的地址行是否全部填写
    checkRows () {
        const rows = (this as any).state.agentForm.data.regions;
        for (let i  = 0; i < rows.length; i++) {
            const msg = rows[i].check();
            if (msg) {
                message.warning(`第${i + 1}行${msg}`);
                return true;
            }
        }
        return false;
    }

    //新增编辑地址新增一行
    addRow () { 
        if (this.checkRows()) return;   
        (this as any).state.agentForm.data.regions.push(new AreaRow(null));
        console.log((this as any).state.agentForm.data.regions);
        //增加对应行选择字段，也就是AreaDict的实例
        this.state.areas.push(new AreaDict({
            provinces: this.state.province
        }));
        this.setState({});
    }

    //新增、编辑地址删除行
    delRow (index) {
        (this as any).state.areas.splice(index, 1);
        (this as any).state.agentForm.data.regions.splice(index, 1);
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
            }
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
        if ((this as any).state.agentForm.data.regions.length === 0) {
            message.warning("地区/地址没有");
            return false;
        }
        if (this.checkRows()) return false;
        !(_ as any).id && delete (_ as any).id;
        return _;
    }

    render (): React.ReactNode {
        const state = (this as any).state;
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
            width="80%"
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
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item label="手机号">
                                <Input placeholder="填写供应商手机号"
                                value={state.agentForm.data.phone}
                                onChange={input.bind(this, "agentForm.data.phone")}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item label="乐刷商户号">
                                <Input 
                                placeholder="请输入乐刷商户号"
                                value={state.agentForm.data.leshua.config.merchantId}
                                onChange={input.bind(this, "agentForm.data.leshua.config.merchantId")}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item label="乐刷key">
                                <Input 
                                placeholder="请输入乐刷key"
                                value={state.agentForm.data.leshua.config.key}
                                onChange={input.bind(this, "agentForm.data.leshua.config.key")}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="地区/地址">
                        <Table
                        scroll={{y: 200}}
                        columns={[
                            {
                                title: "省份",
                                render: (item, record, index) => {
                                    return <Select 
                                    placeholder="请选择省份" 
                                    onChange={this.citySelect.bind(this, "province", index)} 
                                    value={item.province}
                                    >
                                        {P(state, `areas[${index}].provinces`, []).map(item => <Option value={item.name}>{item.name}</Option>)}
                                    </Select>
                                }
                            },
                            {
                                title: "城市",
                                render: (item, record, index) => {
                                    return <Select 
                                    onChange={this.citySelect.bind(this, "city", index)} 
                                    value={item.city}
                                    placeholder="请选择城市"
                                    >
                                        {P(state, `areas[${index}].citys`, []).map(item => <Option value={item.name}>{item.name}</Option>)}
                                    </Select>
                                }
                            },
                            {
                                title: "区/县",
                                render: (item, record, index) => {
                                    return <Select
                                    onChange={this.citySelect.bind(this, "area", index)} 
                                    value={item.district}
                                    placeholder="请选择区"
                                    >
                                        {P(state, `areas[${index}].districts`, []).map(item => <Option value={item.name}>{item.name}</Option>)}
                                    </Select>
                                }
                            },
                            {
                                title: "详细地址",
                                render: (item, record, index) => {
                                    return <Input.TextArea 
                                    rows={1}
                                    placeholder="请填写详细地址"
                                    value={item.address}
                                    onChange={this.addressInput.bind(this, index)}
                                    />
                                }
                            },
                            {
                                width: "100px",
                                title: "操作",
                                render: (item, record, index) => <Button type="danger" icon="delete" onClick={this.delRow.bind(this, index)}>删除</Button>
                            }
                        ]}
                        dataSource={state.agentForm.data.regions}
                        pagination={false}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button icon="plus" type="link" onClick={this.addRow.bind(this)}>增加一行</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    }
}