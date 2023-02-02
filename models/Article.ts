import { getModelForClass, prop } from "npm:@typegoose/typegoose@9.13.x"

export class Article {
    @prop({ default: 0 })
    views!: number

    @prop()
    title!: string
}


export const ArticleModel = getModelForClass(Article);

