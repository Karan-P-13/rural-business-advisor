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

    const prompt = `You are an AI validating user input for a chatbot interview.
Context: ${context}
User Input: "${input}"
Language: ${language}

Task: Determine if the user's input makes logical sense for the given context. 
For example, if asked for a budget, "500 rupees" is valid, but "apple" or "yes" is not. 
If asked for skills, "I know how to stitch" is valid, but "100" is not.
If it is completely nonsensical or unrelated, set valid: false. Otherwise, valid: true.
If valid: false, write a short, polite 1-sentence reply in ${language} asking them to provide the correct information.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
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
