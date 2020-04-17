import React from "react";
import "./less/index.less";

//引入外置方法
import f from "./methods";

//模拟上下文
let context = {
    name: "王德发"
}

function NotFound () {
    
    //初始化外置方法，绑定上下文， 这里的上下文取的上面的模拟上下文
    f.__bind(context);
    
    return (
        <div>
            <h1 onClick={f.test}>我的名字叫：{f.sayName()}</h1>
        </div>
    );
}

export default NotFound;