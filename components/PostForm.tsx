"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon, Loader2, Send, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import createPostAction from "@/actions/createPostActions";
import { toast } from "sonner";

function PostForm() {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setPreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleFormData = async (formData: FormData) => {
    const formDataCopy = formData;
    const txt = (formDataCopy.get("postInput") as string) || "";

    if (!txt.trim()) {
      toast.error("Post text is required");
      return;
    }

    setIsSubmitting(true);

    const promise = createPostAction(formDataCopy)
      .then(() => {
        ref.current?.reset();
        removeSelectedImage();
      })
      .finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "Creating post...",
      success: "Post created",
      error: "Unable to create post",
    });

    await promise;
  };

  return (
    <div className="mb-2">
      <form
        action={(formData) => {
          handleFormData(formData);
        }}
        ref={ref}
        className="bg-white p-4 border rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage
              src={user?.imageUrl || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <input
            type="text"
            placeholder="Start writing a post..."
            autoComplete="off"
            name="postInput"
            className="flex-1 outline-none rounded-full py-3 px-4 border border-gray-400"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            hidden
            ref={fileRef}
            onChange={handleImageChange}
          />
        </div>

        {preview && (
          <div className="mt-3 border rounded-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full object-cover" />
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
              disabled={isSubmitting}
            >
              <ImageIcon className="mr-2" size={16} />
              {preview ? "Change Image" : "Add Image"}
            </Button>

            {preview && (
              <Button
                type="button"
                variant="outline"
                onClick={removeSelectedImage}
                disabled={isSubmitting}
              >
                <XIcon className="mr-2" size={16} />
                Remove Image
              </Button>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Create Post
              </>
            )}
          </Button>
        </div>
      </form>
      <hr className="bg-gray-700 mt-2" />
    </div>
  );
}

export default PostForm;
