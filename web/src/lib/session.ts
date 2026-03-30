// FILE: web\src\lib\session.ts
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function getToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_KEY, accessToken);
}

export function clearToken() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
