const fs = require('fs');
let file = fs.readFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/InformationPage.jsx', 'utf8');

const oldBlock = `      content = "INFONEXIS EXECUTIVE SUMMARY
Document: " + activeAnalysis.name + "
Type: " + activeAnalysis.category + "
Date: " + activeAnalysis.date + "

EXECUTIVE SUMMARY:
" + activeAnalysis.summary + "

KEY FACTS:
" + activeAnalysis.keyFacts.map((f, i) => (i + 1) + ". " + f).join("\n") + "

IMPORTANT DETAILS:
" + activeAnalysis.importantDetails.map((d) => "* " + d).join("\n") + "

ISSUES:
" + (activeAnalysis.issues.join("\n") || "None") + "

MISSING:
" + (activeAnalysis.missing.join("\n") || "None") + "

ACTIONS:
" + activeAnalysis.actions.map((a) => "-> " + a).join("\n");`;

const newBlock = `      const lines = [
        "INFONEXIS EXECUTIVE SUMMARY",
        "Document: " + activeAnalysis.name,
        "Type: " + activeAnalysis.category,
        "Date: " + activeAnalysis.date,
        "",
        "EXECUTIVE SUMMARY:",
        activeAnalysis.summary,
        "",
        "KEY FACTS:",
        ...activeAnalysis.keyFacts.map((f, i) => (i + 1) + ". " + f),
        "",
        "IMPORTANT DETAILS:",
        ...activeAnalysis.importantDetails.map((d) => "* " + d),
        "",
        "ISSUES:",
        ...(activeAnalysis.issues.length ? activeAnalysis.issues : ["None"]),
        "",
        "MISSING:",
        ...(activeAnalysis.missing.length ? activeAnalysis.missing : ["None"]),
        "",
        "ACTIONS:",
        ...activeAnalysis.actions.map((a) => "-> " + a)
      ];
      content = lines.join("\n");`;

file = file.replace(/content = "INFONEXIS EXECUTIVE SUMMARY[\s\S]*?activeAnalysis\.actions\.map\(\(a\) => "-> " \+ a\)\.join\("\\n"\);/, newBlock);
fs.writeFileSync('D:/Mini Projects/infonexis-ai/frontend/src/pages/InformationPage.jsx', file, 'utf8');
console.log('Fixed InformationPage.jsx string literal');
