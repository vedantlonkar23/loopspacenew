"use client";

import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import {
    PlusCircle,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    MoreHorizontal,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import useOrganizer from "../../hooks/use-organizer";

export default function Events() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [eventTypeFilter, setEventTypeFilter] = useState("all");

    const {
        events: { data, isLoading, error },
    } = useOrganizer();

    // Filter events based on search query and filters
    const filteredEvents = useMemo(() => {
        if (!data) return [];

        return data.filter((event) => {
            // Filter by search query
            const matchesSearch =
                searchQuery === "" ||
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.eventCode
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (event.description &&
                    event.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                (event.location &&
                    event.location
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

            // Filter by status
            const matchesStatus =
                statusFilter === "all" || event.status === statusFilter;

            // Filter by event type
            const matchesEventType =
                eventTypeFilter === "all" ||
                event.eventType === eventTypeFilter;

            return matchesSearch && matchesStatus && matchesEventType;
        });
    }, [data, searchQuery, statusFilter, eventTypeFilter]);

    // Format price display
    const formatPrice = (price: number | undefined) => {
        if (price === undefined) return "TBD";
        return price === 0 ? "Free" : `₹ ${price}`;
    };

    // Get badge variant based on status
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "active":
                return "default";
            case "draft":
                return "outline";
            case "completed":
                return "secondary";
            case "cancelled":
                return "destructive";
            default:
                return "default";
        }
    };

    // Render loading skeletons
    const renderSkeletons = () => {
        return Array(5)
            .fill(0)
            .map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </TableCell>
                </TableRow>
            ));
    };

    // Render mobile skeletons
    const renderMobileSkeletons = () => {
        return Array(3)
            .fill(0)
            .map((_, index) => (
                <Card key={`mobile-skeleton-${index}`}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <Skeleton className="h-5 w-40 mb-1" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            {Array(6)
                                .fill(0)
                                .map((_, i) => (
                                    <div key={i}>
                                        <Skeleton className="h-3 w-20 mb-1" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Skeleton className="h-8 flex-1" />
                            <Skeleton className="h-8 flex-1" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </CardContent>
                </Card>
            ));
    };

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load events. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Events</h1>
                <Link href="/organizer/dashboard/events/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, code, or location..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select
                        defaultValue="all"
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        defaultValue="all"
                        value={eventTypeFilter}
                        onValueChange={setEventTypeFilter}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="Event Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="conference">
                                Conference
                            </SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="networking">
                                Networking
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden sm:flex"
                        disabled={isLoading}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="rounded-md border hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event Code</TableHead>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Attendees</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            renderSkeletons()
                        ) : filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <TableRow key={event._id}>
                                    <TableCell className="font-mono text-sm">
                                        {event.eventCode}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {event.name}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(event.date),
                                            "MMM d, yyyy"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {event.location || "Online"}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {event.eventType}
                                    </TableCell>
                                    <TableCell>
                                        {event.attendees.length}/
                                        {event.capacity || "∞"}
                                    </TableCell>
                                    <TableCell>
                                        {formatPrice(event.ticketPrice)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getStatusBadgeVariant(
                                                event.status
                                            )}
                                            className="capitalize"
                                        >
                                            {event.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/organizer/dashboard/events/${event._id}/edit`}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/organizer/dashboard/events/${event._id}`}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download QR Code
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        Cancel Event
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="h-24 text-center"
                                >
                                    No events found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {isLoading ? (
                    renderMobileSkeletons()
                ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <Card key={event._id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium">
                                            {event.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {event.eventCode}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={getStatusBadgeVariant(
                                            event.status
                                        )}
                                        className="capitalize"
                                    >
                                        {event.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                    <div>
                                        <p className="text-muted-foreground">
                                            Date
                                        </p>
                                        <p>
                                            {format(
                                                new Date(event.date),
                                                "MMM d, yyyy"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">
                                            Time
                                        </p>
                                        <p>
                                            {event.startTime} - {event.endTime}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">
                                            Location
                                        </p>
                                        <p>{event.location || "Online"}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">
                                            Type
                                        </p>
                                        <p className="capitalize">
                                            {event.eventType}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">
                                            Attendees
                                        </p>
                                        <p>
                                            {event.attendees.length}/
                                            {event.capacity || "∞"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">
                                            Price
                                        </p>
                                        <p>{formatPrice(event.ticketPrice)}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-2">
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
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        asChild
                                    >
                                        <Link
                                            href={`/organizer/dashboard/events/${event._id}`}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download QR Code
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">
                                                Cancel Event
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center p-8 border rounded-md">
                        <p className="text-muted-foreground">
                            No events found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
