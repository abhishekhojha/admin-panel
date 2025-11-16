"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { sendOtp, loginWithPassword, setIdentifier } from "../../store/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Welcome To Ecom Dash</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="w-full flex mb-4">
              <TabsTrigger value="otp" className="flex-1">OTP Login/Signup</TabsTrigger>
              <TabsTrigger value="password" className="flex-1">Password Login</TabsTrigger>
            </TabsList>
            <TabsContent value="otp">
              <Input
                type="text"
                placeholder="Email or Phone"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                className="mb-2"
              />
              <Button
                onClick={handleSendOtp}
                disabled={loading || !input}
                className="w-full mb-2 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : null}
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </TabsContent>
            <TabsContent value="password">
              <Input
                type="text"
                placeholder="Email or Phone"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                className="mb-2"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="mb-2"
              />
              <Button
                onClick={handlePasswordLogin}
                disabled={loading || !input || !password}
                className="w-full flex items-center justify-center"
                variant="secondary"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : null}
                {loading ? "Logging in..." : "Login with Password"}
              </Button>
            </TabsContent>
          </Tabs>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
