import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit2, Loader2, Plus, Search, Shield, Trash2, UserPlus, Users, X } from 'lucide-react';
import Navbar from '../components/Navbar';
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
    permissions: []
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
    // load users for selection
    (async () => {
      try {
        const res = await api.get('/auth/users');
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        // ignore - fallback to manual entry
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

    if (!editing && !creatingUser) {
      const isAlreadyAssigned = staff.some((item) => {
        const existingUserId = typeof item?.userId === 'string' ? item.userId : item?.userId?._id;
        return existingUserId === form.userId;
      });

      if (isAlreadyAssigned) {
        notify('Selected user is already assigned as staff', 'error');
        return;
      }
    }

    try {
      if (editing?._id) {
        await api.put(`/staff/${editing._id}`, {
          department: form.department,
          permissions: form.permissions
        });
        notify('Staff updated');
      } else {
        let targetUserId = form.userId;

        if (creatingUser) {
          const name = (form.name || '').trim();
          const email = (form.email || '').trim();
          const password = form.password || '';

          if (!name || !email || !password) {
            notify('Name, email and password are required to create a new user', 'error');
            return;
          }

          const registerRes = await api.post('/auth/register', {
            name,
            email,
            password,
            phone: (form.phone || '').trim()
          });

          targetUserId = registerRes?.data?.user?.id || registerRes?.data?.user?._id;
          if (!targetUserId) {
            notify('User was created but could not be linked to staff', 'error');
            return;
          }
        }

        await api.post('/staff', {
          userId: targetUserId,
          department: form.department,
          permissions: form.permissions
        });
        notify('Staff added');
      }
      setShowModal(false);
      setCreatingUser(false);
      await loadStaff();
    } catch (error) {
      notify(error?.response?.data?.message || 'Save failed', 'error');
    }
  };

  const removeStaff = async () => {
    if (!pendingDeleteId) return;
    try {
      await api.delete(`/staff/${pendingDeleteId}`);
      notify('Staff removed');
      setPendingDeleteId(null);
      await loadStaff();
    } catch (error) {
      notify(error?.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      {toast && (
        <div className={`fixed right-6 top-6 z-50 rounded-xl px-4 py-3 text-sm text-white shadow-2xl ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.message}
        </div>
      )}

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass-morphism w-full max-w-md rounded-2xl p-6">
            <h3 className="mb-2 text-xl font-bold">Remove Staff Member</h3>
            <p className="mb-6 text-sm text-text-muted">This removes the staff profile from operations.</p>
            <div className="flex gap-3">
              <button onClick={removeStaff} className="flex-1 rounded-lg bg-red-600 py-2.5 font-semibold text-white">Remove</button>
              <button onClick={() => setPendingDeleteId(null)} className="flex-1 rounded-lg bg-surface-light py-2.5 font-semibold text-text">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass-morphism w-full max-w-2xl rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editing ? 'Edit Staff' : 'Add Staff'}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-2 text-text-muted hover:bg-surface-light hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form className="space-y-5" onSubmit={saveStaff}>
              {!editing && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-muted">Select User</label>
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
                    <option value="">-- Select existing user --</option>
                    {availableUsers.map((u) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                    <option value="NEW">+ Create new user...</option>
                  </select>

                  {!creatingUser && availableUsers.length === 0 && (
                    <p className="mt-2 text-xs text-text-muted">No unassigned users available. Create a new user to continue.</p>
                  )}

                  {creatingUser && (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="input-field"
                        required
                      />
                      <input
                        placeholder="Email"
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
                        placeholder="Phone (optional)"
                        value={form.phone}
                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-text-muted">Department</label>
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

              <div>
                <label className="mb-2 block text-sm font-medium text-text-muted">Permissions</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PERMISSIONS.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => togglePermission(p)}
                      className={`rounded-lg border px-3 py-2 text-left text-xs transition ${form.permissions.includes(p) ? 'border-primary bg-primary/10 text-white' : 'border-white/10 bg-surface/40 text-text-muted'}`}
                    >
                      {p.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2">
                {editing ? <Edit2 size={16} /> : <UserPlus size={16} />}
                {editing ? 'Update Staff' : 'Create Staff'}
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="mx-auto mt-12 max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black">Staff Operations</h1>
            <p className="text-text-muted">Manage teams, departments, and permissions in one place.</p>
          </div>
          <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Add Staff
          </button>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/40 p-4">
          <Search size={18} className="text-text-muted" />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Search by name, email, or department"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading && (
            <div className="col-span-full py-20 text-center text-text-muted">
              <Loader2 size={28} className="mx-auto mb-3 animate-spin" /> Loading staff...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/20 py-16 text-center">
              <Users size={40} className="mx-auto mb-3 text-text-muted" />
              <p className="text-text-muted">No matching staff records.</p>
            </div>
          )}

          {!loading && filtered.map((row) => (
            <article key={row._id} className="glass-morphism rounded-2xl border border-white/10 p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">{row?.userId?.name || 'Unknown'}</h3>
                  <p className="text-xs text-text-muted">{row?.userId?.email || 'No email'}</p>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {row?.department?.replace('_', ' ') || 'N/A'}
                </span>
              </div>

              <div className="mb-5 flex flex-wrap gap-1.5">
                {(row.permissions || []).slice(0, 4).map((p) => (
                  <span key={p} className="rounded border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase text-text-muted">
                    {p.replace(/_/g, ' ')}
                  </span>
                ))}
                {(row.permissions || []).length > 4 && (
                  <span className="rounded border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase text-text-muted">
                    +{row.permissions.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEdit(row)} className="flex-1 rounded-lg border border-white/10 bg-surface/40 px-3 py-2 text-sm hover:border-primary/30 hover:text-primary">
                  <span className="inline-flex items-center gap-1"><Edit2 size={14} /> Edit</span>
                </button>
                <button onClick={() => setPendingDeleteId(row._id)} className="flex-1 rounded-lg border border-white/10 bg-surface/40 px-3 py-2 text-sm hover:border-red-500/40 hover:text-red-400">
                  <span className="inline-flex items-center gap-1"><Trash2 size={14} /> Remove</span>
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
