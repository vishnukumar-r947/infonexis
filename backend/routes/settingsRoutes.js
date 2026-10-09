const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { successResponse } = require('../utils/responseHandler');

router.get('/', protect, async (req, res) => {
  return successResponse(res, { userId: req.user.id, loaded: true });
});

module.exports = router;
