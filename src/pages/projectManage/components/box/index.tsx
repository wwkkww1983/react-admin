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
    Select,
    Menu,
    Dropdown
} from "antd";
const { Option } = Select;
import { input, timeToDateStr } from "../../../../utils/utils";
import NProgress from "nprogress";
import { 
    getProjectList,
    createProject, 
    updateProject, 
    deleteProject as delProject,
    enableProject,
    disableProject
} from "../../../../api/projectManage";
import CitySelect from "../../components/citySelect";
import LatLngSelect from "../../../../components/latlngSelect";
import Item from "antd/lib/list/Item";
import { enableDevice } from "../../../../api/deviceManager";

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
                dataIndex: "title",
                key: "title",
            },
            {
                title: "地址",
                render: item => {
                    return (
                        <div>
                            <span>{item.province + ", " + item.city + ", " + item.district}</span><br/>
                            {item.address && <span>{item.address}</span>}
                        </div>
                    );
                }
            },
            {
                title: "联系人",
                render: item => item.contactName + ":" + item.contactPhone
            },
            // {
            //     title: "创建人",
            //     dataIndex: "id",
            //     key: "id",
            // },
            {
                title: "备注",
                dataIndex: "description",
                key: "description",
            },
            {
                title: "GPS",
                render: item => (
                    <div>
                        <span>经度：{item.longitude}</span><br/>
                        <span>纬度：{item.latitude}</span>
                    </div>
                )
            },
            // {
            //     title: "维护人",
            //     dataIndex: "id",
            //     key: "id",
            // },
            {
                title: "创建时间",
                render: item => timeToDateStr(item.createTime * 1000)
            },
            // {
            //     title: "最后修改时间",
            //     dataIndex: "id",
            //     key: "id",
            // },
            {
                title: "状态",
                render: (item, record, index) => (
                    <Switch 
                    checkedChildren="启用" 
                    unCheckedChildren="禁用" 
                    checked={Number(item.status) !== 4} 
                    loading={this.state.switchLoadings[index]}
                    onChange={this.enableOrDisable.bind(this, index)}
                    ></Switch>
                )
            },
            {
                title: "操作",
                render: item => {
                    const menu: any = (
                        <Menu>
                            <Menu.Item>
                                <span onClick={this.openToast.bind(this, item)}>编辑</span>
                            </Menu.Item>
                            <Menu.Item>
                                运维人员设置
                            </Menu.Item>
                            <Menu.Item>
                                价格设置
                            </Menu.Item>
                            {Number(item.status) === 1 && <Menu.Item>
                                审核
                            </Menu.Item>}
                            <Menu.Item>
                                <span onClick={this.deleleProject.bind(this, item)}>删除</span>
                            </Menu.Item>
                        </Menu>
                    );
                    return (
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link">
                                设置 <Icon type="down" />
                            </a>
                        </Dropdown>
                    );
                }
                // render: item => (
                //     <Form layout="inline">
                //         <Form.Item>
                //             <Button icon="setting">运维人员设置</Button>
                //         </Form.Item>
                //         <Form.Item>
                //             <Button icon="setting">价格设置</Button>
                //         </Form.Item>
                //         <Form.Item>
                //             <Button type="danger" icon="delete">删除</Button>
                //         </Form.Item>
                //         <Form.Item>
                //             <Button>审核</Button>
                //         </Form.Item>
                //     </Form>
                // )
            },
        ],
        cityToastShow: false,
        positionToastShow: false,
        switchLoadings: [],
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

    //启用禁用项目switch切换
    async enableOrDisable (index: number|string) {
        const item: any = (this as any).state.list[index];
        setSwitchLoading.call(this, index, true);
        if (Number(item.status) === 4) { //status === 代表当前状态处于禁用，其他则为启用
            await enableProject({id: item.id});
        } else {
            await disableProject({id: item.id});
        }
        setSwitchLoading.call(this, index, false);
        this.loadList();
        function setSwitchLoading (index: number, is = false) {
            this.state.switchLoadings[index] = is;
            this.setState({});
        }
    }

    //删除项目
    deleleProject (item: any) {
        if (!item) return;
        Modal.confirm({
            title: `确定删除 "${item.title}" ?`,
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                deleteProject.call(this);    
            }
        });
        async function deleteProject () {
            NProgress.start();
            try {
                await delProject({id: item.id});
            } catch(err) {
                NProgress.done();
                return;
            }
            NProgress.done();
            message.success(`已删除 "${item.title}"`);
            this.loadList();
        }
    }

    //打开编辑窗口
    openToast (item: any) {
        this.state.addOrEditShow = true;
        if (item.id) {
            this.state.addOrEditTitle = "编辑项目";
            const _: any = (this as any).state.addOrEditForm;
            const keys = Object.keys(this.state.addOrEditForm);
            keys.forEach(key => this.state.addOrEditForm[key] = item[key] || undefined);
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
        const _: any = (this as any).state.addOrEditForm;
        if (!checkParams.call(this, _)) return;
        if (_.id) {
            edit.call(this, _);    
        }
        else {
            create.call(this, _);
        }
        async function create (data: any) {
            NProgress.start();
            try {
                await createProject(data);
            } catch(err) {
                NProgress.done();
                return;
            }
            NProgress.done();
            message.success("已创建");
            this.offToast();
            this.loadList();
        }
        async function edit (data: any) {
            NProgress.start();
            try {
                await updateProject(data);
            } catch(err) {
                NProgress.done();
                return;
            }
            NProgress.done();
            message.success("已更新");
            this.offToast();
            this.loadList();
        }
        function checkParams (data: any) {
            let msg = "";
            if (!data.type) msg = "请选择项目类型";
            else if (!data.title) msg = "请完成项目标题";
            else if (!data.description) msg = "请完成项目描述";
            else if (!data.province) msg = "请选择城市";
            else if (!data.city) msg = "请选择城市";
            else if (!data.district) msg = "请选择城市";
            else if (!data.address) msg = "地址未填写";
            else if (!data.longitude || !data.latitude) msg = "经纬度未选择";
            else if (!data.contactName) msg = "请填写联系人";
            else if (!data.contactPhone) msg = "请填写联系人电话";
            if (msg) {
                message.warning(msg);
                return false;
            }
            return true;
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
        const switchLoadings: boolean[] = [];
        res.list.forEach(item => switchLoadings.push(false));
        this.setState({list: res.list || [], total: res.total, switchLoadings});
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

    //经纬度选择回掉
    latlngConfirm ({lat, lng}) {
        const state: any = (this as any).state
        state.positionToastShow = false;
        state.addOrEditForm.latitude = lat;
        state.addOrEditForm.longitude = lng;
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
                            <Option value="4">已禁用</Option>
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
                            <Input placeholder="经纬度选择"
                            disabled={!state.addOrEditForm.province || !state.addOrEditForm.city || !state.addOrEditForm.district}
                            value={state.addOrEditForm.longitude && state.addOrEditForm.latitude && "lat:" + state.addOrEditForm.latitude + " / lng:" + state.addOrEditForm.longitude}
                            onFocus={() => {
                                this.setState({positionToastShow: true});
                            }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="联系人"
                            value={state.addOrEditForm.contactName}
                            onInput={input.bind(this, "addOrEditForm.contactName")}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="联系人电话"
                            value={state.addOrEditForm.contactPhone}
                            onInput={input.bind(this, "addOrEditForm.contactPhone")}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 弹窗 */}
                {/* <Modal
                width={state.width}
                closable={false}
                maskClosable={false}
                title="选择经纬度坐标"
                visible={true}
                onOk={this.confirm.bind(this)}
                onCancel={this.cancel.bind(this)}
                >
                    123
                </Modal> */}

                {/* 编辑，新增项目弹窗 */}
                {state.cityToastShow && 
                    <CitySelect 
                    province={state.addOrEditForm.province} 
                    city={state.addOrEditForm.city} 
                    district={state.addOrEditForm.district}
                    confirm={data => {
                        this.setState({cityToastShow: false});
                        this.citySelect(data);
                    }} 
                    cancel={() => {
                        this.setState({cityToastShow: false});
                    }}/>
                }

                {/* 地图经纬度选择组件 */}
                {state.positionToastShow && 
                <LatLngSelect 
                province={state.addOrEditForm.province} 
                city={state.addOrEditForm.city} 
                district={state.addOrEditForm.district} 
                lat={state.addOrEditForm.latitude}
                lng={state.addOrEditForm.longitude}
                confirm={this.latlngConfirm.bind(this)}
                cancel={() => this.setState({positionToastShow: false})}
                />}

            </div>
        );
    }
}