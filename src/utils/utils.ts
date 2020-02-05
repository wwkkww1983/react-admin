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