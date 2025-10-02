"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type } from "node:os";

export default function useAuth(userId?: string) {
    const queryClient = useQueryClient();
    const router = useRouter();

    const isLoggedIn = () => {
        if (typeof window === "undefined") return false;
        const token = localStorage.getItem("token");
        return Boolean(token);
    };
    const login = useMutation({
        mutationFn: (data: { email: string; password: string }) =>
            authApi.login(data),
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            toast.success("Login successful!");
            if (data.isProfileComplete) {
                router.push("/dashboard");
            } else {
                router.push(`/auth/onboarding/${data.role}`);
            }
        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error.message || "Login failed");
        },
    });

    const signup = useMutation({
        mutationFn: (data: {
            email: string;
            password: string;
            name: string;
            role: string;
        }) => authApi.signup(data),
        onSuccess: (data) => {
            toast.success("Signup successful!");
            router.push(`/auth/login`);
        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error.message || "Signup failed");
        },
    });
    const userProfile = useQuery({
        queryKey: ["userProfile"],
        queryFn: authApi.userProfile,
        refetchOnMount: true,
    });
    const connections = useQuery({
        queryKey: ["connections"],
        queryFn: authApi.getConnections,
        refetchOnMount: true,
        enabled: typeof window !== "undefined" && isLoggedIn(),
    });

    const profileOther = useQuery({
        queryKey: ["userProfileOther", userId],
        queryFn: () => authApi.userProfileOther(userId),
        enabled: !!userId,
    });

    const connectUser = useMutation({
        mutationFn: (connectionId?: string) =>
            authApi.connectUser(connectionId),
        onSuccess: () => {
            toast.success("Connection added successfully !");
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            queryClient.invalidateQueries({ queryKey: ["connections"] });
        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error.message || "Failed to connect");
        },
    });

    return {
        login,
        signup,
        isLoggedIn,
        userProfile,
        connectUser,
        connections,
        profileOther,
    };
}
