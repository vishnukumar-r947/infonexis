const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user','ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  language: { type: String, default: 'en' },
  isTranslated: { type: Boolean, default: false }
});

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  messages: [messageSchema],
  contextDocumentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
