import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit2, Loader2, Plus, Search, Shield, Trash2, UserPlus, Users, X, Activity, Briefcase, Mail, Phone, Lock } from 'lucide-react';

import api from '../utils/api';

const DEPARTMENTS = ['PATROL', 'INVESTIGATION', 'ADMINISTRATION', 'WILDLIFE_RESCUE', 'ANALYTICS'];
const PERMISSIONS = ['VIEW_INCIDENTS', 'MANAGE_INCIDENTS', 'VIEW_CASES', 'MANAGE_CASES', 'VIEW_RESOURCES', 'MANAGE_RESOURCES', 'VIEW_ANALYTICS', 'MANAGE_ALERTS'];

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [form, setForm] = useState({
    userId: '',
    department: DEPARTMENTS[0],
    permissions: [],
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [users, setUsers] = useState([]);
  const [creatingUser, setCreatingUser] = useState(false);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/staff');
      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      notify(error?.response?.data?.message || 'Failed to load staff', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const filtered = useMemo(() => {
    if (!query.trim()) return staff;
    const q = query.toLowerCase();
    return staff.filter((item) => {
      const name = item?.userId?.name || '';
      const email = item?.userId?.email || '';
      const dept = item?.department || '';
      return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || dept.toLowerCase().includes(q);
    });
  }, [query, staff]);

  const availableUsers = useMemo(() => {
    const assignedUserIds = new Set(
      staff
        .map((item) => (typeof item?.userId === 'string' ? item.userId : item?.userId?._id))
        .filter(Boolean)
    );

    return users.filter((u) => !assignedUserIds.has(u?._id));
  }, [users, staff]);

  const openCreate = () => {
    setEditing(null);
    setForm({ userId: '', department: DEPARTMENTS[0], permissions: [], name: '', email: '', password: '', phone: '' });
    setShowModal(true);
    (async () => {
      try {
        const res = await api.get('/auth/users');
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setUsers([]);
      }
    })();
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      userId: row?.userId?._id || row?.userId || '',
      department: row?.department || DEPARTMENTS[0],
      permissions: Array.isArray(row?.permissions) ? row.permissions : []
    });
    setShowModal(true);
  };

  const togglePermission = (permission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const saveStaff = async (event) => {
    event.preventDefault();

    if (!editing && !creatingUser && !form.userId) {
      notify('Please select a user to add as staff', 'error');
      return;
    }

    try {
      if (editing?._id) {
        await api.put(`/staff/${editing._id}`, {
          department: form.department,
          permissions: form.permissions
        });
        notify('Staff profile updated');
      } else {
        let targetUserId = form.userId;

        if (creatingUser) {
          const name = (form.name || '').trim();
          const email = (form.email || '').trim();
          const password = form.password || '';

          const registerRes = await api.post('/auth/register', {
            name,
            email,
            password,
            phone: (form.phone || '').trim()
          });

          targetUserId = registerRes?.data?.user?.id || registerRes?.data?.user?._id;
        }

        await api.post('/staff', {
          userId: targetUserId,
          department: form.department,
          permissions: form.permissions
        });
        notify('New staff member added');
      }
      setShowModal(false);
      setCreatingUser(false);
      await loadStaff();
    } catch (error) {
      notify(error?.response?.data?.message || 'Action failed', 'error');
    }
  };

  const removeStaff = async () => {
    if (!pendingDeleteId) return;
    try {
      await api.delete(`/staff/${pendingDeleteId}`);
      notify('Staff record removed');
      setPendingDeleteId(null);
      await loadStaff();
    } catch (error) {
      notify(error?.response?.data?.message || 'Removal failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-16">
      

      {toast && (
        <div className={`fixed right-6 top-6 z-50 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-2xl animate-fade-in ${toast.type === 'error' ? 'bg-red-500' : 'bg-primary'}`}>
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-border">
             <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="text-red-500" size={32} />
             </div>
            <h3 className="mb-2 text-2xl font-black text-text">Remove Staff</h3>
            <p className="mb-8 text-sm text-text-muted font-medium">This will revoke all operational permissions for this staff member. This action is permanent.</p>
            <div className="flex gap-4">
              <button onClick={removeStaff} className="flex-1 rounded-2xl bg-red-500 py-4 font-black text-white hover:bg-red-600 transition-colors">Confirm Removal</button>
              <button onClick={() => setPendingDeleteId(null)} className="flex-1 rounded-2xl bg-surface py-4 font-black text-text hover:bg-border transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl border border-border animate-float-in overflow-y-auto max-h-[90vh]">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-3xl font-black text-text tracking-tight">{editing ? 'Update Staff profile' : 'Deploy New Staff'}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-2xl p-3 text-text-muted hover:bg-surface transition-all">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={saveStaff}>
              {!editing && (
                <div className="space-y-4">
                  <label className="mb-1 block text-xs font-black uppercase tracking-widest text-text-muted">User Association</label>
                  <select
                    value={creatingUser ? 'NEW' : form.userId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'NEW') {
                        setCreatingUser(true);
                        setForm((prev) => ({ ...prev, userId: '' }));
                      } else {
                        setCreatingUser(false);
                        setForm((prev) => ({ ...prev, userId: val }));
                      }
                    }}
                    className="input-field"
                    required={!creatingUser}
                  >
                    <option value="">-- Select existing citizen account --</option>
                    {availableUsers.map((u) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                    <option value="NEW" className="font-bold text-primary">+ Create & onboard new user...</option>
                  </select>

                  {creatingUser && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-6 rounded-3xl bg-surface border border-border animate-scale-in">
                      <input
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="input-field"
                        required
                      />
                      <input
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="input-field"
                        required
                      />
                      <input
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        className="input-field"
                        required
                        type="password"
                      />
                      <input
                        placeholder="Contact Phone"
                        value={form.phone}
                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-text-muted">Division</label>
                    <select
                    value={form.department}
                    onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                    className="input-field"
                    >
                    {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d.replace('_', ' ')}</option>
                    ))}
                    </select>
                </div>
              </div>

              <div>
                <label className="mb-4 block text-xs font-black uppercase tracking-widest text-text-muted">Security Clearances</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {PERMISSIONS.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => togglePermission(p)}
                      className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all ${form.permissions.includes(p) ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-white text-text-muted hover:border-primary/20'}`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 ${form.permissions.includes(p) ? 'bg-primary border-primary' : 'border-border'}`}>
                         {form.permissions.includes(p) && <Shield size={12} className="text-white" />}
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight">{p.replace(/_/g, ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-5 text-base flex items-center justify-center gap-3">
                {editing ? <Edit2 size={20} /> : <UserPlus size={20} />}
                {editing ? 'Update Operational Records' : 'Complete Onboarding'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto mt-24 max-w-7xl px-6 animate-fade-in">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
                <Users size={14} />
                Human Resources
            </div>
            <h1 className="text-5xl font-black text-text tracking-tighter mb-2">Staff <span className="text-primary">Registry</span></h1>
            <p className="text-text-muted text-lg max-w-2xl font-medium">Coordinate field teams, manage departmental assignments, and control high-level system permissions.</p>
          </div>
          <button onClick={openCreate} className="btn-primary h-14 !px-8 flex items-center gap-2">
            <Plus size={20} /> Deploy Staff
          </button>
        </div>

        {/* Global Search */}
        <div className="mb-12 flex items-center gap-4 bg-white rounded-3xl border border-border p-4 shadow-premium focus-within:border-primary/50 transition-all">
          <Search size={24} className="text-primary ml-2" />
          <input
            className="w-full bg-transparent outline-none text-lg font-medium text-text placeholder:text-text-muted"
            placeholder="Search by name, biometric ID, or division..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading && (
            <div className="col-span-full py-32 text-center text-text-muted">
              <Loader2 size={48} className="mx-auto mb-6 animate-spin text-primary" /> 
              <p className="text-xl font-bold">Synchronizing personnel files...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="col-span-full rounded-[40px] border-4 border-dashed border-border py-32 text-center bg-white/50">
               <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                <Users size={40} />
              </div>
              <p className="text-2xl font-black text-text">No Personnel Found</p>
              <p className="text-text-muted max-w-sm mx-auto mt-2">Try adjusting your search parameters or deploy a new staff member.</p>
            </div>
          )}

          {!loading && filtered.map((row) => (
            <article key={row._id} className="group bg-white rounded-[40px] border border-border p-8 shadow-premium transition-all hover:shadow-2xl hover:translate-y-[-8px] hover:border-primary/20 flex flex-col">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                        <Users size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-text leading-tight">{row?.userId?.name || 'Unknown Officer'}</h3>
                        <div className="flex items-center gap-2 mt-1 px-2 py-0.5 rounded-lg bg-surface text-[10px] font-black uppercase text-text-muted tracking-widest border border-border">
                            <Activity size={10} /> Active Duty
                        </div>
                    </div>
                </div>
                 <div className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                    {row?.department?.replace('_', ' ') || 'UNASSIGNED'}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
                    <Mail size={16} className="text-primary/60" />
                    <span>{row?.userId?.email || 'N/A'}</span>
                </div>
                 <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
                    <Briefcase size={16} className="text-primary/60" />
                    <span>Wildlife Management Dept.</span>
                </div>
              </div>

              <div className="mb-8">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-3">Clearance Level</label>
                 <div className="flex flex-wrap gap-2">
                    {(row.permissions || []).slice(0, 3).map((p) => (
                    <span key={p} className="px-3 py-1 rounded-lg bg-surface border border-border text-[9px] font-black uppercase text-text-muted">
                        {p.split('_')[0]}
                    </span>
                    ))}
                    {(row.permissions || []).length > 3 && (
                    <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/10 text-[9px] font-black uppercase text-primary">
                        +{row.permissions.length - 3} Clearances
                    </span>
                    )}
                </div>
              </div>

              <div className="mt-auto flex gap-3 pt-6 border-t border-border/50">
                <button onClick={() => openEdit(row)} className="flex-1 h-12 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center gap-2 hover:bg-primary transition-all hover:text-white border border-primary/20">
                  <Edit2 size={16} /> Edit
                </button>
                <button onClick={() => setPendingDeleteId(row._id)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-border text-text-muted hover:text-red-500 hover:border-red-200 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default StaffManagement;
