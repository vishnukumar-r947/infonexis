const express = require('express');
const router = express.Router();
const { login, verifyOTP, getProfile, updateSettings } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.get('/profile', protect, getProfile);
router.put('/settings', protect, updateSettings);

module.exports = router;
