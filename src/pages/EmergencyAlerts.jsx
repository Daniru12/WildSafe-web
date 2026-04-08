import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Send, Users, Clock, CheckCircle2, XCircle } from 'lucide-react';

const ROLE_OPTIONS = ['CITIZEN', 'OFFICER', 'ADMIN'];

const EmergencyAlerts = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetRoles: ['OFFICER', 'ADMIN'],
        lat: '',
        lng: '',
        expiresAt: ''
    });
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState(null);
    const [error, setError] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loadingAlerts, setLoadingAlerts] = useState(true);

    const fetchAlerts = async () => {
        try {
            setLoadingAlerts(true);
            const res = await api.get('/alerts?limit=20&page=1');
            setAlerts(res.data.alerts || []);
        } catch (err) {
            console.error('Failed to fetch alerts', err);
        } finally {
            setLoadingAlerts(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/alerts/stats');
            setStats(res.data || null);
        } catch (err) {
            console.error('Failed to fetch alert stats', err);
        }
    };

    useEffect(() => {
        fetchAlerts();
        fetchStats();
    }, []);

    const toggleTargetRole = (role) => {
        const hasRole = formData.targetRoles.includes(role);
        if (hasRole) {
            setFormData({
                ...formData,
                targetRoles: formData.targetRoles.filter((r) => r !== role)
            });
        } else {
            setFormData({
                ...formData,
                targetRoles: [...formData.targetRoles, role]
            });
        }
    };

    const handleSendEmergency = async (e) => {
        e.preventDefault();
        setError('');
        setSendResult(null);

        if (!formData.title.trim() || !formData.message.trim()) {
            setError('Title and message are required.');
            return;
        }

        if (!formData.targetRoles.length) {
            setError('Select at least one target role.');
            return;
        }

        const payload = {
            title: formData.title.trim(),
            message: formData.message.trim(),
            targetRoles: formData.targetRoles,
        };

        const latNum = Number(formData.lat);
        const lngNum = Number(formData.lng);
        if (formData.lat !== '' || formData.lng !== '') {
            if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
                setError('Latitude and longitude must be valid numbers.');
                return;
            }

            payload.location = {
                type: 'Point',
                coordinates: [lngNum, latNum]
            };
        }

        if (formData.expiresAt) {
            payload.expiresAt = new Date(formData.expiresAt).toISOString();
        }

        try {
            setSending(true);
            const res = await api.post('/alerts/emergency', payload);
            setSendResult(res.data);
            setFormData({
                title: '',
                message: '',
                targetRoles: ['OFFICER', 'ADMIN'],
                lat: '',
                lng: '',
                expiresAt: ''
            });
            fetchAlerts();
            fetchStats();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send emergency alert.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen pb-16">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 mt-12 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <AlertTriangle className="text-red-400" size={32} />
                        Emergency Alerts
                    </h1>
                    <p className="text-text-muted">Create and send emergency alerts to officers, admins, and nearby citizens.</p>
                    {user && <p className="text-xs text-text-muted mt-2">Logged in as {user.name} ({user.role})</p>}
                </div>

                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 glass-morphism">
                            <p className="text-sm text-text-muted">Total Alerts</p>
                            <p className="text-2xl font-bold">{stats.totalAlerts || 0}</p>
                        </div>
                        <div className="p-6 glass-morphism">
                            <p className="text-sm text-text-muted">Active Alerts</p>
                            <p className="text-2xl font-bold text-amber-300">{stats.activeAlerts || 0}</p>
                        </div>
                        <div className="p-6 glass-morphism">
                            <p className="text-sm text-text-muted">Urgent Alerts</p>
                            <p className="text-2xl font-bold text-red-300">{stats.urgentAlerts || 0}</p>
                        </div>
                    </div>
                )}

                <section className="glass-morphism p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Send Emergency Alert</h2>
                    <form onSubmit={handleSendEmergency} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-sm text-text-muted">Title</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Forest fire near northern boundary"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm text-text-muted">Message</label>
                            <textarea
                                rows="4"
                                className="input-field"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe the emergency and immediate guidance"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm text-text-muted mb-2 block">Target Roles</label>
                            <div className="flex gap-3 flex-wrap">
                                {ROLE_OPTIONS.map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => toggleTargetRole(role)}
                                        className={`px-3 py-1.5 rounded-lg border transition-colors ${
                                            formData.targetRoles.includes(role)
                                                ? 'bg-primary/20 text-primary border-primary/40'
                                                : 'border-border text-text-muted hover:bg-surface-light'
                                        }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-text-muted">Latitude (optional)</label>
                            <input
                                type="number"
                                step="any"
                                className="input-field"
                                value={formData.lat}
                                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                placeholder="7.8731"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-text-muted">Longitude (optional)</label>
                            <input
                                type="number"
                                step="any"
                                className="input-field"
                                value={formData.lng}
                                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                placeholder="80.7718"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-text-muted">Expires At (optional)</label>
                            <input
                                type="datetime-local"
                                className="input-field"
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            {error && <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">{error}</div>}
                            <button type="submit" className="btn-primary flex items-center gap-2" disabled={sending}>
                                <Send size={16} />
                                {sending ? 'Sending...' : 'Send Emergency Alert'}
                            </button>
                        </div>
                    </form>
                </section>

                {sendResult && (
                    <section className="glass-morphism p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Delivery Summary</h2>
                        <p className="text-sm text-text-muted mb-3">{sendResult.message}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-surface rounded-lg">
                                <div className="flex items-center gap-2 text-text-muted mb-1"><Users size={14} /> Recipients</div>
                                <div className="text-xl font-semibold">{sendResult.recipientsCount || 0}</div>
                            </div>
                            <div className="p-4 bg-surface rounded-lg">
                                <div className="flex items-center gap-2 text-emerald-300 mb-1"><CheckCircle2 size={14} /> WhatsApp Sent</div>
                                <div className="text-xl font-semibold">{sendResult.whatsappDelivery?.sent || 0}</div>
                            </div>
                            <div className="p-4 bg-surface rounded-lg">
                                <div className="flex items-center gap-2 text-red-300 mb-1"><XCircle size={14} /> WhatsApp Failed</div>
                                <div className="text-xl font-semibold">{sendResult.whatsappDelivery?.failed || 0}</div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="glass-morphism p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
                    {loadingAlerts ? (
                        <p className="text-text-muted">Loading alerts...</p>
                    ) : alerts.length === 0 ? (
                        <p className="text-text-muted">No alerts yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div key={alert._id || alert.id} className="p-4 bg-surface rounded-lg border border-border">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="font-semibold">{alert.title}</h3>
                                        <span className="badge">{alert.priority || 'MEDIUM'}</span>
                                    </div>
                                    <p className="text-sm text-text-muted mt-2">{alert.message}</p>
                                    <div className="text-xs text-text-muted mt-3 flex items-center gap-2">
                                        <Clock size={12} />
                                        {new Date(alert.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default EmergencyAlerts;