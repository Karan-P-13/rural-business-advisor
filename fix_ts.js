const fs = require('fs');

const file = 'src/components/FinancialDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace all ui[language] with (ui[language as keyof typeof ui] || ui.English)
content = content.replace(/ui\[language\]/g, "(ui[language as keyof typeof ui] || ui.English)");

// Replace all tips[language] with (tips[language as keyof typeof tips] || tips.English)
content = content.replace(/tips\[language\]/g, "(tips[language as keyof typeof tips] || tips.English)");

fs.writeFileSync(file, content);

const pageFile = 'src/app/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Also fix ui[language] inside RecommendationScreen or others if needed
const recFile = 'src/components/RecommendationScreen.tsx';
let recContent = fs.readFileSync(recFile, 'utf8');
recContent = recContent.replace(/ui\[language\]/g, "(ui[language as keyof typeof ui] || ui.English)");
fs.writeFileSync(recFile, recContent);

