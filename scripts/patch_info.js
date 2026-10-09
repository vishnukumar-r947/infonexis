const fs = require('fs');
let content = fs.readFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/InformationPage.jsx', 'utf8');

const startIdx = content.indexOf('const downloadSummary =');
const endIdx = content.indexOf('const filteredDocs =');

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `const downloadSummary = (format) => {
    if (!activeAnalysis) return;
    let textContent = '';
    let ext = 'txt';
    if (format === 'json') {
      textContent = JSON.stringify(activeAnalysis, null, 2);
      ext = 'json';
    } else {
      const lines = [
        'INFONEXIS EXECUTIVE SUMMARY',
        'Document: ' + activeAnalysis.name,
        'Type: ' + activeAnalysis.category,
        'Date: ' + activeAnalysis.date,
        '',
        'EXECUTIVE SUMMARY:',
        activeAnalysis.summary,
        '',
        'KEY FACTS:',
        ...activeAnalysis.keyFacts.map((f, i) => (i + 1) + '. ' + f),
        '',
        'IMPORTANT DETAILS:',
        ...activeAnalysis.importantDetails.map((d) => '* ' + d),
        '',
        'ISSUES:',
        ...(activeAnalysis.issues.length ? activeAnalysis.issues : ['None']),
        '',
        'MISSING:',
        ...(activeAnalysis.missing.length ? activeAnalysis.missing : ['None']),
        '',
        'ACTIONS:',
        ...activeAnalysis.actions.map((a) => '-> ' + a)
      ];
      textContent = lines.join('\\n');
      ext = 'txt';
    }
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'INFONEXIS_' + activeAnalysis.name.replace(/\\.[^/.]+$/, '') + '.' + ext;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  `;
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/InformationPage.jsx', content, 'utf8');
  console.log('Successfully patched downloadSummary');
} else {
  console.log('Markers not found', { startIdx, endIdx });
}
