import { ENDPOINTS } from "../config/api";

class AuthService {
  // Private helper method to handle duplicate response logic (Abstraction)
  async #handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }
    return data;
  }

  // Private helper to encapsulate localStorage manipulation
  #setSession(userData) {
    if (userData && userData.token) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }

  async register(userData) {
    const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await this.#handleResponse(response);

    if (data.success) {
      this.#setSession(data.data);
    }

    return data.data;
  }

  async login(userData) {
    const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await this.#handleResponse(response);

    if (data.success) {
      this.#setSession(data.data);
    }

    return data.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  // Utility method for React to easily check if someone is logged in
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

// Export a single instance (Singleton) to ensure memory efficiency across the app
export default new AuthService();
