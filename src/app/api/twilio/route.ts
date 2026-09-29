import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    // Twilio sends form data via POST
    const formData = await req.formData();
    const speechResult = formData.get('SpeechResult') as string || '';
    const callerId = formData.get('From') as string || 'Unknown';

    console.log(`[Twilio IVR] Call from: ${callerId} | Speech: ${speechResult}`);

    // Standard Twilio XML builder
    let responseText = "Welcome to Unnati Advisor. Please tell me your location and budget to get started.";

    // If the user actually spoke something, send it to Gemini for a voice-optimized response
    if (speechResult.trim().length > 0) {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
      const prompt = `You are a friendly, telephonic AI business advisor for rural India.
The caller just said: "${speechResult}"
Respond with a very brief, conversational, and helpful reply (maximum 3 sentences). Do not use markdown, emojis, or bullet points because this will be spoken aloud over a phone line. Keep it extremely natural.`;

      const result = await model.generateContent(prompt);
      responseText = result.response.text().replace(/\*/g, '').trim();
    }

    // Generate TwiML (Twilio Markup Language)
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="en-IN">${responseText}</Say>
    <Gather input="speech" action="/api/twilio" timeout="4" speechTimeout="auto">
        <Say voice="Polly.Aditi" language="en-IN">I am listening.</Say>
    </Gather>
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Twilio Error:', error);
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="en-IN">Sorry, our AI is experiencing a high volume of calls. Please try again later.</Say>
    <Hangup/>
</Response>`;
    return new NextResponse(errorTwiml, {
      status: 500,
      headers: { 'Content-Type': 'text/xml' }
    });
  }
}
