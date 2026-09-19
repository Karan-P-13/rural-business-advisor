import re

with open("src/components/RecommendationScreen.tsx", "r") as f:
    content = f.read()

old_props = """export default function RecommendationScreen({ businessPlan }: { businessPlan: any }) {"""
new_props = """const ui = {
  English: { feas: "Feasibility & Demand", opp: "Growth Opportunities", risk: "Risk Mitigation Matrix", riskLbl: "Risk", mitLbl: "Mitigation" },
  Hindi: { feas: "व्यवहार्यता और मांग", opp: "विकास के अवसर", risk: "जोखिम न्यूनीकरण मैट्रिक्स", riskLbl: "जोखिम", mitLbl: "न्यूनीकरण" },
  Tamil: { feas: "சாத்தியம் & தேவை", opp: "வளர்ச்சி வாய்ப்புகள்", risk: "ஆபத்து தணிப்பு அணி", riskLbl: "ஆபத்து", mitLbl: "தணிப்பு" }
};

export default function RecommendationScreen({ businessPlan, language = 'English' }: { businessPlan: any, language?: 'English'|'Hindi'|'Tamil' }) {"""

content = content.replace(old_props, new_props)
content = content.replace(">Feasibility & Demand</h3>", ">{ui[language].feas}</h3>")
content = content.replace(">Growth Opportunities</h3>", ">{ui[language].opp}</h3>")
content = content.replace(">Risk Mitigation Matrix</h3>", ">{ui[language].risk}</h3>")
content = content.replace(">Risk:</span>", "> {ui[language].riskLbl}:</span>")
content = content.replace(">Mitigation:</span>", "> {ui[language].mitLbl}:</span>")

with open("src/components/RecommendationScreen.tsx", "w") as f:
    f.write(content)
