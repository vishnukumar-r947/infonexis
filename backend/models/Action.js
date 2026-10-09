const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  title: { type: String, required: true },
  description: { type: String },
  reason: { type: String },
  source: { type: String },
  priority: { type: String, enum: ['critical','high','medium','low'], default: 'medium' },
  deadline: { type: Date },
  status: { type: String, enum: ['pending','in_progress','complete','dismissed'], default: 'pending' },
  relatedDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' }
}, { timestamps: true });

module.exports = mongoose.model('Action', actionSchema);
