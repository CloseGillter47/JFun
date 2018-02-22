"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const views = require("koa-views");
const json = require("koa-json");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const Router = require("koa-router");
const onerror = require('koa-onerror');
const log_util_1 = require("./utils/log.util");
const index_1 = require("./routes/index");
const users_1 = require("./routes/users");
const log = new log_util_1.Logger();
class Server {
    /**
     * 启动服务.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {} Returns the newly created injector for this app.
     */
    static bootstrap() {
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
    config() {
        this.app.use(bodyparser({
            enableTypes: ['json', 'form', 'text']
        }));
        this.app.use(json());
        this.app.use(logger());
        this.app.use(require('koa-static')(__dirname + '/public'));
        this.app.use(views(__dirname + '/views', { extension: 'pug' }));
        // 自定义的日志
        this.app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            //响应开始时间
            const start = +new Date();
            //响应间隔时间
            let ms;
            // 后面的中间件有异常都可以在这集中处理
            try {
                yield next();
                ms = +new Date() - start;
                log.infor(ctx, ms);
            }
            catch (error) {
                ms = +new Date() - start;
                log.error(ctx, error, ms);
            }
        }));
    }
    routes() {
        let router = new Router();
        router.get("/", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('index', {
                title: 'Hello Koa 2! :)'
            });
        }));
        this.app.use(router.routes());
    }
    api() {
        let indexRouter = index_1.IndexRoute.create();
        let userRouter = users_1.UserRoute.create();
        this.app.use(indexRouter.routes());
        this.app.use(indexRouter.allowedMethods());
        this.app.use(userRouter.routes());
        this.app.use(userRouter.allowedMethods());
    }
}
exports.Server = Server;
