/**
 * 表单输入绑定
 * 
 * @param {String} target
 * @param {Object} event
 */
export function input (target, {target: {value}}) {
    if (target.indexOf(".") > -1) {
        const arr = target.split(".");
        let _ = this.state;
        for (let i = 0; i < arr.length; i ++) {
            if (i === arr.length - 1) break;
            _ = _[arr[i]];
        }
        _[arr[arr.length - 1]] = value;
    } else {
        this.state[target] = value;
    }
    this.setState({});
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