const bodyParser = require("body-parser");
const app = require("express")();
const loadModules = require("./lib/loadModules");
const config = require("./config");
const { port } = config;
const http_proxy = require("http-proxy");

//已注册路由
let registerRouters = [];

//跨域
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

// mock请求参数打印
app.use((req, res, next) => {
    const path = req.path, method = req.method.toLowerCase();
    const is = registerRouters.find(item => item.path === path && item.method === method);
    if (is) {
        bodyParser.json()(req, res, next);
    } else {
        next();
        return;
    }
    if (req.method === "GET") {
        console.log(`===================> [GET] ${req.url}`);
        console.log(JSON.stringify(req.query, null, 2));
        console.log(`===================<\r\n`);
    }
    if (req.method === "POST") {
        console.log(`===================> [POST] ${req.url}`);
        console.log(JSON.stringify(req.body, null, 2));
        console.log(`===================>\r\n`);
    }
    
});

app.listen(port, async () => {

    //加载模块
    registerRouters =  await loadModules(app);

    //代理
    app.all("*", (req, res) => {
        console.log(`[mock 代理] [${req.method}] ${req.url}`);
        const proxy = http_proxy.createProxy({
            target: config.proxy,
            changeOrigin: true
        });
        proxy.web(req, res);
    });
    console.log(`mock服务运行于：${port} 端口...`);
});
