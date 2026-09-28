const fs = require('fs');
let content = fs.readFileSync('src/app/api/validate/route.ts', 'utf8');

const oldPrompt = `const prompt = \`You are an AI validating user input for a chatbot interview.
Context: \${context}
User Input: "\${input}"
Language: \${language}

Task: Determine if the user's input makes logical sense for the given context. 
For example, if asked for a budget, "500 rupees" is valid, but "apple" or "yes" is not. 
If asked for skills, "I know how to stitch" is valid, but "100" is not.
If it is completely nonsensical or unrelated, set valid: false. Otherwise, valid: true.
If valid: false, write a short, polite 1-sentence reply in \${language} asking them to provide the correct information.\`;`;

const newPrompt = `const prompt = \`You are an AI strictly validating user input for a business advisory interview.
Context: \${context}
User Input: "\${input}"
Language: \${language}

Task: You must strictly determine if the user's input actually answers the question.
- If asked for a location, the input MUST contain a recognizable place name (e.g. "Chennai", "Delhi"). General greetings like "hi", "hello", or random letters like "asdf" are INVALID.
- If asked for a budget, the input MUST contain a monetary value or financial concept. "I have 500" is valid. "Yes" or "Apple" is INVALID.
- If asked for skills, it must describe a skill.
- If asked for interests, it must describe a sector or business type.

If the user's input DOES NOT contain the specific information requested by the Context, you MUST return valid: false.
If valid: false, write a short, polite 1-sentence reply in \${language} acknowledging their input if it was a greeting, but firmly asking them to provide the requested information to proceed.\`;`;

content = content.replace(oldPrompt, newPrompt);
fs.writeFileSync('src/app/api/validate/route.ts', content);
