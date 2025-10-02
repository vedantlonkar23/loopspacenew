"use client";

import { useEffect, useState } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { MapPin, Briefcase, Search } from "lucide-react";
import type { UserProfile } from "@/src/types/user";
import useAuth from "@/src/features/auth/hooks/use-auth";

interface UsersSearchProps {
    query: string;
}

export function UsersSearch({ query }: UsersSearchProps) {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { connectUser, userProfile } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            if (!query) {
                setUsers([]);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_SERVER_URL
                    }/search/users?query=${encodeURIComponent(query)}`,
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                setUsers(data.data);
            } catch (err) {
                setError("Failed to load users");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
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
                Enter a search term to find users
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No users found</h3>
                <p className="text-muted-foreground">
                    Try adjusting your search terms
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <Card key={user._id}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage
                                    src={user.profilePic}
                                    alt={user.name}
                                />
                                <AvatarFallback>
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="font-semibold">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    {userProfile.data &&
                                    userProfile.data.connections?.includes(
                                        user._id
                                    ) ? (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            Connected
                                        </Badge>
                                    ) : (
                                        userProfile.data?._id !== user._id && (
                                            <Button
                                                size="sm"
                                                className="mt-2 sm:mt-0"
                                                disabled={connectUser.isPending}
                                                onClick={async () => {
                                                    await connectUser.mutateAsync(
                                                        user._id
                                                    );
                                                }}
                                            >
                                                Connect
                                            </Button>
                                        )
                                    )}
                                </div>
                                {user.role === "organizer" && (
                                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        {user.organizationName && (
                                            <div className="flex items-center">
                                                <Briefcase className="mr-1 h-4 w-4" />
                                                {user.organizationName}
                                            </div>
                                        )}
                                        {user.location && (
                                            <div className="flex items-center">
                                                <MapPin className="mr-1 h-4 w-4" />
                                                {user.location}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {user.bio && (
                                    <p className="mt-2 text-sm">{user.bio}</p>
                                )}
                                {user.skills && user.skills.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {user.skills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
