const fs = require('fs');
const content = `import React, { useState } from "react";
import { useI18n } from "../i18n/index";
import {
  CheckSquare, Clock, AlertTriangle, ArrowRight, CheckCircle2,
  ListFilter, Calendar, ChevronRight, Sparkles, User, Tag
} from "lucide-react";

export default function ActionsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("center"); // 'center', 'timeline', 'recommendations', 'workflow'
  const [filterPriority, setFilterPriority] = useState("ALL");

  // Action Center tasks
  const [tasks, setTasks] = useState([
    {
      id: "act-1",
      task: "Reconcile October Board Meeting Review Date",
      reason: "Conflicting dates detected between Financial Directive (Oct 20) and Operations Memo (Oct 25)",
      source: "Board Directive vs Ops Memo",
      priority: "Critical",
      deadline: "Oct 15, 2026 (2 days left)",
      nextStep: "Convene brief alignment call between CFO and VP Operations to lock calendar.",
      status: "Pending" // 'Pending', 'In Progress', 'Resolved'
    },
    {
      id: "act-2",
      task: "Obtain Annexure C Security Clearance Table",
      reason: "Missing mandatory ISO-27001 compliance matrix in Project Falcon architecture file",
      source: "Falcon Architecture Doc",
      priority: "High",
      deadline: "Oct 14, 2026 (1 day left)",
      nextStep: "Request signed Annexure C from Lead Systems Architect.",
      status: "In Progress"
    },
    {
      id: "act-3",
      task: "Submit Supplemental Cloud Budget Authorization",
      reason: "Operations memo reflects $250k delta exceeding department discretionary limit",
      source: "Operations Memo v2",
      priority: "Medium",
      deadline: "Oct 18, 2026 (5 days left)",
      nextStep: "Draft one-page variance memo for Board Finance Committee signature.",
      status: "Pending"
    },
    {
      id: "act-4",
      task: "Verify Vendor GST/Tax Identification Certificate",
      reason: "Withholding tax deduction cannot be registered without verified tax ID",
      source: "Vendor Agreement Renewal",
      priority: "Medium",
      deadline: "Oct 20, 2026 (7 days left)",
      nextStep: "Email vendor accounts team requesting updated certificate.",
      status: "Pending"
    }
  ]);

  // Chronological timeline events
  const [timelineEvents] = useState([
    { id: "e1", time: "Oct 8, 2026 &bull; 14:30", title: "SLA Addendum v3 Uploaded", desc: "Target availability updated from 99.9% to 99.99%. Verified by Legal.", type: "system" },
    { id: "e2", time: "Oct 8, 2026 &bull; 11:15", title: "Conflict Flagged: Board Date", desc: "INFONEXIS intelligence detected 5-day divergence between Directive and Operations Memo.", type: "conflict" },
    { id: "e3", time: "Oct 7, 2026 &bull; 16:45", title: "Executive Operations Memo Processed", desc: "OCR and PDF extraction completed. 18 headcount & $1.45M budget indexed.", type: "doc" },
    { id: "e4", time: "Oct 6, 2026 &bull; 09:20", title: "Quarterly Financial Board Directive Received", desc: "Mandatory Q4 audit directives ingested from CFO vault.", type: "doc" }
  ]);

  // Recommendations grounded in detected information
  const [recommendations] = useState([
    {
      id: "rec-1",
      title: "Lock Board Calendar within 48 Hours",
      rationale: "European board members require flights booked 7 days prior. Resolving the Oct 20 vs 25 date prevents travel penalty fees.",
      impact: "High Cost & Operational Impact",
      suggestedAction: "Send calendar poll with priority vote to executive committee."
    },
    {
      id: "rec-2",
      title: "Consolidate Vendor Compliance into Single Vault Folder",
      rationale: "3 separate vendor agreements uploaded this month lacked updated tax IDs. Setting up an ingestion validation rule will block incomplete submissions.",
      impact: "Process Optimization",
      suggestedAction: "Enable mandatory Tax ID verification in Document Settings."
    }
  ]);

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === "Pending" ? "In Progress" : t.status === "In Progress" ? "Resolved" : "Pending";
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => filterPriority === "ALL" || t.priority === filterPriority);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#22D3EE", background: "rgba(6,182,212,0.12)", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
              Action Engine
            </span>
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>Information &rarr; Insight &rarr; Action</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#F8FAFC", marginTop: "6px" }}>
            Action Center & Workflow
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.92rem", marginTop: "4px" }}>
            Prioritized tasks, event timelines, and information-grounded executive recommendations.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: "flex", background: "rgba(10, 22, 40, 0.7)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "12px", padding: "4px" }}>
          {[
            { id: "center", label: "Action Center (" + tasks.filter(t => t.status !== "Resolved").length + ")" },
            { id: "timeline", label: "Information Timeline" },
            { id: "recommendations", label: "AI Recommendations" },
            { id: "workflow", label: "Attention Workflow" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                color: activeTab === tab.id ? "#FFFFFF" : "#94A3B8",
                background: activeTab === tab.id ? "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)" : "transparent",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ACTION CENTER */}
      {activeTab === "center" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Filter Bar */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ color: "#64748B", fontSize: "0.8rem", fontWeight: 600 }}>Filter Priority:</span>
            {["ALL", "Critical", "High", "Medium"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: filterPriority === p ? "1px solid #22D3EE" : "1px solid rgba(59, 130, 246, 0.2)",
                  background: filterPriority === p ? "rgba(6, 182, 212, 0.15)" : "rgba(15, 32, 68, 0.5)",
                  color: filterPriority === p ? "#22D3EE" : "#94A3B8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Task Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  background: t.status === "Resolved" ? "rgba(16, 185, 129, 0.05)" : "rgba(10, 22, 40, 0.75)",
                  border: t.status === "Resolved" ? "1px solid rgba(16, 185, 129, 0.3)" : t.priority === "Critical" ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(59, 130, 246, 0.2)",
                  borderRadius: "18px",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: t.priority === "Critical" ? "#EF4444" : t.priority === "High" ? "#F59E0B" : "#3B82F6",
                        background: t.priority === "Critical" ? "rgba(239,68,68,0.12)" : t.priority === "High" ? "rgba(245,158,11,0.12)" : "rgba(59,130,246,0.12)",
                        padding: "2px 8px",
                        borderRadius: "6px"
                      }}>
                        {t.priority.toUpperCase()}
                      </span>
                      <span style={{ color: "#64748B", fontSize: "0.75rem" }}>Source: {t.source}</span>
                    </div>
                    <h3 style={{ color: "#F8FAFC", fontSize: "1.1rem", fontWeight: 700, marginTop: "6px" }}>
                      {t.task}
                    </h3>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: t.status === "Resolved" ? "rgba(16, 185, 129, 0.2)" : t.status === "In Progress" ? "rgba(245, 158, 11, 0.2)" : "rgba(37, 99, 235, 0.2)",
                      color: t.status === "Resolved" ? "#34D399" : t.status === "In Progress" ? "#FBBF24" : "#60A5FA",
                      border: t.status === "Resolved" ? "1px solid rgba(16, 185, 129, 0.4)" : t.status === "In Progress" ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid rgba(59, 130, 246, 0.4)"
                    }}
                  >
                    Status: {t.status} (Click to change)
                  </button>
                </div>

                <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  <strong>Trigger Reason:</strong> {t.reason}
                </p>

                <div style={{
                  background: "rgba(15, 32, 68, 0.5)",
                  border: "1px solid rgba(59, 130, 246, 0.15)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  fontSize: "0.8rem"
                }}>
                  <div style={{ color: "#22D3EE" }}>
                    <strong>Recommended Next Step:</strong> {t.nextStep}
                  </div>
                  <div style={{ color: "#F87171", fontWeight: 600 }}>
                    Deadline: {t.deadline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TIMELINE */}
      {activeTab === "timeline" && (
        <div style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "20px", padding: "28px" }}>
          <h3 style={{ color: "#F8FAFC", fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px" }}>
            Chronological Information Timeline
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingLeft: "24px" }}>
            <div style={{ position: "absolute", left: "7px", top: "10px", bottom: "10px", width: "2px", background: "rgba(59, 130, 246, 0.3)" }} />
            {timelineEvents.map((ev) => (
              <div key={ev.id} style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-24px", top: "4px", width: "16px", height: "16px", borderRadius: "50%", background: ev.type === "conflict" ? "#EF4444" : "#22D3EE", boxShadow: "0 0 10px " + (ev.type === "conflict" ? "#EF4444" : "#22D3EE") }} />
                <div style={{ color: "#64748B", fontSize: "0.75rem" }} dangerouslySetInnerHTML={{ __html: ev.time }} />
                <h4 style={{ color: "#F8FAFC", fontSize: "0.95rem", fontWeight: 600, marginTop: "2px" }}>{ev.title}</h4>
                <p style={{ color: "#94A3B8", fontSize: "0.82rem", marginTop: "3px" }}>{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECOMMENDATIONS */}
      {activeTab === "recommendations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {recommendations.map((rec) => (
            <div key={rec.id} style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "18px", padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "#22D3EE", background: "rgba(6,182,212,0.1)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                  {rec.impact}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>AI Synthesized Recommendation</span>
              </div>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.05rem", fontWeight: 700, marginTop: "8px" }}>{rec.title}</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "6px", lineHeight: 1.5 }}>{rec.rationale}</p>
              <div style={{ marginTop: "12px", background: "rgba(15, 32, 68, 0.5)", padding: "10px 14px", borderRadius: "10px", color: "#E2E8F0", fontSize: "0.82rem" }}>
                <strong>Action:</strong> {rec.suggestedAction}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. ATTENTION WORKFLOW */}
      {activeTab === "workflow" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {["Pending", "In Progress", "Resolved"].map((col) => (
            <div key={col} style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "18px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h4 style={{ color: "#F8FAFC", fontSize: "0.95rem", fontWeight: 700 }}>{col}</h4>
                <span style={{ background: "rgba(15, 32, 68, 0.6)", padding: "2px 8px", borderRadius: "6px", color: "#22D3EE", fontSize: "0.75rem", fontWeight: 700 }}>
                  {tasks.filter(t => t.status === col).length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tasks.filter(t => t.status === col).map((t) => (
                  <div key={t.id} style={{ background: "rgba(15, 32, 68, 0.5)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: "10px", padding: "12px" }}>
                    <div style={{ color: "#F8FAFC", fontSize: "0.85rem", fontWeight: 600 }}>{t.task}</div>
                    <div style={{ color: "#64748B", fontSize: "0.72rem", marginTop: "4px" }}>Due: {t.deadline}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/ActionsPage.jsx', content, 'utf8');
console.log('ActionsPage.jsx written');
