import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { key } from "../key.ts";
import { UserModel } from '../models/User.ts'

const router = new Router()
export default router


router.post('/signup', async ({ response, request, throw: _throw }) => {
    const { name, token } = await request.body().value
    if (await UserModel.findOne({ name }))
        _throw(Status.BadRequest, '用户名已被使用')
    response.body = await UserModel.create({ name, token })
})


router.post('/login', async ({ request, response, throw: _throw }) => {
    const { name, token } = await request.body().value
    const user = await UserModel.findOne({ name })
    if (user?.token === token) {
        const jwt = await create({ alg: "HS512", typ: "JWT", }, { name: user?.name, exp: getNumericDate(3600 * 24 * 2) }, key);
        response.body = {
            message: "登录成功",
            jwt,
            jwtProDate: Date.now()
        }
    }
    else {
        _throw(Status.Unauthorized, '密码错误')
    }
})
