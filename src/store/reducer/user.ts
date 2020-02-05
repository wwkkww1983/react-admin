/**
 * user 全局状态 
 */

import storage from "../../utils/storage.js";
let user = storage.get("USER_INFO");

export default function (state = user, {type, playload}) {
    switch (type) {

        //设置用户信息
        case "user/SET_USER":
            storage.set("USER_INFO", playload);
            user = storage.get("USER_INFO");
            return user;
        break;

        //删除用户信息
        case "user/DEL_USER":
            storage.del("USER_INFO");
            user = storage.get("USER_INFO");
            return user || null;
        break;

        //默认
        default:
            return user || null;
    }
}