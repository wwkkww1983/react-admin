import axios from 'axios';
import store from "../store";
import { message } from "antd";

// 创建axios实例
const service = axios.create({
  baseURL: _ENV_.HOST, // api的base_url
  timeout: 5000// 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // config.headers['Authorization'] = 'Bearer '+ token // 让每个请求携带自定义token 请根据实际情况自行修改
    return config
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
		if (res.code === 401) {
			store.dispatch({type: "token/DEL_TOKEN"});
			return Promise.reject('error')
		}

		message.error(res.message);
		return Promise.reject('error');
	},
	error => {

		/* 网络超时处理 */
		if (error == 'Error: timeout of 5000ms exceeded') {
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
