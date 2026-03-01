import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const TOKEN_KEY = "bytesparkToken";
const ROLE_KEY = "bytesparkRole";

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
};

const decodeAuthToken = (token) => {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
};

const resolveRole = ({ token, role }) => {
  const decoded = decodeAuthToken(token);
  return role || decoded?.role || localStorage.getItem(ROLE_KEY) || "user";
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

const getInitialAuth = () => {
  const token = getStoredToken();
  if (!token) {
    return { token: null, role: null };
  }

  return {
    token,
    role: resolveRole({ token }),
  };
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth);

  const login = useCallback(({ token, role }) => {
    if (!token) return;

    const resolvedRole = resolveRole({ token, role });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, resolvedRole);
    setAuth({ token, role: resolvedRole });
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setAuth({ token: null, role: null });
  }, []);

  const value = useMemo(
    () => ({
      token: auth.token,
      role: auth.role,
      isAuthenticated: !!auth.token,
      isAdmin: auth.role === "admin",
      login,
      logout,
    }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
