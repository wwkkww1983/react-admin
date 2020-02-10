/**
 * 表单输入绑定
 * 
 * @param {String} target 目标
 */
export function input (target, { target: { value } }) {
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