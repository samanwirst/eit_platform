import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
    method?: RequestMethod;
    headers?: HeadersInit;
    body?: any;
    token?: string;
    queryParams?: Record<string, any>;
}

function buildQueryString(params?: Record<string, any>): string {
    if (!params) return '';
    const esc = encodeURIComponent;
    const query = Object.entries(params)
        .map(([k, v]) => `${esc(k)}=${esc(v)}`)
        .join('&');
    return query ? `?${query}` : '';
}

async function request<T>(
    endpoint: string,
    { method = 'GET', headers = {}, body, token, queryParams }: RequestOptions = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}${buildQueryString(queryParams)}`;
    const accessToken = token || Cookies.get("access");

    const fetchOptions: RequestInit = {
        method,
        headers: {
            ...headers,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
    };

    // Handle FormData vs JSON body
    if (body) {
        if (body instanceof FormData) {
            // Don't set Content-Type for FormData, let browser set it with boundary
            fetchOptions.body = body;
        } else {
            // Set Content-Type for JSON and stringify
            fetchOptions.headers = {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
            };
            fetchOptions.body = JSON.stringify(body);
        }
    }

    const response = await fetch(url, fetchOptions);
    const text = await response.text();

    if (!response.ok) {
        if (response.status === 401) {
            Cookies.remove("access");
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error("Unauthorized - please login again");
        }

        let errorData: any = {};
        try {
            errorData = text ? JSON.parse(text) : {};
        } catch (parseErr) {
            // Silent fail for JSON parsing
        }

        const error: any = new Error(errorData?.detail || errorData?.message || response.statusText);
        error.response = { data: errorData, status: response.status };
        throw error;
    }

    try {
        return text ? JSON.parse(text) : ({} as T);
    } catch {
        return {} as T;
    }
}

// Shortcut functions
export const api = {
    get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(endpoint, { ...options, method: 'POST', body }),

    patch: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(endpoint, { ...options, method: 'PATCH', body }),

    put: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(endpoint, { ...options, method: 'PUT', body }),

    del: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// AUTHENTICATION
export const loginRequest = (phoneNumber: string, password: string) => {
    return api.post<{ ok: boolean; jwt: string }>('/login', { phoneNumber, password })
};

// ========== USERS ==========
export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'admin' | 'student';
}

export interface CreateUserData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    role: 'admin' | 'student';
}

export const createUser = async (data: CreateUserData, token: string): Promise<User> => {
    const cleanData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phoneNumber: data.phoneNumber.trim(),
        password: data.password,
        role: data.role
    };

    return api.post<User>("/users", cleanData, { token });
};

export const getUsers = (token: string) =>
    api.get<User[]>("/users", { token });

export const deleteUser = (id: string, token: string) =>
    api.del<{ success: boolean }>(`/user/${id}`, { token });

// ========== FOLDERS ==========
export const createFolder = (data: any, token: string) =>
    api.post("/folders/", data, { token });

export const getFolders = (token: string) =>
    api.get("/folders/", { token });

export const updateFolder = (id: number, data: any, token: string) =>
    api.put(`/folders/${id}/`, data, { token });

export const deleteFolder = (id: number, token: string) =>
    api.del(`/folders/${id}/`, { token });

export const joinFolder = (id: number, code: string, token: string) =>
    api.post(`/folders/${id}/join/`, { code }, { token });

// ========== TESTS ==========
export interface Test {
    _id: string;
    title: string;
    reading: {
        sections: {
            one?: { title: string; content: string; files: string[] };
            two?: { title: string; content: string; files: string[] };
            three?: { title: string; content: string; files: string[] };
            four?: { title: string; content: string; files: string[] };
        };
    };
    listening: {
        content: string;
        files: string[];
    };
    writing: {
        sections: {
            one?: { title: string; content: string; files: string[] };
            two?: { title: string; content: string; files: string[] };
        };
    };
}

export const createTest = (data: FormData, token: string) =>
    request("/tests", {
        method: "POST",
        body: data,
        headers: {},
        token
    });

export const getTests = (token: string) =>
    api.get<{ ok: boolean; tests: Test[] }>("/tests", { token });

export const deleteTest = (id: string, token: string) =>
    api.del(`/test/${id}`, { token });

// ========== SESSIONS ==========
export const createSession = (data: any, token: string) =>
    api.post("/sessions/", data, { token });

export const getSessions = (token: string) =>
    api.get("/sessions/", { token });

export const getSessionById = (id: number, token: string) =>
    api.get(`/sessions/${id}/`, { token });

// ========== ANSWERS ==========
export const sendAnswer = (data: any, token: string) =>
    api.post("/answers/", data, { token });

export const getAnswersOld = (token: string) =>
    api.get("/answers/", { token });

// ========== AUTH ==========
export const loginOld = (phone_number: string, password: string) =>
    api.post<{ access: string; refresh: string }>('/token/', { phone_number, password });

export const refreshToken = (refresh: string) =>
    api.post<{ access: string }>('/token/refresh/', { refresh });