require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` INFONEXIS-AI Backend Server listening on port ${PORT}`);
    console.log(` API: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}).catch((err) => {
  console.error('[INFONEXIS Server Startup Failed]:', err.message);
  process.exit(1);
});
