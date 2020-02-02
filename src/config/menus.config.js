/**
 * 左侧菜单配置
 */

export default [
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