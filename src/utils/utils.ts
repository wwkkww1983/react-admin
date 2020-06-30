import { History } from "../components/my-router/index";

/**
 * 表单输入绑定
 * 
 * @param {String} target 目标
 * @param {*} e 可以是事件，也可以是值
 */
export function input (target, e: any) {
    let value;
    if (e instanceof Object && "stopPropagation" in e && typeof e["stopPropagation"] === "function") {
        value = e.target.value;
    } else {
        value = e;
    }
    const arr = handleTarget(target);
    let _ = this.state;
    for (let i = 0; i < arr.length - 1; i ++) {
        if (/^\d+$/g.test(arr[i])) {
            _ = _[Number(arr[i])];
        } else {
            _ = _[arr[i]];
        }
    }
    //处理最后一个赋值
    if (/^\d+$/g.test(arr[arr.length - 1])) {
        _[Number(arr[arr.length - 1])] = value;
    } else {
        _[arr[arr.length - 1]] = value;
    }
    this.setState({});
    //处理target链
    function handleTarget (target) {
        const arr = target.split(".");
        for (let i = 0; i < arr.length; i ++) {
            let c = arr[i];
            if (/(?:\[\d\])/.test(c)) {
                const cArr = c.replace(/[\[\]]/g, "+").replace(/\+{2,}/g, "+").split("+").filter(i => i);
                arr.splice(i, 1, ...cArr);
                i += cArr.length - 1;
            }
        }
        return arr;
    }
}

/**
 * 时间戳转日期字符串 
 * 
 * @param {String} time 时间戳
 * @param {String} spacing 间隔符
 * @return {String}
 */
export function timeToDateStr (time: string|number, spacing: string = "\/"): string {
    const obj = new Date(Number(time));
    let str = "";
    str += obj.getFullYear() + spacing;
    str += (obj.getMonth() + 1 < 10 ? "0" + (obj.getMonth() + 1) : obj.getMonth() + 1) + spacing;
    str += obj.getDate() < 10 ? "0" + obj.getDate() : obj.getDate();
    return str;
}

/**
 * 初始化生命周期 
 */
export function initLife (context: any, $onLoad: any, $onShow?: any) {
    let 
    inited = false, 
    allowShow = true,
    func = () => {
        if ((context as any).props.route.path === location.pathname) {
            if (!inited) {
                inited = true;
                $onLoad.call(context);
            }
            if (allowShow && $onShow) {
                allowShow = false;
                setTimeout(() => {
                    allowShow = true;
                }, 200);
                $onShow.call(context);
            }
        }
    };
    func();
    (History as any).on("change", func);
}

/**
 * 属性获取，没有则返回指定替代值 
 * 
 * @param {Object} origin 对象类型
 * @param {String} target 目标字符串，如obj.a[3].name这样
 * @param {*} replace 没有的时候替换返回值
 * @return {*} 没有找到则返回replace
 */
export function property (origin, target, replace: any = "-") {
    const numberArr = target.match(/\[[0-9]\]/g);
    Array.isArray(numberArr) && numberArr.forEach(numberStr => {
        target = target.replace(numberStr, numberStr.replace(/(?:\[|\])/g, "."));
    }); 
    const targetArr = target.split(".").filter(item => item);
    for (let i = 0; i < targetArr.length; i++) {
        const key = targetArr[i];
        if (i < targetArr.length - 1) {
            if (!origin[key]) return replace;
            origin = origin[key];
        } else {
            return origin[key] ? origin[key] : replace;
        }
    }
}