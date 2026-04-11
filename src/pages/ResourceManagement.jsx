import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Check, Edit2, Loader2, Plus, Sparkles, UserCog, X, Package, Shield, Activity, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useFixedNavOffsetClass } from '../hooks/useFixedNavOffsetClass';
import { useAuth } from '../context/AuthContext';
import aiService from '../services/aiService';
import resourceService from '../services/resourceService';

const RESOURCE_TYPES = ['VEHICLE', 'EQUIPMENT', 'COMMUNICATION_DEVICE', 'MEDICAL_KIT', 'WEAPON', 'DRONE', 'OTHER'];
const STATUS_OPTIONS = ['AVAILABLE', 'ASSIGNED', 'ARCHIVED'];

const statusBadge = {
  AVAILABLE: 'bg-green-50 text-primary border-green-100',
  ASSIGNED: 'bg-blue-50 text-blue-600 border-blue-100',
  MAINTENANCE: 'bg-orange-50 text-orange-600 border-orange-100',
  ARCHIVED: 'bg-slate-50 text-slate-500 border-slate-100'
};

function ResourceManagement() {
  const { user } = useAuth();
  const navPt = useFixedNavOffsetClass();
  const isAdmin = user?.role === 'ADMIN';
  const isOfficer = user?.role === 'OFFICER';
  const currentUserId = user?._id || user?.id;

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
    location: '',
    otherType: ''
  });

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const loadResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await resourceService.getAllResources(statusFilter);
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      notify(error?.response?.data?.message || 'Failed to load resources', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, notify]);

  const loadStaff = useCallback(async () => {
    if (!isAdmin) {
      setStaff([]);
      return;
    }

    try {
      const data = await resourceService.getAllStaff();
      setStaff(Array.isArray(data) ? data : []);
    } catch {
      setStaff([]);
    }
  }, [isAdmin]);

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

  const findStaffById = useCallback((staffId) => {
    if (!staffId) return null;
    return staff.find((s) => s?._id === staffId) || null;
  }, [staff]);

  const getAssignedStaffName = useCallback((resource) => {
    const assignedId = typeof resource?.assignedTo === 'string'
      ? resource.assignedTo
      : resource?.assignedTo?._id;

    const assignedStaff = findStaffById(assignedId) || resource?.assignedTo;
    return assignedStaff?.userId?.name || 'Assigned staff';
  }, [findStaffById]);

  const isAssignedToCurrentOfficer = useCallback((resource) => {
    const assignedUserId = typeof resource?.assignedTo?.userId === 'string'
      ? resource.assignedTo.userId
      : resource?.assignedTo?.userId?._id;

    return !!assignedUserId && !!currentUserId && assignedUserId === currentUserId;
  }, [currentUserId]);

  const usageReport = useMemo(() => {
    const total = resources.length;
    const available = resources.filter((r) => r.status === 'AVAILABLE').length;
    const assigned = resources.filter((r) => r.status === 'ASSIGNED').length;
    const archived = resources.filter((r) => r.status === 'ARCHIVED').length;
    const utilization = total > 0 ? Math.round((assigned / total) * 100) : 0;

    const byDepartment = {};
    resources
      .filter((r) => r.status === 'ASSIGNED')
      .forEach((r) => {
        const assignedId = typeof r?.assignedTo === 'string' ? r.assignedTo : r?.assignedTo?._id;
        const assignedStaff = findStaffById(assignedId) || r?.assignedTo;
        const dept = assignedStaff?.department || 'Unspecified';
        byDepartment[dept] = (byDepartment[dept] || 0) + 1;
      });

    return { total, available, assigned, archived, utilization, byDepartment };
  }, [resources, findStaffById]);

  const openCreate = () => {
    setEditing(null);
    setForm({ type: RESOURCE_TYPES[0], description: '', serialNumber: '', location: '', otherType: '' });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      type: RESOURCE_TYPES.includes(row.type) ? row.type : 'OTHER',
      description: row.description || '',
      serialNumber: row.metadata?.serialNumber || '',
      location: row.metadata?.location || '',
      otherType: RESOURCE_TYPES.includes(row.type) ? '' : (row.type || '')
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
      const finalType = form.type === 'OTHER' ? (form.otherType || form.type) : form.type;
      if (editing?._id) {
        await resourceService.updateResource(editing._id, {
          type: finalType,
          description: form.description,
          metadata
        });
        notify('Resource updated');
      } else {
        await resourceService.createResource({
          type: finalType,
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
      await resourceService.deleteResource(pendingArchiveId);
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
      await resourceService.assignResource(showAssignModal, assignStaffId);
      notify('Resource assigned');
      setShowAssignModal(null);
      setAssignStaffId('');
      setAiSuggestedStaff(null);
      await loadResources();
    } catch (error) {
      notify(error?.response?.data?.message || 'Assignment failed', 'error');
    }
  };

  const takeResource = async (resourceId) => {
    try {
      await resourceService.assignResource(resourceId);
      notify('Resource taken and locked to your account');
      await loadResources();
    } catch (error) {
      notify(error?.response?.data?.message || 'Unable to take resource', 'error');
    }
  };

  const releaseResource = async (resourceId) => {
    try {
      await resourceService.releaseResource(resourceId);
      notify('Resource released and available again');
      await loadResources();
    } catch (error) {
      notify(error?.response?.data?.message || 'Release failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-16">
      

      {toast && (
        <div className={`fixed right-6 top-6 z-50 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-2xl animate-fade-in ${toast.type === 'error' ? 'bg-red-500' : 'bg-primary'}`}>
          {toast.message}
        </div>
      )}

      {/* Confirmation & Modals (Standardized Style) */}
      {pendingArchiveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-border">
            <h3 className="mb-2 text-2xl font-black text-text">Archive Resource</h3>
            <p className="mb-8 text-sm text-text-muted">This moves the resource to archived state. It will no longer be available for field use.</p>
            <div className="flex gap-4">
              <button onClick={archiveResource} className="flex-1 rounded-2xl bg-orange-500 py-4 font-black text-white hover:bg-orange-600 transition-colors">Archive</button>
              <button onClick={() => setPendingArchiveId(null)} className="flex-1 rounded-2xl bg-surface py-4 font-black text-text hover:bg-border transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl border border-border animate-float-in">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-black text-text tracking-tight">Assign Resource</h3>
              <button onClick={() => setShowAssignModal(null)} className="rounded-xl p-2 text-text-muted hover:bg-surface transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-text-muted">AI Assistance</label>
                    <button
                        onClick={() => requestAiSuggestion(showAssignModal)}
                        disabled={isSuggesting}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/20 bg-primary/5 px-4 py-4 text-sm font-bold text-primary hover:bg-primary/10 transition-all disabled:opacity-60"
                    >
                        {isSuggesting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        Get Intelligent Recommendation
                    </button>
                </div>

                {aiSuggestedStaff && (
                <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 animate-scale-in">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Sparkles size={16} className="text-primary" />
                        </div>
                        <p className="font-black text-sm text-primary">AI Match Found</p>
                    </div>
                    <p className="text-sm text-text font-medium leading-relaxed italic">"{aiSuggestedStaff?.reasoning || String(aiSuggestedStaff)}"</p>
                    <button
                        onClick={() => setAssignStaffId(aiSuggestedStaff?.staffId || aiSuggestedStaff?._id || '')}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all"
                    >
                        <Check size={14} /> Apply Recommendation
                    </button>
                </div>
                )}

                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-text-muted">Staff Selection</label>
                    <select className="input-field" value={assignStaffId} onChange={(e) => setAssignStaffId(e.target.value)}>
                    <option value="">Choose a staff member...</option>
                    {staff.map((s) => (
                        <option key={s._id} value={s._id}>
                        {s?.userId?.name || 'Unknown'} ({(s?.department || '').replace('_', ' ')})
                        </option>
                    ))}
                    </select>
                </div>

                <button onClick={assignResource} disabled={!assignStaffId} className="btn-primary w-full py-4 text-base disabled:opacity-50">
                    Confirm Assignment
                </button>
            </div>
          </div>
        </div>
      )}

      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl border border-border animate-float-in">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-3xl font-black text-text tracking-tight">{editing ? 'Edit Asset' : 'New Asset'}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-2xl p-3 text-text-muted hover:bg-surface transition-all">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={saveResource}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-text-muted">Asset Category</label>
                    <select className="input-field" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
                    {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                    </select>
                </div>
                <div>
                   <label className="mb-2 block text-xs font-black uppercase tracking-widest text-text-muted">Serial Code</label>
                    <input
                        className="input-field font-mono"
                        value={form.serialNumber}
                        onChange={(e) => setForm((prev) => ({ ...prev, serialNumber: e.target.value }))}
                        placeholder="SN-XXXX"
                        required
                    />
                </div>
              </div>

              {form.type === 'OTHER' && (
                <div className="animate-fade-in">
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-text-muted">Specify Type</label>
                    <input
                    className="input-field"
                    placeholder="Enter resource type"
                    value={form.otherType}
                    onChange={(e) => setForm((prev) => ({ ...prev, otherType: e.target.value }))}
                    required
                    />
                </div>
                )}

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-text-muted">Deployment Location</label>
                <input
                  className="input-field"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Ranger Station Alpha"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-text-muted">Operational Details</label>
                <textarea
                  className="input-field min-h-[120px] resize-none"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe technical status, maintenance needs, or special features..."
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-base">
                {editing ? 'Update Asset Info' : 'Initialize Asset In System'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`mx-auto max-w-7xl px-6 animate-fade-in ${navPt || 'mt-24'}`}>
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
                <Package size={14} />
                Strategic Assets
            </div>
            <h1 className="text-5xl font-black text-text tracking-tighter mb-2">
                Resource <span className="text-primary">Inventory</span>
            </h1>
            <p className="text-text-muted text-lg max-w-2xl font-medium">
              {isAdmin
                ? 'Central command for deploying equipment, managing regional assets, and optimizing field response units.'
                : 'Access the regional equipment pool. Book verified assets for immediate deployment.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <Link to="/ai-insights" className="h-14 px-8 flex items-center gap-3 rounded-2xl border-2 border-primary/20 bg-white text-primary font-black hover:bg-primary/5 transition-all shadow-premium">
              <Activity size={20} />
              Operational Insights
            </Link>
            {isAdmin && (
              <button onClick={openCreate} className="btn-primary h-14 !px-8 flex items-center gap-2">
                  <Plus size={20} />
                  Add New Asset
              </button>
            )}
          </div>
        </div>

        {/* Admin Dashboard Statistics Section */}
        {isAdmin && (
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[40px] border border-border p-10 shadow-premium">
               <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-text">Fleet Availability</h2>
                    <div className="px-4 py-2 rounded-xl bg-primary/5 text-primary text-sm font-bold border border-primary/10">
                        {usageReport.utilization}% Utilization
                    </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-6 rounded-3xl bg-surface border border-border">
                        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">Total Assets</p>
                        <p className="text-4xl font-black text-text">{usageReport.total}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-green-50/50 border border-green-100">
                        <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Available</p>
                        <p className="text-4xl font-black text-primary">{usageReport.available}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100">
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Deployed</p>
                        <p className="text-4xl font-black text-blue-600">{usageReport.assigned}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Archived</p>
                        <p className="text-4xl font-black text-slate-500">{usageReport.archived}</p>
                    </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-border p-10 shadow-premium">
                <h3 className="text-xl font-black text-text mb-6">Department Distribution</h3>
                <div className="space-y-4">
                    {Object.keys(usageReport.byDepartment).length === 0 ? (
                        <div className="py-8 text-center text-text-muted font-medium bg-surface rounded-3xl border border-dashed">
                             No active deployments
                        </div>
                    ) : (
                         Object.entries(usageReport.byDepartment).map(([dept, count]) => (
                            <div key={dept} className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border transition-hover hover:border-primary/30">
                                <span className="font-bold text-text">{dept.replace(/_/g, ' ')}</span>
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-black shadow-lg shadow-primary/20">
                                    {count}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="mb-10 flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex items-center gap-4 bg-white rounded-3xl border border-border p-3 shadow-premium focus-within:border-primary/50 transition-all">
                <div className="pl-4 text-primary">
                    <Sparkles size={24} />
                </div>
                <input
                    className="flex-1 bg-transparent py-2 px-2 text-lg font-medium text-text outline-none placeholder:text-text-muted"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask AI for resources... e.g. 'unassigned drones in rangers station'"
                />
                <button 
                    onClick={handleAiSearch} 
                    disabled={isAiSearching} 
                    className="bg-primary px-8 py-4 rounded-2xl text-white font-black hover:translate-y-[-2px] transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary/20"
                >
                    {isAiSearching ? <Loader2 size={24} className="animate-spin" /> : 'Optimize Search'}
                </button>
            </div>
            
            <div className="flex gap-2">
                {STATUS_OPTIONS.map((status) => (
                    <button
                    key={status}
                    onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                    className={`
                        px-6 py-4 rounded-3xl border-2 font-black text-sm transition-all
                        ${statusFilter === status 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-white border-border text-text-muted hover:border-primary/30 hover:text-primary'}
                    `}
                    >
                    {status}
                    </button>
                ))}
            </div>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading && (
            <div className="col-span-full py-32 text-center text-text-muted">
              <Loader2 size={48} className="mx-auto mb-6 animate-spin text-primary" /> 
              <p className="text-xl font-bold">Synchronizing database assets...</p>
            </div>
          )}

          {!loading && resources.length === 0 && (
            <div className="col-span-full rounded-[40px] border-4 border-dashed border-border py-32 text-center bg-white/50">
              <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                <Package size={40} />
              </div>
              <p className="text-2xl font-black text-text">No Matching Assets Found</p>
              <p className="text-text-muted max-w-sm mx-auto mt-2">Try refreshing the filters or initializing new operational resources.</p>
            </div>
          )}

          {!loading && resources.map((r) => (
            <article key={r._id} className="group bg-white rounded-[40px] border border-border p-8 shadow-premium transition-all hover:shadow-2xl hover:translate-y-[-8px] hover:border-primary/20 flex flex-col">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{(r.type || '').replace(/_/g, ' ')}</p>
                  </div>
                  <h3 className="text-2xl font-black text-text leading-tight group-hover:text-primary transition-colors">{r.description}</h3>
                </div>
                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${statusBadge[r.status] || statusBadge.ARCHIVED}`}>
                  {r.status}
                </span>
              </div>

              <div className="mb-6 space-y-3 p-6 rounded-3xl bg-surface border border-border/50 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-muted flex items-center gap-2"><Shield size={14} /> ID Code</span>
                  <span className="font-mono text-text bg-white px-2 py-1 rounded-lg border border-border">{r.metadata?.serialNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-muted flex items-center gap-2"><MapPin size={14} /> Deployment</span>
                  <span className="text-text">{r.metadata?.location || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-muted flex items-center gap-2"><Activity size={14} /> Current Holder</span>
                  <span className="text-text">{r.status === 'ASSIGNED' ? getAssignedStaffName(r) : 'System Pool'}</span>
                </div>
              </div>

              <div className="mt-auto flex gap-3">
                {isAdmin && r.status !== 'ARCHIVED' && (
                  <button onClick={() => openAssign(r._id)} className="flex-1 h-14 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center gap-2 hover:bg-primary transition-all hover:text-white shadow-sm border border-primary/20 hover:shadow-lg hover:shadow-primary/20">
                     <UserCog size={18} />
                     Assign
                  </button>
                )}

                {isOfficer && r.status === 'AVAILABLE' && (
                  <button onClick={() => takeResource(r._id)} className="flex-1 h-14 rounded-2xl bg-primary text-white font-black flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/20">
                    <Package size={18} />
                    Take Resource
                  </button>
                )}

                {isOfficer && r.status === 'ASSIGNED' && isAssignedToCurrentOfficer(r) && (
                  <button onClick={() => releaseResource(r._id)} className="flex-1 h-14 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-orange-500/20">
                    <Check size={18} />
                    Release Asset
                  </button>
                )}

                {isOfficer && r.status === 'ASSIGNED' && !isAssignedToCurrentOfficer(r) && (
                  <button disabled className="flex-1 h-14 cursor-not-allowed rounded-2xl bg-surface border border-border text-text-muted font-black text-xs px-4">
                    Locked to Ranger
                  </button>
                )}

                {isAdmin && (
                  <button onClick={() => openEdit(r)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border-2 border-border text-text-muted hover:text-primary hover:border-primary transition-all">
                    <Edit2 size={18} />
                  </button>
                )}

                {isAdmin && r.status !== 'ARCHIVED' && (
                  <button onClick={() => setPendingArchiveId(r._id)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border-2 border-border text-text-muted hover:text-orange-500 hover:border-orange-200 transition-all">
                    <Archive size={18} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Admin Audit Table */}
        {isAdmin && (
          <section className="mt-20 bg-white rounded-[40px] border border-border p-10 shadow-premium overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                     <h2 className="text-3xl font-black text-text mb-2">Operational Audit</h2>
                     <p className="text-text-muted font-medium">Real-time status tracking for all deployed assets.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-text-muted">Asset Description</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-text-muted">Type</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-text-muted">Assigned Personnel</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-text-muted">Service Dept</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-text-muted text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {resources.filter((r) => r.status === 'ASSIGNED').length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-text-muted font-bold text-lg">No active field deployments tracking</td>
                    </tr>
                  ) : resources.filter((r) => r.status === 'ASSIGNED').map((r) => {
                    const assignedId = typeof r?.assignedTo === 'string' ? r.assignedTo : r?.assignedTo?._id;
                    const assignedStaff = findStaffById(assignedId) || r?.assignedTo;

                    return (
                      <tr key={r._id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-6 border-transparent font-bold text-text group-hover:text-primary">{r.description || 'N/A'}</td>
                        <td className="px-6 py-6 border-transparent font-bold text-text-muted">{(r.type || '').replace(/_/g, ' ')}</td>
                        <td className="px-6 py-6 border-transparent font-black text-text">{assignedStaff?.userId?.name || 'Unknown Ranger'}</td>
                        <td className="px-6 py-6 border-transparent font-bold text-text-muted">{(assignedStaff?.department || 'N/A').replace(/_/g, ' ')}</td>
                        <td className="px-6 py-6 border-transparent text-right">
                          <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">DEPLOYED</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ResourceManagement;
