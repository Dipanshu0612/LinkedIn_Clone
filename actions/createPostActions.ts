"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSAStoken, { containerName } from "@/lib/generateSASToken";
import { Post } from "@/mongodb/models/posts";
import { User } from "@/types/user";
import { BlobServiceClient } from "@azure/storage-blob";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated!");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let finalImageUrl: string;

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
      console.log("Uploading image to Azure Blob Storage...", image);

      const accountName = process.env.AZURE_STORAGE_NAME;

      const sasToken = await generateSAStoken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const imageBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(imageBuffer);
      finalImageUrl = res._response.request.url;

      console.log("File uploaded successfully!");

      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageurl: finalImageUrl,
      };

      console.log("Executing Image Post Option!");
      await Post.create(body);
    } else {
      // const body: AddPostRequestBody = {
      //   user: userDB,
      //   text: postInput,
      // };
      // await Post.create(body);
    }
  } catch (error: any) {
    throw new Error("Faild to create the Post!", error);
  }

  revalidatePath("/");
}
