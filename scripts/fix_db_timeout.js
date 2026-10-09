const fs = require('fs');
const dbCode = `const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/infonexis_ai';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('[MongoDB] Connected to:', uri);
  } catch (err) {
    console.warn('[MongoDB] Connection failed. Running in offline mode:', err.message);
  }
};

module.exports = connectDB;
`;
fs.writeFileSync('D:/Mini Projects/infonexis-ai/backend/config/db.js', dbCode, 'utf8');
console.log('Fixed db.js timeout to 2s');
