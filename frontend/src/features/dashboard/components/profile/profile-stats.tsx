"use client";

import { Skeleton } from "@/src/components/ui/skeleton";

interface ProfileStatsProps {
    isLoading: boolean;
    stats?: {
        posts: number;
        connections: number;
    };
}

export default function ProfileStats({
    isLoading,
    stats = { posts: 0, connections: 0 },
}: ProfileStatsProps) {
    if (isLoading) {
        return <ProfileStatsSkeleton />;
    }

    return (
        <div className="mt-6 flex justify-around border-y py-3">
            <div className="text-center">
                <div className="font-bold">{stats.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
                <div className="font-bold">{stats.connections}</div>
                <div className="text-sm text-muted-foreground">Connections</div>
            </div>
        </div>
    );
}

function ProfileStatsSkeleton() {
    return (
        <div className="mt-6 flex justify-around border-y py-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                    <Skeleton className="h-6 w-12 mx-auto" />
                    <Skeleton className="h-4 w-16 mx-auto mt-1" />
                </div>
            ))}
        </div>
    );
}
