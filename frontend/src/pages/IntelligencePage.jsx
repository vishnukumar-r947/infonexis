import React, { useState, useEffect } from 'react';
import {
  BrainCircuit, AlertTriangle, HelpCircle, GitCompare, Share2,
  CheckCircle2, Info, ArrowRight, ShieldCheck, Check, Sparkles, Filter,
  Layers, Clock, Network, RefreshCw, Bookmark, User, Tag
} from 'lucide-react';
import { INITIAL_INTELLIGENCE } from '../data/groundedIntelligence';
import { intelligenceAPI } from '../services/api';
import EvidenceModal from '../components/modals/EvidenceModal';
import SmartCompareModal from '../components/modals/SmartCompareModal';
import LineageModal from '../components/modals/LineageModal';
import ConflictResolutionModal from '../components/modals/ConflictResolutionModal';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('CONTRADICTIONS'); // CONTRADICTIONS, MISSING, CHANGES, RELATIONSHIPS, RESOLUTION_MEMORY
  const [conflicts, setConflicts] = useState(INITIAL_INTELLIGENCE.conflicts);
  const [missingItems, setMissingItems] = useState(INITIAL_INTELLIGENCE.missingInfo);
  const [resolvedMemory, setResolvedMemory] = useState(INITIAL_INTELLIGENCE.resolutionHistory);
  const [liveChanges, setLiveChanges] = useState([]);
  const [requestNotice, setRequestNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [lineageModalOpen, setLineageModalOpen] = useState(false);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [activeConflictForResolution, setActiveConflictForResolution] = useState(null);

  // Load live intelligence data from backend on mount
  useEffect(() => {
    setIsLoading(true);
    Promise.allSettled([
      intelligenceAPI.detectConflicts(),
      intelligenceAPI.getMissingInfo(),
      intelligenceAPI.getResolutionHistory(),
      intelligenceAPI.getChanges()
    ]).then(([conflictsRes, missingRes, historyRes, changesRes]) => {
      if (conflictsRes.status === 'fulfilled') {
        const liveConflicts = conflictsRes.value?.data?.conflicts;
        if (Array.isArray(liveConflicts) && liveConflicts.length > 0) {
          const liveMap = new Map(liveConflicts.map((c) => [c.id, c]));
          const merged = INITIAL_INTELLIGENCE.conflicts.map((demo) => {
            const live = liveMap.get(demo.id);
            if (live) {
              return {
                ...demo,
                ...live,
                sourceA: { ...demo.sourceA, ...live.sourceA },
                sourceB: { ...demo.sourceB, ...live.sourceB },
                status: live.status === 'resolved' || live.status === 'Resolved' ? 'Resolved' : demo.status
              };
            }
            return demo;
          });
          const demoIds = new Set(INITIAL_INTELLIGENCE.conflicts.map((c) => c.id));
          const newLive = liveConflicts.filter((c) => !demoIds.has(c.id));
          setConflicts([...merged, ...newLive]);
        }
      }
      if (missingRes.status === 'fulfilled') {
        const liveMissing = missingRes.value?.data?.missing;
        if (Array.isArray(liveMissing) && liveMissing.length > 0) {
          const ids = new Set(liveMissing.map((m) => m.id));
          const merged = [
            ...liveMissing,
            ...INITIAL_INTELLIGENCE.missingInfo.filter((m) => !ids.has(m.id))
          ];
          setMissingItems(merged);
        }
      }
      if (historyRes.status === 'fulfilled') {
        const liveHistory = historyRes.value?.data;
        if (Array.isArray(liveHistory) && liveHistory.length > 0) {
          setResolvedMemory(liveHistory);
        }
      }
      if (changesRes.status === 'fulfilled') {
        const fetchedChanges = changesRes.value?.data;
        if (Array.isArray(fetchedChanges)) {
          setLiveChanges(fetchedChanges);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const handleOpenResolutionModal = (conflict) => {
    setActiveConflictForResolution(conflict);
    setResolutionModalOpen(true);
  };

  // User override action for conflicts — calls backend then updates local state
  const handleResolveConflict = async (conflictId, chosenSource, resolutionNote = 'Resolved via Intelligence Center', backendRecord = null) => {
    // Optimistic UI update
    setConflicts((prev) =>
      prev.map((c) => {
        if (c.id === conflictId) {
          const newResolvedRecord = backendRecord || {
            id: 'res-' + Date.now(),
            issueTitle: c.title,
            originalIssue: `${c.sourceA?.doc || ''} (${c.sourceA?.val || ''}) vs ${c.sourceB?.doc || ''} (${c.sourceB?.val || ''})`,
            source: chosenSource,
            evidence: resolutionNote || 'Reconciled via user override in Intelligence Center.',
            resolution: `User confirmed '${chosenSource}' as authoritative reference.`,
            resolvedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            resolutionSource: 'Manual User Override'
          };
          setResolvedMemory((m) => [newResolvedRecord, ...m]);
          return { ...c, status: 'Resolved', chosenSource, resolutionNote };
        }
        return c;
      })
    );

    // Persist to backend if not already sent by modal
    if (!backendRecord) {
      try {
        await intelligenceAPI.resolveIssue({ issueId: conflictId, chosenSource, resolutionNote });
      } catch {
        // Backend offline — local state already updated, acceptable
      }
    }
  };

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'var(--blue-50)',
              color: 'var(--blue-700)',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              INTELLIGENCE SYNTHESIS ENGINE
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--blue-950)', marginTop: '4px' }}>
            Deep Intelligence & Verification
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
            Multi-source contradiction intelligence, missing requirements, timeline lineage, and resolution memory.
          </p>
        </div>

        {/* Global Modal Triggers */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={() => setCompareModalOpen(true)}
            style={{ fontSize: '0.82rem' }}
          >
            <GitCompare size={15} color="var(--blue-600)" />
            <span>Smart Compare</span>
          </button>
          <button
            className="btn-secondary"
            onClick={() => setLineageModalOpen(true)}
            style={{ fontSize: '0.82rem' }}
          >
            <Layers size={15} color="var(--cyan-700)" />
            <span>Information Lineage</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div style={{
        display: 'flex',
        gap: '8px',
        background: '#FFFFFF',
        padding: '6px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xs)',
        overflowX: 'auto'
      }}>
        {[
          { id: 'CONTRADICTIONS', label: 'Contradiction Intelligence', count: conflicts.filter((c) => c.status !== 'Resolved' && c.status !== 'resolved').length },
          { id: 'MISSING', label: 'Missing Information', count: missingItems.length },
          { id: 'CHANGES', label: 'Timeline & Changes', count: INITIAL_INTELLIGENCE.changes.length },
          { id: 'RELATIONSHIPS', label: 'Knowledge Relationships', count: null },
          { id: 'RESOLUTION_MEMORY', label: 'Resolution History', count: resolvedMemory.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeTab === tab.id ? '1px solid var(--border-light)' : 'none',
              background: activeTab === tab.id ? 'var(--blue-50)' : 'transparent',
              color: activeTab === tab.id ? 'var(--blue-700)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span style={{
                fontSize: '0.68rem',
                background: activeTab === tab.id ? 'var(--blue-600)' : '#E2E8F0',
                color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. CONTRADICTION INTELLIGENCE (Feature Upgrade #8) */}
      {activeTab === 'CONTRADICTIONS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isLoading ? (
            <div className="card-base" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="spinner" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Scanning conduits for contradictions...</div>
            </div>
          ) : conflicts.length === 0 ? (
            <div className="card-base" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={40} color="#059669" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Zero Contradictions Detected
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 440 }}>
                All cross-document figures, milestone dates, and operational envelopes are aligned and verified.
              </p>
            </div>
          ) : (
            conflicts.map((conf) => {
              const isResolved = conf.status === 'Resolved' || conf.status === 'resolved';
              return (
                <div key={conf.id} className="card-base" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: isResolved ? 'var(--emerald-50)' : 'var(--red-50)',
                        color: isResolved ? '#059669' : '#DC2626',
                        border: `1px solid ${isResolved ? 'var(--emerald-border)' : 'var(--red-border)'}`,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }}>
                        {isResolved ? 'RESOLVED' : 'CONTRADICTION DETECTED'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Severity: <strong>{conf.severity}</strong>
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {conf.title}
                    </h3>
                  </div>

                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#991B1B',
                  background: '#FEF2F2',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #FECACA'
                }}>
                  Delta: {conf.delta}
                </div>
              </div>

              {/* Side-by-Side Comparison of Source A vs Source B */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                marginTop: '16px'
              }}>
                {/* Source A Card */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--blue-700)', textTransform: 'uppercase' }}>
                      SOURCE A
                    </span>
                    {conf.sourceA.isAuthoritative && (
                      <span style={{ fontSize: '0.68rem', background: '#ECFDF5', color: '#047857', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        Authoritative
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {conf.sourceA.doc}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue-900)', marginTop: '4px' }}>
                    Value: {conf.sourceA.val}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Timestamp: {conf.sourceA.date} ({conf.sourceA.freshness})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Citation: Page {conf.sourceA.page} ({conf.sourceA.section})
                  </div>
                </div>

                {/* Source B Card */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--cyan-700)', textTransform: 'uppercase' }}>
                      SOURCE B
                    </span>
                    <span style={{ fontSize: '0.68rem', background: '#EFF6FF', color: '#1D4ED8', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Draft Update
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {conf.sourceB.doc}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue-900)', marginTop: '4px' }}>
                    Value: {conf.sourceB.val}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Timestamp: {conf.sourceB.date} ({conf.sourceB.freshness})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Citation: Page {conf.sourceB.page} ({conf.sourceB.section})
                  </div>
                </div>
              </div>

              {/* Contradiction Analysis */}
              <div style={{
                marginTop: '16px',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                fontSize: '0.82rem'
              }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Which source is newer?</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{conf.newerSource}</div>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Which source is authoritative?</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{conf.authoritativeSource}</div>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Recommended Action:</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{conf.recommendedAction}</div>
                </div>
              </div>

              {/* Why This Matters */}
              <div style={{ marginTop: '14px', background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase' }}>
                  Why This Matters (Operational Impact)
                </div>
                <ul style={{ paddingLeft: '18px', marginTop: '4px', fontSize: '0.82rem', color: '#581C87', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(Array.isArray(conf.whyItMatters) ? conf.whyItMatters : [conf.whyItMatters].filter(Boolean)).map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* User Override & Resolution Buttons */}
              <div style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setActiveEvidence({
                      page: conf.sourceA.page,
                      section: conf.sourceA.section,
                      quotedText: `${conf.sourceA.doc} establishes review date as ${conf.sourceA.val}.`
                    });
                    setEvidenceModalOpen(true);
                  }}
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <Bookmark size={14} color="var(--blue-600)" />
                  <span>Inspect Source Evidence</span>
                </button>

                {!isResolved ? (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      className="btn-primary"
                      onClick={() => handleOpenResolutionModal(conf)}
                      style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={14} />
                      <span>Resolve Contradiction</span>
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => handleResolveConflict(conf.id, conf.sourceB?.doc || 'Source B', 'Quick override to Source B')}
                      style={{ fontSize: '0.78rem' }}
                    >
                      Quick Override ({conf.sourceB?.val || 'Source B'})
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.82rem', fontWeight: 700 }}>
                    <CheckCircle2 size={16} />
                    <span>Resolved & Archived to Memory ({conf.chosenSource})</span>
                  </div>
                )}
              </div>
            </div>
            );
          })
        )}
        </div>
      )}

      {/* 4. MISSING INFORMATION INTELLIGENCE (Feature Upgrade #9) */}
      {activeTab === 'MISSING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {missingItems.length === 0 ? (
            <div className="card-base" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={40} color="#059669" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Zero Missing Requirements
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 440 }}>
                All mandatory statutory clauses, annexures, and regulatory attachments have been verified and accounted for.
              </p>
            </div>
          ) : (
            missingItems.map((item) => (
            <div key={item.id} className="card-base" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{
                    background: '#FFFBEB',
                    color: '#B45309',
                    border: '1px solid #FDE68A',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}>
                    MISSING INFORMATION DETECTED
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {item.targetDoc}
                  </h3>
                </div>
                <span className={item.priority === 'HIGH' ? 'badge-high' : 'badge-medium'}>
                  {item.priority}
                </span>
              </div>

              {/* Expected vs Found */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px',
                marginTop: '14px'
              }}>
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>Expected Field</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#991B1B', marginTop: '2px' }}>
                    {item.expected}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Found Value</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                    {item.found}
                  </div>
                </div>
              </div>

              {/* Why This Matters */}
              <div style={{ marginTop: '12px', background: '#FAF5FF', border: '1px solid #E9D5FF', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase' }}>
                  Why It Matters
                </div>
                <div style={{ fontSize: '0.84rem', color: '#581C87', marginTop: '2px' }}>
                  {item.whyItMatters}
                </div>
              </div>

              {/* Suggested Next Step */}
              <div style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                    Suggested Next Step:
                  </span>
                  <span style={{ fontSize: '0.84rem', color: '#064E3B', fontWeight: 600, marginLeft: '6px' }}>
                    {item.suggestedNextStep}
                  </span>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setRequestNotice(`Request initiated for '${item.expected}'. Follow-up action logged.`);
                    setTimeout(() => setRequestNotice(''), 3500);
                  }}
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                >
                  Initiate Request
                </button>
              </div>
            </div>
          ))
        )}
        </div>
      )}

      {/* 5. TIMELINE & CHANGES (Feature Upgrade #36) */}
      {activeTab === 'CHANGES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {liveChanges.length === 0 ? (
            <div className="card-base" style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Clock size={22} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                No Document Revisions or Contradiction State Changes Recorded Yet
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: 460 }}>
                When document revisions, new version uploads, or resolution decisions occur in your workspace, the immutable audit trail will display here automatically.
              </p>
            </div>
          ) : (
            liveChanges.map((ch) => (
              <div key={ch.id} className="card-base" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="var(--blue-600)" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {ch.title || ch.item}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {ch.time || ch.timestamp} &bull; Source: <strong>{ch.source}</strong>
                  </span>
                </div>

                <div style={{
                  marginTop: '12px',
                  background: 'var(--bg-subtle)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  {ch.oldValue && (
                    <>
                      <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontWeight: 600 }}>
                        {ch.oldValue}
                      </span>
                      <ArrowRight size={14} color="var(--blue-600)" />
                    </>
                  )}
                  <span style={{ fontWeight: 800, color: 'var(--blue-800)', fontSize: '0.95rem' }}>
                    {ch.newValue}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>
                    {ch.field || ch.change || 'Update'}
                  </span>
                </div>

                {ch.changedBy && (
                  <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <strong>Actor / Source:</strong> {ch.changedBy}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. KNOWLEDGE RELATIONSHIPS (Feature Upgrade #35) */}
      {activeTab === 'RELATIONSHIPS' && (
        <div className="card-base" style={{ padding: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Knowledge & Conduit Relationships
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Lightweight semantic relationships connecting Projects, Documents, People, Issues, and Actions.
            </p>
          </div>

          {/* Interactive Relationship Diagram */}
          <div style={{
            marginTop: '18px',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {INITIAL_INTELLIGENCE.relationships.nodes.map((node) => (
                <div key={node.id} style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${node.color}40`,
                  borderLeft: `4px solid ${node.color}`,
                  padding: '12px 14px',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: node.color, textTransform: 'uppercase' }}>
                    {node.type}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {node.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px'
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Active Semantic Connections
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {INITIAL_INTELLIGENCE.relationships.links.map((link, idx) => {
                  const s = INITIAL_INTELLIGENCE.relationships.nodes.find((n) => n.id === link.source);
                  const t = INITIAL_INTELLIGENCE.relationships.nodes.find((n) => n.id === link.target);
                  return (
                    <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: s?.color }}>{s?.label}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '1px 6px', borderRadius: '4px' }}>
                        -- [{link.relation}] --&gt;
                      </span>
                      <span style={{ fontWeight: 700, color: t?.color }}>{t?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. RESOLUTION HISTORY (Feature Upgrade #43) */}
      {activeTab === 'RESOLUTION_MEMORY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {resolvedMemory.length === 0 ? (
            <div className="card-base" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Clock size={40} color="var(--blue-600)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                No Issue Resolutions Recorded Yet
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 440 }}>
                When contradictions or information gaps are reconciled, audit records appear here with full provenance and timestamping.
              </p>
            </div>
          ) : (
            resolvedMemory.map((item) => (
              <div key={item.id} className="card-base" style={{ padding: '20px', borderLeft: '4px solid #059669' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} color="#059669" />
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                        RESOLVED ISSUE MEMORY
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {item.issueTitle}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Resolved: {item.resolvedAt}
                  </span>
                </div>

                <div style={{
                  marginTop: '12px',
                  background: 'var(--bg-subtle)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div><strong>Original Issue:</strong> {item.originalIssue}</div>
                  <div><strong>Resolution Applied:</strong> {item.resolution}</div>
                  <div><strong>Resolution Authority:</strong> {item.resolutionSource}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        evidence={activeEvidence}
        docTitle="Contradiction Reference"
      />

      <SmartCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      <LineageModal
        isOpen={lineageModalOpen}
        onClose={() => setLineageModalOpen(false)}
        lineage={INITIAL_INTELLIGENCE.lineage}
      />

      <ConflictResolutionModal
        isOpen={resolutionModalOpen}
        onClose={() => {
          setResolutionModalOpen(false);
          setActiveConflictForResolution(null);
        }}
        conflict={activeConflictForResolution}
        onResolved={(id, source, note, record) => handleResolveConflict(id, source, note, record)}
      />
    </div>
  );
}
