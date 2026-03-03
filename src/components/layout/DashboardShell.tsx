import { Outlet } from 'react-router-dom';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useSyncUnreadCount } from '../../hooks/useAlerts';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardShell = () => {
    // Global keyboard shortcuts active on every authenticated page
    useKeyboardShortcuts();
    // Keep bell badge in sync regardless of which page is active
    useSyncUnreadCount();

    return (
        <div className="flex flex-col h-screen bg-[#E8E9F0] dark:bg-[#1A1B2E] overflow-hidden">
            {/* Global top bar — spans full width */}
            <TopBar />

            {/* Sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Page content */}
                    <main className="flex-1 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardShell;
