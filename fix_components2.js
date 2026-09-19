const fs = require('fs');
function fix(file, dictName, key) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes(`Object.keys(extraPrompts)`)) {
    content = content.replace(new RegExp(`const ${dictName} = {[\\s\\S]*?};\\n`), `$&Object.keys(extraPrompts).forEach(lang => { ${dictName}[lang] = extraPrompts[lang].${key}; });\n`);
    // Need to cast to Record<string, any> so it doesn't throw TS error
    content = content.replace(`const ${dictName} = {`, `const ${dictName}: Record<string, any> = {`);
    fs.writeFileSync(file, content);
  }
}
fix('src/components/BusinessDashboard.tsx', 'uiDict', 'dash');
fix('src/components/FinancialDashboard.tsx', 'ui', 'fin');
fix('src/components/RecommendationScreen.tsx', 'ui', 'rec');
fix('src/components/SchemeAdvisor.tsx', 'ui', 'scheme');
