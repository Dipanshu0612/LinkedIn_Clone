import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/posts";
import { auth, currentUser } from "@clerk/nextjs/server";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET(request:Request, {params}:{params :{posts_id : string}}){
    await connectDB();
    try {
        const post=await Post.findById(params.posts_id);
        if(!post){
            return NextResponse.json({error:"Post Not Found"},{status:404});
        }
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({error:"An error occured while fetching!"},{status:500})
    }
}

export interface DeletePostReqestBody{
    userID:string,
}
export async function DELETE(request:Request, {params}:{params :{posts_id : string}}){
    auth().protect()
    await connectDB();
    const user= await currentUser();

    try {
        const post=await Post.findById(params.posts_id);
        if(!post){
            return NextResponse.json({error:"Post Not Found"},{status:404});
        }

        if(post.user.userID!==user?.id){
            throw new Error("Post does not belong to the user!");
        }

        await post.removePost();

        
    } catch (error) {
        return NextResponse.json({error:"An error occured while deleting the post!"},{status:500})
    }
}