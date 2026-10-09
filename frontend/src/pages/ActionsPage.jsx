import React, { useState, useEffect } from 'react';
import {
  CheckSquare, Clock, AlertTriangle, ArrowRight, CheckCircle2,
  Filter, Calendar, ChevronRight, Sparkles, User, Tag, Plus, Check, X
} from 'lucide-react';
import { INITIAL_INTELLIGENCE } from '../data/groundedIntelligence';
import { actionsAPI, intelligenceAPI } from '../services/api';
import NextBestActionCard from '../components/cards/NextBestActionCard';
import SmartCompareModal from '../components/modals/SmartCompareModal';
import EvidenceModal from '../components/modals/EvidenceModal';

export default function ActionsPage() {
  const [tasks, setTasks] = useState(INITIAL_INTELLIGENCE.actions);
  const [nextBestAction, setNextBestAction] = useState(INITIAL_INTELLIGENCE.nextBestAction);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, Pending, In Progress, Completed
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const [liveResolutionHistory, setLiveResolutionHistory] = useState(INITIAL_INTELLIGENCE.resolutionHistory);

  // Load live actions and next-best-action from backend
  useEffect(() => {
    actionsAPI.getActions()
      .then((res) => {
        const liveActions = res.data;
        if (Array.isArray(liveActions) && liveActions.length > 0) {
          // Merge backend actions with demo data, deduplicate by id
          const ids = new Set(liveActions.map((a) => a.id));
          const merged = [
            ...liveActions,
            ...INITIAL_INTELLIGENCE.actions.filter((a) => !ids.has(a.id))
          ];
          setTasks(merged);
        }
      })
      .catch(() => { /* offline — keep demo data */ });

    intelligenceAPI.getNextBestAction()
      .then((res) => {
        if (res.data) setNextBestAction(res.data);
      })
      .catch(() => { /* offline — keep demo data */ });

    // Fetch live resolution history
    intelligenceAPI.getResolutionHistory()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLiveResolutionHistory(res.data);
        }
      })
      .catch(() => { /* offline — keep demo history */ });
  }, []);

  const filterTasks = tasks.filter((t) => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
  });

  const updateTaskStatus = async (id, newStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    // Persist to backend (non-blocking)
    try {
      await actionsAPI.updateAction(id, { status: newStatus });
    } catch {
      // Backend offline — local state already updated
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await actionsAPI.deleteAction(id);
    } catch {
      // Backend offline — optimistic removal already applied
    }
  };

  const showActionNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3500);
  };

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. HEADER */}
      <div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--blue-950)' }}>
          Action Intelligence & Resolution Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
          Actions automatically generated from detected contradictions, missing items, and upcoming deadlines.
        </p>
      </div>

      {/* 2. NEXT BEST ACTION (Feature Upgrade #38) */}
      <NextBestActionCard
        action={nextBestAction}
        onAction={() => showActionNotice('Calendar Alignment draft initialized — check your Actions queue.')}
        onCompare={() => setCompareModalOpen(true)}
        onViewEvidence={() => setEvidenceModalOpen(true)}
      />

      {/* 3. ACTION CENTER TASKS */}
      <div className="card-base" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Action Queue ({filterTasks.length})
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Prioritized operational actions linked directly to source documents and issues
            </p>
          </div>

          {actionNotice && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '8px 14px', borderRadius: '8px', color: '#065F46', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} />
              {actionNotice}
            </div>
          )}

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-subtle)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
            {['ALL', 'Pending', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  background: filterStatus === status ? '#FFFFFF' : 'transparent',
                  color: filterStatus === status ? 'var(--blue-700)' : 'var(--text-muted)',
                  fontWeight: filterStatus === status ? 700 : 500,
                  border: filterStatus === status ? '1px solid var(--border-light)' : 'none',
                  boxShadow: filterStatus === status ? 'var(--shadow-xs)' : 'none',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Action Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filterTasks.map((item) => (
            <div
              key={item.id}
              style={{
                background: item.status === 'Completed' ? '#F8FAFC' : '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: item.priority === 'CRITICAL' ? '#FEF2F2' : item.priority === 'HIGH' ? '#FFF7ED' : '#EFF6FF',
                    color: item.priority === 'CRITICAL' ? '#DC2626' : item.priority === 'HIGH' ? '#C2410C' : '#2563EB',
                    border: item.priority === 'CRITICAL' ? '1px solid #FECACA' : '1px solid #FED7AA'
                  }}>
                    {item.priority}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Source: <strong>{item.source}</strong>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>
                    &bull; Due: {item.deadline}
                  </span>
                </div>

                <div style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: item.status === 'Completed' ? '#94A3B8' : 'var(--text-primary)',
                  textDecoration: item.status === 'Completed' ? 'line-through' : 'none',
                  marginTop: '6px'
                }}>
                  {item.task}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Reason:</strong> {item.reason}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {item.status !== 'In Progress' && item.status !== 'Completed' && (
                  <button
                    className="btn-secondary"
                    onClick={() => updateTaskStatus(item.id, 'In Progress')}
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    Start Work
                  </button>
                )}

                {item.status !== 'Completed' ? (
                  <button
                    className="btn-primary"
                    onClick={() => updateTaskStatus(item.id, 'Completed')}
                    style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                  >
                    <Check size={14} />
                    <span>Complete</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>
                    <CheckCircle2 size={16} />
                    <span>Resolved</span>
                  </div>
                )}

                <button
                  onClick={() => deleteTask(item.id)}
                  title="Remove action"
                  style={{ background: 'none', border: '1px solid #FECACA', borderRadius: '6px', color: '#DC2626', cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RESOLUTION MEMORY SECTION */}
      <div className="card-base" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Resolution History & Memory
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Preserves original issue, source, evidence, and exact resolution rationale.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
          {liveResolutionHistory.map((h, idx) => (
            <div key={h.id || idx} style={{
              background: 'var(--bg-subtle)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, color: 'var(--blue-900)' }}>
                <span>{h.issueTitle}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.resolvedAt}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <strong>Resolution Applied:</strong> {h.resolution} ({h.resolutionSource})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <SmartCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        evidence={{
          page: 3,
          section: 'Section 4.1',
          quotedText: 'The preliminary board review shall formally convene on October 20, 2026.'
        }}
        docTitle="Financial Board Directive"
      />
    </div>
  );
}
