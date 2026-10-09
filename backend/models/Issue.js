const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, enum: ['conflict','missing','change','priority','warning'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  severity: { type: String, enum: ['critical','high','medium','low'], default: 'medium' },
  status: { type: String, enum: ['open','resolved','dismissed'], default: 'open' },
  sources: [{
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    documentName: String,
    excerpt: String,
    value: String
  }],
  resolvedAt: { type: Date },
  autoResolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
