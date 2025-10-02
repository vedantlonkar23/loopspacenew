"use client";

import { Badge } from "@/src/components/ui/badge";
import type { Event } from "@/src/types/user";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/src/components/ui/accordion";

interface EventAboutTabProps {
    event: Event;
}

export default function EventAboutTab({ event }: EventAboutTabProps) {
    // For mobile, we'll use an accordion for better space management
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold sm:text-xl mb-2">
                    About this event
                </h2>
                <p className="text-sm sm:text-base whitespace-pre-line">
                    {event.description}
                </p>
            </div>

            {/* Mobile-friendly accordion for additional details */}
            <div className="md:hidden">
                <Accordion type="single" collapsible className="w-full">
                    {event.tags && (
                        <AccordionItem value="tags">
                            <AccordionTrigger className="text-sm font-medium">
                                Tags
                            </AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Tags
                                    </h2>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {JSON.parse(event.tags[0]).map(
                                            (tag: string) => (
                                                <Badge
                                                    key={tag.trim()}
                                                    variant="secondary"
                                                >
                                                    {tag.trim()}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {event.skills && event.skills.length > 0 && (
                        <AccordionItem value="skills">
                            <AccordionTrigger className="text-sm font-medium">
                                Skills
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {JSON.parse(event.skills[0]).map(
                                        (skill: string) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {skill}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {event.interests && event.interests.length > 0 && (
                        <AccordionItem value="interests">
                            <AccordionTrigger className="text-sm font-medium">
                                Interests
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {JSON.parse(event.interests[0]).map(
                                        (interest: string) => (
                                            <Badge
                                                key={interest}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {interest}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </div>

            {/* Desktop view with sections */}
            <div className="hidden md:block space-y-6">
                {event.tags && (
                    <div>
                        <h2 className="text-xl font-semibold">Tags</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {JSON.parse(event.tags[0]).map((tag: string) => (
                                <Badge key={tag.trim()} variant="secondary">
                                    {tag.trim()}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {event.skills && event.skills.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold">Skills</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {JSON.parse(event.skills[0]).map(
                                (skill: string) => (
                                    <Badge key={skill} variant="outline">
                                        {skill}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>
                )}

                {event.interests && event.interests.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold">Interests</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {JSON.parse(event.interests[0]).map(
                                (interest: string) => (
                                    <Badge key={interest} variant="outline">
                                        {interest}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
