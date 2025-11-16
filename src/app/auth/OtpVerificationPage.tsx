"use client";
import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { verifyOtp } from "../../store/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function OtpVerificationPage() {
  const dispatch = useAppDispatch();
  const { loading, error, identifier } = useAppSelector((state) => state.auth);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const inputsRef = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleVerify = () => {
    const otp = otpDigits.join("");
    dispatch(verifyOtp({ identifier, otp }));
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    if (value && index < 3) {
      inputsRef[index + 1].current?.focus();
    }
    if (!value && index > 0) {
      inputsRef[index - 1].current?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center text-gray-700">
            <div className="mb-2">We sent a one-time password to <span className="font-semibold">{identifier}</span>.</div>
            <div className="text-sm text-gray-500">Enter the code to continue.</div>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {otpDigits.map((digit, idx) => (
              <Input
                key={idx}
                ref={inputsRef[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                className="w-12 h-12 text-center text-xl font-mono border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                autoFocus={idx === 0}
              />
            ))}
          </div>
          <Button
            onClick={handleVerify}
            disabled={loading || otpDigits.some(d => d === "")}
            className="w-full py-2 text-lg flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Verifying...
              </span>
            ) : "Verify OTP"}
          </Button>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mt-6 text-center text-xs text-gray-400">Didn't receive the code? Check your spam folder or try again.</div>
        </CardContent>
      </Card>
    </div>
  );
}
