"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
const log_config_1 = require("../config/log.config");
log4js.configure(log_config_1.default);
class Logger {
    constructor() {
        this.errorLogger = log4js.getLogger('errorLogger');
        this.resLogger = log4js.getLogger('resLogger');
        this.init(log_config_1.default);
    }
    /**
     * 记录错误的日志
     * @param ctx koa的上下文
     * @param err error对象
     * @param ms 响应的时间(ms)
     */
    error(ctx, err, ms) {
        if (ctx && err) {
            this.errorLogger.error(this.formatErrorLog(ctx, err, ms));
        }
    }
    /**
     * 记录正常的日志
     * @param ctx koa的上下文
     * @param ms 响应的时间(ms)
     */
    infor(ctx, ms) {
        if (ctx) {
            this.resLogger.infor(this.formatInforLog(ctx, ms));
        }
    }
    init(config) {
        this.config = config;
        if (config.baseLogPath) {
        }
    }
    formatRequest(req, ms) {
        let message = new String();
        const method = req.method;
        // 请求方法
        message += `request method: ${method} \n`;
        // 请求原始地址
        message += `request originalUrl:  ${req.originalUrl} \n`;
        // 客户端ip
        message += `request client ip:  ${req.ip} \n`;
        switch (method) {
            case "GET":
                message += `request query:  ${JSON.stringify(req.query)} \n`;
                break;
            case "POST":
                message += `request body: \n ${JSON.stringify(req.body)} \n`;
                break;
            default:
                message += `request body: \n ${JSON.stringify(req.body)} \n`;
                break;
        }
        // 服务器响应时间
        message += `response time: ${ms} ms \n`;
        return message.toString();
    }
    formatInforLog(ctx, ms) {
        let message = new String();
        // 开始记录响应日志
        message += `\n --------------- response log start --------------- \n`;
        // 记录响应的内容
        message += this.formatRequest(ctx.request, ms);
        //响应状态码
        message += `response status: ${ctx.status} \n`;
        // 响应内容 (PS.个人觉得这个只能在开发调试模式下返回，生产环境应该去掉)
        message += `response body: \n ${JSON.stringify(ctx.body)} \n`;
        // 结束记录响应日志
        message += `\n ---------------  response log end  --------------- \n`;
        return message.toString();
    }
    formatErrorLog(ctx, err, ms) {
        let message = new String();
        // 开始记录错误日志
        message += `\n ===============  error log start   =============== \n`;
        // 记录响应的内容
        message += this.formatRequest(ctx.request, ms);
        //错误名称
        message += `err name: err.name \n`;
        //错误信息
        message += `err message: err.message \n`;
        //错误详情
        message += `err stack: err.stack \n`;
        // 结束记录错误日志
        message += `\n ===============   error log end    =============== \n`;
        return message.toString();
    }
}
exports.Logger = Logger;
