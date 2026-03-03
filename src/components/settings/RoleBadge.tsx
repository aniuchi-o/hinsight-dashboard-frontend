import clsx from 'clsx';
import { UserRole } from '../../types/auth.types';

const ROLE_STYLES: Record<UserRole, string> = {
    EXECUTIVE: 'bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-light',
    WELLNESS_MANAGER: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
    PROGRAM_MANAGER: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    ADMIN: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

const ROLE_LABELS: Record<UserRole, string> = {
    EXECUTIVE: 'Executive',
    WELLNESS_MANAGER: 'Wellness Manager',
    PROGRAM_MANAGER: 'Program Manager',
    ADMIN: 'System Administrator',
};

const RoleBadge = ({ role }: { role: UserRole }) => (
    <span className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
        ROLE_STYLES[role]
    )}>
        {ROLE_LABELS[role]}
    </span>
);

export default RoleBadge;
