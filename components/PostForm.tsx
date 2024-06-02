"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

function PostForm() {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormData=async (formData:FormData)=>{
    const formDataCopy=formData;
    ref.current?.reset();
    const txt=formDataCopy.get("postInput") as string;

    if(!txt.trim()){
        throw new Error("You must provide a input!")
    }
    setPreview(null);
    try {
        await createPostAction(formDataCopy);
    } catch (error) {
        console.log("Error: ",error)
    }
  }
  return (
    <div className="mb-2">
      <form action={(formData)=>{
        handleFormData(formData);
      }} ref={ref} className="bg-white p-4 border rounded-lg">
        <div className="flex justify-center items-center space-x-2">
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
            name="postInput"
            className="flex-1 outline-none rounded-full py-3 px-4 border"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            hidden
            ref={fileRef}
            onChange={handleImageChange}
          />

          <button type="submit" hidden>
            Post
          </button>
        </div>
        {preview && (
          <div className="mt-3">
            <img src={preview} alt="Preview" className="w-full object-cover" />
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-2 mr-2">
          <Button type="button" onClick={() => fileRef.current?.click()}>
            <ImageIcon className="mr-2" size={16} color="white" />
            {preview ? "Change" : "Add"} Image
          </Button>

          {preview && (
            <Button type="button" onClick={()=> setPreview(null)}>
              <XIcon className="mr-2" size={16} color="white" />
              Remove Image
            </Button>
          )}
        </div>
      </form>
      <hr className="bg-gray-700 mt-2"/>
    </div>
  );
}

export default PostForm;
