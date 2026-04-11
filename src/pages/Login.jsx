import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, Shield, ShieldCheck, CheckCircle, ChevronRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 lg:p-12 font-sans selection:bg-primary/20">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-16 items-center">
                
                {/* Left Side: Branding & Info */}
                <div className="hidden lg:flex flex-col flex-1 animate-slide-up">
                    <Link to="/" className="flex items-center gap-3 mb-12 group w-fit">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Globe className="text-white" size={28} />
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-text">
                            Wild<span className="text-primary">Safe</span>
                        </span>
                    </Link>

                    <h1 className="text-5xl font-black text-text mb-8 leading-[1.1] tracking-tight">
                        Protecting communities with <br />
                        <span className="text-primary">expert wildlife safety</span>
                    </h1>

                    <p className="text-xl text-text-muted mb-12 max-w-lg leading-relaxed font-medium">
                        Log in to access your monitoring hub, manage ranger missions, and stay updated on local wildlife activity.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: <ShieldCheck className="text-primary" />, title: "Secure Access", desc: "Enterprise-grade encryption for all your data." },
                            { icon: <CheckCircle className="text-primary" />, title: "Verified Hubs", desc: "Every mission and alert is verified and logged." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-border shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-text mb-1">{item.title}</h4>
                                    <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-text-muted">
                            Joined by <span className="text-text">4,200+</span> active rangers worldwide
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Card */}
                <div className="w-full lg:max-w-md animate-fade-in">
                    <div className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 border border-border overflow-hidden">
                        {/* Mobile Logo */}
                        <div className="lg:hidden p-8 flex justify-center border-b border-border bg-surface/50">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <Globe className="text-white" size={24} />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-text">
                                    Wild<span className="text-primary">Safe</span>
                                </span>
                            </Link>
                        </div>

                        <div className="p-10 lg:p-12">
                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="text-3xl font-black text-text mb-2 tracking-tight">Welcome Back</h2>
                                <p className="text-text-muted font-medium">Log in to your WildSafe account</p>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 border border-red-100">
                                    <Shield size={18} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-text uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                            <Mail size={18} className="text-text-muted" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-surface border-2 border-transparent focus:border-primary/20 focus:bg-white py-4 pl-14 pr-6 rounded-2xl text-text font-bold transition-all placeholder:text-text-muted/50 outline-none"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center pl-1">
                                        <label className="text-sm font-black text-text uppercase tracking-widest">Password</label>
                                        <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                            <Lock size={18} className="text-text-muted" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-surface border-2 border-transparent focus:border-primary/20 focus:bg-white py-4 pl-14 pr-14 rounded-2xl text-text font-bold transition-all placeholder:text-text-muted/50 outline-none"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-text-muted hover:text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary !py-5 flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    <span className="relative z-10 font-black text-lg">
                                        {isSubmitting ? 'Signing in...' : 'Log In to Hub'}
                                    </span>
                                    <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                                    <div className="absolute inset-0 bg-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>

                                <div className="pt-8 text-center border-t border-border mt-8">
                                    <p className="text-text-muted font-bold">
                                        Don't have an account yet? <br />
                                        <Link to="/register" className="text-primary hover:underline ml-1">Join the Mission</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-xs text-text-muted/50 font-bold uppercase tracking-widest">
                        Protected by WildSafe Security Protocol • 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;