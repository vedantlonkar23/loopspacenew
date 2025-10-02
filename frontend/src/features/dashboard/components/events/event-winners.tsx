"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Award } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/src/types/user";

interface EventWinnersTabProps {
    event: Event;
}

export default function EventWinnersTab({ event }: EventWinnersTabProps) {
    if (!event.winners || event.winners.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    No winners have been announced yet.
                </p>
            </div>
        );
    }

    // For mobile, highlight the first place winner and show others in a simpler format
    const firstPlaceWinner = event.winners[0];
    const otherWinners = event.winners.slice(1);

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold sm:text-xl flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Event Winners
            </h2>

            {/* First place winner - featured prominently */}
            <Card className="border-yellow-500">
                <CardContent className="p-4 flex flex-col items-center text-center">
                    <Badge className="mb-3 mt-2">1st Place</Badge>
                    <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage
                            src={firstPlaceWinner.profilePic}
                            alt={firstPlaceWinner.name}
                        />
                        <AvatarFallback>
                            {firstPlaceWinner.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{firstPlaceWinner.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 truncate max-w-full">
                        {firstPlaceWinner.email}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mt-auto"
                    >
                        <Link
                            href={`/dashboard/profile/${firstPlaceWinner._id}`}
                        >
                            View Profile
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Other winners in a more compact format */}
            {otherWinners.length > 0 && (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {otherWinners.map((winner, index) => (
                        <Card key={winner._id}>
                            <CardContent className="p-3 flex items-center gap-3">
                                <Badge
                                    variant="secondary"
                                    className="flex-shrink-0"
                                >
                                    {index === 0 ? "2nd" : "3rd"}
                                </Badge>
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage
                                        src={winner.profilePic}
                                        alt={winner.name}
                                    />
                                    <AvatarFallback>
                                        {winner.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">
                                        {winner.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {winner.email}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="flex-shrink-0 h-8 px-2"
                                >
                                    <Link
                                        href={`/dashboard/profile/${winner._id}`}
                                    >
                                        View
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
