export const INITIAL_INTELLIGENCE = {
  // Information Health Metrics
  health: {
    overall: 78,
    completeness: 82,
    consistency: 71,
    freshness: 85,
    sourceCoverage: 74,
    unresolvedIssues: 4
  },

  // Today's Daily Intelligence Brief
  brief: {
    attentionCount: 3,
    changesCount: 2,
    conflictsCount: 1,
    actionsPending: 4,
    headline: "Quarterly Board Review deadline conflict (Oct 20 vs Oct 25) requires immediate reconciliation."
  },

  // Signature Decision Cockpit
  decisionCockpit: {
    now: [
      {
        id: "cockpit-now-1",
        title: "Contract Deadline Conflict",
        desc: "Directive mandates Oct 20 vs Operations Memo specifying Oct 25 (+5 days divergence).",
        priority: "CRITICAL",
        badge: "NOW",
        color: "#DC2626",
        source: "Board Directive vs Ops Memo",
        actionText: "Verify revised deadline with Project Owner",
        route: "/app/intelligence"
      },
      {
        id: "cockpit-now-2",
        title: "Missing Security Clearance Annexure",
        desc: "Project Falcon architecture lacks Annexure C ISO-27001 clearance table.",
        priority: "HIGH",
        badge: "NOW",
        color: "#DC2626",
        source: "Project Falcon Submission.pdf",
        actionText: "Request Annexure C from Systems Architect",
        route: "/app/intelligence"
      }
    ],
    next: [
      {
        id: "cockpit-next-1",
        title: "Review Internship Placement Agreement",
        desc: "Stipend clause updated to $1,800/mo; awaiting countersignature.",
        priority: "MEDIUM",
        badge: "NEXT",
        color: "#D97706",
        source: "Placement 2027 Portal",
        actionText: "Review addendum terms",
        route: "/app/actions"
      },
      {
        id: "cockpit-next-2",
        title: "Vendor Tax Identification Missing",
        desc: "Accounts Payable cannot process withholding tax without active GSTIN.",
        priority: "MEDIUM",
        badge: "NEXT",
        color: "#D97706",
        source: "Vendor Agreement Renewal",
        actionText: "Request vendor GSTIN certificate",
        route: "/app/actions"
      }
    ],
    watch: [
      {
        id: "cockpit-watch-1",
        title: "Waiting for Updated Infrastructure Audit",
        desc: "Cloud migration SLA upgraded to 99.99%; awaiting regional failover test report.",
        priority: "LOW",
        badge: "WATCH",
        color: "#2563EB",
        source: "SLA Addendum v3",
        actionText: "Track SLA report release",
        route: "/app/information"
      },
      {
        id: "cockpit-watch-2",
        title: "Upcoming Capstone Submission Window",
        desc: "College projects portal locks in 14 days; all milestone commits must be verified.",
        priority: "LOW",
        badge: "WATCH",
        color: "#2563EB",
        source: "College Projects Academic Board",
        actionText: "Inspect milestones",
        route: "/app/information"
      }
    ],
    resolved: [
      {
        id: "cockpit-res-1",
        title: "Duplicate Report Archived",
        desc: "Project_Report_Final_v1 archived in favor of authoritative v2 with approved budget.",
        priority: "RESOLVED",
        badge: "RESOLVED",
        color: "#059669",
        source: "Manual Vault Deduplication",
        actionText: "View Archive History",
        route: "/app/actions"
      },
      {
        id: "cockpit-res-2",
        title: "HACKNEXT Schedule Aligned",
        desc: "Hackathon round 2 evaluation time confirmed for 18:00 IST via official broadcast.",
        priority: "RESOLVED",
        badge: "RESOLVED",
        color: "#059669",
        source: "HACKNEXT'26 WhatsApp Business Feed",
        actionText: "View Resolution Record",
        route: "/app/actions"
      }
    ]
  },

  // Feature Upgrade #38: NEXT BEST ACTION (One single primary recommendation)
  nextBestAction: {
    title: "Verify the Final Submission Deadline",
    why: "Two authoritative sources contain different deadlines: Financial Directive specifies 20 Oct while Operations Memo cites 25 Oct.",
    impact: "Uncoordinated scheduling will delay regulatory compliance filing and travel bookings for 12 international reviewers.",
    priority: "HIGH",
    deadline: "Oct 15, 2026 (2 days left)",
    evidence: {
      docA: "Quarterly Financial Board Directive.pdf",
      pageA: 3,
      sectionA: "Section 4.1: Review Milestones",
      docB: "Executive Operations Memo v2.docx",
      pageB: 2,
      sectionB: "Paragraph 6: Operations Window"
    },
    primaryActionLabel: "Schedule Calendar Alignment Call",
    secondaryActions: ["Compare Sources Side-by-Side", "View Document Evidence", "Dismiss for 24h"]
  },

  // Feature Upgrade #1: Information Intelligence Cards
  documents: [
    {
      id: "doc-1",
      title: "Quarterly Financial Board Directive.pdf",
      workspace: "placement_2027",
      type: "PDF",
      size: "2.4 MB",
      date: "Oct 8, 2026",
      freshness: "FRESH", // FRESH, RECENT, AGING, STALE
      freshnessNote: "Ingested 3 hours ago via Authorized Vault",
      priority: "CRITICAL",
      confidence: 94,
      attentionScore: 87,
      attentionScoreBreakdown: [
        { label: "Approaching deadline (Oct 20)", points: 25 },
        { label: "Conflicting information with Ops Memo", points: 20 },
        { label: "Missing depreciation annexure", points: 18 },
        { label: "High-impact source (CFO Secretariat)", points: 14 },
        { label: "Recent update cycle", points: 10 }
      ],
      source: "Finance Operations / Board Secretariat",
      sourceAuthoritative: true,
      keyInsight: "Mandatory Q4 audit compliance deadline fixed for October 20, 2026 with $250k vendor threshold.",
      whyItMatters: [
        "Failure to submit audit materials by Oct 20 triggers non-compliance flags with European oversight authorities.",
        "Operational planning requires immediate lock of 12 department review schedules.",
        "Contains direct contradiction with Operations Memo regarding meeting date."
      ],
      issue: "Calendar divergence: Ops Memo specifies Oct 25 review window.",
      recommendedAction: "Convene alignment call between CFO and VP Operations to confirm final date.",
      evidence: {
        page: 3,
        section: "Section 4.1 - Schedule & Milestones",
        quotedText: "The preliminary board review shall formally convene on October 20, 2026. All departmental expenditure reconciliations exceeding $250,000 must be finalized 72 hours prior."
      },
      executiveSummary: "Official directive mandating Q4 audit preparation by October 20, 2026. Imposes strict controls on vendor contracts over $250,000 and requires sign-off from all divisional directors.",
      extractedFacts: [
        { key: "Review Date", value: "October 20, 2026" },
        { key: "Threshold", value: "$250,000 contract ceiling" },
        { key: "Authorizer", value: "Chief Financial Officer" },
        { key: "Variance Limit", value: "$5,000 reconciliation delta" }
      ],
      entities: [
        { name: "CFO Secretariat", type: "Department" },
        { name: "October 20, 2026", type: "Date" },
        { name: "Regional Business Units", type: "Organization" }
      ],
      audioScript: "Executive summary for Quarterly Financial Board Directive. Ingested 3 hours ago. The board mandates Q4 audit preparation by October 20, 2026, with strict vendor compliance checks. Please verify calendar alignment to resolve the schedule conflict with operations."
    },

    {
      id: "doc-2",
      title: "Executive Operations Memo v2.docx",
      workspace: "college_projects",
      type: "DOCX",
      size: "840 KB",
      date: "Oct 7, 2026",
      freshness: "RECENT",
      freshnessNote: "Ingested 1 day ago via Manual Upload Vault",
      priority: "HIGH",
      confidence: 89,
      attentionScore: 78,
      attentionScoreBreakdown: [
        { label: "Calendar discrepancy with Directive", points: 20 },
        { label: "Cloud budget delta exceeding threshold", points: 18 },
        { label: "Upcoming staffing deadline", points: 15 },
        { label: "High-impact source (VP Infrastructure)", points: 14 },
        { label: "Recent document sync", points: 11 }
      ],
      source: "VP Infrastructure & Operations",
      sourceAuthoritative: false,
      keyInsight: "Proposes review window on October 25, 2026; expands cloud budget to $1.45M (+250k variance).",
      whyItMatters: [
        "Proposes a date 5 days later than the CFO Directive, causing potential coordination failures.",
        "The $250,000 budget increase exceeds departmental discretionary authority without Finance Committee sign-off."
      ],
      issue: "Budget expansion variance and conflicting review date.",
      recommendedAction: "Request formal Supplemental Budget Allocation form and confirm whether Oct 25 was intended as a departmental prep session.",
      evidence: {
        page: 2,
        section: "Paragraph 6: Operations Timeline & Cloud Cap",
        quotedText: "The executive infrastructure review is scheduled for October 25, 2026. Revised compute requirements necessitate an updated cloud envelope of $1,450,000."
      },
      executiveSummary: "Operational guidance specifying October 25 as the review window, with updated allocations for infrastructure teams including 4 additional DevOps engineering hires and $1.45M cloud envelope.",
      extractedFacts: [
        { key: "Review Date", value: "October 25, 2026" },
        { key: "Cloud Envelope", value: "$1,450,000" },
        { key: "Headcount Addition", value: "+4 DevOps positions" },
        { key: "Lead Reviewer", value: "VP of Infrastructure" }
      ],
      entities: [
        { name: "Infrastructure Engineering", type: "Team" },
        { name: "October 25, 2026", type: "Date" },
        { name: "Cloud Services Cluster", type: "Asset" }
      ],
      audioScript: "Executive summary for Executive Operations Memo version 2. The document specifies October 25 for operational review and sets a cloud budget of 1.45 million dollars. Note that this date conflicts with the Board Directive of October 20."
    },

    {
      id: "doc-3",
      title: "Project Falcon Architecture Submission.pdf",
      workspace: "research",
      type: "PDF",
      size: "4.8 MB",
      date: "Oct 5, 2026",
      freshness: "RECENT",
      freshnessNote: "Ingested 3 days ago via Manual Upload",
      priority: "HIGH",
      confidence: 91,
      attentionScore: 76,
      attentionScoreBreakdown: [
        { label: "Missing mandatory ISO-27001 annexure", points: 25 },
        { label: "Defense compliance milestone approaching", points: 20 },
        { label: "Source reliability (Engineering Team)", points: 14 },
        { label: "Freshness within 7 days", points: 12 },
        { label: "Potential operational block", points: 5 }
      ],
      source: "Defense Systems Architecture Division",
      sourceAuthoritative: true,
      keyInsight: "Zero-trust edge architecture complete; lacks mandatory Annexure C ISO-27001 compliance matrix.",
      whyItMatters: [
        "Procurement and security audit cannot issue stage-gate clearance without Annexure C.",
        "Deployment cannot be provisioned on federal cloud without verified signature."
      ],
      issue: "Missing Information: Annexure C Security Clearance Table not found in file.",
      recommendedAction: "Request signed Annexure C from Lead Systems Architect prior to Thursday audit.",
      evidence: {
        page: 11,
        section: "Appendix Index",
        quotedText: "Annexure A: Network Topologies [Attached]. Annexure B: HSM Specifications [Attached]. Annexure C: ISO-27001 Clearance Matrix [File Reference: Missing]."
      },
      executiveSummary: "Comprehensive zero-trust architecture specification covering high-availability edge compute clusters, cryptographic key rotations, and failover topologies.",
      extractedFacts: [
        { key: "System Target", value: "Project Falcon Defense Cluster" },
        { key: "SLA Target", value: "99.99% Availability" },
        { key: "Missing Component", value: "Annexure C Compliance Table" }
      ],
      entities: [
        { name: "Defense Systems Division", type: "Department" },
        { name: "ISO-27001", type: "Standard" }
      ],
      audioScript: "Intelligence brief for Project Falcon Architecture Submission. The core architecture meets high-availability benchmarks, but mandatory Annexure C is absent. Prompt submission of Annexure C is required to clear procurement."
    },

    {
      id: "doc-4",
      title: "Project_Report_Final_v2.pdf",
      workspace: "hackathon",
      type: "PDF",
      size: "1.9 MB",
      date: "Oct 8, 2026",
      freshness: "FRESH",
      freshnessNote: "Ingested 6 hours ago via Hackathon Ingestion",
      priority: "MEDIUM",
      confidence: 96,
      attentionScore: 62,
      attentionScoreBreakdown: [
        { label: "Near-duplicate version detected (94% match)", points: 22 },
        { label: "Submission deadline update", points: 20 },
        { label: "Official hackathon submission", points: 12 },
        { label: "Fresh submission record", points: 8 }
      ],
      source: "Hackathon Engineering Team",
      sourceAuthoritative: true,
      keyInsight: "Supercedes v1; updates delivery roadmap and incorporates feedback on explainable AI.",
      whyItMatters: [
        "Keeps both versions synchronized to prevent team members submitting obsolete v1.",
        "Contains updated evaluation metric table for HackNext Series 2.0."
      ],
      issue: "Duplicate document detected with Project_Report_Final.pdf (94% textual similarity).",
      recommendedAction: "Archive v1 and mark v2 as authoritative project reference.",
      evidence: {
        page: 1,
        section: "Document Version Log",
        quotedText: "Version 2.0 incorporates revised AI transparency benchmarks and updates final demonstration video link."
      },
      executiveSummary: "Final HackNext hackathon submission dossier covering INFONEXIS system architecture, user journeys, performance metrics, and compliance with PS01 requirements.",
      extractedFacts: [
        { key: "Platform", value: "INFONEXIS 2.0" },
        { key: "Similarity Match", value: "94% with v1" },
        { key: "Primary Revision", value: "Added Decision Cockpit & Lineage" }
      ],
      entities: [
        { name: "HACKNEXT'26", type: "Competition" },
        { name: "PS01 Smart Automation", type: "Problem Statement" }
      ],
      audioScript: "Deduplication summary for Project Report Final version 2. This file is 94 percent identical to version 1 with updated deadline parameters. Recommended action is to archive version 1."
    }
  ],

  // Feature Upgrade #8: Contradiction Intelligence
  conflicts: [
    {
      id: "conf-1",
      title: "Board Meeting Review Date Discrepancy",
      severity: "CRITICAL",
      status: "Unresolved",
      sourceA: {
        doc: "Quarterly Financial Board Directive.pdf",
        date: "Oct 8, 2026 (03:00 EST)",
        val: "October 20, 2026",
        isAuthoritative: true,
        freshness: "Fresh (3h ago)",
        page: 3,
        section: "Section 4.1: Review Milestones"
      },
      sourceB: {
        doc: "Executive Operations Memo v2.docx",
        date: "Oct 7, 2026 (14:20 EST)",
        val: "October 25, 2026",
        isAuthoritative: false,
        freshness: "Recent (1d ago)",
        page: 2,
        section: "Paragraph 6: Operations Window"
      },
      delta: "+5 calendar days divergence",
      newerSource: "Source A (Financial Board Directive)",
      authoritativeSource: "Source A (Signed by CFO Secretariat)",
      whyItMatters: [
        "Reviewers in London and Singapore need 48h confirmed calendar lock for travel visas and flights.",
        "Regulatory reporting filing to national authorities is legally bound to occur within 7 days of review date.",
        "Operating teams risk scheduling conflicting audit work during the intervening week."
      ],
      recommendedAction: "Verify final deadline with CFO Secretariat before issuing stakeholder invitations.",
      resolutionPath: "Set October 20 as authoritative date and notify VP Operations."
    },
    {
      id: "conf-2",
      title: "Cloud Infrastructure Budget Ceiling",
      severity: "HIGH",
      status: "Unresolved",
      sourceA: {
        doc: "Approved Annual Operating Plan",
        date: "Sep 15, 2026",
        val: "$1,200,000",
        isAuthoritative: true,
        freshness: "Aging (24d ago)",
        page: 8,
        section: "Technology Cap Ex Envelope"
      },
      sourceB: {
        doc: "Executive Operations Memo v2.docx",
        date: "Oct 7, 2026",
        val: "$1,450,000",
        isAuthoritative: false,
        freshness: "Recent (1d ago)",
        page: 2,
        section: "Compute Envelope Allocation"
      },
      delta: "+$250,000 (+20.8% increase)",
      newerSource: "Source B (Operations Memo v2)",
      authoritativeSource: "Source A (Operating Plan approved by Board)",
      whyItMatters: [
        "Departmental discretionary spending cap is $50,000; a $250k delta exceeds authorization by 5x.",
        "Automated procurement purchase orders will be rejected by ERP controls without an approved variance waiver."
      ],
      recommendedAction: "Submit formal variance waiver form to Finance Committee before executing cloud reservations.",
      resolutionPath: "Approve Supplemental Allocation form signed by VP Infrastructure."
    }
  ],

  // Feature Upgrade #9: Missing Information Intelligence
  missingInfo: [
    {
      id: "mis-1",
      targetDoc: "Project Falcon Architecture Submission.pdf",
      expected: "Annexure C (ISO-27001 Security Clearance Matrix)",
      found: "Not Available (Index references file but attachment is omitted)",
      whyItMatters: "Federal regulatory clearance cannot proceed without verified ISO-27001 security clearance matrices. Procurement gate remains blocked.",
      suggestedNextStep: "Request signed Annexure C directly from Lead Systems Architect.",
      priority: "HIGH",
      status: "Pending Request"
    },
    {
      id: "mis-2",
      targetDoc: "Vendor Agreement Renewal 2026",
      expected: "Verified Tax Identification Number (GSTIN / VAT ID)",
      found: "Placeholder notation ('To be provided upon contract renewal')",
      whyItMatters: "Accounts Payable cannot disburse withholding tax credits without valid tax identification. Invoices will enter automated freeze.",
      suggestedNextStep: "Dispatch standardized Vendor Tax Onboarding Form to contractor.",
      priority: "MEDIUM",
      status: "Email Draft Ready"
    }
  ],

  // Feature Upgrade #10: Duplicate Document Intelligence
  duplicates: [
    {
      id: "dup-1",
      fileA: "Project_Report_Final.pdf",
      fileB: "Project_Report_Final_v2.pdf",
      similarity: "94%",
      difference: "v2 contains revised deadline (+5 days), updated demo video URL, and expanded Explainable AI section.",
      recommendation: "Keep newer v2 as active authoritative source and archive older v1.",
      actionsAvailable: ["Compare Diff", "Keep Newer (v2)", "Archive Older (v1)", "Keep Both"]
    }
  ],

  // Feature Upgrade #4: Information Lineage Model
  lineage: [
    { step: "SOURCE", detail: "Manual Upload / Google Drive Vault", timestamp: "Oct 8, 2026 - 11:20" },
    { step: "INGEST", detail: "PDF.js text layer + Tesseract.js OCR verification", timestamp: "Oct 8, 2026 - 11:21" },
    { step: "EXTRACT", detail: "Extracted Fact: Review Date = Oct 20, 2026", timestamp: "Oct 8, 2026 - 11:22" },
    { step: "COMPARE", detail: "Cross-referenced against Operations Memo (Oct 25, 2026)", timestamp: "Oct 8, 2026 - 11:22" },
    { step: "DETECT", detail: "Identified Contradiction: 5-Day Review Divergence", timestamp: "Oct 8, 2026 - 11:23" },
    { step: "PRIORITIZE", detail: "Assigned Attention Score 87 (Critical Priority)", timestamp: "Oct 8, 2026 - 11:23" },
    { step: "EXPLAIN", detail: "Generated 'Why This Matters' operational impact breakdown", timestamp: "Oct 8, 2026 - 11:23" },
    { step: "RECOMMEND", detail: "Next Best Action: Schedule Calendar Alignment Call", timestamp: "Oct 8, 2026 - 11:24" },
    { step: "ACTION", detail: "Task generated in Action Center with Oct 15 deadline", timestamp: "Oct 8, 2026 - 11:24" },
    { step: "RESOLUTION", detail: "Pending stakeholder sign-off", timestamp: "Active" }
  ],

  // Feature Upgrade #36: Timeline & Changes
  changes: [
    {
      id: "ch-1",
      item: "Project Falcon Target Uptime SLA",
      oldValue: "99.9%",
      newValue: "99.99%",
      change: "+0.09% availability (+7.9 hours less annual downtime)",
      impact: "Contractual penalty tier reduced by 40%; requires dual-region active failover.",
      source: "SLA Addendum v3",
      timestamp: "2 hours ago",
      importance: "High"
    },
    {
      id: "ch-2",
      item: "Engineering Headcount Allocation",
      oldValue: "14 positions",
      newValue: "18 positions (+4 DevOps)",
      change: "+4 engineers approved",
      impact: "Annualized compensation cost increase of $420,000.",
      source: "Executive Operations Memo",
      timestamp: "5 hours ago",
      importance: "Medium"
    },
    {
      id: "ch-3",
      item: "Primary Data Center Location",
      oldValue: "Frankfurt (eu-central-1)",
      newValue: "Zurich (ch-north-1)",
      change: "Jurisdiction relocation",
      impact: "Data residency compliance satisfied for Swiss banking partner.",
      source: "GDPR Compliance Addendum",
      timestamp: "1 day ago",
      importance: "High"
    }
  ],

  // Feature Upgrade #35: Knowledge Relationships
  relationships: {
    nodes: [
      { id: "n1", label: "Project Falcon", type: "Project", color: "#2563EB" },
      { id: "n2", label: "Financial Directive", type: "Document", color: "#06B6D4" },
      { id: "n3", label: "Operations Memo", type: "Document", color: "#06B6D4" },
      { id: "n4", label: "Dr. Aris Vance (CFO)", type: "Person", color: "#8B5CF6" },
      { id: "n5", label: "Elena Rostova (VP Ops)", type: "Person", color: "#8B5CF6" },
      { id: "n6", label: "Schedule Conflict (Oct 20 vs 25)", type: "Issue", color: "#DC2626" },
      { id: "n7", label: "Verify Final Deadline", type: "Action", color: "#059669" }
    ],
    links: [
      { source: "n2", target: "n6", relation: "Source A (Oct 20)" },
      { source: "n3", target: "n6", relation: "Source B (Oct 25)" },
      { source: "n4", target: "n2", relation: "Signed Directive" },
      { source: "n5", target: "n3", relation: "Authored Memo" },
      { source: "n6", target: "n7", relation: "Generates Action" },
      { source: "n1", target: "n2", relation: "Governed By" }
    ]
  },

  // Feature Upgrade #42 & #43: Action Center & Resolution Memory
  actions: [
    {
      id: "act-1",
      task: "Reconcile October Board Meeting Review Date",
      reason: "Conflicting dates detected between Financial Directive (Oct 20) and Operations Memo (Oct 25).",
      source: "Board Directive vs Ops Memo",
      priority: "CRITICAL",
      deadline: "Oct 15, 2026 (2 days left)",
      status: "Pending", // Pending, In Progress, Completed, Dismissed
      workspace: "placement_2027",
      relatedIssue: "conf-1",
      relatedDocument: "doc-1",
      resolutionMemory: null
    },
    {
      id: "act-2",
      task: "Request Annexure C Security Clearance Table",
      reason: "Missing mandatory ISO-27001 compliance matrix in Project Falcon architecture file.",
      source: "Falcon Architecture Doc",
      priority: "HIGH",
      deadline: "Oct 14, 2026 (1 day left)",
      status: "In Progress",
      workspace: "research",
      relatedIssue: "mis-1",
      relatedDocument: "doc-3",
      resolutionMemory: null
    },
    {
      id: "act-3",
      task: "Submit Supplemental Cloud Budget Authorization",
      reason: "Operations memo reflects $250k delta exceeding department discretionary limit.",
      source: "Operations Memo v2",
      priority: "MEDIUM",
      deadline: "Oct 18, 2026 (5 days left)",
      status: "Pending",
      workspace: "college_projects",
      relatedIssue: "conf-2",
      relatedDocument: "doc-2",
      resolutionMemory: null
    },
    {
      id: "act-4",
      task: "Verify Vendor GST/Tax Identification Certificate",
      reason: "Withholding tax deduction cannot be registered without verified tax ID.",
      source: "Vendor Agreement Renewal",
      priority: "MEDIUM",
      deadline: "Oct 20, 2026 (7 days left)",
      status: "Pending",
      workspace: "personal_docs",
      relatedIssue: "mis-2",
      relatedDocument: "doc-2",
      resolutionMemory: null
    }
  ],

  // Feature Upgrade #43: Resolution Memory History
  resolutionHistory: [
    {
      id: "res-hist-1",
      issueTitle: "Duplicate Submission File Discrepancy",
      originalIssue: "Project_Report_Final.pdf and Project_Report_Final_v2.pdf both queued in workspace with slight revisions.",
      source: "Hackathon Engineering Repository",
      evidence: "Textual diff 94% match. v2 contains latest HackNext problem statement responses.",
      resolution: "User confirmed v2 as authoritative project reference. Older v1 archived safely without data loss.",
      resolvedAt: "Oct 8, 2026 - 18:40",
      resolutionSource: "User Override (Manual Review)"
    },
    {
      id: "res-hist-2",
      issueTitle: "Missing Author Signature in Capstone Pitch",
      originalIssue: "College Capstone submission PDF lacked advisor digital signature certificate.",
      source: "College Projects Academic Board",
      evidence: "Verified via digital certificate validation utility.",
      resolution: "Faculty advisor countersigned via college portal OAuth identity token.",
      resolvedAt: "Oct 7, 2026 - 15:10",
      resolutionSource: "Automated Academic Portal Webhook"
    }
  ]
};
