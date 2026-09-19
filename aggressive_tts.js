const fs = require('fs');

const aggressiveLogic = `
    const targetLang = langMap[language] || 'en-IN';
    utterance.lang = targetLang;
    const voices = window.speechSynthesis.getVoices();
    const prefix = targetLang.split('-')[0].toLowerCase();
    const langName = language.toLowerCase();
    
    // Aggressive matching: Match exact BCP-47 tag, prefix, or the actual english name of the language (e.g. "Google Marathi")
    const voice = voices.find(v => {
      const vLang = v.lang.replace('_', '-').toLowerCase();
      const vName = v.name.toLowerCase();
      return vLang === targetLang.toLowerCase() || vLang.startsWith(prefix) || vName.includes(langName) || vName.includes(prefix);
    });
    
    if (voice) {
      utterance.voice = voice;
    } else {
      // Fallback: If no regional voice exists, try to find a generic Indian English voice so it at least has an Indian accent
      const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
      if (indianVoice) utterance.voice = indianVoice;
    }
`;

function fixAggressive(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const voices = window\.speechSynthesis\.getVoices\(\);[\s\S]*?if \(voice\) \{\s*utterance\.voice = voice;\s*\}/, aggressiveLogic.trim());
  fs.writeFileSync(file, content);
}

fixAggressive('src/app/page.tsx');
fixAggressive('src/components/RecommendationScreen.tsx');
fixAggressive('src/components/SchemeAdvisor.tsx');

console.log("Applied aggressive voice matching.");
