import React from "react";
import "./index.less";
import { Alert, Modal, message } from "antd";
import store from "../../../../store";

interface Props {
    lat?: string|number,
    lng?: string|number,
    close(): void
}

export default class BatteryPosition extends React.Component {

    map = null;

    pointerMarker = null;

    static defaultProps: Props = {
        lat: "",
        lng: "",
        close: () => {}
    }

    constructor (props) {
        super(props);
    }

    state = {
        lat: "",
        lng: "",
        height: 0,
    }

    componentDidMount () {
        this.init();
    }

    async init () {
        this.initUseStore();
        this.map = await this.initMap();
        this.drawPointer((this as any).props.lat, (this as any).props.lng);
    }

    initUseStore () {
        const f = () => {
            this.setState({height: store.getState().layout.contentHieght});
        }
        f();
        store.subscribe(f);
    }

    //绘制定位点，并显示经纬度
    drawPointer (lat?: number|string, lng?:string|number) {
        if (!lat || !lng) return;
        const map: any = this.map;
        if (this.pointerMarker) map.remove(this.pointerMarker); 
        const content = '<img style="height: 30px" src="./public/img/电池.png"/>'; //暂定30px宽高
        const marker = this.pointerMarker = new AMap.Marker({
            content: content, 
            position:  [lng, lat],
            offset: new AMap.Pixel(-15, -15) 
        });
        map.add(marker);
        // 地图自适应
        map.setFitView();
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
                    resolve(map);
                });
            });
        });
    }

    close () {
        (this as any).props.close.call(null);
    }

    render (): any {
        const state = this.state;
        return (
            <div className="batteryposition-component-wrap">
                <Modal
                width={"80%"}
                // closable={false}
                maskClosable={false}
                title="电池位置"
                visible={true}
                // onOk={this.confirm.bind(this)}
                onCancel={this.close.bind(this)}
                footer={null}
                >
                    <div style={{height: state.height + "px", width: "100%", position: "relative"}}>
                        {/* <div className="batteryposition-component-wrap-warning-wrap">
                            <Alert message="请在绿色选区内选取位置" type="success"/>
                        </div> */}
                        <div style={{height: "100%", width: "100%"}} ref="map-container"></div>
                    </div>
                </Modal>
            </div>
        );
    }
}