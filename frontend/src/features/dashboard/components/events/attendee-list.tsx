"use client";

import { useState } from "react";
import type { UserProfile } from "@/src/types/user";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Mail, User } from "lucide-react";
import Link from "next/link";

interface AttendeeListProps {
    attendees: UserProfile[];
    title?: string;
    emptyMessage?: string;
    showTitle?: boolean;
}

export default function AttendeeList({
    attendees,
    title = "Attendees",
    emptyMessage = "No attendees yet",
    showTitle = true,
}: AttendeeListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Reduced for mobile

    // Filter attendees based on search query
    const filteredAttendees = attendees.filter(
        (attendee) =>
            attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (attendee.role === "organizer" &&
                attendee.organizationName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()))
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAttendees = filteredAttendees.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    // Handle page changes
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="space-y-3">
            {showTitle && (
                <h2 className="text-lg font-semibold sm:text-xl">
                    {title} ({filteredAttendees.length})
                </h2>
            )}

            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search attendees..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                    }}
                />
            </div>

            {paginatedAttendees.length > 0 ? (
                <div className="space-y-3">
                    <div className="divide-y rounded-md border">
                        {paginatedAttendees.map((attendee) => (
                            <div key={attendee._id} className="p-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                        <AvatarImage
                                            src={attendee.profilePic}
                                            alt={attendee.name}
                                        />
                                        <AvatarFallback>
                                            {attendee.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">
                                            {attendee.name}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            <span className="truncate">
                                                {attendee.email}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            attendee.role === "organizer"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="capitalize text-xs"
                                    >
                                        {attendee.role}
                                    </Badge>
                                </div>

                                {attendee.role === "organizer" &&
                                    attendee.organizationName && (
                                        <div className="text-xs sm:text-sm text-muted-foreground pl-11 mb-2 truncate">
                                            {attendee.organizationName}
                                        </div>
                                    )}

                                <div className="pl-11">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="h-7 px-2 text-xs"
                                    >
                                        <Link
                                            href={`/dashboard/profile/${attendee._id}`}
                                        >
                                            <User className="h-3 w-3 mr-1" />
                                            View Profile
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simplified pagination controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="text-xs sm:text-sm">
                                Page {currentPage} of {totalPages}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-md border py-6">
                    <User className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                        {emptyMessage}
                    </p>
                    {searchQuery && (
                        <Button
                            variant="link"
                            onClick={() => setSearchQuery("")}
                            className="mt-1 text-xs h-8"
                        >
                            Clear search
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
