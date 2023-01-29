import mongoose from 'npm:mongoose@~6.7'
import commentRoute from './routes/comment.ts'
import UserRoute from './routes/user.ts'
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { CORS } from "https://deno.land/x/oak_cors@v0.1.1/mod.ts";
import { ErrorHandler, Logger, Timer } from './Middlewares.ts';

await mongoose.connect(Deno.env.get('MONGO_URL') || 'mongodb://localhost:27017')

const app = new Application();

//注意各个服务的注册顺序
app.use(CORS())
app.use(Logger)
app.use(Timer)
app.use(ErrorHandler)
app.use(commentRoute.prefix('/comment').routes())
app.use(UserRoute.prefix('/user').routes())

console.log('Oak 服务器工作在 http://localhost:8000')

await app.listen({ port: 8000 });