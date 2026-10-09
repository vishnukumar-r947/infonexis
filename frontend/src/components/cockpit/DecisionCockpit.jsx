import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, Eye, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function DecisionCockpit({ cockpitData }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, NOW, NEXT, WATCH, RESOLVED

  const nowList = cockpitData?.now || [];
  const nextList = cockpitData?.next || [];
  const watchList = cockpitData?.watch || [];
  const resolvedList = cockpitData?.resolved || [];

  return (
    <div className="card-base" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--blue-700)',
              background: 'var(--blue-50)',
              padding: '2px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Signature Intelligence
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Continuous Prioritization</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            DECISION COCKPIT
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Dynamic operational triage: Things requiring attention right NOW, recommended NEXT, items to WATCH, and RESOLVED issues.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-subtle)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          {['ALL', 'NOW', 'NEXT', 'WATCH', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#FFFFFF' : 'transparent',
                color: activeTab === tab ? 'var(--blue-700)' : 'var(--text-muted)',
                fontWeight: activeTab === tab ? 700 : 500,
                border: activeTab === tab ? '1px solid var(--border-light)' : 'none',
                boxShadow: activeTab === tab ? 'var(--shadow-xs)' : 'none',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 4 Columns or Filtered Column */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeTab === 'ALL' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr',
        gap: '16px'
      }}>
        {/* NOW Column */}
        {(activeTab === 'ALL' || activeTab === 'NOW') && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: 800, fontSize: '0.82rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />
                <span>NOW (Immediate Action)</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#DC2626', background: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>
                {nowList.length}
              </span>
            </div>

            {nowList.map((item) => (
              <div key={item.id} style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                border: '1px solid #FECACA',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#991B1B' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#7F1D1D' }}>{item.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#991B1B', fontWeight: 600 }}>{item.source}</span>
                  <button
                    onClick={() => navigate(item.route)}
                    style={{
                      background: '#DC2626',
                      color: '#FFF',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Act
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NEXT Column */}
        {(activeTab === 'ALL' || activeTab === 'NEXT') && (
          <div style={{
            background: '#FFF7ED',
            border: '1px solid #FDBA74',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C2410C', fontWeight: 800, fontSize: '0.82rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EA580C', display: 'inline-block' }} />
                <span>NEXT (Upcoming Actions)</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C2410C', background: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>
                {nextList.length}
              </span>
            </div>

            {nextList.map((item) => (
              <div key={item.id} style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                border: '1px solid #FED7AA',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#9A3412' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#7C2D12' }}>{item.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9A3412', fontWeight: 600 }}>{item.source}</span>
                  <button
                    onClick={() => navigate(item.route)}
                    style={{
                      background: '#EA580C',
                      color: '#FFF',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WATCH Column */}
        {(activeTab === 'ALL' || activeTab === 'WATCH') && (
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1D4ED8', fontWeight: 800, fontSize: '0.82rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
                <span>WATCH (Monitoring)</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1D4ED8', background: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>
                {watchList.length}
              </span>
            </div>

            {watchList.map((item) => (
              <div key={item.id} style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                border: '1px solid #DBEAFE',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E40AF' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#1E3A8A' }}>{item.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#1E40AF', fontWeight: 600 }}>{item.source}</span>
                  <button
                    onClick={() => navigate(item.route)}
                    style={{
                      background: '#2563EB',
                      color: '#FFF',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESOLVED Column */}
        {(activeTab === 'ALL' || activeTab === 'RESOLVED') && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 800, fontSize: '0.82rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span>RESOLVED (Archived)</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857', background: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>
                {resolvedList.length}
              </span>
            </div>

            {resolvedList.map((item) => (
              <div key={item.id} style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                border: '1px solid #D1FAE5',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#065F46' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#064E3B' }}>{item.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#065F46', fontWeight: 600 }}>{item.source}</span>
                  <button
                    onClick={() => navigate(item.route)}
                    style={{
                      background: '#10B981',
                      color: '#FFF',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
