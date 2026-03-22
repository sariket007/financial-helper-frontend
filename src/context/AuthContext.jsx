import { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // THE SLEDGEHAMMER: This function strictly syncs state with storage
  const syncUserState = () => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.role) {
      setUser(storedUser);
    } else {
      setUser(null); // Strictly enforce null if data is bad
    }
  };

  useEffect(() => {
    // 1. Sync on first load
    syncUserState();
    setLoading(false);

    // 2. Listen for cross-tab or forced storage changes
    window.addEventListener("storage", syncUserState);
    return () => window.removeEventListener("storage", syncUserState);
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    return userData;
  };

  const register = async (payload) => {
    const newUserData = await authService.register(payload);
    setUser(newUserData);
    return newUserData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // ESLint is happy, and your unit tests can spy on console.error
      console.error("Backend logout failed:", error);
      console.warn("Backend logout failed, forcing local wipe.");
    } finally {
      // Force wipe both the memory and the brain simultaneously
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
