const fs = require('fs');
const content = `import React, { useState } from "react";
import { useI18n } from "../i18n/index";
import {
  User, Shield, Sliders, Volume2, FileCog, Bell, Lock,
  HardDrive, HelpCircle, Check, Save, Trash2, RefreshCw, Key
} from "lucide-react";

export default function SettingsPage() {
  const { t, lang, changeLanguage } = useI18n();
  const [activeTab, setActiveTab] = useState("profile"); // 9 tabs
  const [savedMessage, setSavedMessage] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    firstName: "Alex",
    phoneNumber: "+1 (555) 019-2834",
    role: "analyst",
    bio: "Senior Information Intelligence Specialist at Global Enterprise Systems."
  });

  // AI Preferences state
  const [aiPrefs, setAiPrefs] = useState({
    responseStyle: "executive", // 'executive', 'concise', 'detailed'
    summaryLength: "medium",
    temperature: "0.3",
    groundingStrictness: "high"
  });

  // Voice & Audio state
  const [voicePrefs, setVoicePrefs] = useState({
    inputLang: "en-US",
    outputLang: "en-US",
    speechRate: "1.0",
    ttsVoice: "natural-female",
    autoPlayAudioSummary: false
  });

  // Document Processing state
  const [docPrefs, setDocPrefs] = useState({
    ocrEngine: "tesseract",
    tableExtraction: true,
    maxFileSize: "50MB",
    extractImages: true
  });

  // Notifications state
  const [notifPrefs, setNotifPrefs] = useState({
    criticalAlerts: true,
    conflicts: true,
    missingDetails: true,
    deadlines: true,
    recentChanges: true
  });

  // Privacy & Data
  const [retention, setRetention] = useState("90_days");

  const saveSettings = () => {
    localStorage.setItem("infonexis_user", JSON.stringify(profile));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const tabs = [
    { id: "profile", label: "1. Profile", icon: User },
    { id: "security", label: "2. Account & Security", icon: Shield },
    { id: "ai", label: "3. AI Preferences", icon: Sliders },
    { id: "voice", label: "4. Voice & Audio", icon: Volume2 },
    { id: "doc", label: "5. Document Processing", icon: FileCog },
    { id: "notif", label: "6. Notifications", icon: Bell },
    { id: "privacy", label: "7. Privacy & Data", icon: Lock },
    { id: "storage", label: "8. Storage", icon: HardDrive },
    { id: "help", label: "9. Help & Support", icon: HelpCircle }
  ];

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#22D3EE", background: "rgba(6,182,212,0.12)", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
              Configuration Center
            </span>
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>9 Specialized Subsections</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#F8FAFC", marginTop: "6px" }}>
            System Settings & Preferences
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.92rem", marginTop: "4px" }}>
            Customize your intelligence models, voice options, data lifecycle, and security profile.
          </p>
        </div>

        {savedMessage && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", padding: "8px 14px", borderRadius: "10px", fontSize: "0.82rem", fontWeight: 700 }}>
            <Check size={16} />
            <span>Preferences Saved Successfully</span>
          </div>
        )}
      </div>

      {/* Main Settings Body: Left Vertical Tabs + Right Sub-Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {/* Left Subsections Navigator */}
        <div style={{
          background: "rgba(10, 22, 40, 0.8)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          borderRadius: "20px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          height: "fit-content"
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: isActive ? "1px solid rgba(6, 182, 212, 0.35)" : "1px solid transparent",
                  background: isActive ? "linear-gradient(135deg, rgba(37,99,235,0.3) 0%, rgba(6,182,212,0.18) 100%)" : "transparent",
                  color: isActive ? "#FFFFFF" : "#94A3B8",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s"
                }}
              >
                <Icon size={18} color={isActive ? "#22D3EE" : "#64748B"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Active Sub-panel */}
        <div style={{
          gridColumn: "span 2",
          background: "rgba(10, 22, 40, 0.85)",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          borderRadius: "20px",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          {/* 1. PROFILE */}
          {activeTab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>1. User Profile</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", background: "rgba(15, 32, 68, 0.6)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "10px", color: "#F8FAFC", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>Phone Number</label>
                  <input
                    type="text"
                    value={profile.phoneNumber}
                    disabled
                    style={{ width: "100%", padding: "10px 14px", background: "rgba(15, 32, 68, 0.3)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: "10px", color: "#64748B", outline: "none" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>Role Designation</label>
                <select
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(15, 32, 68, 0.6)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "10px", color: "#F8FAFC", outline: "none" }}
                >
                  <option value="analyst">Analyst</option>
                  <option value="researcher">Researcher</option>
                  <option value="it_professional">IT Professional</option>
                  <option value="business">Business Executive</option>
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="health_professional">Health Professional</option>
                </select>
              </div>
              <button onClick={saveSettings} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)", color: "#FFF", border: "none", borderRadius: "10px", fontWeight: 700, width: "fit-content", cursor: "pointer" }}>Save Profile Changes</button>
            </div>
          )}

          {/* 2. ACCOUNT & SECURITY */}
          {activeTab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>2. Account & Security</h3>
              <div style={{ background: "rgba(15, 32, 68, 0.45)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                <div style={{ color: "#F8FAFC", fontSize: "0.95rem", fontWeight: 600 }}>JWT Session Management</div>
                <p style={{ color: "#94A3B8", fontSize: "0.82rem", marginTop: "4px" }}>Signed token expiry: 7 days. Session tokens are verified against backend auth middleware on every API call.</p>
              </div>
              <div style={{ background: "rgba(15, 32, 68, 0.45)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                <div style={{ color: "#F8FAFC", fontSize: "0.95rem", fontWeight: 600 }}>Two-Factor Phone OTP</div>
                <p style={{ color: "#94A3B8", fontSize: "0.82rem", marginTop: "4px" }}>Active on current phone number (+1 555-019-2834). Every new browser requires 6-digit OTP verification.</p>
              </div>
            </div>
          )}

          {/* 3. AI PREFERENCES */}
          {activeTab === "ai" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>3. AI Intelligence Preferences</h3>
              <div>
                <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>Response Style</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["executive", "concise", "detailed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setAiPrefs({ ...aiPrefs, responseStyle: s })}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: aiPrefs.responseStyle === s ? "1px solid #22D3EE" : "1px solid rgba(59, 130, 246, 0.2)",
                        background: aiPrefs.responseStyle === s ? "rgba(6, 182, 212, 0.2)" : "rgba(15, 32, 68, 0.5)",
                        color: aiPrefs.responseStyle === s ? "#22D3EE" : "#94A3B8",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        cursor: "pointer"
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>Summary Length</label>
                <select
                  value={aiPrefs.summaryLength}
                  onChange={(e) => setAiPrefs({ ...aiPrefs, summaryLength: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(15, 32, 68, 0.6)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "10px", color: "#F8FAFC", outline: "none" }}
                >
                  <option value="brief">Brief (1 paragraph executive snapshot)</option>
                  <option value="medium">Medium (Standard structured report with facts & issues)</option>
                  <option value="exhaustive">Exhaustive (Deep line-item cross-examination)</option>
                </select>
              </div>
              <button onClick={saveSettings} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)", color: "#FFF", border: "none", borderRadius: "10px", fontWeight: 700, width: "fit-content", cursor: "pointer" }}>Save AI Preferences</button>
            </div>
          )}

          {/* 4. VOICE & AUDIO */}
          {activeTab === "voice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>4. Voice & Audio Preferences</h3>
              <div>
                <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>Speech-To-Text (Voice Input Language)</label>
                <select
                  value={voicePrefs.inputLang}
                  onChange={(e) => setVoicePrefs({ ...voicePrefs, inputLang: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(15, 32, 68, 0.6)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "10px", color: "#F8FAFC", outline: "none" }}
                >
                  <option value="en-US">English (United States)</option>
                  <option value="hi-IN">Hindi (India)</option>
                  <option value="ta-IN">Tamil (India)</option>
                  <option value="ar-SA">Arabic (Standard)</option>
                  <option value="fr-FR">French (France)</option>
                </select>
              </div>
              <div>
                <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>Speech Rate</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["0.8", "1.0", "1.2", "1.5"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setVoicePrefs({ ...voicePrefs, speechRate: r })}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: voicePrefs.speechRate === r ? "1px solid #22D3EE" : "1px solid rgba(59, 130, 246, 0.2)",
                        background: voicePrefs.speechRate === r ? "rgba(6, 182, 212, 0.2)" : "rgba(15, 32, 68, 0.5)",
                        color: voicePrefs.speechRate === r ? "#22D3EE" : "#94A3B8",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={saveSettings} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)", color: "#FFF", border: "none", borderRadius: "10px", fontWeight: 700, width: "fit-content", cursor: "pointer" }}>Save Audio Preferences</button>
            </div>
          )}

          {/* 5. DOCUMENT PROCESSING */}
          {activeTab === "doc" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>5. Document Processing Engine</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 32, 68, 0.4)", padding: "14px", borderRadius: "10px" }}>
                  <div>
                    <div style={{ color: "#F8FAFC", fontSize: "0.9rem", fontWeight: 600 }}>Tesseract.js OCR for Scans</div>
                    <div style={{ color: "#94A3B8", fontSize: "0.75rem" }}>Extracts text from scanned PNG/JPG circulars</div>
                  </div>
                  <span style={{ color: "#10B981", fontWeight: 700, fontSize: "0.85rem" }}>Enabled</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 32, 68, 0.4)", padding: "14px", borderRadius: "10px" }}>
                  <div>
                    <div style={{ color: "#F8FAFC", fontSize: "0.9rem", fontWeight: 600 }}>PDF.js / PDF Parse</div>
                    <div style={{ color: "#94A3B8", fontSize: "0.75rem" }}>Multi-page vector layout extraction</div>
                  </div>
                  <span style={{ color: "#10B981", fontWeight: 700, fontSize: "0.85rem" }}>Active</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. NOTIFICATIONS */}
          {activeTab === "notif" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>6. Notification Preferences</h3>
              {Object.keys(notifPrefs).map((k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 32, 68, 0.4)", padding: "14px", borderRadius: "10px" }}>
                  <span style={{ color: "#F8FAFC", fontSize: "0.9rem", textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, " $1")}</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs[k]}
                    onChange={() => setNotifPrefs({ ...notifPrefs, [k]: !notifPrefs[k] })}
                    style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#06B6D4" }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 7. PRIVACY & DATA */}
          {activeTab === "privacy" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>7. Privacy & Data Lifecycle</h3>
              <div>
                <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>Data Retention Period</label>
                <select
                  value={retention}
                  onChange={(e) => setRetention(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(15, 32, 68, 0.6)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "10px", color: "#F8FAFC", outline: "none" }}
                >
                  <option value="30_days">30 Days</option>
                  <option value="90_days">90 Days (Recommended)</option>
                  <option value="365_days">1 Year</option>
                  <option value="indefinite">Indefinite until manual deletion</option>
                </select>
              </div>
              <div style={{ borderTop: "1px solid rgba(239, 68, 68, 0.2)", paddingTop: "16px" }}>
                <div style={{ color: "#F87171", fontSize: "0.95rem", fontWeight: 700 }}>Danger Zone</div>
                <p style={{ color: "#94A3B8", fontSize: "0.8rem", marginTop: "4px" }}>Permanently wipe all processed documents, synthesized summaries, and cached conversation histories.</p>
                <button
                  onClick={() => alert("Data deletion simulation: Workspace cache cleared.")}
                  style={{ marginTop: "10px", padding: "8px 16px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#F87171", borderRadius: "8px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  Clear Cached Workspace Data
                </button>
              </div>
            </div>
          )}

          {/* 8. STORAGE */}
          {activeTab === "storage" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>8. Storage Analytics</h3>
              <div style={{ background: "rgba(15, 32, 68, 0.5)", padding: "20px", borderRadius: "14px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#F8FAFC", fontWeight: 600 }}>Allocated Storage Used</span>
                  <span style={{ color: "#22D3EE", fontWeight: 700 }}>3.24 MB / 100 MB</span>
                </div>
                <div style={{ height: "8px", background: "rgba(30, 41, 59, 0.8)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "3.24%", background: "#22D3EE" }} />
                </div>
              </div>
            </div>
          )}

          {/* 9. HELP & SUPPORT */}
          {activeTab === "help" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700 }}>9. Help & Interactive Support</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { q: "How does INFONEXIS detect conflicts between documents?", a: "The intelligence engine extracts structured entities (dates, budgets, deadlines, and clauses) and creates a semantic knowledge map. When two documents assert mutually exclusive facts, an explainable alert is generated." },
                  { q: "Is personal WhatsApp data accessed?", a: "No. INFONEXIS strictly uses the official WhatsApp Business Cloud API for verified corporate channels. Personal scraping is never performed." },
                  { q: "How do I download or listen to an audio summary?", a: "After uploading any document in the Information section, the generated summary contains both a 'Download' button and a 'Play AI Audio Summary' button using real-time speech synthesis." }
                ].map((faq, i) => (
                  <div key={i} style={{ background: "rgba(15, 32, 68, 0.4)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.15)" }}>
                    <h4 style={{ color: "#F8FAFC", fontSize: "0.92rem", fontWeight: 700 }}>{faq.q}</h4>
                    <p style={{ color: "#94A3B8", fontSize: "0.82rem", marginTop: "6px", lineHeight: 1.5 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/SettingsPage.jsx', content, 'utf8');
console.log('SettingsPage.jsx written');
