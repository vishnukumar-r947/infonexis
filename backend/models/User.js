const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['student','professor','researcher','it_professional','employee','business','health_professional','analyst','general_user'],
    default: 'general_user'
  },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  settings: {
    language: { type: String, default: 'en' },
    summaryLength: { type: String, default: 'medium' },
    responseStyle: { type: String, default: 'professional' },
    ttsEnabled: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true }
  },
  storageUsed: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateOTP = function() {
  const devOTP = process.env.DEV_MODE_OTP || '123456';
  const otp = process.env.SMS_PROVIDER === 'demo' ? devOTP : Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  return otp;
};

module.exports = mongoose.model('User', userSchema);
