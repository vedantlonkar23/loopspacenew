import usePost from "../../hooks/use-post";
import PostCard from "./post-card";

export default function PostList() {
    const { feed } = usePost();
    return (
        <div className="space-y-6">
            {feed.data &&
                feed.data.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
        </div>
    );
}
