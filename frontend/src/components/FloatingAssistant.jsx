import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  X, Mic, MicOff, Send, Sparkles, Volume2, Bookmark, ShieldAlert,
  ShieldCheck, RefreshCw, Layers, Check, Globe, Sliders, ChevronDown
} from 'lucide-react';
import { aiAPI } from '../services/api';
import { INITIAL_INTELLIGENCE } from '../data/groundedIntelligence';
import EvidenceModal from './modals/EvidenceModal';

export default function FloatingAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('CHAT'); // CHAT, VOICE, TRANSLATE
  const [responseMode, setResponseMode] = useState('BALANCED'); // QUICK, BALANCED, DETAILED, NEWBIE
  const [activeContext, setActiveContext] = useState({
    docTitle: 'Quarterly Financial Board Directive.pdf',
    workspace: 'Placement 2027',
    evidence: {
      page: 3,
      section: 'Section 4.1 - Schedule & Milestones',
      quotedText: 'The preliminary board review shall formally convene on October 20, 2026. All departmental expenditure reconciliations exceeding $250,000 must be finalized 72 hours prior.'
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);
  const [speechError, setSpeechError] = useState('');

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initial Grounded Intelligence Messages
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Welcome to INFONEXIS Intelligence. I understand your active workspace documents, detected contradictions, and pending actions.',
      confidence: 96,
      needsVerification: false,
      sources: ['Quarterly Financial Board Directive.pdf (Page 3)'],
      evidence: {
        page: 3,
        section: 'Section 4.1',
        quotedText: 'The preliminary board review shall formally convene on October 20, 2026.'
      },
      time: 'Just now'
    }
  ]);

  // STT Voice Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recog.onerror = (err) => {
        console.warn('Speech recognition error:', err.error);
        setIsListening(false);
      };

      recog.onend = () => setIsListening(false);
      recognitionRef.current = recog;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleVoice = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError('Speech recognition is not available in this browser. Please use Chrome or Edge.');
      setTimeout(() => setSpeechError(''), 4000);
      return;
    }
    setSpeechError('');
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (customQuery) => {
    const query = (customQuery || input).trim();
    if (!query || loading) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Try backend if connected, else use structured grounding logic
      let replyData;
      try {
        const res = await aiAPI.chat({
          prompt: query,
          context: activeContext ? activeContext.docTitle : 'workspace',
          responseMode
        });
        if (res && res.data) {
          replyData = res.data;
        }
      } catch (err) {
        // Fallback grounded engine
      }

      if (!replyData) {
        const qLower = query.toLowerCase();
        if (qLower.includes('deadline') || qLower.includes('date') || qLower.includes('meeting')) {
          replyData = {
            answer: responseMode === 'QUICK'
              ? 'Directive mandates 20 Oct; Operations Memo specifies 25 Oct (+5 days divergence).'
              : responseMode === 'NEWBIE'
              ? 'Think of it like two different calendar invites: the finance boss says the review is on October 20th, but the operations team wrote down October 25th. You need to double-check which date is real before booking anything!'
              : 'Two conflicting deadlines were identified: The Financial Directive specifies October 20, 2026 (signed by CFO), whereas the Operations Memo cites October 25, 2026. This 5-day delta creates regulatory filing risks.',
            confidence: 88,
            needsVerification: true,
            sources: ['Board Directive (Page 3)', 'Ops Memo (Page 2)'],
            evidence: activeContext?.evidence || {
              page: 3,
              section: 'Section 4.1',
              quotedText: 'The preliminary board review shall formally convene on October 20, 2026.'
            }
          };
        } else if (qLower.includes('budget') || qLower.includes('money') || qLower.includes('cloud')) {
          replyData = {
            answer: responseMode === 'QUICK'
              ? 'Approved plan has $1.2M ceiling; Operations memo requests $1.45M (+$250k variance).'
              : 'A budget ceiling delta of $250,000 (+20.8%) was detected between the Annual Operating Plan ($1.20M) and Operations Memo v2 ($1.45M). Departmental sign-off is capped at $50k, so a formal Finance Committee variance waiver is required.',
            confidence: 93,
            needsVerification: true,
            sources: ['Annual Operating Plan (Page 8)', 'Operations Memo v2 (Page 2)'],
            evidence: {
              page: 2,
              section: 'Compute Envelope Allocation',
              quotedText: 'Revised compute requirements necessitate an updated cloud envelope of $1,450,000.'
            }
          };
        } else if (qLower.includes('missing') || qLower.includes('falcon') || qLower.includes('annexure')) {
          replyData = {
            answer: 'Project Falcon Architecture is missing mandatory Annexure C (ISO-27001 Security Clearance Table). Without this signed matrix, federal regulatory procurement is frozen.',
            confidence: 97,
            needsVerification: false,
            sources: ['Project Falcon Submission (Page 11)'],
            evidence: {
              page: 11,
              section: 'Appendix Index',
              quotedText: 'Annexure C: ISO-27001 Clearance Matrix [File Reference: Missing].'
            }
          };
        } else {
          replyData = {
            answer: `Based on your active context (${activeContext ? activeContext.docTitle : 'Workspace'}), I analyzed: "${query}". Verification of primary source documents is recommended to ensure zero hallucinations.`,
            confidence: 82,
            needsVerification: false,
            sources: [activeContext ? activeContext.docTitle : 'General Vault Sources'],
            evidence: activeContext?.evidence || null
          };
        }
      }

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyData.answer || replyData.response || replyData.message,
        confidence: replyData.confidence || 90,
        needsVerification: replyData.needsVerification || false,
        sources: replyData.sources || ['Verified Grounded Vault'],
        evidence: replyData.evidence || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SIDE PANEL / MODAL (Desktop Side-Drawer / Mobile Bottom-Sheet) */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          maxWidth: '100vw',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl), 0 0 40px rgba(6, 182, 212, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          animation: 'slideInRight 0.25s ease'
        }}>
          {/* Panel Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #0F2756 0%, #1E3A8A 100%)',
            color: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'rgba(34, 211, 238, 0.2)',
                border: '1px solid rgba(34, 211, 238, 0.4)',
                color: '#22D3EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 900
              }}>
                ✦
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>INFONEXIS Assistant</div>
                <div style={{ fontSize: '0.7rem', color: '#93C5FD' }}>Grounded & Explainable AI Engine</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Tabs: CHAT, VOICE, TRANSLATE */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            borderBottom: '1px solid var(--border-light)',
            padding: '4px 12px',
            gap: '6px'
          }}>
            {['CHAT', 'VOICE', 'TRANSLATE'].map((m) => (
              <button
                key={m}
                onClick={() => setActiveMode(m)}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: '6px',
                  border: activeMode === m ? '1px solid var(--border-light)' : 'none',
                  background: activeMode === m ? '#FFFFFF' : 'transparent',
                  color: activeMode === m ? 'var(--blue-700)' : 'var(--text-muted)',
                  fontWeight: activeMode === m ? 700 : 500,
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Active Context Banner */}
          {activeContext && (
            <div style={{
              background: '#F0F9FF',
              borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
              padding: '8px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                <span style={{ fontWeight: 800, color: 'var(--cyan-700)', textTransform: 'uppercase' }}>CONTEXT:</span>
                <span style={{ color: 'var(--blue-900)', fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {activeContext.docTitle}
                </span>
              </div>
              <button
                onClick={() => setActiveContext(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--red-500)',
                  fontWeight: 600,
                  fontSize: '0.68rem',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Response Style Selector */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 14px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-light)',
            fontSize: '0.7rem'
          }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Response Depth:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['QUICK', 'BALANCED', 'DETAILED', 'NEWBIE'].map((depth) => (
                <button
                  key={depth}
                  onClick={() => setResponseMode(depth)}
                  style={{
                    border: 'none',
                    background: responseMode === depth ? 'var(--blue-50)' : 'transparent',
                    color: responseMode === depth ? 'var(--blue-700)' : 'var(--text-muted)',
                    fontWeight: responseMode === depth ? 700 : 500,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    cursor: 'pointer'
                  }}
                >
                  {depth === 'NEWBIE' ? 'ELI5' : depth}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-600) 100%)'
                    : 'var(--bg-subtle)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  {msg.text}

                  {/* AI Quality Guard Badge */}
                  {msg.sender === 'ai' && msg.needsVerification && (
                    <div style={{
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'var(--amber-50)',
                      border: '1px solid var(--amber-border)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--amber-700)'
                    }}>
                      <ShieldAlert size={13} />
                      <span>NEEDS VERIFICATION (Conflict Detected)</span>
                    </div>
                  )}

                  {/* Grounded Source Citations */}
                  {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                    <div style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px dashed #CBD5E1',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)'
                    }}>
                      <strong>Sources:</strong> {msg.sources.join(', ')}
                    </div>
                  )}
                </div>

                {/* AI Footer Buttons: TTS + View Evidence */}
                {msg.sender === 'ai' && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => speakText(msg.text)}
                      title="Read aloud"
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem' }}
                    >
                      <Volume2 size={13} />
                      <span>Listen</span>
                    </button>

                    {msg.evidence && (
                      <button
                        onClick={() => setActiveEvidenceModal({ evidence: msg.evidence, docTitle: msg.sources[0] })}
                        style={{ background: 'none', border: 'none', color: 'var(--blue-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', fontWeight: 600 }}
                      >
                        <Bookmark size={13} />
                        <span>View Evidence</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Sparkles size={16} className="animate-spin" color="var(--cyan-500)" />
                <span>Checking grounded sources & reasoning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Mode Notice */}
          {activeMode === 'VOICE' && (
            <div style={{
              padding: '12px',
              background: '#EFF6FF',
              borderTop: '1px solid #BFDBFE',
              textAlign: 'center'
            }}>
              <button
                onClick={toggleVoice}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: isListening ? '#DC2626' : 'linear-gradient(135deg, var(--cyan-600) 0%, var(--blue-600) 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <div style={{ fontSize: '0.78rem', color: 'var(--blue-900)', fontWeight: 600, marginTop: '8px' }}>
                {isListening ? 'Listening to speech... Speak clearly' : 'Tap microphone to speak your question'}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: 'var(--bg-surface)'
          }}>
            {speechError && (
              <div style={{ fontSize: '0.75rem', color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '6px 10px', borderRadius: '6px', fontWeight: 600 }}>
                ⚠ {speechError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Ask about deadlines, conflicts, actions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />

            <button
              onClick={toggleVoice}
              title="Voice Input"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: isListening ? '#FEF2F2' : 'var(--bg-subtle)',
                color: isListening ? '#DC2626' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Mic size={18} />
            </button>

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--cyan-600) 100%)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: !input.trim() ? 0.6 : 1
              }}
            >
              <Send size={16} />
            </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D SQUARE FLOATING BUTTON WITH ONLY 3D STAR SYMBOL (✦) */}
      <button
        id="floating-star-assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="INFONEXIS AI Assistant"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #0A192F 0%, #0F2756 50%, #0891B2 100%)',
          border: '1.5px solid rgba(34, 211, 238, 0.6)',
          boxShadow: '0 8px 24px rgba(10, 25, 47, 0.4), 0 0 20px rgba(6, 182, 212, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
          color: '#E0F2FE',
          fontSize: '26px',
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 997,
          transform: 'perspective(400px) translateZ(4px)',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
          lineHeight: 1
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'perspective(400px) translateZ(10px) translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(10, 25, 47, 0.5), 0 0 28px rgba(6, 182, 212, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'perspective(400px) translateZ(4px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(10, 25, 47, 0.4), 0 0 20px rgba(6, 182, 212, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)';
        }}
      >
        <span style={{
          textShadow: '0 0 14px rgba(34, 211, 238, 0.9)',
          transform: 'translateY(-1px)',
          display: 'inline-block'
        }}>
          ✦
        </span>
      </button>

      {/* Active Evidence Trail Modal */}
      {activeEvidenceModal && (
        <EvidenceModal
          isOpen={true}
          onClose={() => setActiveEvidenceModal(null)}
          evidence={activeEvidenceModal.evidence}
          docTitle={activeEvidenceModal.docTitle}
        />
      )}
    </>
  );
}
