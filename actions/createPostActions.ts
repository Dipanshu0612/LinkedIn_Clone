"use server";

import { AddPostRequestBody } from "@/app/api/posts/routes";
import { Post } from "@/mongodb/models/posts";
import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated!");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let imageUrl: string | undefined;

  if (!postInput) {
    throw new Error("Please provide a input!");
  }

  const userDB: User = {
    userID: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };
  try {
    if (image.size > 0) {
        const body :AddPostRequestBody= {
            user: userDB,
            text: postInput,
            // imageUrl:image_url,
          };
          await Post.create(body);
    } else {
      const body : AddPostRequestBody= {
        user: userDB,
        text: postInput,
      };
      await Post.create(body);
    }
  } catch (error:any) {
    throw new Error("Please provide a input!",error);
  }
}
