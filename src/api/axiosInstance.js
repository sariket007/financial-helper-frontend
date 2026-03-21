import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// --------------------------------------------------------
// 1. PUBLIC API INSTANCE (For the Storefront Theme)
// Use this for fetching public pages, posts, sliders, etc.
// No cookies, no strict CORS blocking.
// --------------------------------------------------------
export const publicApi = axios.create({
  baseURL: baseURL,
});

// --------------------------------------------------------
// 2. PRIVATE API INSTANCE (For the Admin Dashboard)
// Use this for logins, CRUD operations, and settings.
// Automatically attaches JWT HTTP-only cookies.
// --------------------------------------------------------
export const privateApi = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// (Optional) Interceptor for the Private API to handle expired tokens later
privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized: Token likely missing or expired.");
    }
    return Promise.reject(error);
  },
);
