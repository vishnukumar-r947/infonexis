# INFONEXIS — AI-Powered Information Intelligence Platform

<p align="center">
  <img src="./frontend/src/assets/logo/infonexis.png" alt="INFONEXIS Logo" width="160" />
</p>

INFONEXIS is an enterprise-grade AI-powered Information Intelligence Platform designed to transform scattered documents, emails, and data into clear, prioritized, explainable, and actionable intelligence.

---

## 1. Key Value Proposition & Problem Solved

Modern organizations suffer from fragmented documents, contradictory guidelines, buried deadlines, and missed requirements across memos, circulars, and contracts. INFONEXIS solves this by providing:

1. **Multi-Source Ingestion & Extraction**: Ingest PDFs (via `pdf-parse` / `PDF.js`), scanned circulars/images (via `Tesseract.js` OCR), Word documents, and cloud storage feeds.
2. **Dynamic, Document-Specific Analysis**: Synthesizes genuine executive summaries, extracted key facts, entity tables, and missing items grounded in actual content (no fixed generic canned outputs).
3. **Contradiction & Conflict Detection**: Identifies conflicting dates, numbers, and clauses between multiple documents with side-by-side comparative views and automated resolution options.
4. **Actionable Timeline & Next Steps**: Automatically maps insights into prioritized action items with deadlines and tracking workflows.
5. **AI Audio Summary**: Integrated Text-To-Speech (TTS) synthesizing actual summaries into playable and speed-adjustable audio briefings.
6. **Voice & Text Intelligence Assistant**: Dedicated conversational AI with live Speech-to-Text (STT), cross-lingual translation (English, Hindi, Tamil, Arabic, French), and source citations.
7. **3D Floating STAR Assistant (✦)**: Accessible throughout the app without cluttering mobile or desktop views.
8. **Graceful 3D Exit Experience**: Polished departure experience preserving active workspace state.

---

## 2. Technology Stack

- **Frontend**: React 19, Vite, Lucide Icons, Vanilla CSS Design System, Web Speech API (STT & TTS)
- **Backend**: Node.js, Express.js, JWT Authentication, Multer file upload
- **Extraction & OCR**: `pdf-parse` / `PDF.js` for PDFs, `Tesseract.js` for OCR scans
- **Database**: MongoDB with Mongoose, with automatic offline fallback layer
- **Internationalization (i18n)**: Scalable multi-language engine (EN, HI, TA, AR, FR)
- **Brand Identity**: Authentic INFONEXIS PNG logo (`D:\Mini Projects\infonexis.png`)

---

## 3. Application Architecture & Navigation

The platform groups all 27 capabilities into **SIX Primary Navigation Modules**:

1. **Overview**:
   - Attention Center
   - Information Health Circular Gauge (94% baseline)
   - Active Contradiction Alerts
   - Pending Deadlines & Recent Delta Changes
   - Personalized Priority Matrix
2. **Information**:
   - Multi-Source Drag-and-Drop Uploader
   - Multi-stage pipeline: *Uploading &rarr; Extracting &rarr; Scanning (OCR) &rarr; Understanding &rarr; Generating Summary &rarr; Complete*
   - Document-Specific Executive Summary, Key Facts, Issues, and Recommended Actions
   - Download Summary (Text, Markdown, JSON)
   - AI Audio Summary Playback (Play/Pause, 1x/1.25x/1.5x speed)
   - Information Vault Repository & Smart Search
3. **Intelligence**:
   - Side-by-side Conflict Detection (e.g., Oct 20 vs Oct 25 date mismatch)
   - Explainable AI Rationale ("What detected, Why it matters, Which source supports it")
   - Missing Information Detection with Impact Analysis
   - Chronological Delta Audit Log
   - Side-by-Side Document Comparison Tool
   - Interactive Knowledge Graph (SVG Canvas linking documents, owners, dates, and actions)
   - Automatic Issue Resolution toggles
4. **Actions**:
   - Prioritized Action Center (Task, Reason, Source, Deadline, Status)
   - Chronological Information Timeline
   - AI Recommendations Engine
   - 3-Column Attention Workflow (Pending, In Progress, Resolved)
5. **Sources**:
   - Integration Hub for Gmail, Google Drive, Local Vault, and WhatsApp Business API
   - Tokenized OAuth 2.0 status (Connected, Sync Now, Disconnect)
   - Zero-password storage security guarantee
6. **Settings**:
   - All 9 dedicated subsections:
     1. Profile
     2. Account & Security (JWT Sessions, 2FA OTP)
     3. AI Intelligence Preferences (Style, Length, Temperature)
     4. Voice & Audio (Input language, TTS Speech Rate)
     5. Document Processing Engine (OCR, PDF.js)
     6. Notifications
     7. Privacy & Data Lifecycle
     8. Storage Analytics
     9. Help & Interactive FAQ

---

## 4. Setup & Running Locally

### Backend Setup

```bash
cd "D:\Mini Projects\infonexis-ai\backend"
npm install
node server.js
```

Backend will listen on: `http://localhost:5000` (API Health: `http://localhost:5000/api/health`)

### Frontend Setup

```bash
cd "D:\Mini Projects\infonexis-ai\frontend"
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 5. User Journey & Authentication Flow

1. **Splash Screen (`/`)**: 5-second branded logo animation with cyan/blue glow and skip button.
2. **Login (`/login`)**: First Name, Phone Number, Password, Role selection &rarr; triggers SMS/dev OTP.
3. **OTP Verification (`/otp`)**: 6-digit verification code (`123456` in demo/dev mode).
4. **Introduction Screen (`/intro`)**: Value points explanation with "Connect & Continue" CTA.
5. **Authenticated Workspace (`/app/*`)**: Full dashboard with persistent desktop sidebar, fixed mobile bottom navigation, 3D floating assistant button (✦), and header controls.
6. **Exit / Logout (`ExitModal`)**: 3D typography modal (*"Keep Exploring. Keep Understanding. See you soon..."*).
