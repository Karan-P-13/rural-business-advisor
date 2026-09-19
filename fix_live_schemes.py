import re

with open("src/app/api/advisory/route.ts", "r") as f:
    content = f.read()

# 1. Update the Schema to include liveSchemes
old_schema = """      required: ["businessName", "localDemandScore", "summary", "opportunities", "keyRisks"]
    },
    financials: {"""

new_schema = """      required: ["businessName", "localDemandScore", "summary", "opportunities", "keyRisks"]
    },
    liveSchemes: {
      type: SchemaType.ARRAY,
      description: "Search your knowledge for 2 highly relevant real-world government subsidy or loan schemes available in the user's specific state/district for this exact business type. Do not use generic ones if local ones exist.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          details: { type: SchemaType.STRING, description: "Brief description of the subsidy or max loan amount" },
          url: { type: SchemaType.STRING, description: "Official website or portal URL if known" }
        },
        required: ["name", "details"]
      }
    },
    financials: {"""

content = content.replace(old_schema, new_schema)

old_schema_req = """  required: ["recommendation", "financials"]"""
new_schema_req = """  required: ["recommendation", "financials", "liveSchemes"]"""
content = content.replace(old_schema_req, new_schema_req)

# 2. Update System Prompt to enforce Live Market Data
old_rules = """RULES:
1. Ensure the business is highly hyper-localized to their specific district/location.
2. The financials MUST be realistic for rural/tier-3 India. CapEx + Initial OpEx should generally align with their total budget of ${budget}.
3. The response MUST be generated in ${language}. Translate the entire output.
4. For risks, provide actionable mitigations."""

new_rules = """RULES:
1. Think like a live economic advisor. Ensure the business plan and costs are highly hyper-localized to current real-world market scenarios in their specific district.
2. The financials MUST reflect current realistic prices in India. CapEx + Initial OpEx should strictly align with their total budget of ${budget}.
3. You MUST provide at least 2 real-world government schemes (State or Central) that are active right now and directly applicable to their business type and location.
4. The response MUST be generated in ${language}. Translate the entire output.
5. For risks, provide actionable mitigations."""

content = content.replace(old_rules, new_rules)

# 3. Merge liveSchemes with deterministic schemes
old_final = """      schemes: underwriting.recommendedSchemes
    };"""

new_final = """      schemes: [
        ...underwriting.recommendedSchemes,
        // Map the AI's live schemes into our deterministic format
        ...(aiData.liveSchemes || []).map((ls: any) => ({
          id: 'ai-live-scheme-' + Math.random(),
          name: ls.name + ' ✨ (Live AI Match)',
          level: 'State',
          maxLoan: numericBudget * 2, 
          subsidyPercentage: ls.details,
          collateralFree: true,
          eligibility: ['Based on your specific business profile'],
          documents: ['Project Report', 'Identity Proof'],
          officialUrl: ls.url || '#'
        }))
      ]
    };"""

content = content.replace(old_final, new_final)

with open("src/app/api/advisory/route.ts", "w") as f:
    f.write(content)
