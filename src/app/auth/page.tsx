"use client";

import { useSelector } from "react-redux";
import LoginPage from "./LoginPage";
import OtpVerificationPage from "./OtpVerificationPage";
import CompleteProfilePage from "./CompleteProfilePage";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthFlow() {
  const router = useRouter();
  const { step, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && user.isProfileCompleted) {
      router.replace('/dash');
    }
  }, [user, router]);

  if (step === "login") return <LoginPage />;
  if (step === "otp") return <OtpVerificationPage />;
  if (step === "completeProfile" || (user && !user.isProfileCompleted)) return <CompleteProfilePage />;
  return <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">Logged In!</div>;
}
