"use client";

import useAuth from "@/src/features/auth/hooks/use-auth";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
    MessageCircle,
    UserPlus,
    UserCheck,
    AlertCircle,
    Search,
    Users,
    SortAsc,
    Filter,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { UserProfile } from "@/src/types/user";

export default function ProfileConnections() {
    const { connections } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    // Memoize filtered results to optimize performance
    const filteredConnections = useMemo(() => {
        if (!connections.data) return [];

        const query = searchQuery.trim().toLowerCase();
        if (!query) return connections.data;

        return connections.data.filter(({ name, bio, skills }) => {
            return (
                name.toLowerCase().includes(query) ||
                bio?.toLowerCase().includes(query) ||
                skills?.some((skill) => skill.toLowerCase().includes(query))
            );
        });
    }, [connections.data, searchQuery]);


    // Render loading skeletons
    const renderSkeletons = () => {
        return Array(6)
            .fill(0)
            .map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                                <div className="flex gap-1 pt-1">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-9 rounded-md" />
                                <Skeleton className="h-9 w-9 rounded-md" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ));
    };

    if (connections.isError) {
        return (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {"Failed to load connections. Please try again later."}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Connections</h1>
                            <p className="text-muted-foreground">
                                {!connections.isLoading &&
                                    connections.data &&
                                    `You have ${
                                        connections.data.length
                                    } connection${
                                        connections.data.length !== 1 ? "s" : ""
                                    }`}
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search connections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10"
                            disabled={
                                connections.isLoading || connections.isError
                            }
                        />
                    </div>
                </div>
            </div>

            {connections.isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderSkeletons()}
                </div>
            ) : connections.data && connections.data?.length === 0 ? (
                <div className="text-center py-16 px-4 bg-muted/30 rounded-lg border border-dashed">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <UserPlus className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                        No connections yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Start building your network by connecting with other
                        users who share your interests and skills.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/dashboard/discover">
                            <UserPlus className="mr-2 h-5 w-5" />
                            Find people to connect with
                        </Link>
                    </Button>
                </div>
            ) : filteredConnections.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                        No connections match your search.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredConnections.map((connection) => (
                        <Card
                            key={connection._id}
                            className="overflow-hidden hover:shadow-md transition-all border-muted/80 hover:border-primary/20"
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <Link
                                        href={`/dashboard/profile/${connection._id}`}
                                    >
                                        <Avatar className="h-14 w-14 border-2 border-primary/10 hover:border-primary/30 transition-colors">
                                            <AvatarImage
                                                src={
                                                    connection.profilePic ||
                                                    "/placeholder.svg?height=56&width=56"
                                                }
                                                alt={connection.name}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                {connection.name
                                                    .split(" ")
                                                    .map((n) =>
                                                        n
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    )
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <Link
                                            href={`/dashboard/profile/${connection._id}`}
                                            className="hover:underline"
                                        >
                                            <h3 className="font-medium text-lg truncate">
                                                {connection.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2 h-10">
                                            {connection.bio ||
                                                (connection.skills &&
                                                connection.skills.length > 0
                                                    ? `Skills: ${connection.skills.join(
                                                          ", "
                                                      )}`
                                                    : "No bio available")}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {connection.skills
                                                ?.slice(0, 3)
                                                .map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            {connection.skills &&
                                                connection.skills.length >
                                                    3 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {connection.skills
                                                            .length - 3}{" "}
                                                        more
                                                    </Badge>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                    <div className="text-xs text-muted-foreground">
                                        {connection.role === "organizer"
                                            ? "Organizer"
                                            : "Individual"}
                                    </div>
                                    <div className="flex gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="rounded-full h-9 w-9"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/messages/${connection._id}`}
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Send message</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="rounded-full"
                                            asChild
                                        >
                                            <Link
                                                href={`/dashboard/profile/${connection._id}`}
                                            >
                                                <UserCheck className="h-4 w-4 mr-1" />
                                                View Profile
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
