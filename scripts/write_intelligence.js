const fs = require('fs');
const content = `import React, { useState } from "react";
import { useI18n } from "../i18n/index";
import {
  BrainCircuit, AlertTriangle, HelpCircle, GitCompare, Share2,
  CheckCircle2, Info, ArrowRight, ShieldCheck, Check, Sparkles, Filter
} from "lucide-react";

export default function IntelligencePage() {
  const { t } = useI18n();
  const [activeSubSection, setActiveSubSection] = useState("conflicts"); // 'conflicts', 'missing', 'changes', 'compare', 'graph', 'explainable'

  // Conflict state with Automatic Issue Resolution toggle
  const [conflicts, setConflicts] = useState([
    {
      id: "conf-1",
      title: "Board Meeting Review Date Discrepancy",
      severity: "High",
      resolved: false,
      sourceA: {
        doc: "Quarterly Financial Board Directive.pdf",
        date: "Oct 8, 2026",
        val: "October 20, 2026"
      },
      sourceB: {
        doc: "Executive Operations Memo v2.docx",
        date: "Oct 7, 2026",
        val: "October 25, 2026"
      },
      whyItMatters: "Direct 5-day calendar divergence affects the regulatory audit submission deadline. Stakeholders in Europe and Americas require 48h calendar lock for travel itineraries.",
      resolutionPath: "Auto-reconcile with CFO Secretariat calendar or confirm addendum override."
    },
    {
      id: "conf-2",
      title: "Cloud Infrastructure Budget Ceiling",
      severity: "Medium",
      resolved: false,
      sourceA: {
        doc: "Approved Annual Operating Plan",
        date: "Sep 15, 2026",
        val: "$1,200,000"
      },
      sourceB: {
        doc: "Executive Operations Memo v2.docx",
        date: "Oct 7, 2026",
        val: "$1,450,000 (+$250,000 delta)"
      },
      whyItMatters: "Delta of $250k exceeds department discretionary sign-off limit. Requires formal Board Finance Committee ratification.",
      resolutionPath: "Approve Supplemental Allocation form signed by VP Infrastructure."
    }
  ]);

  // Missing Information Detection
  const [missingItems, setMissingItems] = useState([
    {
      id: "mis-1",
      targetDoc: "Project Falcon Architecture Submission",
      missingField: "Annexure C (Security Clearance Table)",
      impact: "Regulatory clearance cannot proceed without verified ISO-27001 certificate signatures.",
      sourceRef: "Defense Procurement Compliance Guidelines",
      resolved: false
    },
    {
      id: "mis-2",
      targetDoc: "Vendor Agreement Renewal 2026",
      missingField: "Vendor Tax Identification / GST Certificate",
      impact: "Accounts Payable cannot disburse withholding tax credits without valid tax documentation.",
      sourceRef: "Commercial Billing Master Policy",
      resolved: false
    }
  ]);

  // Change Detection
  const [changes] = useState([
    {
      id: "ch-1",
      item: "Project Falcon Target Uptime SLA",
      oldValue: "99.9%",
      newValue: "99.99%",
      source: "SLA Addendum v3",
      timestamp: "Oct 8, 2026 &bull; 14:30 EST",
      importance: "High"
    },
    {
      id: "ch-2",
      item: "Engineering Headcount Allocation",
      oldValue: "14 positions",
      newValue: "18 positions (+4 DevOps)",
      source: "Executive Operations Memo",
      timestamp: "Oct 8, 2026 &bull; 09:15 EST",
      importance: "Medium"
    },
    {
      id: "ch-3",
      item: "Primary Data Center Location",
      oldValue: "Frankfurt (eu-central-1)",
      newValue: "Zurich (ch-north-1) [Data Residency mandate]",
      source: "GDPR Compliance Addendum",
      timestamp: "Oct 7, 2026 &bull; 18:40 EST",
      importance: "High"
    }
  ]);

  // Compare Tool state
  const [selectedDocA, setSelectedDocA] = useState("Quarterly Financial Board Directive.pdf");
  const [selectedDocB, setSelectedDocB] = useState("Executive Operations Memo v2.docx");

  // Toggle Automatic Issue Resolution
  const toggleResolveConflict = (id) => {
    setConflicts(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));
  };

  const toggleResolveMissing = (id) => {
    setMissingItems(prev => prev.map(m => m.id === id ? { ...m, resolved: !m.resolved } : m));
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#22D3EE", background: "rgba(6,182,212,0.12)", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
              Core Intelligence Layer
            </span>
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>Contradictions &bull; Gaps &bull; Relationships</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#F8FAFC", marginTop: "6px" }}>
            Explainable Intelligence Engine
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.92rem", marginTop: "4px" }}>
            Real-time conflict detection, missing entity identification, chronological delta audit, and interactive knowledge mapping.
          </p>
        </div>

        {/* Sub-section Navigation */}
        <div style={{ display: "flex", background: "rgba(10, 22, 40, 0.7)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "12px", padding: "4px", flexWrap: "wrap", gap: "2px" }}>
          {[
            { id: "conflicts", label: "Conflicts (" + conflicts.filter(c => !c.resolved).length + ")" },
            { id: "missing", label: "Missing Info (" + missingItems.filter(m => !m.resolved).length + ")" },
            { id: "changes", label: "Change Audit" },
            { id: "compare", label: "Compare Tool" },
            { id: "graph", label: "Knowledge Graph" },
            { id: "explainable", label: "Explainable AI" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubSection(tab.id)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                color: activeSubSection === tab.id ? "#FFFFFF" : "#94A3B8",
                background: activeSubSection === tab.id ? "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)" : "transparent",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. CONFLICT DETECTION (Side-by-side comparison) */}
      {activeSubSection === "conflicts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {conflicts.map((conf) => (
            <div
              key={conf.id}
              style={{
                background: conf.resolved ? "rgba(16, 185, 129, 0.05)" : "rgba(10, 22, 40, 0.8)",
                border: conf.resolved ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: conf.resolved ? "#10B981" : "#EF4444",
                      background: conf.resolved ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                      padding: "2px 8px",
                      borderRadius: "6px"
                    }}>
                      {conf.resolved ? "ISSUE RESOLVED" : "CONFLICT DETECTED"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Severity: {conf.severity}</span>
                  </div>
                  <h3 style={{ color: "#F8FAFC", fontSize: "1.15rem", fontWeight: 700, marginTop: "6px" }}>
                    {conf.title}
                  </h3>
                </div>

                {/* Automatic Issue Resolution Button */}
                <button
                  onClick={() => toggleResolveConflict(conf.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    background: conf.resolved ? "rgba(15, 32, 68, 0.8)" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  <Check size={16} />
                  <span>{conf.resolved ? "Mark Unresolved" : "Auto-Resolve Conflict"}</span>
                </button>
              </div>

              {/* Side-by-Side Sources Comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <div style={{ background: "rgba(15, 32, 68, 0.5)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "14px", padding: "16px" }}>
                  <div style={{ fontSize: "0.72rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase" }}>Source Document A</div>
                  <h4 style={{ color: "#F1F5F9", fontSize: "0.9rem", fontWeight: 600, marginTop: "4px" }}>{conf.sourceA.doc}</h4>
                  <div style={{ color: "#64748B", fontSize: "0.75rem" }}>Logged: {conf.sourceA.date}</div>
                  <div style={{ marginTop: "12px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "10px", color: "#FCA5A5", fontWeight: 700, fontSize: "0.95rem" }}>
                    Stated Value: {conf.sourceA.val}
                  </div>
                </div>

                <div style={{ background: "rgba(15, 32, 68, 0.5)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "14px", padding: "16px" }}>
                  <div style={{ fontSize: "0.72rem", color: "#22D3EE", fontWeight: 700, textTransform: "uppercase" }}>Source Document B</div>
                  <h4 style={{ color: "#F1F5F9", fontSize: "0.9rem", fontWeight: 600, marginTop: "4px" }}>{conf.sourceB.doc}</h4>
                  <div style={{ color: "#64748B", fontSize: "0.75rem" }}>Logged: {conf.sourceB.date}</div>
                  <div style={{ marginTop: "12px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "10px", color: "#FCA5A5", fontWeight: 700, fontSize: "0.95rem" }}>
                    Stated Value: {conf.sourceB.val}
                  </div>
                </div>
              </div>

              {/* Explainable AI: Why it matters */}
              <div style={{ background: "rgba(10, 22, 40, 0.6)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "12px", padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#22D3EE", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
                  <Info size={14} />
                  <span>Explainable AI &bull; Why This Conflict Matters</span>
                </div>
                <p style={{ color: "#CBD5E1", fontSize: "0.85rem", marginTop: "6px", lineHeight: 1.5 }}>
                  {conf.whyItMatters}
                </p>
                <div style={{ color: "#94A3B8", fontSize: "0.78rem", marginTop: "6px" }}>
                  <strong>Recommended Resolution Path:</strong> {conf.resolutionPath}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. MISSING INFORMATION DETECTION */}
      {activeSubSection === "missing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {missingItems.map((mis) => (
            <div
              key={mis.id}
              style={{
                background: mis.resolved ? "rgba(16, 185, 129, 0.05)" : "rgba(10, 22, 40, 0.8)",
                border: mis.resolved ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "18px",
                padding: "22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div style={{ maxWidth: 760 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.72rem", color: mis.resolved ? "#10B981" : "#F59E0B", fontWeight: 700, background: mis.resolved ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                    {mis.resolved ? "GAP RESOLVED" : "MISSING MANDATORY FIELD"}
                  </span>
                  <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>in {mis.targetDoc}</span>
                </div>
                <h3 style={{ color: "#F8FAFC", fontSize: "1.05rem", fontWeight: 700, marginTop: "6px" }}>
                  Missing: {mis.missingField}
                </h3>
                <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "4px", lineHeight: 1.5 }}>
                  {mis.impact}
                </p>
                <div style={{ color: "#64748B", fontSize: "0.75rem", marginTop: "4px" }}>
                  Mandated by: {mis.sourceRef}
                </div>
              </div>

              <button
                onClick={() => toggleResolveMissing(mis.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: mis.resolved ? "rgba(15, 32, 68, 0.8)" : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                <Check size={16} />
                <span>{mis.resolved ? "Mark Incomplete" : "Mark Resolved"}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. CHANGE DETECTION (Audit Log) */}
      {activeSubSection === "changes" && (
        <div style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "20px", padding: "24px" }}>
          <h3 style={{ color: "#F8FAFC", fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
            Chronological Information Delta Audit
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {changes.map((ch) => (
              <div key={ch.id} style={{ background: "rgba(15, 32, 68, 0.45)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: "14px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h4 style={{ color: "#F8FAFC", fontSize: "0.95rem", fontWeight: 600 }}>{ch.item}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", fontSize: "0.82rem" }}>
                    <span style={{ color: "#94A3B8", textDecoration: "line-through" }}>{ch.oldValue}</span>
                    <span style={{ color: "#64748B" }}>&rarr;</span>
                    <span style={{ color: "#34D399", fontWeight: 700 }}>{ch.newValue}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#22D3EE", fontSize: "0.8rem", fontWeight: 600 }}>Source: {ch.source}</div>
                  <div style={{ color: "#64748B", fontSize: "0.72rem", marginTop: "2px" }} dangerouslySetInnerHTML={{ __html: ch.timestamp }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMPARE TOOL */}
      {activeSubSection === "compare" && (
        <div style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ color: "#F8FAFC", fontSize: "1.1rem", fontWeight: 700 }}>
            Side-by-Side Multi-Source Comparison
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div style={{ background: "rgba(15, 32, 68, 0.45)", borderRadius: "14px", padding: "18px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <div style={{ color: "#22D3EE", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Primary Document</div>
              <h4 style={{ color: "#F8FAFC", fontSize: "0.95rem", marginTop: "4px" }}>{selectedDocA}</h4>
              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
                <div style={{ color: "#94A3B8" }}>&bull; Review Date: <strong>Oct 20, 2026</strong></div>
                <div style={{ color: "#94A3B8" }}>&bull; Budget Scope: <strong>$1.20M</strong></div>
                <div style={{ color: "#94A3B8" }}>&bull; Compliance Status: <strong>Pending CFO counter-sign</strong></div>
              </div>
            </div>

            <div style={{ background: "rgba(15, 32, 68, 0.45)", borderRadius: "14px", padding: "18px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <div style={{ color: "#60A5FA", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Comparative Document</div>
              <h4 style={{ color: "#F8FAFC", fontSize: "0.95rem", marginTop: "4px" }}>{selectedDocB}</h4>
              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
                <div style={{ color: "#FCA5A5" }}>&bull; Review Date: <strong>Oct 25, 2026 (Mismatch)</strong></div>
                <div style={{ color: "#FCA5A5" }}>&bull; Budget Scope: <strong>$1.45M (+$250k Delta)</strong></div>
                <div style={{ color: "#94A3B8" }}>&bull; Compliance Status: <strong>VP Infrastructure signed</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. KNOWLEDGE GRAPH CANVAS (Lightweight, SVG-based) */}
      {activeSubSection === "graph" && (
        <div style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "20px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ color: "#F8FAFC", fontSize: "1.1rem", fontWeight: 700 }}>Interactive Knowledge Relationships</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.82rem" }}>Lightweight vector graph connecting documents, owners, dates, and action items.</p>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#22D3EE", background: "rgba(6,182,212,0.1)", padding: "4px 10px", borderRadius: "6px" }}>6 Connected Nodes</span>
          </div>

          <div style={{
            width: "100%",
            height: "360px",
            background: "rgba(3, 7, 18, 0.7)",
            borderRadius: "16px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="100%" height="100%" viewBox="0 0 700 340">
              {/* Lines */}
              <line x1="350" y1="170" x2="160" y2="80" stroke="rgba(59,130,246,0.4)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="350" y1="170" x2="540" y2="80" stroke="rgba(239,68,68,0.5)" strokeWidth="2" />
              <line x1="350" y1="170" x2="160" y2="260" stroke="rgba(16,185,129,0.4)" strokeWidth="2" />
              <line x1="350" y1="170" x2="540" y2="260" stroke="rgba(6,182,212,0.4)" strokeWidth="2" />
              <line x1="160" y1="80" x2="540" y2="80" stroke="rgba(239,68,68,0.6)" strokeWidth="2" strokeDasharray="3 3" />

              {/* Center Node: INFONEXIS Hub */}
              <circle cx="350" cy="170" r="38" fill="url(#centerGlow)" stroke="#22D3EE" strokeWidth="2" />
              <text x="350" y="174" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">INFONEXIS</text>

              {/* Node 1: Board Directive */}
              <circle cx="160" cy="80" r="30" fill="#0f2044" stroke="#3B82F6" strokeWidth="2" />
              <text x="160" y="84" fill="#E2E8F0" fontSize="10" textAnchor="middle">Directive</text>
              <text x="160" y="122" fill="#94A3B8" fontSize="9" textAnchor="middle">Oct 20 Review</text>

              {/* Node 2: Operations Memo */}
              <circle cx="540" cy="80" r="30" fill="#0f2044" stroke="#EF4444" strokeWidth="2" />
              <text x="540" y="84" fill="#E2E8F0" fontSize="10" textAnchor="middle">Ops Memo</text>
              <text x="540" y="122" fill="#F87171" fontSize="9" textAnchor="middle">Oct 25 (Conflict)</text>

              {/* Node 3: CFO Secretariate */}
              <circle cx="160" cy="260" r="28" fill="#0f2044" stroke="#10B981" strokeWidth="2" />
              <text x="160" y="264" fill="#E2E8F0" fontSize="10" textAnchor="middle">CFO Lead</text>
              <text x="160" y="298" fill="#94A3B8" fontSize="9" textAnchor="middle">Sign-Off</text>

              {/* Node 4: Action Items */}
              <circle cx="540" cy="260" r="28" fill="#0f2044" stroke="#22D3EE" strokeWidth="2" />
              <text x="540" y="264" fill="#E2E8F0" fontSize="10" textAnchor="middle">Action Task</text>
              <text x="540" y="298" fill="#94A3B8" fontSize="9" textAnchor="middle">Lock Calendar</text>

              <defs>
                <radialGradient id="centerGlow">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#0891B2" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* 6. EXPLAINABLE AI CARDS */}
      {activeSubSection === "explainable" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          <div style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "18px", padding: "22px" }}>
            <span style={{ fontSize: "0.72rem", color: "#22D3EE", fontWeight: 700, textTransform: "uppercase" }}>Decision Rationale #1</span>
            <h4 style={{ color: "#F8FAFC", fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Why did AI flag the October 20 vs 25 date?</h4>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "8px", lineHeight: 1.5 }}>
              The system mapped the semantic entity "Audit Review Deadline" across two active governance documents. Because both refer to the same fiscal entity (Q4 2026), contradictory dates constitute a blocking schedule conflict.
            </p>
            <div style={{ borderTop: "1px solid rgba(59, 130, 246, 0.15)", marginTop: "12px", paddingTop: "10px", color: "#64748B", fontSize: "0.75rem" }}>
              Grounding: Paragraph 4.1 Directive &bull; Section 2 Memo
            </div>
          </div>

          <div style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "18px", padding: "22px" }}>
            <span style={{ fontSize: "0.72rem", color: "#22D3EE", fontWeight: 700, textTransform: "uppercase" }}>Decision Rationale #2</span>
            <h4 style={{ color: "#F8FAFC", fontSize: "1rem", fontWeight: 700, marginTop: "6px" }}>Why is Annexure C classified as critical missing info?</h4>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "8px", lineHeight: 1.5 }}>
              Project Falcon was classified as Defense & Government tier based on header metadata. In this compliance category, security clearance tables are legally mandatory before system sign-off.
            </p>
            <div style={{ borderTop: "1px solid rgba(59, 130, 246, 0.15)", marginTop: "12px", paddingTop: "10px", color: "#64748B", fontSize: "0.75rem" }}>
              Grounding: Defense Procurement Master Standard &sect; 9
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/IntelligencePage.jsx', content, 'utf8');
console.log('IntelligencePage.jsx written');
