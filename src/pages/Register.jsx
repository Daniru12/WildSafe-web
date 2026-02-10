import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(formData);
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
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Join WildSafe</h1>
                    <p className="text-text-muted">Be part of the forest protection movement.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && (
                        <div className="bg-red-500/10 border border-danger text-danger p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="text-sm font-medium text-text-muted">Full Name</label>
                        <div className="relative flex items-center">
                            <User size={18} className="absolute left-4 text-text-muted" />
                            <input
                                type="text"
                                name="name"
                                className="input-field pl-12"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="text-sm font-medium text-text-muted">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail size={18} className="absolute left-4 text-text-muted" />
                            <input
                                type="email"
                                name="email"
                                className="input-field pl-12"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="text-sm font-medium text-text-muted">Phone Number</label>
                        <div className="relative flex items-center">
                            <Phone size={18} className="absolute left-4 text-text-muted" />
                            <input
                                type="text"
                                name="phone"
                                className="input-field pl-12"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="text-sm font-medium text-text-muted">Password</label>
                        <div className="relative flex items-center">
                            <Lock size={18} className="absolute left-4 text-text-muted" />
                            <input
                                type="password"
                                name="password"
                                className="input-field pl-12"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full mt-4" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Register Now'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-text-muted">
                    <p>Already have an account? <Link to="/login" className="text-primary hover:opacity-80 transition-opacity">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
