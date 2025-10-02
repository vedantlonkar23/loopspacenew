import { fetchClient } from "@/src/lib/fetchClient";
import { Event } from "@/src/types/user";

export const organizerApi = {
    getOrgnizerEvents: async () => {
        return fetchClient.get<Event[]>("/event/get-events-organizer");
    },
};

