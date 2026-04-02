import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Globe,
    LayoutDashboard,
    Shield,
    BarChart3,
    Package,
    Users,
    LogOut,
    User,
    ChevronLeft,
    ChevronRight,
    Bell,
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const adminNavItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Users', to: '/users', icon: Users },
    { label: 'Case Management', to: '/case-management', icon: Shield },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Resources', to: '/resources', icon: Package },
    { label: 'Staff', to: '/staff', icon: Users },
];

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* ── Left Sidebar ── */}
            <aside
                className={`
                    fixed top-0 left-0 h-full z-40 flex flex-col
                    bg-surface border-r border-border
                    transition-all duration-300 ease-in-out
                    ${collapsed ? 'w-[72px]' : 'w-64'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-border shrink-0">
                    <Globe className="text-primary animate-pulse shrink-0" size={26} />
                    {!collapsed && (
                        <span className="text-xl font-extrabold text-white truncate">
                            WildSafe
                        </span>
                    )}
                </div>

                {/* Admin badge */}
                {!collapsed && (
                    <div className="px-5 py-3 border-b border-border">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                            Admin Panel
                        </span>
                    </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
                    {adminNavItems.map(({ label, to, icon: Icon }) => {
                        const active = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                title={collapsed ? label : undefined}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                                    font-medium text-sm transition-all duration-150
                                    ${active
                                        ? 'bg-primary/20 text-primary'
                                        : 'text-text-muted hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={19} className="shrink-0" />
                                {!collapsed && <span className="truncate">{label}</span>}
                                {active && !collapsed && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: user + logout */}
                <div className="border-t border-border px-3 py-4 space-y-2 shrink-0">
                    {/* Notifications */}
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-2'}`}>
                        <NotificationDropdown />
                        {!collapsed && (
                            <span className="text-sm text-text-muted">Notifications</span>
                        )}
                    </div>

                    {/* Profile */}
                    <Link
                        to="/profile"
                        title={collapsed ? user?.name : undefined}
                        className="flex items-center gap-3 px-2 py-2 rounded-xl text-text-muted hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <User size={19} className="shrink-0" />
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
                                <div className="text-xs text-primary font-bold uppercase">{user?.role}</div>
                            </div>
                        )}
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Logout' : undefined}
                        className={`
                            flex items-center gap-3 w-full px-2 py-2 rounded-xl
                            text-text-muted hover:bg-red-500/10 hover:text-danger transition-colors
                            ${collapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut size={19} className="shrink-0" />
                        {!collapsed && <span className="text-sm">Logout</span>}
                    </button>
                </div>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="
                        absolute -right-3.5 top-1/2 -translate-y-1/2
                        w-7 h-7 rounded-full bg-surface border border-border
                        flex items-center justify-center text-text-muted
                        hover:text-primary hover:border-primary transition-colors shadow-lg
                    "
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>

            {/* ── Main Content ── */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-64'}`}
            >
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
