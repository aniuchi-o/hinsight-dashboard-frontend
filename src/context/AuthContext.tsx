import {
    createContext, useContext, useReducer, ReactNode, useCallback, useEffect
} from 'react';
import { IAuthState, IAuthUser, ROLE_PERMISSIONS } from '../types/auth.types';

type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: { user: IAuthUser; accessToken: string } }
    | { type: 'LOGOUT' }
    | { type: 'TOKEN_REFRESHED'; payload: { accessToken: string } };

const initialState: IAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    accessToken: null,
};

function authReducer(state: IAuthState, action: AuthAction): IAuthState {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                isAuthenticated: true,
                isLoading: false,
            };
        case 'LOGOUT':
            return { ...initialState };
        case 'TOKEN_REFRESHED':
            return { ...state, accessToken: action.payload.accessToken };
        default:
            return state;
    }
}

interface IAuthContext extends IAuthState {
    login: (user: IAuthUser, accessToken: string) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Listen for 401 auto-logout event from apiClient
    useEffect(() => {
        const handler = () => dispatch({ type: 'LOGOUT' });
        window.addEventListener('hinsight:logout', handler);
        return () => window.removeEventListener('hinsight:logout', handler);
    }, []);

    const login = useCallback((user: IAuthUser, accessToken: string) => {
        const permissions = ROLE_PERMISSIONS[user.role] ?? [];
        // Store token in memory for apiClient interceptor
        (window as { __hinsight_token?: string }).__hinsight_token = accessToken;
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: { ...user, permissions }, accessToken },
        });
    }, []);

    const logout = useCallback(() => {
        delete (window as { __hinsight_token?: string }).__hinsight_token;
        dispatch({ type: 'LOGOUT' });
    }, []);

    const hasPermission = useCallback(
        (permission: string): boolean => {
            if (!state.user) return false;
            const perms = state.user.permissions;
            return perms.includes('*') || perms.includes(permission);
        },
        [state.user]
    );

    return (
        <AuthContext.Provider value={{ ...state, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): IAuthContext => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
