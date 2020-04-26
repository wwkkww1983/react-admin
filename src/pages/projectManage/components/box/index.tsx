import React from "react";
import "./less/index.less";
import {
    Form,
    Input,
    Button,
    Icon,
    message,
    Modal,
    Switch,
    Table,
    Select
} from "antd";
const { Option } = Select;
import { input } from "../../../../utils/utils";
import NProgress from "nprogress";
import { getProjectList } from "../../../../api/projectManage";
import CitySelect from "../../components/citySelect";
import LatLngSelect from "../../../../components/latlngSelect";

const types = [
    {name: "换电柜", value: 1},
    {name: "充电站", value: 2},
]

export default class Home extends React.Component {

    state = {
        headerForm: {
            projectTitle: "",
            status: "0"
        },
        addOrEditForm: {
            "type": undefined,
            "id": "",
            "title": "",// 项目标题
            "description": "",// 描述
            "cityCode": "",// 城市编码
            "adCode": "",// 区域编码
            "province": "",// 省-冗余字段
            "city": "",// 市-冗余字段
            "district": "",// 区-冗余字段
            "address": "",// 地址
            "longitude": "",// 经度
            "latitude": "",// 纬度
            "contactName": "",// 联系人
            "contactPhone": ""// 联系电话  
        },
        addOrEditShow: false,
        addOrEditTitle: "新增",
        columns: [
            //ID、项目名、地址、联系人、创建人、备注、GPS、维护人（折叠）、创建时间、最后修改时间
            {
                title: "id",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "项目名",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "地址",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "联系人",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "创建人",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "备注",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "GPS",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "维护人",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "创建时间",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "最后修改时间",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "状态",
                render: item => (
                    <Switch></Switch>
                )
            },
            {
                title: "操作",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Button icon="setting">运维人员设置</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="setting">价格设置</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="danger" icon="delete">删除</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button>审核</Button>
                        </Form.Item>
                    </Form>
                )
            },
        ],
        cityToastShow: false,
        list: [],
        limit: 10,
        page: 1,
        total: 0
    }

    componentDidMount () {
        this.init();
    }

    init () {
        this.loadList();
    }

    //打开编辑窗口
    openToast (item) {
        this.state.addOrEditShow = true;
        if (item) {
            this.state.addOrEditTitle = "编辑项目";
            //。。。
        } else {
            this.state.addOrEditTitle = "新增项目";
        }
        this.setState({});
    }

    //关闭编辑窗口
    offToast () {
        const state = this.state;
        state.addOrEditShow = false;
        Object.keys(state.addOrEditForm).forEach(key => state.addOrEditForm[key] = undefined);
        this.setState({});
    }

    //保存新增、编辑
    async save () {
        if (this.state.addOrEditForm.id) {

        }
        else {

        }
    }

    //加载列表数据
    async loadList () {
        NProgress.start();
        const data = {
            status: this.state.headerForm.status,
            page: this.state.page,
            limit: this.state.limit,
            type: 1
        }
        let res = null;
        try {
            res = await getProjectList(data);
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        this.setState({list: res.list || [], total: res.total});
    }

    //城市选择组件确定回掉
    citySelect ({ province, city, district, ad_code, city_code }): void {
        const _: any = (this as any).state.addOrEditForm;
        _["cityCode"] = city_code; // 城市编码
        _["adCode"]= ad_code; // 区域编码
        _["province"] = province; // 省-冗余字段
        _["city"] = city; // 市-冗余字段
        _["district"] = district; // 区-冗余字段
        this.setState({});
    }

    render (): any {
        const state: any = this.state;
        return (
            <div className="box-component-wrap">

                {/* 换电柜头部表单 */}
                <Form layout="inline">
                    <Form.Item label="项目名">
                        <Input placeholder="输入项目名称" value={state.headerForm.projectTitle} onChange={input.bind(this, "headerForm.projectTitle")}/>
                    </Form.Item>
                    <Form.Item label="状态">
                        <Select value={state.headerForm.status} onChange={input.bind(this, "headerForm.status")}>
                            <Option value="0">全部</Option>
                            <Option value="1">等待审核</Option>
                            <Option value="2">正常</Option>
                            <Option value="3">审核失败</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="search" onClick={() => {
                            this.state.page = 1;
                            this.setState({});
                            this.loadList();
                        }}>查找</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button icon="plus" onClick={this.openToast.bind(this)}>新建</Button>
                    </Form.Item>
                </Form>
                
                {/* 换电柜表格 */}
                <Table
                style={{marginTop: "16px"}}
                columns={state.columns}
                dataSource={state.list}
                onChange={({current}) => {
                    this.state.page = current;
                    this.setState({});
                    this.loadList();
                }}
                pagination={{
                    pageSize: state.limit,
                    total: state.total,
                    defaultCurrent: state.page
                }}
                />

                {/* 编辑，新增项目弹窗 */}
                <Modal
                closable={false}
                maskClosable={false}
                title={state.addOrEditTitle}
                visible={state.addOrEditShow}
                onOk={this.save.bind(this)}
                onCancel={this.offToast.bind(this)}
                >
                    <Form>
                        <Form.Item>
                            <Select placeholder="选择项目类型" value={state.addOrEditForm.type} onChange={input.bind(this, "addOrEditForm.type")}>
                                {types.map(item => <Option value={item.value}>{item.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="项目标题" value={state.addOrEditForm.title} onChange={input.bind(this, "addOrEditForm.title")}/>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="描述" value={state.addOrEditForm.description} onChange={input.bind(this, "addOrEditForm.description")}/>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="城市选择" 
                            value={state.addOrEditForm.province && state.addOrEditForm.city && state.addOrEditForm.district && state.addOrEditForm.province + "/" + state.addOrEditForm.city + "/" + state.addOrEditForm.district} 
                            onFocus={() => this.setState({cityToastShow: true})}/>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="详细地址"
                            value={state.addOrEditForm.address}
                            onInput={input.bind(this, "addOrEditForm.address")}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="经纬度"
                            value={''}
                            onFocus={() => {}}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 编辑，新增项目弹窗 */}
                {state.cityToastShow && 
                    <CitySelect 
                    province="河南省" 
                    city="洛阳市" 
                    district="新安县" 
                    confirm={data => {
                        this.setState({cityToastShow: false});
                        this.citySelect(data);
                    }} 
                    cancel={() => {
                        this.setState({cityToastShow: false});
                    }}/>
                }

                {/* 地图经纬度选择组件 */}
                <LatLngSelect province="贵州省" city="遵义市" district="道真仡佬族苗族自治县" confirm={data => console.log(data)}/>

            </div>
        );
    }
}