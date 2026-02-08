"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { uploadImageToR2 } from "@/lib/r2";
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/posts";
import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated!");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let finalImageUrl: string | undefined;

  if (!postInput?.trim()) {
    throw new Error("Please provide a input!");
  }

  const userDB: User = {
    userID: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };
  try {
    await connectDB();

    if (image && image.size > 0) {
      finalImageUrl = await uploadImageToR2(image);
    }

    const body: AddPostRequestBody = {
      user: userDB,
      text: postInput.trim(),
      ...(finalImageUrl && { imageurl: finalImageUrl }),
    };

    await Post.create(body);
  } catch (error: any) {
    console.error("Error uploading file or creating post:", error.message);
    throw new Error("Unable to create post");
  }

  revalidatePath("/");
}
