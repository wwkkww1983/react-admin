/**
 * 左侧菜单配置
 */

export default [
    {
        icon: "icon-yibiaopan",
        title: "首页",
        path: "/"
    },
    {
        icon: "icon-yonghu",
        title: "用户管理",
        path: "/userManage"
    },
    {
        icon: "icon-xinxinicon",
        title: "运维人员管理",
        path: "/OPSManage"
    },
    {
        icon: "icon-Group-",
        title: "设备管理",
        children: [
            // {
            //     icon: "icon-dianchi",
            //     title: "电池管理",
            //     path: "/batteryManage"
            // },
            {
                icon: "icon-dianchi",
                title: "电池管理JT808",
                path: "/batteryManage-jt808"
            },
            {
                icon: "icon-iconset0499",
                title: "换电柜管理",
                path: "/boxManage"
            },
            {
                icon: "icon-chongdianzhuang",
                title: "充电站管理",
                path: "/chargePileManage"
            }
        ]
    },
    {
        icon: "icon-xiangmu",
        title: "项目管理",
        path: "/projectManage"
    },
    {
        icon: "icon-shezhi_huaban",
        title: "系统设置",
        children: [
            {
                icon: "icon-icon-jichushezhi",
                title: "基础设置",
                path: "/baseSetting"
            },
            {
                icon: "icon-wulianwang",
                title: "物联网平台设置",
                path: "/platformSetting"
            },
            {
                icon: "icon-shengban-shengji",
                title: "升级设置",
                path: "/updateSetting"
            },
            {
                icon: "icon-qianbao",
                title: "钱包设置",
                path: "/walletSetting"
            },
            {
                icon: "icon-dianchi",
                title: "虚拟电池设置",
                path: "/batterySetting"
            },
            {
                icon: "icon-chongdianzhuang",
                title: "充电桩设置",
                path: "/pileSetting"
            },
            {
                icon: "icon-nfc",
                title: "NFC设置",
                path: "/nfcSetting"
            }
        ]
    },
    {
        title: "NFC管理",
        icon: "icon-nfc",
        path: "/nfc"
    },
    {
        title: "订单管理",
        icon: "icon-order",
        path: "/orderManage"
    },
    {
        title: "代理商管理",
        icon: "icon-dailishang",
        children: [
            {
                icon: "icon-dailishang1",
                title: "代理商",
                path: "/agent"
            },
            {
                icon: "icon-mendianguanli",
                title: "门店",
                path: "/store"
            },
            {
                icon: "icon-yuangong",
                title: "员工",
                path: "/staff"
            }
        ]
    },
    {
        title: "商城管理",
        icon: "icon-mendianguanli",
        children: [
            {
                icon: "icon-product-brand",
                title: "商城产品",
                path: "/shopProduct"
            },
            {
                icon: "icon-order",
                title: "订单管理",
                path: "/shopOrder"
            }
        ]
    }
]

/**
 * 测试用的菜单配置 
 */
export const testMenus = [
    {
        icon: "icon-guanbi",
        title: "首页",
        path: "/"
    },
    {
        icon: "icon-yonghu",
        title: "用户管理",
        path: "/userManage"
    },
    {
        icon: "icon-weixiu",
        title: "运维人员管理",
        path: "/OPSManage"
    },
    {
        icon: "icon-guanbi",
        title: "测试展开1",
        children: [
            {
                icon: "icon-dianchi",
                title: "电池管理",
                path: "/batteryManage"
            },
            {
                icon: "icon-iconset0499",
                title: "测试展开2",
                children: [
                    {
                        icon: "icon-dianchi",
                        title: "测试3",
                        path: "/test3"
                    },
                    {
                        icon: "icon-guanbi",
                        title: "充电柜管理",
                        path: "/boxManage"
                    }
                ]
            }
        ]
    }
]