"use client";

import { useState } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Card, CardHeader } from "@/src/components/ui/card";
import PostList from "./post-list";
import CreatePostDialog from "./create-post";
import useAuth from "../../../auth/hooks/use-auth";
import { Post } from "@/src/types/user";
import AddEventDialog from "./add-event";

export default function Dashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const { userProfile } = useAuth();

    return (
        <div className="container max-w-3xl py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold w-fit">Home</h1>
                <AddEventDialog />
            </div>
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src={userProfile.data?.profilePic}
                                alt="User"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <CreatePostDialog />
                    </div>
                </CardHeader>
            </Card>
            <PostList />
        </div>
    );
}
