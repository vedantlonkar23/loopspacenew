import { useQuery, useQueryClient } from "@tanstack/react-query";
import { organizerApi } from "../apis/organizer-api";

export default function useOrganizer() {
    const queryClient = useQueryClient();

    const events = useQuery({
        queryKey: ["organizer-events"],
        queryFn: () => organizerApi.getOrgnizerEvents(),
        enabled:
            typeof window !== "undefined" && !!localStorage.getItem("token"),
    });

    return { events };
}
