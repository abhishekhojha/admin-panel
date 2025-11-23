"use client";

import { useSelector } from "react-redux";
import LoginPage from "./LoginPage";
import OtpVerificationPage from "./OtpVerificationPage";
import CompleteProfilePage from "./CompleteProfilePage";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Command } from "lucide-react";

export default function AuthFlow() {
  const router = useRouter();
  const { step, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && user.isProfileCompleted) {
      router.replace("/");
    }
  }, [user, router]);

  let content;
  if (step === "login") content = <LoginPage />;
  else if (step === "otp") content = <OtpVerificationPage />;
  else if (step === "completeProfile" || (user && !user.isProfileCompleted))
    content = <CompleteProfilePage />;
  else content = <div className="text-center font-medium">Redirecting...</div>;

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden bg-muted lg:block relative h-full w-full overflow-hidden bg-zinc-900 text-white dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium p-10">
          <Command className="mr-2 h-6 w-6" />
          Admin Panel
        </div>
        <div className="relative z-20 mt-auto p-10 h-full flex flex-col justify-center">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This admin panel has revolutionized how we manage our
              e-commerce operations. The loan management features are a
              game-changer.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-[450px] space-y-6">{content}</div>
      </div>
    </div>
  );
}
