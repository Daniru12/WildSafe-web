import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

import { Shield, LogOut, LayoutDashboard, FileText, BarChart3, Menu, X, Globe, User, Plus, Package, AlertTriangle, Sparkles, ChevronDown, Navigation2, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    // Admins use the sidebar layout
    if (isAuthenticated && user?.role === 'ADMIN') return null;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Analytics', path: '/analytics' },
    ];

    const officerLinks = [
        { name: 'Missions', path: '/ranger-missions' },
        { name: 'Resources', path: '/resources' },
    ];

    const adminLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Staff', path: '/staff' },
        { name: 'Users', path: '/users' },
        { name: 'Resources', path: '/resources' },
        { name: 'Insights', path: '/ai-insights' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`
            fixed top-0 left-0 right-0 z-50 transition-all duration-500
            ${scrolled ? 'py-3' : 'py-5'}
        `}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`
                    flex justify-between items-center transition-all duration-500
                    ${isAuthenticated && location.pathname !== '/' ? 'bg-text text-white border-transparent' : 'bg-white border-border'}
                    ${scrolled ? 'rounded-2xl shadow-premium border-border/50 py-3 px-6' : 'rounded-3xl border-transparent py-4 px-8'}
                `}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                            <img src="/favicon.svg" alt="WildSafe Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <span className={`text-2xl font-black tracking-tighter ${isAuthenticated && location.pathname !== '/' ? 'text-white' : 'text-text'}`}>
                            Wild<span className="text-primary">Safe</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path}
                                className={`
                                    text-[14px] font-bold transition-all hover:text-primary relative py-1
                                    ${isActive(link.path) ? 'text-primary' : (isAuthenticated && location.pathname !== '/' ? 'text-white/70' : 'text-text-muted')}
                                `}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                        
                        {isAuthenticated && user?.role === 'OFFICER' && officerLinks.map((link) => (
                             <Link 
                                key={link.path}
                                to={link.path}
                                className={`
                                    text-[14px] font-bold transition-all hover:text-primary relative py-1
                                    ${isActive(link.path) ? 'text-primary' : (isAuthenticated && location.pathname !== '/' ? 'text-white/70' : 'text-text-muted')}
                                `}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}

                        {isAuthenticated && user?.role === 'ADMIN' && adminLinks.map((link) => (
                             <Link 
                                key={link.path}
                                to={link.path}
                                className={`
                                    text-[14px] font-bold transition-all hover:text-primary relative py-1
                                    ${isActive(link.path) ? 'text-primary' : (isAuthenticated && location.pathname !== '/' ? 'text-white/70' : 'text-text-muted')}
                                `}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                {user?.role === 'OFFICER' && (
                                    <Link to="/case-management" className="text-sm font-bold text-text-muted hover:text-primary transition-all">
                                        Active Cases
                                    </Link>
                                )}
                                
                                <NotificationDropdown />

                                <div className="group relative">
                                    <Link to="/profile" className={`flex items-center gap-3 p-1 pr-4 rounded-full border transition-all ${isAuthenticated && location.pathname !== '/' ? 'bg-white/10 border-white/10' : 'bg-surface border-border'}`}>
                                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                                            <User size={18} />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className={`text-xs font-bold leading-none ${isAuthenticated && location.pathname !== '/' ? 'text-white' : 'text-text'}`}>{user?.name}</span>
                                            <span className="text-[10px] text-primary font-black uppercase tracking-widest">{user?.role}</span>
                                        </div>
                                        <ChevronDown size={14} className={`${isAuthenticated && location.pathname !== '/' ? 'text-white/50' : 'text-text-muted'} transition-transform group-hover:rotate-180`} />
                                    </Link>
                                    
                                    <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-white border border-border p-2 rounded-2xl shadow-premium">
                                            <Link to="/dashboard" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-text-muted hover:text-primary hover:bg-surface transition-all">
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-danger hover:bg-red-50 transition-all"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-8">
                                <Link to="/login" className="text-[15px] font-bold text-text hover:text-primary transition-all">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary !py-3 !px-7 !rounded-full text-sm group">
                                    Start Free Trial
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-4">
                        {isAuthenticated && <NotificationDropdown />}
                        <button 
                            onClick={toggleMenu}
                            className="p-2 text-text hover:text-primary transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`
                    lg:hidden overflow-hidden transition-all duration-500 mt-4
                    ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 invisible'}
                `}>
                    <div className="bg-white border border-border p-6 rounded-3xl flex flex-col gap-4 shadow-premium">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg font-bold ${isActive(link.path) ? 'text-primary' : 'text-text-muted'}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated && user?.role === 'OFFICER' && officerLinks.map((link) => (
                             <Link 
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg font-bold ${isActive(link.path) ? 'text-primary' : 'text-text-muted'}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated && user?.role === 'ADMIN' && adminLinks.map((link) => (
                             <Link 
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg font-bold ${isActive(link.path) ? 'text-primary' : 'text-text-muted'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <div className="pt-4 border-t border-border flex flex-col gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="font-bold text-text">Profile</Link>
                                    <button onClick={handleLogout} className="text-left font-bold text-danger">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="font-bold text-text">Login</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full !rounded-full">Start Free Trial</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


