"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/ui/tabs";
import {
    CalendarDays,
    Users,
    Ticket,
    TrendingUp,
    ArrowRight,
    PlusCircle,
    AlertCircle,
    Eye,
    BarChart,
    Edit,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { format } from "date-fns";
import useOrganizer from "../../hooks/use-organizer";
import { Event } from "@/src/types/user";
import Image from "next/image";

export default function OrganizerDashboard() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const {
        events: { data, isLoading, error },
    } = useOrganizer();

    // Separate upcoming and past events
    const { upcomingEvents, pastEvents } = useMemo(() => {
        if (!data) return { upcomingEvents: [], pastEvents: [] };

        const now = new Date();
        const upcoming = data.filter((event) => new Date(event.date) >= now);
        const past = data.filter((event) => new Date(event.date) < now);

        return {
            upcomingEvents: upcoming.slice(0, 3), // Limit to 3 events
            pastEvents: past.slice(0, 3), // Limit to 3 events
        };
    }, [data]);

    const renderEventCard = (event: Event, isPast = false) => (
        <Card key={event._id}>
            <CardHeader className="pb-2">
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>
                    {format(new Date(event.date), "MMMM d-dd, yyyy")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 h-40 rounded-md bg-muted flex justify-center items-center">
                    {event.bannerUrl ? (
                        <Image
                            src={event.bannerUrl}
                            width={200}
                            height={100}
                            className="h-full"
                            alt={event.name}
                        />
                    ) : (
                        <Skeleton className="h-40 w-full rounded-md" />
                    )}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{event.location || "Online"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Attendees:
                        </span>
                        <span>
                            {event.attendees.length}/{event.capacity || "∞"}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span
                            className={`font-medium ${
                                event.status === "published"
                                    ? "text-green-600"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {event.status.charAt(0).toUpperCase() +
                                event.status.slice(1)}
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    {isPast ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                asChild
                            >
                                <Link
                                    href={`/organizer/dashboard/events/${event._id}/analytics`}
                                >
                                    <BarChart className="h-4 w-4 mr-1" />
                                    Analytics
                                </Link>
                            </Button>
                            <Button size="sm" className="flex-1" asChild>
                                <Link
                                    href={`/organizer/dashboard/events/${event._id}`}
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                asChild
                            >
                                <Link
                                    href={`/organizer/dashboard/events/${event._id}/edit`}
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Link>
                            </Button>
                            <Button size="sm" className="flex-1" asChild>
                                <Link
                                    href={`/organizer/dashboard/events/${event._id}`}
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Manage
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    // Render event card skeletons
    const renderEventCardSkeletons = () =>
        Array(3)
            .fill(0)
            .map((_, i) => (
                <Card key={`skeleton-${i}`}>
                    <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-48 mb-1" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="mb-4 h-40 w-full rounded-md" />
                        <div className="space-y-2">
                            {Array(3)
                                .fill(0)
                                .map((_, j) => (
                                    <div
                                        key={j}
                                        className="flex justify-between text-sm"
                                    >
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Skeleton className="h-9 flex-1" />
                            <Skeleton className="h-9 flex-1" />
                        </div>
                    </CardContent>
                </Card>
            ));

    if (!isClient) return null;
    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load dashboard data. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Link href="/organizer/dashboard/events/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Events
                            </CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                +2 from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Attendees
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">
                                +256 from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tickets Sold
                            </CardTitle>
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">845</div>
                            <p className="text-xs text-muted-foreground">
                                +124 from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Revenue
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$12,450</div>
                            <p className="text-xs text-muted-foreground">
                                +8% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-6">
                <Tabs defaultValue="upcoming">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="upcoming">
                                Upcoming Events
                            </TabsTrigger>
                            <TabsTrigger value="past">Past Events</TabsTrigger>
                        </TabsList>
                        <Link
                            href="/organizer/dashboard/events"
                            className="text-sm font-medium"
                        >
                            View all
                            <ArrowRight className="ml-1 inline h-4 w-4" />
                        </Link>
                    </div>
                    <TabsContent value="upcoming" className="mt-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {isLoading ? (
                                renderEventCardSkeletons()
                            ) : upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) =>
                                    renderEventCard(event)
                                )
                            ) : (
                                <div className="col-span-full text-center p-8 border rounded-md">
                                    <p className="text-muted-foreground">
                                        No upcoming events found.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="past" className="mt-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {isLoading ? (
                                renderEventCardSkeletons()
                            ) : pastEvents.length > 0 ? (
                                pastEvents.map((event) =>
                                    renderEventCard(event, true)
                                )
                            ) : (
                                <div className="col-span-full text-center p-8 border rounded-md">
                                    <p className="text-muted-foreground">
                                        No past events found.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
