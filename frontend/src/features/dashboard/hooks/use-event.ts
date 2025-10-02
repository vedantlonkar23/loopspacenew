"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/src/lib/fetchClient";
import { eventApi } from "../apis/event-api";

export default function useEvent(eventCode?: string) {
    const queryClient = useQueryClient();

    const eventAttended = useMutation({
        mutationFn: (eventCode: string) => eventApi.eventAttended(eventCode),
        onSuccess: () => {
            toast.success("Event added successfully !");
        },
        onError: (data) => {
            toast.error(data.message);
        },
    });

    const event = useQuery({
        queryKey: ["event", eventCode],
        queryFn: () => eventApi.getEvent(eventCode),
        enabled: !!eventCode,
    });

    return {
        eventAttended,
        event,
    };
}
