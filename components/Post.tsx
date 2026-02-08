"use client";

import { Pencil, Save, Trash2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IPostDocument } from "@/mongodb/models/posts";
import Image from "next/image";
import deletePostAction from "@/actions/deletePostAction";
import updatePostAction from "@/actions/updatePostAction";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import PostOptions from "./PostOptions";
import ReactTimeago from "react-timeago";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { useState } from "react";

function Post({ post }: { post: IPostDocument }) {
  const { user } = useUser();
  const isAuthor = user?.id === post.user.userID;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.text);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeletePost = async () => {
    setIsDeleting(true);
    const promise = deletePostAction(post._id as string).finally(() =>
      setIsDeleting(false),
    );

    toast.promise(promise, {
      loading: "Deleting post...",
      success: "Post deleted!",
      error: "Error deleting post",
    });

    await promise;
  };

  const onSaveEdit = async () => {
    if (!editedText.trim()) {
      toast.error("Post text cannot be empty");
      return;
    }

    setIsSavingEdit(true);
    const promise = updatePostAction(post._id as string, editedText)
      .then(() => setIsEditing(false))
      .finally(() => setIsSavingEdit(false));

    toast.promise(promise, {
      loading: "Updating post...",
      success: "Post updated",
      error: "Unable to update post",
    });

    await promise;
  };

  return (
    <div className="bg-white rounded-md border">
      <div className="p-4 flex space-x-2">
        <div>
          <Avatar>
            <AvatarImage src={post.user.userImage} />
            <AvatarFallback>
              {post.user.firstName?.charAt(0)}
              {post.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex justify-between flex-1">
          <div>
            <p className="font-semibold">
              {post.user.firstName} {post.user.lastName}{" "}
              {isAuthor && (
                <Badge className="ml-2" variant="secondary">
                  Author
                </Badge>
              )}
            </p>
            <p className="text-xs text-gray-400">
              @{post.user.firstName}
              {post.user?.lastName}-{post.user.userID.toString().slice(-4)}
            </p>

            <p className="text-xs text-gray-400">
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting || isSavingEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedText(post.text);
                    setIsEditing(false);
                  }}
                  disabled={isSavingEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="outline"
                onClick={onDeletePost}
                disabled={isDeleting || isSavingEdit}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="">
        {isEditing ? (
          <div className="px-4 pb-2 mt-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full min-h-24 border rounded-md p-3 outline-none"
              maxLength={500}
              disabled={isSavingEdit}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={onSaveEdit} disabled={isSavingEdit}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="px-4 pb-2 mt-2 whitespace-pre-wrap">{post.text}</p>
        )}

        {post.imageurl && (
          <Image
            src={post.imageurl}
            alt="Post Image"
            width={500}
            height={500}
            className="w-full mx-auto"
          />
        )}
      </div>

      <PostOptions postId={post._id as string} post={post} />
    </div>
  );
}

export default Post;
