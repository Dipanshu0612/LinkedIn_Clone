import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/posts";
import { NextResponse } from "next/server";

export async function GET(request:Request, {params}:{params :{posts_id : string}}
) {
  await connectDB();

  try {
    // console.log(params.posts_id);
    const post = await Post.findOne({_id:`${params.posts_id}`});

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // console.log("Post Found",post)
    const likes = post.likes;
    return NextResponse.json(likes);
  } catch (error) {
    // console.log(error)
    return NextResponse.json(
      { error: "An error occurred while fetching likes" },
      { status: 500 }
    );
  }
}

export interface LikePostRequestBody {
  userId: string;
}

export async function POST(
  request: Request,
  { params }: { params: { posts_id: string } }
) {
  await connectDB();

  const { userId }: LikePostRequestBody = await request.json();

  try {
    const post = await Post.findById(params.posts_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await post.likePost(userId);
    return NextResponse.json({ message: "Post liked successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while liking the post" },
      { status: 500 }
    );
  }
}