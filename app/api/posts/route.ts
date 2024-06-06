import connectDB from "@/mongodb/db";
import { Post, PostBase } from "@/mongodb/models/posts";
import { User } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { errorMonitor } from "events";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
  user: User;
  text: string;
  imageurl?: string;
}

export async function POST(request: Request) {
  // auth().protect();
  try {
    await connectDB();
    const { user, text, imageurl }: AddPostRequestBody = await request.json();
    console.log("Image URL is : ", imageurl);
    const postData: PostBase = {
      user,
      text,
      ...(imageurl && { imageurl }),
    };

    const post = await Post.create(postData);
    return NextResponse.json({
      message: "Succesfully created a post!",
      post,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `An error occured while creating the post: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const posts = await Post.getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occured while fetching posts!",
      },
      { status: 500 }
    );
  }
}
