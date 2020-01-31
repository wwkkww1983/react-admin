/**
 * user 全局状态 
 */

import storage from "../../utils/storage.js";
let user = storage.get("USER");

export default function (state = user, {type, playload}) {
    switch (type) {
        case "user/SET_USER":
            storage.set("USER", playload);
            user = storage.get("USER");
            return user;
        break;
        case "user/DEL_USER":
            storage.del("USER");
            user = storage.get("USER");
            return user || null;
        break;
        default:
            return user || null;
    }
}