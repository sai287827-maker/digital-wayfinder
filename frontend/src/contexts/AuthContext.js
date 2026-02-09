import React, { createContext, useState, useContext, useEffect } from "react";
import { loginMockApi } from "../api";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // In a real app, I would validate the token with the backend
      // and fetch user details here. For now, I just set the token.
      setToken(storedToken);
      // Optional: set axios default header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setUser({ email: "test@example.com" }); // Mock user info
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginMockApi(email, password);
      const newToken = response.token;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      setUser({ email });
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      throw new Error(error.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
