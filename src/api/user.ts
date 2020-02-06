import request from '../utils/request';

//登录
export function login ({username, password}) {
    return request({
        url: '/account/admin/auth/login',
        method: 'POST',
        data: {username, password}
    });
}