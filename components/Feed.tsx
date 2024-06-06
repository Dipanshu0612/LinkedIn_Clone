import { IPostDocument } from "@/mongodb/models/posts";
import Post from "./Post";
import { Key } from "react";

async function Feed({ posts }: { posts: IPostDocument[] }) {
  return (
    <div className="space-y-2 pb-20">
      {posts?.map((post) => (
        <Post key={post._id as string} post={post} />
      ))}
    </div>
  );
}

export default Feed;
