"use client";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/ui/tabs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { Event, Post } from "@/src/types/user";
import useAuth from "@/src/features/auth/hooks/use-auth";
import ProfileHeader from "./profile-header";
import ProfileStats from "./profile-stats";
import ProfilePosts from "./profile-posts";
import ProfileSkills from "./profile-skills";
import ProfileEvents from "./profile-events";
import ProfileConnections from "./profile-connections";

export default function Profile() {
    const router = useRouter();
    const { userProfile, isLoggedIn } = useAuth();
    const { data: profile, isLoading: isProfileLoading, isError } = userProfile;

    useEffect(() => {
        if (!isProfileLoading && !isLoggedIn()) {
            router.push("/auth/login");
        }
    }, [isProfileLoading, isLoggedIn, router]);

    const stats = {
        posts: profile?.posts?.length || 0,
        connections: profile?.connections?.length || 0,
        events: profile?.eventsAttended?.length || 0,
    };

    if (isError) {
        return (
            <div className="container max-w-4xl py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Error Loading Profile
                </h1>
                <p className="text-muted-foreground">
                    There was an error loading your profile. Please try again
                    later.
                </p>
            </div>
        );
    }

    const isLoading = isProfileLoading;

    return (
        <div className="pb-10">
            <div className="container max-w-4xl">
                <ProfileHeader profile={profile} isLoading={isProfileLoading} />

                <ProfileStats isLoading={isLoading} stats={stats} />

                <Tabs defaultValue="posts" className="mt-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="connections">Connections</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="other">Other</TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts">
                        <ProfilePosts
                            profile={profile}
                            isLoading={isLoading}
                            posts={profile?.posts || []}
                        />
                    </TabsContent>

                    <TabsContent value="connections">
                        <ProfileConnections />
                    </TabsContent>

                    <TabsContent value="events">
                        <ProfileEvents
                            profile={profile}
                            isLoading={isLoading}
                            events={profile?.eventsAttended || []}
                        />
                    </TabsContent>
                    <TabsContent value="other">
                        <ProfileSkills
                            profile={profile}
                            isLoading={isProfileLoading}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
