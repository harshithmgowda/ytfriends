import { createContext, useEffect, useMemo, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persistAuth = (payload) => {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = (payload) => persistAuth(payload);
  const register = (payload) => persistAuth(payload);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, login, register, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

