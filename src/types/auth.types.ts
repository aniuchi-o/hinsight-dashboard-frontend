// All roles that can exist in the system
export type UserRole = 'EXECUTIVE' | 'WELLNESS_MANAGER' | 'PROGRAM_MANAGER' | 'ADMIN';

/**
 * RBAC Permissions Map — includes Alerts, Settings, Help.
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    EXECUTIVE: [
        'view:overview',
        'view:lifestyle',
        'view:nutrition_obesity',
        'view:feelings',
        'view:alerts',
        'view:settings',
        'view:help',
        'action:alerts:view',
        'action:settings:mutate',
    ],
    WELLNESS_MANAGER: [
        'view:overview',
        'view:lifestyle',
        'view:nutrition_obesity',
        'view:feelings',
        'view:reports',
        'view:alerts',
        'view:settings',
        'view:help',
        'action:alerts:view',
        'action:alerts:acknowledge',
        'action:settings:mutate',
    ],
    PROGRAM_MANAGER: [
        'view:overview',
        'view:lifestyle',
        'view:alerts',
        'view:settings',
        'view:help',
        'action:alerts:view',
        'action:alerts:acknowledge',
        'action:settings:mutate',
    ],
    ADMIN: [
        '*',
        'action:settings:system',
        'action:alerts:dismiss:all',
        'view:user:management',
    ],
};

export interface IAuthUser {
    id: string;
    role: UserRole;
    tenantId: string;
    displayName: string;
    permissions: string[];
    lastLoginAt: string;
    sessionId: string;
}

export interface IAuthState {
    user: IAuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    accessToken: string | null;
}
