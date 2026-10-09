import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, Sparkles } from 'lucide-react';

export default function AttentionScoreBadge({ score = 85, breakdown = [] }) {
  const [open, setOpen] = useState(false);

  const getScoreColor = (s) => {
    if (s >= 80) return { bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' };
    if (s >= 65) return { bg: '#FFF7ED', text: '#C2410C', border: '#FDBA74' };
    return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
  };

  const style = getScoreColor(score);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        title="Information Attention Score"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: style.bg,
          color: style.text,
          border: `1px solid ${style.border}`,
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <Sparkles size={13} />
        <span>Attention: {score}/100</span>
        <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 100,
          width: '280px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-lg)',
          padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Attention Factor Breakdown
            </span>
            <span style={{ fontSize: '0.72rem', color: style.text, fontWeight: 800 }}>
              {score} pts
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {breakdown.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                borderBottom: '1px dashed #F1F5F9',
                paddingBottom: '4px'
              }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--blue-700)' }}>+{item.points}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Calculated deterministically based on urgency, conflict, freshness, and impact.
          </div>
        </div>
      )}
    </div>
  );
}
