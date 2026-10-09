const mongoose = require('mongoose');
const User = require('../models/User');
const Document = require('../models/Document');
const Action = require('../models/Action');
const Issue = require('../models/Issue');
const Conversation = require('../models/Conversation');

// In-memory fallback stores for offline/development mode
const memoryStore = {
  users: new Map(),
  documents: new Map(),
  actions: new Map(),
  issues: new Map(),
  conversations: new Map(),
  resolutionHistory: [],
  changes: []
};

// Seed baseline intelligence data into in-memory store
function seedInitialData() {
  const initialDocs = [
    {
      _id: 'doc-1',
      id: 'doc-1',
      userId: 'system',
      title: 'Quarterly Financial Board Directive.pdf',
      originalName: 'Quarterly Financial Board Directive.pdf',
      fileName: 'directive_q4.pdf',
      fileType: 'pdf',
      fileSize: 2450000,
      workspace: 'college_projects',
      date: '2 hours ago',
      freshness: 'FRESH',
      freshnessNote: 'Received 2 hours ago via Administrative Conduit',
      priority: 'CRITICAL',
      confidence: 98,
      attentionScore: 92,
      attentionScoreBreakdown: [
        { label: 'Approaching Deadline (Mandatory Convocation)', points: 25 },
        { label: 'Schedule Contradiction with Ops Memo', points: 20 },
        { label: 'High-Impact Board Directive Source', points: 14 },
        { label: 'Fresh Ingestion (< 12 hours)', points: 13 },
        { label: 'Statutory Compliance Impact', points: 20 }
      ],
      source: 'Quarterly Board Circular / CFO Secretariat',
      sourceAuthoritative: true,
      keyInsight: 'Formal executive directive establishing mandatory convocation and $1.20M capital ceiling.',
      whyItMatters: [
        'Mandatory statutory compliance: Board convocation date governs all audit submissions.',
        'Imposes strict $1,200,000 ceiling on infrastructure spend without supplementary approvals.'
      ],
      issue: 'Direct date contradiction with Executive Operations Memo (Oct 20 vs Oct 25).',
      recommendedAction: 'Lock October 20th in executive calendars and notify Secretariat immediately.',
      evidence: {
        page: 3,
        section: 'Section 4.1: Review Milestones',
        quotedText: 'The preliminary board review shall formally convene on October 20, 2026. All departmental expenditure reconciliations exceeding $250,000 must be finalized 72 hours prior.'
      },
      executiveSummary: 'This directive establishes binding Q4 administrative milestones. Key mandate stipulates formal Board Review on October 20, 2026. Budget baseline fixed at $1.20M.',
      extractedFacts: [
        { key: 'Board Review Date', value: 'October 20, 2026' },
        { key: 'Budget Ceiling', value: '$1,200,000 USD' },
        { key: 'Signatory Authority', value: 'CFO Secretariat' },
        { key: 'Audit Submission Window', value: '72 hours prior' }
      ],
      entities: [
        { name: 'CFO Secretariat', type: 'Signatory Authority' },
        { name: 'Finance Committee', type: 'Governing Body' }
      ],
      status: 'complete',
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      _id: 'doc-2',
      id: 'doc-2',
      userId: 'system',
      title: 'Executive Operations Memo v2.docx',
      originalName: 'Executive Operations Memo v2.docx',
      fileName: 'ops_memo_v2.docx',
      fileType: 'docx',
      fileSize: 1180000,
      workspace: 'college_projects',
      date: '6 hours ago',
      freshness: 'FRESH',
      freshnessNote: 'Circulated 6 hours ago via Operations Steering Committee',
      priority: 'HIGH',
      confidence: 91,
      attentionScore: 86,
      attentionScoreBreakdown: [
        { label: 'Schedule Divergence (+5 days)', points: 20 },
        { label: 'Budget Variance Delta (+$250,000)', points: 20 },
        { label: 'Operational Headcount Expansion', points: 18 },
        { label: 'Fresh Ingestion (< 12 hours)', points: 13 },
        { label: 'Internal Operations Source', points: 15 }
      ],
      source: 'Operations Steering Committee Memo',
      sourceAuthoritative: false,
      keyInsight: 'Requests October 25th review deferral and $250,000 compute envelope increase.',
      whyItMatters: [
        '5-day schedule divergence threatens federal compliance window if unaddressed.',
        'Variance exceeds discretionary threshold ($50,000) by 500%, requiring board waiver.'
      ],
      issue: 'Unapproved 5-day timeline extension and unbudgeted $250,000 compute increase.',
      recommendedAction: 'Convene joint alignment session between VP Ops and CFO Secretariat.',
      evidence: {
        page: 2,
        section: 'Section 2.4: Timeline & Headcount Adjustment',
        quotedText: 'Due to cluster latency testing, operations review is shifted to October 25, 2026, with an updated cloud envelope of $1,450,000.'
      },
      executiveSummary: 'Operations Steering Committee memo citing infrastructure requirements, proposing October 25th review date and expanded $1.45M budget ceiling.',
      extractedFacts: [
        { key: 'Proposed Review Date', value: 'October 25, 2026' },
        { key: 'Requested Budget', value: '$1,450,000 USD' },
        { key: 'Additional Headcount', value: '4 Senior DevOps Engineers' }
      ],
      entities: [
        { name: 'VP Infrastructure', type: 'Author' },
        { name: 'Operations Committee', type: 'Department' }
      ],
      status: 'complete',
      createdAt: new Date(Date.now() - 21600000)
    },
    {
      _id: 'doc-3',
      id: 'doc-3',
      userId: 'system',
      title: 'Project Falcon Architecture Submission.pdf',
      originalName: 'Project Falcon Architecture Submission.pdf',
      fileName: 'project_falcon.pdf',
      fileType: 'pdf',
      fileSize: 4200000,
      workspace: 'college_projects',
      date: '1 day ago',
      freshness: 'RECENT',
      freshnessNote: 'Submitted yesterday',
      priority: 'CRITICAL',
      confidence: 88,
      attentionScore: 90,
      attentionScoreBreakdown: [
        { label: 'Missing Security Clearance Matrix (Annexure C)', points: 25 },
        { label: 'Regulatory Block Risk', points: 25 },
        { label: 'High Architecture Complexity', points: 20 },
        { label: 'Pending ISO-27001 Verification', points: 20 }
      ],
      source: 'Systems Architecture Review Board',
      sourceAuthoritative: true,
      keyInsight: 'High-availability microservice design submitted without mandatory Annexure C.',
      whyItMatters: [
        'Mandatory ISO-27001 security compliance check halted.',
        'Production deployment gate blocked until signature is uploaded.'
      ],
      issue: 'Annexure C (Security Clearance Matrix) missing from technical submission.',
      recommendedAction: 'Request Annexure C sign-off from Chief Security Architect.',
      evidence: {
        page: 11,
        section: 'Appendix Index',
        quotedText: 'Annexure C: ISO-27001 Clearance Matrix [File Reference: Missing].'
      },
      executiveSummary: 'Technical submission for Project Falcon architecture. Lacks Annexure C security matrix, freezing regulatory approval.',
      extractedFacts: [
        { key: 'Architecture Style', value: 'Event-driven Microservices' },
        { key: 'Missing Document', value: 'Annexure C (ISO-27001)' }
      ],
      entities: [
        { name: 'Architecture Review Board', type: 'Reviewer' }
      ],
      status: 'complete',
      createdAt: new Date(Date.now() - 86400000)
    }
  ];

  initialDocs.forEach(d => memoryStore.documents.set(d._id, d));

  // Seed baseline actions
  const initialActions = [
    {
      id: 'act-1',
      title: 'Resolve Convocation Date Discrepancy',
      task: 'Issue official calendar lock resolving Oct 20 vs Oct 25 date mismatch',
      reason: 'Statutory compliance requires CFO and Ops alignment on single convocation date',
      source: 'Quarterly Financial Board Directive.pdf',
      priority: 'CRITICAL',
      deadline: 'Oct 14, 2026',
      recommendedNextStep: 'Schedule 15-minute reconciliation call between CFO and VP Operations',
      status: 'pending',
      createdAt: new Date()
    },
    {
      id: 'act-2',
      title: 'Obtain Missing Security Clearance Annexure C',
      task: 'Upload signed ISO-27001 Security Matrix for Project Falcon',
      reason: 'Production cloud deployment gate blocked pending regulatory clearance',
      source: 'Project Falcon Architecture Submission.pdf',
      priority: 'CRITICAL',
      deadline: 'Oct 15, 2026',
      recommendedNextStep: 'Request signature from Chief Security Architect',
      status: 'pending',
      createdAt: new Date()
    },
    {
      id: 'act-3',
      title: 'Submit Cloud Budget Supplemental Waiver',
      task: 'Draft variance waiver for $250,000 compute envelope overage',
      reason: 'Discretionary spending limit exceeded by 20.8%',
      source: 'Executive Operations Memo v2.docx',
      priority: 'HIGH',
      deadline: 'Oct 18, 2026',
      recommendedNextStep: 'Submit formal Form B-12 to Board Finance Committee',
      status: 'in_progress',
      createdAt: new Date()
    }
  ];

  initialActions.forEach(a => memoryStore.actions.set(a.id, a));

  // Seed baseline conflicts
  memoryStore.issues.set('conf-1', {
    id: 'conf-1',
    type: 'conflict',
    title: 'Board Meeting Review Date Discrepancy',
    severity: 'CRITICAL',
    status: 'Unresolved',
    sourceA: {
      doc: 'Quarterly Financial Board Directive.pdf',
      date: 'Oct 8, 2026 (03:00 EST)',
      val: 'October 20, 2026',
      isAuthoritative: true,
      freshness: 'Fresh (3h ago)',
      page: 3,
      section: 'Section 4.1: Review Milestones'
    },
    sourceB: {
      doc: 'Executive Operations Memo v2.docx',
      date: 'Oct 7, 2026 (14:20 EST)',
      val: 'October 25, 2026',
      isAuthoritative: false,
      freshness: 'Recent (1d ago)',
      page: 2,
      section: 'Paragraph 6: Operations Window'
    },
    delta: '+5 calendar days divergence',
    newerSource: 'Source A (Financial Board Directive)',
    authoritativeSource: 'Source A (Signed by CFO Secretariat)',
    whyItMatters: [
      'Reviewers in London and Singapore need 48h confirmed calendar lock for travel visas and flights.',
      'Regulatory reporting filing to national authorities is legally bound to occur within 7 days of review date.',
      'Operating teams risk scheduling conflicting audit work during the intervening week.'
    ],
    recommendedAction: 'Verify final deadline with CFO Secretariat before issuing stakeholder invitations.',
    resolutionPath: 'Set October 20 as authoritative date and notify VP Operations.',
    createdAt: new Date()
  });

  memoryStore.issues.set('conf-2', {
    id: 'conf-2',
    type: 'conflict',
    title: 'Cloud Infrastructure Budget Ceiling Variance',
    severity: 'HIGH',
    status: 'Unresolved',
    sourceA: {
      doc: 'Approved Annual Operating Plan',
      date: 'Sep 15, 2026',
      val: '$1,200,000',
      isAuthoritative: true,
      freshness: 'Aging (24d ago)',
      page: 8,
      section: 'Technology Cap Ex Envelope'
    },
    sourceB: {
      doc: 'Executive Operations Memo v2.docx',
      date: 'Oct 7, 2026',
      val: '$1,450,000',
      isAuthoritative: false,
      freshness: 'Recent (1d ago)',
      page: 2,
      section: 'Compute Envelope Allocation'
    },
    delta: '+$250,000 (+20.8% increase)',
    newerSource: 'Source B (Operations Memo v2)',
    authoritativeSource: 'Source A (Operating Plan approved by Board)',
    whyItMatters: [
      'Departmental discretionary spending cap is $50,000; a $250k delta exceeds authorization by 5x.',
      'Automated procurement purchase orders will be rejected by ERP controls without an approved variance waiver.'
    ],
    recommendedAction: 'Submit formal variance waiver form to Finance Committee before executing cloud reservations.',
    resolutionPath: 'Approve Supplemental Allocation form signed by VP Infrastructure.',
    createdAt: new Date()
  });

  // Seed baseline missing info
  memoryStore.issues.set('mis-1', {
    id: 'mis-1',
    type: 'missing',
    title: 'Project Falcon Security Clearance',
    targetDoc: 'Project Falcon Architecture Submission.pdf',
    missingField: 'Annexure C (Security Clearance Matrix)',
    impact: 'Regulatory clearance stalled without verified ISO-27001 certificate signatures.',
    status: 'open',
    createdAt: new Date()
  });

  // Seed baseline resolution history
  memoryStore.resolutionHistory.push({
    id: 'res-init-1',
    issueTitle: 'Duplicate Report Version Conflict',
    originalIssue: 'Project_Report_Final_v1.pdf vs Project_Report_Final_v2.pdf',
    source: 'Project_Report_Final_v2.pdf',
    evidence: 'Authoritative timestamp and approved budget appendix present in v2.',
    resolution: 'Archived v1 in favor of v2 with signed budget ceiling.',
    resolvedAt: 'Oct 08, 2026 - 16:30',
    resolutionSource: 'Automated Integrity Reconciliation'
  });
}

