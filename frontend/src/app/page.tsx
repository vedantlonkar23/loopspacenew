"use client";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import useAuth from "../features/auth/hooks/use-auth";

export default function Home() {
    const { isLoggedIn } = useAuth();
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-background px-4 py-3">
                <div className="container flex items-center justify-between">
                    <h1 className="text-xl font-bold">LoopSpace</h1>
                    <div className="flex items-center gap-4">
                        {isLoggedIn() ? (
                            <Link href="/dashboard">
                                <Button size="sm">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant={'outline'} size="sm">Login</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button size="sm">Signup</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <section className="container grid items-center gap-6 py-20 md:grid-cols-2 md:py-32">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Connect with like-minded professionals
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Share your experiences, discover events, and grow
                            your network with LoopSpace.
                        </p>
                        {!isLoggedIn() && (
                            <div className="flex gap-4">
                                <Link href="/auth/signup">
                                    <Button size="lg">Get Started</Button>
                                </Link>
                                <Link href="/auth/login">
                                    <Button size="lg" variant="outline">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {isLoggedIn() && (
                            <div className="flex gap-4">
                                <Link href="/dashboard">
                                    <Button size="lg" variant="outline">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <div className="relative h-[400px] w-[400px] rounded-lg bg-gray-100">
                            <div className="absolute -left-4 -top-4 h-[200px] w-[200px] rounded-lg border bg-background p-4 shadow-lg">
                                <div className="mb-2 h-8 w-8 rounded-full bg-gray-200"></div>
                                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                                <div className="h-24 w-full rounded bg-gray-200"></div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 h-[200px] w-[200px] rounded-lg border bg-background p-4 shadow-lg">
                                <div className="mb-2 h-8 w-8 rounded-full bg-gray-200"></div>
                                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                                <div className="h-24 w-full rounded bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t bg-background px-4 py-6">
                <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-center text-sm text-muted-foreground">
                        © 2025 LoopSpace. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="#"
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            Terms
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
