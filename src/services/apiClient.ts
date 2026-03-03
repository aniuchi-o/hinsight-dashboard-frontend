/// <reference types="vite/client" />
import axios from 'axios';

/**
 * Axios instance factory for the HINSIGHT API.
 * The base URL is injected at build time via VITE_API_BASE_URL (CI/CD).
 * The fallback is a safe placeholder — never expose a real URL here.
 */
const createApiClient = (baseURL: string) => {
    const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor — attach Bearer token from memory (never localStorage)
    client.interceptors.request.use((config) => {
        // Token is retrieved from in-memory AuthContext in hooks
        const token = (window as { __hinsight_token?: string }).__hinsight_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Response interceptor — handle 401 auto-logout
    client.interceptors.response.use(
        (response) => response,
        (error: unknown) => {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 401
            ) {
                // Dispatch logout event — picked up by AuthContext
                window.dispatchEvent(new CustomEvent('hinsight:logout'));
            }
            return Promise.reject(error);
        }
    );

    return client;
};

export const apiClient = createApiClient(
    import.meta.env.VITE_API_BASE_URL ?? 'https://placeholder-for-url/v1'
);

export default apiClient;
