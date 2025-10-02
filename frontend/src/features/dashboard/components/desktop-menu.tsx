import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import { Home, Search, User, LogOut, Menu, LayoutDashboard } from "lucide-react";
import useAuth from "@/src/features/auth/hooks/use-auth";

export default function DesktopMenu() {
    const { userProfile } = useAuth();
    return (
        <aside className="fixed hidden h-screen w-64 border-r bg-background lg:block">
            <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b px-4">
                    <Link href="/dashboard" className="text-xl font-bold">
                        LoopSpace
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-4">
                    <nav className="space-y-2 px-2">
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <Home className="mr-2 h-5 w-5" />
                                Home
                            </Button>
                        </Link>
                        <Link href="/dashboard/search">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <Search className="mr-2 h-5 w-5" />
                                Search
                            </Button>
                        </Link>
                        <Link href="/dashboard/profile">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <User className="mr-2 h-5 w-5" />
                                Profile
                            </Button>
                        </Link>
                        {userProfile.data?.role === "organizer" && (
                            <Link href="/organizer/dashboard">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    <LayoutDashboard className="mr-2 h-5 w-5" />
                                    Organizer
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="border-t p-4">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage
                                src={
                                    userProfile.data?.profilePic ||
                                    "/placeholder.svg?height=40&width=40"
                                }
                                alt="User"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">
                                {userProfile.data?.name}
                            </p>
                            <p
                                className="text-sm text-muted-foreground truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                                title={userProfile.data?.email}
                            >
                                {userProfile.data?.email}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500"
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                localStorage.clear();
                                window.location.href = "/auth/login";
                            }
                        }}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </div>
        </aside>
    );
}
