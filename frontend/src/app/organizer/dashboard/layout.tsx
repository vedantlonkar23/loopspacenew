"use client";
import type React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import {
    CalendarDays,
    BarChart,
    Users,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/src/components/ui/sheet";
import { Root as VisuallyHiddenRoot } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import useAuth from "@/src/features/auth/hooks/use-auth";

export default function OrganizerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userProfile } = useAuth();
    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4 lg:hidden">
                <div className="flex w-full items-center justify-between">
                    <Link
                        href="/organizer/dashboard"
                        className="text-xl font-bold"
                    >
                        LoopSpace
                    </Link>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <div className="flex h-full flex-col">
                                <div className="flex items-center gap-2 py-4">
                                    <Avatar>
                                        <AvatarImage
                                            src={
                                                userProfile?.data
                                                    ?.organizationLogo
                                            }
                                            alt="Organization"
                                        />
                                        <AvatarFallback>
                                            {
                                                userProfile?.data
                                                    ?.organizationName?.[0]
                                            }
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {
                                                userProfile?.data
                                                    ?.organizationName
                                            }
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Organizer
                                        </p>
                                    </div>
                                </div>
                                <nav className="flex-1 space-y-2">
                                    <Link href="/organizer/dashboard">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            <BarChart className="mr-2 h-5 w-5" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/organizer/dashboard/events">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            <CalendarDays className="mr-2 h-5 w-5" />
                                            Events
                                        </Button>
                                    </Link>
                                    <Link href="/organizer/dashboard/attendees">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            <Users className="mr-2 h-5 w-5" />
                                            Attendees
                                        </Button>
                                    </Link>
                                    <Link href="/organizer/dashboard/settings">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            <Settings className="mr-2 h-5 w-5" />
                                            Settings
                                        </Button>
                                    </Link>
                                </nav>
                                <div className="py-4">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-500"
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.href =
                                                "/auth/login";
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

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="fixed hidden h-screen w-64 border-r bg-background lg:block">
                    <div className="flex h-full flex-col">
                        <div className="flex h-14 items-center border-b px-4">
                            <Link
                                href="/organizer/dashboard"
                                className="text-xl font-bold"
                            >
                                LoopSpace
                            </Link>
                        </div>
                        <div className="flex-1 overflow-auto py-4">
                            <nav className="space-y-2 px-2">
                                <Link href="/organizer/dashboard">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        <BarChart className="mr-2 h-5 w-5" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/organizer/dashboard/events">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        <CalendarDays className="mr-2 h-5 w-5" />
                                        Events
                                    </Button>
                                </Link>
                                <Link href="/organizer/dashboard/attendees">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        <Users className="mr-2 h-5 w-5" />
                                        Attendees
                                    </Button>
                                </Link>
                                <Link href="/organizer/dashboard/settings">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        <Settings className="mr-2 h-5 w-5" />
                                        Settings
                                    </Button>
                                </Link>
                            </nav>
                        </div>
                        <div className="border-t p-4">
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            userProfile?.data?.organizationLogo
                                        }
                                        alt="Organization"
                                    />
                                    <AvatarFallback>
                                        {
                                            userProfile?.data
                                                ?.organizationName?.[0]
                                        }
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {userProfile?.data?.organizationName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Organizer
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="mt-4 w-full justify-start text-red-500"
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
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64">{children}</main>
            </div>
        </div>
    );
}
