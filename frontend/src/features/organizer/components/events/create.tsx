"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/ui/tabs";
import { Calendar } from "@/src/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import {
    X,
    Upload,
    CalendarIcon,
    MapPin,
    Clock,
    DollarSign,
    Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

// Define the schema for event validation based on Mongoose schema
const eventSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Event name must be at least 3 characters" }),
    description: z.string().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Invalid time format",
    }),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Invalid time format",
    }),
    location: z.string().optional(),
    capacity: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Capacity must be a positive number",
        }),
    ticketPrice: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Price must be a non-negative number",
        }),
    eventType: z.enum(
        ["conference", "workshop", "seminar", "networking", "other"],
        {
            errorMap: () => ({ message: "Please select a valid event type" }),
        }
    ),
    tags: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
});

export default function CreateEvent() {
    const router = useRouter();
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventType, setEventType] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [date, setDate] = useState<Date>();
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [interest, setInterest] = useState("");
    const [interests, setInterests] = useState<string[]>([]);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState("details");

    const addTag = () => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const addSkill = () => {
        if (skill && !skills.includes(skill)) {
            setSkills([...skills, skill]);
            setSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter((s) => s !== skillToRemove));
    };

    const addInterest = () => {
        if (interest && !interests.includes(interest)) {
            setInterests([...interests, interest]);
            setInterest("");
        }
    };

    const removeInterest = (interestToRemove: string) => {
        setInterests(interests.filter((i) => i !== interestToRemove));
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBannerFile(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Create form data to send to backend
            const formData = new FormData();

            // Add basic fields
            formData.append("name", eventName);
            formData.append("description", eventDescription);
            formData.append("eventType", eventType);
            formData.append("location", location);
            formData.append("capacity", capacity);
            formData.append("ticketPrice", ticketPrice);

            // Add date and time
            if (date) {
                formData.append("date", date.toISOString());
            }
            formData.append("startTime", startTime);
            formData.append("endTime", endTime);

            // Add arrays as JSON strings
            formData.append("tags", JSON.stringify(tags));
            formData.append("skills", JSON.stringify(skills));
            formData.append("interests", JSON.stringify(interests));

            // Add banner file if selected
            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            // Validate the data client-side before sending
            const validationData = {
                name: eventName,
                description: eventDescription,
                date: date ? date.toISOString() : "",
                startTime,
                endTime,
                location,
                capacity,
                ticketPrice,
                eventType,
                tags,
                skills,
                interests,
            };

            const validationResult = eventSchema.safeParse(validationData);

            if (!validationResult.success) {
                const errors = validationResult.error.flatten().fieldErrors;
                const firstError =
                    Object.values(errors)[0]?.[0] || "Validation failed";
                throw new Error(firstError);
            }

            // Send the form data to the backend API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/event/create-event`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create event");
            }

            // Redirect to events page on success
            router.push("/organizer/dashboard/events");
        } catch (err) {
            console.error("Error creating event:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create Event</h1>
                <p className="text-muted-foreground">
                    Fill in the details to create a new event
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Tabs
                    value={currentTab}
                    defaultValue="details"
                    className="w-full"
                >
                    <TabsList className="hidden md:grid mb-6  w-full grid-cols-3">
                        <TabsTrigger
                            onClick={() => setCurrentTab("details")}
                            value="details"
                        >
                            Event Details
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setCurrentTab("schedule")}
                            value="schedule"
                        >
                            Schedule & Location
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setCurrentTab("additional")}
                            value="additional"
                        >
                            Additional Info
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                                <CardDescription>
                                    Provide the basic information about your
                                    event
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Event Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Enter event name"
                                        value={eventName}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => setEventName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Event Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your event"
                                        value={eventDescription}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setEventDescription(e.target.value)
                                        }
                                        rows={5}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eventType">
                                        Event Type
                                    </Label>
                                    <Select
                                        name="eventType"
                                        onValueChange={setEventType}
                                        value={eventType}
                                    >
                                        <SelectTrigger id="eventType">
                                            <SelectValue placeholder="Select event type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="conference">
                                                Conference
                                            </SelectItem>
                                            <SelectItem value="workshop">
                                                Workshop
                                            </SelectItem>
                                            <SelectItem value="seminar">
                                                Seminar
                                            </SelectItem>
                                            <SelectItem value="networking">
                                                Networking
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="event-tags">
                                        Event Tags
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="event-tags"
                                            placeholder="Add a tag"
                                            value={tag}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => setTag(e.target.value)}
                                            onKeyDown={(
                                                e: React.KeyboardEvent
                                            ) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addTag}>
                                            Add
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tags.map((t) => (
                                            <Badge
                                                key={t}
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                {t}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(t)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="banner">Event Banner</Label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-32 w-full rounded-md border border-dashed border-muted-foreground flex items-center justify-center overflow-hidden"
                                            style={{
                                                backgroundImage: bannerPreview
                                                    ? `url(${bannerPreview})`
                                                    : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        >
                                            {!bannerPreview && (
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="h-32 flex flex-col justify-center">
                                            <Input
                                                id="banner"
                                                name="banner"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleBannerChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "banner"
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                Upload Image
                                            </Button>
                                            {bannerFile && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="mt-2"
                                                    onClick={() => {
                                                        setBannerFile(null);
                                                        setBannerPreview(null);
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Recommended size: 1200x600px. Max size:
                                        5MB.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/organizer/dashboard/events"
                                        )
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setCurrentTab("schedule")}
                                >
                                    Next
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="schedule">
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule & Location</CardTitle>
                                <CardDescription>
                                    Set when and where your event will take
                                    place
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Event Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date
                                                    ? format(date, "PPP")
                                                    : "Select date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">
                                            Start Time
                                        </Label>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="startTime"
                                                name="startTime"
                                                type="time"
                                                value={startTime}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setStartTime(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="endTime">
                                            End Time
                                        </Label>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="endTime"
                                                name="endTime"
                                                type="time"
                                                value={endTime}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => setEndTime(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <div className="flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="Enter event location"
                                            value={location}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => setLocation(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity</Label>
                                    <Input
                                        id="capacity"
                                        name="capacity"
                                        type="number"
                                        placeholder="Maximum number of attendees"
                                        value={capacity}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => setCapacity(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ticketPrice">
                                        Ticket Price (₹)
                                    </Label>
                                    <div className="flex items-center">
                                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="ticketPrice"
                                            name="ticketPrice"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            value={ticketPrice}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => setTicketPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Enter 0 for free events
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setCurrentTab("details");
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setCurrentTab("additional")}
                                >
                                    Next
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="additional">
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                                <CardDescription>
                                    Add skills and interests relevant to your
                                    event
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="event-skills">
                                        Required Skills
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="event-skills"
                                            placeholder="Add a skill"
                                            value={skill}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => setSkill(e.target.value)}
                                            onKeyDown={(
                                                e: React.KeyboardEvent
                                            ) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addSkill();
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={addSkill}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {skills.map((s) => (
                                            <Badge
                                                key={s}
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                {s}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(s)
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="event-interests">
                                        Relevant Interests
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="event-interests"
                                            placeholder="Add an interest"
                                            value={interest}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => setInterest(e.target.value)}
                                            onKeyDown={(
                                                e: React.KeyboardEvent
                                            ) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addInterest();
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={addInterest}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {interests.map((i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                {i}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeInterest(i)
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setCurrentTab("schedule");
                                    }}
                                >
                                    Back
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Event"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    );
}
