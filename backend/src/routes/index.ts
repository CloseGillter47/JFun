import { Context, Middleware } from "koa";
import * as Router from "koa-router";
import { BaseRoute } from "./route";

export class IndexRoute extends BaseRoute {

    public static create() {
        //log
        console.log("[IndexRoute::create] Creating index route.");

        let router = new Router();

        router.prefix('/index');

        //add home page route
        router.get("/", async (ctx: Context, next: Middleware) => {
            await new IndexRoute().index(ctx, next);
        });

        router.get("/string", async (ctx: Context, next: Middleware) => {
            await new IndexRoute().string(ctx, next);
        });

        router.get("/json", async (ctx: Context, next: Middleware) => {
            await new IndexRoute().json(ctx, next);
        });

        return router;
    }

    constructor() {
        super();
    }

    private async index(ctx: Context, next: Middleware) {
        await ctx.render('index', {
            title: 'Hello Koa 2!'
        });
    }

    private async string(ctx: Context, next: Middleware) {
        ctx.body = 'koa2 string';
    }

    private async json(ctx: Context, next: Middleware) {
        ctx.body = {
            title: 'koa2 json'
        };
    }
}