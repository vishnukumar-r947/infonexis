export const APP_CONFIG = {
  NAME: 'INFONEXIS',
  TAGLINE: 'Understand What Matters.',
  POSITIONING: 'An AI-powered Information Intelligence Platform that transforms scattered information into prioritized, verified, explainable and actionable insights.',
  VERSION: '2.0.0',
  LOGO_PATH: '/src/assets/logo/infonexis.png',
  SPLASH_DURATION_MS: 5000,
  OTP_LENGTH: 6,
  DEV_MODE_OTP: '123456',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  STORAGE_KEYS: {
    AUTH_TOKEN: 'infonexis_token',
    USER: 'infonexis_user',
    ACTIVE_WORKSPACE: 'infonexis_active_workspace',
    SETTINGS: 'infonexis_settings',
    LANGUAGE: 'infonexis_language',
    DOCUMENTS: 'infonexis_docs',
    CONVERSATION: 'infonexis_conv',
    RESOLVED_ISSUES: 'infonexis_resolved_issues',
    USER_OVERRIDES: 'infonexis_user_overrides'
  }
};

export const WORKSPACES = [
  { id: 'placement_2027', name: 'Placement 2027', icon: 'Briefcase', desc: 'Recruitment circulars, interview requirements & company test notices' },
  { id: 'college_projects', name: 'College Projects', icon: 'FolderGit2', desc: 'Capstone architecture specs, lab schedules & team guidelines' },
  { id: 'research', name: 'Research', icon: 'GraduationCap', desc: 'Peer-reviewed papers, benchmark methodologies & citations' },
  { id: 'personal_docs', name: 'Personal Documents', icon: 'FileText', desc: 'Identity verifications, certificates & private records' },
  { id: 'hackathon', name: 'Hackathon', icon: 'Trophy', desc: 'HACKNEXT\u201926 problem statements, evaluation rubrics & submission specs' }
];

export const USER_ROLES = [
  { id: 'student', label: 'Student', focus: 'Deadlines, course requirements, placement alerts & learning documents', badge: 'Student' },
  { id: 'professor', label: 'Professor', focus: 'Curriculum revisions, academic publications, compliance notices', badge: 'Faculty' },
  { id: 'researcher', label: 'Researcher', focus: 'Paper findings, methodology conflicts, citation integrity', badge: 'Research' },
  { id: 'it_professional', label: 'IT Professional', focus: 'System architectures, SLA variations, security patches', badge: 'Engineering' },
  { id: 'employee', label: 'Employee', focus: 'HR directives, operational SOPs, organizational changes', badge: 'Corporate' },
  { id: 'business', label: 'Business', focus: 'Contract variance, financial ceilings, risk factors, executive actions', badge: 'Executive' },
  { id: 'health_professional', label: 'Health Professional', focus: 'Operational clinical protocols, equipment calibration records', badge: 'Healthcare' },
  { id: 'analyst', label: 'Analyst', focus: 'Cross-document contradictions, timeline lineage, audit verification', badge: 'Intelligence' },
  { id: 'general_user', label: 'General User', focus: 'General multi-source synthesis, prioritized summaries, actionable guidance', badge: 'User' }
];

export const PRIMARY_NAV = [
  { id: 'nav-overview', label: 'Overview', path: '/app/overview', icon: 'LayoutDashboard' },
  { id: 'nav-information', label: 'Information', path: '/app/information', icon: 'FileText' },
  { id: 'nav-intelligence', label: 'Intelligence', path: '/app/intelligence', icon: 'BrainCircuit' },
  { id: 'nav-actions', label: 'Actions', path: '/app/actions', icon: 'CheckSquare' },
  { id: 'nav-sources', label: 'Sources', path: '/app/sources', icon: 'Network' },
  { id: 'nav-settings', label: 'Settings', path: '/app/settings', icon: 'Settings' }
];

export const FRESHNESS_RULES = {
  FRESH: { id: 'fresh', label: 'Fresh', maxHours: 12, color: '#059669', desc: 'Updated within 12 hours' },
  RECENT: { id: 'recent', label: 'Recent', maxDays: 7, color: '#2563EB', desc: 'Updated within 7 days' },
  AGING: { id: 'aging', label: 'Aging', maxDays: 30, color: '#D97706', desc: 'Updated 7-30 days ago. Verification recommended.' },
  STALE: { id: 'stale', label: 'Stale', color: '#DC2626', desc: 'Updated over 30 days ago. Check for revisions.' }
};

export const ATTENTION_FACTORS = {
  DEADLINE_URGENCY: { label: 'Approaching Deadline', weight: 25 },
  CONTRADICTION: { label: 'Conflicting Information', weight: 20 },
  MISSING_DATA: { label: 'Missing Required Field', weight: 18 },
  SOURCE_RELIABILITY: { label: 'High-Impact Source', weight: 14 },
  FRESHNESS_DELTA: { label: 'Outdated Version Alert', weight: 13 },
  OPERATIONAL_IMPACT: { label: 'Operational Impact Detected', weight: 10 }
};

export const SOURCE_TRANSPARENCY = {
  'Google Drive': {
    canAccess: ['Documents explicitly selected by the user', 'Folder metadata within designated workspace'],
    cannotAccess: ['Personal photos, private folders, unshared team drives', 'Any document outside authorized scope']
  },
  'Gmail': {
    canAccess: ['Administrative threads, invoices and circulars matching authorized query', 'Official attachment PDFs/DOCX'],
    cannotAccess: ['Personal conversations, private contact lists, sent draft folders']
  },
  'Manual Upload': {
    canAccess: ['Files explicitly selected and uploaded by user session', 'Embedded text and OCR layer extracted client-side/in-memory'],
    cannotAccess: ['Local filesystem files, peripheral directories, background files']
  },
  'WhatsApp Business API': {
    canAccess: ['Official corporate/enterprise broadcast messages received via registered webhook'],
    cannotAccess: ['Personal chat history, end-to-end encrypted peer-to-peer chats, phone storage']
  }
};
