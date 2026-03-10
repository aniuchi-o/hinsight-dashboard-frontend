/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ── In-memory token storage (HIPAA-compliant — never localStorage) ───────
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
    inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => inMemoryAccessToken;

// ── Data region (from JWT `reg` claim) ───────────────────────────────────
let currentDataRegion: 'CA' | 'US' =
    (import.meta.env.VITE_DATA_REGION as 'CA' | 'US') ?? 'CA';

export const setDataRegion = (region: 'CA' | 'US'): void => {
    currentDataRegion = region;
};

export const getDataRegion = (): 'CA' | 'US' => currentDataRegion;

// ── Factory ──────────────────────────────────────────────────────────────
const createApiClient = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: false,
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            config.headers['X-Data-Region'] = currentDataRegion;
            config.headers['X-Correlation-ID'] = crypto.randomUUID();
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => {
            const remaining = response.headers['x-ratelimit-remaining'];
            if (remaining !== undefined && Number(remaining) < 5) {
                console.warn(`[HINSIGHT] Rate limit warning: ${remaining} requests remaining.`);
            }
            return response;
        },
        (error: AxiosError) => {
            const status = error.response?.status;

            if (status === 401) {
                setAccessToken(null);
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }

            if (status === 403) {
                console.error('[HINSIGHT] Forbidden:', error.config?.url);
                window.dispatchEvent(new CustomEvent('auth:forbidden'));
            }

            if (status === 422) {
                const detail = (error.response?.data as { detail?: string })?.detail;
                if (detail) return Promise.reject(new Error(detail));
            }

            if (status === 429) {
                const reset = error.response?.headers['x-ratelimit-reset'];
                console.warn(`[HINSIGHT] Rate limited. Reset at: ${reset}`);
                return Promise.reject(new Error('Too many requests. Please wait and try again.'));
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export const apiClient = createApiClient(
    import.meta.env.VITE_API_BASE_URL ??
    'https://hinsight-api-1046723962483.northamerica-northeast1.run.app'
);

export default apiClient;
