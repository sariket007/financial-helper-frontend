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
  // 3. LOGOUT
  // ==========================================
  async logout() {
    // FIX: Swapped to privateApi
    await privateApi.get("/auth/logout");

    // Wipe the local UI state
    localStorage.removeItem("user");
  }

  // ==========================================
  // 4. GET CURRENT USER (Synchronous UI Check)
  // ==========================================
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
