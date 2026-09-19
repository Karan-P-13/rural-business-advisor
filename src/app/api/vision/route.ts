import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { imageBase64, language } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "Missing GEMINI_API_KEY in environment variables." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.split(';')[0].split(':')[1];

    const prompt = `You are an expert banking advisor helping a rural entrepreneur. The user has uploaded an image of a document to check if it's valid for their business loan application. 
    Briefly tell them what document it is (e.g. Aadhaar, PAN, Income Certificate) and whether it looks valid or if it's the wrong type of document. 
    Keep it strictly to 2 short sentences.
    Reply exclusively in ${language}.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);

    const text = result.response.text();
    return NextResponse.json({ success: true, message: text });

  } catch (error) {
    console.error("Vision API Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to process document' }, { status: 500 });
  }
}
