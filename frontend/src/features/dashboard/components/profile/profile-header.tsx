"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Briefcase, Calendar, Edit, MapPin, Plus } from "lucide-react";
import Image from "next/image";
import type { UserProfile } from "@/src/types/user";
import useAuth from "@/src/features/auth/hooks/use-auth";

interface ProfileHeaderProps {
    profile: UserProfile | undefined;
    isLoading: boolean;
}

export default function ProfileHeader({
    profile,
    isLoading,
}: ProfileHeaderProps) {
    const { connectUser } = useAuth();
    if (isLoading) {
        return <ProfileHeaderSkeleton />;
    }

    if (!profile) {
        return <div>Failed to load profile</div>;
    }

    const handle = profile.name?.toLowerCase().replace(/\s+/g, "") || "user";

    return (
        <>
            <div className="relative h-48 w-full md:h-64">
                <Image
                    src="/placeholder.svg?height=300&width=1000"
                    alt="Cover"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="relative -mt-16 flex flex-col items-center px-4 sm:flex-row sm:items-end sm:px-0">
                <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage
                        src={
                            profile.profilePic ||
                            "/placeholder.svg?height=100&width=100"
                        }
                        alt={profile.name}
                    />
                    <AvatarFallback>
                        {profile.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="mt-4 flex flex-1 flex-col items-center sm:ml-4 sm:items-start">
                    <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-4">
                        <h1 className="text-2xl font-bold">{profile.name}</h1>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {profile.role === "organizer" &&
                            profile.organizationName && (
                                <div className="flex items-center">
                                    <Briefcase className="mr-1 h-4 w-4" />
                                    {profile.organizationName}
                                </div>
                            )}
                        {profile.location && (
                            <>
                                {profile.role === "organizer" &&
                                    profile.organizationName && <span>•</span>}
                                <div className="flex items-center">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    {profile.location}
                                </div>
                            </>
                        )}
                        <span>•</span>
                        <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            Joined{" "}
                            {new Date().toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </div>
                    </div>
                </div>

                {profile.isSelf ? (
                    <Button className="mt-4 sm:mt-0" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                ) : (
                    <Button
                        className="mt-4 sm:mt-0"
                        size="sm"
                        onClick={async () => {
                            await connectUser.mutateAsync(profile._id);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Connect
                    </Button>
                )}
            </div>

            <div className="mt-6">
                <p className="text-sm">{profile.bio || "No bio available"}</p>
            </div>
        </>
    );
}

function ProfileHeaderSkeleton() {
    return (
        <>
            {/* Cover Image Skeleton */}
            <div className="relative h-48 w-full md:h-64">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Profile Info Skeleton */}
            <div className="relative -mt-16 flex flex-col items-center px-4 sm:flex-row sm:items-end sm:px-0">
                <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />

                <div className="mt-4 flex flex-1 flex-col items-center sm:ml-4 sm:items-start">
                    <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-4">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-24 mt-2 sm:mt-0" />
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                </div>

                <Skeleton className="h-9 w-28 mt-4 sm:mt-0" />
            </div>

            <div className="mt-6">
                <Skeleton className="h-16 w-full" />
            </div>
        </>
    );
}
