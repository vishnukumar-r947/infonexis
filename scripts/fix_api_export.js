const fs = require('fs');
let content = fs.readFileSync('D:/Mini Projects/infonexis-ai/frontend/src/services/api.js', 'utf8');
content += '\nexport const actionAPI = actionsAPI;\n';
fs.writeFileSync('D:/Mini Projects/infonexis-ai/frontend/src/services/api.js', content, 'utf8');
console.log('Added actionAPI export');
