import { fetchClient } from "@/src/lib/fetchClient";
import { Post } from "@/src/types/user";
import { comment } from "postcss";

export const postApi = {
    getFeed: async () => {
        return fetchClient.get<Post[]>("/post/feed");
    },
    like: async (id: string) => {
        return fetchClient.post(`/post/like-post/${id}`);
    },
    unlike: async (id: string) => {
        return fetchClient.delete(`/post/like-post/${id}`);
    },
    comment: async (id: string, text: string) => {
        return fetchClient.post(`/post/comment-post/${id}`, { text });
    },
};
