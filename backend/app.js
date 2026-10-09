const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const intelligenceRoutes = require('./routes/intelligenceRoutes');
const actionRoutes = require('./routes/actionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const sourceRoutes = require('./routes/sourceRoutes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'INFONEXIS-AI Backend Intelligence API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    features: ['JWT Auth','OCR','PDF Extract','LLM Chat','TTS','STT','Translation','Intelligence']
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sources', sourceRoutes);

app.use(errorHandler);

module.exports = app;
