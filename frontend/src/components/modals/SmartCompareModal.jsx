import React, { useState, useEffect } from 'react';
import { X, GitCompare, CheckCircle2, AlertTriangle, ArrowRight, Layers, FileText } from 'lucide-react';
import { intelligenceAPI } from '../../services/api';

export default function SmartCompareModal({ isOpen, onClose, docIdA, docIdB }) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, COMMON, CHANGED, CONFLICT, MISSING, IMPACT
  const [liveComparison, setLiveComparison] = useState(null);

  useEffect(() => {
    if (isOpen) {
      intelligenceAPI.compareDocuments({ docIdA, docIdB })
        .then((res) => {
          if (res.data) setLiveComparison(res.data);
        })
        .catch(() => { /* keep grounded default */ });
    }
  }, [isOpen, docIdA, docIdB]);

  if (!isOpen) return null;

  const docATitle = liveComparison?.docA?.title || 'Financial Directive';
  const docBTitle = liveComparison?.docB?.title || 'Operations Memo v2';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
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
                Smart Comparison
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cross-Source Intelligence Diff</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {docATitle} vs {docBTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Tabs */}
        <div style={{
          padding: '12px 24px',
          background: 'var(--bg-subtle)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {['ALL', 'COMMON', 'CHANGED', 'CONFLICT', 'MISSING', 'IMPACT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#FFFFFF' : 'transparent',
                color: activeTab === tab ? 'var(--blue-700)' : 'var(--text-muted)',
                fontWeight: activeTab === tab ? 700 : 500,
                border: activeTab === tab ? '1px solid var(--border-light)' : 'none',
                boxShadow: activeTab === tab ? 'var(--shadow-xs)' : 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* COMMON SECTION */}
          {(activeTab === 'ALL' || activeTab === 'COMMON') && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 800, fontSize: '0.82rem', marginBottom: '8px' }}>
                <CheckCircle2 size={16} />
                <span>COMMON (Points of Agreement)</span>
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.84rem', color: '#14532D', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Both documents mandate full Q4 infrastructure and financial audit compliance.</li>
                <li>Both establish strict oversight on external vendor service-level agreements.</li>
                <li>Both designate cloud computing as the primary delivery envelope for 2027.</li>
              </ul>
            </div>
          )}

          {/* CHANGED SECTION */}
          {(activeTab === 'ALL' || activeTab === 'CHANGED') && (
            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E40AF', fontWeight: 800, fontSize: '0.82rem', marginBottom: '8px' }}>
                <Layers size={16} />
                <span>CHANGED (Version Adjustments)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', border: '1px solid #DBEAFE', fontSize: '0.84rem' }}>
                  <div style={{ fontWeight: 700, color: '#1E3A8A' }}>Review Date Milestone</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', color: '#334155' }}>
                    <span style={{ textDecoration: 'line-through', color: '#94A3B8' }}>15 Oct (Initial Draft)</span>
                    <ArrowRight size={14} color="#2563EB" />
                    <span style={{ fontWeight: 700, color: '#1D4ED8' }}>20 Oct (Directive) vs 25 Oct (Memo)</span>
                    <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>(+5 days delta)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONFLICT SECTION */}
          {(activeTab === 'ALL' || activeTab === 'CONFLICT') && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991B1B', fontWeight: 800, fontSize: '0.82rem', marginBottom: '8px' }}>
                <AlertTriangle size={16} />
                <span>CONFLICT (Contradictory Clauses)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', border: '1px solid #FCA5A5' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626' }}>Source A: Board Directive</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>Review Date: October 20, 2026</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>Status: Marked Authoritative by CFO</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', border: '1px solid #FCA5A5' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626' }}>Source B: Operations Memo v2</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>Review Date: October 25, 2026</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>Status: Operations committee internal draft</div>
                </div>
              </div>
            </div>
          )}

          {/* MISSING SECTION */}
          {(activeTab === 'ALL' || activeTab === 'MISSING') && (
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400E', fontWeight: 800, fontSize: '0.82rem', marginBottom: '8px' }}>
                <span>MISSING (Existed in One Source, Omitted in Another)</span>
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.84rem', color: '#78350F', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Depreciation schedule breakdown attached to Directive is completely omitted from Operations Memo.</li>
                <li>DevOps hiring headcount figures from Memo are not accounted for in Board financial forecast.</li>
              </ul>
            </div>
          )}

          {/* IMPACT SECTION */}
          {(activeTab === 'ALL' || activeTab === 'IMPACT') && (
            <div style={{
              background: '#FAF5FF',
              border: '1px solid #E9D5FF',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B21A8', fontWeight: 800, fontSize: '0.82rem', marginBottom: '8px' }}>
                <span>IMPACT (Why This Matters)</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#581C87', lineHeight: 1.5 }}>
                The 5-day divergence directly impairs European regulatory compliance filings which carry statutory non-disclosure fines if submitted past October 22.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button className="btn-secondary" onClick={onClose}>
            Close Compare
          </button>
          <button className="btn-primary" onClick={onClose}>
            Acknowledge Discrepancies
          </button>
        </div>
      </div>
    </div>
  );
}
