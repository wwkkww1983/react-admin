"use strict"

const utils = require("./utils");
const $path = require("path");
const fs = require("fs");

class ScanItem {
    constructor (path, deep) {
        this.path = path;
        this.deep = deep;
    }
}

class ScanFile extends ScanItem {
    constructor (path, deep) {
        super(path, deep);
        this.name = "";
        this.ext = "";
        this.size = "";
        this._init(path);
    }
    _init (path) {
        const { name, ext } = $path.parse(path);
        this.name = name;
        this.ext = ext;
        this.size = fs.statSync(path).size;
    }
}

class ScanDir extends ScanItem {
    constructor (path, deep) {
        super(path, deep);
        this.name = "";
        this._init(path);
    }
    _init (path) {
        this.name = path.split($path.sep).pop();
    }
}

class ScanEvent {
    constructor () {
        this._events = {
            "file": [],
            "dir": [],
            "data": [],
            "end": []
        }
    }
    emit (eventname, data) {
        const events = this._events;
        events[eventname] && events[eventname].forEach(cb => cb(data));
    }
    on (eventname, cb) {
        const events = this._events;
        events[eventname] && events[eventname].push(cb);
    }
}

class Scan extends ScanEvent {
    constructor () {
        super();
    }
    scan (path) {
        path = $path.resolve(path);
        if (!fs.existsSync(path)) {
            utils.throw(`地址： “${path}” 不存在！`);
        }
        if (!fs.statSync(path).isDirectory()) {
            utils.throw(`地址：“${path}” 不是目录！`);
        }
        const paths = [];
        let deep = 0;
        const f = () => {
            const path = paths.join($path.sep);
            fs.readdirSync(path, {withFileTypes: true}).forEach(dirent => {
                if (dirent.isFile()) {
                    const scanFile = new ScanFile($path.join(path, dirent.name), deep);
                    this.emit("file", scanFile);
                    this.emit("data", scanFile);
                }
                if (dirent.isDirectory()) {
                    const scanDir = new ScanDir($path.join(path, dirent.name), deep);
                    this.emit("dir", scanDir);
                    this.emit("data", scanDir);
                    deep++;
                    paths.push(dirent.name);
                    f();
                    deep--;
                    paths.pop();
                }
            });
        }
        paths.push(path);
        f();
        this.emit("end", null);
    }
}

module.exports = Scan;