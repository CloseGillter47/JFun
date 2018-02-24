import * as Koa from "koa";
import * as views from "koa-views";
import * as json from "koa-json";
import * as bodyparser from "koa-bodyparser";
import * as logger from "koa-logger";
import * as Router from "koa-router";

const onerror = require('koa-onerror');

import * as path from "path";

import { Logger } from "./utils/log.util";

import { MSql as mysql } from "./mysql"

import { IndexRoute } from "./routes/index";
import { UserRoute } from "./routes/users";

const log = new Logger();

export class Server {

    public app: Koa;


    /**
     * 启动服务.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {

        this.app = new Koa();

        onerror(this.app);

        this.config();

        this.routes();

        this.api();

        // 错误处理
        this.app.on('error', (err, ctx) => {
            console.log('server error', err, ctx);
        });
    }

    public async config() {

        this.app.use(bodyparser({
            enableTypes: ['json', 'form', 'text']
        }));

        this.app.use(json());

        this.app.use(logger());

        this.app.use(require('koa-static')(__dirname + '/public'));

        this.app.use(views(__dirname + '/views', { extension: 'pug' }));

        // 自定义的日志
        this.app.use(async (ctx, next) => {

            //响应开始时间
            const start = +new Date();

            //响应间隔时间
            let ms: number;

            // 后面的中间件有异常都可以在这集中处理
            try {

                await next();

                ms = +new Date() - start;

                log.infor(ctx, ms);

            } catch (error) {

                ms = +new Date() - start;

                log.error(ctx, error, ms);
            }
        });

        try {

            let res = await mysql.query('SELECT 1 + 1 AS solution');

            console.log(res);

        } catch (error) {

            console.log(error);
        }

    }

    public routes() {

        let router = new Router();

        router.get("/", async (ctx: Koa.Context, next: Koa.Middleware) => {
            await ctx.render('index', {
                title: 'Hello Koa 2! :)'
            });
        });

        this.app.use(router.routes());
    }

    public api() {

        let indexRouter = IndexRoute.create();

        let userRouter = UserRoute.create();

        this.app.use(indexRouter.routes());

        this.app.use(indexRouter.allowedMethods());

        this.app.use(userRouter.routes());

        this.app.use(userRouter.allowedMethods());
    }
}