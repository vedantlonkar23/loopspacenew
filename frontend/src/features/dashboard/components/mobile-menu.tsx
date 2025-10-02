import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import {
    Home,
    Search,
    User,
    LogOut,
    Menu,
    LayoutDashboard,
} from "lucide-react";
import useAuth from "../../auth/hooks/use-auth";

export default function MobileMenu() {
    const { userProfile } = useAuth();
    useEffect(() => {
        if (userProfile.data && !userProfile.data.isProfileComplete) {
            window.location.href = "/auth/onboarding/individual";
        }
    }, []);
    return (
        <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4 lg:hidden">
            <div className="flex w-full items-center justify-between">
                <Link href="/dashboard" className="text-xl font-bold">
                    LoopSpace
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-5">
                        <div className="flex h-full flex-col">
                            <div className="flex items-center gap-2 py-4">
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            userProfile.data?.profilePic ||
                                            "/placeholder.svg?height=40&width=40"
                                        }
                                        alt="User"
                                    />
                                    <AvatarFallback>
                                        {userProfile.data?.name[0]}
                                    </AvatarFallback>
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
                            <nav className="flex-1 space-y-2">
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
                            <div className="py-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-500"
                                    onClick={() => {
                                        localStorage.clear();
                                        window.location.href = "/auth/login";
                                    }}
                                >
                                    <LogOut className="mr-2 h-5 w-5" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
