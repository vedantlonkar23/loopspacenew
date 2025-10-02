"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60,
                        retry: 1,
                    },
                },
            })
    );
    const pathname = usePathname();
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token && !pathname.includes("/auth")) {
                window.location.href = "/auth/login";
            }
            if (
                token &&
                (pathname === "/auth/login" || pathname === "/auth/signup")
            ) {
                window.location.href = "/";
            }
        }
    });
    return (
        <html lang="en">
            <body>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </body>
        </html>
    );
}
