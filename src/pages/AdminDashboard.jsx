import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { 
    Activity, Shield, Users, Package, 
    AlertTriangle, TrendingUp, Search, Filter,
    Download, RefreshCcw, MoreHorizontal,
    BarChart3, Map as MapIcon, Calendar,
    ArrowUpRight, ArrowDownRight, Sparkles,
    Loader2
} from 'lucide-react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalIncidents: 0,
        activeRangers: 0,
        resourceUtilization: 0,
        safetyRating: 95
    });
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch for redesign
        setTimeout(() => {
            setStats({
                totalIncidents: 248,
                activeRangers: 34,
                resourceUtilization: 78,
                safetyRating: 92
            });
            setLoading(false);
        }, 1000);
    }, []);

    const tabs = [
        { id: 'overview', label: 'Command Overview', icon: Activity },
        { id: 'incidents', label: 'Incident Flow', icon: AlertTriangle },
        { id: 'resources', label: 'Fleet Status', icon: Package },
        { id: 'predictive', label: 'AI Predictions', icon: Sparkles }
    ];

    return (
        <div className="min-h-screen bg-surface pb-16">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 mt-24 animate-fade-in">
                {/* Header Area */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
                            <Shield size={14} />
                            Administrative HQ
                        </div>
                        <h1 className="text-5xl font-black text-text tracking-tighter mb-2">Central <span className="text-primary">Command</span></h1>
                        <p className="text-text-muted text-lg max-w-2xl font-medium">Real-time oversight of regional wildlife safety operations and personnel deployment.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="h-14 px-8 flex items-center gap-3 rounded-2xl bg-white border-2 border-border text-text font-black hover:bg-surface transition-all shadow-premium">
                            <Download size={20} />
                            Export Data
                        </button>
                        <Link to="/ai-insights" className="btn-primary h-14 !px-8 flex items-center gap-2">
                            <Sparkles size={20} />
                            Generate Intelligence
                        </Link>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {[
                        { label: 'Total Incidents', value: stats.totalIncidents, trend: '+12%', up: true, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Active Personnel', value: stats.activeRangers, trend: 'Optimal', up: true, icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
                        { label: 'Fleet Utilization', value: `${stats.resourceUtilization}%`, trend: '-4%', up: false, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Safety Index', value: `${stats.safetyRating}%`, trend: '+2%', up: true, icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-[32px] p-8 border border-border shadow-premium group hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                                    <stat.icon size={28} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-black p-2 rounded-xl border ${stat.up ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className="text-4xl font-black text-text">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Command Tabs */}
                <div className="mb-10 flex items-center gap-2 p-2 bg-white rounded-[24px] border border-border w-fit shadow-premium">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-3 px-6 py-3 rounded-[18px] text-sm font-black tracking-tight transition-all
                                ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-text-muted hover:bg-surface hover:text-text'}
                            `}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Area */}
                <section className="bg-white rounded-[40px] border border-border p-10 shadow-premium min-h-[500px]">
                    {activeTab === 'overview' && (
                        <div className="animate-fade-in">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-text mb-2">Operations Monitor</h2>
                                    <p className="text-text-muted font-medium">Visualizing data flow across all regional sectors.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-surface px-4 py-3 rounded-2xl border border-border">
                                        <Calendar size={18} className="text-primary" />
                                        <span className="text-xs font-black text-text uppercase">Last 30 Days</span>
                                    </div>
                                    <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface border border-border text-primary hover:bg-primary hover:text-white transition-all">
                                        <RefreshCcw size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                 {/* Mock Map View */}
                                <div className="rounded-[32px] overflow-hidden border border-border bg-surface relative h-[380px] group shadow-inner">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapIcon className="text-primary opacity-20 scale-[5] animate-pulse" />
                                        <p className="absolute bottom-10 text-xs font-black text-primary uppercase tracking-widest">Live Sector Activity Rendering...</p>
                                    </div>
                                    <div className="absolute top-6 left-6 space-y-3">
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-xl border border-border text-[10px] font-black uppercase text-primary shadow-sm">Sector Alpha: Stabilized</div>
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-xl border border-border text-[10px] font-black uppercase text-orange-500 shadow-sm">Sector Beta: 3 Incidents</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                     <h3 className="text-xl font-black text-text flex items-center gap-3">
                                        <TrendingUp className="text-primary" size={24} />
                                        Growth Analytics
                                     </h3>
                                     <div className="space-y-4">
                                        {[
                                            { label: 'Citizen Reports', progress: 85, color: 'bg-primary' },
                                            { label: 'Ranger Missions', progress: 62, color: 'bg-blue-500' },
                                            { label: 'AI Detections', progress: 94, color: 'bg-purple-500' }
                                        ].map((bar, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-text-muted">
                                                    <span>{bar.label}</span>
                                                    <span>{bar.progress}%</span>
                                                </div>
                                                <div className="h-4 bg-surface rounded-full overflow-hidden border border-border">
                                                    <div 
                                                        className={`h-full ${bar.color} rounded-full transition-all duration-1000 ease-out shadow-lg`} 
                                                        style={{ width: `${bar.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                     </div>

                                     <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary/20">
                                            <BarChart3 size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-text">Strategic Report Ready</p>
                                            <p className="text-xs text-text-muted font-medium">A new intelligence summary for Q2 has been generated by AI.</p>
                                        </div>
                                        <button className="ml-auto text-primary px-3 py-1 font-black text-xs hover:underline uppercase tracking-widest">Open</button>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab !== 'overview' && (
                        <div className="flex flex-col items-center justify-center py-40 animate-scale-in text-center">
                            <div className="w-24 h-24 bg-surface rounded-[32px] flex items-center justify-center text-primary/30 mb-8">
                                <Activity size={48} />
                            </div>
                            <h3 className="text-3xl font-black text-text mb-4">Command Module Loading</h3>
                            <p className="text-text-muted max-w-md font-medium">Initializing encrypted secure data link... All system functionalities will be active shortly.</p>
                            <Loader2 className="mt-10 animate-spin text-primary" size={40} />
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
