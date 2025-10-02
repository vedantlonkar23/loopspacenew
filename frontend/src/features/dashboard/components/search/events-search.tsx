"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Calendar, Clock, MapPin, Search, Tag, Users } from "lucide-react";
import type { Event } from "@/src/types/user";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/src/components/ui/skeleton";

interface EventsSearchProps {
    query: string;
}

export function EventsSearch({ query }: EventsSearchProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            if (!query) {
                setEvents([]);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_SERVER_URL
                    }/search/events?query=${encodeURIComponent(query)}`,
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch events");
                const data = await response.json();
                setEvents(data.data);
            } catch (err) {
                setError("Failed to load events");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [query]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <Skeleton className="h-48 md:h-full md:w-1/3 rounded-none" />
                            <div className="p-4 md:p-6 w-full md:w-2/3">
                                <Skeleton className="h-6 w-3/4 mb-4" />
                                <div className="flex gap-2 mb-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <div className="flex gap-2 mb-4">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                                <Skeleton className="h-9 w-28" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-8">{error}</div>;
    }

    if (!query) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Enter a search term to find events
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground">
                    Try adjusting your search terms
                </p>
            </div>
        );
    }

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    return (
        <div className="space-y-6">
            {events.map((event) => (
                <Card
                    key={event._id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                >
                    <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                            <Image
                                src={
                                    event.bannerUrl ||
                                    "/placeholder.svg?height=300&width=400"
                                }
                                alt={event.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
                                    {event.eventType}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between p-4 md:p-6 w-full md:w-2/3">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                                    {event.name}
                                </h3>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                                        {formatDate(event.date)}
                                    </div>
                                    {event.startTime && (
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-primary" />
                                            {event.startTime}{" "}
                                            {event.endTime &&
                                                `- ${event.endTime}`}
                                        </div>
                                    )}
                                    {event.location && (
                                        <div className="flex items-center col-span-2">
                                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                                            <span className="truncate">
                                                {event.location}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-4 w-4 text-primary" />
                                        {event.attendees.length}{" "}
                                        {event.attendees.length === 1
                                            ? "attendee"
                                            : "attendees"}
                                    </div>
                                </div>

                                {event.description && (
                                    <p className="text-sm mb-4 line-clamp-2">
                                        {event.description}
                                    </p>
                                )}

                                {event.tags && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className="flex items-center text-sm text-muted-foreground mr-1">
                                            <Tag className="h-3 w-3 mr-1" />
                                            Tags:
                                        </div>
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
                                )}
                            </div>

                            <div className="flex gap-3 mt-2">
                                <Link
                                    href={`/dashboard/events/${event.eventCode}`}
                                    passHref
                                >
                                    <Button>View Details</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
