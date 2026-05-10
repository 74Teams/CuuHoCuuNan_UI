import type { AuthTokenPayload, AuthUserSummary } from "./types";

const storageKeys = {
  accessToken: "rescue_system.access_token",
  refreshToken: "rescue_system.refresh_token",
  user: "rescue_system.user",
} as const;

function canUseStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function getStoredAccessToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(storageKeys.accessToken);
}

export function getStoredRefreshToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(storageKeys.refreshToken);
}

export function getStoredUser() {
  if (!canUseStorage()) {
    return null;
  }

  const rawUser = window.localStorage.getItem(storageKeys.user);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUserSummary;
  } catch {
    return null;
  }
}

export function setStoredAuthSession(session: AuthTokenPayload) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(storageKeys.accessToken, session.accessToken);
  window.localStorage.setItem(storageKeys.refreshToken, session.refreshToken);
  window.localStorage.setItem(storageKeys.user, JSON.stringify(session.user));
}

export function setStoredAccessToken(accessToken: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(storageKeys.accessToken, accessToken);
}

export function setStoredRefreshToken(refreshToken: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(storageKeys.refreshToken, refreshToken);
}

export function setStoredUser(user: AuthUserSummary | null) {
  if (!canUseStorage()) {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(storageKeys.user);
    return;
  }

  window.localStorage.setItem(storageKeys.user, JSON.stringify(user));
}

export function clearStoredAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(storageKeys.accessToken);
  window.localStorage.removeItem(storageKeys.refreshToken);
  window.localStorage.removeItem(storageKeys.user);
}
