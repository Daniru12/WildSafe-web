import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import {
    Package, Plus, X, Check, AlertCircle, Loader2,
    Archive, UserCog, Edit2, ChevronDown, Filter, RefreshCw
} from 'lucide-react';

const RESOURCE_TYPES = ['VEHICLE', 'EQUIPMENT', 'COMMUNICATION_DEVICE', 'MEDICAL_KIT', 'WEAPON', 'DRONE', 'OTHER'];
const STATUS_OPTIONS = ['AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'ARCHIVED'];

const statusStyle = {
    AVAILABLE: 'bg-emerald-500/20 text-emerald-400',
    ASSIGNED: 'bg-blue-500/20 text-blue-400',
    MAINTENANCE: 'bg-amber-500/20 text-amber-400',
    ARCHIVED: 'bg-surface-light text-text-muted',
};

const ResourceManagement = () => {
    const [resources, setResources] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(null);
    const [assignStaffId, setAssignStaffId] = useState('');
    const [toast, setToast] = useState(null);
    const [confirmArchive, setConfirmArchive] = useState(null);

    const [form, setForm] = useState({
        type: RESOURCE_TYPES[0],
        description: '',
        metadata: ''
    });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = statusFilter ? `?status=${statusFilter}` : '';
            const res = await api.get(`/resources${params}`);
            setResources(res.data);
        } catch {
            showToast('Failed to load resources', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const res = await api.get('/staff');
            setStaff(res.data);
        } catch {
            // silent
        }
    };

    useEffect(() => {
        fetchResources();
        fetchStaff();
    }, [statusFilter]);

    const openCreate = () => {
        setEditTarget(null);
        setForm({ type: RESOURCE_TYPES[0], description: '', metadata: '' });
        setShowModal(true);
    };

    const openEdit = (r) => {
        setEditTarget(r);
        setForm({
            type: r.type,
            description: r.description || '',
            metadata: r.metadata ? JSON.stringify(r.metadata, null, 2) : ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let metadata;
        try {
            metadata = form.metadata ? JSON.parse(form.metadata) : {};
        } catch {
            showToast('Metadata must be valid JSON', 'error');
            return;
        }

        try {
            if (editTarget) {
                await api.put(`/resources/${editTarget._id}`, { type: form.type, description: form.description, metadata });
                showToast('Resource updated');
            } else {
                await api.post('/resources', { type: form.type, description: form.description, metadata });
                showToast('Resource created successfully');
            }
            setShowModal(false);
            fetchResources();
        } catch (err) {
            showToast(err?.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleAssign = async () => {
        if (!assignStaffId) return;
        try {
            await api.put(`/resources/${showAssignModal}/assign`, { staffId: assignStaffId });
            showToast('Resource assigned to staff member');
            setShowAssignModal(null);
            setAssignStaffId('');
            fetchResources();
        } catch (err) {
            showToast(err?.response?.data?.message || 'Assignment failed', 'error');
        }
    };

    const handleArchive = async (id) => {
        try {
            await api.delete(`/resources/${id}`);
            showToast('Resource archived');
            setConfirmArchive(null);
            fetchResources();
        } catch (err) {
            showToast(err?.response?.data?.message || 'Archive failed', 'error');
        }
    };

    const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
        acc[s] = resources.filter(r => r.status === s).length;
        return acc;
    }, {});

    return (
        <div className="min-h-screen pb-16">
            <Navbar />

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white animate-fade-in
                    ${toast.type === 'error' ? 'bg-danger/90' : 'bg-primary/90'}`}>
                    {toast.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                    <span className="font-medium text-sm">{toast.msg}</span>
                </div>
            )}

            {/* Confirm Archive Modal */}
            {confirmArchive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-morphism p-8 max-w-sm w-full mx-4 animate-fade-in">
                        <Archive className="text-amber-400 mb-3" size={28} />
                        <h3 className="text-xl font-bold mb-2">Archive Resource?</h3>
                        <p className="text-text-muted text-sm mb-6">
                            This resource will be marked as ARCHIVED. It can be restored later by updating the status.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleArchive(confirmArchive)}
                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-semibold transition-colors"
                            >
                                Archive
                            </button>
                            <button
                                onClick={() => setConfirmArchive(null)}
                                className="flex-1 bg-surface-light hover:bg-border text-text py-2.5 rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-morphism p-8 max-w-md w-full mx-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <UserCog className="text-primary" size={20} />
                                Assign Resource
                            </h3>
                            <button onClick={() => setShowAssignModal(null)} className="text-text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {staff.length === 0 ? (
                            <p className="text-text-muted text-sm text-center py-4">No staff members available. Add staff first.</p>
                        ) : (
                            <>
                                <div className="relative mb-5">
                                    <select
                                        className="input-field appearance-none pr-10"
                                        value={assignStaffId}
                                        onChange={e => setAssignStaffId(e.target.value)}
                                    >
                                        <option value="">— Select Staff Member —</option>
                                        {staff.map(s => (
                                            <option key={s._id} value={s._id}>
                                                {s.userId?.name || 'Unknown'} ({s.department?.replace('_', ' ')})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                </div>
                                <button
                                    disabled={!assignStaffId}
                                    onClick={handleAssign}
                                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <UserCog size={16} /> Assign
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-morphism p-8 max-w-lg w-full mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">
                                {editTarget ? 'Update Resource' : 'Add New Resource'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Resource Type</label>
                                <div className="relative">
                                    <select
                                        className="input-field appearance-none pr-10"
                                        value={form.type}
                                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                    >
                                        {RESOURCE_TYPES.map(t => (
                                            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Description</label>
                                <textarea
                                    className="input-field resize-none"
                                    rows={3}
                                    placeholder="Brief description of this resource..."
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">
                                    Metadata <span className="text-xs opacity-60">(optional JSON)</span>
                                </label>
                                <textarea
                                    className="input-field resize-none font-mono text-sm"
                                    rows={4}
                                    placeholder={'{\n  "serialNumber": "ABC-001",\n  "location": "Zone A"\n}'}
                                    value={form.metadata}
                                    onChange={e => setForm(f => ({ ...f, metadata: e.target.value }))}
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                {editTarget ? <><Edit2 size={16} /> Update Resource</> : <><Plus size={16} /> Create Resource</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <main className="max-w-6xl mx-auto px-6 mt-12 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-1 flex items-center gap-3">
                            <Package className="text-primary" size={36} />
                            Resource Management
                        </h1>
                        <p className="text-text-muted">Track vehicles, equipment, and field resources across all operations.</p>
                    </div>
                    <button onClick={openCreate} className="btn-primary flex items-center gap-2 self-start sm:self-auto whitespace-nowrap">
                        <Plus size={18} /> Add Resource
                    </button>
                </div>

                {/* Status Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {STATUS_OPTIONS.map(s => (
                        <div
                            key={s}
                            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
                            className={`glass-morphism p-4 cursor-pointer transition-all hover:scale-105 border-2
                                ${statusFilter === s ? 'border-primary/60' : 'border-transparent'}`}
                        >
                            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${statusStyle[s]}`}>
                                {s}
                            </span>
                            <p className="text-2xl font-bold mt-2">{statusCounts[s] ?? 0}</p>
                            <p className="text-xs text-text-muted">Resources</p>
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="glass-morphism p-4 mb-6 flex items-center gap-4">
                    <Filter size={16} className="text-text-muted flex-shrink-0" />
                    <div className="relative">
                        <select
                            className="bg-surface-light border border-border text-text py-1.5 px-3 pr-8 rounded-lg text-sm outline-none focus:border-primary appearance-none"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                    {statusFilter && (
                        <button
                            onClick={() => setStatusFilter('')}
                            className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors"
                        >
                            <X size={14} /> Clear filter
                        </button>
                    )}
                    <button
                        onClick={fetchResources}
                        className="ml-auto flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* Resources Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="animate-spin mx-auto text-primary mb-3" size={32} />
                            <p className="text-text-muted">Loading resources...</p>
                        </div>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="glass-morphism p-16 text-center">
                        <Package className="mx-auto text-text-muted mb-4 opacity-40" size={48} />
                        <p className="text-text-muted text-lg">No resources found{statusFilter ? ` with status "${statusFilter}"` : ''}.</p>
                        {!statusFilter && (
                            <button onClick={openCreate} className="btn-primary mt-4 inline-flex items-center gap-2">
                                <Plus size={16} /> Add your first resource
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {resources.map(r => (
                            <div key={r._id} className="glass-morphism p-5 flex flex-col gap-4 hover:border-primary/30 border border-transparent transition-all">
                                {/* Top row */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Package className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{r.type?.replace(/_/g, ' ')}</p>
                                            <p className="text-xs text-text-muted truncate max-w-[140px]">{r._id}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status] || 'bg-surface-light text-text-muted'}`}>
                                        {r.status}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-text-muted line-clamp-2">{r.description || 'No description provided.'}</p>

                                {/* Assigned To */}
                                {r.assignedTo && (
                                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                                        <UserCog size={14} className="text-blue-400 flex-shrink-0" />
                                        <span className="text-xs text-blue-300 truncate">
                                            Assigned to: <span className="font-semibold">{r.assignedTo?.userId?.name || r.assignedTo?.department || 'Staff'}</span>
                                        </span>
                                    </div>
                                )}

                                {/* Metadata preview */}
                                {r.metadata && Object.keys(r.metadata).length > 0 && (
                                    <div className="bg-surface-light/60 rounded-lg p-2.5 text-xs font-mono text-text-muted overflow-hidden">
                                        {Object.entries(r.metadata).slice(0, 2).map(([k, v]) => (
                                            <div key={k}><span className="text-primary">{k}</span>: {String(v)}</div>
                                        ))}
                                        {Object.keys(r.metadata).length > 2 && (
                                            <div className="text-text-muted/60">+{Object.keys(r.metadata).length - 2} more fields</div>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-1 border-t border-white/5 mt-auto">
                                    <button
                                        onClick={() => openEdit(r)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    {r.status !== 'ARCHIVED' && (
                                        <button
                                            onClick={() => { setShowAssignModal(r._id); setAssignStaffId(''); }}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-text-muted hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                                        >
                                            <UserCog size={14} /> Assign
                                        </button>
                                    )}
                                    {r.status !== 'ARCHIVED' && (
                                        <button
                                            onClick={() => setConfirmArchive(r._id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-text-muted hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                                        >
                                            <Archive size={14} /> Archive
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResourceManagement;
