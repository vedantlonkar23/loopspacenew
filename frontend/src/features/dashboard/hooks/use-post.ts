"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/src/lib/fetchClient";
import { postApi } from "../apis/post-api";

export default function usePost() {
    const queryClient = useQueryClient();
    const feed = useQuery({
        queryKey: ["feed"],
        queryFn: postApi.getFeed,
        enabled:
            typeof window !== "undefined" &&
            localStorage.getItem("token") !== null &&
            localStorage.getItem("token") !== undefined,
    });

    const likePost = useMutation({
        mutationFn: (id: string) => postApi.like(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            toast.success("Post liked");
        },
        onError: (error) => {
            toast.error("Failed to like post");
        },
    });

    const unlikePost = useMutation({
        mutationFn: (id: string) => postApi.unlike(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            toast.success("Post unliked");
        },
        onError: (error) => {
            toast.error("Failed to unlike post");
        },
    });

    const commentPost = useMutation({
        mutationFn: (data: { id: string; text: string }) =>
            postApi.comment(data.id, data.text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            toast.success("Comment added");
        },
        onError: (error) => {
            toast.error("Failed to add comment");
        },
    });

    return {
        feed,
        likePost,
        unlikePost,
        commentPost,
    };
}
