import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { 
    LayoutDashboard, MapPin, AlertCircle, Clock, 
    CheckCircle2, Target, Users, Settings, 
    ArrowRight, Activity, Shield, Package,
    Loader2, Search, Filter, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const OfficerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeIncidents: 0,
        pendingReports: 0,
        assignedCases: 0,
        unsolvedAlerts: 0
    });
    const [recentMissions, setRecentMissions] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            // In a real app, these would be separate API calls
            // For now, setting mock data that fits the new UI
            setStats({
                activeIncidents: 12,
                pendingReports: 5,
                assignedCases: 8,
                unsolvedAlerts: 3
            });

            // Fetch assigned resources
            const res = await api.get('/resources');
            const myResources = res.data.filter(r => 
                r.status === 'ASSIGNED' && 
                (r.assignedTo?._id === user?._id || r.assignedTo === user?._id || r.assignedTo?.userId?._id === user?._id)
            );
            setResources(myResources);

            setRecentMissions([
                { id: 1, title: 'Elephant Migration Tracking', location: 'Sector 5 - Northern Bridge', status: 'ACTIVE', priority: 'HIGH', time: '2h ago' },
                { id: 2, title: 'Illegal Logging Patrol', location: 'West Forest Perimeter', status: 'COMPLETED', priority: 'MEDIUM', time: '5h ago' },
                { id: 3, title: 'Medical Rescue: Leopard', location: 'Eastern Ravine', status: 'PENDING', priority: 'URGENT', time: '12h ago' },
            ]);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'COMPLETED': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-surface pb-16">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 mt-24 animate-fade-in">
                {/* Welcome Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
                            <Shield size={14} />
                            Operational Command
                        </div>
                        <h1 className="text-5xl font-black text-text tracking-tighter mb-2">Ranger <span className="text-primary">Hub</span></h1>
                        <p className="text-text-muted text-lg max-w-2xl font-medium">Welcome back, {user?.name}. You have {stats.activeIncidents} active missions in your sector.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/resources" className="h-14 px-8 flex items-center gap-3 rounded-2xl bg-white border-2 border-border text-text font-black hover:bg-surface transition-all shadow-premium">
                            <Package size={20} className="text-primary" />
                            My Inventory
                        </Link>
                        <button className="btn-primary h-14 !px-8 flex items-center gap-2">
                            <Target size={20} />
                            New Incident
                        </button>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {[
                        { label: 'Active Incidents', value: stats.activeIncidents, icon: AlertCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Pending Reports', value: stats.pendingReports, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Assigned Cases', value: stats.assignedCases, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'System Alerts', value: stats.unsolvedAlerts, icon: Activity, color: 'text-red-600', bg: 'bg-red-50' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-[32px] p-8 border border-border shadow-premium hover:shadow-2xl transition-all hover:translate-y-[-4px]">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6`}>
                                <stat.icon size={28} />
                            </div>
                            <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className="text-4xl font-black text-text">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Missions */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[40px] border border-border p-10 shadow-premium">
                             <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-text">Mission <span className="text-primary">Timeline</span></h2>
                                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                    View Schedule <ArrowRight size={16} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {loading ? (
                                    <div className="py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                                    </div>
                                ) : (
                                    recentMissions.map(mission => (
                                        <div key={mission.id} className="group p-6 rounded-3xl border border-border bg-surface/30 hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                                    <Target size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-text mb-1">{mission.title}</h3>
                                                    <div className="flex items-center gap-3 text-xs font-bold text-text-muted">
                                                        <span className="flex items-center gap-1"><MapPin size={12} /> {mission.location}</span>
                                                        <span className="flex items-center gap-1"><Calendar size={12} /> {mission.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${getStatusColor(mission.status)}`}>
                                                    {mission.status}
                                                </span>
                                                <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Side Panel: Inventory & Quick Actions */}
                    <div className="space-y-8">
                         <section className="bg-white rounded-[40px] border border-border p-10 shadow-premium">
                            <h2 className="text-xl font-black text-text mb-6">Equipped <span className="text-primary">Assets</span></h2>
                            <div className="space-y-4">
                                {resources.length === 0 ? (
                                    <div className="py-8 text-center bg-surface rounded-3xl border border-dashed border-border">
                                        <Package className="mx-auto text-text-muted mb-3 opacity-30" size={32} />
                                        <p className="text-sm font-bold text-text-muted">No tactical gear equipped</p>
                                        <Link to="/resources" className="text-xs font-black text-primary mt-2 block uppercase tracking-widest">Open Armory</Link>
                                    </div>
                                ) : (
                                    resources.map(res => (
                                        <div key={res._id} className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Package size={18} className="text-primary" />
                                                <span className="text-sm font-bold text-text truncate max-w-[120px]">{res.description}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-text-muted tracking-tight">{res.metadata?.serialNumber || 'SN-X'}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="bg-primary rounded-[40px] p-10 shadow-xl shadow-primary/20 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2 tracking-tight transition-transform hover:translate-x-1 cursor-default">Field Intelligence</h3>
                                <p className="text-white/80 text-sm font-medium mb-6">Our AI detected increased activity in the Eastern Corridor. Stay alert.</p>
                                <button className="w-full py-4 bg-white text-primary font-black rounded-2xl hover:bg-surface transition-all shadow-lg active:scale-95">
                                    Analyze Area
                                </button>
                            </div>
                            <Activity className="absolute -bottom-10 -right-10 text-white/10" size={180} />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OfficerDashboard;
