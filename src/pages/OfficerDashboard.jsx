import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Filter, Search, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';

const OfficerDashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        category: ''
    });

    
    const fetchIncidents = async () => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const res = await api.get(`/incidents/all?${queryParams}`);
            setIncidents(res.data);
        } catch (err) {
            console.error('Failed to fetch incidents', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, [filters]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/incidents/${id}/status`, { status: newStatus });
            fetchIncidents();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SUBMITTED': return <Clock size={16} className="text-blue-400" />;
            case 'UNDER_REVIEW': return <Search size={16} className="text-amber-400" />;
            case 'IN_PROGRESS': return <AlertTriangle size={16} className="text-purple-400" />;
            case 'RESOLVED': return <CheckCircle size={16} className="text-emerald-400" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen pb-16">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 mt-12 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Management Dashboard</h1>
                    <p className="text-text-muted">Track and manage all environmental incidents reported by citizens.</p>
                </div>

                <div className="mb-8 p-6 glass-morphism">
                    <div className="flex items-center gap-6">
                        <Filter size={18} className="text-text-muted" />
                        <select
                            className="bg-surface border border-border text-text py-2 px-4 rounded-lg outline-none transition-colors focus:border-primary min-w-[180px]"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Statuses</option>
                            <option value="SUBMITTED">Submitted</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <select
                            className="bg-surface border border-border text-text py-2 px-4 rounded-lg outline-none transition-colors focus:border-primary min-w-[180px]"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">All Categories</option>
                            <option value="ILLEGAL_LOGGING">Illegal Logging</option>
                            <option value="FOREST_FIRE">Forest Fire</option>
                            <option value="POACHING">Poaching</option>
                            <option value="ANIMAL_CONFLICT">Animal Conflict</option>
                        </select>
                    </div>
                </div>

                <div className="glass-morphism overflow-hidden">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Incident</th>
                                <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Reporter</th>
                                <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Category</th>
                                <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Status</th>
                                <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr><td colSpan="5" className="p-16 text-center text-text-muted">Loading incidents...</td></tr>
                            ) : incidents.length === 0 ? (
                                <tr><td colSpan="5" className="p-16 text-center text-text-muted">No incidents found matching filters.</td></tr>
                            ) : (
                                incidents.map((incident) => (
                                    <tr key={incident._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-white">{incident.title}</span>
                                                <span className="text-xs text-text-muted">{new Date(incident.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User size={14} className="text-text-muted" />
                                                <span>{incident.reporterId?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="badge">{incident.category.replace('_', ' ')}</span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                {getStatusIcon(incident.status)}
                                                <span>{incident.status.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <select
                                                className="bg-surface border border-border text-text py-1.5 px-3 rounded-md text-sm outline-none transition-colors focus:border-primary"
                                                value={incident.status}
                                                onChange={(e) => handleStatusChange(incident._id, e.target.value)}
                                            >
                                                <option value="SUBMITTED">Submitted</option>
                                                <option value="UNDER_REVIEW">Under Review</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="RESOLVED">Resolved</option>
                                                <option value="CLOSED">Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default OfficerDashboard;
