const express = require('express');
const router = express.Router();
const { uploadDocument, getDocumentStatus, getDocuments, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getDocuments);
router.get('/:id/status', protect, getDocumentStatus);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
