import os
import json
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash") # Use flash for speed

languages = [
    "English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", 
    "Gujarati", "Malayalam", "Kannada", "Odia", "Punjabi", "Assamese", 
    "Maithili", "Sanskrit", "Sindhi", "Kashmiri", "Konkani", "Nepali", 
    "Manipuri", "Bodo", "Dogri", "Santali"
]

english_dict = {
    "page": {
        "loc": "Welcome to BusiDvice. I am your AI business advisor.\n\nTo begin, please share your city or district so I can analyze hyper-local market opportunities for you.",
        "budget": "Excellent. What is your estimated total capital for starting this business? (e.g., ₹10,000, ₹50,000, ₹1,00,000)",
        "skills": "Perfect. What are your primary skills, trades, or background experiences? (e.g., Farming, Tailoring, Electronics Repair)",
        "interest": "Understood. Finally, what specific type of business or sector are you most interested in exploring?",
        "completed": "Generating your personalized business plan...",
        "error": "Something went wrong. Please try again.",
        "analyzingIdeas": "Analyzing your skills with AI...",
        "typeAnswer": "Type your answer or use a quick option above...",
        "newChat": "New"
    },
    "dash": {
        "title": "Project Appraisal Memo",
        "sub": "Auto-generated via BusiDvice Fintech Advisor",
        "btn": "Export PDF",
        "tab1": "Business Plan",
        "tab2": "Financial Model",
        "tab3": "Eligible Schemes"
    },
    "rec": {
        "feas": "Feasibility & Demand Analysis",
        "opp": "Growth Opportunities",
        "risk": "Risk Mitigation Matrix",
        "mitLbl": "Mitigation",
        "score": "Hyper-Local Market Viability Score",
        "demandLbl": "Local Market Assessment",
        "low": "Low Demand",
        "high": "High Demand",
        "readAloud": "Read Aloud"
    },
    "scheme": {
        "title": "Eligible Government Schemes",
        "sub": "Based on your business type, location, and project cost — you qualify for these schemes.",
        "noSchemes": "No schemes currently matched your profile. Consider increasing your budget or exploring a different business sector.",
        "central": "Central Govt",
        "state": "State Scheme",
        "free": "Collateral Free",
        "max": "Max Loan",
        "subPct": "Subsidy / Rate",
        "elig": "Eligibility Criteria",
        "doc": "Documents Required",
        "btn": "Apply on Official Portal",
        "whyMatch": "Why You Matched",
        "costMatch": "Cost within limit",
        "locMatch": "Location eligible",
        "sectorMatch": "Sector covered"
    },
    "fin": {
        "title": "Financial Viability Dashboard",
        "sub": "Interactive stress-test and capital requirements.",
        "capex": "Capital Expenditure (One-time)",
        "opex": "Operating Expenses (Monthly)",
        "rev": "Projected Monthly Revenue",
        "slider": "Revenue Stress Test",
        "sliderSub": "Adjust to see how the business survives if sales drop.",
        "warn": "Warning: High Risk",
        "warnSub": "Projected revenue does not cover operating expenses. Consider reducing monthly costs or exploring a different model.",
        "net": "Net Monthly Profit",
        "margin": "Profit Margin",
        "be": "Break-Even Point",
        "beSub": "Months to recover initial investment",
        "totalCap": "Total Initial Investment",
        "metrics": "Key Financial Metrics",
        "dscr": "Est. DSCR (Debt Service)",
        "cap": "Total CapEx Required",
        "eq": "Min. User Equity (10%)",
        "months": "months"
    }
}

prompt = f"""
Translate the following JSON object into the following languages: {', '.join(languages)}.
Keep the EXACT same JSON keys. Output ONLY a valid JSON object where the top-level keys are the language names (e.g. "Hindi", "Bengali") and the values are the translated dictionary.
Do NOT use markdown code blocks like ```json. Just raw JSON text.

JSON to translate:
{json.dumps(english_dict, indent=2)}
"""

print("Generating translations...")
response = model.generate_content(prompt)
output = response.text.strip()
if output.startswith("```json"):
    output = output[7:-3]
if output.startswith("```"):
    output = output[3:-3]

with open("src/lib/i18n.ts", "w") as f:
    f.write("export const translations: Record<string, any> = ")
    f.write(output)
    f.write(";")

print("Generated src/lib/i18n.ts")
