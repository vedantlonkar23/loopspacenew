"use client";
import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function GoogleAuthContent() {
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = params.get("token");
        const isProfileComplete = params.get("isProfileComplete");
        const role = params.get("role");

        if (typeof window !== "undefined") {
            if (token && isProfileComplete === "true") {
                localStorage.setItem("token", token);
                router.push("/dashboard");
            } else if (token && isProfileComplete === "false") {
                localStorage.setItem("token", token);
                if (role === "individual") {
                    router.push("/auth/onboarding/individual");
                } else {
                    router.push("/auth/onboarding/organizer");
                }
            } else {
                router.push("/auth/login");
            }
        }
    }, []);

    return <div>Logging you in.....</div>;
}

export default function GoogleAuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GoogleAuthContent />
        </Suspense>
    );
}
