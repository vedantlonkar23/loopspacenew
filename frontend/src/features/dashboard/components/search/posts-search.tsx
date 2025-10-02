"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/src/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Heart, MessageCircle, Search } from "lucide-react";
import type { Post } from "@/src/types/user";
import Image from "next/image";
import PostCard from "../home/post-card";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface PostsSearchProps {
    query: string;
}

export function PostsSearch({ query }: PostsSearchProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            if (!query) {
                setPosts([]);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_SERVER_URL
                    }/search/posts?query=${encodeURIComponent(query)}`,
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch posts");
                const data = await response.json();
                setPosts(data.data);
            } catch (err) {
                setError("Failed to load posts");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [query]);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-8">{error}</div>;
    }

    if (!query) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Enter a search term to find posts
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="text-muted-foreground">
                    Try adjusting your search terms
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <Card key={post._id}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 ">
                            <Avatar>
                                <AvatarImage
                                    src={post.user.profilePic}
                                    alt={post.user.name}
                                />
                                <AvatarFallback>
                                    {post.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    router.push(
                                        `/dashboard/profile/${post.user._id}`
                                    );
                                }}
                            >
                                <div className="font-semibold">
                                    {post.user.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(
                                        new Date(post.createdAt)
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-line">
                            {post.description}
                        </p>
                        {post.media && post.media.length > 0 && (
                            <div className="mt-3 flex justify-center items-center w-full">
                                <Image
                                    src={post.media[0] || "/placeholder.svg"}
                                    alt="Post image"
                                    width={400}
                                    height={300}
                                    className="rounded-md h-auto "
                                />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t pt-3">
                        <div className="flex w-full gap-4">
                            <Button variant="ghost" size="sm">
                                <Heart
                                    className={`mr-1 h-4 w-4 ${
                                        post.isLiked
                                            ? "fill-red-500 text-red-500"
                                            : ""
                                    }`}
                                />{" "}
                                {post.likes.length}
                            </Button>

                            <Button variant="ghost" size="sm">
                                <MessageCircle className="mr-1 h-4 w-4" />{" "}
                                {post.comments.length}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
