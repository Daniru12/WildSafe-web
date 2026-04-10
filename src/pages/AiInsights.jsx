import React, { useCallback, useEffect, useState } from 'react';
import { Activity, Bot, Loader2, Package, Search, Sparkles, UserCog, Zap } from 'lucide-react';
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

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className={`mx-auto max-w-7xl px-6 ${navPt || 'mt-12'}`}>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
            <Bot size={42} className="text-purple-300" />
          </div>
          <div>
            <h1 className="text-4xl font-black">Cohere AI Insights</h1>
            <p className="text-text-muted">Dedicated AI page for semantic search, smart staff assignment, and action suggestion.</p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: 'semantic', label: 'Semantic Search', icon: Search },
            { id: 'assignment', label: 'Staff Suggestion', icon: UserCog },
            { id: 'action', label: 'Action Suggestion', icon: Activity }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${tab === item.id ? 'bg-purple-600 text-white' : 'border border-white/10 bg-surface/30 text-text-muted hover:text-white'}`}
            >
              <span className="inline-flex items-center gap-2"><item.icon size={15} /> {item.label}</span>
            </button>
          ))}
        </div>

        <section className="glass-morphism rounded-2xl border border-white/10 p-6">
          {tab === 'semantic' && (
            <div>
              <form onSubmit={runSemanticSearch} className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-surface/40 p-3">
                <Sparkles size={16} className="text-purple-300" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Describe resource you need"
                  value={semanticQuery}
                  onChange={(e) => setSemanticQuery(e.target.value)}
                />
                <button type="submit" disabled={semanticLoading} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  {semanticLoading ? 'Searching...' : 'Search'}
                </button>
              </form>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {semanticResults.map((r) => (
                  <article key={r._id} className="rounded-xl border border-white/10 bg-surface/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-text-muted">{(r.type || '').replace(/_/g, ' ')}</p>
                    <h3 className="mt-1 text-lg font-bold">{r.metadata?.serialNumber || r.description || 'Resource'}</h3>
                    <p className="mt-2 text-sm text-text-muted">{r.description || 'No description'}</p>
                    <p className="mt-3 text-xs text-purple-300">Location: {r.metadata?.location || 'Unknown'}</p>
                  </article>
                ))}
                {!semanticLoading && semanticQuery && semanticResults.length === 0 && (
                  <p className="col-span-full text-sm text-text-muted">No semantic matches found.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'assignment' && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {resources.map((r) => (
                <article key={r._id} className="rounded-xl border border-white/10 bg-surface/30 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-text-muted">{(r.type || '').replace(/_/g, ' ')}</p>
                      <h3 className="text-lg font-bold">{r.description || 'Resource'}</h3>
                    </div>
                    <Package size={18} className="text-primary" />
                  </div>
                  <p className="mb-3 text-xs text-text-muted">Serial: {r.metadata?.serialNumber || 'N/A'}</p>

                  <button
                    onClick={() => getSuggestionForResource(r._id)}
                    disabled={suggestingId !== null}
                    className="mb-3 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-sm font-semibold text-indigo-300 disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-1">
                      {suggestingId === r._id ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                      Suggest Staff
                    </span>
                  </button>

                  {suggestions[r._id] && (
                    <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm text-text-muted">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-300">AI Suggestion</p>
                      <p>{typeof suggestions[r._id] === 'string' ? suggestions[r._id] : suggestions[r._id]?.reasoning || 'Suggestion generated'}</p>
                    </div>
                  )}
                </article>
              ))}
              {resources.length === 0 && <p className="text-sm text-text-muted">No active resources available.</p>}
            </div>
          )}

          {tab === 'action' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <form onSubmit={getActionSuggestion} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-muted">KYC Status</label>
                  <select className="input-field" value={kycStatus} onChange={(e) => setKycStatus(e.target.value)}>
                    {KYC_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-text-muted">Asset Situation</label>
                  <select className="input-field" value={assetScenario} onChange={(e) => setAssetScenario(e.target.value)}>
                    {ASSET_SCENARIO_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {assetScenario === 'OTHER' && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-muted">Enter Custom Details</label>
                    <textarea
                      className="input-field resize-none"
                      rows={4}
                      value={customAssetDetails}
                      onChange={(e) => setCustomAssetDetails(e.target.value)}
                      placeholder="Describe your custom situation"
                      required
                    />
                  </div>
                )}

                {assetScenario !== 'OTHER' && (
                  <p className="rounded-lg border border-white/10 bg-surface/30 p-3 text-xs text-text-muted">
                    Selected scenario details: {SCENARIO_PROMPTS[assetScenario]}
                  </p>
                )}

                <p className="text-xs text-text-muted">No key typing needed. Select options and generate action suggestion.</p>

                <button type="submit" disabled={actionLoading} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                  {actionLoading ? 'Generating...' : 'Generate Action'}
                </button>
              </form>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">Suggested Output</p>
                {!actionSuggestion && <p className="text-sm text-text-muted">Awaiting input.</p>}
                {actionSuggestion && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-white/90">
                    <div className="space-y-2">
                      {formatActionSuggestion(actionSuggestion)
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, index) => {
                          const isHeading = /^(Approval Action:|Rationale:|Key information needed includes:|Maintenance or replacement plan:)/i.test(line);
                          const normalizedLine = line.replace(/^(\d+\.\s+)/, '• ');

                          return (
                            <p key={`${line}-${index}`} className={isHeading ? 'font-semibold text-white' : 'text-white/90'}>
                              {normalizedLine}
                            </p>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AiInsights;
