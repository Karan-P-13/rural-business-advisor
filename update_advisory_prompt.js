const fs = require('fs');
let content = fs.readFileSync('src/app/api/advisory/route.ts', 'utf8');

const regex = /const prompt = \`Generate a hyper-local business advisory report/g;

const newPromptLogic = `
    const regionalDictionaries: Record<string, string> = {
      Hindi: "Use culturally relevant rural Hindi terms (e.g., 'Kirana', 'Vyapar', 'Kisan', 'Mandi', 'Panchayat') to make the plan relatable.",
      Tamil: "Use culturally relevant rural Tamil terms (e.g., 'Vivasayam', 'Kada', 'Panchayat', 'Santhai', 'Viyabaram') to make the plan relatable.",
      English: "Focus on standard Indian rural terminology (e.g., 'Gram Panchayat', 'Mandi', 'SHGs - Self Help Groups') for relatability."
    };
    
    const languageTraining = regionalDictionaries[language] || regionalDictionaries.English;

    const prompt = \`Generate a hyper-local business advisory report`;

content = content.replace(regex, newPromptLogic);

// Also inject the training instructions into the prompt itself
const promptRegex = /The report must be entirely written in \$\{language\}\./;
content = content.replace(promptRegex, "The report must be entirely written in ${language}.\\n\\nLANGUAGE TRAINING CONTEXT:\\n${languageTraining}\\nIntegrate these concepts naturally into your advice.");

fs.writeFileSync('src/app/api/advisory/route.ts', content);
