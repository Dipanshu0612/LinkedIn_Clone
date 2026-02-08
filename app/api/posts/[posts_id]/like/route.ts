import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/posts";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { posts_id: string } },
) {
  await connectDB();

  try {
    const post = await Post.findById(params.posts_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likes = post.likes;
    return NextResponse.json(likes);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching likes" },
      { status: 500 },
    );
  }
}

export interface LikePostRequestBody {
  userId: string;
}

export async function POST(
  request: Request,
  { params }: { params: { posts_id: string } },
) {
  auth().protect();
  await connectDB();
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await Post.findById(params.posts_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await post.likePost(user.id);
    return NextResponse.json({ message: "Post liked successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while liking the post" },
      { status: 500 },
    );
  }
}
