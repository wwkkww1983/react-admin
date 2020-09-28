/**
 * 新增代理商所需数据结构 
 */
export class AgentData {
    static defaultOptions = {
        leshua: {
            config: {
                merchantId: "",
                key: ""
            }
        },                              
        name:     "",
        phone:    "",
        regions: [] //内部元素为AreaRow类的实例
    }
    constructor () {
        Object.keys(AgentData.defaultOptions).forEach(k => this[k] = AgentData.defaultOptions[k]);
    }
}

/**
 * 针对新增、编辑弹窗多行地址选择提供选择数据的行的类 
 */
export class AreaDict {
    static defaultOptions = {
         //下面三者里边的元素为接口返回的的地区数据节点集合
        provinces: [],
        citys: [],
        districts: []
    }
    constructor (options) {
        Object.keys(AreaDict.defaultOptions).forEach(k => this[k] = options[k] ? options[k] :AreaDict.defaultOptions[k]);
    }
    clearCitys () {
        (this as any).citys = [];
    }
    clearDistricts () {
        (this as any).districts = [];
    }
    setCitys (provinceName) {   
        const _ = (this as any).provinces.find(item => item.name === provinceName);
        (this as any).citys = _.children;
    }
    setDistricts (cityName) {
        const _ = (this as any).citys.find(item => item.name === cityName);
        (this as any).districts = _.children;
    }
    getDistrict (districtName) {
        return (this as any).districts.find(item => item.name === districtName);
    }
}


/**
 * 新增、编辑对航地区数据类 
 */
export class AreaRow {
    static defaultOptions = {
        "cityCode": "",// 城市编码
        "adCode": "",// 区域编码
        "province": undefined,// 省
        "city": undefined,// 市
        "district": undefined,// 区
        "address": ""// 详细地址
    }
    static checkMessage = {
        "province": "省没有选择",// 省
        "city": "市没有选择",// 市
        "district": "区/县没有选择",// 区
        "address": "详细地址没有填写"// 详细地址
    }
    constructor (options) {
        Object.keys(AreaRow.defaultOptions).forEach(k => this[k] = options && options[k] ? options[k] :AreaRow.defaultOptions[k]);
    }
    check () {
        for (let k of Object.keys(AreaRow.checkMessage)) {
            if (!this[k]) return AreaRow.checkMessage[k];
        }
        return false;
    }
    getData () {
        let obj = Object.create(null);
        Object.keys(AreaRow.defaultOptions).forEach(k => obj[k] = this[k]);
        return obj;
    }
}