import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import {
    Users, Plus, Trash2, Edit2, X, Check, AlertCircle,
    Loader2, UserCheck, Shield, ChevronDown
} from 'lucide-react';

const DEPARTMENTS = ['PATROL', 'INVESTIGATION', 'ADMINISTRATION', 'WILDLIFE_RESCUE', 'ANALYTICS'];
const PERMISSIONS = ['VIEW_INCIDENTS', 'MANAGE_INCIDENTS', 'VIEW_CASES', 'MANAGE_CASES', 'VIEW_RESOURCES', 'MANAGE_RESOURCES', 'VIEW_ANALYTICS', 'MANAGE_ALERTS'];

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const [form, setForm] = useState({
        userId: '',
        department: DEPARTMENTS[0],
        permissions: []
    });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchStaff = async () => {
        try {
            const res = await api.get('/staff');
            setStaff(res.data);
        } catch {
            showToast('Failed to load staff', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            // Get available users (not already staff) - best effort
            const res = await api.get('/staff');
            // We'll populate from staff's userId
            setUsers([]);
        } catch {
            // silent
        }
    };

    useEffect(() => {
        fetchStaff();
        fetchUsers();
    }, []);

    const openCreate = () => {
        setEditTarget(null);
        setForm({ userId: '', department: DEPARTMENTS[0], permissions: [] });
        setShowModal(true);
    };

    const openEdit = (s) => {
        setEditTarget(s);
        setForm({
            userId: s.userId?._id || s.userId,
            department: s.department,
            permissions: s.permissions || []
        });
        setShowModal(true);
    };

    const togglePermission = (p) => {
        setForm(f => ({
            ...f,
            permissions: f.permissions.includes(p)
                ? f.permissions.filter(x => x !== p)
                : [...f.permissions, p]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editTarget) {
                await api.put(`/staff/${editTarget._id}`, {
                    department: form.department,
                    permissions: form.permissions
                });
                showToast('Staff updated successfully');
            } else {
                await api.post('/staff', form);
                showToast('Staff member added and promoted to OFFICER');
            }
            setShowModal(false);
            fetchStaff();
        } catch (err) {
            showToast(err?.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/staff/${id}`);
            showToast('Staff member removed');
            setConfirmDelete(null);
            fetchStaff();
        } catch (err) {
            showToast(err?.response?.data?.message || 'Delete failed', 'error');
        }
    };

    const getDeptColor = (dept) => {
        const map = {
            PATROL: 'bg-blue-500/20 text-blue-400',
            INVESTIGATION: 'bg-purple-500/20 text-purple-400',
            ADMINISTRATION: 'bg-amber-500/20 text-amber-400',
            WILDLIFE_RESCUE: 'bg-emerald-500/20 text-emerald-400',
            ANALYTICS: 'bg-cyan-500/20 text-cyan-400',
        };
        return map[dept] || 'bg-surface-light text-text-muted';
    };

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

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-morphism p-8 max-w-sm w-full mx-4 animate-fade-in">
                        <h3 className="text-xl font-bold mb-2">Remove Staff Member?</h3>
                        <p className="text-text-muted text-sm mb-6">
                            This will remove the staff record. The user account will remain, but their OFFICER role may need to be updated manually.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="flex-1 bg-danger hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold transition-colors"
                            >
                                Remove
                            </button>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 bg-surface-light hover:bg-border text-text py-2.5 rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-morphism p-8 max-w-lg w-full mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">
                                {editTarget ? 'Edit Staff Member' : 'Add New Staff Member'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!editTarget && (
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1.5">User ID</label>
                                    <input
                                        className="input-field"
                                        placeholder="Paste user's MongoDB ObjectId"
                                        value={form.userId}
                                        onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                                        required
                                    />
                                    <p className="text-xs text-text-muted mt-1">The user will be automatically promoted to OFFICER role.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Department</label>
                                <div className="relative">
                                    <select
                                        className="input-field appearance-none pr-10"
                                        value={form.department}
                                        onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                                    >
                                        {DEPARTMENTS.map(d => (
                                            <option key={d} value={d}>{d.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Permissions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PERMISSIONS.map(p => (
                                        <label key={p} className="flex items-center gap-2 cursor-pointer group">
                                            <div
                                                onClick={() => togglePermission(p)}
                                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer
                                                    ${form.permissions.includes(p)
                                                        ? 'bg-primary border-primary'
                                                        : 'border-border group-hover:border-primary/50'}`}
                                            >
                                                {form.permissions.includes(p) && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className="text-xs text-text-muted group-hover:text-text transition-colors">{p.replace(/_/g, ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                {editTarget ? <><Edit2 size={16} /> Update Staff</> : <><Plus size={16} /> Add Staff Member</>}
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
                            <Users className="text-primary" size={36} />
                            Staff Management
                        </h1>
                        <p className="text-text-muted">Manage conservation officers and staff members across departments.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="btn-primary flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
                    >
                        <Plus size={18} />
                        Add Staff Member
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {DEPARTMENTS.map(dept => {
                        const count = staff.filter(s => s.department === dept).length;
                        return (
                            <div key={dept} className={`glass-morphism p-4 flex flex-col gap-1`}>
                                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${getDeptColor(dept)}`}>
                                    {dept.replace('_', ' ')}
                                </span>
                                <span className="text-2xl font-bold mt-1">{count}</span>
                                <span className="text-xs text-text-muted">Members</span>
                            </div>
                        );
                    })}
                </div>

                {/* Staff Table */}
                <div className="glass-morphism overflow-hidden">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-5 text-sm font-semibold text-text-muted uppercase tracking-wider">Staff Member</th>
                                <th className="p-5 text-sm font-semibold text-text-muted uppercase tracking-wider">Email</th>
                                <th className="p-5 text-sm font-semibold text-text-muted uppercase tracking-wider">Department</th>
                                <th className="p-5 text-sm font-semibold text-text-muted uppercase tracking-wider">Permissions</th>
                                <th className="p-5 text-sm font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center">
                                        <Loader2 className="animate-spin mx-auto text-primary mb-3" size={28} />
                                        <span className="text-text-muted">Loading staff...</span>
                                    </td>
                                </tr>
                            ) : staff.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center">
                                        <UserCheck className="mx-auto text-text-muted mb-3 opacity-40" size={40} />
                                        <p className="text-text-muted">No staff members yet. Add your first one!</p>
                                    </td>
                                </tr>
                            ) : (
                                staff.map(s => (
                                    <tr key={s._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                    {(s.userId?.name || 'S')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{s.userId?.name || 'N/A'}</p>
                                                    <p className="text-xs text-text-muted">{s._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-text-muted text-sm">{s.userId?.email || '—'}</td>
                                        <td className="p-5">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDeptColor(s.department)}`}>
                                                {s.department?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {(s.permissions || []).slice(0, 3).map(p => (
                                                    <span key={p} className="text-xs bg-surface-light text-text-muted px-2 py-0.5 rounded">
                                                        {p.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                                {(s.permissions || []).length > 3 && (
                                                    <span className="text-xs bg-surface-light text-primary px-2 py-0.5 rounded">
                                                        +{s.permissions.length - 3} more
                                                    </span>
                                                )}
                                                {(!s.permissions || s.permissions.length === 0) && (
                                                    <span className="text-xs text-text-muted italic">None assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(s)}
                                                    className="p-2 rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(s._id)}
                                                    className="p-2 rounded-lg text-text-muted hover:bg-danger/10 hover:text-danger transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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

export default StaffManagement;
