# INFONEXIS — AI-Powered Information Intelligence Platform

<p align="center">
  <img src="./frontend/src/assets/logo/infonexis.png" alt="INFONEXIS Logo" width="160" />
</p>

<p align="center">
  <strong>Understand What Matters. Act with Confidence.</strong>
</p>

INFONEXIS is an AI-powered Information Intelligence Platform designed to transform scattered documents, reports, emails, and records into organized, explainable, and actionable insights.

It helps users find relevant information, understand important details, identify inconsistencies, track changes, and determine what requires attention.

---

## 1. Problem Statement

Organizations and individuals manage information across multiple documents, files, and communication channels. Finding important details manually can be time-consuming and may lead to missed deadlines, conflicting information, repeated work, and delayed decisions.

INFONEXIS aims to simplify this process through an integrated information understanding and intelligence workflow.

## 2. Our Solution

INFONEXIS follows an information intelligence workflow:

**Find → Understand → Organize → Compare → Prioritize → Act**

The platform is designed to help users:

* Discover relevant information quickly.
* Extract important facts, dates, and entities from documents.
* Generate document-specific AI summaries.
* Identify conflicting or missing information.
* Detect changes between information sources.
* Understand why an item matters and review supporting evidence.
* Organize tasks, deadlines, issues, and recommendations.
* Interact with an AI assistant using text and supported voice features.

## 3. Core Features

### Overview

* Attention Center and priority overview.
* Information health indicators.
* Important alerts and pending deadlines.
* Recent information changes.
* Recommended next actions.

### Information

* Document upload and information organization.
* AI-powered extraction and document-specific summaries.
* Smart search and information vault.
* Key facts, dates, entities, and recommendations.
* Summary export and AI audio summary, where supported.

### Intelligence

* Conflict and inconsistency detection.
* Missing information identification.
* Side-by-side document comparison.
* Change history and information timeline.
* Explainable AI insights and evidence references.
* Knowledge relationships and information health analysis.

### Actions

* Prioritized action items.
* Deadline tracking and task status.
* AI-assisted recommendations.
* Pending, In Progress, and Resolved workflows.

### Sources

* Local document uploads.
* Source integration management.
* Gmail and Google Drive integration support, subject to configuration and authorization.
* WhatsApp Business integration support as a future or configured capability.

### Settings

* Profile and role preferences.
* Account and session security.
* AI, language, voice, and document-processing preferences.
* Notifications, privacy, and data management.

## 4. Advanced Intelligence Capabilities

The platform is designed to support advanced information intelligence capabilities such as:

* **Information DNA:** A structured profile of an information item.
* **Evidence Trail:** Trace insights back to available source material.
* **Information Lineage:** Track information from its source through analysis and resolution.
* **Attention Scoring:** Prioritize information using urgency, deadlines, and detected issues.
* **Information Freshness:** Identify information that may be outdated.
* **Duplicate Detection:** Find potentially repeated documents or records.
* **Decision Cockpit:** Organize information into Now, Next, Watch, and Resolved.
* **Source-Cited AI Assistant:** Present supporting references when source evidence is available.
* **Privacy Center:** Help users understand and manage connected sources and stored data.

Availability of these capabilities depends on implementation, configuration, and connected services.

## 5. Technology Stack

| Layer               | Technology                                          |
| ------------------- | --------------------------------------------------- |
| Frontend            | React, Vite, JavaScript, CSS                        |
| Backend             | Node.js, Express.js                                 |
| Database            | MongoDB, Mongoose                                   |
| Authentication      | JWT-based authentication architecture               |
| AI                  | LLM API integration                                 |
| Document Processing | PDF.js / PDF parsing libraries                      |
| OCR                 | Tesseract.js                                        |
| Voice Input         | Browser Speech Recognition or supported STT service |
| Voice Output        | Text-to-Speech or supported TTS service             |
| API Communication   | REST APIs                                           |

The exact libraries and services used depend on the current implementation and environment configuration.

## 6. Application Architecture

```text
User
  |
  v
React Frontend
  |
  v
Express.js REST API
  |
  +--> Authentication and Authorization
  |
  +--> Document Processing and OCR
  |
  +--> AI Understanding and Extraction
  |
  +--> Intelligence and Action Services
  |
  +--> MongoDB Data Layer
```

External AI services, cloud sources, SMS providers, and speech services require their respective credentials, permissions, and configuration.

## 7. Project Structure

```text
infonexis-info/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── style.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── server.js
├── scripts/
├── infonexis.png
├── .gitignore
└── README.md
```

*Note: The actual folders and filenames may differ as the project evolves.*

## 8. Getting Started

### Prerequisites

Install the following:

* Node.js and npm.
* Git.
* MongoDB, if using a local database, or a configured MongoDB service.
* Required API credentials for enabled external services.

### Run the Frontend

Open a terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

### Run the Backend

Open a second terminal:

```powershell
cd backend
npm install
```

Configure the required environment variables, then run the server using the command defined in the backend `package.json`. If the project defines a start script, use:

```powershell
npm start
```

The API port and health-check URL depend on the backend configuration.

## 9. Environment Configuration

Store credentials in environment variables rather than hardcoding them in source files.

Typical configuration may include:

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
LLM_API_KEY=
```

Add other variables only when required by the implemented integrations.

**Security:** Never commit real API keys, passwords, JWT secrets, database credentials, or private tokens to GitHub. Keep environment files such as `.env` out of version control.

## 10. Authentication and Privacy

INFONEXIS is designed to support secure authentication, protected routes, authorized source connections, and controlled access to user information.

Production deployment should include:

* Secure session and token handling.
* Server-side input validation.
* Access control for protected APIs.
* Safe file-upload validation.
* Appropriate data-retention and deletion controls.
* Proper authorization for external integrations.

SMS OTP, OAuth, and external integrations must be configured with the appropriate providers before they can operate in production.

## 11. Development Roadmap

Potential development milestones include:

1. Complete the core application interface and navigation.
2. Validate login, OTP, and protected-route workflows.
3. Implement document upload and content extraction.
4. Connect the LLM API for document-specific analysis.
5. Implement evidence-backed conflict and missing-information detection.
6. Build action tracking, timelines, and intelligence dashboards.
7. Integrate supported voice, translation, and audio-summary features.
8. Configure database persistence and authorized external sources.
9. Test responsive layouts, security, reliability, and performance.

## 12. Project Goal

INFONEXIS aims to go beyond basic document summarization by connecting information understanding with evidence, prioritization, issue detection, and actionable workflows.

**Our vision:** Help people spend less time searching through information and more time making informed decisions.

---

**INFONEXIS — Understand What Matters. Act with Confidence.**
