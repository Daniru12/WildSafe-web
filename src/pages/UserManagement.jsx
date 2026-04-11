import React, { useEffect, useState } from 'react';

import api from '../utils/api';
import {
    Users, Search, Filter, Mail, Shield, Calendar,
    Loader2, AlertCircle, Check, MoreVertical, User, Trash2
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/auth/users');
            setUsers(res.data);
            setError(null);
        } catch {
            setError('Failed to load users. Please try again.');
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/auth/users/${userId}/role`, { role: newRole });
            showToast(`User role updated to ${newRole}`);
            fetchUsers();
        } catch {
            showToast('Failed to update user role', 'error');
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === '' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'OFFICER': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-green-50 text-primary border-green-100';
        }
    };

    return (
        <div className="min-h-screen bg-surface pb-16">
            

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white animate-fade-in font-bold
                    ${toast.type === 'error' ? 'bg-red-500' : 'bg-primary'}`}>
                    {toast.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                    <span className="text-sm">{toast.msg}</span>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 mt-24 animate-fade-in">
                <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
                            <Users size={14} />
                            Administrative Tools
                        </div>
                        <h1 className="text-5xl font-black text-text tracking-tighter mb-2">User <span className="text-primary">Directory</span></h1>
                        <p className="text-text-muted text-lg max-w-2xl font-medium">Manage registration database, adjust security levels, and audit system participation.</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="md:col-span-3 flex items-center gap-4 bg-white rounded-3xl border border-border p-3 shadow-premium focus-within:border-primary/50 transition-all">
                        <Search className="text-primary ml-2" size={24} />
                        <input
                            type="text"
                            placeholder="Find participants by name or verified email..."
                            className="w-full bg-transparent outline-none text-lg font-medium text-text placeholder:text-text-muted"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-white rounded-3xl border border-border p-3 shadow-premium">
                         <select
                            className="w-full h-full bg-transparent outline-none font-bold text-text cursor-pointer px-4"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Security Roles</option>
                            <option value="CITIZEN">Citizen (Standard)</option>
                            <option value="OFFICER">Officer (Operational)</option>
                            <option value="ADMIN">Administrator (Command)</option>
                        </select>
                    </div>
                </div>

                {/* Users List Container */}
                <div className="bg-white rounded-[40px] border border-border shadow-premium overflow-hidden">
                    {loading ? (
                        <div className="py-40 text-center">
                            <Loader2 className="animate-spin mx-auto text-primary mb-6" size={48} />
                            <p className="text-xl font-bold text-text">Retrieving member database...</p>
                        </div>
                    ) : error ? (
                        <div className="py-40 text-center">
                            <AlertCircle className="mx-auto text-red-500 mb-6" size={64} />
                            <p className="text-text text-2xl font-black mb-4">{error}</p>
                            <button onClick={fetchUsers} className="btn-primary py-4 px-10">Reconnect Database</button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-40 text-center">
                            <Users className="mx-auto text-text-muted mb-6 opacity-20" size={80} />
                            <p className="text-text-muted text-2xl font-black">No search results detected</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface/50 border-b border-border">
                                    <tr>
                                        <th className="px-8 py-6 text-xs font-black text-text-muted uppercase tracking-[0.2em]">Member Profile</th>
                                        <th className="px-8 py-6 text-xs font-black text-text-muted uppercase tracking-[0.2em]">Security Tier</th>
                                        <th className="px-8 py-6 text-xs font-black text-text-muted uppercase tracking-[0.2em]">Member Since</th>
                                        <th className="px-8 py-6 text-xs font-black text-text-muted uppercase tracking-[0.2em] text-right">Access Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center border-4 border-white shadow-xl shadow-primary/20 overflow-hidden transform group-hover:scale-105 transition-transform">
                                                        <User size={32} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-text text-xl font-black leading-none mb-2">{user.name}</p>
                                                        <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                                                            <Mail size={14} className="text-primary/60" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-3 text-text-muted font-bold text-sm">
                                                    <Calendar size={16} />
                                                    <span>{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <div className="inline-flex items-center gap-4">
                                                    <label className="text-[10px] font-black uppercase text-text-muted tracking-widest mr-2">Update Tier</label>
                                                    <select
                                                        className="bg-surface border-2 border-border rounded-2xl text-xs font-black py-2.5 px-4 text-text outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    >
                                                        <option value="CITIZEN">CITIZEN</option>
                                                        <option value="OFFICER">OFFICER</option>
                                                        <option value="ADMIN">ADMIN</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
