const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Fix the language index parameter type for arrays
content = content.replace(/budgetOptions\[language\]/g, "(budgetOptions[language as keyof typeof budgetOptions] || budgetOptions.English)");
content = content.replace(/skillOptions\[language\]/g, "(skillOptions[language as keyof typeof skillOptions] || skillOptions.English)");
content = content.replace(/language=\{language\}/g, "language={language as 'English' | 'Hindi' | 'Tamil'}");
content = content.replace(/t\[language\]\.locating/g, "(t[language as keyof typeof t] || t.English).locating");
content = content.replace(/t\[language\]\.sendLocation/g, "(t[language as keyof typeof t] || t.English).sendLocation");

fs.writeFileSync('src/app/page.tsx', content);

let bizContent = fs.readFileSync('src/components/BusinessDashboard.tsx', 'utf8');
bizContent = bizContent.replace(/language\?\: 'English' \| 'Hindi' \| 'Tamil';/g, "language?: string;");
fs.writeFileSync('src/components/BusinessDashboard.tsx', bizContent);
