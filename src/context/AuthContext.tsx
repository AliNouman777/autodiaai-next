"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { AuthAPI } from "@/lib/api";

type User = { id: string; email: string; plan: "free" | "pro" | string };

type AuthContextType = {
  user: User | null;
  initializing: boolean; // first-load restore
  loading: boolean; // in-flight auth action
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  const refreshMe = useCallback(async () => {
    try {
      const { user } = await AuthAPI.me();
      setUser(user);
    } catch (err: any) {
      // 401 => not logged in
      setUser(null);
    }
  }, []);

  // Restore session on mount; backend will also rotate a fresh access cookie on /me
  useEffect(() => {
    (async () => {
      await refreshMe();
      setInitializing(false);
    })();
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await AuthAPI.login({ email, password });
      setUser(user);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => {
      setLoading(true);
      try {
        const { user } = await AuthAPI.register({
          firstName,
          lastName,
          email,
          password,
        });
        setUser(user);
      } catch (err) {
        console.error("Signup failed:", err);
        throw err; // let caller handle toast/error message
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await AuthAPI.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, initializing, loading, login, signup, logout, refreshMe }),
    [user, initializing, loading, login, signup, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
