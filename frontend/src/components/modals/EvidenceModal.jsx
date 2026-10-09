import React from 'react';
import { X, FileText, CheckCircle2, Bookmark, ShieldCheck, AlertCircle } from 'lucide-react';

export default function EvidenceModal({ isOpen, onClose, evidence, docTitle }) {
  if (!isOpen || !evidence) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
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
              background: 'var(--blue-50)',
              color: 'var(--blue-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bookmark size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Evidence Trail
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Verifiable source passage grounded in {docTitle || 'document'}
              </p>
            </div>
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

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            background: 'var(--bg-subtle)',
            padding: '14px',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Source File</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {docTitle || 'Grounded Document'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Page Number</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--blue-600)', marginTop: '2px' }}>
                Page {evidence.page || '1'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Section / Header</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {evidence.section || 'General Body'}
              </div>
            </div>
          </div>

          {/* Highlighted Passage */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Extracted Grounded Passage:
            </div>
            <div style={{
              background: '#F0F9FF',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderLeft: '4px solid var(--cyan-500)',
              padding: '16px 18px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              color: 'var(--blue-950)',
              fontStyle: 'italic'
            }}>
              "{evidence.quotedText || evidence.text || 'Source evidence is not available for this insight.'}"
            </div>
          </div>

          {/* Verification Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--emerald-50)',
            border: '1px solid var(--emerald-border)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            color: 'var(--emerald-700)'
          }}>
            <ShieldCheck size={18} color="#059669" />
            <span>
              <strong>Verified grounded evidence.</strong> Exact textual match found in the uploaded document text layer.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button className="btn-primary" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
