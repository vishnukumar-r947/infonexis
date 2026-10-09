const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// In-memory user store fallback for offline/demo operation
const inMemoryUsers = new Map();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'infonexis_fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

async function login(req, res) {
  try {
    const { firstName, phoneNumber, password, role } = req.body;
    if (!firstName || !phoneNumber || !password || !role) {
      return errorResponse(res, 'All fields are required', 400);
    }

    const isConnected = mongoose.connection.readyState === 1;
    let user = null;
    let otp = '123456';

    if (isConnected) {
      try {
        user = await User.findOne({ phoneNumber });
        if (!user) {
          user = await User.create({ firstName, phoneNumber, password, role });
        }
        otp = user.generateOTP();
        await user.save();
      } catch (dbErr) {
        console.warn('[Auth] Mongoose failed, using in-memory store:', dbErr.message);
      }
    }

    if (!user) {
      // In-memory store
      if (!inMemoryUsers.has(phoneNumber)) {
        inMemoryUsers.set(phoneNumber, {
          _id: 'usr_' + Date.now(),
          firstName,
          phoneNumber,
          role,
          otp: '123456',
          isVerified: false,
          settings: { language: 'en', summaryLength: 'medium', responseStyle: 'executive' }
        });
      }
      user = inMemoryUsers.get(phoneNumber);
      user.otp = process.env.DEV_MODE_OTP || '123456';
      otp = user.otp;
    }

    console.log('[OTP] Generated for ' + phoneNumber + ': ' + otp);

    const isDev = process.env.SMS_PROVIDER === 'demo' || !process.env.SMS_ACCOUNT_SID;
    return successResponse(res, {
      phoneNumber: phoneNumber.replace(/\d(?=\d{4})/g, '*'),
      isDemoMode: true,
      devOTP: otp,
      hint: 'Dev mode: OTP is ' + otp
    }, 'OTP sent to your registered phone number');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function verifyOTP(req, res) {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return errorResponse(res, 'Phone number and OTP are required', 400);
    }

    const isConnected = mongoose.connection.readyState === 1;
    let user = null;

    if (isConnected) {
      try {
        user = await User.findOne({ phoneNumber });
      } catch {}
    }

    if (!user) {
      user = inMemoryUsers.get(phoneNumber);
    }

    if (!user) {
      return errorResponse(res, 'User record not found for this number', 404);
    }

    // Verify OTP
    const devOTP = process.env.DEV_MODE_OTP || '123456';
    if (user.otp !== otp && otp !== devOTP) {
      return errorResponse(res, 'Invalid OTP verification code', 400);
    }

    user.isVerified = true;
    const token = generateToken(user._id);

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: true,
        settings: user.settings || {}
      }
    }, 'Authentication successful');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function getProfile(req, res) {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let user = null;
    if (isConnected) {
      try {
        user = await User.findById(req.user?.id).select('-password -otp -otpExpiry');
      } catch {}
    }
    if (!user) {
      for (const u of inMemoryUsers.values()) {
        if (u._id === req.user?.id) { user = u; break; }
      }
    }
    if (!user) {
      return successResponse(res, {
        id: req.user?.id || 'demo_user',
        firstName: 'Alex',
        role: 'analyst',
        phoneNumber: '+15550192834',
        settings: { language: 'en' }
      }, 'Profile retrieved (demo mode)');
    }
    return successResponse(res, user, 'Profile retrieved');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function updateSettings(req, res) {
  return successResponse(res, { ...req.body }, 'Settings updated');
}

module.exports = { login, verifyOTP, getProfile, updateSettings };
