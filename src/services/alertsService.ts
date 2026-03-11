import { IAlertsFeedResponse, IAlertFilters, IAcknowledgeAlertPayload, IAlert } from '../types/alerts.types';
import {
    getAcknowledgedIds,
    getDismissedIds,
    acknowledgeAlertId,
    acknowledgeAllIds,
    unacknowledgeAllIds,
} from '../utils/alertPersistence';

// ── Mock alert data (serves as source until backend delivers alerts) ──────

const SEED_ALERTS: Readonly<IAlert>[] = [
    {
        id: 'alert-001',
        type: 'THRESHOLD_BREACH',
        severity: 'CRITICAL',
        title: 'Stress concerns exceed 30% workforce threshold',
        description: 'The number of employees reporting high stress levels has surpassed the configured 30% population threshold. Aggregated CF_str_Count data indicates elevated occupational stress across the organization.',
        affectedMetric: 'CF_str_Count',
        affectedValue: 421,
        thresholdValue: 374,
        percentageOfWorkforce: 33.8,
        relatedView: 'overview',
        tenantId: 'tenant-ca-001',
        isAcknowledged: false,
        acknowledgedByRole: null,
        acknowledgedAt: null,
        isDismissed: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expiresAt: null,
    },
    {
        id: 'alert-002',
        type: 'RISK_SPIKE',
        severity: 'WARNING',
        title: 'Cardiovascular disease risk increased by 8% since last period',
        description: 'D_CVD_risk_Count has increased by 8.2 percentage points compared to the previous 30-day rolling average. Early intervention programs may be warranted.',
        affectedMetric: 'D_CVD_risk_Count',
        affectedValue: 143,
        thresholdValue: 132,
        percentageOfWorkforce: 11.5,
        relatedView: 'lifestyle',
        tenantId: 'tenant-ca-001',
        isAcknowledged: false,
        acknowledgedByRole: null,
        acknowledgedAt: null,
        isDismissed: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        expiresAt: null,
    },
    {
        id: 'alert-003',
        type: 'IMPROVEMENT_REGRESSION',
        severity: 'WARNING',
        title: 'Obesity improvement rate dropped below 25% baseline',
        description: 'The tracked improvement rate for obesity-related metrics has declined to 22%, falling below the 25% programme baseline. Review of nutrition and movement programmes is recommended.',
        affectedMetric: 'D_obesity_improvement_rate',
        affectedValue: 22,
        thresholdValue: 25,
        percentageOfWorkforce: null,
        relatedView: 'nutrition_obesity',
        tenantId: 'tenant-ca-001',
        isAcknowledged: false,
        acknowledgedByRole: null,
        acknowledgedAt: null,
        isDismissed: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: null,
    },
    {
        id: 'alert-004',
        type: 'COHORT_SUPPRESSION',
        severity: 'INFORMATIONAL',
        title: 'Cancer metrics suppressed — cohort below k-anonymity threshold',
        description: 'CF_CanC_Count for the current reporting period contains fewer than 10 individuals. Data has been suppressed per HIPAA/PHIPA k-anonymity requirements to prevent re-identification.',
        affectedMetric: 'CF_CanC_Count',
        affectedValue: 7,
        thresholdValue: 10,
        percentageOfWorkforce: null,
        relatedView: 'overview',
        tenantId: 'tenant-ca-001',
        isAcknowledged: false,
        acknowledgedByRole: null,
        acknowledgedAt: null,
        isDismissed: false,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'alert-005',
        type: 'DATA_STALENESS',
        severity: 'INFORMATIONAL',
        title: 'Feelings dashboard data is 26 hours old',
        description: 'The aggregated data for the Feelings dashboard view has not refreshed within the expected 24-hour window. Data may not reflect the current population state.',
        affectedMetric: null,
        affectedValue: null,
        thresholdValue: null,
        percentageOfWorkforce: null,
        relatedView: 'feelings',
        tenantId: 'tenant-ca-001',
        isAcknowledged: false,
        acknowledgedByRole: null,
        acknowledgedAt: null,
        isDismissed: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        expiresAt: null,
    },
];

// ── Merge persisted state onto seed alerts ─────────────────────────────────

function hydrateAlerts(userId: string): IAlert[] {
    const ackedIds = getAcknowledgedIds(userId);
    const dismissedIds = getDismissedIds(userId);

    return SEED_ALERTS.map((a) => ({
        ...a,
        isAcknowledged: ackedIds.has(a.id),
        acknowledgedAt: ackedIds.has(a.id) ? new Date().toISOString() : null,
        isDismissed: dismissedIds.has(a.id),
    }));
}

function applyFilters(alerts: IAlert[], filters: IAlertFilters): IAlert[] {
    return alerts.filter((alert) => {
        if (filters.severity !== 'ALL' && alert.severity !== filters.severity) return false;
        if (filters.type !== 'ALL' && alert.type !== filters.type) return false;
        if (filters.relatedView !== 'ALL' && alert.relatedView !== filters.relatedView) return false;
        if (!filters.showAcknowledged && alert.isAcknowledged) return false;
        if (!filters.showDismissed && alert.isDismissed) return false;
        return true;
    });
}

// ── Public API ─────────────────────────────────────────────────────────────

let _currentUserId = '';

function hasUserScope(): boolean {
    return _currentUserId.trim().length > 0;
}

export function setAlertsUserId(userId: string): void {
    _currentUserId = userId;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchAlerts(filters: IAlertFilters, _page = 1): Promise<IAlertsFeedResponse> {
    const all = hasUserScope() ? hydrateAlerts(_currentUserId) : [...SEED_ALERTS];
    const filtered = applyFilters(all, filters);
    return {
        alerts: filtered,
        totalCount: filtered.length,
        unreadCount: all.filter((a) => !a.isAcknowledged && !a.isDismissed).length,
        page: 1,
        pageSize: 20,
        lastRefreshedAt: new Date().toISOString(),
    };
}

export async function acknowledgeAlert(payload: IAcknowledgeAlertPayload): Promise<void> {
    if (!hasUserScope()) return;
    acknowledgeAlertId(_currentUserId, payload.alertId);
}

export async function acknowledgeAllAlerts(): Promise<void> {
    if (!hasUserScope()) return;
    const allIds = SEED_ALERTS.map((a) => a.id);
    acknowledgeAllIds(_currentUserId, allIds);
}

export async function unacknowledgeAllAlerts(): Promise<void> {
    if (!hasUserScope()) return;
    unacknowledgeAllIds(_currentUserId);
}
