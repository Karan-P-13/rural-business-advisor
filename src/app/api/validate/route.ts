import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    valid: { type: SchemaType.BOOLEAN },
    reply: { type: SchemaType.STRING, description: "If not valid, provide a polite conversational response in the requested language asking them to clarify." }
  },
  required: ["valid", "reply"]
};

export async function POST(req: NextRequest) {
  try {
    const { step, input, language = 'English' } = await req.json();

    let context = "";
    if (step === "LOCATION") {
      context = "The user is being asked for their town, village, or district to start a local business.";
    } else if (step === "BUDGET") {
      context = "The user is being asked for their initial investment budget (amount of money) to start a business.";
    } else if (step === "SKILLS") {
      context = "The user is being asked about their skills, experience, or what they know how to do.";
    } else if (step === "INTEREST") {
      context = "The user is being asked what kind of business or sector they are interested in.";
    }

    const prompt = `You are an AI strictly validating user input for a business advisory interview.
Context: ${context}
User Input: "${input}"
Language: ${language}

Task: You must strictly determine if the user's input actually answers the question.
- If asked for a location, the input MUST contain a recognizable place name (e.g. "Chennai", "Delhi"). General greetings like "hi", "hello", or random letters like "asdf" are INVALID.
- If asked for a budget, the input MUST contain a monetary value or financial concept. "I have 500" is valid. "Yes" or "Apple" is INVALID.
- If asked for skills, it must describe a skill.
- If asked for interests, it must describe a sector or business type.

If the user's input DOES NOT contain the specific information requested by the Context, you MUST return valid: false.
If valid: false, write a short, polite 1-sentence reply in ${language} acknowledging their input if it was a greeting, but firmly asking them to provide the requested information to proceed.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
      generationConfig: { responseMimeType: "application/json", responseSchema }
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonStr = response.text();
    return NextResponse.json(JSON.parse(jsonStr));

  } catch (error) {
    console.error('Validation Error:', error);
    return NextResponse.json({ valid: true, reply: "" }); // Fail open so we don't block the user
  }
}
