/**
 * token操作
 */

import storage from "../../utils/storage.js";

let token = storage.get("TOKEN");

export default function (state = token, {type, playload}) {

    switch (type) {
        
        /**
         * 获取token
         */
        case "token/GET_TOKEN":
            token = storage.get("TOKEN") || "";
            return token;
            break;

        /**
         * 设置token 
         */
        case "token/SET_TOKEN":
            storage.set("TOKEN", playload);
            token = storage.get("TOKEN");
            return token;
            break;

        //删除token
        case "token/DEL_TOKEN":
            storage.del("TOKEN");
            token = "";
            return token;
            break;

        /**
         * 默认 
         */
        default:
            return state || "";

    }

}

