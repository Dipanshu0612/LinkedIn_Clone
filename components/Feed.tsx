import { IPostDocument } from "@/mongodb/models/posts";
import Post from "./Post";

async function Feed({ posts }: { posts: IPostDocument[] }) {
  if (!posts?.length) {
    return (
      <div className="bg-white rounded-md border p-6 text-center text-sm text-gray-500">
        No posts yet. Be the first one to share something.
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-20">
      {posts?.map((post) => (
        <Post key={post._id as string} post={post} />
      ))}
    </div>
  );
}

export default Feed;
