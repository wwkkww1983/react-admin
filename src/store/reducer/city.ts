/**
 * 城市数据数据
 */

import storage from "../../utils/storage.js";

export default function (state, {type, playload}) {

    switch (type) {
        
        /**
         * 设置嵌套
         */
        case "city/SET":
            storage.set("CITY_DATA", playload);
            state = storage.get("CITY_DATA");
            return state;

        /**
         * 默认 
         */
        default:
            state = storage.get("CITY_DATA");
            return state || [];
    }

}

