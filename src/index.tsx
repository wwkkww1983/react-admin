import React from 'react';
import ReactDOM from 'react-dom';

//必要样式
import './index.less';
import 'antd/dist/antd.css';
import "./assets/iconfont/iconfont.css";

//图标样式
// import './assets/style.css'

//路由相关
import routes from './router/index';
import MyRouter from "./components/my-router";

//store
import store from "./store";

/**
 * 启动初始化
 */
!async function () {
    
	//全局store测试
	// let index = 1;
	// setInterval(() => {
	// 	store.dispatch({type: "message/SET_MESSAGE", playload: index ++});
	// 	index === 99 && (index = 0);
    // }, 1000);
    
    ReactDOM.render(
        <MyRouter name="根路由" routes={routes} transition={true} changeRules={["login"]}/>
    , document.getElementById('root'));

}();