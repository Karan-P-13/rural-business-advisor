require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const languages = [
    "Bengali", "Telugu", "Marathi", "Urdu", 
    "Gujarati", "Malayalam", "Kannada", "Odia", "Punjabi", "Assamese", 
    "Maithili", "Sanskrit", "Sindhi", "Kashmiri", "Konkani", "Nepali", 
    "Manipuri", "Bodo", "Dogri", "Santali"
  ];

  const english_dict = {
    sendLocation: "Send My Current Location",
    locating: "Detecting location...",
    prevPlans: "Previous Plans",
    noPlans: "No saved plans yet.",
    skills: ['Agriculture & Farming', 'Handicrafts & Tailoring', 'Retail & Food', 'Electronics & Repair', 'Construction & Carpentry', 'Beauty & Wellness']
  };

  const prompt = `
Translate this exact JSON object into the following languages: ${languages.join(', ')}.
Output ONLY a valid JSON object where the top-level keys are the language names, and the values are the translated dictionaries.
JSON:
${JSON.stringify(english_dict, null, 2)}
`;

  console.log("Calling Gemini...");
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  fs.writeFileSync('src/lib/t2.ts', `// Auto-generated 20-language missing shell translations\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport const missingPrompts: Record<string, any> = ${text};\n`);
  console.log("Done!");
}

main().catch(console.error);
