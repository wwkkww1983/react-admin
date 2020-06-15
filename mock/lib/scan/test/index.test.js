var assert = require('assert');
const Scan = require("../index");

describe('Scan类测试套件', function() {
  it("data事件及数据测试用例", function (done) {
    const scan = new Scan();
    const result = [];
    scan.on("data", data => result.push(data));
    scan.on("end", () => {
      assert.ok(result.length && result.length > 0 && result[0].name && result[0].deep !== undefined);
      done();
    });
    scan.scan("./");
  });
  it("file事件及数据测试用例", function (done) {
    const scan = new Scan();
    const result = [];
    scan.on("file", data => result.push(data));
    scan.on("end", () => {
      assert.ok(result.length && result.length > 0 && result[0].name && result[0].deep !== undefined && result[0].path && result[0].ext !== undefined);
      done();
    });
    scan.scan("./");
  });
  it ("dir事件及数据测试用例", function (done) {
    const scan = new Scan();
    const result = [];
    scan.on("dir", data => result.push(data));
    scan.on("end", () => {
      assert.ok(result.length && result.length > 0 && result[0].name && result[0].deep !== undefined && result[0].path);
      done();
    });
    scan.scan("./");
  });
});