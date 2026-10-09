import React from 'react';
import { X, GitCommit, CheckCircle2, ArrowDown, Database, Cpu, Search, AlertTriangle, Zap, Check } from 'lucide-react';

export default function LineageModal({ isOpen, onClose, lineage = [] }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 740 }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Information Lineage Trail
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              End-to-end traceable intelligence provenance: Source → Extract → Prioritize → Act
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Lineage Flow */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lineage.map((item, index) => (
            <React.Fragment key={index}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: index === lineage.length - 1 ? 'var(--emerald-50)' : 'var(--blue-50)',
                  border: `1px solid ${index === lineage.length - 1 ? 'var(--emerald-border)' : 'var(--blue-100)'}`,
                  color: index === lineage.length - 1 ? 'var(--emerald-600)' : 'var(--blue-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--cyan-700)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}>
                      {item.step}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {item.timestamp}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                    {item.detail}
                  </div>
                </div>
              </div>

              {index < lineage.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-2px 0' }}>
                  <ArrowDown size={14} color="#94A3B8" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
