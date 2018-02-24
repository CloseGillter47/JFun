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
        message += `\t request method:\t\t${method}  \n`;

        // 请求地址
        message += `\t request url:\t\t\t${ctx.href}  \n`;

        // 请求原始地址
        message += `\t request originalUrl:\t${req.originalUrl}  \n`;

        // 客户端ip
        message += `\t request client ip:\t\t${req.ip}  \n`;

        switch (method) {

            case "GET":
                message += `\t request query:\t\t\t${JSON.stringify(req.query)}  \n`;
                break;

            case "POST":
                message += `\t request body: \n\t${JSON.stringify(req.body)}  \n`;
                break;

            default:
                message += `\t request body: \n\t${JSON.stringify(req.body)}  \n`;
                break;
        }

        // 服务器响应时间
        message += `\t response time:\t\t\t${ms} ms  \n`;

        return message.toString();
    }

    private formatInforLog(ctx: Context, ms: number) {

        let message = new String();

        // 开始记录响应日志
        message += `\n --------------- response log start --------------- \n`;

        // 记录响应的内容
        message += this.formatRequest(ctx, ms);

        //响应状态码
        message += `\t response status:\t\t${ctx.status}  \n`;

        // 响应内容 (PS.个人觉得这个只能在开发调试模式下返回，生产环境应该去掉)
        message += `\t response body: \n\t${JSON.stringify(ctx.body)}  \n`;

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
        message += `\t err name:\t\t${err.name}  \n`;

        //错误信息
        message += `\t err message:\t\t${err.message}  \n`;

        //错误详情
        message += `\t err stack:\t\t${err.stack}  \n`;

        // 结束记录错误日志
        message += `\n ===============   error log end    =============== \n`;

        return message.toString();
    }
}