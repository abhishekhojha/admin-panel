"use client";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { verifyOtp, sendOtp } from "../../store/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function OtpVerificationPage() {
  const dispatch = useAppDispatch();
  const { loading, error, identifier } = useAppSelector((state) => state.auth);
  const [otpValue, setOtpValue] = useState("");

  const handleVerify = () => {
    dispatch(verifyOtp({ identifier, otp: otpValue }));
  };

  const handleResend = () => {
    dispatch(sendOtp(identifier));
  };

  // Fallback for simple input if InputOTP is not available or complex to setup quickly without installing
  // But since we want premium, let's try to use a clean 4-digit input or the shadcn one if available.
  // The user didn't explicitly ask for input-otp component installation, so I will stick to a clean custom implementation or standard inputs to be safe,
  // OR use the existing logic but styled better.
  // Actually, I'll stick to the existing logic but style it much better to look like a proper OTP input.

  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const inputsRef = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Update combined value for submission
    const combined = newDigits.join("");
    setOtpValue(combined);

    if (value && index < 3) {
      inputsRef[index + 1].current?.focus();
    }
    if (!value && index > 0) {
      inputsRef[index - 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef[index - 1].current?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Verify OTP</h1>
        <p className="text-sm text-muted-foreground">
          We sent a code to{" "}
          <span className="font-medium text-foreground">{identifier}</span>
        </p>
      </div>

      <div className="flex justify-center gap-3 my-8">
        {otpDigits.map((digit, idx) => (
          <Input
            key={idx}
            ref={inputsRef[idx]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-14 h-14 text-center text-2xl font-bold rounded-md border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            autoFocus={idx === 0}
          />
        ))}
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleVerify}
          disabled={loading || otpDigits.some((d) => d === "")}
          className="w-full"
          size="lg"
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          {loading ? "Verifying..." : "Verify Account"}
        </Button>

        <Button
          variant="ghost"
          onClick={handleResend}
          disabled={loading}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          Resend Code
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
