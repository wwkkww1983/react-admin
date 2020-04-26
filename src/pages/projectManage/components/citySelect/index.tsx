import React from "react";
import "./index.less";
import { Alert, message, Form, Select, Modal, Input } from "antd";
import store from "../../../../store";
import NProgress from "nprogress";
import { getCityDeepList } from "../../../../api/city";

const { Option } = Select;

interface Props {
    confirm(data: any): any,
    cancel(): any,
    "province"?: string,// 省-冗余字段
    "city"?: string,// 市-冗余字段
    "district"?: string,// 区-冗余字段
}

export default class Home extends React.Component {

    static defaultProps: Props = {
        confirm: () => {},
        cancel: () => {},
        "province":"",// 省-冗余字段
        "city":"",// 市-冗余字段
        "district":"",// 区-冗余字段
    }

    constructor (props) {
        super(props);
    }

    state = {
       province: undefined,
       city: undefined,
       district: undefined,

       //省市区源数据
       provinces: [],
       citys: [],
       districts: []
       
    }

    componentWillReceiveProps (props) {
        this.initPropsToState(props);
    }

    componentDidMount () {
        this.init();
    }

    async init () {
        this.initUseStore();
        this.loadCityDataToStorage();
    }

    initPropsToState (props) {
        let { province, city, district } = (this as any).props;
        //初始化城市、区县数组。（如果有提已选择的城市，区县）
        let citys: any = [], _citys: any = null, districts: any = [], _districts: any = null;
        if (_citys = this.state.provinces.find(item => item.name === province)) {
            citys = _citys.children || []
        }
        if (_districts = citys.find(item => item.name === city)) {
            districts = _districts.children || [];
        }
        //省市县检测是否在范围，没有则选择失效
        if (this.state.provinces.find(item => item.name === province)) {
            if (citys.find(item => item.name === city)) {
                if (!districts.find(item => item.name === district)) {
                    district = undefined;
                }
            } else {
                city = undefined;
            }
        } else {
            province = undefined;
        }
        this.setState({
            province,
            city,
            district,
            citys,
            districts
        });
    }

    confirm () {
        let state: any = this.state, msg: string = "";
        if (!state.province) msg = "请选择省份";
        else if (!state.city) msg = "请选择城市";
        else if (!state.district) msg = "请选择区、县";
        if (msg !== "") {
            message.warning(msg);
            return;
        }
        const 
        _district: any = state.districts.find(item => item.name === state.district),
        data: any = {
            province: state.province,
            city: state.city,
            district: state.district,
            ad_code: _district.ad_code,
            city_code: _district.city_code
        };
        console.log(data);
        (this as any).props.confirm.call(null, data);
    }

    cancel () {
        (this as any).props.cancel.call(null, {});
    }

    initUseStore () {
        const f = () => {
            const city = store.getState().city;
            this.setState({ provinces: city });
        }
        store.subscribe(f);
        f();
    }   

    //记载城市区域数据到缓存中
    async loadCityDataToStorage () {
        if (!store.getState().city) {
            NProgress.start();
        }
        let res: any = null;
        try {
            res = await getCityDeepList();
        } catch(err) {
            NProgress.done();
            return;
        }
        NProgress.done();
        store.dispatch({type: "city/SET", playload: res.data});
    }

    //省选择事件回调
    provinceChange (name) {
        this.setState({
            districts: [],
            district: undefined,
            city: undefined,
            province: name,
            citys: this.state.provinces.find(item => item.name === name).children
        });
    }
    //市选择回调
    cityChange (name) {
        this.setState({
            district: undefined,
            city: name,
            districts: this.state.citys.find(item => item.name === name).children
        });
    }
    //区县选择回调
    districtChange (name) {
        this.setState({
            district: name
        });
    }

    render (): any {
        const state = this.state;
        return (
            <div className="cityselect-component-wrap">

                <Modal
                visible={true}
                closable={false}
                maskClosable={false}
                title="城市选择"
                onOk={this.confirm.bind(this)}
                onCancel={this.cancel.bind(this)}
                >
            
                    <Form>
                        <Form.Item>
                            <Select placeholder="选择省份" value={state.province} onChange={this.provinceChange.bind(this)}>
                                {state.provinces.map(item => <Option value={item.name}>{item.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Select placeholder="选择城市" value={state.city} disabled={state.citys.length === 0} onChange={this.cityChange.bind(this)}>
                                {state.citys.map(item => <Option value={item.name}>{item.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Select placeholder="选择区、县" disabled={state.districts.length === 0} value={state.district} onChange={this.districtChange.bind(this)}>
                                {state.districts.map(item => <Option value={item.name}>{item.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Form>

                </Modal>
            </div>
        );
    }
}