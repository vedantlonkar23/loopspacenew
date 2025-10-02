"use client";

import { format } from "date-fns";
import type { Event } from "@/src/types/user";
import { Card, CardContent } from "@/src/components/ui/card";

export default function EventScheduleTab({ event }: { event: Event }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold sm:text-xl">Event Schedule</h2>

            <h3>Start Time : {event.startTime}</h3>
            <h3>End Time : {event.endTime}</h3>
        </div>
    );
}
