import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { APP_CONFIG } from '../config/constants';

const logoSrc = new URL('../assets/logo/infonexis.png', import.meta.url).href;

export default function ExitModal({ isOpen, onClose, onConfirmExit }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
    if (onConfirmExit) onConfirmExit();
    navigate('/login');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 480,
          textAlign: 'center',
          padding: '36px 28px',
          background: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: 'var(--shadow-xl), 0 0 35px rgba(6, 182, 212, 0.25)'
        }}
      >
        {/* 3D Animated Logo Emblem */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
          <div style={{
            position: 'absolute',
            inset: -12,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
            filter: 'blur(16px)',
            animation: 'pulseGlow 2s infinite'
          }} />
          <img
            src={logoSrc}
            alt="INFONEXIS"
            style={{
              width: '84px',
              height: '84px',
              objectFit: 'contain',
              position: 'relative',
              filter: 'drop-shadow(0 8px 16px rgba(15, 39, 86, 0.25))'
            }}
          />
        </div>

        {/* Poetic Closing Greeting */}
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--blue-950)', letterSpacing: '-0.02em' }}>
          Keep Exploring.
        </h3>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cyan-600)', marginTop: '2px' }}>
          Keep Understanding.
        </h4>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          See you soon...
        </p>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Your verified intelligence workspace state and extracted artifacts have been safely preserved.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '24px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: '10px' }}>
            Stay in Workspace
          </button>
          <button
            onClick={handleLogout}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              padding: '10px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
            }}
          >
            Confirm Exit
          </button>
        </div>
      </div>
    </div>
  );
}
