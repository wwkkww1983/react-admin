"use strict"

const Scan  = require("./scan");
const config = require("../config");
const { moduleDir } = config;

module.exports = async function index (app) {
    const registerRouters = [
        // {method: "", path: ""}
    ];
    const obj = await getAll(moduleDir);
    Object.keys(obj).forEach(key => {
        const method = key.split(" ")[0].toLocaleLowerCase(), path = key.split(" ")[1];
        registerRouters.push({method, path});
        app[method](path, (req, res) => {
            const _ = obj[key](req, res, config);
            if (_ && !(_ instanceof Promise)) {
                res.json(_);
            }
        });
    });
    return registerRouters;
}

function getAll (path) {
    let obj = {};
    return new Promise((resolve, reject) => {
        const scan = new Scan();
        scan.on("file", scanfile => {
            if (scanfile.ext === ".js") {
                const o = require(scanfile.path);
                Object.keys(o).forEach(item => {
                    console.log(`挂载：${item}`);
                    obj[item] = o[item];
                });
            }
        });
        scan.on("end", () => resolve(obj));
        scan.scan(path);
    });
}