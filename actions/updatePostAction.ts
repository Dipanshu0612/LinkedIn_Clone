"use server";

import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/posts";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function updatePostAction(postId: string, text: string) {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("User not authenticated!");
  }

  if (!postId) {
    throw new Error("Post id is required!");
  }

  if (!text?.trim()) {
    throw new Error("Post text cannot be empty!");
  }

  await connectDB();

  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found!");
  }

  if (post.user.userID !== user.id) {
    throw new Error("Post does not belong to the user!");
  }

  post.text = text.trim();
  await post.save();
  revalidatePath("/");
}
