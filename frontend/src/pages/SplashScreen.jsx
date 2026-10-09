import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../config/constants';

const logoSrc = new URL('../assets/logo/infonexis.png', import.meta.url).href;

export default function SplashScreen() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setExiting(true);
      setTimeout(() => navigate('/login'), 500);
      return;
    }
    const t = setInterval(() => setSecondsLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, navigate]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setMousePos({ x: ((clientX - cx) / cx) * 12, y: ((clientY - cy) / cy) * -12 });
  };

  return (
    <div
      className="splash-stage"
      onMouseMove={handleMouseMove}
      style={{
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.5s ease',
        cursor: 'default'
      }}
    >
      {/* Soft Ambient Cinematic Glows */}
      <div style={{
        position: 'absolute',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.28) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      {/* 3D Stage Container */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
          transition: 'transform 0.15s ease-out',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10
        }}
      >
        {/* Glow Ring Behind Official PNG Logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, transparent 70%)',
            filter: 'blur(35px)',
            animation: 'pulseGlow 2.5s infinite'
          }} />

          <img
            src={logoSrc}
            alt="INFONEXIS Logo"
            style={{
              width: '160px',
              height: '160px',
              objectFit: 'contain',
              position: 'relative',
              filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 25px rgba(6, 182, 212, 0.45))'
            }}
          />
        </div>

        {/* Title & Tagline */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '3rem',
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-0.03em',
          marginTop: '22px',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          INFONEXIS
        </h1>

        <div style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#22D3EE',
          letterSpacing: '0.04em',
          marginTop: '4px',
          textShadow: '0 0 15px rgba(34, 211, 238, 0.6)'
        }}>
          Understand What Matters.
        </div>

        <p style={{
          color: '#94A3B8',
          fontSize: '0.9rem',
          maxWidth: '520px',
          marginTop: '12px',
          lineHeight: 1.5
        }}>
          Information Intelligence Platform &bull; PS01 Smart Automation
        </p>

        {/* Countdown Pill & Skip Action */}
        <div style={{
          marginTop: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: 'rgba(15, 39, 86, 0.7)',
            border: '1px solid rgba(34, 211, 238, 0.35)',
            color: '#E0F2FE',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)'
          }}>
            Initializing Intelligence Engine in {secondsLeft}s...
          </div>

          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38BDF8',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Skip &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
