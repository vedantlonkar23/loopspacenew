import type { Metadata } from "next";
import RootLayoutClient from "../layouts/rootlayoutclient";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: "LoopSpace",
    description:
        "LoopSpace is a platform for connecting people with similar interests.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <RootLayoutClient>
            {children}
            <Toaster />
        </RootLayoutClient>
    );
}
