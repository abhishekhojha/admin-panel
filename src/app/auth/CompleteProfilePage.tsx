"use client";
import { useState } from "react";
import { completeProfile } from "../../store/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CompleteProfilePage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleComplete = () => {
    dispatch(completeProfile({ name, password }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Complete Your Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Please set up your name and password to continue
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Set Password</Label>
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
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters long
          </p>
        </div>

        <Button
          onClick={handleComplete}
          disabled={loading || !name || !password}
          className="w-full"
          size="lg"
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          {loading ? "Setting up..." : "Complete Setup"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
