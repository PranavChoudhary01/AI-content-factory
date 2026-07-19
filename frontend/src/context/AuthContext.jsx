import React, { createContext, useContext, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("learnkins_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem("learnkins_user", JSON.stringify(data));
    setUser(data);
  };

  const signup = async (name, email, password, grade) => {
    const { data } = await client.post("/auth/signup", { name, email, password, grade });
    persist(data);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("learnkins_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
