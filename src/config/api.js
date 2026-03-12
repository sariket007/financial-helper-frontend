// Centralized API configuration
// This pulls the URL from the Vite environment variables, or falls back to localhost if missing
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  AGENT: {
    ADVICE: (userId) => `${API_BASE_URL}/advice/${userId}`,
  },
};
