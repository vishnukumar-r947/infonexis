import React, { useState } from 'react';
import {
  FileText, AlertTriangle, ArrowRight, Bookmark, ChevronDown, ChevronUp,
  Sparkles, CheckCircle2, ShieldAlert, Clock, MessageSquare, Volume2
} from 'lucide-react';
import FreshnessBadge from '../badges/FreshnessBadge';
import AttentionScoreBadge from '../badges/AttentionScoreBadge';
import EvidenceModal from '../modals/EvidenceModal';

export default function InformationCard({ doc, onAskAI, onPlayAudio }) {
  const [whyOpen, setWhyOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const getPriorityBadgeClass = (p) => {
    switch (p?.toUpperCase()) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-normal';
    }
  };

  return (
    <div className="card-base card-hover" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Card Header: Title + Status Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--blue-50) 0%, var(--cyan-50) 100%)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--blue-700)',
            flexShrink: 0
          }}>
            <FileText size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {doc.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>Source: <strong>{doc.source}</strong></span>
              <span>&bull;</span>
              <span>{doc.date}</span>
              <span>&bull;</span>
              <span>{doc.size}</span>
            </div>
          </div>
        </div>

        {/* Badges: Demo/User Tag, Priority, Freshness, Attention Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {doc.isDemo || doc.userId === 'system' || !doc.userId ? (
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              background: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FDE68A',
              letterSpacing: '0.04em'
            }}>
              DEMO DATASET
            </span>
          ) : (
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0',
              letterSpacing: '0.04em'
            }}>
              USER INGESTED
            </span>
          )}
          <span className={getPriorityBadgeClass(doc.priority)}>
            {doc.priority}
          </span>
          <FreshnessBadge freshness={doc.freshness} note={doc.freshnessNote} />
          {doc.attentionScore && (
            <AttentionScoreBadge score={doc.attentionScore} breakdown={doc.attentionScoreBreakdown} />
          )}
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'var(--blue-50)',
            color: 'var(--blue-700)',
            padding: '2px 8px',
            borderRadius: '9999px',
            border: '1px solid var(--blue-100)'
          }}>
            Confidence: {doc.confidence}%
          </span>
        </div>
      </div>

      {/* Key Finding Box */}
      <div style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 14px'
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Key Intelligence Finding
        </div>
        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
          {doc.keyInsight}
        </p>
      </div>

      {/* Feature Upgrade #2: WHY THIS MATTERS (Expandable) */}
      <div style={{
        border: '1px solid rgba(37, 99, 235, 0.2)',
        borderRadius: 'var(--radius-sm)',
        background: '#FAF5FF'
      }}>
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: '10px 14px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#7C3AED" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5B21B6' }}>
              Why This Matters ({doc.whyItMatters?.length || 1} factors)
            </span>
          </div>
          {whyOpen ? <ChevronUp size={16} color="#7C3AED" /> : <ChevronDown size={16} color="#7C3AED" />}
        </button>

        {whyOpen && (
          <div style={{ padding: '0 14px 12px 14px', borderTop: '1px dashed rgba(124, 58, 237, 0.2)', paddingTop: '8px' }}>
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#4C1D95' }}>
              {doc.whyItMatters?.map((point, i) => (
                <li key={i}>{point}</li>
              )) || <li>Reason unavailable — verification required.</li>}
            </ul>
          </div>
        )}
      </div>

      {/* Issue & Recommended Action */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px',
        fontSize: '0.82rem'
      }}>
        {doc.issue && (
          <div style={{
            background: 'var(--red-50)',
            border: '1px solid var(--red-border)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--red-600)'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Detected Issue</div>
            <div style={{ marginTop: '2px', fontWeight: 500 }}>{doc.issue}</div>
          </div>
        )}

        {doc.recommendedAction && (
          <div style={{
            background: 'var(--emerald-50)',
            border: '1px solid var(--emerald-border)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--emerald-700)'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Recommended Next Step</div>
            <div style={{ marginTop: '2px', fontWeight: 500 }}>{doc.recommendedAction}</div>
          </div>
        )}
      </div>

      {/* Card Actions: View Evidence + Ask AI + Audio Summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-light)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {doc.evidence ? (
            <button
              className="btn-secondary"
              onClick={() => setEvidenceOpen(true)}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <Bookmark size={14} color="var(--blue-600)" />
              <span>View Evidence (Page {doc.evidence.page})</span>
            </button>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Source evidence unavailable
            </span>
          )}

          {doc.audioScript && onPlayAudio && (
            <button
              className="btn-secondary"
              onClick={() => onPlayAudio(doc.audioScript)}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              title="Listen to AI Audio Summary"
            >
              <Volume2 size={14} color="var(--cyan-600)" />
              <span>Audio Brief</span>
            </button>
          )}
        </div>

        {onAskAI && (
          <button
            className="btn-primary"
            onClick={() => onAskAI(doc)}
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
          >
            <MessageSquare size={14} />
            <span>Ask AI About This</span>
          </button>
        )}
      </div>

      {/* Evidence Trail Modal */}
      <EvidenceModal
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidence={doc.evidence}
        docTitle={doc.title}
      />
    </div>
  );
}
