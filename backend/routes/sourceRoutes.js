const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { successResponse } = require('../utils/responseHandler');

router.get('/', protect, async (req, res) => {
  const sources = [
    { id: 'manual_upload', name: 'Manual Upload', status: 'connected', type: 'local' },
    { id: 'gmail', name: 'Gmail', status: 'not_connected', type: 'oauth' },
    { id: 'google_drive', name: 'Google Drive', status: 'not_connected', type: 'oauth' },
    { id: 'whatsapp_business', name: 'WhatsApp Business', status: 'coming_soon', type: 'api' }
  ];
  return successResponse(res, sources);
});

module.exports = router;
