import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { JWTKeeper } from "../Middlewares.ts";
import { CommentModel, Comment } from '../models/Comment.ts'
import { CabbageState } from '../State.ts'
import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";

const router = new Router<CabbageState>()
export default router
    .post(
        '/article/:id',
        JWTKeeper,
        async ({ response, request, params, throw: _throw, state }) => {
            const newComment: Comment = await request.body().value
            newComment.author = state.userName
            newComment.articleId = params.id
            response.body = await CommentModel.create(newComment)
        }
    )
    .post(
        '/reply/:id',
        JWTKeeper,
        async ({ response, request, params, throw: _throw, state }) => {
            const newComment: Comment = await request.body().value
            newComment.author = state.userName

            const parentComment = await CommentModel.findById(params.id)
            const comment = await CommentModel.create(newComment)
            parentComment?.replies?.push(comment)

            await parentComment?.save()
            response.body = comment
        }
    )
    .delete(
        '/:id',
        JWTKeeper,
        async ({ response, params, state, throw: _throw }) => {
            const comment = await CommentModel.findById(params.id)
            if (comment?.author != state.userName) _throw(Status.Forbidden)
            response.body = comment
            comment?.delete()
        }
    )
    .put(
        '/:id',
        JWTKeeper,
        async ({ response, request, state, params, throw: _throw }) => {
            const comment = await CommentModel.findById(params.id)
            if (comment?.author != state.userName) _throw(Status.Forbidden)
            const patchComment: Comment = await request.body().value
            comment?.update(patchComment)
            await comment?.save()
            response.body = comment
        }
    )
    .get(
        '/:id',
        async ({ response, params, throw: _throw }) => {
            console.log(params)
            response.body = await CommentModel.findById(params.id)
        }
    )
    .get(
        '/article/:id/:page?/:size?',
        async ({ response, params }) => {
            if (!params.page) {
                response.body = await CommentModel.find({ articleId: params.id }).populate('replies')
                return
            }
            const page = z.coerce.number().parse(params.page || 0)
            const size = z.coerce.number().parse(params.size || 5)
            response.body = await CommentModel.find({ articleId: params.id })
                .skip(page * size)
                .limit(size)
                .sort('-createdAt')
                .populate('replies')
        }
    )
