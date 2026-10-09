import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_ROLES, APP_CONFIG } from '../config/constants';
import { useI18n } from '../i18n/index';
import { Lock, Phone, User, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';

const logoSrc = new URL('../assets/logo/infonexis.png', import.meta.url).href;

export default function LoginPage() {
  const navigate = useNavigate();
  const { lang, changeLanguage, supportedLanguages } = useI18n();

  const [form, setForm] = useState({
    firstName: 'Vishnu',
    phoneNumber: '+91 98765 43210',
    password: 'password123',
    role: 'analyst'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) {
      setErrors({ firstName: 'First name is required' });
      return;
    }
    setLoading(true);

    const userObj = {
      firstName: form.firstName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      role: form.role
    };

    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USER, JSON.stringify(userObj));

    setTimeout(() => {
      setLoading(false);
      navigate('/otp');
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 30%, #F0F9FF 0%, #F8FAFC 60%, #E2E8F0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Language Switcher in Top Right */}
      <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: '6px' }}>
        {supportedLanguages.map((l) => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: lang === l.code ? '1px solid var(--blue-600)' : '1px solid var(--border-light)',
              background: lang === l.code ? 'var(--blue-50)' : '#FFFFFF',
              color: lang === l.code ? 'var(--blue-700)' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: lang === l.code ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Main Login Card */}
      <div style={{
        maxWidth: 460,
        width: '100%',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xl), 0 0 30px rgba(6, 182, 212, 0.1)',
        padding: '36px 32px'
      }}>
        {/* Top Center Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img
            src={logoSrc}
            alt="INFONEXIS"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(15, 39, 86, 0.2))'
            }}
          />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--blue-950)', marginTop: '12px' }}>
            INFONEXIS
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--cyan-700)', fontWeight: 700 }}>
            Understand What Matters.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* First Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              First Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vishnu"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Phone Number
            </label>
            <input
              type="text"
              required
              placeholder="+91 98765 43210"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* User Role Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              User Role (Adapts Intelligence Overview)
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                outline: 'none',
                fontSize: '0.88rem',
                background: '#FFFFFF'
              }}
            >
              {USER_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} ({r.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '10px' }}
          >
            <span>{loading ? 'Sending OTP...' : 'Continue with Phone OTP'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          HACKNEXT'26 Series 2.0 &bull; Grounded Verification &bull; No Hallucinations
        </div>
      </div>
    </div>
  );
}
