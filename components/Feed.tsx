import { IPostDocument } from "@/mongodb/models/posts";
import Post from "./Post";

async function Feed({ posts }: { posts: IPostDocument[] }) {
    return (
        <div className="space-y-2 pb-20">
            {posts?.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}

export default Feed;