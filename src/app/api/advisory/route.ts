import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { calculateLoanMetrics } from '@/lib/loanEngine';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    recommendation: {
      type: SchemaType.OBJECT,
      properties: {
        businessName: { type: SchemaType.STRING },
        localDemandScore: {
          type: SchemaType.INTEGER,
          description: "Hyper-local market demand score 0–100. Consider competition density, population, disposable income, and existing supply in this exact district."
        },
        localDemandAssessment: {
          type: SchemaType.STRING,
          description: "2–3 sentence paragraph: current supply-demand situation for this business type in this specific district. Mention competition levels, consumer demand drivers, and market gap if any."
        },
        summary: {
          type: SchemaType.STRING,
          description: "3–4 sentence executive summary of the business opportunity for this specific location, budget, and skill profile."
        },
        opportunities: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "3–5 specific, actionable growth opportunities for this business in this district"
        },
        keyRisks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              risk: { type: SchemaType.STRING },
              mitigation: { type: SchemaType.STRING }
            },
            required: ["risk", "mitigation"]
          },
          description: "2–4 realistic risks with specific, actionable mitigations"
        },
      },
      required: ["businessName", "localDemandScore", "localDemandAssessment", "summary", "opportunities", "keyRisks"]
    },
    financials: {
      type: SchemaType.OBJECT,
      properties: {
        capexBreakdown: {
          type: SchemaType.ARRAY,
          description: "Itemized one-time capital expenditure. All amounts in INR. Total must fit within budget.",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              item: { type: SchemaType.STRING },
              amount: { type: SchemaType.INTEGER }
            },
            required: ["item", "amount"]
          }
        },
        opexBreakdown: {
          type: SchemaType.ARRAY,
          description: "Monthly operating expenses. Realistic for rural/semi-urban India.",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              item: { type: SchemaType.STRING },
              amount: { type: SchemaType.INTEGER }
            },
            required: ["item", "amount"]
          }
        },
        projectedRevenue: {
          type: SchemaType.INTEGER,
          description: "Conservative realistic monthly revenue in INR for month 1–3"
        },
        breakEvenMonths: {
          type: SchemaType.INTEGER,
          description: "Realistic number of months to break even given this budget and revenue"
        }
      },
      required: ["capexBreakdown", "opexBreakdown", "projectedRevenue", "breakEvenMonths"]
    }
  },
  required: ["recommendation", "financials"]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location, budget, skills, interest, language = 'English' } = body;

    if (!location || !budget || !skills || !interest) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericBudget = parseInt(budget.replace(/[^0-9]/g, ''), 10) || 50000;

    const systemPrompt = `You are a senior fintech underwriter and micro-business advisor specializing in rural Indian entrepreneurship.
Your job is to generate a hyper-localized, realistic business plan for the exact person described below.

STRICT RULES:
1. All CapEx + initial working capital MUST stay within the budget of ${budget} (INR ${numericBudget}).
2. Monthly OpEx and revenue projections MUST be realistic for rural/semi-urban India in this specific district — not metro averages.
3. The localDemandScore must reflect REAL competition density and demand in this district (not just generic).
4. The localDemandAssessment paragraph must mention real factors like nearby markets, competition, consumer habits.
5. ENTIRE response MUST be in ${language}. Do NOT mix languages.
6. Risk mitigations must be specific and actionable for this business type and location.

USER PROFILE:
- Location: ${location}
- Budget: ${budget}
- Skills / Background: ${skills}
- Business Interest: ${interest}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.65,
      }
    });

    // Retry up to 3 times on 503 overload errors (Gemini capacity spikes)
    let result;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await model.generateContent(systemPrompt);
        break; // success
      } catch (err: unknown) {
        const isOverloaded = err instanceof Error && err.message.includes('503');
        if (isOverloaded && attempt < 3) {
          await new Promise(r => setTimeout(r, attempt * 2000)); // 2s, 4s backoff
          continue;
        }
        throw err; // re-throw if not 503 or out of retries
      }
    }
    if (!result) throw new Error('Gemini API failed after 3 retries');
    const responseText = result.response.text();
    const aiData = JSON.parse(responseText);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalOpEx = aiData.financials.opexBreakdown.reduce((sum: number, item: any) => sum + item.amount, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalCapEx = aiData.financials.capexBreakdown.reduce((sum: number, item: any) => sum + item.amount, 0);

    // Strict multi-dimensional scheme eligibility engine
    const underwriting = calculateLoanMetrics(
      budget,
      location,
      aiData.financials.projectedRevenue,
      totalOpEx,
      skills,
      interest
    );

    const finalResponse = {
      plan: {
        ...aiData.recommendation,
        // Ensure eligibilityDetails are available for scheme matching audit
      },
      financials: {
        capexBreakdown: aiData.financials.capexBreakdown,
        opexBreakdown: aiData.financials.opexBreakdown,
        totalCapEx,
        totalOpEx,
        projectedRevenue: aiData.financials.projectedRevenue,
        breakEvenMonths: aiData.financials.breakEvenMonths,
        ...underwriting
      },
      schemes: underwriting.recommendedSchemes,
      eligibilityDetails: underwriting.eligibilityDetails,
    };

    return NextResponse.json(finalResponse);
  } catch (error: unknown) {
    console.error("Error in advisory API:", error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
