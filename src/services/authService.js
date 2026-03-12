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
  // After backend switched to HttpOnly cookies we no longer get a token in
  // the response body.  The API now returns a *sanitized* user object
  // (name, email, etc) solely for UI purposes, so we simply persist that
  // object.  The cookie itself is managed by the browser automatically.
  #setSession(userData) {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }

  async register(userData) {
    const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",                // critical for cookies
      body: JSON.stringify(userData),
    });

    const data = await this.#handleResponse(response);

    if (data.success) {
      // data.data is a sanitized user object, no token present
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
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await this.#handleResponse(response);

    if (data.success) {
      this.#setSession(data.data);
    }

    return data.data;
  }

  async logout() {
    // Tell the server to destroy the session cookie.
    // NOTE: using a hard‑coded URL for now; the config file can be updated
    // if the base URL changes.  `credentials: 'include'` is essential so
    // the cookie is sent along with the request.
    try {
      await fetch(`${ENDPOINTS.AUTH.LOGOUT}`, {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      // even if the network call fails we still clear local state
      console.warn("Logout request failed", err);
    }

    localStorage.removeItem("user");
  }

  // Utility method for React to easily check if someone is logged in
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

// Export a single instance (Singleton) to ensure memory efficiency across the app
export default new AuthService();
