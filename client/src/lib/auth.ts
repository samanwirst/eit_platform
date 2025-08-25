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
export async function login(phoneNumber: string, password: string): Promise<void> {
  const { ok, jwt } = await loginRequest(phoneNumber, password);

  if (!ok || !jwt) {
    throw new Error("Invalid login response");
  }

  Cookies.set(ACCESS_TOKEN_KEY, jwt, { expires: 1 });
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