const fs = require('fs');

function injectTranslations(file, regex, mergeCode) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { extraPrompts }')) {
    content = content.replace(/import React/, "import { extraPrompts } from '../lib/t';\nimport React");
    content = content.replace(regex, `$&\n${mergeCode}`);
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}

injectTranslations('src/components/BusinessDashboard.tsx', /const uiDict: Record<string, any> = {[\s\S]*?};\n/, `Object.keys(extraPrompts).forEach(lang => {\n  uiDict[lang] = extraPrompts[lang].dash;\n});\n`);
injectTranslations('src/components/FinancialDashboard.tsx', /const ui: Record<string, any> = {[\s\S]*?};\n/, `Object.keys(extraPrompts).forEach(lang => {\n  ui[lang] = extraPrompts[lang].fin;\n});\n`);
injectTranslations('src/components/RecommendationScreen.tsx', /const ui: Record<string, any> = {[\s\S]*?};\n/, `Object.keys(extraPrompts).forEach(lang => {\n  ui[lang] = extraPrompts[lang].rec;\n});\n`);
injectTranslations('src/components/SchemeAdvisor.tsx', /const ui: Record<string, any> = {[\s\S]*?};\n/, `Object.keys(extraPrompts).forEach(lang => {\n  ui[lang] = extraPrompts[lang].scheme;\n});\n`);
