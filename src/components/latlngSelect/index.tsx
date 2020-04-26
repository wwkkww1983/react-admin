import React from "react";
import "./index.less";
import { Alert, Modal } from "antd";
import store from "../../store";

interface Props {
    lat?: string|number,
    lng?: string|number,
    province: string,
    city: string,
    district: string
}

export default class Home extends React.Component {

    map = null;

    pointerMarker = null;

    static defaultProps: Props = {
        lat: "",
        lng: "",
        province: "",
        city: "",
        district: ""
    }

    constructor (props) {
        super(props);
    }

    state = {
        latlngs: [],
        map: null,
        height: 0,
        width: 0,
        //已经绘制的点集合
        marks: [],
        //警告提示语
        warningText: "",
    }

    componentWillReceiveProps (props) {
        //只要有更新，就重新绘制，就是这么简洁
        // (this as any).state.latlngs = props.latlngs;
        // this.drawAllPoint();
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
                        polygons.push(polygon)
                    }
                    // 地图自适应
                    console.log(map);
                    map.setFitView();
                }
            }
        );
    }

    //绘制定位点，并显示经纬度
    drawPointer () {
        const map: any = this.map;
        if (this.pointerMarker) map.remove(this.pointerMarker); 
        const content = '<img style="height: 30px" src="./public/img/我的位置.png"/>'; //暂定30px宽高
        const marker = this.pointerMarker = new AMap.Marker({
            content: content, 
            position:  [116.397428, 39.90923],
            // offset: new AMap.Pixel(-17, -42) 
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
                    center: [116.397428, 39.90923],//中心点坐标
                    viewMode:'2D',//使用3D视图
                    mapStyle: 'amap://styles/whitesmoke', //设置地图的显示样式
                });
                map.on("complete", () => {
                    //加载行政区处理以及显示插件
                    // map.plugin(new AMap.DistrictSearch());
                    AMap.plugin(["AMap.DistrictSearch"], function(){//异步同时加载多个插件
                        resolve(map); 
                    });
                });
            });
        });
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
                onOk={() => {}}
                onCancel={() => {}}
                >
                    <div style={{height: state.height + "px", width: "100%"}}>
                        <div style={{height: "100%", width: "100%"}} ref="map-container"></div>
                    </div>
                </Modal>
            </div>
        );
    }
}