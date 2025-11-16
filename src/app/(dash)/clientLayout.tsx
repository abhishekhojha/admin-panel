"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.replace("/auth");
            }
        }
    }, [router]);

    if (!mounted) {
        return null;
    }

    return <>{children}</>
} 