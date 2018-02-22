import * as log4js from "log4js";
import * as fs from "fs";
import { Context, Request } from "koa";

import config from "../config/log.config";

export class Logger {

    private errorLogger: any;

    private resLogger: any;

    public config: any;

    constructor() {
        let _config = <log4js.Configuration>{};
        Object.assign(_config, config);
        log4js.configure(_config);
        this.init(_config);

        this.errorLogger = log4js.getLogger('errorLogger');
        this.resLogger = log4js.getLogger('resLogger');
    }

    /**
     * 记录错误的日志
     * @param ctx koa的上下文
     * @param err error对象
     * @param ms 响应的时间(ms)
     */
    public error(ctx: Context, err: Error, ms: number) {
        if (ctx && err) { this.errorLogger.error(this.formatErrorLog(ctx, err, ms)); }
    }

    /**
     * 记录正常的日志
     * @param ctx koa的上下文
     * @param ms 响应的时间(ms)
     */
    public infor(ctx: Context, ms: number) {
        if (ctx) { this.resLogger.infor(this.formatInforLog(ctx, ms)); }
    }

    private init(config: log4js.Configuration) {

        this.config = config;

        if (config['baseLogPath']) {

            if (!fs.existsSync(config['baseLogPath'])) { fs.mkdirSync(config['baseLogPath']); }

            if (config.appenders) {

                for (let i in config.appenders) {

                }
            }
        }
    }
    private formatRequest(req: Request, ms: number) {

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

    private formatInforLog(ctx: Context, ms: number) {

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

    private formatErrorLog(ctx: Context, err: Error, ms: number) {

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