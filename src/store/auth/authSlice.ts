import { createSlice } from "@reduxjs/toolkit";
import { sendOtp, verifyOtp, loginWithPassword, completeProfile, getProfile } from "./authThunks";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  step: "login" | "otp" | "completeProfile" | "loggedIn";
  identifier: string;
}

let persistedAccessToken: string | null = null;
let persistedUser: any | null = null;
let persistedStep: AuthState["step"] = "login";
if (typeof window !== "undefined") {
  persistedAccessToken = localStorage.getItem("accessToken");
  if (persistedAccessToken) {
    try {
      const user: any = jwtDecode(persistedAccessToken);
      persistedUser = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isProfileCompleted: user.isProfileCompleted,
        role: user.role,
        isActive: user.isActive
      };
      persistedStep = user.isProfileCompleted ? "loggedIn" : "completeProfile";
    } catch {
      persistedAccessToken = null;
      persistedUser = null;
      persistedStep = "login";
    }
  }
}

const initialState: AuthState = {
  user: persistedUser,
  accessToken: persistedAccessToken,
  loading: false,
  error: null,
  step: persistedStep,
  identifier: "",
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
      state.step = "login";
      state.identifier = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setIdentifier: (state, action) => {
      state.identifier = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.step = "otp";
        state.identifier = action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        const user: any = jwtDecode(action.payload.accessToken);
        state.user = {
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          isProfileCompleted: user.isProfileCompleted,
          role: user.role,
          isActive: user.isActive
        };
        localStorage.setItem("accessToken", action.payload.accessToken);
        state.step = user.isProfileCompleted ? "loggedIn" : "completeProfile";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        const user: any = jwtDecode(action.payload.accessToken);
        state.user = {
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          isProfileCompleted: user.isProfileCompleted,
          role: user.role,
          isActive: user.isActive
        };
        localStorage.setItem("accessToken", action.payload.accessToken);
        state.step = "loggedIn";
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        const user: any = jwtDecode(action.payload.accessToken);
        state.user = {
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          isProfileCompleted: user.isProfileCompleted,
          role: user.role,
          isActive: user.isActive
        };
        state.step = "loggedIn";
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setStep, setIdentifier } = authSlice.actions;
export default authSlice.reducer;
