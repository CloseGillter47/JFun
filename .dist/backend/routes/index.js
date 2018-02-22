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
const Router = require("koa-router");
const route_1 = require("./route");
class IndexRoute extends route_1.BaseRoute {
    static create() {
        //log
        console.log("[IndexRoute::create] Creating index route.");
        let router = new Router();
        router.prefix('/index');
        //add home page route
        router.get("/", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            yield new IndexRoute().index(ctx, next);
        }));
        router.get("/string", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            yield new IndexRoute().string(ctx, next);
        }));
        router.get("/json", (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            yield new IndexRoute().json(ctx, next);
        }));
        return router;
    }
    constructor() {
        super();
    }
    index(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('index', {
                title: 'Hello Koa 2!'
            });
        });
    }
    string(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = 'koa2 string';
        });
    }
    json(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = {
                title: 'koa2 json'
            };
        });
    }
}
exports.IndexRoute = IndexRoute;
