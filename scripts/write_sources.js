const fs = require('fs');
const content = `import React, { useState } from "react";
import { useI18n } from "../i18n/index";
import {
  Network, Mail, HardDrive, UploadCloud, MessageSquare,
  CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ShieldCheck,
  Lock, ArrowRight, Radio
} from "lucide-react";

export default function SourcesPage() {
  const { t } = useI18n();

  const [sources, setSources] = useState([
    {
      id: "gmail",
      name: "Gmail Intelligence Feed",
      type: "Email & Attachments",
      icon: Mail,
      iconColor: "#EF4444",
      status: "Connected", // 'Connected', 'Not Connected', 'Syncing'
      lastSynced: "12 minutes ago",
      itemCount: "1,420 messages scanned",
      authType: "OAuth 2.0 (Google Workspace Identity)",
      description: "Monitors administrative circulars, vendor invoices, and board scheduling threads automatically using read-only OAuth tokens."
    },
    {
      id: "gdrive",
      name: "Google Drive Enterprise Vault",
      type: "Cloud Documents",
      icon: HardDrive,
      iconColor: "#F59E0B",
      status: "Connected",
      lastSynced: "45 minutes ago",
      itemCount: "34 synced folders &bull; 128 PDFs",
      authType: "OAuth 2.0 (Restricted Drive.Readonly)",
      description: "Direct synchronization with governance archives, contracts repository, and technical specification folders."
    },
    {
      id: "manual",
      name: "Local Manual Vault Upload",
      type: "Local Drag-and-Drop",
      icon: UploadCloud,
      iconColor: "#22D3EE",
      status: "Connected",
      lastSynced: "Real-time active",
      itemCount: "14 processed documents",
      authType: "Encrypted AES-256 Local Ingestion",
      description: "In-memory & secure storage ingestion for ad-hoc circulars, physical scans via Tesseract OCR, and financial statements."
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business Cloud API",
      type: "Enterprise Messaging",
      icon: MessageSquare,
      iconColor: "#10B981",
      status: "Not Connected",
      lastSynced: "Awaiting Webhook Setup",
      itemCount: "0 messages",
      authType: "Meta Graph API (Official Business Webhook)",
      description: "Official WhatsApp Business API integration for approved administrative broadcast channels. (Personal scraping strictly excluded)."
    }
  ]);

  const [syncingId, setSyncingId] = useState(null);

  const toggleConnection = (id) => {
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        if (s.status === "Connected") {
          return { ...s, status: "Not Connected" };
        } else {
          return { ...s, status: "Connected", lastSynced: "Just now" };
        }
      }
      return s;
    }));
  };

  const syncSource = (id) => {
    setSyncingId(id);
    setTimeout(() => {
      setSources(prev => prev.map(s => {
        if (s.id === id) {
          return { ...s, status: "Connected", lastSynced: "Just now" };
        }
        return s;
      }));
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#22D3EE", background: "rgba(6,182,212,0.12)", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
              Integration Hub
            </span>
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>OAuth 2.0 &bull; Cloud APIs &bull; Zero Password Storage</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#F8FAFC", marginTop: "6px" }}>
            Information Sources & Connectors
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.92rem", marginTop: "4px" }}>
            Manage authenticated data connectors. All integrations use tokenized OAuth credentials without credential exposure.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(10, 22, 40, 0.7)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "10px", padding: "8px 14px", color: "#10B981", fontSize: "0.8rem", fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>Encrypted OAuth Token Vault Active</span>
        </div>
      </div>

      {/* Sources Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "22px" }}>
        {sources.map((src) => {
          const Icon = src.icon;
          const isConnected = src.status === "Connected";
          const isSyncing = syncingId === src.id;

          return (
            <div
              key={src.id}
              style={{
                background: "rgba(10, 22, 40, 0.8)",
                border: isConnected ? "1px solid rgba(59, 130, 246, 0.25)" : "1px solid rgba(30, 41, 59, 0.7)",
                borderRadius: "20px",
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxShadow: isConnected ? "0 8px 24px rgba(0,0,0,0.3)" : "none"
              }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    background: "rgba(15, 32, 68, 0.6)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon size={24} color={src.iconColor} />
                  </div>
                  <div>
                    <h3 style={{ color: "#F8FAFC", fontSize: "1.05rem", fontWeight: 700 }}>
                      {src.name}
                    </h3>
                    <span style={{ color: "#64748B", fontSize: "0.75rem" }}>{src.type}</span>
                  </div>
                </div>

                {/* Connection Status Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: isConnected ? "#10B981" : "#64748B",
                    boxShadow: isConnected ? "0 0 8px #10B981" : "none"
                  }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: isConnected ? "#34D399" : "#64748B" }}>
                    {isConnected ? "Connected" : "Not Connected"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                {src.description}
              </p>

              {/* Stats Box */}
              <div style={{
                background: "rgba(15, 32, 68, 0.45)",
                border: "1px solid rgba(59, 130, 246, 0.15)",
                borderRadius: "12px",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "0.78rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Sync Frequency:</span>
                  <span style={{ color: "#F1F5F9", fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: src.lastSynced }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Volume:</span>
                  <span style={{ color: "#22D3EE", fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: src.itemCount }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Auth Mode:</span>
                  <span style={{ color: "#94A3B8" }}>{src.authType}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                {isConnected ? (
                  <>
                    <button
                      onClick={() => syncSource(src.id)}
                      disabled={isSyncing}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "10px",
                        background: "rgba(37, 99, 235, 0.2)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        color: "#60A5FA",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <RefreshCw size={14} className={isSyncing ? "spin-slow" : ""} />
                      <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                    </button>
                    <button
                      onClick={() => toggleConnection(src.id)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "10px",
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        color: "#F87171",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toggleConnection(src.id)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 15px rgba(6, 182, 212, 0.25)"
                    }}
                  >
                    <span>Authorize & Connect</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/SourcesPage.jsx', content, 'utf8');
console.log('SourcesPage.jsx written');
