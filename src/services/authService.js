import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

class AuthService {
  // ==========================================
  // 1. LOGIN
  // ==========================================
  async login(email, password) {
    // THE FIX: { email, password } guarantees Axios sends a properly formatted JSON payload
    const response = await axios.post(
      API_URL + "login",
      {
        email,
        password,
      },
      {
        withCredentials: true, // Mandatory: Tells the browser to accept the backend's HttpOnly cookie
      },
    );

    // If successful, the backend sends the user object (including the new 'role' field)
    if (response.data.data) {
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }

    return response.data.data;
  }

  // ==========================================
  // 2. REGISTER
  // ==========================================
  // FIX: Change (name, email, password) to just (userData)
  async register(userData) {
    // FIX: Pass userData directly to axios, do not wrap it in { }
    const response = await axios.post(API_URL + "register", userData, {
      withCredentials: true,
    });

    if (response.data.data) {
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }

    return response.data.data;
  }

  // ==========================================
  // 3. LOGOUT
  // ==========================================
  async logout() {
    // We hit the backend logout route so it can destroy the HttpOnly cookie
    await axios.get(API_URL + "logout", {
      withCredentials: true,
    });

    // Then we wipe the local UI state
    localStorage.removeItem("user");
  }

  // ==========================================
  // 4. GET CURRENT USER (Synchronous UI Check)
  // ==========================================
  getCurrentUser() {
    // Reads the user string from storage and parses it back into a JavaScript object
    return JSON.parse(localStorage.getItem("user"));
  }
}

// Export a single instance of the class (Singleton Pattern)
export default new AuthService();
