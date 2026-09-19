const fs = require('fs');

const langMapCode = `const langMap: Record<string, string> = { English: 'en-IN', Hindi: 'hi-IN', Bengali: 'bn-IN', Telugu: 'te-IN', Marathi: 'mr-IN', Tamil: 'ta-IN', Urdu: 'ur-IN', Gujarati: 'gu-IN', Malayalam: 'ml-IN', Kannada: 'kn-IN', Odia: 'or-IN', Punjabi: 'pa-IN', Assamese: 'as-IN', Maithili: 'mai-IN', Sanskrit: 'sa-IN', Sindhi: 'sd-IN', Kashmiri: 'ks-IN', Konkani: 'kok-IN', Nepali: 'ne-IN', Manipuri: 'mni-IN', Bodo: 'brx-IN', Dogri: 'doi-IN', Santali: 'sat-IN' };`;

const voiceLogicCode = `
    const targetLang = langMap[language] || 'en-IN';
    utterance.lang = targetLang;
    const voices = window.speechSynthesis.getVoices();
    const prefix = targetLang.split('-')[0];
    const voice = voices.find(v => v.lang === targetLang || v.lang.startsWith(prefix));
    if (voice) {
      utterance.voice = voice;
    }
`;

function fixFile(file, regexToReplace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(regexToReplace, langMapCode + voiceLogicCode);
  fs.writeFileSync(file, content);
}

// page.tsx
fixFile('src/app/page.tsx', /const langMap: Record<string, string> = \{ Hindi: 'hi-IN'[\s\S]*?utterance\.lang = langMap\[language\] \|\| 'en-IN';/);

// RecommendationScreen.tsx
fixFile('src/components/RecommendationScreen.tsx', /utterance\.lang =[\s\S]*?language === 'Hindi'\s*\?\s*'hi-IN'\s*:\s*language === 'Tamil'\s*\?\s*'ta-IN'\s*:\s*'en-IN';/);

// SchemeAdvisor.tsx
fixFile('src/components/SchemeAdvisor.tsx', /const langMap: Record<string, string> = \{ Hindi: 'hi-IN'[\s\S]*?utterance\.lang = langMap\[language\] \|\| 'en-IN';/);

console.log("Fixed TTS voice selection logic.");
