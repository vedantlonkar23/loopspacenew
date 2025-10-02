"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { UsersSearch } from "./users-search";
import { EventsSearch } from "./events-search";
import { PostsSearch } from "./posts-search";

export default function SearchView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const currentTab = searchParams.get("type") || "users";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const handleTabChange = (value: string) => {
        router.push(`/dashboard/search?${createQueryString("type", value)}`);
    };

    // Apply debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            router.push(
                `/dashboard/search?${createQueryString("q", searchQuery)}`
            );
        }, 500); // Debounce delay of 500ms

        return () => clearTimeout(timer);
    }, [searchQuery, createQueryString, router]);

    useEffect(() => {
        setSearchQuery(searchParams.get("q") || "");
    }, [searchParams]);

    return (
        <div className="container max-w-4xl py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Search</h1>
                <p className="text-muted-foreground">
                    Find people, events, and posts
                </p>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <Tabs value={currentTab} onValueChange={handleTabChange}>
                <TabsList className="mb-6 w-full">
                    <TabsTrigger value="users">People</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                </TabsList>

                {currentTab === "users" && (
                    <UsersSearch query={debouncedQuery} />
                )}
                {currentTab === "events" && (
                    <EventsSearch query={debouncedQuery} />
                )}
                {currentTab === "posts" && (
                    <PostsSearch query={debouncedQuery} />
                )}
            </Tabs>
        </div>
    );
}
