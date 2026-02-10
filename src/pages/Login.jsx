import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();

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
        <div className="min-h-screen flex justify-center items-center p-8 bg-auth-gradient bg-cover bg-center animate-fade-in">
            <div className="w-full max-width-[450px] p-12 glass-morphism">
                <div className="text-center mb-10">
                    <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-primary/40">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-text-muted">Protecting wildlife, one report at a time.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && (
                        <div className="bg-red-500/10 border border-danger text-danger p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="text-sm font-medium text-text-muted">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail size={18} className="absolute left-4 text-text-muted" />
                            <input
                                type="email"
                                className="input-field pl-12"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="text-sm font-medium text-text-muted">Password</label>
                        <div className="relative flex items-center">
                            <Lock size={18} className="absolute left-4 text-text-muted" />
                            <input
                                type="password"
                                className="input-field pl-12"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full mt-4" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-text-muted">
                    <p>Don't have an account? <Link to="/register" className="text-primary hover:opacity-80 transition-opacity">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
