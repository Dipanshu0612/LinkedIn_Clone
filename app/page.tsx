import Feed from "@/components/Feed";
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import Widget from "@/components/Widget";
import { Post } from "@/mongodb/models/posts";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";

export const revalidate = 0;

export default async function Home() {
  const posts = await Post.getAllPosts();
  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation />
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-wl mx-auto w-full">
        <SignedIn>
          <PostForm />
        </SignedIn>

        <Feed posts={posts} />
      </section>

      <section className="hidden xl:inline justify-center col-span-2">
      <Widget />
      </section>
    </div>
  );
}
