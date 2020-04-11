import React from "react";
import "./index.less";
import { Alert } from "antd";

interface latlng {
    lat: number|string,
    lng: number|string
}

interface Props {
    latlngs: latlng[],
    pointIconUrl: string
}

export default class Home extends React.Component {

    static defaultProps: Props = {
        //位置数组
        latlngs: [],
        //位置图表url
        pointIconUrl: ""
    }

    constructor (props) {
        super(props);
    }

    state = {
        latlngs: [],
        map: null,
        //已经绘制的点集合
        marks: [],
        //警告提示语
        warningText: "",
    }

    componentWillReceiveProps (props) {
        //只要有更新，就重新绘制，就是这么简洁
        (this as any).state.latlngs = props.latlngs;
        this.drawAllPoint();
    }

    componentDidMount () {
        this.init();
    }

    async init () {
        (this as any).state.latlngs = (this as any).props.latlngs;
        this.state.map = await this.initMap();
        this.drawAllPoint();
    }

    /**
     * 初始化地图 
     */
    initMap () {
        return new Promise((resolve, reject) => {
            const map = new AMap.Map((this as any).refs["map-container"], {
                zoom: 4,//级别
                center: [116.397428, 39.90923],//中心点坐标
                viewMode:'2D',//使用3D视图
                mapStyle: 'amap://styles/whitesmoke', //设置地图的显示样式
            });
            map.on("complete", () => {
                resolve(map);
            });
        });
    }

    //构建点并返回
    buildPoint (item: latlng) {
        const html = `
            <img class="point-icon" src="${(this as any).props.pointIconUrl}"/>
        `;
        const marker = new AMap.Marker({
            content: html,  // 自定义点标记覆盖物内容
            position:  [item.lng, item.lat], // 基点位置
            offset: new AMap.Pixel(-40, 0) // 相对于基点的偏移位置
        });
        return marker;
    }

    //绘制所有点
    drawAllPoint () {
        this.removeAllPoint();
        const marks: any[] = (this as any).state.marks = (this as any).state.latlngs.filter((item: latlng) => item.lat && item.lng).map((item: latlng): any => this.buildPoint(item));
        marks.forEach(mark => (this as any).state.map.add(mark));
        //没有位置的点有几个，并显示警告语
        if (marks.length !== (this as any).state.latlngs.length) {
            this.setState({warningText: `共${(this as any).state.latlngs.length}个点位，有${(this as any).state.latlngs.length - marks.length}个点没有位置信息，无法在地图上标识；建议前往表格视图`});
        }
    }
    
    //删除所有点
    removeAllPoint () {
        (this as any).state.marks.forEach(mark => {
            (this as any).state.map.remove(mark);
        });
    }

    render (): any {
        const state = this.state;
        return (
            <div className="deviceinmap-component-wrap">
                {state.warningText && <div className="warning-wrap">
                    <Alert message={state.warningText} type="warning" showIcon />
                </div>}
                <div style={{height: "100%", width: "100%"}} ref="map-container"></div>
            </div>
        );
    }
}