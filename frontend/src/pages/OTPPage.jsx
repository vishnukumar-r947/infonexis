import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../config/constants';
import { CheckCircle2, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

const logoSrc = new URL('../assets/logo/infonexis.png', import.meta.url).href;

export default function OTPPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [resendSeconds, setResendSeconds] = useState(45);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const interval = setInterval(() => {
      setResendSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDigitChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const nextDigits = [...digits];
    nextDigits[index] = value;
    setDigits(nextDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (nextDigits.every((d) => d !== '') && nextDigits.join('').length === 6) {
      triggerVerify(nextDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const triggerVerify = (code) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, 'infonexis_jwt_demo_token_signed');
      navigate('/intro');
    }, 600);
  };

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
        maxWidth: 440,
        width: '100%',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xl)',
        padding: '36px 32px',
        textAlign: 'center'
      }}>
        <img
          src={logoSrc}
          alt="INFONEXIS"
          style={{ width: '56px', height: '56px', objectFit: 'contain' }}
        />

        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--blue-950)', marginTop: '12px' }}>
          Verification Code
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Enter the 6-digit verification code sent to your phone.
        </p>

        {/* Configurable Mock OTP Hint */}
        <div style={{
          marginTop: '12px',
          background: 'var(--blue-50)',
          color: 'var(--blue-700)',
          fontSize: '0.75rem',
          padding: '6px 12px',
          borderRadius: '6px',
          fontWeight: 700
        }}>
          Demo Verification Code: {APP_CONFIG.DEV_MODE_OTP}
        </div>

        {/* 6 Digit Inputs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={{
                width: '44px',
                height: '52px',
                textAlign: 'center',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--blue-950)',
                border: '1.5px solid var(--border-light)',
                borderRadius: '8px',
                outline: 'none',
                background: digit ? 'var(--blue-50)' : '#FFFFFF'
              }}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          className="btn-primary"
          onClick={() => triggerVerify(digits.join(''))}
          disabled={loading || digits.some((d) => !d)}
          style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginTop: '24px' }}
        >
          <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
          <ArrowRight size={16} />
        </button>

        {/* Countdown & Change Phone */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ArrowLeft size={14} />
            <span>Change Phone</span>
          </button>

          <span style={{ color: 'var(--text-muted)' }}>
            {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : (
              <button
                onClick={() => setResendSeconds(45)}
                style={{ background: 'none', border: 'none', color: 'var(--blue-600)', fontWeight: 700, cursor: 'pointer' }}
              >
                Resend OTP
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
