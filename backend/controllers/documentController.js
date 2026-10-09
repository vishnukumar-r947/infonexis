const path = require('path');
const fs = require('fs');
const storeService = require('../services/storeService');
const { extractTextFromFile } = require('../services/documentService');
const { generateSummaryFromText } = require('../services/llmService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

async function uploadDocument(req, res) {
  try {
    if (!req.file) return errorResponse(res, 'No file provided', 400);

    const { originalname, filename, path: filePath, size } = req.file;
    const fileType = path.extname(originalname).toLowerCase().replace('.', '');

    const doc = await storeService.createDocument({
      userId: req.user?.id || 'demo_user',
      title: originalname,
      originalName: originalname,
      fileName: filename,
      fileType,
      filePath,
      fileSize: size,
      workspace: req.body?.workspace || 'college_projects',
      status: 'extracting',
      date: 'Just now',
      freshness: 'FRESH',
      freshnessNote: 'Ingested just now via Local Upload'
    });

    const docId = doc._id || doc.id;

    // Process document synchronously or fast-async
    // We run async so upload returns immediately with 202
    processDocumentPipeline(docId, filePath, fileType, originalname);

    return successResponse(res, {
      documentId: docId,
      id: docId,
      originalName: originalname,
      title: originalname,
      status: 'extracting',
      message: 'Document received. Multi-stage processing started.'
    }, 'Document upload started', 202);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function processDocumentPipeline(docId, filePath, fileType, originalName) {
  try {
    await storeService.updateDocument(docId, { status: 'extracting' });

    // Stage 1: Extract text (PDF parse / Tesseract OCR / Plain text)
    const extraction = await extractTextFromFile(filePath, fileType);
    const text = extraction.text || '';

    await storeService.updateDocument(docId, {
      status: 'understanding',
      extractedText: text,
      ocrUsed: extraction.ocrUsed || false,
      metadata: {
        pages: extraction.pages || 1,
        wordCount: text ? text.split(/\s+/).length : 0
      }
    });

    // Stage 2: Understand & generate summary
    await storeService.updateDocument(docId, { status: 'generating' });
    const summary = await generateSummaryFromText(text, originalName);

    // Stage 3: Complete intelligence synthesis
    const updatedFields = {
      status: 'complete',
      summary,
      executiveSummary: summary.executiveSummary,
      documentType: summary.documentType,
      keyInsight: summary.executiveSummary ? summary.executiveSummary.split('.')[0] + '.' : `Processed ${originalName}`,
      keyFacts: summary.keyFacts || [],
      extractedFacts: summary.extractedFacts || [],
      importantDetails: summary.importantDetails || [],
      issues: summary.issues || [],
      missingInformation: summary.missingInformation || [],
      recommendedAction: summary.recommendedActions?.[0] || 'Review synthesized findings in Intelligence Center.',
      recommendedActions: summary.recommendedActions || [],
      attentionScore: summary.attentionScore || 78,
      attentionScoreBreakdown: summary.attentionScoreBreakdown || [
        { label: 'Fresh Ingestion Verification', points: 25 },
        { label: 'Extracted Clauses & Entities', points: 20 },
        { label: 'Operational Impact Assessment', points: 15 }
      ],
      priority: summary.attentionScore >= 80 ? 'CRITICAL' : summary.attentionScore >= 60 ? 'HIGH' : 'MEDIUM',
      confidence: summary.confidence || 92,
      whyItMatters: summary.whyItMatters || [
        `Grounded ingestion of ${originalName} enables cross-comparison against existing baseline directives.`,
        'Ensures operational and schedule requirements are reconciled.'
      ],
      evidence: summary.evidence || {
        page: 1,
        section: 'Header Content Layer',
        quotedText: `Verified ingestion of ${originalName} into INFONEXIS platform.`
      },
      source: 'User Manual Upload',
      sourceAuthoritative: true
    };

    await storeService.updateDocument(docId, updatedFields);
    console.log(`[INFONEXIS Document Ingestion Complete]: ${originalName} (${docId})`);
  } catch (err) {
    console.error('[Doc Processing Pipeline Error]:', err.message);
    await storeService.updateDocument(docId, { status: 'error', error: err.message });
  }
}

async function getDocumentStatus(req, res) {
  try {
    const doc = await storeService.getDocumentById(req.params.id);
    if (!doc) return errorResponse(res, 'Document not found', 404);
    return successResponse(res, doc);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function getDocuments(req, res) {
  try {
    const docs = await storeService.getAllDocuments(req.user?.id);
    return successResponse(res, docs);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function deleteDocument(req, res) {
  try {
    const doc = await storeService.getDocumentById(req.params.id);
    if (!doc) return errorResponse(res, 'Document not found', 404);

    if (doc.filePath && fs.existsSync(doc.filePath)) {
      try { fs.unlinkSync(doc.filePath); } catch {}
    }

    await storeService.deleteDocument(req.params.id);
    return successResponse(res, { id: req.params.id }, 'Document deleted');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

module.exports = { uploadDocument, getDocumentStatus, getDocuments, deleteDocument };
