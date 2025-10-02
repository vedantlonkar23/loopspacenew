"use client";

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import type { Event, UserProfile } from "@/src/types/user";
import { format } from "date-fns";

interface ProfileEventsProps {
    profile: UserProfile | undefined;
    isLoading: boolean;
    events?: Event[];
}

export default function ProfileEvents({
    profile,
    isLoading,
    events = [],
}: ProfileEventsProps) {
    if (isLoading) {
        return <ProfileEventsSkeleton />;
    }

    if (!profile) {
        return <div>Failed to load profile</div>;
    }

    const title =
        profile.role === "organizer" ? "Events Organized" : "Events Attended";

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold">{title}</h3>
            </CardHeader>
            <CardContent>
                {events.length > 0 ? (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="flex flex-col gap-2 rounded-lg border p-4"
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-lg">
                                        {event.name}
                                    </h4>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {event.eventCode}
                                    </Badge>
                                </div>

                                {event.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {event.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 flex-shrink-0" />
                                    {format(new Date(event.date), "PPP")}
                                </div>

                                {event.location && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        {event.location}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4 flex-shrink-0" />
                                    {Array.isArray(event.attendees)
                                        ? event.attendees.length
                                        : 0}{" "}
                                    attendees
                                </div>

                                {event.tags && event.tags.length > 0 ? (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Tag className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                Tags:
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {event.tags &&
                                                JSON.parse(event.tags[0]).map(
                                                    (tag: string) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No events yet</p>
                )}
            </CardContent>
        </Card>
    );
}

function ProfileEventsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="rounded-lg border p-4">
                            <div className="flex justify-between items-start mb-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-full mb-3" />
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-4 w-40 mb-2" />
                            <Skeleton className="h-4 w-24 mb-3" />
                            <div className="mt-2">
                                <Skeleton className="h-4 w-16 mb-2" />
                                <div className="flex flex-wrap gap-1">
                                    {[1, 2, 3].map((j) => (
                                        <Skeleton
                                            key={j}
                                            className="h-5 w-16 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
