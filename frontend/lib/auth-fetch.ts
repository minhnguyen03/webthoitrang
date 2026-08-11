type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: unknown;
};

let refreshPromise: Promise<string | null> | null = null;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredAccessToken() {
  return canUseStorage() ? window.localStorage.getItem("accessToken") : null;
}

export function getStoredRefreshToken() {
  return canUseStorage() ? window.localStorage.getItem("refreshToken") : null;
}

export function hasStoredAuth() {
  return Boolean(getStoredAccessToken() || getStoredRefreshToken());
}

function notifyAuthUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fashion-auth-updated"));
  }
}

export function clearStoredAuth() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem("token");
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("refreshToken");
  window.localStorage.removeItem("user");
  notifyAuthUpdated();
}

export function storeAuthResponse(data: AuthResponse) {
  if (!canUseStorage()) return;

  if (data.accessToken) {
    window.localStorage.setItem("accessToken", data.accessToken);
  }
  if (data.refreshToken) {
    window.localStorage.setItem("refreshToken", data.refreshToken);
  }
  if (data.user) {
    window.localStorage.setItem("user", JSON.stringify(data.user));
  }
  notifyAuthUpdated();
}

export async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as AuthResponse | null;
        if (!response.ok || !payload?.accessToken) {
          clearStoredAuth();
          return null;
        }

        storeAuthResponse(payload);
        return payload.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function buildAuthHeaders(init: RequestInit, accessToken: string) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("ngrok-skip-browser-warning", "true");

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}, options?: { redirectOnFailure?: boolean }) {
  let accessToken = getStoredAccessToken();

  if (!accessToken && getStoredRefreshToken()) {
    accessToken = await refreshAccessToken();
  }

  if (!accessToken) {
    if (options?.redirectOnFailure && typeof window !== "undefined") {
      clearStoredAuth();
      window.location.href = "/login";
    }
    return null;
  }

  let response = await fetch(input, {
    ...init,
    headers: buildAuthHeaders(init, accessToken),
  });

  if (response.status !== 401) {
    return response;
  }

  const nextToken = await refreshAccessToken();
  if (!nextToken) {
    if (options?.redirectOnFailure && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return response;
  }

  response = await fetch(input, {
    ...init,
    headers: buildAuthHeaders(init, nextToken),
  });

  if (response.status === 401 && options?.redirectOnFailure && typeof window !== "undefined") {
    clearStoredAuth();
    window.location.href = "/login";
  }

  return response;
}
