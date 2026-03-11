import { IUserSettings, IUpdatePreferencesPayload, IAcceptCompliancePayload } from '../types/settings.types';
import { getAccessToken } from './apiClient';
import { decodeJWT, getSessionDuration } from '../utils/jwtUtils';

// ── Preferences persisted in localStorage (per-user) ─────────────────────

const PREFS_KEY_PREFIX = 'hinsight_prefs_';

function prefsKey(userId: string): string {
    return `${PREFS_KEY_PREFIX}${userId}`;
}

const DEFAULT_PREFERENCES: IUserSettings['preferences'] = {
    defaultView: 'overview',
    chartAnimation: 'ENABLED',
    dataDisplayMode: 'COUNTS_AND_PERCENTAGES',
    highContrast: false,
    reducedMotion: false,
    alertDigestFrequency: 'WEEKLY',
};

function loadPreferences(userId: string): IUserSettings['preferences'] {
    try {
        const raw = localStorage.getItem(prefsKey(userId));
        if (raw) return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    } catch { /* corrupt — use defaults */ }
    return { ...DEFAULT_PREFERENCES };
}

function savePreferences(userId: string, prefs: IUserSettings['preferences']): void {
    localStorage.setItem(prefsKey(userId), JSON.stringify(prefs));
}

// ── Build settings from JWT + localStorage ────────────────────────────────

export async function fetchUserSettings(): Promise<IUserSettings> {
    const token = getAccessToken();
    const claims = token ? decodeJWT(token) : null;
    const userId = claims?.sub ?? 'anonymous';

    const preferences = loadPreferences(userId);
    const sessionDuration = token ? getSessionDuration(token) : 0;

    return {
        userId,
        preferences,
        session: {
            sessionId: crypto.randomUUID(),
            tenantId: claims?.tid ?? '',
            tenantRegion: claims?.reg ?? 'CA',
            lastLoginAt: claims?.iat
                ? new Date(claims.iat * 1000).toISOString()
                : new Date().toISOString(),
            sessionStartedAt: claims?.iat
                ? new Date(claims.iat * 1000).toISOString()
                : new Date().toISOString(),
            sessionTimeoutMinutes: sessionDuration,
            ipRegion: claims?.reg === 'CA' ? 'Canada' : 'United States',
        },
        compliance: {
            hipaaNoticeAcceptedAt: null,
            phipaNoticeAcceptedAt: null,
            dataRetentionPolicyVersion: '2025-01',
            lastPolicyReviewedAt: null,
            requiresReacceptance: false,
        },
    };
}

export async function updatePreferences(payload: IUpdatePreferencesPayload): Promise<void> {
    const token = getAccessToken();
    const claims = token ? decodeJWT(token) : null;
    const userId = claims?.sub ?? 'anonymous';
    const current = loadPreferences(userId);
    savePreferences(userId, { ...current, ...payload });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function acceptCompliance(_payload: IAcceptCompliancePayload): Promise<void> {
    // Compliance acceptance will be sent to the backend when the endpoint is available.
    // For now, no-op — the UI already tracks state locally via React Query cache.
}
