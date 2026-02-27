import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Filter, Search, CheckCircle, Clock, AlertTriangle, User, Trash2, TrendingUp, MapPin, Activity, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OfficerDashboard = () => {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState([]);
    const [threatReports, setThreatReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingThreats, setLoadingThreats] = useState(true);
    const [loadingPredictions, setLoadingPredictions] = useState(true);
    const [activeTab, setActiveTab] = useState('incidents');
    const [filters, setFilters] = useState({
        status: '',
        category: ''
    });
    const [predictiveInsights, setPredictiveInsights] = useState(null);

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

    const fetchThreatReports = async () => {
        try {
            const res = await api.get('/threat-reports');
            setThreatReports(res.data.reports || []);
        } catch (err) {
            console.error('Failed to fetch threat reports', err);
        } finally {
            setLoadingThreats(false);
        }
    };

    const fetchPredictiveInsights = async () => {
        try {
            const res = await api.get('/analytics/predictive/insights');
            setPredictiveInsights(res.data);
        } catch (err) {
            console.error('Failed to fetch predictive insights', err);
        } finally {
            setLoadingPredictions(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'incidents') {
            fetchIncidents();
        }
    }, [filters, activeTab]);

    useEffect(() => {
        if (activeTab === 'threats') {
            fetchThreatReports();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'predictions') {
            fetchPredictiveInsights();
        }
    }, [activeTab]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/incidents/${id}/status`, { status: newStatus });
            fetchIncidents();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDeleteIncident = async (id) => {
        if (!window.confirm('Are you sure you want to delete this incident? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/incidents/${id}`);
            fetchIncidents();
        } catch (err) {
            alert('Failed to delete incident. Only admins can delete incidents.');
        }
    };

    const handleDeleteThreatReport = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this threat report? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/threat-reports/${reportId}`);
            fetchThreatReports();
        } catch (err) {
            alert('Failed to delete threat report. Only admins can delete threat reports.');
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
                    {user && (
                        <div className="mt-2 p-2 bg-blue-500/10 rounded">
                            <small>Logged in as: {user.name} ({user.role})</small>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <div className="flex gap-4 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('incidents')}
                            className={`pb-3 px-1 font-medium transition-colors ${
                                activeTab === 'incidents'
                                    ? 'text-white border-b-2 border-primary'
                                    : 'text-text-muted hover:text-white'
                            }`}
                        >
                            Incidents
                        </button>
                        <button
                            onClick={() => setActiveTab('threats')}
                            className={`pb-3 px-1 font-medium transition-colors ${
                                activeTab === 'threats'
                                    ? 'text-white border-b-2 border-primary'
                                    : 'text-text-muted hover:text-white'
                            }`}
                        >
                            Threat Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('predictions')}
                            className={`pb-3 px-1 font-medium transition-colors ${
                                activeTab === 'predictions'
                                    ? 'text-white border-b-2 border-primary'
                                    : 'text-text-muted hover:text-white'
                            }`}
                        >
                            🧠 Predictions
                        </button>
                    </div>
                </div>

                {activeTab === 'incidents' && (
                    <>
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
                                <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Actions</th>
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
                                            <div className="flex items-center gap-2">
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
                                                {user?.role === 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDeleteIncident(incident._id)}
                                                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                                                        title="Delete incident"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                </>
                    )}

                {activeTab === 'threats' && (
                    <div className="glass-morphism overflow-hidden">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Report ID</th>
                                    <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Threat Type</th>
                                    <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Reporter</th>
                                    <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Urgency</th>
                                    <th className="p-6 text-sm font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {loadingThreats ? (
                                    <tr><td colSpan="6" className="p-16 text-center text-text-muted">Loading threat reports...</td></tr>
                                ) : threatReports.length === 0 ? (
                                    <tr><td colSpan="6" className="p-16 text-center text-text-muted">No threat reports found.</td></tr>
                                ) : (
                                    threatReports.map((report) => (
                                        <tr key={report._id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-6">
                                                <span className="font-mono text-sm text-white">{report.reportId}</span>
                                            </td>
                                            <td className="p-6">
                                                <span className="badge">{report.threatType.replace('_', ' ')}</span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User size={14} className="text-text-muted" />
                                                    <span>{report.reporterInfo.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`text-sm font-medium ${
                                                    report.status === 'PENDING' ? 'text-blue-400' :
                                                    report.status === 'VALIDATED' ? 'text-emerald-400' :
                                                    'text-red-400'
                                                }`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                    report.urgencyLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                                                    report.urgencyLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-300' :
                                                    report.urgencyLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-green-500/20 text-green-300'
                                                }`}>
                                                    {report.urgencyLevel}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                {user?.role === 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDeleteThreatReport(report.reportId)}
                                                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                                                        title="Delete threat report"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'predictions' && (
                    <div className="space-y-8">
                        {loadingPredictions ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : predictiveInsights ? (
                            <>
                                {/* Risk Level Card */}
                                <div className="p-6 glass-morphism">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Shield size={24} className="text-primary" />
                                            Current Risk Assessment
                                        </h3>
                                        <span className={`px-4 py-2 rounded-full font-semibold ${
                                            predictiveInsights.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                                            predictiveInsights.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-300' :
                                            predictiveInsights.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-green-500/20 text-green-300'
                                        }`}>
                                            {predictiveInsights.riskLevel}
                                        </span>
                                    </div>
                                    <p className="text-text-muted">
                                        Based on recent incident patterns and trends
                                    </p>
                                </div>

                                {/* Forecast Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 glass-morphism">
                                        <div className="flex items-center gap-3 mb-4">
                                            <TrendingUp size={20} className="text-blue-500" />
                                            <h4 className="font-semibold">7-Day Forecast</h4>
                                        </div>
                                        <p className="text-2xl font-bold mb-2">
                                            {predictiveInsights.forecast?.next7Days || 0} incidents
                                        </p>
                                        <p className="text-sm text-text-muted">
                                            Trend: {predictiveInsights.forecast?.trend || 'STABLE'}
                                        </p>
                                        <p className="text-xs text-text-muted mt-2">
                                            Confidence: {predictiveInsights.forecast?.confidence || 'LOW'}
                                        </p>
                                    </div>

                                    <div className="p-6 glass-morphism">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Activity size={20} className="text-purple-500" />
                                            <h4 className="font-semibold">Current Activity</h4>
                                        </div>
                                        <p className="text-2xl font-bold mb-2">
                                            {predictiveInsights.currentStats?.totalIncidents || 0}
                                        </p>
                                        <p className="text-sm text-text-muted">
                                            Last 30 days
                                        </p>
                                        <p className="text-xs text-text-muted mt-2">
                                            Daily avg: {predictiveInsights.currentStats?.dailyAverage || 0}
                                        </p>
                                    </div>

                                    <div className="p-6 glass-morphism">
                                        <div className="flex items-center gap-3 mb-4">
                                            <MapPin size={20} className="text-green-500" />
                                            <h4 className="font-semibold">Top Category</h4>
                                        </div>
                                        <p className="text-lg font-bold mb-2 capitalize">
                                            {Object.keys(predictiveInsights.currentStats?.categoryBreakdown || {})[0]?.replace('_', ' ') || 'N/A'}
                                        </p>
                                        <p className="text-sm text-text-muted">
                                            Most frequent incident type
                                        </p>
                                    </div>
                                </div>

                                {/* AI Insights */}
                                {predictiveInsights.aiAnalysis && (
                                    <div className="p-6 glass-morphism border border-primary/20">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                🧠
                                            </div>
                                            AI-Powered Insights
                                        </h3>
                                        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
                                            <div className="space-y-4">
                                                {(() => {
                                                    try {
                                                        const aiData = JSON.parse(predictiveInsights.aiAnalysis);
                                                        return (
                                                            <>
                                                                {aiData.forecast && (
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-blue-300 mb-1">7-Day Forecast</p>
                                                                            <p className="text-sm text-text-muted">{aiData.forecast}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {aiData.highRiskTypes && aiData.highRiskTypes.length > 0 && (
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-orange-300 mb-1">High-Risk Types</p>
                                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                                {aiData.highRiskTypes.map((risk, index) => (
                                                                                    <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                                                                                        {risk.replace('_', ' ')}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {aiData.precautions && (
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-yellow-300 mb-1">Recommended Precautions</p>
                                                                            <p className="text-sm text-text-muted">{aiData.precautions}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {aiData.riskLevel && (
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-red-300 mb-1">Risk Level</p>
                                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                                                aiData.riskLevel === 'LOW' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                                                                aiData.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                                                                aiData.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                                                                                aiData.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                                                                'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                                                            }`}>
                                                                                {aiData.riskLevel}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    } catch (err) {
                                                        // Fallback for non-JSON responses
                                                        return (
                                                            <div className="text-sm text-text-muted whitespace-pre-wrap">
                                                                {predictiveInsights.aiAnalysis}
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span>Powered by OpenAI GPT-3.5</span>
                                        </div>
                                    </div>
                                )}

                                {/* Category Breakdown */}
                                <div className="p-6 glass-morphism">
                                    <h3 className="text-xl font-bold mb-4">Incident Categories (Last 30 Days)</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(predictiveInsights.currentStats?.categoryBreakdown || {}).map(([category, count]) => (
                                            <div key={category} className="flex justify-between items-center p-3 bg-surface/50 rounded">
                                                <span className="capitalize">{category.replace('_', ' ')}</span>
                                                <span className="font-bold">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-text-muted">No predictive data available</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default OfficerDashboard;
