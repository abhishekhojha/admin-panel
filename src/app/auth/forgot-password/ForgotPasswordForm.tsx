"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier) {
      toast.error("Please enter your email or phone");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/auth/send-otp", { identifier, purpose: "reset" });
      toast.success("OTP sent to your email/phone");
      setStep("reset");
      setTimer(30);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error("Please enter OTP and new password");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/auth/reset-password", {
        identifier,
        otp,
        newPassword,
      });
      toast.success("Password reset successfully. You can now login.");
      router.push("/auth");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (step === "request") {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email or phone to receive an OTP
          </p>
        </div>

        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Phone Number</Label>
            <Input
              id="identifier"
              placeholder="name@example.com"
              type="text"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Send OTP
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/auth"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter the OTP sent to {identifier} and your new password
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input
            id="otp"
            placeholder="Enter 4-digit OTP"
            type="text"
            disabled={loading}
            value={otp}
            maxLength={4}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            placeholder="Enter new password"
            type="password"
            disabled={loading}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          Reset Password
        </Button>
      </form>

      <div className="space-y-2 text-center">
        <button
          type="button"
          onClick={() => handleRequestOtp()}
          disabled={loading || timer > 0}
          className="text-sm text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors flex items-center justify-center gap-1 mx-auto"
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>

        <button
          type="button"
          onClick={() => setStep("request")}
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    </div>
  );
}
