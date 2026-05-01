import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { AuthResponse, Role } from "../lib/types";

type AuthUser = {
  userId: number;
  email: string;
  role: Role;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: string) => Promise<void>; // 🔥 UPDATED
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function saveAuth(res: AuthResponse) {
  localStorage.setItem("ttm_token", res.token);
  localStorage.setItem(
    "ttm_user",
    JSON.stringify({ userId: res.userId, email: res.email, role: res.role }),
  );
}

function loadAuth(): { token: string | null; user: AuthUser | null } {
  const token = localStorage.getItem("ttm_token");
  const raw = localStorage.getItem("ttm_user");
  if (!token || !raw) return { token: null, user: null };
  try {
    return { token, user: JSON.parse(raw) as AuthUser };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => loadAuth(), []);
  const [token, setToken] = useState<string | null>(initial.token);
  const [user, setUser] = useState<AuthUser | null>(initial.user);

  async function login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    saveAuth(data);
    setToken(data.token);
    setUser({ userId: data.userId, email: data.email, role: data.role });
  }

  async function signup(email: string, password: string, role: string) {
    const { data } = await api.post<AuthResponse>("/api/auth/signup", {
      email,
      password,
      role, 
    });
    saveAuth(data);
    setToken(data.token);
    setUser({ userId: data.userId, email: data.email, role: data.role });
  }

  function logout() {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    setToken(null);
    setUser(null);
  }

  const value: AuthContextValue = {
    token,
    user,
    isAuthed: Boolean(token && user),
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
} 