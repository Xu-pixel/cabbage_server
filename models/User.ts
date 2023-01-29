import { getModelForClass, prop } from "npm:@typegoose/typegoose@9.13.x"


export class User {
    @prop()
    name!: string

    @prop()
    token!: string //代替密码的token（效果一样）
}


export const UserModel = getModelForClass(User);