import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettingsContext } from '../context/SettingsContext';
import { IAuthUser, ROLE_PERMISSIONS } from '../types/auth.types';

const VIEW_ROUTE_MAP: Record<string, string> = {
    overview: '/overview',
    lifestyle: '/lifestyle',
    nutrition_obesity: '/nutrition-obesity',
    feelings: '/feelings',
};

// Mock wellness manager user for Phase 1 demo
const MOCK_EXECUTIVE: IAuthUser = {
    id: 'usr-wm-001',
    role: 'WELLNESS_MANAGER',
    tenantId: 'tenant-ca-001',
    displayName: 'Alex Morgan',
    permissions: ROLE_PERMISSIONS['WELLNESS_MANAGER'],
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sessionId: 'sess-abc123-def456',
};

const LoginPage = () => {
    const { login } = useAuth();
    const { defaultView } = useSettingsContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('exec@nytia.com');
    const [password, setPassword] = useState('••••••••');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth delay
        await new Promise((r) => setTimeout(r, 800));
        login(MOCK_EXECUTIVE, 'mock-jwt-token-phase1');
        navigate(VIEW_ROUTE_MAP[defaultView] ?? '/overview', { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-surface-light to-brand-50
                    dark:from-surface-dark dark:to-brand-dark px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-card-light dark:bg-card-dark rounded-card shadow-card p-8">
                    {/* Logo + brand */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center mb-3 shadow-lg">
                            <span className="text-white font-bold text-2xl">N</span>
                        </div>
                        <h1 className="text-xl font-bold text-brand dark:text-brand-light">HINSIGHT</h1>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Executive Health Outcomes Dashboard</p>
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <Shield size={10} />
                            HIPAA · PHIPA compliant
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm rounded-lg
                           border border-gray-200 dark:border-gray-600
                           bg-gray-50 dark:bg-surface-dark
                           text-gray-800 dark:text-gray-200
                           focus:outline-none focus:ring-2 focus:ring-brand/50"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2.5 pr-10 text-sm rounded-lg
                             border border-gray-200 dark:border-gray-600
                             bg-gray-50 dark:bg-surface-dark
                             text-gray-800 dark:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-brand/50"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-brand hover:bg-brand-dark
                         text-white font-semibold text-sm rounded-lg
                         transition-colors duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-brand/50"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Authenticating…
                                </span>
                            ) : (
                                'Sign in to HINSIGHT'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-6">
                        Phase 1 demo — click Sign in to proceed as Executive user.
                        <br />All data shown is synthetic and contains no PHI.
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-4">
                    © 2026 NYTIA Health Inc. · HIPAA/PHIPA compliant data handling
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
