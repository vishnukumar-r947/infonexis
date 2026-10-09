import React from 'react';
import { X, Copy, GitCompare, Archive, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function DuplicateModal({ isOpen, onClose, duplicateItem, onActionSelected }) {
  if (!isOpen || !duplicateItem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 660 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'var(--amber-50)',
              color: 'var(--amber-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Copy size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Duplicate Document Detected
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Near-identical files identified across workspace sources
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Original Document</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {duplicateItem.fileA}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>Older Revision</div>
            </div>

            <div style={{
              background: '#F0F9FF',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan-700)', textTransform: 'uppercase' }}>Potential Duplicate</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue-900)', marginTop: '4px' }}>
                {duplicateItem.fileB}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--blue-600)', fontWeight: 600, marginTop: '4px' }}>Newer Revision (Recommended)</div>
            </div>
          </div>

          {/* Similarity & Diff Metric */}
          <div style={{
            background: 'var(--amber-50)',
            border: '1px solid var(--amber-border)',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--amber-700)' }}>
                Similarity Match: {duplicateItem.similarity}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--amber-800)', fontWeight: 600 }}>Deterministic Semantic Hash</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--amber-900)' }}>
              <strong>Identified Delta:</strong> {duplicateItem.difference}
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-subtle)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)'
          }}>
            <strong>Safety Guarantee:</strong> INFONEXIS never automatically deletes user documents. You retain full control to archive or preserve both versions.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            className="btn-secondary"
            onClick={() => {
              if (onActionSelected) onActionSelected('keep_both');
              onClose();
            }}
          >
            Keep Both
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              if (onActionSelected) onActionSelected('archive_older');
              onClose();
            }}
          >
            <Archive size={14} />
            Archive Older (v1)
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              if (onActionSelected) onActionSelected('keep_newer');
              onClose();
            }}
          >
            <Check size={14} />
            Keep Newer (v2)
          </button>
        </div>
      </div>
    </div>
  );
}
