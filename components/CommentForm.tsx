"use client";

import createCommentAction from "@/actions/createCommentAction";
import { useUser } from "@clerk/nextjs";
import { Loader2, Send } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { toast } from "sonner";

function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCommentActionWithPostId = createCommentAction.bind(null, postId);

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    const commentInput = (formDataCopy.get("commentInput") as string) || "";

    if (!commentInput.trim()) {
      toast.error("Comment cannot be empty");
      throw new Error("Comment cannot be empty");
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      await createCommentActionWithPostId(formDataCopy);
      ref.current?.reset();
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleCommentAction(formData);
        toast.promise(promise, {
          loading: "Posting comment...",
          success: "Comment Posted!",
          error: "Error creating comment",
        });
      }}
      className="flex items-center space-x-2"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          placeholder="Add a comment..."
          className="outline-none flex-1 text-sm bg-transparent"
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Comment
          </>
        )}
      </Button>
    </form>
  );
}

export default CommentForm;
