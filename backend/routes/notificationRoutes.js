const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { successResponse } = require('../utils/responseHandler');

router.get('/', protect, async (req, res) => {
  // In production, fetch real notifications from DB
  const notifications = [
    { id: 1, title: 'Document Analyzed', message: 'Your uploaded document has been fully analyzed.', type: 'success', read: false, createdAt: new Date() },
    { id: 2, title: 'Intelligence Update', message: 'New conflicts detected in your information workspace.', type: 'warning', read: false, createdAt: new Date(Date.now() - 3600000) }
  ];
  return successResponse(res, notifications);
});

module.exports = router;
