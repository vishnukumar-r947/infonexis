const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  filePath: { type: String },
  fileSize: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['uploading','extracting','scanning','understanding','generating','complete','error'],
    default: 'uploading'
  },
  extractedText: { type: String, default: '' },
  ocrUsed: { type: Boolean, default: false },
  summary: {
    executiveSummary: String,
    keyFacts: [String],
    importantDetails: [String],
    issues: [{ type: String, description: String, severity: String }],
    missingInformation: [String],
    recommendedActions: [String],
    documentType: String,
    confidence: Number
  },
  metadata: {
    pages: Number,
    wordCount: Number,
    language: String,
    documentDate: String,
    authors: [String],
    organizations: [String]
  },
  tags: [String],
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
