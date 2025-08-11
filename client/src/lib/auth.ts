import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { loginRequest } from "@/utils/api";

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

interface TokenPayload {
  exp: number;
  [key: string]: any;
}

// Логин + сохранение токенов в cookie
export async function login(username: string, password: string): Promise<void> {
  const { access, refresh } = await loginRequest(username, password);

  if (!access || !refresh) {
    throw new Error("Invalid login response");
  }

  Cookies.set(ACCESS_TOKEN_KEY, access, { expires: 1 });
  Cookies.set(REFRESH_TOKEN_KEY, refresh, { expires: 7 });
}

export function logout(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = jwtDecode<TokenPayload>(token);
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  return !!token && !isTokenExpired(token);
}