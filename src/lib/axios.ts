import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
});


instance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    // Unwrap standardized API envelope: { success, message, data: {...} }
    // so all service calls receive the inner `data` payload directly
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response &&
      error.response.status === 401
    ) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default instance;
