import React, { useCallback, useEffect, useState } from 'react';
import { Activity, Bot, Loader2, Package, Search, Sparkles, UserCog, Zap, Brain, Shield, Target, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useFixedNavOffsetClass } from '../hooks/useFixedNavOffsetClass';
import api from '../utils/api';
import aiService from '../services/aiService';

const KYC_STATUS_OPTIONS = [
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'PENDING', label: 'Pending Verification' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'UNDER_REVIEW', label: 'Under Review' }
];

const ASSET_SCENARIO_OPTIONS = [
  { value: 'PATROL_VEHICLE_LOW_FUEL', label: 'Patrol vehicle has low fuel' },
  { value: 'MEDICAL_KIT_RESTOCK', label: 'Medical kit needs restock' },
  { value: 'DRONE_BATTERY_LOW', label: 'Drone battery is low before mission' },
  { value: 'RADIO_SIGNAL_WEAK', label: 'Communication radio has weak signal' },
  { value: 'WILDLIFE_RESCUE_URGENT', label: 'Urgent wildlife rescue deployment needed' },
  { value: 'OTHER', label: 'Other (enter custom details)' }
];

const SCENARIO_PROMPTS = {
  PATROL_VEHICLE_LOW_FUEL: 'Patrol vehicle fuel level is critically low and next patrol starts soon.',
  MEDICAL_KIT_RESTOCK: 'Medical kit inventory is below safe threshold and incident risk is rising.',
  DRONE_BATTERY_LOW: 'Mission drone battery health is low and flight time may be insufficient.',
  RADIO_SIGNAL_WEAK: 'Field communication radio signal is unstable in the assigned zone.',
  WILDLIFE_RESCUE_URGENT: 'High-priority wildlife rescue request requires immediate resource coordination.'
};

