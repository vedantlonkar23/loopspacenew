"use client";

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import type { UserProfile } from "@/src/types/user";

interface ProfileSkillsProps {
    profile: UserProfile | undefined;
    isLoading: boolean;
}

export default function ProfileSkills({
    profile,
    isLoading,
}: ProfileSkillsProps) {
    if (isLoading) {
        return <ProfileSkillsSkeleton />;
    }

    if (!profile) {
        return <div>Failed to load profile</div>;
    }

    const skills = profile.skills || [];
    const interests = profile.interests || [];
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Skills</h3>
                </CardHeader>
                <CardContent>
                    {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            No skills added yet
                        </p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Interests</h3>
                </CardHeader>
                <CardContent>
                    {interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {interests.map((interest) => (
                                <Badge key={interest} variant="secondary">
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            No interests added yet
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function ProfileSkillsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-6 w-20 rounded-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
