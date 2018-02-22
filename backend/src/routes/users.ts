import { Context, Middleware } from "koa";
import * as Router from "koa-router";
import { BaseRoute } from "./route";

export class UserRoute extends BaseRoute {

    public static create() {
        //log
        console.log("[UsersRoute::create] Creating users route.");

        let router = new Router();

        router.prefix('/users');

        //add home page route
        router.get("/", async (ctx: Context, next: Middleware) => {
            await new UserRoute().index(ctx, next);
        });

        router.get("/string", async (ctx: Context, next: Middleware) => {
            await new UserRoute().string(ctx, next);
        });

        router.get("/json", async (ctx: Context, next: Middleware) => {
            await new UserRoute().json(ctx, next);
        });

        return router;
    }

    constructor() {
        super();
    }

    private async index(ctx: Context, next: Middleware) {
        await ctx.render('index', {
            title: 'Hello Koa 2! usersApi'
        });
    }

    private async string(ctx: Context, next: Middleware) {
        ctx.body = 'koa2 string usersApi';
    }

    private async json(ctx: Context, next: Middleware) {
        ctx.body = {
            title: 'koa2 json usersApi'
        };
    }
}