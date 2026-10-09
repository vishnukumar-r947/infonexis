const fs = require('fs');
let code = fs.readFileSync('D:/Mini Projects/infonexis-ai/backend/controllers/intelligenceController.js', 'utf8');
code = code.replace(
  'module.exports = { detectConflicts, detectMissingInfo, getOverview };',
  'module.exports = { detectConflicts, detectMissingInfo, getOverview, getIntelligenceOverview: getOverview };'
);
fs.writeFileSync('D:/Mini Projects/infonexis-ai/backend/controllers/intelligenceController.js', code, 'utf8');
console.log('Fixed intelligenceController exports');