function AiInsights() {
  const navPt = useFixedNavOffsetClass();
  const [tab, setTab] = useState('semantic');

  const [semanticQuery, setSemanticQuery] = useState('');
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [semanticResults, setSemanticResults] = useState([]);

  const [resources, setResources] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [suggestingId, setSuggestingId] = useState(null);

  const [kycStatus, setKycStatus] = useState('VERIFIED');
  const [assetScenario, setAssetScenario] = useState('PATROL_VEHICLE_LOW_FUEL');
  const [customAssetDetails, setCustomAssetDetails] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuggestion, setActionSuggestion] = useState('');

  const formatActionSuggestion = (value) => {
    const raw = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

    return raw
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\r/g, '')
      .replace(/(\d+\.\s)/g, '\n$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const loadResources = useCallback(async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(Array.isArray(data) ? data.filter((r) => r.status !== 'ARCHIVED') : []);
    } catch {
      setResources([]);
    }
  }, []);

  useEffect(() => {
    if (tab === 'assignment' && resources.length === 0) {
      loadResources();
    }
  }, [tab, resources.length, loadResources]);

  const runSemanticSearch = async (event) => {
    event.preventDefault();
    if (!semanticQuery.trim()) return;
    setSemanticLoading(true);
    try {
      const result = await aiService.searchResources(semanticQuery.trim());
      setSemanticResults(Array.isArray(result) ? result : []);
    } finally {
      setSemanticLoading(false);
    }
  };

  const getSuggestionForResource = async (resourceId) => {
    setSuggestingId(resourceId);
    try {
      const result = await aiService.suggestStaffForResource(resourceId);
      setSuggestions((prev) => ({ ...prev, [resourceId]: result?.suggestion || 'No suggestion returned' }));
    } catch {
      setSuggestions((prev) => ({ ...prev, [resourceId]: 'Suggestion unavailable right now' }));
    } finally {
      setSuggestingId(null);
    }
  };

  const getActionSuggestion = async (event) => {
    event.preventDefault();

    const details = assetScenario === 'OTHER'
      ? customAssetDetails.trim()
      : (SCENARIO_PROMPTS[assetScenario] || 'General operational resource condition.');

    if (!details) {
      setActionSuggestion('Please provide details for the selected custom scenario.');
      return;
    }

    setActionLoading(true);
    try {
      const result = await aiService.suggestUserAction(kycStatus, details);
      setActionSuggestion(result?.suggestion || 'No action suggestion returned');
    } catch {
      setActionSuggestion('Unable to generate action suggestion at this time');
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { id: 'semantic', label: 'Semantic Discovery', icon: Search },
    { id: 'assignment', label: 'Intelligent Assignment', icon: UserCog },
    { id: 'action', label: 'Strategic Action', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-surface pb-16">
      <Navbar />

      <main className={`mx-auto max-w-7xl px-6 animate-fade-in ${navPt || 'mt-24'}`}>
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-black uppercase tracking-widest mb-4">
                <Brain size={14} />
                Cognitive Intelligence
            </div>
            <h1 className="text-5xl font-black text-text tracking-tighter mb-2">AI <span className="text-purple-600">Insights</span> Hub</h1>
            <p className="text-text-muted text-lg max-w-2xl font-medium">Leveraging state-of-the-art cohere models for operational optimization and strategic resource mapping.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-10 flex items-center gap-2 p-2 bg-white rounded-[24px] border border-border w-fit shadow-premium">
            {tabs.map(item => (
                <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`
                        flex items-center gap-3 px-6 py-3 rounded-[18px] text-sm font-black tracking-tight transition-all
                        ${tab === item.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105' : 'text-text-muted hover:bg-surface hover:text-text'}
                    `}
                >
                    <item.icon size={18} />
                    {item.label}
                </button>
            ))}
        </div>

        <section className="bg-white rounded-[40px] border border-border p-10 shadow-premium min-h-[600px] animate-slide-up">
          {tab === 'semantic' && (
            <div className="animate-fade-in">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-text mb-2">Discovery Engine</h2>
                <p className="text-text-muted font-medium">Find specific tools and assets using natural language search.</p>
              </div>

              <form onSubmit={runSemanticSearch} className="mb-12 flex items-center gap-4 bg-surface rounded-3xl border border-border p-4 shadow-inner focus-within:border-purple-300 transition-all">
                <div className="pl-2 text-purple-600">
                    <Sparkles size={24} />
                </div>
                <input
                  className="flex-1 bg-transparent py-2 px-2 text-xl font-medium text-text outline-none placeholder:text-text-muted"
                  placeholder="Ask for anything, e.g. 'unassigned drone in station alpha'"
                  value={semanticQuery}
                  onChange={(e) => setSemanticQuery(e.target.value)}
                />
                <button type="submit" disabled={semanticLoading} className="bg-purple-600 px-8 py-4 rounded-2xl text-white font-black hover:translate-y-[-2px] transition-all disabled:opacity-50 shadow-lg shadow-purple-200">
                  {semanticLoading ? <Loader2 className="animate-spin" size={24} /> : 'Search Universe'}
                </button>
              </form>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {semanticResults.length > 0 ? semanticResults.map((r) => (
                  <article key={r._id} className="group p-8 rounded-[32px] border border-border bg-white hover:border-purple-200 hover:shadow-2xl transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-6">
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest border border-purple-100">
                            {(r.type || '').replace(/_/g, ' ')}
                        </span>
                        <Package size={18} className="text-text-muted group-hover:text-purple-600 transition-colors" />
                    </div>
                    <h3 className="text-xl font-black text-text leading-tight mb-4 group-hover:text-purple-600 transition-colors">{r.description || 'Verified Asset'}</h3>
                    <div className="space-y-2 pt-4 border-t border-border">
                        <p className="text-xs font-bold text-text-muted flex items-center gap-2">
                             <Target size={14} className="text-purple-400" />
                             Location: {r.metadata?.location || 'Operational Hub'}
                        </p>
                        <p className="text-xs font-bold text-text-muted flex items-center gap-2">
                             <Shield size={14} className="text-purple-400" />
                             Serial: {r.metadata?.serialNumber || 'N/A'}
                        </p>
                    </div>
                  </article>
                )) : semanticQuery && !semanticLoading && (
                    <div className="col-span-full py-20 text-center">
                         <Search size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
                         <p className="text-lg font-black text-text-muted">No cognitive matches found in local inventory.</p>
                    </div>
                )}
              </div>
            </div>
          )}

          {tab === 'assignment' && (
            <div className="animate-fade-in">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-text mb-2">Resource Recommendations</h2>
                <p className="text-text-muted font-medium">AI analysis for matching the right personnel to field assets.</p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {resources.length > 0 ? resources.map((r) => (
                  <article key={r._id} className="p-8 rounded-[40px] border border-border bg-surface/30 hover:bg-white hover:border-primary/20 transition-all group">
                    <div className="mb-8 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                             <Package size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{(r.type || '').replace(/_/g, ' ')}</p>
                          <h3 className="text-xl font-black text-text tracking-tight group-hover:text-primary transition-colors">{r.description || 'Resource'}</h3>
                        </div>
                      </div>
                      <Zap size={20} className="text-amber-500 animate-pulse" />
                    </div>

                    <button
                      onClick={() => getSuggestionForResource(r._id)}
                      disabled={suggestingId !== null}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-primary text-primary font-black hover:bg-primary hover:text-white transition-all disabled:opacity-50 shadow-md shadow-primary/10 mb-6"
                    >
                      {suggestingId === r._id ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
                      Run Intelligent Matching
                    </button>

                    {suggestions[r._id] && (
                      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 animate-scale-in">
                        <p className="mb-2 text-xs font-black uppercase tracking-tighter text-primary">Strategic Rationale</p>
                        <p className="text-sm text-text font-medium leading-relaxed italic">"{typeof suggestions[r._id] === 'string' ? suggestions[r._id] : suggestions[r._id]?.reasoning || 'Recommendation validated.'}"</p>
                      </div>
                    )}
                  </article>
                )) : (
                    <div className="col-span-full py-20 text-center">
                         <Package size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
                         <p className="text-lg font-black text-text-muted">No eligible assets for intelligence mapping.</p>
                    </div>
                )}
              </div>
            </div>
          )}

          {tab === 'action' && (
            <div className="animate-fade-in grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                 <div>
                    <h2 className="text-2xl font-black text-text mb-2">Operational Scenario</h2>
                    <p className="text-text-muted font-medium">Simulate field conditions to get strategic advice.</p>
                </div>

                <form onSubmit={getActionSuggestion} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Member Authentication Level</label>
                        <select className="input-field" value={kycStatus} onChange={(e) => setKycStatus(e.target.value)}>
                            {KYC_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Field Condition</label>
                        <select className="input-field" value={assetScenario} onChange={(e) => setAssetScenario(e.target.value)}>
                            {ASSET_SCENARIO_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {assetScenario === 'OTHER' && (
                    <div className="animate-scale-in">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Custom Situational Details</label>
                        <textarea
                        className="input-field resize-none min-h-[140px]"
                        value={customAssetDetails}
                        onChange={(e) => setCustomAssetDetails(e.target.value)}
                        placeholder="Detail the specific operational anomaly..."
                        required
                        />
                    </div>
                    )}

                    {assetScenario !== 'OTHER' && (
                    <div className="p-4 rounded-2xl bg-surface border border-border text-xs font-bold text-text-muted italic flex items-center gap-3">
                        <Target size={16} className="text-primary" />
                        "{SCENARIO_PROMPTS[assetScenario]}"
                    </div>
                    )}

                    <button type="submit" disabled={actionLoading} className="w-full h-16 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 disabled:opacity-50">
                    {actionLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Execute Strategic Forecast'}
                    </button>
                </form>
              </div>

              <div className="bg-surface rounded-[32px] border border-border p-10 shadow-inner relative overflow-hidden min-h-[500px]">
                <div className="flex items-center gap-3 mb-8">
                     <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                     <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Intelligence Output</h3>
                </div>
                
                {!actionSuggestion ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                         <div className="w-20 h-20 rounded-full border-4 border-dashed border-text-muted mb-6" />
                         <p className="text-sm font-black uppercase tracking-widest text-text-muted">Awaiting Simulation Input</p>
                    </div>
                ) : (
                  <div className="space-y-6 animate-fade-in relative z-10">
                    {formatActionSuggestion(actionSuggestion)
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line, index) => {
                        const isHeading = /^(Approval Action:|Rationale:|Key information needed includes:|Maintenance or replacement plan:)/i.test(line);
                        const normalizedLine = line.replace(/^(\d+\.\s+)/, '• ');

                        return (
                        <p key={`${line}-${index}`} className={`${isHeading ? 'text-lg font-black text-text mt-8 border-l-4 border-rose-500 pl-4' : 'text-text-muted font-bold text-sm leading-relaxed pl-5'} transition-all hover:translate-x-1`}>
                            {normalizedLine}
                        </p>
                        );
                    })}
                  </div>
                )}
                <Bot className="absolute -bottom-20 -right-20 text-primary/5" size={240} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AiInsights;
