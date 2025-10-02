"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from "@/src/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import type { Post, UserProfile } from "@/src/types/user";
import { formatDistanceToNow } from "date-fns";

interface ProfilePostsProps {
    profile: UserProfile | undefined;
    isLoading: boolean;
    posts?: Post[];
}

export default function ProfilePosts({
    profile,
    isLoading,
    posts = [],
}: ProfilePostsProps) {
    if (isLoading) {
        return <ProfilePostsSkeleton />;
    }

    if (!profile) {
        return <div>Failed to load profile</div>;
    }

    const handle = profile.name?.toLowerCase().replace(/\s+/g, "") || "user";

    return (
        <div className="mt-6 space-y-4">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Card key={post._id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            profile.profilePic ||
                                            "/placeholder.svg"
                                        }
                                        alt={profile.name}
                                    />
                                    <AvatarFallback>
                                        {profile.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">
                                        {profile.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        @{handle} ·{" "}
                                        {formatDistanceToNow(
                                            new Date(post.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-lg font-medium mb-2">
                                {post.title}
                            </h3>
                            <p className="mb-4">{post.description}</p>
                            {post.media && post.media.length > 0 && (
                                <div
                                    className={`grid gap-2 ${
                                        post.media.length > 1
                                            ? "grid-cols-2"
                                            : "grid-cols-1"
                                    }`}
                                >
                                    {post.media
                                        .slice(0, 4)
                                        .map((mediaUrl, index) => (
                                            <div
                                                key={index}
                                                className={`flex justify-center items-center`}
                                            >
                                                <Image
                                                    src={
                                                        mediaUrl ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`Post media ${
                                                        index + 1
                                                    }`}
                                                    width={500}
                                                    height={200}
                                                    className="rounded-md h-auto"
                                                />
                                            </div>
                                        ))}
                                </div>
                            )}
                            {post.eventCode && (
                                <div className="mt-3 bg-muted p-2 rounded-md text-sm">
                                    <span className="font-medium">
                                        Event Code:
                                    </span>{" "}
                                    {post.eventCode}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between">
                            <Button variant="ghost" size="sm" className="gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{post.likes.length}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.comments.length}</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <Card>
                    <CardContent className="py-6 text-center text-muted-foreground">
                        No posts to display
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function ProfilePostsSkeleton() {
    return (
        <div className="mt-6 space-y-4">
            {[1, 2].map((i) => (
                <Card key={i}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-3/4 mb-3" />
                        <Skeleton className="h-16 w-full mb-3" />
                        <Skeleton className="h-48 w-full rounded-md" />
                    </CardContent>
                    <CardFooter className="border-t pt-3">
                        <div className="flex w-full justify-between">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
