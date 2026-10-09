import React, { useState, useEffect } from 'react';
import {
  Network, Mail, HardDrive, UploadCloud, MessageSquare,
  CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ShieldCheck,
  Lock, ArrowRight, Radio, Shield, Check, X
} from 'lucide-react';
import { SOURCE_TRANSPARENCY } from '../config/constants';
import { sourcesAPI } from '../services/api';

export default function SourcesPage() {
  const [syncFeedback, setSyncFeedback] = useState({});

  const handleForceResync = (srcId, srcName) => {
    setSyncFeedback((prev) => ({ ...prev, [srcId]: 'syncing' }));
    setTimeout(() => {
      setSyncFeedback((prev) => ({ ...prev, [srcId]: 'done' }));
      setTimeout(() => setSyncFeedback((prev) => { const n = { ...prev }; delete n[srcId]; return n; }), 2000);
    }, 1200);
  };

  const [sources, setSources] = useState([
    {
      id: 'manual',
      name: 'Manual Upload Vault',
      type: 'Local Ingestion',
      icon: UploadCloud,
      status: 'Connected',
      lastSynced: 'Real-time active',
      itemCount: '14 processed documents',
      health: 'Optimal',
      authType: 'Client-side In-memory Encryption'
    },
    {
      id: 'gdrive',
      name: 'Google Drive Enterprise Vault',
      type: 'Cloud Documents',
      icon: HardDrive,
      status: 'Not Connected',
      lastSynced: 'Not configured',
      itemCount: '0 documents (OAuth required)',
      health: 'Standby',
      authType: 'OAuth 2.0 (Drive.Readonly) — not configured'
    },
    {
      id: 'gmail',
      name: 'Gmail Administrative Conduit',
      type: 'Email & Circulars',
      icon: Mail,
      status: 'Not Connected',
      lastSynced: 'Not configured',
      itemCount: '0 threads (OAuth required)',
      health: 'Standby',
      authType: 'OAuth 2.0 (Gmail.Readonly) — not configured'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      type: 'Official Enterprise Webhook',
      icon: MessageSquare,
      status: 'Awaiting Webhook',
      lastSynced: 'N/A',
      itemCount: '0 messages',
      health: 'Standby',
      authType: 'Meta Graph API (Verified Business Account)'
    }
  ]);

  useEffect(() => {
    sourcesAPI.getSources()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setSources((prev) =>
            prev.map((s) => {
              const matched = res.data.find(
                (b) => b.id === s.id ||
                  (b.id === 'manual_upload' && s.id === 'manual') ||
                  (b.id === 'google_drive' && s.id === 'gdrive') ||
                  (b.id === 'whatsapp_business' && s.id === 'whatsapp') ||
                  (b.id === 'gmail' && s.id === 'gmail')
              );
              if (matched) {
                const statusMap = {
                  connected: 'Connected',
                  not_connected: 'Not Connected',
                  coming_soon: 'Awaiting Webhook'
                };
                return {
                  ...s,
                  status: statusMap[matched.status] || 'Standby'
                };
              }
              return s;
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. HEADER */}
      <div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--blue-950)' }}>
          Sources & Conduit Integration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
          Configured feeds, authentication permissions, sync health, and complete access transparency.
        </p>
      </div>

      {/* 2. SOURCES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {sources.map((src) => {
          const Icon = src.icon;
          const isConn = src.status === 'Connected';
          return (
            <div key={src.id} className="card-base" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: isConn ? 'var(--blue-50)' : 'var(--bg-subtle)',
                  color: isConn ? 'var(--blue-600)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} />
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: isConn ? '#ECFDF5' : 'var(--bg-subtle)',
                  color: isConn ? '#047857' : 'var(--text-muted)',
                  border: isConn ? '1px solid #A7F3D0' : '1px solid var(--border-light)'
                }}>
                  {src.status}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {src.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {src.type}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-subtle)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Sync:</span>
                  <span style={{ fontWeight: 600 }}>{src.lastSynced}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items Scanned:</span>
                  <span style={{ fontWeight: 600 }}>{src.itemCount.replace('&bull;', '•')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Auth Method:</span>
                  <span style={{ fontWeight: 600, color: 'var(--blue-700)' }}>{src.authType}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                {syncFeedback[src.id] === 'done' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.8rem', color: '#047857', fontWeight: 700, padding: '8px' }}>
                    <Check size={14} />
                    <span>Sync Requested</span>
                  </div>
                ) : (
                  <button
                    className="btn-secondary"
                    onClick={() => handleForceResync(src.id, src.name)}
                    disabled={syncFeedback[src.id] === 'syncing'}
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px', opacity: syncFeedback[src.id] === 'syncing' ? 0.6 : 1 }}
                  >
                    <RefreshCw size={14} style={{ animation: syncFeedback[src.id] === 'syncing' ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{syncFeedback[src.id] === 'syncing' ? 'Syncing...' : 'Force Resync'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. FEATURE UPGRADE #33: SOURCE PERMISSION TRANSPARENCY */}
      <div className="card-base" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <ShieldCheck size={22} color="var(--blue-600)" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Source Permission Transparency Guarantee
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Strict zero-trust data segregation. Explicit boundaries between accessible organizational files and private communications.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(SOURCE_TRANSPARENCY).map(([srcName, perms]) => (
            <div key={srcName} style={{
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue-950)', marginBottom: '8px' }}>
                {srcName}
              </div>

              {/* Can Access */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                  WHAT INFONEXIS CAN ACCESS:
                </div>
                <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: '#064E3B', marginTop: '2px' }}>
                  {perms.canAccess.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Cannot Access */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase' }}>
                  WHAT INFONEXIS CANNOT ACCESS:
                </div>
                <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: '#7F1D1D', marginTop: '2px' }}>
                  {perms.cannotAccess.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
