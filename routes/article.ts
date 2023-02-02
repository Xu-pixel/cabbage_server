import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { ArticleModel } from "../models/Article.ts";

const router = new Router()
export default router

const article2views = new Map<string, number>()

router.get(
    '/views/:title',
    async ({ params, response }) => {
        if (!article2views.has(params.title)) {
            const article = await ArticleModel.findOne({ title: params.title })
            article2views.set(params.title, article?.views!)
        }
        response.body = { views: article2views.get(params.title) }
    }
)

//前端先post再get
router.post(
    '/views/:title',
    async ({ params, response }) => {
        if (!article2views.has(params.title)) {
            let article = await ArticleModel.findOne({ title: params.title })
            if (article) {
                article2views.set(params.title, article?.views!)
            } else {
                article = await ArticleModel.create({ title: params.title })
            }
            article2views.set(params.title, article?.views!)
        }
        let views = article2views.get(params.title)!
        views++
        article2views.set(params.title, views)

        //每一百次阅读存一次数据到硬盘
        if (views % 100 === 0) {
            const article = await ArticleModel.findOne({ title: params.title })
            article!.views = views
            article?.save()
        }
        response.body = { views }
    }
)