import { IDashboardViewData, IKPIMetrics, IContributingFactorCounts } from '../types/dashboard.types';

// ── Mock data for Phase 1 (no backend yet) ────────────────────────────────

const MOCK_KPIS: IKPIMetrics = {
    totalEmployees: 1247,
    sleepCount: 312,
    nutritionCount: 278,
    stressCount: 421,
    depressionCount: 187,
    smokeCount: 143,
    obesityCount: 356,
    movementCount: 298,
    wellnessCount: 224,
};

const MOCK_WELLBEING: IContributingFactorCounts = {
    sleep: 312,
    depression: 187,
    smoke: 143,
    stress: 421,
    nutrition: 278,
    movement: 298,
    wellness: 224,
    obesity: 356,
};

const MOCK_OVERVIEW: IDashboardViewData = {
    kpis: MOCK_KPIS,
    wellbeingOverview: MOCK_WELLBEING,
    conditionSummary: [
        { condition: 'No Condition', count: 438 },
        { condition: 'Hypertension', count: 312 },
        { condition: 'Type 2 Diabetes', count: 187 },
        { condition: 'Cardiovascular Disease', count: 143 },
        { condition: 'Chronic Kidney Disease', count: 98 },
        { condition: 'Mental Illness', count: 224 },
        { condition: 'Osteoporosis', count: 76 },
        { condition: 'Cancer', count: 54 },
    ],
    employeesWithConditions: [
        { condition: 'Sleep Issues', count: 312 },
        { condition: 'Stress', count: 421 },
        { condition: 'Depression', count: 187 },
        { condition: 'Smoking', count: 143 },
        { condition: 'Obesity', count: 356 },
    ],
    severityOfSuffering: [
        { factor: 'Sleep', min: 1, q1: 3, median: 5, q3: 7, max: 10 },
        { factor: 'Stress', min: 2, q1: 4, median: 6, q3: 8, max: 10 },
        { factor: 'Depression', min: 1, q1: 2, median: 4, q3: 6, max: 9 },
        { factor: 'Nutrition', min: 1, q1: 3, median: 5, q3: 6, max: 9 },
        { factor: 'Movement', min: 1, q1: 2, median: 4, q3: 6, max: 8 },
        { factor: 'Smoke', min: 2, q1: 4, median: 5, q3: 7, max: 10 },
    ],
    improvementRates: [
        { factor: 'Sleep', rate: 42, color: '#4EADA0' },
        { factor: 'Stress', rate: 35, color: '#5B5EA6' },
        { factor: 'Nutrition', rate: 58, color: '#7B6FA0' },
        { factor: 'Movement', rate: 63, color: '#E8896A' },
        { factor: 'Wellness', rate: 29, color: '#4B4D6D' },
        { factor: 'Obesity', rate: 22, color: '#6B6E94' },
    ],
    lastUpdatedAt: new Date().toISOString(),
};

const MOCK_LIFESTYLE: IDashboardViewData = {
    ...MOCK_OVERVIEW,
    kpis: { ...MOCK_KPIS, stressCount: 421, sleepCount: 312, movementCount: 298 },
};

const MOCK_NUTRITION: IDashboardViewData = {
    ...MOCK_OVERVIEW,
    kpis: { ...MOCK_KPIS, nutritionCount: 278, obesityCount: 356 },
};

const MOCK_FEELINGS: IDashboardViewData = {
    ...MOCK_OVERVIEW,
    kpis: { ...MOCK_KPIS, depressionCount: 187, stressCount: 421 },
};

const VIEW_DATA: Record<string, IDashboardViewData> = {
    overview: MOCK_OVERVIEW,
    lifestyle: MOCK_LIFESTYLE,
    'nutrition-obesity': MOCK_NUTRITION,
    feelings: MOCK_FEELINGS,
};

export async function fetchDashboardData(view: string): Promise<IDashboardViewData> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 400));
    return VIEW_DATA[view] ?? MOCK_OVERVIEW;
}
