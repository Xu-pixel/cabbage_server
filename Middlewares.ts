import { Status, Middleware } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { CabbageState } from "./State.ts";
import { key } from "./key.ts";

export const ErrorHandler: Middleware = async ({ response }, next) => {
    try {
        await next()
    } catch (e) {
        response.body = { message: e.message }
        response.status = e.status || Status.BadRequest
    }
}

export const Logger: Middleware = async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
}

// Timing
export const Timer: Middleware = async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
}


export const JWTKeeper: Middleware<CabbageState> = async ({ request, state, throw: _throw }, next) => {
    const jwt = request.headers.get('Authorization')?.slice(7)
    try {
        const payload = await verify(jwt || '', key)
        console.log(payload)
        state.userName = payload.name as string
    } catch {
        _throw(Status.Forbidden, '没有登录状态')
    }
    await next()
}