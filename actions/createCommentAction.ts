"use server";

import connectDB from "@/mongodb/db";
import { ICommentBase } from "@/mongodb/models/comments";
import { Post } from "@/mongodb/models/posts";
import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function createCommentAction(
  postId: string,
  formData: FormData,
) {
  const user = await currentUser();

  const commentInput = (formData.get("commentInput") as string) || "";

  if (!postId) throw new Error("Post id is required");
  if (!commentInput.trim()) throw new Error("Comment input is required");
  if (!user?.id) throw new Error("User not authenticated");

  await connectDB();

  const userDB: User = {
    userID: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const comment: ICommentBase = {
    user: userDB,
    text: commentInput.trim(),
  };

  try {
    await post.commentOnPost(comment);
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while adding comment");
  }
}
