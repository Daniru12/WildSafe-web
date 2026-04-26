import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import {
    ArrowLeft,
    MapPin,
    Clock,
    User,
    AlertTriangle,
    CheckCircle,
    XCircle,
    FileText,
    Camera,
    Video,
    Calendar,
    Shield,
    Phone,
    Mail,
    Info
} from 'lucide-react';

const ReportDetail = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isThreatReport = type === 'threat';

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                const endpoint = isThreatReport
                    ? `/threat-reports/${id}`
                    : `/incidents/${id}`;
                const res = await api.get(endpoint);
                setReport(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch report details');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [type, id, isThreatReport]);

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'status-orange',
            'SUBMITTED': 'status-orange',
            'UNDER_REVIEW': 'status-orange',
            'IN_PROGRESS': 'status-purple',
            'VALIDATED': 'status-purple',
            'RESOLVED': 'status-purple',
            'REJECTED': 'status-red',
            'CLOSED': 'status-red'
        };
        return colors[status] || '';
    };

    const getUrgencyColor = (level) => {
        const colors = {
            'LOW': 'bg-gray-100 text-gray-800',
            'MEDIUM': 'bg-blue-100 text-blue-800',
            'HIGH': 'bg-orange-100 text-orange-800',
            'CRITICAL': 'bg-red-100 text-red-800',
            'URGENT': 'bg-red-100 text-red-800'
        };
        return colors[level] || 'bg-gray-100 text-gray-800';
    };

    const formatEnum = (val) => {
        if (!val) return 'N/A';
        return val.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'VALIDATED':
            case 'RESOLVED':
            case 'CLOSED':
                return <CheckCircle size={18} className="text-green-500" />;
            case 'REJECTED':
                return <XCircle size={18} className="text-red-500" />;
            default:
                return <Clock size={18} className="text-orange-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pb-16">
                <Navbar />
                <main className="max-w-5xl mx-auto px-6 mt-28">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pb-16">
                <Navbar />
                <main className="max-w-5xl mx-auto px-6 mt-28 animate-fade-in">
                    <div className="bg-red-500/10 border border-danger text-danger p-6 rounded-lg">
                        {error}
                    </div>
                </main>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen pb-16">
                <Navbar />
                <main className="max-w-5xl mx-auto px-6 mt-28 animate-fade-in">
                    <div className="text-center text-text-muted">Report not found</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-16">
            <Navbar />
            <main className="max-w-5xl mx-auto px-6 mt-28 animate-fade-in">
                {/* Back button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to My Reports
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`status-badge ${getStatusColor(report.status)}`}>
                                {report.status}
                            </span>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {isThreatReport ? 'Threat Report' : 'Incident'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold">
                            {report.title || (isThreatReport ? formatEnum(report.threatType) : formatEnum(report.category))}
                        </h1>
                        {isThreatReport && report.reportId && (
                            <p className="text-text-muted text-sm mt-1">ID: {report.reportId}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {(report.urgencyLevel || report.priority) && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(report.urgencyLevel || report.priority)}`}>
                                {formatEnum(report.urgencyLevel || report.priority)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <section className="p-6 glass-morphism">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText size={20} />
                                Description
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                {report.description || 'No description provided.'}
                            </p>
                        </section>

                        {/* Location */}
                        <section className="p-6 glass-morphism">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin size={20} />
                                Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {report.location?.address && (
                                    <div>
                                        <label className="text-sm font-medium text-text-muted">Address</label>
                                        <p className="mt-1">{report.location.address}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-text-muted">Coordinates</label>
                                    <p className="mt-1 font-mono text-sm">
                                        {report.location?.lat?.toFixed(6)}, {report.location?.lng?.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Media / Photos */}
                        <section className="p-6 glass-morphism">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Camera size={20} />
                                {isThreatReport ? 'Media' : 'Photos'}
                            </h3>
                            {isThreatReport ? (
                                report.media && report.media.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {report.media.map((item, index) => (
                                            <div key={index} className="border border-border rounded-lg overflow-hidden">
                                                {item.mediaType === 'IMAGE' ? (
                                                    <img
                                                        src={item.url}
                                                        alt={`Media ${index + 1}`}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-surface-light flex items-center justify-center">
                                                        <Video size={32} className="text-text-muted" />
                                                    </div>
                                                )}
                                                <div className="p-3 flex items-center justify-between">
                                                    <span className="text-sm font-medium flex items-center gap-1">
                                                        {item.mediaType === 'IMAGE' ? <Camera size={14} /> : <Video size={14} />}
                                                        {item.mediaType}
                                                    </span>
                                                    <span className="text-xs text-text-muted">
                                                        {new Date(item.uploadedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-muted text-center py-4">No media attached.</p>
                                )
                            ) : (
                                report.photos && report.photos.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {report.photos.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`Photo ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-lg border border-border"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-muted text-center py-4">No photos attached.</p>
                                )
                            )}
                        </section>

                        {/* Status History (Incidents) */}
                        {!isThreatReport && report.statusHistory && report.statusHistory.length > 0 && (
                            <section className="p-6 glass-morphism">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Clock size={20} />
                                    Status History
                                </h3>
                                <div className="space-y-4">
                                    {report.statusHistory.map((entry, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                                                ['RESOLVED', 'CLOSED'].includes(entry.status) ? 'bg-green-500' :
                                                ['REJECTED'].includes(entry.status) ? 'bg-red-500' : 'bg-primary'
                                            }`}></div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium">{formatEnum(entry.status)}</span>
                                                    <span className="text-sm text-text-muted">
                                                        {new Date(entry.changedAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                {entry.notes && (
                                                    <p className="text-sm text-text-muted">{entry.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Validation Notes (Threat Reports) */}
                        {isThreatReport && report.validationNotes && (
                            <section className="p-6 glass-morphism">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Info size={20} />
                                    Validation Notes
                                </h3>
                                <p className="text-text-secondary">{report.validationNotes}</p>
                            </section>
                        )}

                        {/* Additional Notes (Incidents) */}
                        {!isThreatReport && report.additionalNotes && (
                            <section className="p-6 glass-morphism">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Info size={20} />
                                    Additional Notes
                                </h3>
                                <p className="text-text-secondary">{report.additionalNotes}</p>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <section className="p-6 glass-morphism">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Shield size={20} />
                                Status
                            </h3>
                            <div className="flex items-center gap-3 mb-4">
                                {getStatusIcon(report.status)}
                                <span className="text-xl font-bold">{formatEnum(report.status)}</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <Calendar size={14} />
                                    <span>Created: {new Date(report.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-muted">
                                    <Clock size={14} />
                                    <span>Updated: {new Date(report.updatedAt).toLocaleString()}</span>
                                </div>
                                {isThreatReport && report.dateTime && (
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <Calendar size={14} />
                                        <span>Incident Date: {new Date(report.dateTime).toLocaleString()}</span>
                                    </div>
                                )}
                                {!isThreatReport && report.estimatedTime && (
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <Calendar size={14} />
                                        <span>Estimated Time: {new Date(report.estimatedTime).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Reporter Information */}
                        <section className="p-6 glass-morphism">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User size={20} />
                                Reporter Information
                            </h3>
                            <div className="space-y-3">
                                {isThreatReport ? (
                                    <>
                                        <div>
                                            <label className="text-sm font-medium text-text-muted">Name</label>
                                            <p className="mt-1">
                                                {report.reporterInfo?.isAnonymous ? 'Anonymous' : report.reporterInfo?.name || 'N/A'}
                                            </p>
                                        </div>
                                        {!report.reporterInfo?.isAnonymous && report.reporterInfo?.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-text-muted" />
                                                <span>{report.reporterInfo.email}</span>
                                            </div>
                                        )}
                                        {!report.reporterInfo?.isAnonymous && report.reporterInfo?.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-text-muted" />
                                                <span>{report.reporterInfo.phone}</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {report.contactInfo?.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-text-muted" />
                                                <span>{report.contactInfo.email}</span>
                                            </div>
                                        )}
                                        {report.contactInfo?.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-text-muted" />
                                                <span>{report.contactInfo.phone}</span>
                                            </div>
                                        )}
                                        {!report.contactInfo?.email && !report.contactInfo?.phone && (
                                            <p className="text-text-muted">No contact info provided</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Classification */}
                        <section className="p-6 glass-morphism">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <AlertTriangle size={20} />
                                Classification
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-text-muted">
                                        {isThreatReport ? 'Threat Type' : 'Category'}
                                    </label>
                                    <p className="mt-1">
                                        {isThreatReport ? formatEnum(report.threatType) : formatEnum(report.category)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-text-muted">
                                        {isThreatReport ? 'Urgency Level' : 'Priority'}
                                    </label>
                                    <p className="mt-1">
                                        <span className={`px-2 py-1 rounded text-sm ${getUrgencyColor(report.urgencyLevel || report.priority)}`}>
                                            {formatEnum(report.urgencyLevel || report.priority)}
                                        </span>
                                    </p>
                                </div>
                                {!isThreatReport && report.forwardedTo && (
                                    <div>
                                        <label className="text-sm font-medium text-text-muted">Forwarded To</label>
                                        <p className="mt-1">{report.forwardedTo}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportDetail;
