/**
 * 外置方法 
 */

class F {

    //用于绑定上下文，传入上下文
    __bind (context) {
        for (let key in this) {
            if (key !== "__bind" && typeof this[key] === "function") {
                this[key] = (this as any)[key].bind(context);
            }
        }
        Object.assign(this, context);
    }

    test () {
        alert((this as any).name);
    }

    sayName () {
        return (this as any).name;
    }
}

export default new F();