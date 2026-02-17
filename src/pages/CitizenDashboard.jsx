import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Plus, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';

const CitizenDashboard = () => {
    const [threatReports, setThreatReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThreatReports = async () => {
            try {
                const res = await api.get('/threat-reports/mine');
                setThreatReports(res.data);
            } catch (err) {
                console.error('Failed to fetch threat reports', err);
            } finally {
                setLoading(false);
            }
        };
        fetchThreatReports();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'status-orange';
            case 'VALIDATED': return 'status-purple';
            case 'REJECTED': return 'status-red';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen pb-16">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 mt-12 animate-fade-in">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Threat Reports</h1>
                        <p className="text-text-muted">Track the status of your reported wildlife threats.</p>
                    </div>
                    <Link to="/threat-report" className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        New Threat Report
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 text-center glass-morphism">
                        <span className="block text-text-muted text-sm mb-2">Total Reports</span>
                        <span className="text-3xl font-extrabold text-primary">{threatReports.length}</span>
                    </div>
                    <div className="p-6 text-center glass-morphism">
                        <span className="block text-text-muted text-sm mb-2">Resolved</span>
                        <span className="text-3xl font-extrabold text-primary">
                            {threatReports.filter(i => i.status === 'VALIDATED').length}
                        </span>
                    </div>
                    <div className="p-6 text-center glass-morphism">
                        <span className="block text-text-muted text-sm mb-2">Pending</span>
                        <span className="text-3xl font-extrabold text-primary">
                            {threatReports.filter(i => ['PENDING'].includes(i.status)).length}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading your reports...</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {threatReports.length === 0 ? (
                            <div className="py-16 px-8 text-center flex flex-col items-center gap-4 glass-morphism">
                                <AlertCircle size={48} className="text-text-muted" />
                                <h3 className="text-2xl font-bold">No reports found</h3>
                                <p className="text-text-muted max-w-md">You haven't reported any wildlife threats yet. Help us protect wildlife by reporting threats you encounter.</p>
                                <Link to="/threat-report" className="btn-primary mt-4">Report a Threat</Link>
                            </div>
                        ) : (
                            threatReports.map((report) => (
                                <div key={report._id} className="p-6 px-10 glass-morphism transition-all hover:translate-x-2 hover:bg-surface/90 cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-4 mb-1">
                                                <span className={`status-badge ${getStatusColor(report.status)}`}>
                                                    {report.status}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                                                    <Clock size={14} />
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold">{report.threatType.replace('_', ' ')}</h3>
                                            <p className="text-sm font-semibold text-primary">{report.urgencyLevel}</p>
                                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                                <MapPin size={14} />
                                                <span>Lat: {report.location.lat.toFixed(4)}, Lng: {report.location.lng.toFixed(4)}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-text-muted" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CitizenDashboard;
