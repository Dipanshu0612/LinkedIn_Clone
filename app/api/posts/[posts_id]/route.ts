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
      return NextResponse.json({ error: "Post Not Found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occured while fetching!" },
      { status: 500 },
    );
  }
}

export interface DeletePostReqestBody {
  userID: string;
}

export interface UpdatePostRequestBody {
  text: string;
}

export async function PUT(
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
    const { text }: UpdatePostRequestBody = await request.json();
    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Post text is required" },
        { status: 400 },
      );
    }

    const post = await Post.findById(params.posts_id);
    if (!post) {
      return NextResponse.json({ error: "Post Not Found" }, { status: 404 });
    }

    if (post.user.userID !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    post.text = text.trim();
    await post.save();

    return NextResponse.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occured while updating the post!" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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
      return NextResponse.json({ error: "Post Not Found" }, { status: 404 });
    }

    if (post.user.userID !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await post.removePost();

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occured while deleting the post!" },
      { status: 500 },
    );
  }
}
