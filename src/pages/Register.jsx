import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, Globe, Shield, ShieldCheck, CheckCircle, ChevronRight, MapPin, Camera, Award } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        location: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const { register, error } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported in this browser.');
            return;
        }

        setIsLocating(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setFormData((prev) => ({
                    ...prev,
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                }));
                setIsLocating(false);
            },
            () => {
                setLocationError('Location access denied or unavailable. Please allow location to continue.');
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.location) {
            setLocationError('Please fetch your location before registering.');
            return;
        }

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
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 lg:p-12 font-sans selection:bg-primary/20">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative w-full max-w-7xl flex flex-col lg:flex-row gap-16 items-start">
                
                {/* Left Side: Branding & Community Info */}
                <div className="hidden lg:flex flex-col flex-1 sticky top-12 animate-slide-up">
                    <Link to="/" className="flex items-center gap-3 mb-10 group w-fit">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Globe className="text-white" size={28} />
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-text">
                            Wild<span className="text-primary">Safe</span>
                        </span>
                    </Link>

                    <h1 className="text-6xl font-black text-text mb-8 leading-[1.1] tracking-tight">
                        Become a <br />
                        <span className="text-primary">Wildlife Guardian</span>
                    </h1>

                    <p className="text-xl text-text-muted mb-12 max-w-lg leading-relaxed font-medium">
                        Join our global network of protectors. Help us monitor, report, and preserve biodiversity using real-time AI technology.
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                         <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <ShieldCheck className="text-primary" size={24} />
                             </div>
                             <h4 className="font-bold text-text mb-1">Safety First</h4>
                             <p className="text-sm text-text-muted leading-relaxed">Prioritizing human and wildlife coexistence.</p>
                         </div>
                         <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                                <Award className="text-blue-500" size={24} />
                             </div>
                             <h4 className="font-bold text-text mb-1">Earn Badges</h4>
                             <p className="text-sm text-text-muted leading-relaxed">Get recognized for your conservation impact.</p>
                         </div>
                    </div>

                    <div className="flex items-center gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-border">
                        <div className="flex -space-x-3">
                            {[11, 12, 13, 14, 15].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-surface overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-lg font-black text-text tracking-tighter">50,000+ Guardians</p>
                            <p className="text-sm font-bold text-text-muted">Already protecting African wildlife</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Registration Card */}
                <div className="w-full lg:max-w-xl animate-fade-in mb-12 lg:mb-0">
                    <div className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 border border-border overflow-hidden">
                        {/* Header Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                                alt="African Savannah" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                            <div className="absolute bottom-6 left-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-border animate-bounce">
                                    <Award className="text-yellow-500" size={16} />
                                    <span className="text-xs font-black text-text uppercase tracking-widest">Join the Herd</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 lg:p-12">
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-text mb-2 tracking-tight">Create Your Account</h2>
                                <p className="text-text-muted font-medium">Start your journey as a Wildlife Guardian today</p>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 border border-red-100">
                                    <Shield size={18} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-text uppercase tracking-widest pl-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                                <User size={18} className="text-text-muted" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-surface border-2 border-transparent focus:border-primary/20 focus:bg-white py-4 pl-14 pr-6 rounded-2xl text-text font-bold transition-all placeholder:text-text-muted/50 outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-text uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                                <Mail size={18} className="text-text-muted" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-surface border-2 border-transparent focus:border-primary/20 focus:bg-white py-4 pl-14 pr-6 rounded-2xl text-text font-bold transition-all placeholder:text-text-muted/50 outline-none"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-text uppercase tracking-widest pl-1">Phone Number</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                                <Phone size={18} className="text-text-muted" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full bg-surface border-2 border-transparent focus:border-primary/20 focus:bg-white py-4 pl-14 pr-6 rounded-2xl text-text font-bold transition-all placeholder:text-text-muted/50 outline-none"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-text uppercase tracking-widest pl-1">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                                <Lock size={18} className="text-text-muted" />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
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
                                </div>

                                {/* Location Service */}
                                <div className="space-y-3 pt-2">
                                    <label className="text-sm font-black text-text uppercase tracking-widest pl-1 flex items-center gap-2">
                                        Protection Zone 
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Required</span>
                                    </label>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <button
                                            type="button"
                                            onClick={handleFetchLocation}
                                            disabled={isLocating}
                                            className="flex-1 flex items-center justify-center gap-3 py-4 bg-primary/10 text-primary rounded-2xl font-black border-2 border-transparent hover:border-primary/30 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <MapPin size={20} className={isLocating ? 'animate-bounce' : ''} />
                                            {isLocating ? 'Capturing...' : 'Fetch My Location'}
                                        </button>
                                        <div className="flex-1 bg-surface py-4 px-6 rounded-2xl flex items-center justify-center text-sm font-bold text-text-muted border border-border">
                                            {formData.location 
                                                ? `✓ ${formData.location.coordinates[1].toFixed(4)}, ${formData.location.coordinates[0].toFixed(4)}`
                                                : "Location not captured"
                                            }
                                        </div>
                                    </div>
                                    {locationError && <p className="text-xs text-red-500 font-bold pl-1">{locationError}</p>}
                                </div>

                                {/* Terms */}
                                <div className="flex items-start gap-4 pt-4 group cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${acceptedTerms ? 'bg-primary border-primary' : 'bg-surface border-border'}`}>
                                        {acceptedTerms && <CheckCircle className="text-white" size={14} />}
                                    </div>
                                    <p className="text-sm font-bold text-text-muted leading-relaxed">
                                        I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>, and I commit to protecting wildlife.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !acceptedTerms}
                                    className="w-full btn-primary !py-5 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50"
                                >
                                    <span className="relative z-10 font-black text-lg">
                                        {isSubmitting ? 'Creating Account...' : 'Become a Wildlife Guardian'}
                                    </span>
                                    <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                                    <div className="absolute inset-0 bg-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>

                                <div className="pt-8 text-center border-t border-border mt-8">
                                    <p className="text-text-muted font-bold">
                                        Already a member? <br />
                                        <Link to="/login" className="text-primary hover:underline ml-1">Log In Here</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;