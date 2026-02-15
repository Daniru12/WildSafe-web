import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { Shield, LogOut, LayoutDashboard, FileText, BarChart3, Menu, X, Globe, Info, User, Plus, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="sticky top-4 mx-4 px-8 py-3 z-50 flex justify-center glass-morphism">
            <div className="w-full max-w-6xl flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold text-white">
                    <Globe className="text-primary animate-pulse" />
                    <span>WildAsset</span>
                </Link>

                <div className={`
                    absolute top-full left-0 right-0 p-6 flex flex-col gap-6 bg-surface border-t border-border rounded-b-2xl md:static md:p-0 md:flex-row md:gap-8 md:bg-transparent md:border-t-0 md:rounded-none
                    ${isOpen ? 'flex' : 'hidden md:flex'}
                `}>
                    <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-muted font-medium transition-colors hover:text-primary">
                        <span>Home</span>
                    </Link>

                    <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-muted font-medium transition-colors hover:text-primary">
                        <span>About</span>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-muted font-medium transition-colors hover:text-primary">
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>

                            {user?.role === 'CITIZEN' && (
                                <>
                                    <Link to="/threat-report" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-muted font-medium transition-colors hover:text-primary">
                                        <Plus size={18} />
                                        <span>Report Threat</span>
                                    </Link>
                                    <Link to="/report" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-muted font-medium transition-colors hover:text-primary">
                                        <FileText size={18} />
                                        <span>Report Incident</span>
                                    </Link>
                                </>
                            )}

                            {['OFFICER', 'ADMIN'].includes(user?.role) && (
                                <>
                                    <Link to="/case-management" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-muted font-medium transition-colors hover:text-primary">
                                        <Shield size={18} />
                                        <span>Case Management</span>
                                    </Link>
                                    <Link to="/analytics" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-text-muted font-medium transition-colors hover:text-primary">
                                        <BarChart3 size={18} />
                                        <span>Analytics</span>
                                    </Link>
                                </>
                            )}

                            <div className="flex items-center gap-4 pt-4 border-t border-border md:pt-0 md:border-t-0 md:pl-6 md:ml-2 md:border-l">
                                {['OFFICER', 'ADMIN'].includes(user?.role) && (
                                    <NotificationDropdown />
                                )}

                                <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <User size={18} />
                                    <span className="font-semibold text-sm">{user?.name}</span>
                                </Link>
                                <span className="badge">{user?.role}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-text-muted transition-colors hover:bg-red-500/10 hover:text-danger"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-text-muted hover:text-primary font-medium">Login</Link>
                            <Link to="/register" className="btn-primary py-2 px-4 text-sm">Join Platform</Link>
                        </div>
                    )}
                </div>

                <div className="md:hidden text-white cursor-pointer" onClick={toggleMenu}>
                    {isOpen ? <X /> : <Menu />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
