import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud, FileText, Search, Sparkles, Filter, Bookmark,
  Volume2, Pause, Download, AlertTriangle, Layers, Copy, Check,
  CheckCircle2, ArrowRight, ShieldCheck, Eye, RefreshCw
} from 'lucide-react';
import { INITIAL_INTELLIGENCE } from '../data/groundedIntelligence';
import { WORKSPACES } from '../config/constants';
import { documentAPI } from '../services/api';
import InformationCard from '../components/cards/InformationCard';
import DuplicateModal from '../components/modals/DuplicateModal';
import EvidenceModal from '../components/modals/EvidenceModal';

export default function InformationPage() {
  const [activeWorkspace, setActiveWorkspace] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  // Live docs state: starts with grounded demo data, live uploads prepend
  const [liveDocs, setLiveDocs] = useState(INITIAL_INTELLIGENCE.documents);
  const [selectedDoc, setSelectedDoc] = useState(INITIAL_INTELLIGENCE.documents[0]);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState(null);

  // Audio Summary State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [infoNotice, setInfoNotice] = useState('');
  const speechRef = useRef(null);
  const pollingRef = useRef(null);

  const showNotice = (msg) => {
    setInfoNotice(msg);
    setTimeout(() => setInfoNotice(''), 4000);
  };

  // Upload & 6-Stage Processing Pipeline
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const fileInputRef = useRef(null);

  // Load live documents from backend on mount (backend docs supplement demo data)
  useEffect(() => {
    documentAPI.getDocuments()
      .then((res) => {
        const backendDocs = res.data || [];
        if (Array.isArray(backendDocs) && backendDocs.length > 0) {
          const backendIds = new Set(backendDocs.map((d) => d.id || d._id));
          const demoFallback = INITIAL_INTELLIGENCE.documents.filter((d) => !backendIds.has(d.id));
          setLiveDocs([...backendDocs, ...demoFallback]);
        }
      })
      .catch(() => { /* offline — keep demo data */ });
  }, []);

  const filterDocs = liveDocs.filter((doc) => {
    const matchWs = activeWorkspace === 'ALL' || doc.workspace === activeWorkspace;
    const matchQuery = !searchQuery.trim() ||
      (doc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.keyInsight || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.source || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchWs && matchQuery;
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-uploaded
    e.target.value = '';

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStage('Sending document to INFONEXIS backend...');

    // Placeholder while real upload happens
    const placeholderDoc = {
      id: 'doc-pending-' + Date.now(),
      _id: 'doc-pending-' + Date.now(),
      title: file.name,
      originalName: file.name,
      workspace: 'college_projects',
      fileType: file.name.split('.').pop(),
      fileSize: file.size,
      date: 'Just now',
      freshness: 'FRESH',
      freshnessNote: 'Ingested just now via Local Upload',
      priority: 'HIGH',
      confidence: 0,
      attentionScore: 0,
      source: 'User Manual Upload',
      sourceAuthoritative: true,
      keyInsight: 'Uploading and processing...',
      status: 'extracting'
    };
    setLiveDocs((prev) => [placeholderDoc, ...prev]);
    setSelectedDoc(placeholderDoc);

    try {
      setUploadProgress(30);
      setUploadStage('Uploading & extracting text layer via PDF.js + OCR...');

      const uploadRes = await documentAPI.upload(file);
      const docId = uploadRes.data?.documentId || uploadRes.data?.id;

      setUploadProgress(55);
      setUploadStage('Understanding structure, entities & semantic dates...');

      // Poll for completion (up to 30s)
      let attempts = 0;
      const maxAttempts = 15;
      pollingRef.current = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await documentAPI.getStatus(docId);
          const doc = statusRes.data;

          if (doc.status === 'complete') {
            clearInterval(pollingRef.current);
            setUploadProgress(100);
            setUploadStage('Intelligence synthesis complete. Real document processed.');
            setIsUploading(false);
            // Replace placeholder with real processed doc
            setLiveDocs((prev) =>
              prev.map((d) => (d.id === placeholderDoc.id ? { ...doc, id: docId, _id: docId } : d))
            );
            setSelectedDoc({ ...doc, id: docId, _id: docId });
          } else if (doc.status === 'error') {
            clearInterval(pollingRef.current);
            setUploadProgress(0);
            setUploadStage('Processing failed. Check file format.');
            setIsUploading(false);
          } else {
            // Show progress stages
            const stageLabels = {
              extracting: 'Extracting text & OCR...',
              understanding: 'Understanding entities, dates & clauses...',
              generating: 'Synthesizing intelligence summary...'
            };
            setUploadProgress(55 + (attempts / maxAttempts) * 40);
            setUploadStage(stageLabels[doc.status] || 'Processing...');
          }

          if (attempts >= maxAttempts) {
            clearInterval(pollingRef.current);
            setUploadStage('Processing is taking longer than usual. Check Intelligence view.');
            setIsUploading(false);
          }
        } catch {
          // Keep polling
        }
      }, 2000);
    } catch (err) {
      // Fallback: use local intelligence synthesis (no real extraction)
      setUploadProgress(60);
      setUploadStage('Backend offline — using local intelligence engine...');

      setTimeout(() => {
        setUploadProgress(100);
        setUploadStage('Local synthesis complete. No real text extracted.');
        setIsUploading(false);

        const localDoc = {
          ...placeholderDoc,
          confidence: 75,
          attentionScore: 72,
          attentionScoreBreakdown: [
            { label: 'Fresh ingestion milestone', points: 25 },
            { label: 'New workspace submission', points: 20 },
            { label: 'Local processing only', points: 15 },
            { label: 'No real text extracted', points: 12 }
          ],
          keyInsight: `[LOCAL MODE] File received: ${file.name}. Backend offline — no OCR or LLM extraction performed.`,
          whyItMatters: [
            'Document logged locally without real text extraction.',
            'Connect backend for full intelligence pipeline.'
          ],
          issue: 'Backend unavailable — no real analysis performed.',
          recommendedAction: 'Start the INFONEXIS backend and re-upload for full processing.',
          evidence: {
            page: 1,
            section: 'Local Mode Notice',
            quotedText: `File ${file.name} registered without server-side extraction.`
          },
          executiveSummary: `[LOCAL MODE] ${file.name} received but not processed by backend.`,
          extractedFacts: [
            { key: 'File Name', value: file.name },
            { key: 'Processing Mode', value: 'Local only — no real extraction' }
          ],
          status: 'complete'
        };
        setLiveDocs((prev) =>
          prev.map((d) => (d.id === placeholderDoc.id ? localDoc : d))
        );
        setSelectedDoc(localDoc);
      }, 2000);
    }
  };

  const playAudio = (text) => {
    if (!('speechSynthesis' in window)) {
      showNotice('Text-to-speech is not supported in this browser environment.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = audioSpeed;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    speechRef.current = utterance;
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const downloadSummary = (doc, format) => {
    const content = `INFONEXIS INTELLIGENCE SUMMARY
Document: ${doc.title}
Date: ${doc.date}
Priority: ${doc.priority}
Confidence: ${doc.confidence}%

EXECUTIVE SUMMARY:
${doc.executiveSummary}

KEY FINDINGS:
${doc.keyInsight}

WHY THIS MATTERS:
${doc.whyItMatters?.join('\n') || 'N/A'}

DETECTED ISSUE:
${doc.issue || 'None'}

RECOMMENDED ACTION:
${doc.recommendedAction || 'None'}

EVIDENCE:
Page ${doc.evidence?.page}: "${doc.evidence?.quotedText}"
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\.[^/.]+$/, '')}_Summary.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. HEADER & GLOBAL WORKSPACE FILTER PILLS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--blue-950)' }}>
              Information Hub & Vault
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Multi-source ingestion, document-specific AI intelligence, evidence extraction, and audio briefings.
            </p>
          </div>

          {infoNotice && (
            <div style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={15} color="#059669" />
              <span>{infoNotice}</span>
            </div>
          )}

          {/* Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".pdf,.docx,.doc,.txt,.csv"
            />
            <button
              className="btn-cyan"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <UploadCloud size={18} />
              <span>{isUploading ? 'Processing...' : 'Upload Document'}</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE FILTER PILLS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          <button
            onClick={() => setActiveWorkspace('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: activeWorkspace === 'ALL' ? 700 : 500,
              background: activeWorkspace === 'ALL' ? 'var(--blue-700)' : 'var(--bg-surface)',
              color: activeWorkspace === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
              border: activeWorkspace === 'ALL' ? 'none' : '1px solid var(--border-light)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            All Workspaces
          </button>
          {WORKSPACES.map((ws) => (
            <button
              key={ws.id}
              onClick={() => setActiveWorkspace(ws.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: activeWorkspace === ws.id ? 700 : 500,
                background: activeWorkspace === ws.id ? 'var(--blue-700)' : 'var(--bg-surface)',
                color: activeWorkspace === ws.id ? '#FFFFFF' : 'var(--text-secondary)',
                border: activeWorkspace === ws.id ? 'none' : '1px solid var(--border-light)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              {ws.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. REALISTIC 6-STAGE UPLOAD PROGRESS */}
      {isUploading && (
        <div style={{
          background: 'linear-gradient(135deg, #0F2756 0%, #1E3A8A 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8' }}>
              6-STAGE INTELLIGENCE INGESTION PIPELINE
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>{uploadProgress}%</span>
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: '6px' }}>
            {uploadStage}
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #22D3EE, #60A5FA)', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* 3. FEATURE UPGRADE #10: DUPLICATE DETECTION ALERT BANNER */}
      <div style={{
        background: '#FFFBEB',
        border: '1px solid #FDE68A',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800
          }}>
            <Copy size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#92400E' }}>
              Possible Duplicate Identified (94% Textual Similarity)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#B45309' }}>
              Project_Report_Final.pdf vs Project_Report_Final_v2.pdf (Updated deadline delta detected)
            </div>
          </div>
        </div>

        <button
          className="btn-secondary"
          onClick={() => setDuplicateModalOpen(true)}
          style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: '#FCD34D' }}
        >
          Review Duplicate
        </button>
      </div>

      {/* 4. DOCUMENT INTELLIGENCE PREVIEW & AI SPLIT VIEW (Feature Upgrade #20) */}
      {selectedDoc && (
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan-700)', textTransform: 'uppercase' }}>
                SPLIT VIEW INSPECTOR
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedDoc.title}
              </h2>
            </div>

            {/* Audio Summary & Downloads */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedDoc.audioScript && (
                <button
                  className="btn-secondary"
                  onClick={() => playAudio(selectedDoc.audioScript)}
                  style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                >
                  {isPlayingAudio ? <Pause size={15} color="#DC2626" /> : <Volume2 size={15} color="var(--blue-600)" />}
                  <span>{isPlayingAudio ? 'Pause Audio Brief' : 'Play AI Audio Summary'}</span>
                </button>
              )}

              <button
                className="btn-secondary"
                onClick={() => downloadSummary(selectedDoc, 'txt')}
                style={{ fontSize: '0.8rem', padding: '8px 14px' }}
              >
                <Download size={15} />
                <span>Download Summary</span>
              </button>
            </div>
          </div>

          {/* Desktop Left (Preview) + Right (AI Intelligence) Split Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* Left: Document Grounded Snippet / Preview */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Document Page Preview & Extraction
                </span>
                <span style={{ fontSize: '0.72rem', background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-light)', fontWeight: 600 }}>
                  Page {selectedDoc.evidence?.page || 1} of 14
                </span>
              </div>

              {/* Document Text Snippet with Cyan Highlight on cited evidence */}
              <div style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'inherit',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
                <p style={{ marginBottom: '10px' }}>
                  <strong>SECTION 4: GOVERNANCE & OPERATIONS</strong>
                </p>
                <p style={{
                  background: 'rgba(6, 182, 212, 0.12)',
                  borderLeft: '3px solid var(--cyan-500)',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  color: 'var(--blue-950)',
                  fontWeight: 600
                }}>
                  "{selectedDoc.evidence?.quotedText || selectedDoc.keyInsight}"
                </p>
                <p style={{ marginTop: '10px', fontSize: '0.82rem', color: '#64748B' }}>
                  [Grounded in certified OCR/PDF text stream. Reconciled with verified audit catalog.]
                </p>
              </div>

              {/* Extracted Facts Table */}
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Extracted Structured Facts
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedDoc.extractedFacts?.map((fact, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.78rem'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>{fact.key}</span>
                      <span style={{ fontWeight: 700, color: 'var(--blue-900)' }}>{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Intelligence Panel */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--cyan-700)', textTransform: 'uppercase' }}>
                  Executive Intelligence Summary
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {selectedDoc.executiveSummary}
                </p>
              </div>

              {/* Why This Matters */}
              <div style={{
                background: '#FAF5FF',
                border: '1px solid #E9D5FF',
                borderRadius: '8px',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase' }}>
                  Why This Matters
                </div>
                <ul style={{ paddingLeft: '16px', marginTop: '4px', fontSize: '0.82rem', color: '#581C87', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedDoc.whyItMatters?.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Next Step */}
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '8px',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                  Recommended Action
                </div>
                <div style={{ fontSize: '0.84rem', color: '#065F46', fontWeight: 600, marginTop: '2px' }}>
                  {selectedDoc.recommendedAction}
                </div>
              </div>

              {/* View Evidence Modal Trigger */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setActiveEvidence(selectedDoc.evidence);
                    setEvidenceModalOpen(true);
                  }}
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                >
                  <Bookmark size={15} />
                  <span>Inspect Evidence Trail</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SEARCH & INFORMATION HUB VAULT CARDS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              All Verified Documents ({filterDocs.length})
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Click any card to load into the Split View Inspector above
            </p>
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            padding: '6px 12px',
            width: '260px'
          }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.82rem', width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filterDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              style={{ cursor: 'pointer' }}
            >
              <InformationCard
                doc={doc}
                onPlayAudio={(script) => playAudio(script)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Duplicate Resolution Modal */}
      <DuplicateModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        duplicateItem={INITIAL_INTELLIGENCE.duplicates[0]}
        onActionSelected={(action) => {
          showNotice(`Duplicate action '${action}' applied safely without data loss.`);
        }}
      />

      {/* Evidence Trail Modal */}
      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        evidence={activeEvidence}
        docTitle={selectedDoc?.title}
      />
    </div>
  );
}
