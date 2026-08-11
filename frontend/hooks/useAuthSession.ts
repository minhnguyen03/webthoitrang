"use client";

import { useCallback, useEffect, useState } from "react";
import { clearStoredAuth } from "@/lib/auth-fetch";

export type AuthUser = {
  id?: number;
  userId?: number;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  roles?: string[];
};

export type AuthSession = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  userName: string | null;
  currentUserId: number;
  isAuthenticated: boolean;
  isStaffUser: boolean;
};

const emptySession: AuthSession = {
  accessToken: null,
  refreshToken: null,
  user: null,
  userName: null,
  currentUserId: 0,
  isAuthenticated: false,
  isStaffUser: false,
};

function parseUser(rawUser: string | null) {
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function readAuthSession(): AuthSession {
  if (typeof window === "undefined") return emptySession;

  const accessToken = window.localStorage.getItem("accessToken");
  const refreshToken = window.localStorage.getItem("refreshToken");
  const user = parseUser(window.localStorage.getItem("user"));
  const roleText = [user?.role, ...(user?.roles || [])].filter(Boolean).join(" ");
  const userName = user?.fullName || user?.username || user?.email || null;
  const currentUserId = Number(user?.id || user?.userId || 0);

  return {
    accessToken,
    refreshToken,
    user,
    userName,
    currentUserId: Number.isFinite(currentUserId) ? currentUserId : 0,
    isAuthenticated: Boolean(accessToken || refreshToken),
    isStaffUser: /ADMIN|STAFF/i.test(roleText),
  };
}

export function clearAuthSession() {
  clearStoredAuth();
}

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession>(emptySession);

  const syncSession = useCallback(() => {
    setSession(readAuthSession());
  }, []);

  useEffect(() => {
    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("fashion-auth-updated", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("fashion-auth-updated", syncSession);
    };
  }, [syncSession]);

  return {
    ...session,
    refresh: syncSession,
  };
}
