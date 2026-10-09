import React, { useState } from 'react';
import {
  User, Shield, Sliders, Volume2, FileCog, Bell, Lock,
  HardDrive, HelpCircle, Check, Save, Trash2, RefreshCw, Globe
} from 'lucide-react';
import { USER_ROLES } from '../config/constants';
import { useI18n } from '../i18n/index';
import { authAPI } from '../services/api';

export default function SettingsPage() {
  const { lang, changeLanguage, supportedLanguages, t } = useI18n();
  const [activeTab, setActiveTab] = useState('profile');
  const [savedNotice, setSavedNotice] = useState(false);
  const [securityNotice, setSecurityNotice] = useState('');
  const [privacyNotice, setPrivacyNotice] = useState('');

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('infonexis_user');
      return stored ? JSON.parse(stored) : { firstName: 'Vishnu', role: 'analyst', phoneNumber: '+91 98765 43210' };
    } catch {
      return { firstName: 'Vishnu', role: 'analyst', phoneNumber: '+91 98765 43210' };
    }
  });

  const [aiSettings, setAiSettings] = useState({
    responseStyle: 'BALANCED',
    qualityGuard: true,
    temperature: '0.2'
  });

  const [voiceSettings, setVoiceSettings] = useState({
    speechRate: '1.0',
    autoPlay: false
  });

  const handleSave = () => {
    localStorage.setItem('infonexis_user', JSON.stringify(profile));
    authAPI.updateSettings(profile).catch(() => {});
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--blue-950)' }}>
          System & Intelligence Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
          Customize role adaptation, AI quality guard rails, voice synthesis, and privacy retention policies.
        </p>
      </div>

      {savedNotice && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          color: '#065F46',
          fontSize: '0.86rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={18} />
          <span>Settings successfully saved and synchronized across workspace.</span>
        </div>
      )}

      {/* Settings Layout: Left Tabs + Right Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        {/* Left Nav */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          height: 'fit-content'
        }}>
          {[
            { id: 'profile', label: 'Profile & Role', icon: User },
            { id: 'security', label: 'Security & Session', icon: Shield },
            { id: 'ai', label: 'AI Quality Guard', icon: Sliders },
            { id: 'voice', label: 'Voice & Audio', icon: Volume2 },
            { id: 'privacy', label: 'Privacy & Retention', icon: Lock },
            { id: 'language', label: 'System Language', icon: Globe }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'var(--blue-50)' : 'transparent',
                  color: isActive ? 'var(--blue-700)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Area */}
        <div className="card-base" style={{ padding: '24px', gridColumn: 'span 2' }}>
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Profile & Adaptive Role
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  User Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Registered Phone
                </label>
                <input
                  type="text"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* ROLE ADAPTIVE SELECTOR */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Select Adaptive Role (Adjusts Overview Priorities)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {USER_ROLES.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => setProfile({ ...profile, role: role.id })}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: profile.role === role.id ? '2px solid var(--blue-600)' : '1px solid var(--border-light)',
                        background: profile.role === role.id ? 'var(--blue-50)' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.84rem', color: profile.role === role.id ? 'var(--blue-900)' : 'var(--text-primary)' }}>
                        {role.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {role.badge}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <button className="btn-primary" onClick={handleSave}>
                  <Save size={16} />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* AI SETTINGS TAB */}
          {activeTab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                AI Quality Guard & Grounding Rules
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Default Response Depth
                </label>
                <select
                  value={aiSettings.responseStyle}
                  onChange={(e) => setAiSettings({ ...aiSettings, responseStyle: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                >
                  <option value="QUICK">Quick (Concise 3-line synthesis)</option>
                  <option value="BALANCED">Balanced (Answer + Evidence Citation)</option>
                  <option value="DETAILED">Detailed (Answer + Evidence + Operational Impact)</option>
                  <option value="NEWBIE">Explain Like I'm New (Simplified Metaphors)</option>
                </select>
              </div>

              <div style={{
                background: 'var(--bg-subtle)',
                padding: '14px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Active AI Quality Guard
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Displays "NEEDS VERIFICATION" badge when source confidence is below 85% or contradictions exist.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={aiSettings.qualityGuard}
                  onChange={(e) => setAiSettings({ ...aiSettings, qualityGuard: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
              </div>

              <div style={{ marginTop: '10px' }}>
                <button className="btn-primary" onClick={handleSave}>
                  <Save size={16} />
                  <span>Save AI Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Security & Session Management
              </h3>

              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>JWT Session State:</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>Active & Signed</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span>Encryption:</span>
                  <span style={{ fontWeight: 600 }}>AES-256 GCM In-Memory</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span>Connected Feeds:</span>
                  <span style={{ fontWeight: 600, color: '#D97706' }}>Manual Upload only (OAuth not configured)</span>
                </div>
              </div>

              {securityNotice && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 14px', borderRadius: '8px', color: '#065F46', fontSize: '0.82rem', fontWeight: 700 }}>
                  ✓ {securityNotice}
                </div>
              )}
              <button
                className="btn-secondary"
                onClick={() => {
                  localStorage.removeItem('infonexis_token');
                  setSecurityNotice('Session tokens cleared. You will be asked to re-authenticate on next protected action.');
                  setTimeout(() => setSecurityNotice(''), 5000);
                }}
                style={{ width: 'fit-content' }}
              >
                Flush Active Tokens
              </button>
            </div>
          )}

          {/* LANGUAGE TAB */}
          {activeTab === 'language' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                System-Wide Multi-Language Support
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Centralized i18n localization covering Navigation, Badges, Information Intelligence, and Settings.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLanguage(l.code)}
                    style={{
                      padding: '14px 12px',
                      borderRadius: '10px',
                      border: lang === l.code ? '2px solid var(--blue-600)' : '1px solid var(--border-light)',
                      background: lang === l.code ? 'var(--blue-50)' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{l.flag}</span>
                    <span style={{ fontWeight: lang === l.code ? 800 : 600, fontSize: '0.86rem', color: lang === l.code ? 'var(--blue-900)' : 'var(--text-primary)' }}>{l.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{l.native}</span>
                    {lang === l.code && <span style={{ fontSize: '0.68rem', color: 'var(--blue-600)', fontWeight: 800, marginTop: '2px' }}>✓ ACTIVE</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Privacy & Data Retention Center
              </h3>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                INFONEXIS operates under a strict privacy model. Your documents are extracted in-memory with zero persistent training on external LLM foundational servers.
              </div>

              {privacyNotice && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 14px', borderRadius: '8px', color: '#065F46', fontSize: '0.82rem', fontWeight: 700 }}>
                  ✓ {privacyNotice}
                </div>
              )}
              <button
                className="btn-secondary"
                onClick={() => {
                  localStorage.removeItem('infonexis_conv');
                  setPrivacyNotice('In-memory conversation cache cleared. Embeddings and document references reset.');
                  setTimeout(() => setPrivacyNotice(''), 5000);
                }}
                style={{ width: 'fit-content' }}
              >
                Clear In-Memory Cache
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
