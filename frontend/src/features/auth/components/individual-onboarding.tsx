"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { X } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
    profilePic: z
        .instanceof(File, { message: "Profile picture is required" })
        .refine(
            (file) => file.size <= 2 * 1024 * 1024,
            "Profile picture must be less than 2MB"
        ),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    interests: z.array(z.string()).min(1, "At least one interest is required"),
});

export default function IndividualOnboarding() {
    const router = useRouter();
    const [profilePic, setProfilePic] = useState<File | undefined>(undefined);
    const [preview, setPreview] = useState<string>(
        "/placeholder.svg?height=100&width=100"
    );
    const [bio, setBio] = useState("");
    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [interest, setInterest] = useState("");
    const [interests, setInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];

            // Check file size (4MB = 4 * 1024 * 1024 bytes)
            const maxSize = 4 * 1024 * 1024; // 4MB in bytes
            if (file.size > maxSize) {
                setErrors({
                    ...errors,
                    profilePic: "Profile picture must be less than 4MB",
                });
                return;
            }

            setProfilePic(file);
            setPreview(URL.createObjectURL(file));

            // Clear any previous error for profile pic
            if (errors.profilePic) {
                const newErrors = { ...errors };
                delete newErrors.profilePic;
                setErrors(newErrors);
            }
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Validate form data using zod
        const data = { profilePic, bio, skills, interests };
        const result = profileSchema.safeParse(data);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path.length > 0) {
                    const field = err.path[0] as string;
                    fieldErrors[field] = err.message;
                }
            });
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }

        // Build FormData to include file and other fields
        const formData = new FormData();
        if (profilePic) {
            formData.append("profilePic", profilePic);
        }
        formData.append("bio", bio);
        skills.forEach((s) => formData.append("skills[]", s));
        interests.forEach((i) => formData.append("interests[]", i));

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/update-user-profile`,
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

            if (!response.ok) {
                const errorResponse = await response.json();
                setErrors({
                    general: errorResponse.message || "Something went wrong",
                });
                setLoading(false);
                return;
            }

            setLoading(false);
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            setErrors({ general: "An unexpected error occurred" });
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-3xl py-10">
            <h1 className="text-3xl font-bold">Complete your profile</h1>
            <p className="text-muted-foreground">Tell us more about yourself</p>

            {errors.general && (
                <p className="text-red-500 text-sm mb-4">{errors.general}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={preview} alt="Profile" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicUpload}
                        />
                    </div>
                    {errors.profilePic && (
                        <p className="text-red-500 text-sm">
                            {errors.profilePic}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                    />
                    {errors.bio && (
                        <p className="text-red-500 text-sm">{errors.bio}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a skill"
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                        />
                        <Button type="button" onClick={addSkill}>
                            Add
                        </Button>
                    </div>
                    {errors.skills && (
                        <p className="text-red-500 text-sm">{errors.skills}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                            <Badge key={s} variant="secondary">
                                {s}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(s)}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Interests</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add an interest"
                            value={interest}
                            onChange={(e) => setInterest(e.target.value)}
                        />
                        <Button type="button" onClick={addInterest}>
                            Add
                        </Button>
                    </div>
                    {errors.interests && (
                        <p className="text-red-500 text-sm">
                            {errors.interests}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {interests.map((i) => (
                            <Badge key={i} variant="secondary">
                                {i}
                                <button
                                    type="button"
                                    onClick={() => removeInterest(i)}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving..." : "Complete Profile"}
                </Button>
            </form>
        </div>
    );
}
