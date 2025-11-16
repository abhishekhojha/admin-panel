import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import { jwtDecode } from "jwt-decode";

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (identifier: string, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/send-otp", { identifier });
      return identifier;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ identifier, otp }: { identifier: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/verify-otp", { identifier, otp });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to verify OTP");
    }
  }
);

export const loginWithPassword = createAsyncThunk(
  "auth/loginWithPassword",
  async ({ identifier, password }: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/login", { identifier, password });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const completeProfile = createAsyncThunk(
  "auth/completeProfile",
  async ({ name, password }: { name: string; password: string }, { getState, rejectWithValue }) => {
    try {
      const { user } = (getState() as any).auth;
      const res = await axios.post("/auth/complete-profile", { name, password }, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Profile completion failed");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = (getState() as any).auth;
      if (!accessToken) return rejectWithValue("No access token");
      const res = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);
