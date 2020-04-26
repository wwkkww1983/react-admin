import React from "react";
import "./index.less";
import { Alert, Modal, message } from "antd";
import store from "../../store";

interface Props {
    lat?: string|number,
    lng?: string|number,
    province: string,
    city: string,
    district: string,
    confirm(data: any): void,
    cancel(): void
}

export default class Home extends React.Component {

    map = null;

    pointerMarker = null;

    static defaultProps: Props = {
        lat: "",
        lng: "",
        province: "",
        city: "",
        district: "",
        confirm: () => {},
        cancel: () => {}
    }

    constructor (props) {
        super(props);
    }

    state = {
        lat: "",
        lng: "",
        height: 0,
        width: 0
    }

    componentDidMount () {
        this.init();
    }

    async init () {
        this.initUseStore();
        this.initListenWindowWidth();
        this.map = await this.initMap();
        this.drawArea((this as any).props.district || (this as any).props.city || (this as any).props.province);
        this.drawPointer();
    }

    initUseStore () {
        const f = () => {
            this.setState({height: store.getState().layout.contentHieght});
        }
        f();
        store.subscribe(f);
    }
    
    initListenWindowWidth () {
        const f = () => {
            this.setState({width: innerWidth - 500});
        }
        f();
        window.addEventListener("resize", f);
    }

    //监听行政区域点击，获取经纬度，并画点
    areaClick ({lnglat: {lat, lng}}) {
        this.setState({lat, lng});
        this.drawPointer(lat, lng);
    }

    //画出行政区范围
    drawArea (areaName = "") {
        if (!areaName) return;
        const map = this.map;
        // 创建行政区查询对象
        const district = new AMap.DistrictSearch({
            // 返回行政区边界坐标等具体信息
            extensions: 'all',
            // 设置查询行政区级别为 区 
            level: 'district'
        });
        district.search(
            areaName, 
            (status, result) => {
                // 获取朝阳区的边界信息
                var bounds = result.districtList[0].boundaries;
                var polygons = [];
                if (bounds) {
                    for (var i = 0, l = bounds.length; i < l; i++) {
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            map: map,
                            strokeWeight: 2,
                            path: bounds[i],
                            fillOpacity: 0.1,
                            fillColor: '#CCF3FF',
                            // strokeColor: '#CC66CC'
                            strokeColor: '#1acebc' //腾悦绿
                        });
                        polygons.push(polygon);
                        polygon.on("click", this.areaClick.bind(this));
                    }
                    // 地图自适应
                    map.setFitView();
                }
            }
        );
    }

    //绘制定位点，并显示经纬度
    drawPointer (lat?: number|string, lng?:string|number) {
        if (!lat || !lng) return;
        const map: any = this.map;
        if (this.pointerMarker) map.remove(this.pointerMarker); 
        const content = '<img style="height: 30px" src="./public/img/我的位置.png"/>'; //暂定30px宽高
        const marker = this.pointerMarker = new AMap.Marker({
            content: content, 
            position:  [lng, lat],
            offset: new AMap.Pixel(-15, -15) 
        });
        map.add(marker);
    }

    /**
     * 初始化地图 
     */
    initMap () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const map = new AMap.Map((this as any).refs["map-container"], {
                    zoom: 4,//级别
                    // center: [],//中心点坐标
                    viewMode:'2D',//使用3D视图
                    mapStyle: 'amap://styles/whitesmoke', //设置地图的显示样式
                });
                map.on("complete", () => {
                    //设置鼠标样式为十字样式
                    map.setDefaultCursor("crosshair");
                    //加载行政区处理以及显示插件
                    AMap.plugin(["AMap.DistrictSearch"], function(){//异步同时加载多个插件
                        resolve(map); 
                    });
                });
            });
        });
    }

    confirm () {
        const state: any = (this as any).state, props: any = (this as any).props;
        if (state.lat && state.lng) {
            props.confirm.call(this, {lat: state.lat, lng: state.lng});
        } 
        else if (props.lat && props.lng) {
            props.confirm.call(null, {lat: props.lat, lng: props.lng});
        }
        else {
            message.warning("请选择位置");
        }
    }

    cancel () {
        (this as any).props.cancel.call(null);
    }

    render (): any {
        const state = this.state;
        return (
            <div className="latlngselect-component-wrap">
                <Modal
                width={state.width}
                closable={false}
                maskClosable={false}
                title="选择经纬度坐标"
                visible={true}
                onOk={this.confirm.bind(this)}
                onCancel={this.cancel.bind(this)}
                >
                    <div style={{height: state.height + "px", width: "100%", position: "relative"}}>
                        <div className="latlngselect-component-wrap-warning-wrap">
                            <Alert message="请在绿色选区内选取位置" type="success"/>
                        </div>
                        <div style={{height: "100%", width: "100%"}} ref="map-container"></div>
                    </div>
                </Modal>
            </div>
        );
    }
}