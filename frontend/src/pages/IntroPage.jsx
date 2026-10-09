import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Layers, BrainCircuit, Zap } from 'lucide-react';

const logoSrc = new URL('../assets/logo/infonexis.png', import.meta.url).href;

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 30%, #F0F9FF 0%, #F8FAFC 60%, #E2E8F0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: 620,
        width: '100%',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xl)',
        padding: '40px 36px',
        textAlign: 'center'
      }}>
        {/* Emblem */}
        <img
          src={logoSrc}
          alt="INFONEXIS"
          style={{ width: '72px', height: '72px', objectFit: 'contain' }}
        />

        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--blue-950)', marginTop: '16px' }}>
          Welcome to INFONEXIS
        </h1>
        <p style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--cyan-700)', marginTop: '2px' }}>
          Understand What Matters.
        </p>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: 1.6 }}>
          INFONEXIS transforms scattered documents, memos, and cloud feeds into prioritized, verified, explainable, and actionable understanding.
        </p>

        {/* 3 Core Value Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginTop: '24px',
          textAlign: 'left'
        }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--blue-900)' }}>
              1. Deep Understanding
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Identifies significance, not just summaries.
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--cyan-700)' }}>
              2. Evidence & Provenance
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Verifiable citations with exact page numbers.
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#059669' }}>
              3. Decisive Action
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Continuous Decision Cockpit & resolution history.
            </div>
          </div>
        </div>

        {/* CONNECT & CONTINUE BUTTON (Section 61) */}
        <button
          className="btn-cyan"
          onClick={() => navigate('/app/overview')}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: 800,
            marginTop: '32px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <span>CONNECT & CONTINUE</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
