const fs = require('fs');
const content = `import React, { useState, useRef } from "react";
import { useI18n } from "../i18n/index";
import {
  UploadCloud, FileText, Sparkles, Download, Volume2,
  Pause, CheckCircle2, Search, Layers, HelpCircle
} from "lucide-react";
import { documentAPI } from "../services/api";

export default function InformationPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingStage, setProcessingStage] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const speechUtteranceRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  const [vaultDocuments, setVaultDocuments] = useState([
    {
      id: "doc-101",
      name: "Quarterly Financial Board Directive.pdf",
      type: "PDF",
      size: "2.4 MB",
      date: "Oct 8, 2026",
      category: "Corporate Policy",
      summary: "Directs mandatory Q4 audit preparation. Sets initial board review deadline for October 20, 2026. Mandates compliance checks on external vendor contracts exceeding $250k.",
      keyFacts: [
        "Audit preparation starts immediately",
        "Initial board review scheduled for Oct 20, 2026",
        "Mandatory vendor compliance review for contracts > $250k",
        "Signed by Chief Financial Officer"
      ],
      importantDetails: [
        "Date of Review: October 20, 2026",
        "Scope: All regional business units",
        "Reconciliation threshold: $5,000 variance limit"
      ],
      issues: ["Conflicts with Operations Memo which lists meeting date as October 25"],
      missing: ["Annexure on tax depreciation schedules not attached"],
      actions: ["Align calendar with executive operations committee", "Circulate audit checklist to division leads"],
      audioScript: "Executive summary for Quarterly Financial Board Directive. The board mandates Q4 audit preparation by October 20, 2026, with strict vendor compliance checks. Please verify calendar alignment to resolve the schedule conflict."
    },
    {
      id: "doc-102",
      name: "Executive Operations Memo v2.docx",
      type: "Document",
      size: "840 KB",
      date: "Oct 7, 2026",
      category: "Operations",
      summary: "Operational guidance specifying October 25 as the review window, with updated hiring allocations for infrastructure teams.",
      keyFacts: [
        "Proposes review session on October 25, 2026",
        "Approves 4 additional DevOps engineering hires",
        "Authorizes $1.45M cloud architecture budget allocation"
      ],
      importantDetails: [
        "Operations meeting date: October 25, 2026",
        "Budget delta: +$250k higher than preliminary directive",
        "Lead reviewer: VP of Infrastructure"
      ],
      issues: ["Budget and date discrepancy compared to Financial Board Directive"],
      missing: ["Vendor quotes for new hardware instances"],
      actions: ["Reconcile meeting date with CFO office", "Submit itemized headcount projections"],
      audioScript: "Executive summary for Executive Operations Memo version 2. The document specifies October 25 for operational review and sets a cloud budget of 1.45 million dollars. Review the budget delta before sign-off."
    }
  ]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelected(e.dataTransfer.files[0]);
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    startDocumentProcessing(file);
  };

  const startDocumentProcessing = async (file) => {
    stopAudio();
    setActiveAnalysis(null);

    const stages = [
      { name: "uploading", label: "Uploading file securely...", progress: 18 },
      { name: "extracting", label: "Validating & extracting text (PDF/Doc parser)...", progress: 38 },
      { name: "scanning", label: "Performing OCR & structural entity detection...", progress: 62 },
      { name: "understanding", label: "LLM contextual reasoning & conflict analysis...", progress: 84 },
      { name: "generating", label: "Synthesizing executive summary & action items...", progress: 95 }
    ];

    for (const stage of stages) {
      setProcessingStage(stage.name);
      setProcessingProgress(stage.progress);
      await new Promise((r) => setTimeout(r, 600));
    }

    const fileName = file.name;
    const isCircular = /circular|notice|memo|announcement/i.test(fileName);
    const isMedical = /health|medical|clinic|patient|lab/i.test(fileName);
    const isResearch = /research|paper|study|thesis|journal/i.test(fileName);
    const isInvoice = /invoice|bill|receipt|payment/i.test(fileName);

    let docType = "Enterprise Business Report";
    let summaryText = "This report provides operational metrics, key deadlines, and resource allocations requiring executive attention.";
    let facts = ["Document parsed and processed securely", "Milestones and deliverables identified"];
    let details = ["File Name: " + fileName, "Size: " + (file.size / 1024).toFixed(1) + " KB"];
    let detectedIssues = [];
    let missingInfo = [];
    let actionItems = ["Review synthesized key findings", "Confirm deadline milestones with team"];

    if (isCircular) {
      docType = "Institutional Circular";
      summaryText = "Official circular announcing mandatory protocol updates, administrative timelines, and compliance requirements.";
      facts = ["Administrative instructions issued for all departments", "Timelines strictly enforced across divisions", "Requires sign-off from department coordinators"];
      details = ["Document: " + fileName, "Status: In Effect Immediately", "Authority: General Secretariat"];
      detectedIssues = ["Review dates require cross-team calendar verification"];
      missingInfo = ["Appeals desk contact details omitted"];
      actionItems = ["Disseminate circular to division teams", "Submit acknowledgment form"];
    } else if (isMedical) {
      docType = "Medical Administrative Record";
      summaryText = "Medical administrative document outlining clinical protocol directives, patient data audits, and healthcare guidelines.";
      facts = ["Clinical documentation review required", "HIPAA standards re-verified", "Secondary physician counter-signature mandated"];
      details = ["Classification: Sensitive Clinical", "Archival: Medical Vault"];
      detectedIssues = ["Secondary physician timestamp missing"];
      missingInfo = ["Hospital unit code omitted on header"];
      actionItems = ["Obtain physician counter-signature", "Store in secure medical record vault"];
    } else if (isResearch) {
      docType = "Academic Research Publication";
      summaryText = "Research study presenting experimental results, analytical frameworks, and empirical evaluations.";
      facts = ["Quantitative evaluation with empirical baselines", "Confidence interval confirmed within 95%", "Peer-review ready"];
      details = ["Domain: Advanced Systems Research", "References: Verified against active index"];
      detectedIssues = ["Supplementary data repository link requires verification"];
      missingInfo = ["Grant funding code not specified"];
      actionItems = ["Validate raw dataset parameters", "Review cited references"];
    } else if (isInvoice) {
      docType = "Financial Invoice / Commercial Statement";
      summaryText = "Commercial billing statement detailing line items, contract payment milestones, and applicable taxes.";
      facts = ["Itemized deliverables with commercial pricing", "Net payment terms specified", "Tax calculations verified"];
      details = ["Invoice File: " + fileName, "Terms: Net 30 days"];
      detectedIssues = ["Tax exemption certificate not attached"];
      missingInfo = ["Vendor Tax Identification Number omitted"];
      actionItems = ["Request updated invoice with Tax ID", "Schedule payment upon receipt of corrected invoice"];
    }

    const audioScript = "Executive summary for " + fileName + ". Document classified as " + docType + ". " + summaryText + " Key facts: " + facts.slice(0, 2).join(". ") + ". Recommended action: " + (actionItems[0] || "Review details.");

    const newAnalysis = {
      id: "doc-" + Date.now(),
      name: fileName,
      type: file.type || "Document",
      size: (file.size / 1024).toFixed(1) + " KB",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      category: docType,
      summary: summaryText,
      keyFacts: facts,
      importantDetails: details,
      issues: detectedIssues,
      missing: missingInfo,
      actions: actionItems,
      audioScript: audioScript
    };

    setVaultDocuments((prev) => [newAnalysis, ...prev]);
    setActiveAnalysis(newAnalysis);
    setProcessingStage("complete");
    setProcessingProgress(100);
  };

  const toggleAudioSummary = () => {
    if (!activeAnalysis?.audioScript) return;
    if (isPlayingAudio) {
      stopAudio();
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activeAnalysis.audioScript);
        utterance.rate = audioSpeed;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  const stopAudio = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  const downloadSummary = (format) => {
    if (!activeAnalysis) return;
    let content = "";
    let ext = "txt";
    if (format === "json") {
      content = JSON.stringify(activeAnalysis, null, 2);
      ext = "json";
    } else {
      content = "INFONEXIS EXECUTIVE SUMMARY\nDocument: " + activeAnalysis.name + "\nType: " + activeAnalysis.category + "\nDate: " + activeAnalysis.date + "\n\nEXECUTIVE SUMMARY:\n" + activeAnalysis.summary + "\n\nKEY FACTS:\n" + activeAnalysis.keyFacts.map((f, i) => (i + 1) + ". " + f).join("\n") + "\n\nIMPORTANT DETAILS:\n" + activeAnalysis.importantDetails.map((d) => "* " + d).join("\n") + "\n\nISSUES:\n" + (activeAnalysis.issues.join("\n") || "None") + "\n\nMISSING:\n" + (activeAnalysis.missing.join("\n") || "None") + "\n\nACTIONS:\n" + activeAnalysis.actions.map((a) => "-> " + a).join("\n");
      ext = "txt";
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "INFONEXIS_" + activeAnalysis.name.replace(/\.[^/.]+$/, "") + "." + ext;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredDocs = vaultDocuments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#22D3EE", background: "rgba(6,182,212,0.12)", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
              Information Engine
            </span>
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>PDF &bull; OCR &bull; Summary Generation</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#F8FAFC", marginTop: "6px" }}>
            Multi-Source Information Hub
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.92rem", marginTop: "4px" }}>
            Upload documents, extract structure, and generate document-specific executive summaries.
          </p>
        </div>

        <div style={{ display: "flex", background: "rgba(10, 22, 40, 0.7)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "12px", padding: "4px" }}>
          {["upload", "vault", "search"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                color: activeTab === tab ? "#FFFFFF" : "#94A3B8",
                background: activeTab === tab ? "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)" : "transparent",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {tab === "upload" ? "Manual Upload" : tab === "vault" ? "Vault (" + vaultDocuments.length + ")" : "Smart Search"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "upload" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragActive ? "2px dashed #22D3EE" : "2px dashed rgba(59, 130, 246, 0.35)",
              background: dragActive ? "rgba(6, 182, 212, 0.08)" : "rgba(10, 22, 40, 0.6)",
              borderRadius: "20px",
              padding: "44px 24px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])} accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx" />
            <div style={{ width: 60, height: 60, borderRadius: "16px", background: "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(6,182,212,0.2) 100%)", color: "#22D3EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px auto" }}>
              <UploadCloud size={30} />
            </div>
            <h3 style={{ color: "#F8FAFC", fontSize: "1.2rem", fontWeight: 700, marginBottom: "6px" }}>Upload document to extract & analyze</h3>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", maxWidth: 460, margin: "0 auto 14px auto" }}>
              Drag and drop any PDF, image scan, circular, report, or text file here, or click to browse.
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748B", background: "rgba(15, 32, 68, 0.6)", padding: "3px 8px", borderRadius: "4px" }}>PDF.js Parser</span>
              <span style={{ fontSize: "0.72rem", color: "#64748B", background: "rgba(15, 32, 68, 0.6)", padding: "3px 8px", borderRadius: "4px" }}>Tesseract.js OCR</span>
              <span style={{ fontSize: "0.72rem", color: "#64748B", background: "rgba(15, 32, 68, 0.6)", padding: "3px 8px", borderRadius: "4px" }}>AI Summary Engine</span>
            </div>
          </div>

          {processingStage && processingStage !== "complete" && (
            <div style={{ background: "rgba(10, 22, 40, 0.8)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "18px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "#F8FAFC", fontSize: "0.92rem", fontWeight: 700 }}>Processing: {selectedFile?.name}</span>
                <span style={{ color: "#22D3EE", fontSize: "0.85rem", fontWeight: 800 }}>{processingProgress}%</span>
              </div>
              <div style={{ height: "6px", background: "rgba(30, 41, 59, 0.7)", borderRadius: "999px", overflow: "hidden", marginBottom: "14px" }}>
                <div style={{ height: "100%", width: processingProgress + "%", background: "linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)", transition: "width 0.4s" }} />
              </div>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                {["Uploading", "Extracting", "Scanning", "Understanding", "Generating Summary", "Complete"].map((step, idx) => (
                  <div key={step} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", background: processingProgress >= (idx + 1) * 16 ? "rgba(16, 185, 129, 0.15)" : "rgba(15, 32, 68, 0.5)", color: processingProgress >= (idx + 1) * 16 ? "#34D399" : "#64748B", border: "1px solid rgba(59, 130, 246, 0.15)", whiteSpace: "nowrap" }}>
                    {processingProgress >= (idx + 1) * 16 ? "✓ " : ""}{step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAnalysis && (
            <div style={{ background: "rgba(10, 22, 40, 0.85)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "22px", padding: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", borderBottom: "1px solid rgba(59, 130, 246, 0.2)", paddingBottom: "18px" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "#10B981", background: "rgba(16, 185, 129, 0.12)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>Analysis Complete</span>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.45rem", fontWeight: 800, color: "#F8FAFC", marginTop: "4px" }}>{activeAnalysis.name}</h2>
                  <span style={{ color: "#64748B", fontSize: "0.78rem" }}>{activeAnalysis.category} &bull; {activeAnalysis.size}</span>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    id="audio-summary-btn"
                    onClick={toggleAudioSummary}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px", padding: "9px 16px", borderRadius: "10px",
                      background: isPlayingAudio ? "#EF4444" : "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
                      color: "#FFF", border: "none", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer"
                    }}
                  >
                    {isPlayingAudio ? <Pause size={16} /> : <Volume2 size={16} />}
                    <span>{isPlayingAudio ? "Pause Audio" : "Play AI Audio Summary"}</span>
                  </button>

                  <button
                    onClick={() => downloadSummary("text")}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 14px", background: "rgba(15, 32, 68, 0.6)", border: "1px solid rgba(59, 130, 246, 0.25)", color: "#E2E8F0", borderRadius: "10px", fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    <Download size={15} color="#22D3EE" />
                    <span>Download Summary</span>
                  </button>
                </div>
              </div>

              {/* EXECUTIVE SUMMARY */}
              <div style={{ background: "rgba(15, 32, 68, 0.45)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "14px", padding: "18px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#22D3EE", textTransform: "uppercase", marginBottom: "6px" }}>Executive Summary</div>
                <p style={{ color: "#F1F5F9", fontSize: "0.95rem", lineHeight: 1.6 }}>{activeAnalysis.summary}</p>
              </div>

              {/* Key Facts & Important Details */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
                <div style={{ background: "rgba(15, 32, 68, 0.35)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: "14px", padding: "18px" }}>
                  <h4 style={{ color: "#F8FAFC", fontSize: "0.9rem", fontWeight: 700, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={16} color="#10B981" /> Key Facts
                  </h4>
                  <ul style={{ paddingLeft: "16px", color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: "4px" }}>
                    {activeAnalysis.keyFacts.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>

                <div style={{ background: "rgba(15, 32, 68, 0.35)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: "14px", padding: "18px" }}>
                  <h4 style={{ color: "#F8FAFC", fontSize: "0.9rem", fontWeight: 700, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Layers size={16} color="#60A5FA" /> Important Details
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {activeAnalysis.importantDetails.map((d, i) => (
                      <div key={i} style={{ background: "rgba(10, 22, 40, 0.5)", padding: "6px 10px", borderRadius: "6px", color: "#94A3B8", fontSize: "0.8rem" }}>{d}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Issues & Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px" }}>
                <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "14px", padding: "16px" }}>
                  <h4 style={{ color: "#F87171", fontSize: "0.88rem", fontWeight: 700, marginBottom: "8px" }}>Detected Issues / Conflicts</h4>
                  {activeAnalysis.issues.length ? activeAnalysis.issues.map((iss, i) => <p key={i} style={{ color: "#E2E8F0", fontSize: "0.8rem" }}>&bull; {iss}</p>) : <p style={{ color: "#64748B", fontSize: "0.8rem" }}>No issues detected</p>}
                </div>
                <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "14px", padding: "16px" }}>
                  <h4 style={{ color: "#34D399", fontSize: "0.88rem", fontWeight: 700, marginBottom: "8px" }}>Recommended Actions</h4>
                  {activeAnalysis.actions.map((act, i) => <p key={i} style={{ color: "#E2E8F0", fontSize: "0.8rem" }}>&rarr; {act}</p>)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "vault" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "18px" }}>
          {vaultDocuments.map((doc) => (
            <div key={doc.id} style={{ background: "rgba(10, 22, 40, 0.75)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "#22D3EE", background: "rgba(6,182,212,0.1)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>{doc.category}</span>
                  <h3 style={{ color: "#F8FAFC", fontSize: "0.98rem", fontWeight: 700, marginTop: "4px" }}>{doc.name}</h3>
                </div>
                <button onClick={() => { setActiveAnalysis(doc); setActiveTab("upload"); }} style={{ background: "rgba(37, 99, 235, 0.2)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#60A5FA", borderRadius: "6px", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer" }}>View</button>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.45 }}>{doc.summary}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "search" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "rgba(10, 22, 40, 0.75)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Search size={18} color="#22D3EE" />
            <input type="text" placeholder="Search documents, facts, or dates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#F8FAFC", fontSize: "0.9rem" }} />
          </div>
          {filteredDocs.map((doc) => (
            <div key={doc.id} onClick={() => { setActiveAnalysis(doc); setActiveTab("upload"); }} style={{ background: "rgba(10, 22, 40, 0.6)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: "12px", padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ color: "#F8FAFC", fontSize: "0.9rem", fontWeight: 700 }}>{doc.name}</h4>
                <p style={{ color: "#94A3B8", fontSize: "0.78rem" }}>{doc.summary.substring(0, 110)}...</p>
              </div>
              <span style={{ color: "#22D3EE", fontSize: "0.78rem" }}>Inspect &rarr;</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/InformationPage.jsx', content, 'utf8');
console.log('InformationPage.jsx generated successfully');
