"use client";
import { useState } from "react";
import { completeProfile } from "../../store/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function CompleteProfilePage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleComplete = () => {
    dispatch(completeProfile({ name, password }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Complete Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
            onClick={handleComplete}
            disabled={loading || !name || !password}
            className="w-full"
            variant="secondary"
          >
            {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Completing...</> : "Complete Profile"}
          </Button>
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
