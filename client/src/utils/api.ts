// lib/api.ts
const API_URL = "http://127.0.0.1:8000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    token?: string;
    headers?: Record<string, string>;
    body?: any;
}

async function request<T>(
    method: HttpMethod,
    path: string,
    { token, headers, body }: RequestOptions = {}
): Promise<T> {
    const config: RequestInit = {
        method,
        headers: {
            ...(body instanceof FormData
                ? {} // fetch сам поставит boundary для FormData
                : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    if (body !== undefined) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const res = await fetch(`${API_URL}${path}`, config);

    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorData = await res.json();
            errorMessage = errorData.detail || JSON.stringify(errorData);
        } catch {
            /* игнорируем, если тело не JSON */
        }
        throw new Error(errorMessage);
    }

    if (res.status === 204) return null as T;
    return res.json();
}

// --- Базовые методы ---
export const get = <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options);

export const post = <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body });

export const put = <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>("PUT", path, { ...options, body });

export const patch = <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body });

export const del = <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, options);

// ========== USERS (только для админа) ==========
export const getUsers = (token: string) =>
    get("/users/", { token });


// ========== FOLDERS ==========
export const createFolder = (data: any, token: string) =>
    post("/folders/", data, { token });

export const getFolders = (token: string) =>
    get("/folders/", { token });

export const updateFolder = (id: number, data: any, token: string) =>
    put(`/folders/${id}/`, data, { token });

export const deleteFolder = (id: number, token: string) =>
    del(`/folders/${id}/`, { token });

export const joinFolder = (id: number, code: string, token: string) =>
    post(`/folders/${id}/join/`, { code }, { token });


// ========== TESTS ==========
export const createTest = (data: any, token: string) =>
    post("/tests/", data, { token });

export const getTests = (token: string) =>
    get("/tests/", { token });

export const getTestById = (id: number, token: string) =>
    get(`/tests/${id}/`, { token });

export const updateTest = (id: number, data: any, token: string) =>
    put(`/tests/${id}/`, data, { token });

export const deleteTest = (id: number, token: string) =>
    del(`/tests/${id}/`, { token });


// ========== SESSIONS ==========
export const createSession = (data: any, token: string) =>
    post("/sessions/", data, { token });

export const getSessions = (token: string) =>
    get("/sessions/", { token });

export const getSessionById = (id: number, token: string) =>
    get(`/sessions/${id}/`, { token });


// ========== ANSWERS ==========
export const sendAnswer = (data: any, token: string) =>
    post("/answers/", data, { token });

export const getAnswers = (token: string) =>
    get("/answers/", { token });


// ========== AUTH ==========
export const login = (username: string, password: string) =>
    post<{ access: string; refresh: string }>('/token/', { username, password });

export const refreshToken = (refresh: string) =>
    post<{ access: string }>('/token/refresh/', { refresh });
