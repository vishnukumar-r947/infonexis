const express = require('express');
const router = express.Router();
const {
  detectConflicts,
  detectMissingInfo,
  getIntelligenceOverview,
  compareDocuments,
  resolveIssue,
  getResolutionHistory,
  getDecisionCockpit,
  getNextBestAction,
  getChanges
} = require('../controllers/intelligenceController');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, getIntelligenceOverview);
router.get('/conflicts', protect, detectConflicts);
router.post('/conflicts', protect, detectConflicts);
router.get('/missing-info', protect, detectMissingInfo);
router.post('/compare', protect, compareDocuments);
router.post('/resolve', protect, resolveIssue);
router.get('/resolution-history', protect, getResolutionHistory);
router.get('/cockpit', protect, getDecisionCockpit);
router.get('/next-best-action', protect, getNextBestAction);
router.get('/changes', protect, getChanges);

module.exports = router;
