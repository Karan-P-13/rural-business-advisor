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
      loc: "Welcome to BusiDvice. I am your AI business advisor.\n\nTo begin, please share your city or district so I can analyze hyper-local market opportunities for you.",
      budget: "Excellent. What is your estimated total capital for starting this business? (e.g., ₹10,000, ₹50,000, ₹1,00,000)",
      skills: "Perfect. What are your primary skills, trades, or background experiences? (e.g., Farming, Tailoring, Electronics Repair)",
      interest: "Understood. Finally, what specific type of business or sector are you most interested in exploring?",
      completed: "Generating your personalized business plan...",
      error: "Something went wrong. Please try again.",
      analyzingIdeas: "Analyzing your skills with AI...",
      typeAnswer: "Type your answer or use a quick option above...",
      newChat: "New"
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
  
  fs.writeFileSync('src/lib/t.ts', `// Auto-generated 20-language prompt translations\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport const extraPrompts: Record<string, any> = ${text};\n`);
  console.log("Done!");
}

main().catch(console.error);
