"use client";

import { useState, useEffect } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/ui/tabs";
import { AlertTriangle, Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import Link from "next/link";
import { Event } from "@/src/types/user";

// Import components
import EventHeader from "./event-header";
import EventSidebar from "./event-sidebar";
import EventAboutTab from "./event-about";
import EventScheduleTab from "./event-schedule";
import EventAttendeesTab from "./event-attendees";
import EventOrganizerTab from "./event-organizer";
import EventWinnersTab from "./event-winners";
import { useParams, useSearchParams } from "next/navigation";
import useEvent from "../../hooks/use-event";

export default function EventPage() {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("about");
    const { id } = useParams();
    const eventId = Array.isArray(id) ? id[0] : id;
    const { event } = useEvent(eventId);

    const handleRegister = () => {
        setIsRegistered(true);
    };

    const handleSaveToggle = () => {
        setIsSaved(!isSaved);
    };

    if (!event || event.isLoading) {
        return (
            <div className="container max-w-4xl py-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4 text-muted-foreground">
                        Loading event details...
                    </p>
                </div>
            </div>
        );
    }

    if (!event || event.isError || !event.data) {
        return (
            <div className="container max-w-4xl py-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-xl font-bold mb-2">Event Not Found</h2>
                    <p className="text-muted-foreground mb-6">
                        The event you're looking for doesn't exist or has been
                        removed.
                    </p>
                    <Link href="/dashboard/events">
                        <Button>Back to Events</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Define available tabs
    const tabs = [
        { id: "about", label: "About" },
        { id: "schedule", label: "Schedule" },
        { id: "attendees", label: "Attendees" },
        { id: "organizer", label: "Organizer" },
    ];

    // Add winners tab if available
    if (event.data.winners && event.data.winners.length > 0) {
        tabs.push({ id: "winners", label: "Winners" });
    }

    // Render the active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case "about":
                return <EventAboutTab event={event.data} />;
            case "schedule":
                return <EventScheduleTab event={event.data} />;
            case "attendees":
                return <EventAttendeesTab event={event.data} />;
            case "organizer":
                return <EventOrganizerTab event={event.data} />;
            case "winners":
                return event.data.winners && event.data.winners.length > 0 ? (
                    <EventWinnersTab event={event.data} />
                ) : null;
            default:
                return <EventAboutTab event={event.data} />;
        }
    };

    return (
        <div className="container max-w-4xl py-6">
            <EventHeader
                event={event.data}
                isSaved={isSaved}
                onSaveToggle={handleSaveToggle}
            />

            {/* Mobile sidebar first for small screens */}
            <div className="block md:hidden mb-6">
                <EventSidebar
                    event={event.data}
                    isRegistered={isRegistered}
                    onRegister={handleRegister}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    {/* Mobile tab selector */}
                    <div className="md:hidden mb-4">
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                                {tabs.map((tab) => (
                                    <SelectItem key={tab.id} value={tab.id}>
                                        {tab.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Desktop tabs */}
                    <div className="hidden md:block">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full">
                                {tabs.map((tab) => (
                                    <TabsTrigger key={tab.id} value={tab.id}>
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Tab content */}
                    <div className="mt-6">{renderTabContent()}</div>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden md:block">
                    <EventSidebar
                        event={event.data}
                        isRegistered={isRegistered}
                        onRegister={handleRegister}
                    />
                </div>
            </div>
        </div>
    );
}
