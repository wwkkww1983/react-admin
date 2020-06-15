# Scan类专门扫描目录的类

扫描类，并通过一些列事件传递扫描到的数据。

## 方法
Scan.prototype.scan(dirpath: string);

## 事件
*data事件*
Scan.prototype.on("data", (ScanFile|ScanDir) => {})

*file事件*
Scan.prototype.on("file", (ScanFile) => {})

*dir事件*
Scan.prototype.on("dir", (ScanDir) => {})

*end事件*
Scan.prototype.on("end", () => {})


## 测试用例
先安全局装mocha，```npm install -g mocha```   
然后执行```npm run test```   
结果：  
```
  Scan类测试套件
    √ data事件及数据测试用例
    √ file事件及数据测试用例
    √ dir事件及数据测试用例


  3 passing (10ms)
```

