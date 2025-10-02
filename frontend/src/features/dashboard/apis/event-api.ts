import { fetchClient } from "@/src/lib/fetchClient";
import { Event } from "@/src/types/user";

export const eventApi = {
    eventAttended: async (eventCode: string) => {
        return fetchClient.post("/event/event-attended", {
            eventCode: eventCode,
        });
    },
    getEvent: async (eventCode?: string) => {
        return fetchClient.get<Event>(`/event/event/${eventCode}`);
    },
};
