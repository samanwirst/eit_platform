import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { loginRequest } from "@/utils/api";

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

interface TokenPayload {
  exp: number;
  userId: string;
  role: 'admin' | 'user';
  [key: string]: any;
}

// Логин + сохранение токенов в cookie
export async function login(phoneNumber: string, password: string): Promise<void> {
  const { ok, token } = await loginRequest(phoneNumber, password);

  if (!ok || !token) {
    throw new Error("Invalid login response");
  }

  Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 1 });
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

export function getUserRole(): 'admin' | 'user' | null {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }
  
  try {
    const payload = jwtDecode<TokenPayload>(token);
    return payload.role;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  return getUserRole() === 'admin';
}

export function isStudent(): boolean {
  return getUserRole() === 'user';
}

export function canAccessPage(pagePath: string): boolean {
  const role = getUserRole();
  if (!role) return false;
  
  // Admin can access everything
  if (role === 'admin') return true;
  
  // Student can only access dashboard and mock page
  if (role === 'user') {
    const allowedPaths = ['/', '/mock'];
    return allowedPaths.includes(pagePath);
  }
  
  return false;
}