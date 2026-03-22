// Remove standard axios
// import axios from "axios";

// Import your new custom instance (adjust the path if your folders are different)
import { privateApi } from "../api/axiosInstance";

class AuthService {
  // ==========================================
  // 1. LOGIN
  // ==========================================
  async login(email, password) {
    // FIX: Using privateApi automatically routes to Render/Localhost AND attaches cookies
    const response = await privateApi.post("/auth/login", {
      email,
      password,
    });

    if (response.data.data) {
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }

    return response.data.data;
  }

  // ==========================================
  // 2. REGISTER
  // ==========================================
  async register(userData) {
    // FIX: Cleaned up the call. privateApi handles the heavy lifting.
    const response = await privateApi.post("/auth/register", userData);

    if (response.data.data) {
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }

    return response.data.data;
  }

  // ==========================================
  // 3. LOGOUT (Bulletproofed)
  // ==========================================
  async logout() {
    try {
      // Attempt to tell the server to clear the HttpOnly cookie
      await privateApi.get("/auth/logout");
    } catch (error) {
      console.warn(
        "Server logout failed or token already dead. Forcing local logout.",
        error,
      );
    } finally {
      // FINALLY BLOCK: This runs 100% of the time, even if the server crashes.
      // It guarantees the local storage is wiped.
      localStorage.removeItem("user");
    }
  }

  // ==========================================
  // 4. GET CURRENT USER (Strict Sanitization)
  // ==========================================
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      // If storage is truly empty, or holds garbage string values, return strictly null
      if (!userStr || userStr === "undefined" || userStr === "null") {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error(
        "Failed to parse user from storage, wiping corrupted data.",
        error,
      );
      localStorage.removeItem("user");
      return null;
    }
  }
}

export default new AuthService();
