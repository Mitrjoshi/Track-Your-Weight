import axios from "axios";
import { Platform } from "react-native";

export const axiosInstance = axios.create({
  baseURL: "https://in.openfoodfacts.org",
  timeout: 100000, // RN networks are slower than web
});

/**
 * Request interceptor
 */
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Accept = "application/json";

    // Required by OFF for identification (polite usage)
    config.headers["User-Agent"] =
      Platform.OS === "ios"
        ? "TrackYourWeight/1.0 (iOS)"
        : "TrackYourWeight/1.0 (Android)";

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.message ||
      "Open Food Facts request failed";

    console.warn("[OFF API ERROR]", message);
    return Promise.reject(new Error(message));
  }
);
