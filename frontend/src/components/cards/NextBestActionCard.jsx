import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Zap, Eye, GitCompare } from 'lucide-react';

export default function NextBestActionCard({ action, onAction, onCompare, onViewEvidence }) {
  if (!action) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F2756 0%, #1E3A8A 50%, #0E7490 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-lg), 0 0 20px rgba(6, 182, 212, 0.25)',
      border: '1px solid rgba(34, 211, 238, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Accent Background Glow */}
      <div style={{
        position: 'absolute',
        top: -40,
        right: -40,
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(34, 211, 238, 0.2)',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              color: '#67E8F9',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              NEXT BEST ACTION
            </span>
            <span style={{ fontSize: '0.75rem', color: '#93C5FD' }}>Deadline: {action.deadline}</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            {action.title}
          </h2>
        </div>

        <span style={{
          background: 'rgba(239, 68, 68, 0.25)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#FECACA',
          fontSize: '0.74rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '9999px'
        }}>
          Priority: {action.priority}
        </span>
      </div>

      {/* Why & Impact Box */}
      <div style={{
        marginTop: '16px',
        background: 'rgba(10, 25, 47, 0.45)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-sm)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ fontSize: '0.86rem', color: '#E2E8F0', lineHeight: 1.5 }}>
          <strong>Why:</strong> {action.why}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.4 }}>
          <strong>Operational Impact:</strong> {action.impact}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        marginTop: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          onClick={onAction}
          className="btn-cyan"
          style={{ fontSize: '0.88rem', padding: '10px 20px', fontWeight: 700 }}
        >
          <Zap size={16} />
          <span>{action.primaryActionLabel}</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {onCompare && (
            <button
              onClick={onCompare}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <GitCompare size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Compare Sources
            </button>
          )}

          {onViewEvidence && (
            <button
              onClick={onViewEvidence}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Eye size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              View Evidence
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
