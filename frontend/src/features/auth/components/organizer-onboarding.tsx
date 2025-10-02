"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { X, Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const organizerSchema = z.object({
    organizationName: z
        .string()
        .min(3, "Organization name must be at least 3 characters"),
    organizationDescription: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    phoneNumber: z
        .string()
        .regex(/^\+?\d{10,15}$/, "Enter a valid phone number"),
    eventTypes: z
        .array(z.string())
        .min(1, "At least one event type is required"),
    location: z.string().min(3, "Location must be at least 3 characters"),
    organizationLogo: z
        .instanceof(File)
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "File size must be less than 2MB"
        )
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only JPG, PNG, and WEBP formats are allowed"
        ),
});

type OrganizerFormValues = z.infer<typeof organizerSchema>;

export default function OrganizerOnboarding() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [eventType, setEventType] = useState("");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<OrganizerFormValues>({
        resolver: zodResolver(organizerSchema),
        defaultValues: {
            organizationName: "",
            organizationDescription: "",
            website: "",
            phoneNumber: "",
            eventTypes: [],
            location: "",
            organizationLogo: undefined,
        },
    });

    const eventTypes = watch("eventTypes");

    const addEventType = () => {
        if (eventType && !eventTypes.includes(eventType)) {
            setValue("eventTypes", [...eventTypes, eventType]);
            setEventType("");
        }
    };

    const removeEventType = (typeToRemove: string) => {
        setValue(
            "eventTypes",
            eventTypes.filter((type) => type !== typeToRemove)
        );
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue("organizationLogo", file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: OrganizerFormValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("organizationName", data.organizationName);
            formData.append(
                "organizationDescription",
                data.organizationDescription
            );
            formData.append("phoneNumber", data.phoneNumber);
            if (data.website) {
                formData.append("website", data.website);
            }
            formData.append("location", data.location);
            if (data.organizationLogo) {
                formData.append("organizationLogo", data.organizationLogo);
            }
            data.eventTypes.forEach((type) =>
                formData.append("eventTypes[]", type)
            );

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/update-organizer-profile`,
                {
                    method: "PUT",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to update profile");

            router.push("/organizer/dashboard");
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-3xl py-10">
            <h1 className="text-3xl font-bold">
                Complete your organizer profile
            </h1>
            <p className="text-muted-foreground mb-8">
                Tell us more about your organization to get started
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <Label>Organization Logo</Label>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={logoPreview || "/placeholder.svg"}
                                alt="Logo"
                            />
                            <AvatarFallback>O</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Accepted formats: JPG, PNG, WEBP. Max size: 2MB
                            </p>
                        </div>
                    </div>
                    {errors.organizationLogo && (
                        <p className="text-red-500 text-sm">
                            {errors.organizationLogo.message}
                        </p>
                    )}
                </div>
                <div className="space-y-4">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                        id="organizationName"
                        placeholder="e.g. Acme Events"
                        {...register("organizationName")}
                    />
                    {errors.organizationName && (
                        <p className="text-red-500 text-sm">
                            {errors.organizationName.message}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label htmlFor="organizationDescription">
                        Organization Description
                    </Label>
                    <Textarea
                        id="organizationDescription"
                        placeholder="Tell us about your organization"
                        rows={4}
                        {...register("organizationDescription")}
                    />
                    {errors.organizationDescription && (
                        <p className="text-red-500 text-sm">
                            {errors.organizationDescription.message}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                        id="website"
                        placeholder="https://www.example.com"
                        {...register("website")}
                    />
                    {errors.website && (
                        <p className="text-red-500 text-sm">
                            {errors.website.message}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        placeholder="+1234567890"
                        {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                        <p className="text-red-500 text-sm">
                            {errors.phoneNumber.message}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="e.g. New York, NY"
                        {...register("location")}
                    />
                    {errors.location && (
                        <p className="text-red-500 text-sm">
                            {errors.location.message}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label>Event Types</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add event type"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addEventType();
                                }
                            }}
                        />
                        <Button type="button" onClick={addEventType}>
                            Add
                        </Button>
                    </div>
                    {errors.eventTypes && (
                        <p className="text-red-500 text-sm">
                            {errors.eventTypes.message}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {eventTypes.map((type) => (
                            <Badge
                                key={type}
                                variant="secondary"
                                className="gap-1"
                            >
                                {type}
                                <button
                                    type="button"
                                    onClick={() => removeEventType(type)}
                                    aria-label={`Remove ${type}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Saving...
                        </>
                    ) : (
                        "Complete Profile"
                    )}
                </Button>
            </form>
        </div>
    );
}
