import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BrainCircuit, CheckSquare, Network, Settings,
  LogOut, Bell, Search, Shield, ChevronDown, Check, Sparkles, Filter, Globe
} from 'lucide-react';
import { useI18n } from '../i18n/index';
import { APP_CONFIG, WORKSPACES, USER_ROLES } from '../config/constants';
import FloatingAssistant from '../components/FloatingAssistant';
import ExitModal from '../components/ExitModal';
import CommandPalette from '../components/common/CommandPalette';

const logoSrc = new URL('../assets/logo/infonexis.png', import.meta.url).href;

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, changeLanguage, supportedLanguages, t } = useI18n();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : { firstName: 'Vishnu', role: 'analyst' };
    } catch {
      return { firstName: 'Vishnu', role: 'analyst' };
    }
  });

  const [activeWorkspace, setActiveWorkspace] = useState(() => {
    return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ACTIVE_WORKSPACE) || 'placement_2027';
  });

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Contract Deadline Conflict', type: 'critical', desc: 'Financial Directive (Oct 20) vs Ops Memo (Oct 25)', time: '10m ago' },
    { id: 2, title: 'Missing ISO-27001 Clearance', type: 'high', desc: 'Project Falcon lacks Annexure C signature', time: '1h ago' },
    { id: 3, title: '5 Routine Background Updates', type: 'grouped', desc: 'SLA Addendum v3, Drive Sync, WhatsApp Webhook synced', time: '2h ago' }
  ];

  const navItems = [
    { id: 'nav-overview', key: 'overview', label: 'Overview', path: '/app/overview', icon: LayoutDashboard },
    { id: 'nav-information', key: 'information', label: 'Information', path: '/app/information', icon: FileText },
    { id: 'nav-intelligence', key: 'intelligence', label: 'Intelligence', path: '/app/intelligence', icon: BrainCircuit },
    { id: 'nav-actions', key: 'actions', label: 'Actions', path: '/app/actions', icon: CheckSquare },
    { id: 'nav-sources', key: 'sources', label: 'Sources', path: '/app/sources', icon: Network },
    { id: 'nav-settings', key: 'settings', label: 'Settings', path: '/app/settings', icon: Settings }
  ];

  const currentWorkspaceObj = WORKSPACES.find((w) => w.id === activeWorkspace) || WORKSPACES[0];
  const userRoleObj = USER_ROLES.find((r) => r.id === currentUser.role) || USER_ROLES[7];

  const selectWorkspace = (wsId) => {
    setActiveWorkspace(wsId);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.ACTIVE_WORKSPACE, wsId);
    setIsWorkspaceOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      {/* ENTERPRISE LIGHT TOP HEADER */}
      <header style={{
        height: 'var(--navbar-height)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            onClick={() => navigate('/app/overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <img
              src={logoSrc}
              alt="INFONEXIS"
              style={{
                width: '38px',
                height: '38px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(15, 39, 86, 0.2))'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--blue-950)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                INFONEXIS
              </span>
              <span style={{ fontSize: '0.66rem', color: 'var(--cyan-700)', fontWeight: 700, letterSpacing: '0.04em' }}>
                Understand What Matters.
              </span>
            </div>
          </div>

          {/* WORKSPACE SELECTOR DROPDOWN */}
          <div style={{ position: 'relative' }} className="desktop-only">
            <button
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Workspace:</span>
              <span style={{ color: 'var(--blue-700)', fontWeight: 700 }}>{currentWorkspaceObj.name}</span>
              <ChevronDown size={14} color="#64748B" />
            </button>

            {isWorkspaceOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '260px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 900
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
                  Select Personal Workspace
                </div>
                {WORKSPACES.map((ws) => (
                  <div
                    key={ws.id}
                    onClick={() => selectWorkspace(ws.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: activeWorkspace === ws.id ? 'var(--blue-50)' : 'transparent',
                      color: activeWorkspace === ws.id ? 'var(--blue-700)' : 'var(--text-secondary)',
                      fontWeight: activeWorkspace === ws.id ? 700 : 500,
                      fontSize: '0.8rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{ws.name}</span>
                    {activeWorkspace === ws.id && <Check size={14} color="var(--blue-600)" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Global Search Bar Trigger (Ctrl+K) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '6px 14px',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
          >
            <Search size={15} color="var(--blue-600)" />
            <span className="desktop-only">Global Search</span>
            <span style={{
              fontSize: '0.68rem',
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              padding: '1px 5px',
              borderRadius: '4px',
              fontWeight: 700,
              color: 'var(--text-secondary)'
            }}>
              Ctrl+K
            </span>
          </button>

          {/* Grouped Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="Intelligence Notifications"
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: isNotifOpen ? 'var(--blue-50)' : 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                color: isNotifOpen ? 'var(--blue-700)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Bell size={17} />
              <span style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#DC2626'
              }} />
            </button>

            {isNotifOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-xl)',
                padding: '14px',
                zIndex: 900
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Intelligence Alerts
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Grouped by priority</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map((n) => (
                    <div key={n.id} style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: n.type === 'critical' ? '#FEF2F2' : n.type === 'high' ? '#FFF7ED' : 'var(--bg-subtle)',
                      border: `1px solid ${n.type === 'critical' ? '#FECACA' : n.type === 'high' ? '#FED7AA' : 'var(--border-light)'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: n.type === 'critical' ? '#DC2626' : 'var(--text-primary)' }}>
                        <span>{n.title}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.time}</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {n.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Role Chip */}
          <div className="desktop-only" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            padding: '4px 10px'
          }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--cyan-600) 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.74rem',
              fontWeight: 800
            }}>
              {(currentUser.firstName || 'V')[0].toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {currentUser.firstName || 'Vishnu'}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--blue-600)', fontWeight: 600, textTransform: 'capitalize' }}>
                {userRoleObj.label}
              </span>
            </div>
          </div>

          {/* Logout / Exit Modal Trigger */}
          <button
            onClick={() => setIsExitModalOpen(true)}
            title="Exit INFONEXIS"
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'var(--red-50)',
              border: '1px solid var(--red-border)',
              color: 'var(--red-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* MAIN BODY CONTAINER WITH DESKTOP FIXED SIDEBAR */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* DESKTOP SIDEBAR - FIXED LEFT SIDEBAR */}
        <aside className="desktop-only" style={{
          width: 'var(--sidebar-width)',
          background: '#FFFFFF',
          borderRight: '1px solid var(--border-light)',
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexShrink: 0,
          position: 'sticky',
          top: 'var(--navbar-height)',
          height: 'calc(100vh - var(--navbar-height))'
        }}>
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            fontWeight: 800,
            padding: '0 10px 8px 10px'
          }}>
            INTELLIGENCE WORKFLOW
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.id}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={18} color={isActive ? '#38BDF8' : '#64748B'} />
                <span>{t(`nav.${item.key}`) || item.label}</span>
              </NavLink>
            );
          })}

          {/* System Health Card at Bottom of Sidebar */}
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
              border: '1px solid var(--emerald-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Shield size={18} color="#059669" />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065F46' }}>
                  Information Health
                </div>
                <div style={{ fontSize: '0.72rem', color: '#047857' }}>
                  78% Overall Quality Score
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN OUTLET SCROLLING AREA */}
        <main style={{
          flex: 1,
          padding: '28px 24px',
          paddingBottom: '96px', // Comfort clearance for mobile nav & floating button
          overflowY: 'auto',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <Outlet />
        </main>
      </div>

      {/* MOBILE FIXED BOTTOM NAVIGATION */}
      <nav className="mobile-only" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        boxShadow: '0 -2px 10px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 900
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.id}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: isActive ? 'var(--blue-700)' : 'var(--text-muted)',
                gap: '2px',
                flex: 1,
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 500
              }}
            >
              <Icon size={18} color={isActive ? '#1D4ED8' : '#64748B'} />
              <span>{t(`nav.${item.key}`) || item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* 3D SQUARE STAR FLOATING ASSISTANT */}
      <FloatingAssistant />

      {/* 3D CLOSING GREETING EXIT MODAL */}
      <ExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
      />

      {/* GLOBAL SEARCH COMMAND PALETTE */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
