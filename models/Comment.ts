import { getModelForClass, prop } from "npm:@typegoose/typegoose@9.13.x"
import mongoose from 'npm:mongoose@~6.7'

export class Comment {
    @prop({ ref: () => Comment })
    replies?: mongoose.Types.Array<Comment>

    @prop({ maxlength: [500, '内容太长'] })
    content!: string

    @prop()
    articleId?: string

    @prop()
    author!: string

    @prop()
    likes!: mongoose.Types.Array<string>

    @prop()
    at!: string
}


export const CommentModel = getModelForClass(Comment, { schemaOptions: { timestamps: true } });

