import request from '../utils/request';

/**
 * 加载嵌套城市信息，省、市、区
 */
export function getCityDeepList () {
    return request({
        url: "/region/assoc",
        method: "GET"
    });
}
