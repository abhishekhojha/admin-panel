"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { sendOtp, loginWithPassword, setIdentifier } from "../../store/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, Phone } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("otp");

  const handleSendOtp = () => {
    dispatch(setIdentifier(input));
    dispatch(sendOtp(input));
  };

  const handlePasswordLogin = () => {
    dispatch(loginWithPassword({ identifier: input, password }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="otp">OTP Login</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="otp" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-otp">Email or Phone</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email-otp"
                type="text"
                placeholder="name@example.com"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button
            onClick={handleSendOtp}
            disabled={loading || !input}
            className="w-full"
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-pass">Email or Phone</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email-pass"
                type="text"
                placeholder="name@example.com"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button
            onClick={handlePasswordLogin}
            disabled={loading || !input || !password}
            className="w-full"
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            {loading ? "Logging in..." : "Login"}
          </Button>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
