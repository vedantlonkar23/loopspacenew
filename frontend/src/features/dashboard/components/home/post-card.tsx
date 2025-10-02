"use client";

import { useState } from "react";
import { AvatarFallback } from "@/src/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/src/components/ui/card";
import { Avatar, AvatarImage } from "@/src/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { Post } from "@/src/types/user";
import { formatDistanceToNow } from "date-fns";
import usePost from "../../hooks/use-post";
import { useRouter } from "next/navigation";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Separator } from "@/src/components/ui/separator";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { useToast } from "@/src/components/ui/use-toast";

export default function PostCard({ post }: { post: Post }) {
    const router = useRouter();
    const { likePost, unlikePost, commentPost } = usePost();
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { toast } = useToast();

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            setIsSubmitting(true);
            await commentPost.mutateAsync({
                id: post._id,
                text: commentText.trim(),
            });
            setCommentText("");
            // Don't close the drawer so users can see their comment appear
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add comment",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                            router.push(`/dashboard/profile/${post.user._id}`);
                        }}
                    >
                        <div className="font-semibold">{post.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.createdAt))}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line">{post.description}</p>
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
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                            if (post.isLiked) {
                                post.isLiked = false;
                                await unlikePost.mutateAsync(post._id);
                            } else {
                                post.isLiked = true;
                                await likePost.mutateAsync(post._id);
                            }
                        }}
                    >
                        <Heart
                            className={`mr-1 h-4 w-4 ${
                                post.isLiked ? "fill-red-500 text-red-500" : ""
                            }`}
                        />{" "}
                        {post.likes.length}
                    </Button>
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MessageCircle className="mr-1 h-4 w-4" />{" "}
                                {post.comments.length}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader className="text-left">
                                <DrawerTitle>Comments</DrawerTitle>
                                <DrawerDescription>
                                    View and add comments to this post
                                </DrawerDescription>
                            </DrawerHeader>

                            <div className="p-4 pt-0">
                                <form
                                    onSubmit={handleCommentSubmit}
                                    className="flex gap-2"
                                >
                                    <Textarea
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={(e) =>
                                            setCommentText(e.target.value)
                                        }
                                        className="flex-1 h-[20px] resize-none"
                                        disabled={isSubmitting}
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="self-end"
                                        disabled={
                                            isSubmitting || !commentText.trim()
                                        }
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                                <Separator className="my-4" />
                            </div>
                            <div className="px-4">
                                <ScrollArea className="h-[50vh] pr-4">
                                    {post.comments.length > 0 ? (
                                        <div className="space-y-4">
                                            {post.comments
                                                .slice()
                                                .reverse()
                                                .map((comment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex gap-3"
                                                    >
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={
                                                                    comment.user
                                                                        .profilePic
                                                                }
                                                                alt={
                                                                    comment.user
                                                                        .name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {comment.user.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-sm">
                                                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        comment
                                                                            .user
                                                                            .name
                                                                    }
                                                                </div>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                                                    {
                                                                        comment.text
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {formatDistanceToNow(
                                                                    new Date(
                                                                        comment.createdAt
                                                                    )
                                                                )}{" "}
                                                                ago
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            No comments yet. Be the first to
                                            comment!
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <Button variant="ghost" size="sm">
                        <Share2 className="mr-1 h-4 w-4" /> Share
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
