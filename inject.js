const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');
const injection = `
Object.keys(missingPrompts).forEach(lang => {
  skillOptions[lang] = missingPrompts[lang].skills;
  if(t[lang]) {
    t[lang].sendLocation = missingPrompts[lang].sendLocation;
    t[lang].locating = missingPrompts[lang].locating;
    t[lang].prevPlans = missingPrompts[lang].prevPlans;
    t[lang].noPlans = missingPrompts[lang].noPlans;
  }
});
`;
content = content.replace(/const skillOptions = {[\s\S]*?};/, `const skillOptions: Record<string, string[]> = {
  English: ["Agriculture & Farming", "Handicrafts & Tailoring", "Retail & Food", "Electronics & Repair", "Construction & Carpentry", "Beauty & Wellness"],
  Hindi: ["कृषि और खेती", "हस्तशिल्प और सिलाई", "खुदरा और भोजन", "इलेक्ट्रॉनिक्स और मरम्मत", "निर्माण और बढ़ईगीरी", "सौंदर्य और कल्याण"],
  Tamil: ["விவசாயம்", "கைவினை மற்றும் தையல்", "சில்லறை மற்றும் உணவு", "மின்னணு மற்றும் பழுதுபார்ப்பு", "கட்டுமானம் மற்றும் தச்சு", "அழகு மற்றும் ஆரோக்கியம்"]
};\n${injection}`);
fs.writeFileSync('src/app/page.tsx', content);
