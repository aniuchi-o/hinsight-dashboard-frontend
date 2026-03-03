import { IUserSettings, IUpdatePreferencesPayload, IAcceptCompliancePayload } from '../types/settings.types';

// ── Mock settings data for Phase 1 ───────────────────────────────────────

let MOCK_SETTINGS: IUserSettings = {
    userId: 'usr-opaque-001',
    preferences: {
        defaultView: 'overview',
        chartAnimation: 'ENABLED',
        dataDisplayMode: 'COUNTS_AND_PERCENTAGES',
        highContrast: false,
        reducedMotion: false,
        alertDigestFrequency: 'WEEKLY',
    },
    session: {
        sessionId: 'sess-abc123-def456',
        tenantId: 'tenant-ca-001',
        tenantRegion: 'CA',
        lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sessionStartedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        sessionTimeoutMinutes: 60,
        ipRegion: 'Ontario, Canada',
    },
    compliance: {
        hipaaNoticeAcceptedAt: new Date('2025-01-15').toISOString(),
        phipaNoticeAcceptedAt: new Date('2025-01-15').toISOString(),
        dataRetentionPolicyVersion: '2025-01',
        lastPolicyReviewedAt: new Date('2025-01-15').toISOString(),
        requiresReacceptance: false,
    },
};

export async function fetchUserSettings(): Promise<IUserSettings> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { ...MOCK_SETTINGS };
}

export async function updatePreferences(payload: IUpdatePreferencesPayload): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    MOCK_SETTINGS = {
        ...MOCK_SETTINGS,
        preferences: { ...MOCK_SETTINGS.preferences, ...payload },
    };
}

export async function acceptCompliance(payload: IAcceptCompliancePayload): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const updates: Partial<typeof MOCK_SETTINGS.compliance> = {};
    if (payload.noticeType === 'HIPAA') updates.hipaaNoticeAcceptedAt = payload.acceptedAt;
    if (payload.noticeType === 'PHIPA') updates.phipaNoticeAcceptedAt = payload.acceptedAt;
    if (payload.noticeType === 'DATA_RETENTION') updates.lastPolicyReviewedAt = payload.acceptedAt;
    MOCK_SETTINGS = {
        ...MOCK_SETTINGS,
        compliance: { ...MOCK_SETTINGS.compliance, ...updates, requiresReacceptance: false },
    };
}
