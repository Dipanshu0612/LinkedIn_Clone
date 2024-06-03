import { User } from "@/types/user";
import mongoose ,{Schema, Document, models, Model, model} from "mongoose";

export interface CommentBase{
    user:User;
    text:string;
}

export interface IComment extends CommentBase,Document{
    createdAt:Date;
    updatedAt:Date;
}

const commentSchema=new Schema<IComment>({
    user:{
        userID:{type:String,required:true},
        userImage:{type:String,required:true},
        firstName:{type:String,required:true},
        lastName:{type:String},
    },
    text:{type:String,required:true},
},
{
    timestamps:true,
}
)

export const Comment= models.Comment || mongoose.model<IComment>("Comment",commentSchema);