"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Heart, Share2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/src/types/user";

interface EventHeaderProps {
    event: Event;
    isSaved: boolean;
    onSaveToggle: () => void;
}

export default function EventHeader({
    event,
    isSaved,
    onSaveToggle,
}: EventHeaderProps) {
    // Status badge variant
    const getStatusBadge = () => {
        switch (event.status) {
            case "published":
                return <Badge className="capitalize">Active</Badge>;
            case "draft":
                return (
                    <Badge variant="outline" className="capitalize">
                        Draft
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge variant="destructive" className="capitalize">
                        Cancelled
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/dashboard/events"
                    className="inline-flex items-center gap-2 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to events</span>
                    <span className="sm:hidden">Back</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="font-mono text-xs sm:text-sm"
                    >
                        {event.eventCode}
                    </Badge>
                    {getStatusBadge()}
                </div>
            </div>

            <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg sm:h-64 md:h-80">
                <Image
                    src={
                        event.bannerUrl ||
                        "/placeholder.svg?height=400&width=800"
                    }
                    alt={event.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        {event.name}
                    </h1>
                    <div className="mt-2 flex items-center gap-2">
                        <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                            <AvatarImage
                                src={event.organizer.profilePic}
                                alt={event.organizer.name}
                            />
                            <AvatarFallback>
                                {event.organizer.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground sm:text-base">
                            Organized by{" "}
                            {event.organizer.organizationName ||
                                event.organizer.name}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onSaveToggle}
                    >
                        <Heart
                            className={`h-5 w-5 ${
                                isSaved ? "fill-red-500 text-red-500" : ""
                            }`}
                        />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </>
    );
}
