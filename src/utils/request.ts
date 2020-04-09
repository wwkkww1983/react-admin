import axios from 'axios';
import store from "../store";
import { message } from "antd";
import { History } from "../components/my-router";

// 创建axios实例
const service = axios.create({
	baseURL: _ENV_.HOST,
	timeout: _ENV_.AJAX_TIME_OUT
})

// request拦截器
service.interceptors.request.use(
	config => {
		const token: string = store.getState().token;
		if (token) config.headers['Authorization'] = "Bearer " + token;
		return config;
	}, 
	error => {
		console.log(error);
		Promise.reject(error);
	}
);

// respone拦截器
service.interceptors.response.use(
	({ data: res }) => {
		// 请求成功
		if (res.code === 0) {
			return res;
		}
		// Token鉴权失败
		if (res.code === 11001) {
			store.dispatch({type: "token/DEL_TOKEN"});
			History.replace({path: "/"});
		}
		message.error(res.message);
		return Promise.reject('error');
	},
	error => {

		/* 网络超时处理 */
		if (error == `Error: timeout of ${_ENV_.AJAX_TIME_OUT}ms exceeded`) {
			alert("网络超时");
			return Promise.reject('error')
		}
		/* 网络无响应处理 */
		if(typeof(error.response) == 'undefined'){
			if(error == 'Error: Network Error'){
			alert("网络错误,请检查网络");
			return Promise.reject('error')
			}
		}
		/* 权限错误 */
		/* if(error.response.status == 401){
			Toast({mes:error.response.data.msg, icon: 'error'})
			window.localStorage.removeItem('token')
			router.push({name:'403'})
			return Promise.reject('error')
		} */

		return Promise.reject(error)
	}
)

export default service;
