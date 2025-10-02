"use client";

import { useState } from "react";
import type { Event } from "@/src/types/user";
import AttendeeList from "./attendee-list";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/ui/tabs";

interface EventAttendeesTabProps {
    event: Event;
}

export default function EventAttendeesTab({ event }: EventAttendeesTabProps) {
    const [activeList, setActiveList] = useState("attendees");
    const hasVolunteers = event.volunteers && event.volunteers.length > 0;

    return (
        <div className="space-y-6">
            {/* For mobile, use a simpler tab interface for attendees/volunteers */}
            {hasVolunteers && (
                <Tabs
                    value={activeList}
                    onValueChange={setActiveList}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="attendees">
                            Attendees ({event.attendees.length})
                        </TabsTrigger>
                        <TabsTrigger value="volunteers">
                            Volunteers ({event.volunteers?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="attendees" className="mt-4">
                        <AttendeeList
                            attendees={event.attendees}
                            title="Attendees"
                            emptyMessage="No one has registered for this event yet"
                            showTitle={false}
                        />
                    </TabsContent>

                    <TabsContent value="volunteers" className="mt-4">
                        <AttendeeList
                            attendees={event.volunteers || []}
                            title="Volunteers"
                            emptyMessage="No volunteers for this event"
                            showTitle={false}
                        />
                    </TabsContent>
                </Tabs>
            )}

            {/* If no volunteers, just show attendees */}
            {!hasVolunteers && (
                <AttendeeList
                    attendees={event.attendees}
                    title="Attendees"
                    emptyMessage="No one has registered for this event yet"
                />
            )}
        </div>
    );
}
