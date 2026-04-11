import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    Shield, Target, Users, Globe, Zap, CheckCircle, ArrowRight,
    Leaf, Heart, Award, Radar, Activity, TreePine, Camera,
    MapPin, Clock, UserCheck, ShieldCheck, Star
} from 'lucide-react';

// Reliable Pexels nature/wildlife images
const IMG_TEAM = "https://images.pexels.com/photos/2249342/pexels-photo-2249342.jpeg?auto=compress&cs=tinysrgb&w=600";
const IMG_MISSION = "https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=600";
const IMG_FOREST = "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=600";

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-36 pb-24 overflow-hidden bg-white">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl -z-0 -translate-x-1/2 translate-y-1/2" />

                <div className="relative max-w-7xl mx-auto px-6 z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <Leaf size={14} className="text-primary" />
                                <span className="text-xs font-black text-primary uppercase tracking-widest">About WildSafe</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-text mb-8 leading-[1.05] tracking-tight">
                                Protecting wildlife,<br />
                                <span className="text-primary">saving communities</span>
                            </h1>
                            <p className="text-xl text-text-muted leading-relaxed mb-10 max-w-xl">
                                WildSafe is Sri Lanka's leading wildlife safety platform, empowering rangers, officers, and citizens to monitor, report, and respond to wildlife threats through real-time AI-powered tools.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/register" className="btn-primary group">
                                    Join WildSafe
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-border font-bold text-text hover:border-primary hover:text-primary transition-all">
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="rounded-[32px] overflow-hidden aspect-[3/4] shadow-xl mt-8">
                                    <img src={IMG_TEAM} alt="Ranger in field" className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-5">
                                    <div className="rounded-[32px] overflow-hidden aspect-square shadow-xl">
                                        <img src={IMG_MISSION} alt="Wildlife" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-primary rounded-[32px] p-6 text-white shadow-xl">
                                        <p className="text-5xl font-black leading-none mb-2">25+</p>
                                        <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Active Ranger<br />Response Hubs</p>
                                    </div>
                                </div>
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-4 left-4 bg-white rounded-[24px] p-5 shadow-xl border border-border hidden sm:flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="text-primary" size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-text text-lg leading-none">4.9★</p>
                                    <p className="text-xs text-text-muted font-bold">Community Rated</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-16 bg-surface">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "12,000+", label: "Incidents Tracked", icon: <Radar size={20} className="text-primary" /> },
                            { value: "450+", label: "Rangers Deployed", icon: <UserCheck size={20} className="text-primary" /> },
                            { value: "98%", label: "Response Rate", icon: <Clock size={20} className="text-primary" /> },
                            { value: "50k+", label: "Citizens Protected", icon: <Users size={20} className="text-primary" /> },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <p className="text-4xl font-black text-text mb-1 tracking-tight">{stat.value}</p>
                                <p className="text-sm text-text-muted font-bold uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Challenge */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <span className="text-xs font-black text-primary uppercase tracking-widest">Our Purpose</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-text tracking-tight mb-6">
                            Why <span className="text-primary">WildSafe</span> exists
                        </h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            Human-wildlife conflict is a growing crisis. We built WildSafe to bridge the gap between communities and conservationists with technology.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-white rounded-[40px] border border-border shadow-premium p-10 group hover:shadow-2xl transition-all">
                            <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Shield className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-3xl font-black text-text mb-5">The Challenge</h3>
                            <p className="text-text-muted leading-relaxed text-lg">
                                Traditional wildlife monitoring is slow, disjointed, and inaccessible to communities. By the time an incident is escalated, critical response windows are missed — endangering both humans and animals.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {["Delayed reporting pipelines", "Lack of real-time situational awareness", "No unified incident tracking"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-text-muted font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-primary rounded-[40px] p-10 text-white group hover:shadow-2xl transition-all shadow-premium">
                            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Zap className="text-white" size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-5">Our Solution</h3>
                            <p className="text-white/80 leading-relaxed text-lg">
                                WildSafe unifies citizens, rangers, and administrators on a single intelligent platform — with AI-powered species identification, real-time mission coordination, and instant emergency alerts.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {["AI-guided ranger dispatch", "Community threat reporting", "Live analytics dashboard"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white font-bold text-sm">
                                        <CheckCircle size={16} className="text-white/70 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Technology */}
            <section className="py-28 bg-surface">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <span className="text-xs font-black text-primary uppercase tracking-widest">Technology</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-text tracking-tight">
                            Built with cutting-edge tools
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Radar size={28} />,
                                title: "Real-Time Monitoring",
                                tech: "WebSocket + REST APIs",
                                desc: "Incidents, rangers, and alerts update live across all dashboards without page refresh.",
                                color: "text-blue-600",
                                bg: "bg-blue-50"
                            },
                            {
                                icon: <Camera size={28} />,
                                title: "AI Species ID",
                                tech: "Groq + Vision Models",
                                desc: "Citizens can identify wildlife from photos. AI returns species info, threat level, and recommended action.",
                                color: "text-primary",
                                bg: "bg-primary/10"
                            },
                            {
                                icon: <MapPin size={28} />,
                                title: "Geo-Mapped Cases",
                                tech: "Leaflet.js + OSM",
                                desc: "All incidents are plotted on an interactive map for rangers to visualize their patrol zones.",
                                color: "text-orange-500",
                                bg: "bg-orange-50"
                            },
                            {
                                icon: <Activity size={28} />,
                                title: "Analytics Engine",
                                tech: "Recharts + MongoDB",
                                desc: "Admins get trend analysis, incident heatmaps, and predictive risk insights.",
                                color: "text-purple-600",
                                bg: "bg-purple-50"
                            },
                            {
                                icon: <Shield size={28} />,
                                title: "Role-Based Access",
                                tech: "JWT Auth + Node.js",
                                desc: "Citizen, Officer, and Admin roles with distinct permissions and dedicated dashboards.",
                                color: "text-emerald-600",
                                bg: "bg-emerald-50"
                            },
                            {
                                icon: <Zap size={28} />,
                                title: "Emergency Alerts",
                                tech: "SendGrid + WebPush",
                                desc: "Broadcast critical wildlife threat alerts to all nearby community members immediately.",
                                color: "text-red-500",
                                bg: "bg-red-50"
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-[32px] border border-border shadow-premium p-8 group hover:shadow-2xl transition-all hover:-translate-y-1">
                                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-black text-text mb-1">{item.title}</h4>
                                <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">{item.tech}</p>
                                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who We Serve */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <span className="text-xs font-black text-primary uppercase tracking-widest">Platform Users</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-text tracking-tight">
                            Three roles, one platform
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                role: "Citizens",
                                icon: <Users size={36} />,
                                color: "bg-blue-500",
                                desc: "Report wildlife sightings, receive emergency alerts, track your incident reports, and identify species using AI.",
                                features: ["Submit threat reports", "AI species identification", "Real-time alert notifications"]
                            },
                            {
                                role: "Rangers / Officers",
                                icon: <Shield size={36} />,
                                color: "bg-primary",
                                desc: "Receive missions, manage case investigations, coordinate with other officers, and use AI-guided response plans.",
                                features: ["Ranger mission tracking", "Case investigation tools", "AI response suggestions"]
                            },
                            {
                                role: "Administrators",
                                icon: <Award size={36} />,
                                color: "bg-purple-600",
                                desc: "Full command dashboard with analytics, staff management, resource allocation, and system-wide oversight.",
                                features: ["Full analytics dashboard", "Staff & resource management", "Broadcast emergency alerts"]
                            }
                        ].map((item, i) => (
                            <div key={i} className="rounded-[40px] border border-border shadow-premium overflow-hidden group hover:shadow-2xl transition-all">
                                <div className={`${item.color} px-8 py-10 text-white`}>
                                    <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-black">{item.role}</h3>
                                </div>
                                <div className="bg-white p-8">
                                    <p className="text-text-muted mb-6 leading-relaxed">{item.desc}</p>
                                    <ul className="space-y-3">
                                        {item.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-3 font-bold text-text text-sm">
                                                <CheckCircle size={16} className="text-primary flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Impact */}
            <section className="py-28 bg-surface overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <span className="text-xs font-black text-primary uppercase tracking-widest">Our Impact</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-text tracking-tight mb-8">
                                Making a real <span className="text-primary">difference</span><br />for nature
                            </h2>
                            <p className="text-text-muted text-lg leading-relaxed mb-10">
                                Since our launch, WildSafe has become an essential tool for conservation organizations, local governments, and ranger teams across South Asia.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { icon: <Globe size={24} />, value: "12", label: "Countries", color: "text-blue-500", bg: "bg-blue-50" },
                                    { icon: <Target size={24} />, value: "45+", label: "Species Protected", color: "text-orange-500", bg: "bg-orange-50" },
                                    { icon: <TreePine size={24} />, value: "200+", label: "Forest Zones", color: "text-primary", bg: "bg-primary/10" },
                                    { icon: <Heart size={24} />, value: "50k+", label: "Lives Safeguarded", color: "text-red-500", bg: "bg-red-50" },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white rounded-3xl border border-border shadow-premium p-6 flex items-center gap-4">
                                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} flex-shrink-0`}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-text leading-none">{stat.value}</p>
                                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-[40px] overflow-hidden shadow-2xl aspect-[4/5]">
                                <img src={IMG_FOREST} alt="Forest Conservation" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-[28px] p-6 shadow-xl border border-border hidden sm:block">
                                <div className="flex items-center gap-3 mb-3">
                                    {[0,1,2,3,4].map(s => (
                                        <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm font-black text-text">"Changed how we patrol."</p>
                                <p className="text-xs text-text-muted font-bold mt-1">— Head Ranger, Wilpattu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-28 bg-primary mx-6 mb-6 rounded-[60px] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-8">
                        <span className="text-xs font-black uppercase tracking-widest">Join the Mission</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-8 leading-tight">
                        Ready to protect your<br />community today?
                    </h2>
                    <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">
                        Join thousands of rangers, officers, and citizens already using WildSafe to make Sri Lanka safer for humans and wildlife alike.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-full font-black hover:bg-gray-100 transition-all shadow-xl text-lg">
                            Get Started Free
                        </Link>
                        <Link to="/login" className="border-2 border-white/30 text-white px-10 py-4 rounded-full font-black hover:bg-white/10 transition-all text-lg">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
