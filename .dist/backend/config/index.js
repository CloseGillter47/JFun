"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_dev_1 = require("./app.dev");
const app_test_1 = require("./app.test");
//根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
exports.default = {
    development: app_dev_1.default,
    test: app_test_1.default
}[process.env.NODE_ENV || 'development'];
