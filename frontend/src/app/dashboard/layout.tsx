"use client";
import type React from "react";
import MobileMenu from "@/src/features/dashboard/components/mobile-menu";
import DesktopMenu from "@/src/features/dashboard/components/desktop-menu";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <MobileMenu />
            <div className="flex">
                <DesktopMenu />
                <main className="flex-1 lg:ml-64">{children}</main>
            </div>
        </div>
    );
}
