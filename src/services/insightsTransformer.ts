/**
 * insightsTransformer.ts
 *
 * Maps the raw /api/v1/insights response → IDashboardViewData.
 * Skeleton implementation — exact field mappings will be finalized once
 * the backend RBAC grants access to the insights endpoint.
 */
import type {
    IDashboardViewData,
    IKPIMetrics,
    IContributingFactorCounts,
} from '../types/dashboard.types';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Best-effort transform of the raw insights payload.
 * The backend schema is `additionalProperties: true`, so we
 * map known fields and provide safe defaults for missing ones.
 */
export function transformInsightsResponse(raw: any): IDashboardViewData {
    const factors: (keyof IContributingFactorCounts)[] = [
        'sleep', 'nutrition', 'stress', 'depression',
        'smoke', 'obesity', 'wellness', 'movement',
    ];

    const wellbeing: IContributingFactorCounts = {
        sleep: 0, depression: 0, smoke: 0, stress: 0,
        nutrition: 0, movement: 0, wellness: 0, obesity: 0,
    };
    for (const f of factors) {
        wellbeing[f] = raw?.wellbeing?.[f] ?? raw?.[f]?.count ?? 0;
    }

    const kpis: IKPIMetrics = {
        totalEmployees: raw?.total_employees ?? raw?.totalEmployees ?? 0,
        sleepCount: wellbeing.sleep,
        nutritionCount: wellbeing.nutrition,
        stressCount: wellbeing.stress,
        depressionCount: wellbeing.depression,
        smokeCount: wellbeing.smoke,
        obesityCount: wellbeing.obesity,
        movementCount: wellbeing.movement,
        wellnessCount: wellbeing.wellness,
    };

    return {
        kpis,
        wellbeingOverview: wellbeing,
        conditionSummary: raw?.condition_summary ?? raw?.conditionSummary ?? [],
        employeesWithConditions: raw?.employees_with_conditions ?? raw?.employeesWithConditions ?? [],
        severityOfSuffering: raw?.severity ?? raw?.severityOfSuffering ?? [],
        improvementRates: raw?.improvement_rates ?? raw?.improvementRates ?? [],
        lastUpdatedAt: raw?.last_updated_at ?? new Date().toISOString(),
    };
}
