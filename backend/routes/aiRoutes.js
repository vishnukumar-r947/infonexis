const express = require('express');
const router = express.Router();
const { handleAIChat, handleAudioSummary, handleTranslate, getConversationHistory } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, handleAIChat);
router.post('/audio-summary', protect, handleAudioSummary);
router.post('/translate', protect, handleTranslate);
router.get('/conversations', protect, getConversationHistory);

module.exports = router;
