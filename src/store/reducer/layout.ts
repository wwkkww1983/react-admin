/**
 * 布局相关全局状态， 将来可能包含动态菜单配置，动态路由配置
 */

import config from "../../config/index.config.js";
import menus from "../../config/menus.config.js";

let layout = {
    title: config.title,
    copyright: config.copyright,
    asideMenus: {
        fold: false,
        menus
    },
    contentHieght: 0,
};

export default function (state = layout, {type, playload}) {

    switch (type) {

        /**
         * 操作侧边菜单是否收起 
         */
        case "layout/SET_ASIDE_MENUS":
            state.asideMenus.fold = playload;
            return state;
            break;

        /**
         * 设置content高度 
         */
        case "layout/SET_CONTENT_HEIGHT":
            state.contentHieght = playload;
            return state;
            break;

        /**
         * 默认 
         */
        default:
            return state;
    }

}

