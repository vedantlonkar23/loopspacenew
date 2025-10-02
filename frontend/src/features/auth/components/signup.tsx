"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/ui/tabs";
import IndividualSignup from "./individual-signup";
import OrganizerSignup from "./organizer-signup";

export default function SignupForm() {
    const router = useRouter();
    const [accountType, setAccountType] = useState<"individual" | "organizer">(
        "individual"
    );

    const handleGoogleSignIn = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google?role=${accountType}`;
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
                    <h1 className="text-3xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground">
                        Enter your information to create an account
                    </p>
                </div>

                <Tabs
                    defaultValue="individual"
                    className="w-full"
                    onValueChange={(value) =>
                        setAccountType(value as "individual" | "organizer")
                    }
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="individual">Individual</TabsTrigger>
                        <TabsTrigger value="organizer">Organizer</TabsTrigger>
                    </TabsList>

                    <TabsContent value="individual">
                        <IndividualSignup />
                    </TabsContent>

                    <TabsContent value="organizer">
                        <OrganizerSignup />
                    </TabsContent>
                </Tabs>

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
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-medium underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
