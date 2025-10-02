"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuth from "../hooks/use-auth";
import { toast } from "sonner";
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login.mutateAsync(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google`;
    };

    return (
        <div className="container flex min-h-screen flex-col items-center justify-center py-10">
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="flex items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground">
                        Enter your credentials to sign in
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="#"
                                className="text-sm font-medium underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={login.isPending}
                    >
                        {login.isPending ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
                <div className="relative flex items-center justify-center">
                    <Separator className="w-full" />
                    <span className="absolute bg-background px-2 text-xs text-muted-foreground">
                        OR CONTINUE WITH
                    </span>
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                >
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="font-medium underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
