import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Check, Edit2, Loader2, Package, Plus, Search, Sparkles, UserCog, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import aiService from '../services/aiService';

const RESOURCE_TYPES = ['VEHICLE', 'EQUIPMENT', 'COMMUNICATION_DEVICE', 'MEDICAL_KIT', 'WEAPON', 'DRONE', 'OTHER'];
const STATUS_OPTIONS = ['AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'ARCHIVED'];

const statusBadge = {
  AVAILABLE: 'bg-emerald-500/20 text-emerald-400',
  ASSIGNED: 'bg-blue-500/20 text-blue-400',
  MAINTENANCE: 'bg-amber-500/20 text-amber-400',
  ARCHIVED: 'bg-surface-light text-text-muted'
};

function ResourceManagement() {
  const [resources, setResources] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingArchiveId, setPendingArchiveId] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(null);
  const [assignStaffId, setAssignStaffId] = useState('');
  const [aiSuggestedStaff, setAiSuggestedStaff] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    type: RESOURCE_TYPES[0],
    description: '',
    serialNumber: '',
    location: ''
  });

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const loadResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/resources${params}`);
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      notify(error?.response?.data?.message || 'Failed to load resources', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, notify]);

  const loadStaff = useCallback(async () => {
    try {
      const { data } = await api.get('/staff');
      setStaff(Array.isArray(data) ? data : []);
    } catch {
      setStaff([]);
    }
  }, []);

  useEffect(() => {
    loadResources();
    loadStaff();
  }, [loadResources, loadStaff]);

  const statusCounts = useMemo(() => {
    return STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = resources.filter((r) => r.status === status).length;
      return acc;
    }, {});
  }, [resources]);

  const openCreate = () => {
    setEditing(null);
    setForm({ type: RESOURCE_TYPES[0], description: '', serialNumber: '', location: '' });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      type: row.type || RESOURCE_TYPES[0],
      description: row.description || '',
      serialNumber: row.metadata?.serialNumber || '',
      location: row.metadata?.location || ''
    });
    setShowModal(true);
  };

  const saveResource = async (event) => {
    event.preventDefault();
    const metadata = {
      serialNumber: form.serialNumber,
      location: form.location
    };

    try {
      if (editing?._id) {
        await api.put(`/resources/${editing._id}`, {
          type: form.type,
          description: form.description,
          metadata
        });
        notify('Resource updated');
      } else {
        await api.post('/resources', {
          type: form.type,
          description: form.description,
          metadata
        });
        notify('Resource created');
      }
      setShowModal(false);
      await loadResources();
    } catch (error) {
      notify(error?.response?.data?.message || 'Save failed', 'error');
    }
  };

  const archiveResource = async () => {
    if (!pendingArchiveId) return;
    try {
      await api.delete(`/resources/${pendingArchiveId}`);
      notify('Resource archived');
      setPendingArchiveId(null);
      await loadResources();
    } catch (error) {
      notify(error?.response?.data?.message || 'Archive failed', 'error');
    }
  };

  const handleAiSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      await loadResources();
      return;
    }

    setIsAiSearching(true);
    try {
      const data = await aiService.searchResources(searchQuery.trim());
      setResources(Array.isArray(data) ? data : []);
      notify('AI semantic search complete');
    } catch (error) {
      notify(error?.response?.data?.message || 'AI search failed', 'error');
    } finally {
      setIsAiSearching(false);
    }
  };

  const openAssign = (resourceId) => {
    setShowAssignModal(resourceId);
    setAssignStaffId('');
    setAiSuggestedStaff(null);
  };

  const requestAiSuggestion = async (resourceId) => {
    setIsSuggesting(true);
    try {
      const data = await aiService.suggestStaffForResource(resourceId);
      setAiSuggestedStaff(data?.suggestion || null);
      notify('AI suggestion ready');
    } catch (error) {
      notify(error?.response?.data?.message || 'AI suggestion failed', 'error');
    } finally {
      setIsSuggesting(false);
    }
  };

  const assignResource = async () => {
    if (!assignStaffId || !showAssignModal) return;
    try {
      await api.put(`/resources/${showAssignModal}/assign`, { staffId: assignStaffId });
      notify('Resource assigned');
      setShowAssignModal(null);
      setAssignStaffId('');
      setAiSuggestedStaff(null);
      await loadResources();
    } catch (error) {
      notify(error?.response?.data?.message || 'Assignment failed', 'error');
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

      {pendingArchiveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass-morphism w-full max-w-md rounded-2xl p-6">
            <h3 className="mb-2 text-xl font-bold">Archive Resource</h3>
            <p className="mb-6 text-sm text-text-muted">This moves the resource to archived state.</p>
            <div className="flex gap-3">
              <button onClick={archiveResource} className="flex-1 rounded-lg bg-amber-600 py-2.5 font-semibold text-white">Archive</button>
              <button onClick={() => setPendingArchiveId(null)} className="flex-1 rounded-lg bg-surface-light py-2.5 font-semibold text-text">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass-morphism w-full max-w-md rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold">Assign Resource</h3>
              <button onClick={() => setShowAssignModal(null)} className="rounded-lg p-2 text-text-muted hover:bg-surface-light hover:text-white">
                <X size={18} />
              </button>
            </div>

            <button
              onClick={() => requestAiSuggestion(showAssignModal)}
              disabled={isSuggesting}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-300 disabled:opacity-60"
            >
              {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Get AI Staff Suggestion
            </button>

            {aiSuggestedStaff && (
              <div className="mb-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 text-sm">
                <p className="mb-2 font-semibold text-purple-300">AI Recommendation</p>
                <p className="text-text-muted">{aiSuggestedStaff?.reasoning || String(aiSuggestedStaff)}</p>
                <button
                  onClick={() => setAssignStaffId(aiSuggestedStaff?.staffId || aiSuggestedStaff?._id || '')}
                  className="mt-3 inline-flex items-center gap-1 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <Check size={14} /> Use suggestion
                </button>
              </div>
            )}

            <label className="mb-1 block text-sm font-medium text-text-muted">Select Staff</label>
            <select className="input-field" value={assignStaffId} onChange={(e) => setAssignStaffId(e.target.value)}>
              <option value="">Select staff member</option>
              {staff.map((s) => (
                <option key={s._id} value={s._id}>
                  {s?.userId?.name || 'Unknown'} ({(s?.department || '').replace('_', ' ')})
                </option>
              ))}
            </select>

            <button onClick={assignResource} disabled={!assignStaffId} className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50">
              Confirm Assignment
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass-morphism w-full max-w-xl rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editing ? 'Update Resource' : 'Add New Resource'}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-2 text-text-muted hover:bg-surface-light hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={saveResource}>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-muted">Resource Type</label>
                <select className="input-field" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
                  {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-muted">Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Resource details"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-muted">Serial Number</label>
                  <input
                    className="input-field font-mono"
                    value={form.serialNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, serialNumber: e.target.value }))}
                    placeholder="SN-001"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-muted">Location</label>
                  <input
                    className="input-field"
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="North Zone"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2">
                {editing ? <Edit2 size={16} /> : <Plus size={16} />}
                {editing ? 'Update Resource' : 'Create Resource'}
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="mx-auto mt-12 max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black">Resource Command</h1>
            <p className="text-text-muted">Manage assets with dedicated metadata and AI-assisted assignment.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/ai-insights" className="rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300">
              Open AI Insights
            </Link>
            <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2"><Plus size={16} /> Add Resource</button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              className={`rounded-xl border p-3 text-left ${statusFilter === status ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface/30'}`}
            >
              <div className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadge[status]}`}>{status}</div>
              <div className="text-2xl font-bold">{statusCounts[status] || 0}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleAiSearch} className="mb-8 flex items-center gap-2 rounded-2xl border border-white/10 bg-surface/40 p-3">
          <Sparkles size={16} className="text-purple-300" />
          <input
            className="w-full bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Semantic AI search for resources"
          />
          <button type="submit" disabled={isAiSearching} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {isAiSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <div className="col-span-full py-20 text-center text-text-muted">
              <Loader2 size={28} className="mx-auto mb-3 animate-spin" /> Loading resources...
            </div>
          )}

          {!loading && resources.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/20 py-16 text-center">
              <Archive size={40} className="mx-auto mb-3 text-text-muted" />
              <p className="text-text-muted">No resources found.</p>
            </div>
          )}

          {!loading && resources.map((r) => (
            <article key={r._id} className="glass-morphism rounded-2xl border border-white/10 p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-muted">{(r.type || '').replace(/_/g, ' ')}</p>
                  <h3 className="text-lg font-bold leading-tight">{r.description}</h3>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusBadge[r.status] || statusBadge.ARCHIVED}`}>
                  {r.status}
                </span>
              </div>

              <div className="mb-4 space-y-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Serial</span>
                  <span className="font-mono">{r.metadata?.serialNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Location</span>
                  <span>{r.metadata?.location || 'Unknown'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {r.status !== 'ARCHIVED' && (
                  <button onClick={() => openAssign(r._id)} className="flex-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                    <span className="inline-flex items-center gap-1"><UserCog size={14} /> Assign</span>
                  </button>
                )}
                <button onClick={() => openEdit(r)} className="rounded-lg border border-white/10 bg-surface/30 px-3 py-2 text-sm hover:border-primary/30 hover:text-primary">
                  <Edit2 size={14} />
                </button>
                {r.status !== 'ARCHIVED' && (
                  <button onClick={() => setPendingArchiveId(r._id)} className="rounded-lg border border-white/10 bg-surface/30 px-3 py-2 text-sm hover:border-amber-500/40 hover:text-amber-400">
                    <Archive size={14} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ResourceManagement;
