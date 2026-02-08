import connectDB from "@/mongodb/db";
import { ICommentBase } from "@/mongodb/models/comments";
import { Post } from "@/mongodb/models/posts";
import { User } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { posts_id: string } },
) {
  try {
    await connectDB();

    const post = await Post.findById(params.posts_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await post.getCommentsOnPost();
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching comments" },
      { status: 500 },
    );
  }
}

export interface AddCommentRequestBody {
  user: User;
  text: string;
}

export async function POST(
  request: Request,
  { params }: { params: { posts_id: string } },
) {
  auth().protect();
  try {
    await connectDB();
    const { user, text }: AddCommentRequestBody = await request.json();

    if (!user?.userID || !text?.trim()) {
      return NextResponse.json(
        { error: "Invalid comment payload" },
        { status: 400 },
      );
    }

    const post = await Post.findById(params.posts_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment: ICommentBase = {
      user,
      text: text.trim(),
    };

    await post.commentOnPost(comment);
    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while adding comment" },
      { status: 500 },
    );
  }
}
