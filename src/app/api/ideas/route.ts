import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skills, budget, location, language } = body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 400 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-lite-latest',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "List of exactly 5 short business idea titles"
        },
        temperature: 0.7
      }
    });

    const prompt = `You are a micro-business expert in India. 
A user in ${location} has a budget of ${budget} and explicitly stated their skills as: "${skills}".
Analyze these specific skills and suggest 5 highly viable, profitable small business ideas they could start. 
The ideas MUST directly utilize their stated skills.
Output ONLY a JSON array of 5 strings (short titles, max 4 words each).
IMPORTANT: Translate the idea titles into the ${language} language.`;

    let result;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break; // success
      } catch (err: unknown) {
        const isOverloaded = err instanceof Error && err.message.includes('503');
        if (isOverloaded && attempt < 3) {
          await new Promise(r => setTimeout(r, attempt * 2000));
          continue;
        }
        throw err;
      }
    }
    if (!result) throw new Error('Gemini API failed after 3 retries');
    const ideas = JSON.parse(result.response.text());
    
    return NextResponse.json({ ideas });
  } catch (e) {
    console.error("Idea Generation Error:", e);
    return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 });
  }
}
