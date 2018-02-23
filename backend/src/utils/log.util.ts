import * as log4js from "log4js";
import * as fs from "fs";
import { Context, Request } from "koa";

import config from "../config/log.config";

export class Logger {

    public config: any;

    constructor() {
        this.init(config);
    }

    /**
     * 记录错误的日志
     * @param ctx koa的上下文
     * @param err error对象
     * @param ms 响应的时间(ms)
     */
    public error(ctx: Context, err: Error, ms: number) {
        if (ctx && err) { log4js.getLogger('[errors]').error(this.formatErrorLog(ctx, err, ms)); }
    }

    /**
     * 记录正常的日志
     * @param ctx koa的上下文
     * @param ms 响应的时间(ms)
     */
    public infor(ctx: Context, ms: number) {
        if (ctx) { log4js.getLogger('[server]').info(this.formatInforLog(ctx, ms)); }
    }

    /**
     * 输出到控制台
     * @param ctx koa的上下文
     * @param mes 传达的内容
     * @param ms 响应的时间(ms)
     */
    public console(mes: string) {
        log4js.getLogger('[console]').info(mes);
    }

    private async init(config: log4js.Configuration) {

        this.config = config;

        log4js.configure(config);

        // for (let i in config.appenders) {
        //     if (config.appenders[i]['filename']) {
        //         if (config.appenders[i]["alwaysIncludePattern"] && config.appenders[i]["pattern"]) {
        //             let pattern = config.appenders[i]["pattern"];
        //             pattern.replace(/yyyy/g, new Date().getFullYear());
        //             pattern.replace(/MM/g, new Date().getMonth() + 1);
        //             pattern.replace(/dd/g, new Date().getDate());
        //             await this.check(config.appenders[i]['filename'] + pattern);
        //         } else {
        //             await this.check(config.appenders[i]['filename']);
        //         }
        //     }
        // }
    }

    private check(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    private formatRequest(ctx: Context, ms: number) {

        let message = new String();

        let req = ctx.request;

        let headers = ctx.headers;
      
        const method = req.method;
        // 请求方法
        message += `  request method:         ${method}  \n`;

        // 请求地址
        message += `  request url:            ${ctx.href}  \n`;

        // 请求原始地址
        message += `  request originalUrl:    ${req.originalUrl}  \n`;

        // 客户端ip
        message += `  request client ip:      ${req.ip}  \n`;

        switch (method) {

            case "GET":
                message += `  request query:          ${JSON.stringify(req.query)}  \n`;
                break;

            case "POST":
                message += `  request body: \n ${JSON.stringify(req.body)}  \n`;
                break;

            default:
                message += `  request body: \n ${JSON.stringify(req.body)}  \n`;
                break;
        }

        // 服务器响应时间
        message += `  response time:          ${ms} ms  \n`;

        return message.toString();
    }

    private formatInforLog(ctx: Context, ms: number) {

        let message = new String();

        // 开始记录响应日志
        message += `\n --------------- response log start --------------- \n`;

        // 记录响应的内容
        message += this.formatRequest(ctx, ms);

        //响应状态码
        message += `  response status:        ${ctx.status}  \n`;

        // 响应内容 (PS.个人觉得这个只能在开发调试模式下返回，生产环境应该去掉)
        message += `  response body: \n ${JSON.stringify(ctx.body)}  \n`;

        // 结束记录响应日志
        message += `\n ---------------  response log end  --------------- \n`;

        return message.toString();
    }

    private formatErrorLog(ctx: Context, err: Error, ms: number) {

        let message = new String();

        // 开始记录错误日志
        message += `\n ===============  error log start   =============== \n`;

        // 记录响应的内容
        message += this.formatRequest(ctx, ms);

        //错误名称
        message += `  err name:           ${err.name}  \n`;

        //错误信息
        message += `  err message:        ${err.message}  \n`;

        //错误详情
        message += `  err stack:          ${err.stack}  \n`;

        // 结束记录错误日志
        message += `\n ===============   error log end    =============== \n`;

        return message.toString();
    }
}