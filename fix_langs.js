const fs = require('fs');

const files = [
  'src/app/page.tsx',
  'src/components/BusinessDashboard.tsx',
  'src/components/FinancialDashboard.tsx',
  'src/components/RecommendationScreen.tsx',
  'src/components/SchemeAdvisor.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace type Language = 'English' | 'Hindi' | 'Tamil'; with string
  content = content.replace(/type Language = 'English' \| 'Hindi' \| 'Tamil';/g, "type Language = string;");
  
  // Fix page.tsx specifically
  if (file === 'src/app/page.tsx') {
    content = content.replace(/<select\s+value=\{language\}\s+onChange=\{\(e\) => setLanguage\(e\.target\.value as Language\)\}[^>]*>[\s\S]*?<\/select>/, `<select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-sm font-medium text-[#14161C] outline-none cursor-pointer">
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Urdu">اردو (Urdu)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                <option value="Malayalam">മലയാളം (Malayalam)</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
                <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="Assamese">অসমীয়া (Assamese)</option>
                <option value="Maithili">मैथिली (Maithili)</option>
                <option value="Sanskrit">संस्कृतम् (Sanskrit)</option>
                <option value="Sindhi">سنڌي (Sindhi)</option>
                <option value="Kashmiri">کٲشُر (Kashmiri)</option>
                <option value="Konkani">कोंकणी (Konkani)</option>
                <option value="Nepali">नेपाली (Nepali)</option>
                <option value="Manipuri">মৈতৈলোন্ (Manipuri)</option>
                <option value="Bodo">बड़ो (Bodo)</option>
                <option value="Dogri">डोगरी (Dogri)</option>
                <option value="Santali">ᱥᱟᱱᱛᱟᱲᱤ (Santali)</option>
              </select>`);

    // Fix translation fallbacks in page.tsx
    content = content.replace(/t\[language\]\[msg\.msgKey as keyof typeof t\.English\]/g, "(t[language as keyof typeof t] || t.English)[msg.msgKey as keyof typeof t.English]");
    content = content.replace(/t\[language\]\.typeAnswer/g, "(t[language as keyof typeof t] || t.English).typeAnswer");
    content = content.replace(/t\[language\]\.error/g, "(t[language as keyof typeof t] || t.English).error");
    content = content.replace(/t\[language\]\.analyzingIdeas/g, "(t[language as keyof typeof t] || t.English).analyzingIdeas");
    content = content.replace(/t\[language\]\.completed/g, "(t[language as keyof typeof t] || t.English).completed");
    
    // Fix arrays
    content = content.replace(/BUDGET_OPTIONS\[language\]/g, "(BUDGET_OPTIONS[language as keyof typeof BUDGET_OPTIONS] || BUDGET_OPTIONS.English)");
    content = content.replace(/SKILL_OPTIONS\[language\]/g, "(SKILL_OPTIONS[language as keyof typeof SKILL_OPTIONS] || SKILL_OPTIONS.English)");
  }

  // Fix components
  if (file === 'src/components/BusinessDashboard.tsx') {
    content = content.replace(/uiDict\[language\]/g, "(uiDict[language as keyof typeof uiDict] || uiDict.English)");
  }
  if (file === 'src/components/FinancialDashboard.tsx') {
    content = content.replace(/const t = ui\[language\]/g, "const t = ui[language as keyof typeof ui] || ui.English");
  }
  if (file === 'src/components/RecommendationScreen.tsx') {
    content = content.replace(/const t = ui\[language\]/g, "const t = ui[language as keyof typeof ui] || ui.English");
  }
  if (file === 'src/components/SchemeAdvisor.tsx') {
    content = content.replace(/const t = ui\[language\]/g, "const t = ui[language as keyof typeof ui] || ui.English");
  }

  fs.writeFileSync(file, content);
}
