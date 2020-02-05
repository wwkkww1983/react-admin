/*
 * @Author: hua
 * @Date: 2019-12-23 10:26:09
 * @description: 
 * @LastEditors  : hua
 * @LastEditTime : 2019-12-23 13:30:20
 */

import request from '../utils/request';

//登录
export function login({username, password}) {
    return request({
        url: '/account/admin/auth/login',
        method: 'POST',
        data: {username, password}
    });
}