seedInitialData();

const isDBConnected = () => mongoose.connection.readyState === 1;

// Document Operations
async function createDocument(docData) {
  const docId = 'doc-' + Date.now();
  const fullDoc = {
    _id: docId,
    id: docId,
    ...docData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  memoryStore.documents.set(docId, fullDoc);

  if (isDBConnected()) {
    try {
      const created = await Document.create(docData);
      return created;
    } catch (err) {
      console.warn('[StoreService] Mongo Document.create fallback to memory:', err.message);
    }
  }

  return fullDoc;
}

async function updateDocument(id, updates) {
  const existing = memoryStore.documents.get(id);
  if (existing) {
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    memoryStore.documents.set(id, updated);
  }

  if (isDBConnected()) {
    try {
      return await Document.findByIdAndUpdate(id, updates, { new: true });
    } catch {}
  }

  return memoryStore.documents.get(id);
}

async function getDocumentById(id) {
  if (isDBConnected()) {
    try {
      const doc = await Document.findById(id);
      if (doc) return doc;
    } catch {}
  }
  return memoryStore.documents.get(id) || null;
}

async function getAllDocuments(userId) {
  let docs = [];
  if (isDBConnected()) {
    try {
      const query = userId ? { $or: [{ userId }, { userId: 'system' }] } : {};
      const found = await Document.find(query).sort({ createdAt: -1 });
      return found.map(d => ({
        ...d.toObject(),
        isDemo: d.userId === 'system'
      }));
    } catch {}
  }
  docs = Array.from(memoryStore.documents.values());
  if (userId) {
    docs = docs.filter(d => !d.userId || d.userId === 'system' || d.userId === userId);
  }
  return docs.map(d => ({
    ...d,
    isDemo: d.userId === 'system' || d.id?.startsWith('doc-') || !d.userId
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function deleteDocument(id) {
  memoryStore.documents.delete(id);
  if (isDBConnected()) {
    try {
      await Document.findByIdAndDelete(id);
    } catch {}
  }
  return { id };
}

// Issue / Conflict Operations
async function getConflicts() {
  const conflicts = [];
  for (const item of memoryStore.issues.values()) {
    if (item.type === 'conflict') conflicts.push(item);
  }
  return conflicts;
}

async function getMissingInfo() {
  const missing = [];
  for (const item of memoryStore.issues.values()) {
    if (item.type === 'missing') missing.push(item);
  }
  return missing;
}

async function resolveIssue(issueId, { chosenSource, resolutionNote, resolvedBy }) {
  const issue = memoryStore.issues.get(issueId);
  if (!issue) return null;

  issue.status = 'Resolved';
  issue.resolvedAt = new Date();
  issue.chosenSource = chosenSource;
  issue.resolutionNote = resolutionNote;

  const resolutionRecord = {
    id: 'res-' + Date.now(),
    issueId,
    issueTitle: issue.title,
    originalIssue: issue.sourceA ? `${issue.sourceA.doc} vs ${issue.sourceB.doc}` : issue.missingField,
    source: chosenSource || 'User Confirmation',
    evidence: resolutionNote || 'Reconciled via INFONEXIS Intelligence Center override.',
    resolution: `Resolved with authoritative source: ${chosenSource || 'Manual Override'}`,
    resolvedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    resolutionSource: resolvedBy || 'Manual User Override'
  };

  memoryStore.resolutionHistory.unshift(resolutionRecord);

  if (isDBConnected()) {
    try {
      await Issue.findByIdAndUpdate(issueId, {
        status: 'resolved',
        resolvedAt: new Date()
      });
    } catch (err) {
      console.warn('[StoreService] Mongo resolveIssue fallback:', err.message);
    }
  }

  return { issue, resolutionRecord };
}

async function getResolutionHistory() {
  return memoryStore.resolutionHistory;
}

// Action Operations
async function getActions(userId) {
  return Array.from(memoryStore.actions.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function createAction(actionData) {
  const id = 'act-' + Date.now();
  const action = { id, ...actionData, createdAt: new Date() };
  memoryStore.actions.set(id, action);
  return action;
}

async function updateAction(id, updates) {
  const action = memoryStore.actions.get(id);
  if (action) {
    Object.assign(action, updates);
    return action;
  }
  return null;
}

async function deleteAction(id, userId) {
  if (isDBConnected()) {
    try {
      const dbAction = await Action.findById(id);
      if (!dbAction) return { notFound: true };
      if (dbAction.userId && userId && dbAction.userId.toString() !== userId.toString()) {
        return { forbidden: true };
      }
      await Action.findByIdAndDelete(id);
      return { success: true };
    } catch (e) {
      // fallback to memory
    }
  }
  const action = memoryStore.actions.get(id);
  if (!action) return { notFound: true };
  if (action.userId && userId && action.userId !== userId && action.userId !== 'system') {
    return { forbidden: true };
  }
  memoryStore.actions.delete(id);
  return { success: true };
}

// Decision Cockpit Dynamic Builder
async function getDecisionCockpit() {
  const now = [];
  const next = [];
  const watch = [];
  const resolved = [];

  for (const issue of memoryStore.issues.values()) {
    const isResolved = issue.status?.toLowerCase() === 'resolved';
    const isCritical = issue.severity?.toLowerCase() === 'critical';
    const descText = Array.isArray(issue.whyItMatters) ? issue.whyItMatters[0] : (issue.whyItMatters || issue.impact || 'Requires immediate executive alignment.');

    if (isResolved) {
      resolved.push({
        id: 'cockpit-' + issue.id,
        title: issue.title,
        desc: `Resolved via ${issue.chosenSource || 'authoritative reconciliation'}.`,
        priority: 'RESOLVED',
        badge: 'RESOLVED',
        color: '#059669',
        source: issue.chosenSource || 'Reconciled'
      });
    } else if (isCritical) {
      now.push({
        id: 'cockpit-' + issue.id,
        title: issue.title,
        desc: descText,
        priority: 'CRITICAL',
        badge: 'NOW',
        color: '#DC2626',
        source: issue.sourceA?.doc || issue.targetDoc || 'Workspace Conduit',
        actionText: issue.resolutionPath || 'Resolve conflict in Intelligence Center',
        route: '/app/intelligence'
      });
    } else {
      next.push({
        id: 'cockpit-' + issue.id,
        title: issue.title,
        desc: descText,
        priority: 'HIGH',
        badge: 'NEXT',
        color: '#D97706',
        source: issue.sourceA?.doc || issue.targetDoc || 'Workspace Conduit',
        actionText: issue.resolutionPath || 'Review item',
        route: '/app/actions'
      });
    }
  }

  // Watch items
  watch.push({
    id: 'cockpit-watch-1',
    title: 'Waiting for Updated Infrastructure Audit',
    desc: 'Cloud migration SLA upgraded to 99.99%; awaiting regional failover test report.',
    priority: 'LOW',
    badge: 'WATCH',
    color: '#2563EB',
    source: 'SLA Addendum v3',
    actionText: 'Track SLA report release',
    route: '/app/information'
  });

  return { now, next, watch, resolved };
}

// Conversation Operations
async function getConversation(conversationId) {
  if (isDBConnected()) {
    try {
      return await Conversation.findById(conversationId);
    } catch {}
  }
  return memoryStore.conversations.get(conversationId) || null;
}

async function saveConversation(userId, conversationId, userMsg, aiMsg, language = 'en') {
  const convId = conversationId || 'conv-' + Date.now();
  let conv = memoryStore.conversations.get(convId);
  if (!conv) {
    conv = { _id: convId, id: convId, userId, messages: [], isActive: true };
    memoryStore.conversations.set(convId, conv);
  }
  conv.messages.push({ sender: 'user', text: userMsg, language, timestamp: new Date() });
  conv.messages.push({ sender: 'ai', text: aiMsg, language, timestamp: new Date() });
  if (conv.messages.length > 50) conv.messages = conv.messages.slice(-50);

  if (isDBConnected()) {
    try {
      let dbConv = null;
      if (conversationId) dbConv = await Conversation.findById(conversationId);
      if (!dbConv) {
        dbConv = await Conversation.create({ userId, messages: [], isActive: true });
      }
      dbConv.messages.push({ sender: 'user', text: userMsg, language });
      dbConv.messages.push({ sender: 'ai', text: aiMsg, language });
      if (dbConv.messages.length > 50) dbConv.messages = dbConv.messages.slice(-50);
      await dbConv.save();
      return dbConv;
    } catch (err) {
      console.warn('[StoreService] Mongo conversation save fallback to memory:', err.message);
    }
  }
  return conv;
}

async function getConversationsForUser(userId) {
  if (isDBConnected()) {
    try {
      return await Conversation.find({ userId, isActive: true }).sort({ updatedAt: -1 }).limit(10);
    } catch {}
  }
  return Array.from(memoryStore.conversations.values()).filter(c => c.userId === userId);
}

module.exports = {
  createDocument,
  updateDocument,
  getDocumentById,
  getAllDocuments,
  deleteDocument,
  getConflicts,
  getMissingInfo,
  resolveIssue,
  getResolutionHistory,
  getActions,
  createAction,
  updateAction,
  deleteAction,
  getDecisionCockpit,
  getConversation,
  saveConversation,
  getConversationsForUser,
  memoryStore
};
