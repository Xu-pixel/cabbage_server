import { getModelForClass, prop } from "npm:@typegoose/typegoose@9.13.x"
import mongoose from 'npm:mongoose@~6.7'
import { User } from "./User.ts"

export class Comment {
    @prop({ ref: () => Comment })
    replies?: mongoose.Types.Array<Comment>

    @prop({ maxlength: [500, '内容太长'] })
    content!: string

    @prop()
    articleId?: string

    @prop()
    author!: string

    @prop({ ref: () => User })
    likes!: mongoose.Types.Array<User>

    @prop()
    at!: string
}


export const CommentModel = getModelForClass(Comment, { schemaOptions: { timestamps: true } });

