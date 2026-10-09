import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Clock,
  Activity, ShieldCheck, UploadCloud, MessageSquare, Search,
  GitCompare, Layers, Bookmark, FileText, Check, HelpCircle
} from 'lucide-react';
import { INITIAL_INTELLIGENCE } from '../data/groundedIntelligence';
import { USER_ROLES } from '../config/constants';
import { intelligenceAPI } from '../services/api';
import DecisionCockpit from '../components/cockpit/DecisionCockpit';
import NextBestActionCard from '../components/cards/NextBestActionCard';
import InformationCard from '../components/cards/InformationCard';
import LineageModal from '../components/modals/LineageModal';
import SmartCompareModal from '../components/modals/SmartCompareModal';
import EvidenceModal from '../components/modals/EvidenceModal';

export default function OverviewPage() {
  const navigate = useNavigate();
  const [lineageOpen, setLineageOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  // Live intelligence overview state (health score, counts)
  const [healthData, setHealthData] = useState(INITIAL_INTELLIGENCE.health);
  const [cockpitData, setCockpitData] = useState(INITIAL_INTELLIGENCE.decisionCockpit);

  // User state
  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('infonexis_user');
      return stored ? JSON.parse(stored) : { firstName: 'Vishnu', role: 'analyst' };
    } catch {
      return { firstName: 'Vishnu', role: 'analyst' };
    }
  })();

  const currentRole = USER_ROLES.find((r) => r.id === currentUser.role) || USER_ROLES[7];

  // Load live data from backend on mount
  useEffect(() => {
    intelligenceAPI.getOverview()
      .then((res) => {
        if (res.data) {
          setHealthData((prev) => ({
            ...prev,
            score: res.data.healthScore ?? prev.score,
            criticalCount: res.data.criticalCount ?? prev.criticalCount,
            conflictsCount: res.data.conflictsCount ?? prev.conflictsCount,
            missingCount: res.data.missingCount ?? prev.missingCount,
            actionsPending: res.data.actionsPending ?? prev.actionsPending,
            totalDocuments: res.data.totalDocuments ?? prev.totalDocuments
          }));
        }
      })
      .catch(() => { /* offline — keep demo health data */ });

    intelligenceAPI.getDecisionCockpit()
      .then((res) => {
        if (res.data) setCockpitData(res.data);
      })
      .catch(() => { /* offline — keep demo cockpit */ });
  }, []);

  const { brief, nextBestAction, documents, lineage } = INITIAL_INTELLIGENCE;

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. WELCOME GREETING & ROLE-ADAPTIVE OVERVIEW */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'var(--blue-50)',
              color: 'var(--blue-700)',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              Role Focus: {currentRole.label}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              14 Verified Intelligence Conduit Sources Active
            </span>
          </div>

          <h1 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: 'var(--blue-950)',
            marginTop: '8px',
            lineHeight: 1.2
          }}>
            Good morning, {currentUser.firstName || 'Vishnu'}.
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px', maxWidth: '720px' }}>
            {currentRole.focus}. INFONEXIS continuously reconciles incoming memos, contracts, and directives to synthesize what matters, why it matters, and what to do next.
          </p>
        </div>

        {/* Quick Provenance Action */}
        <button
          className="btn-secondary"
          onClick={() => setLineageOpen(true)}
          style={{ padding: '10px 16px', fontSize: '0.84rem' }}
        >
          <Layers size={16} color="var(--blue-600)" />
          <span>View Lineage Trace</span>
        </button>
      </div>

      {/* 2. TODAY'S INTELLIGENCE BRIEF */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderLeft: '5px solid var(--blue-600)',
        borderRadius: 'var(--radius-md)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--blue-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              TODAY'S INTELLIGENCE BRIEF
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', fontWeight: 600 }}>
            <span style={{ color: '#DC2626' }}>🔴 {brief.attentionCount} Need Attention</span>
            <span style={{ color: '#2563EB' }}>🔵 {brief.changesCount} Changes Detected</span>
            <span style={{ color: '#D97706' }}>🟠 {brief.conflictsCount} Conflict Unresolved</span>
            <span style={{ color: '#059669' }}>🟢 {brief.actionsPending} Actions Pending</span>
          </div>
        </div>

        <div style={{
          marginTop: '12px',
          background: 'var(--bg-subtle)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <strong style={{ color: 'var(--blue-700)' }}>Top Priority Finding: </strong>
            {brief.headline}
          </div>
          <button
            onClick={() => navigate('/app/intelligence')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--blue-600)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Investigate</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. SIGNATURE DECISION COCKPIT */}
      <DecisionCockpit cockpitData={cockpitData} />

      {/* 4. FEATURE UPGRADE #38: NEXT BEST ACTION */}
      <NextBestActionCard
        action={nextBestAction}
        onAction={() => navigate('/app/actions')}
        onCompare={() => setCompareOpen(true)}
        onViewEvidence={() => setEvidenceOpen(true)}
      />

      {/* 5. INFORMATION HEALTH SCORE */}
      <div className="card-base" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              INFORMATION HEALTH & QUALITY
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Deterministic quality assessment of all connected conduit information
            </p>
          </div>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 900,
            color: '#059669',
            background: '#ECFDF5',
            padding: '4px 14px',
            borderRadius: '9999px',
            border: '1px solid #A7F3D0'
          }}>
            Overall Health: {healthData.overall}%
          </div>
        </div>

        {/* 5 Health Factor Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <span>Completeness</span>
              <span>{healthData.completeness}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '9999px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${healthData.completeness}%`, height: '100%', background: '#2563EB', borderRadius: '9999px' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <span>Consistency</span>
              <span style={{ color: '#D97706' }}>{healthData.consistency}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '9999px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${healthData.consistency}%`, height: '100%', background: '#D97706', borderRadius: '9999px' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <span>Freshness</span>
              <span>{healthData.freshness}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '9999px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${healthData.freshness}%`, height: '100%', background: '#059669', borderRadius: '9999px' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <span>Source Coverage</span>
              <span>{healthData.sourceCoverage}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '9999px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${healthData.sourceCoverage}%`, height: '100%', background: '#0891B2', borderRadius: '9999px' }} />
            </div>
          </div>

          <div style={{ background: '#FEF2F2', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid #FECACA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#DC2626' }}>
              <span>Unresolved Issues</span>
              <span>{healthData.unresolvedIssues} open</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#B91C1C', marginTop: '6px' }}>
              Requires calendar & tax resolution
            </div>
          </div>
        </div>
      </div>

      {/* 6. RECENT INTELLIGENT INFORMATION CARDS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              RECENT VERIFIED INFORMATION
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Structured with Priority, Confidence, Freshness, Why This Matters & Evidence Trail
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => navigate('/app/information')}
            style={{ fontSize: '0.8rem' }}
          >
            <span>View All Information</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {documents.slice(0, 2).map((doc) => (
            <InformationCard
              key={doc.id}
              doc={doc}
              onAskAI={() => navigate('/app/information')}
            />
          ))}
        </div>
      </div>

      {/* Modals for Overview Interactions */}
      <LineageModal
        isOpen={lineageOpen}
        onClose={() => setLineageOpen(false)}
        lineage={lineage}
      />

      <SmartCompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
      />

      <EvidenceModal
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidence={{
          page: 3,
          section: 'Section 4.1: Review Milestones',
          quotedText: 'The preliminary board review shall formally convene on October 20, 2026. All departmental expenditure reconciliations exceeding $250,000 must be finalized 72 hours prior.'
        }}
        docTitle="Quarterly Financial Board Directive.pdf"
      />
    </div>
  );
}
