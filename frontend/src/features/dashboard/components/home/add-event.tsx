"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/src/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/components/ui/use-toast";
import useEvent from "../../hooks/use-event";

// Zod schema for event code validation
const eventSchema = z.object({
    eventCode: z
        .string()
        .length(6, "Event code must be exactly 6 characters long.")
        .regex(/^[A-Za-z0-9]{6}$/, "Event code must be alphanumeric."),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function AddEventDialog() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { eventAttended } = useEvent();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        mode: "onChange", // Ensures real-time validation feedback
    });

    const onSubmit = async (data: EventFormData) => {
        setLoading(true);
        try {
            await eventAttended.mutateAsync(data.eventCode);
            reset();
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Event</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Event</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div>
                        <Input
                            type="text"
                            placeholder="Enter  Event Code"
                            {...register("eventCode")}
                            disabled={loading}
                            onChange={(e) => {
                                const value = e.target.value.slice(0, 6);
                                setValue("eventCode", value, {
                                    shouldValidate: true,
                                });
                            }}
                        />
                        {errors.eventCode && (
                            <p className="text-red-500 text-sm">
                                {errors.eventCode.message}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !isValid}>
                            {loading ? "Adding..." : "Add Event"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
